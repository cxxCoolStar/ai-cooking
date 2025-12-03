from main import AdvancedGraphRAGSystem

def check_recipe():
    sys = AdvancedGraphRAGSystem()
    sys.initialize_system()
    with sys.data_module.driver.session() as session:
        with open("debug_output.txt", "w", encoding="utf-8") as f:
            # 查找名字为 "菜谱" 的节点
            result = session.run("MATCH (r:Recipe) WHERE r.name = '菜谱' RETURN r").data()
            f.write(f"Found {len(result)} recipes named '菜谱'\n")
            for record in result:
                f.write(str(record['r']) + "\n")

            # 查找所有菜谱的名字，看看是否有其他异常
            result_all = session.run("MATCH (r:Recipe) RETURN r.name, r.nodeId LIMIT 10").data()
            f.write("\nSample recipe names:\n")
            for record in result_all:
                f.write(f"{record['r.nodeId']}: {record['r.name']}\n")

if __name__ == "__main__":
    check_recipe()
