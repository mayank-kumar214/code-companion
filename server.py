import uvicorn
import os
import sys
import platform  # Needed for opening folders
import subprocess  # Needed for opening folders
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# 1. ROBUST IMPORT: Ensure we can find the agent module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from agent.graph import agent
except ImportError as e:
    print("CRITICAL ERROR: Could not import 'agent.graph'.")
    print(f"Make sure you are running this script from the root 'CodeCompanion' directory.")
    print(f"Error details: {e}")
    sys.exit(1)

# Initialize App
app = FastAPI(title="CodeCompanion GUI")


# --- MIDDLEWARE: Disable Caching (Fixes the "Blank Page" issue) ---
@app.middleware("http")
async def add_no_cache_header(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# 2. CORS: Allow the frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. MOUNT PROJECTS DIRECTORY
os.makedirs("projects", exist_ok=True)
app.mount("/projects", StaticFiles(directory="projects"), name="projects")

# 4. SERVE STATIC FILES (GUI)
if os.path.exists("web"):
    app.mount("/static", StaticFiles(directory="web"), name="static")
else:
    print("WARNING: 'web' directory not found. GUI files might be missing.")


# --- NEW ENDPOINT: Project History for Gallery ---
@app.get("/history")
async def get_project_history():
    projects_dir = "projects"
    if not os.path.exists(projects_dir):
        return []

    project_list = []

    # Loop through all folders in 'projects/'
    for folder_name in os.listdir(projects_dir):
        folder_path = os.path.join(projects_dir, folder_name)

        # Only look at directories
        if os.path.isdir(folder_path):
            try:
                # Get the creation time for sorting
                timestamp = os.path.getmtime(folder_path)

                # Format the name: "Tic_Tac_Toe_2025..." -> "Tic Tac Toe"
                # We split by '_' and remove the last 2 parts (Date and Time) if possible
                parts = folder_name.split('_')
                if len(parts) > 2:
                    display_name = " ".join(parts[:-2])
                else:
                    display_name = folder_name

                project_list.append({
                    "name": display_name,
                    "folder": folder_name,
                    "created": timestamp
                })
            except Exception as e:
                print(f"Skipping {folder_name}: {e}")

    # Sort by newest first
    project_list.sort(key=lambda x: x["created"], reverse=True)
    return project_list


# --- NEW ENDPOINT: Open Local Folder ---
@app.post("/open-folder")
async def open_folder(request: dict):
    path = request.get("path")

    # 1. Security/Path Resolution
    # If the path is relative (e.g., "projects/MyGame"), make it absolute
    if path and not os.path.isabs(path):
        path = os.path.abspath(path)

    if not path or not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Path not found on server")

    # 2. Open folder based on OS
    try:
        if platform.system() == "Windows":
            os.startfile(path)
        elif platform.system() == "Darwin":  # macOS
            subprocess.Popen(["open", path])
        else:  # Linux
            subprocess.Popen(["xdg-open", path])
        return {"status": "opened"}
    except Exception as e:
        print(f"Error opening folder: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class ProjectRequest(BaseModel):
    prompt: str
    recursion_limit: int = 100


@app.post("/generate")
async def generate_project(request: ProjectRequest):
    print(f"Received Request: {request.prompt}")

    try:
        # 5. RUN THE AGENT
        result = agent.invoke(
            {"user_prompt": request.prompt},
            {"recursion_limit": request.recursion_limit}
        )

        project_path = result.get("project_path")

        # Verify the path actually exists
        if not project_path or not os.path.exists(project_path):
            raise ValueError("Agent finished but project path is invalid or missing.")

        return {
            "status": "success",
            "project_path": project_path,
            "project_name": result.get("plan", {}).name if result.get("plan") else "Unknown Project"
        }

    except Exception as e:
        print(f"GENERATION ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    print("🚀 Starting CodeCompanion Server...")
    print("📂 UI available at: http://127.0.0.1:8000/static/index.html")
    uvicorn.run(app, host="127.0.0.1", port=8000)