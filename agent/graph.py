import json
import os
import pathlib
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
    user_prompt = state.user_prompt

    response = llm.invoke(
        planner_prompt(user_prompt)
    )
    response_text = response.content

    try:
        plan_json = json.loads(response_text)
        resp = Plan.model_validate(plan_json)
    except Exception as e:
        print(f"--- ERROR: Planner agent failed to parse JSON. ---")
        print(f"Raw LLM Output:\n{response_text}")
        print(f"Error: {e}")
        raise ValueError("Planner did not return valid JSON.")

    if resp is None:
        raise ValueError("Planner did not return a valid response.")
    return {"plan": resp}


def create_project_workspace(state: GraphState) -> dict:
    project_name = state.plan.name.strip().replace(" ", "_")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    project_path_str = f"projects/{project_name}_{timestamp}"
    project_path = pathlib.Path(project_path_str)
    project_path.mkdir(parents=True, exist_ok=True)

    set_project_root(str(project_path.resolve()))

    print(f"Project workspace created at: {project_path.resolve()}")
    return {"project_path": str(project_path.resolve())}


def architect_agent(state: GraphState) -> dict:
    plan: Plan = state.plan

    response = llm.invoke(
        architect_prompt(plan=plan.model_dump_json())
    )
    response_text = response.content

    try:
        task_plan_json = json.loads(response_text)
        resp = TaskPlan.model_validate(task_plan_json)
    except Exception as e:
        print(f"--- ERROR: Architect agent failed to parse JSON. ---")
        print(f"Raw LLM Output:\n{response_text}")
        print(f"Error: {e}")
        raise ValueError("Architect did not return valid JSON.")

    if resp is None:
        raise ValueError("Architect did not return a valid response.")

    resp.plan = plan
    print(resp.model_dump_json())
    return {"task_plan": resp}


def coder_agent(state: GraphState) -> dict:
    coder_state: CoderState = state.coder_state
    if coder_state is None:
        coder_state = CoderState(task_plan=state.task_plan, current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]

    tech_stack = state.plan.techstack
    system_prompt = coder_system_prompt(tech_stack)

    user_prompt = (
        f"Your task is to work on the file: {current_task.filepath}\n"
        f"Task Description: {current_task.task_description}\n\n"
        "If the file already exists, **you must use read_file(path) to see its content** before writing."
        "If you are creating a new file, just use write_file(path, content)."
    )

    coder_tools = [read_file, write_file, list_files, get_current_directory]
    react_agent = create_react_agent(llm, coder_tools)

    react_agent.invoke({"messages": [{"role": "system", "content": system_prompt},
                                     {"role": "user", "content": user_prompt}]})

    coder_state.current_step_idx += 1
    if coder_state.current_step_idx >= len(steps):
        print("All coding tasks complete.")
        return {"coder_state": coder_state, "status": "DONE"}
    else:
        return {"coder_state": coder_state}


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

if __name__ == "__main__":
    result = agent.invoke({"user_prompt": "Build a colourful modern todo app in html css and js"},
                          {"recursion_limit": 100})
    print("Final State:", result)