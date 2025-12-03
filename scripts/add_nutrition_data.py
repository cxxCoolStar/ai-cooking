"""
使用 AI 分析菜谱并添加营养数据（卡路里、烹饪时间等）到 Neo4j
"""

import os
import sys
import logging
from typing import Dict, Optional, List
from dotenv import load_dotenv
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 加载环境变量
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class NutritionDataEnhancer:
    """使用 AI 分析菜谱并添加营养数据"""
    
    def __init__(self):
        """初始化连接和 AI 模型"""
        # Neo4j 连接
        self.neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        self.neo4j_user = os.getenv("NEO4J_USER", "neo4j")
        self.neo4j_password = os.getenv("NEO4J_PASSWORD")
        
        self.driver = GraphDatabase.driver(
            self.neo4j_uri,
            auth=(self.neo4j_user, self.neo4j_password)
        )
        
        # LLM
        self.llm = ChatOpenAI(
            model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
            temperature=0.1  # 低温度保证一致性
        )
        
        logger.info("初始化完成")
    
    def get_all_recipes(self, limit: Optional[int] = None) -> List[Dict]:
        """
        获取所有菜谱
        
        Args:
            limit: 限制数量（用于测试）
        """
        query = """
        MATCH (r:Recipe)
        WHERE r.nodeId >= '200000000'
        WITH r
        OPTIONAL MATCH (r)-[:REQUIRES]->(i:Ingredient)
        WITH r, collect(i.name) as ingredients
        OPTIONAL MATCH (r)-[:CONTAINS_STEP]->(s:CookingStep)
        WITH r, ingredients, collect(s.description) as steps
        RETURN r.nodeId as nodeId, 
               r.name as name,
               r.description as description,
               r.prepTime as prepTime,
               r.cookTime as cookTime,
               r.calories as currentCalories,
               r.servings as servings,
               ingredients,
               steps
        ORDER BY r.nodeId
        """
        
        if limit:
            query += f" LIMIT {limit}"
        
        with self.driver.session() as session:
            result = session.run(query)
            recipes = [dict(record) for record in result]
        
        logger.info(f"获取了 {len(recipes)} 个菜谱")
        return recipes
    
    def analyze_recipe_nutrition(self, recipe: Dict) -> Dict:
        """
        使用 AI 分析菜谱的营养信息
        
        Returns:
            包含 calories, cooking_time_minutes, difficulty_level 等信息
        """
        # 构建提示词
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", """你是一位专业的营养师和烹饪专家。
请根据菜谱信息，估算以下数据（以 JSON 格式返回）：
1. calories: 整道菜的总卡路里（整数）
2. cooking_time_minutes: 实际烹饪时间（分钟，整数）
3. prep_time_minutes: 准备时间（分钟，整数）
4. servings: 建议份数（整数，如果已有则保持）
5. difficulty_level: 难度等级（1-5，整数）

返回格式：
{{"calories": 450, "cooking_time_minutes": 25, "prep_time_minutes": 15, "servings": 2, "difficulty_level": 3}}

注意：
- 基于食材估算卡路里（考虑常见用量）
- 如果已有某些数据，优先保留原值
- 卡路里按整道菜计算，不是单份
"""),
            ("user", """菜谱名称: {name}
描述: {description}
食材: {ingredients}
步骤: {steps}
当前准备时间: {prep_time}
当前烹饪时间: {cook_time}
当前份数: {servings}

请分析并返回 JSON 数据。""")
        ])
        
        # 构建输入
        ingredients_str = ", ".join(recipe.get('ingredients', [])) if recipe.get('ingredients') else "未知"
        steps_str = " ".join(recipe.get('steps', [])[:3]) if recipe.get('steps') else "未知"  # 只取前3步
        
        # 调用 LLM
        try:
            chain = prompt_template | self.llm
            response = chain.invoke({
                "name": recipe.get('name', ''),
                "description": recipe.get('description', ''),
                "ingredients": ingredients_str,
                "steps": steps_str,
                "prep_time": recipe.get('prepTime', '未知'),
                "cook_time": recipe.get('cookTime', '未知'),
                "servings": recipe.get('servings', '未知')
            })
            
            # 解析 JSON
            import json
            nutrition_data = json.loads(response.content)
            
            logger.info(f"分析完成: {recipe['name']} - {nutrition_data}")
            return nutrition_data
            
        except Exception as e:
            logger.error(f"分析失败 {recipe['name']}: {e}")
            # 返回默认值
            return {
                "calories": None,
                "cooking_time_minutes": None,
                "prep_time_minutes": None,
                "servings": None,
                "difficulty_level": None
            }
    
    def update_recipe_nutrition(self, node_id: str, nutrition_data: Dict):
        """
        更新菜谱的营养数据到 Neo4j
        """
        query = """
        MATCH (r:Recipe {nodeId: $nodeId})
        SET r.calories = $calories,
            r.cookingTimeMinutes = $cooking_time,
            r.prepTimeMinutes = $prep_time,
            r.servings = COALESCE($servings, r.servings),
            r.difficulty = COALESCE($difficulty, r.difficulty),
            r.nutritionDataUpdated = datetime()
        RETURN r.name as name
        """
        
        with self.driver.session() as session:
            result = session.run(query, 
                nodeId=node_id,
                calories=nutrition_data.get('calories'),
                cooking_time=nutrition_data.get('cooking_time_minutes'),
                prep_time=nutrition_data.get('prep_time_minutes'),
                servings=nutrition_data.get('servings'),
                difficulty=nutrition_data.get('difficulty_level')
            )
            record = result.single()
            if record:
                logger.info(f"✅ 更新成功: {record['name']}")
    
    def process_all_recipes(self, limit: Optional[int] = None, skip_existing: bool = True):
        """
        处理所有菜谱
        
        Args:
            limit: 限制处理数量（用于测试）
            skip_existing: 跳过已有卡路里数据的菜谱
        """
        recipes = self.get_all_recipes(limit)
        
        total = len(recipes)
        processed = 0
        skipped = 0
        
        for i, recipe in enumerate(recipes, 1):
            logger.info(f"\n{'='*60}")
            logger.info(f"进度: {i}/{total} - {recipe['name']}")
            
            # 跳过已有数据
            if skip_existing and recipe.get('currentCalories') is not None:
                logger.info(f"⏭️  跳过（已有卡路里数据）")
                skipped += 1
                continue
            
            # 分析
            nutrition_data = self.analyze_recipe_nutrition(recipe)
            
            # 更新
            if nutrition_data.get('calories') is not None:
                self.update_recipe_nutrition(recipe['nodeId'], nutrition_data)
                processed += 1
            else:
                logger.warning(f"⚠️  分析失败，跳过更新")
        
        logger.info(f"\n{'='*60}")
        logger.info(f"处理完成！")
        logger.info(f"总计: {total}, 处理: {processed}, 跳过: {skipped}")
    
    def close(self):
        """关闭连接"""
        if self.driver:
            self.driver.close()
            logger.info("连接已关闭")


def main():
    """主函数"""
    import argparse
    
    parser = argparse.ArgumentParser(description="为菜谱添加营养数据")
    parser.add_argument("--limit", type=int, help="限制处理数量（用于测试）")
    parser.add_argument("--force", action="store_true", help="强制更新所有菜谱（包括已有数据的）")
    
    args = parser.parse_args()
    
    enhancer = NutritionDataEnhancer()
    
    try:
        enhancer.process_all_recipes(
            limit=args.limit,
            skip_existing=not args.force
        )
    finally:
        enhancer.close()


if __name__ == "__main__":
    main()
