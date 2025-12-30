import uvicorn
import os
import sys
import platform
import subprocess
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.responses import StreamingResponse, RedirectResponse

# Ensure agent import works
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from agent.graph import agent
except ImportError as e:
    print(f"CRITICAL ERROR: {e}")
    sys.exit(1)

app = FastAPI(title="CodeCompanion GUI")

# --- ROOT REDIRECT (This fixes the "Not Found" error at http://127.0.0.1:8000/) ---
@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")

@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("projects", exist_ok=True)
app.mount("/projects", StaticFiles(directory="projects"), name="projects")

if os.path.exists("web"):
    app.mount("/static", StaticFiles(directory="web"), name="static")


class ProjectRequest(BaseModel):
    prompt: str
    recursion_limit: int = 100


# --- STREAMING ENDPOINT ---
@app.post("/generate-stream")
async def generate_stream(request: ProjectRequest):
    """
    Streams events from the LangGraph agent to the frontend.
    Yields JSON chunks: { "status": "...", "data": ... }
    """

    async def event_generator():
        try:
            # agent.stream yields events as the graph progresses through nodes
            inputs = {"user_prompt": request.prompt}
            config = {"recursion_limit": request.recursion_limit}

            project_path = None
            final_plan = None

            # Stream the graph execution
            for event in agent.stream(inputs, config):

                # 1. PLANNER NODE
                if "planner" in event:
                    final_plan = event["planner"]["plan"]
                    yield json.dumps({
                        "phase": "planning",
                        "message": "Drafting engineering plan...",
                        "details": f"Planned: {final_plan.name}"
                    }) + "\n"

                # 2. WORKSPACE NODE
                elif "create_project_workspace" in event:
                    project_path = event["create_project_workspace"]["project_path"]
                    yield json.dumps({
                        "phase": "workspace",
                        "message": "Setting up workspace...",
                        "details": f"Dir: {os.path.basename(project_path)}"
                    }) + "\n"

                # 3. ARCHITECT NODE
                elif "architect" in event:
                    yield json.dumps({
                        "phase": "architect",
                        "message": "Designing architecture...",
                        "details": "Breaking down tasks..."
                    }) + "\n"

                # 4. CODER NODE (Loops)
                elif "coder" in event:
                    coder_state = event["coder"].get("coder_state")
                    if coder_state:
                        current = coder_state.current_step_idx
                        total = len(coder_state.task_plan.implementation_steps)
                        yield json.dumps({
                            "phase": "coding",
                            "message": f"Writing code ({current}/{total})...",
                            "details": f"Task: {coder_state.task_plan.implementation_steps[current - 1].filepath}"
                        }) + "\n"

            # 5. DONE
            yield json.dumps({
                "phase": "complete",
                "message": "Project ready!",
                "project_path": project_path,
                "project_name": final_plan.name if final_plan else "Project"
            }) + "\n"

        except Exception as e:
            print(f"Stream Error: {e}")
            yield json.dumps({"phase": "error", "message": str(e)}) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")


# --- FILE EXPLORER ENDPOINT ---
@app.get("/project-files")
async def get_project_files(folder: str):
    """Returns a list of files and their content for the code viewer."""
    project_root = os.path.join("projects", folder)
    if not os.path.exists(project_root):
        raise HTTPException(404, "Project not found")

    files_data = []

    # Walk through the directory
    for root, _, files in os.walk(project_root):
        for file in files:
            # Skip hidden files or images/binaries for now
            if file.startswith('.') or file.endswith(('.png', '.jpg', '.jpeg', '.ico')):
                continue

            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, project_root)

            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    content = f.read()

                files_data.append({
                    "name": file,
                    "path": rel_path,
                    "content": content,
                    "language": file.split('.')[-1]  # simple extension check
                })
            except Exception:
                pass  # Skip files we can't read text from

    return files_data


@app.get("/history")
async def get_project_history():
    projects_dir = "projects"
    if not os.path.exists(projects_dir):
        return []
    project_list = []
    for folder_name in os.listdir(projects_dir):
        folder_path = os.path.join(projects_dir, folder_name)
        if os.path.isdir(folder_path):
            try:
                timestamp = os.path.getmtime(folder_path)
                parts = folder_name.split('_')
                display_name = " ".join(parts[:-2]) if len(parts) > 2 else folder_name
                project_list.append({
                    "name": display_name,
                    "folder": folder_name,
                    "created": timestamp
                })
            except Exception:
                pass
    project_list.sort(key=lambda x: x["created"], reverse=True)
    return project_list


@app.post("/open-folder")
async def open_folder(request: dict):
    path = request.get("path")
    if path and not os.path.isabs(path):
        path = os.path.abspath(path)
    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Path not found on server")
    try:
        if platform.system() == "Windows":
            os.startfile(path)
        elif platform.system() == "Darwin":
            subprocess.Popen(["open", path])
        else:
            subprocess.Popen(["xdg-open", path])
        return {"status": "opened"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)