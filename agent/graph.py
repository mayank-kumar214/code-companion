import json
import os
import pathlib
import re
from datetime import datetime
from agent.tools import set_project_root
from dotenv import load_dotenv
from langchain.globals import set_verbose, set_debug
from langchain_groq.chat_models import ChatGroq
from langgraph.constants import END
from langgraph.graph import StateGraph
from langgraph.prebuilt import create_react_agent
from agent.prompts import *
from agent.states import *
from agent.tools import write_file, read_file, get_current_directory, list_files

_ = load_dotenv()

set_debug(True)
set_verbose(True)

model_name = os.environ.get("GROQ_MODEL_NAME", "openai/gpt-oss-120b")
llm = ChatGroq(model=model_name)


def planner_agent(state: GraphState) -> dict:
    """Takes the user prompt and creates a high-level JSON plan."""
    user_prompt = state.user_prompt
    print(f"--- PLANNER: Processing '{user_prompt}' ---")

    response = llm.invoke(planner_prompt(user_prompt))
    response_text = response.content

    try:
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        plan_json = json.loads(response_text)
        resp = Plan.model_validate(plan_json)
    except Exception as e:
        print(f"--- ERROR: Planner agent failed to parse JSON. ---")
        print(f"Raw LLM Output:\n{response_text}")
        print(f"Error: {e}")
        raise ValueError("Planner did not return valid JSON.")

    return {"plan": resp}


def create_project_workspace(state: GraphState) -> dict:
    """Creates the physical folder on disk for the project."""
    project_name = state.plan.name.strip().replace(" ", "_")
    project_name = re.sub(r'[^a-zA-Z0-9_]', '', project_name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    project_path_str = f"projects/{project_name}_{timestamp}"
    project_path = pathlib.Path(project_path_str)
    project_path.mkdir(parents=True, exist_ok=True)

    set_project_root(str(project_path.resolve()))

    print(f"--- WORKSPACE: Created at {project_path.resolve()} ---")
    return {"project_path": str(project_path.resolve())}


def architect_agent(state: GraphState) -> dict:
    """Takes the plan and breaks it down into specific file implementation tasks."""
    plan: Plan = state.plan
    print(f"--- ARCHITECT: Designing file structure for {plan.name} ---")

    response = llm.invoke(architect_prompt(plan=plan.model_dump_json()))
    response_text = response.content

    try:
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        task_plan_json = json.loads(response_text)
        resp = TaskPlan.model_validate(task_plan_json)
    except Exception as e:
        print(f"--- ERROR: Architect agent failed to parse JSON. ---")
        print(f"Raw LLM Output:\n{response_text}")
        print(f"Error: {e}")
        raise ValueError("Architect did not return valid JSON.")

    return {"task_plan": resp}


def coder_agent(state: GraphState) -> dict:
    """Iteratively implements each file in the TaskPlan."""
    coder_state: CoderState = state.coder_state

    if coder_state is None:
        coder_state = CoderState(task_plan=state.task_plan, current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps

    if coder_state.current_step_idx >= len(steps):
        print("--- CODER: All tasks completed. ---")
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]
    print(f"--- CODER: Working on file ({coder_state.current_step_idx + 1}/{len(steps)}): {current_task.filepath} ---")

    tech_stack = state.plan.techstack
    system_prompt = coder_system_prompt(tech_stack)

    # --- CONTEXT INJECTION (Prevents Hallucinations) ---
    # If writing CSS/JS, we inject the IDs and Classes found in HTML
    context_injection = ""
    if current_task.filepath.endswith(".js") or current_task.filepath.endswith(".css"):
        html_content = read_file("index.html")
        if html_content and "ERROR" not in html_content:
            # Extract IDs
            ids = re.findall(r'id=["\']([^"\']+)["\']', html_content)
            # Extract Classes
            classes = re.findall(r'class=["\']([^"\']+)["\']', html_content)

            # Flatten class lists (handle "btn btn-primary")
            all_classes = []
            for c in classes:
                all_classes.extend(c.split())

            unique_ids = list(set(ids))
            unique_classes = list(set(all_classes))

            if unique_ids or unique_classes:
                context_injection = (
                    f"\n\n[CONTEXT INJECTION] \n"
                    f"To ensure consistency, use these EXACT selectors found in index.html:\n"
                    f"IDs: {unique_ids}\n"
                    f"CSS Classes: {unique_classes}\n"
                    f"Do NOT invent new IDs or classes that are not listed above."
                )

    user_prompt = (
        f"CURRENT FILE: {current_task.filepath}\n"
        f"TASK: {current_task.task_description}\n"
        f"{context_injection}\n\n"
        "INSTRUCTIONS:\n"
        "1. If the file exists, read it first using read_file().\n"
        "2. Write the COMPLETE code for this file using write_file().\n"
        "3. Do not leave placeholders."
    )

    coder_tools = [read_file, write_file, list_files, get_current_directory]
    react_agent = create_react_agent(llm, coder_tools)

    try:
        react_agent.invoke({
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        })
    except Exception as e:
        print(f"--- CODER ERROR on {current_task.filepath}: {e} ---")
        pass

    coder_state.current_step_idx += 1

    return {"coder_state": coder_state, "status": "IN_PROGRESS"}


graph = StateGraph(GraphState)

graph.add_node("planner", planner_agent)
graph.add_node("create_project_workspace", create_project_workspace)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)

graph.add_edge("planner", "create_project_workspace")
graph.add_edge("create_project_workspace", "architect")
graph.add_edge("architect", "coder")

graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.status == "DONE" else "coder",
    {
        "END": END,
        "coder": "coder"
    }
)

graph.set_entry_point("planner")
agent = graph.compile()