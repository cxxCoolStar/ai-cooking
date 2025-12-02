# AI Cooking Assistant

一个基于图 RAG（Retrieval-Augmented Generation）技术的智能烹饪助手，提供专业的菜谱推荐、烹饪指导和食材建议。

![AI Cooking Assistant](https://img.shields.io/badge/AI-Cooking%20Assistant-orange)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688)

## 🌟 特性

- **🤖 智能对话**: 基于大语言模型的自然语言交互
- **🕸️ 图 RAG 检索**: 结合传统检索和图数据库的混合检索策略
- **📊 知识图谱**: 使用 Neo4j 构建菜谱知识图谱
- **⚡ 实时流式输出**: 打字机效果的流式响应
- **🎨 现代化 UI**: 基于 React + TailwindCSS 的精美界面
- **📈 智能路由**: 自动选择最佳检索策略

## 🏗️ 技术栈

### 后端
- **FastAPI**: 高性能 Web 框架
- **Neo4j**: 图数据库，存储菜谱知识图谱
- **Milvus**: 向量数据库，用于语义检索
- **LangChain**: LLM 应用框架
- **OpenAI API**: 大语言模型接口

### 前端
- **React 18**: 用户界面框架
- **Vite**: 现代化前端构建工具
- **TailwindCSS**: 实用优先的 CSS 框架
- **Lucide React**: 图标库

## 📦 安装

### 前置要求

- Python 3.8+
- Node.js 16+
- Neo4j 5.0+
- Milvus 2.3+

### 克隆项目

```bash
git clone <repository-url>
cd ai-cooking
```

### 后端设置

1. 安装 Python 依赖：

```bash
pip install -r requirements.txt
```

2. 配置环境变量：

创建 `.env` 文件：

```bash
# Neo4j 配置
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password

# Milvus 配置
MILVUS_HOST=localhost
MILVUS_PORT=19530

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

3. 启动后端服务器：

```bash
python server.py
```

服务器将在 `http://localhost:8000` 启动。

### 前端设置

1. 进入前端目录：

```bash
cd web-app
```

2. 安装依赖：

```bash
npm install
```

3. 启动开发服务器：

```bash
npm run dev
```

前端将在 `http://localhost:5173` 启动。

## 🚀 使用

1. 确保 Neo4j 和 Milvus 服务正在运行
2. 启动后端服务器：`python server.py`
3. 启动前端开发服务器：`cd web-app && npm run dev`
4. 在浏览器中打开 `http://localhost:5173`
5. 开始与 AI 烹饪助手对话！

## 📁 项目结构

```
ai-cooking/
├── agent/                    # AI Agent 相关代码
├── rag_modules/             # RAG 模块
│   ├── graph_data_preparation.py
│   ├── milvus_index_construction.py
│   ├── hybrid_retrieval.py
│   ├── graph_rag_retrieval.py
│   └── intelligent_query_router.py
├── web-app/                 # 前端应用
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server.py               # FastAPI 后端服务
├── main.py                 # CLI 版本主程序
├── config.py               # 配置文件
├── requirements.txt        # Python 依赖
└── README.md              # 项目文档
```

## 🔧 配置

配置文件位于 `config.py`，你可以修改以下参数：

- **Neo4j 连接**: URI、用户名、密码
- **Milvus 配置**: 主机、端口、集合名
- **LLM 配置**: 模型名称、温度、最大 token 数
- **检索参数**: Top-K、分块大小等

## 🤝 贡献

欢迎贡献！请随时提交 Issue 或 Pull Request。

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [Neo4j](https://neo4j.com/) - 图数据库
- [Milvus](https://milvus.io/) - 向量数据库
- [FastAPI](https://fastapi.tiangolo.com/) - Web 框架
- [React](https://react.dev/) - 前端框架
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架

## 📞 联系

如有问题或建议，请提交 Issue。

---

**Enjoy cooking with AI! 🍳✨**
