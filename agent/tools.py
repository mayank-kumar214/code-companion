import pathlib
import subprocess
from typing import Tuple

from langchain_core.tools import tool

PROJECT_ROOT = pathlib.Path.cwd() / "generated_project"

def set_project_root(path: str):
    global PROJECT_ROOT
    PROJECT_ROOT = pathlib.Path(path)
    PROJECT_ROOT.mkdir(parents=True, exist_ok=True)

def safe_path_for_project(path: str) -> pathlib.Path:
    p = (PROJECT_ROOT / path).resolve()
    if PROJECT_ROOT.resolve() not in p.parents and PROJECT_ROOT.resolve() != p:
        raise ValueError("Attempt to access files outside the project root")
    return p


@tool
def write_file(path: str, content: str) -> str:
    p = safe_path_for_project(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    return f"WROTE:{p}"


@tool
def read_file(path: str) -> str:
    p = safe_path_for_project(path)
    if not p.exists():
        return ""
    with open(p, "r", encoding="utf-8") as f:
        return f.read()


@tool
def get_current_directory() -> str:
    return str(PROJECT_ROOT)


@tool
def list_files() -> str:
    p = PROJECT_ROOT
    if not p.is_dir():
        return f"ERROR: Project directory '{p}' does not exist."

    files = [str(f.relative_to(p)) for f in p.glob("**/*") if f.is_file()]
    return "\n".join(files) if files else "The project directory is empty."

@tool
def run_cmd(cmd: str, cwd: str = None, timeout: int = 30) -> Tuple[int, str, str]:
    cwd_dir = safe_path_for_project(cwd) if cwd else PROJECT_ROOT
    res = subprocess.run(cmd, shell=True, cwd=str(cwd_dir), capture_output=True, text=True, timeout=timeout)
    return res.returncode, res.stdout, res.stderr


def init_project_root():
    PROJECT_ROOT.mkdir(parents=True, exist_ok=True)
    return str(PROJECT_ROOT)