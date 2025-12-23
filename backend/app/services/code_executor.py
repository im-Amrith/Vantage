import subprocess
import sys
import json
import tempfile
import os
from app.models.schemas import CodeExecutionResponse, TestCaseResult

class CodeExecutor:
    def __init__(self):
        pass

    def execute(self, code: str, language: str, problem_id: str | None) -> CodeExecutionResponse:
        if language != "python":
            return CodeExecutionResponse(results=[], error="Only Python is supported currently.")

        # Harness for Invert Binary Tree
        harness = """
import json
import sys

# Helper functions for Tree
def list_to_tree(l):
    if not l: return None
    root = TreeNode(l[0])
    queue = [root]
    i = 1
    while i < len(l):
        node = queue.pop(0)
        if i < len(l) and l[i] is not None:
            node.left = TreeNode(l[i])
            queue.append(node.left)
        i += 1
        if i < len(l) and l[i] is not None:
            node.right = TreeNode(l[i])
            queue.append(node.right)
        i += 1
    return root

def tree_to_list(root):
    if not root: return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    # Trim trailing Nones
    while result and result[-1] is None:
        result.pop()
    return result

test_cases = [
    {"id": 1, "input": [4,2,7,1,3,6,9], "expected": [4,7,2,9,6,3,1]},
    {"id": 2, "input": [2,1,3], "expected": [2,3,1]},
    {"id": 3, "input": [], "expected": []}
]

results = []
try:
    for tc in test_cases:
        try:
            root = list_to_tree(tc["input"])
            # User code must define invertTree
            inverted = invertTree(root)
            actual = tree_to_list(inverted)
            passed = actual == tc["expected"]
            results.append({
                "id": tc["id"],
                "input": str(tc["input"]),
                "expected": str(tc["expected"]),
                "actual": str(actual),
                "passed": passed,
                "error": None
            })
        except Exception as e:
            results.append({
                "id": tc["id"],
                "input": str(tc["input"]),
                "expected": str(tc["expected"]),
                "actual": "Error",
                "passed": False,
                "error": str(e)
            })
    print("---JSON_START---")
    print(json.dumps(results))
    print("---JSON_END---")
except Exception as e:
    print(f"Harness Error: {e}", file=sys.stderr)
"""
        
        full_code = code + "\n" + harness

        try:
            # Write to temp file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(full_code)
                temp_path = f.name

            # Execute
            process = subprocess.run(
                [sys.executable, temp_path],
                capture_output=True,
                text=True,
                timeout=5
            )

            os.unlink(temp_path)

            stdout = process.stdout
            stderr = process.stderr

            if process.returncode != 0:
                return CodeExecutionResponse(
                    results=[],
                    output=stdout,
                    error=f"Runtime Error:\n{stderr}"
                )

            # Parse results
            if "---JSON_START---" in stdout:
                json_str = stdout.split("---JSON_START---")[1].split("---JSON_END---")[0]
                results_data = json.loads(json_str)
                results = [TestCaseResult(**r) for r in results_data]
                
                # Calculate complexity (Mock for now, or simple analysis)
                complexity = {
                    "time": "O(n)",
                    "space": "O(n)",
                    "memory": "14.5 MB",
                    "runtime": "35 ms"
                }
                
                return CodeExecutionResponse(
                    results=results,
                    output=stdout.split("---JSON_START---")[0], # User print output
                    complexity=complexity
                )
            else:
                return CodeExecutionResponse(
                    results=[],
                    output=stdout,
                    error="Could not parse test results. Did you define invertTree correctly?"
                )

        except subprocess.TimeoutExpired:
            return CodeExecutionResponse(results=[], error="Execution Timed Out (5s limit)")
        except Exception as e:
            return CodeExecutionResponse(results=[], error=f"System Error: {str(e)}")
