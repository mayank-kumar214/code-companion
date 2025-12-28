# CodeCompanion 🤖

A powerful AI-powered engineering project generator built with LangGraph and LangChain, featuring intelligent planning, architecture design, and automated code generation for web applications.

## 🌟 Features

### Core Capabilities
- **AI-Powered Planning** - Converts natural language prompts into structured engineering project plans
- **Smart Architecture Design** - Automatically breaks down complex projects into implementation tasks
- **Autonomous Code Generation** - Generates complete, working applications with proper file structure
- **Multi-Agent Workflow** - Coordinated planner, architect, and coder agents working in sequence
- **File System Integration** - Safe file operations with project root constraints

### Technical Excellence
- **LangGraph State Management** - Sophisticated workflow orchestration with state persistence
- **Structured Output Processing** - Type-safe AI responses using Pydantic models
- **Tool Integration** - Custom tools for file operations and project management
- **Error Handling** - Robust error recovery and validation throughout the pipeline
- **Recursive Processing** - Configurable recursion limits for complex project generation

### User Experience
- **Modern Web Interface** - Beautiful GUI for project generation with real-time progress tracking
- **Interactive CLI Interface** - Simple command-line interaction for project generation
- **Project History Gallery** - Browse and manage all previously generated projects
- **One-Click File Explorer** - Open generated projects directly in your system file explorer
- **Real-time Progress** - Live status updates and verbose logging for transparency
- **Flexible Input** - Natural language project descriptions with intelligent interpretation
- **Safe Operations** - Sandboxed file operations within designated project directories

## 🛠️ Technologies Used

### Backend & AI
- **Python 3.11+**: Core language with modern features
- **LangGraph 0.6.3**: Advanced workflow and state management framework
- **LangChain 0.3.27**: AI application development framework
- **LangChain-Core 0.3.72**: Core abstractions and interfaces
- **LangChain-Groq 0.3.7**: Groq model integration
- **Groq 0.31.0+**: High-performance language model inference (openai/gpt-oss-120b)
- **Pydantic 2.11.7**: Data validation and type safety
- **Python-dotenv 1.1.1**: Environment variable management
- **Pip 25.2+**: Python package installer

### Web Interface
- **FastAPI 0.122.0+**: Modern, high-performance web framework for the API
- **Uvicorn 0.38.0+**: Lightning-fast ASGI server for serving the web interface
- **HTML/CSS/JavaScript**: Frontend technologies for the interactive GUI
- **CORS Middleware**: Cross-origin resource sharing for API access

## 🎯 Technical Architecture

### Multi-Agent System
The system uses a sequential agent pipeline orchestrated by LangGraph:

1. **Planner Agent** (`planner_agent`)
   - Converts natural language prompts into structured `Plan` objects
   - Defines project name, description, tech stack, features, and file structure
   - Uses `llm.with_structured_output(Plan)` for type-safe responses

2. **Project Workspace Creator** (`create_project_workspace`)
   - Creates unique timestamped directories: `projects/{Name}_{Timestamp}/`
   - Sets global project root for all file operations
   - Ensures isolated, reproducible builds

3. **Architect Agent** (`architect_agent`)
   - Transforms `Plan` into detailed `TaskPlan` with implementation steps
   - Creates ordered tasks with dependencies and integration details
   - Each task specifies filepath and detailed implementation instructions

4. **Coder Agent** (`coder_agent`)
   - Reactive agent using LangChain's `create_react_agent`
   - Processes implementation tasks sequentially
   - Uses tools: `write_file`, `read_file`, `list_files`, `get_current_directory`
   - Loops until all tasks complete or recursion limit reached

### State Management (`GraphState`)
Pydantic-based state object tracks the entire workflow:
```python
class GraphState(BaseModel):
    user_prompt: str              # Original user input
    plan: Optional[Plan]          # Generated project plan
    project_path: Optional[str]   # Unique project directory
    task_plan: Optional[TaskPlan] # Detailed implementation tasks
    coder_state: Optional[CoderState]  # Current coding progress
    status: Optional[str]         # Workflow status ("DONE" when complete)
```

### Workflow Execution Flow
```
User Prompt → Planner → Workspace Creation → Architect → Coder (loop) → END
                ↓            ↓                  ↓              ↓
              Plan      project_path        TaskPlan    Implementation
```

### Tool System
Safe file operations with project root constraints:
- **write_file(path, content)**: Creates/updates files within project root (LangChain @tool)
- **read_file(path)**: Reads existing file content (LangChain @tool)
- **list_files()**: Recursive directory listing of all project files (LangChain @tool)
- **get_current_directory()**: Returns current project root path (LangChain @tool)
- **run_cmd(cmd, cwd, timeout)**: Executes shell commands in project directory (LangChain @tool)
- **safe_path_for_project(path)**: Internal utility that validates paths stay within project root
- **set_project_root(path)**: Internal utility to set global PROJECT_ROOT for all operations

## 🏗️ Project Structure

```
CodeCompanion/
├── agent/
│   ├── graph.py          # Main workflow graph and agent definitions
│   ├── prompts.py        # AI prompt templates and formatting
│   ├── states.py         # Pydantic models for state management
│   ├── tools.py          # File system tools and utilities
│   └── __pycache__/      # Python bytecode cache
├── projects/             # Generated projects output directory (auto-created)
│   ├── Colorful_Memory_Match_Game_20251031_121342/
│   ├── Modern_Tic_Tac_Toe_20251031_094111/
│   ├── Classic_Snake_Game_20251105_153344/
│   ├── Simple_Calculator_20251129_021846/
│   ├── SimpleQuizApp_20251001_170023/
│   └── TodoListApp_20250930_182812/
├── web/                  # Web interface frontend files
│   ├── index.html        # Main GUI page with project generation interface
│   ├── style.css         # Modern styling for the web interface
│   └── app.js            # JavaScript for API communication and UI interactions
├── main.py               # CLI entry point and argument parser
├── server.py             # FastAPI server for web interface and API endpoints
├── pyproject.toml        # Project configuration and dependencies (uv package manager)
├── .env                  # Environment variables (API keys, config) - create this file
├── .gitignore            # Git ignore patterns (optional)
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11 or higher** (required for modern type hints and features)
- **Groq API Key** (get one free at [groq.com](https://groq.com))
- **Internet connection** (for API calls)
- **Modern web browser** (Chrome, Firefox, Safari, or Edge - for GUI mode)
- **Terminal/Command Prompt** (for running the application)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mayank-kumar214/codecompanion.git
   cd CodeCompanion
   ```

2. **Set up Python environment**
   ```bash
   # Using uv (recommended - already configured in pyproject.toml)
   uv sync
   
   # Or manually install dependencies with pip
   pip install fastapi>=0.122.0 uvicorn>=0.38.0 groq>=0.31.0 langchain>=0.3.27 langchain-core>=0.3.72 langchain-groq>=0.3.7 langgraph>=0.6.3 pydantic>=2.11.7 python-dotenv>=1.1.1
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file (or copy from .env.example if provided)
   echo "GROQ_API_KEY=your_groq_api_key_here" > .env
   ```

4. **Run the application**
   
   **Option A: Web Interface (Recommended)**
   ```bash
   # Start the FastAPI server
   python server.py
   
   # Open your browser and navigate to:
   # http://127.0.0.1:8000/static/index.html
   ```
   
   **Option B: Command Line Interface**
   ```bash
   # Basic usage
   python main.py
   
   # With custom recursion limit for complex projects
   python main.py --recursion-limit 150
   python main.py -r 200
   ```

5. **Start generating projects!**
   
   **Via Web Interface:**
   - Enter your project description in the text area
   - Adjust recursion limit if needed (default: 100)
   - Click "Generate Project" and watch the magic happen!
   - View project history in the gallery section
   - Open generated projects directly in your file explorer
   
   **Via CLI:**
   ```
   Enter your project prompt: Build a colorful modern todo app in HTML CSS and JS
   ```

   Projects are automatically saved to: `projects/ProjectName_YYYYMMDD_HHMMSS/`

## 🎮 How to Use

### Web Interface Usage (Recommended)
1. **Start the server** → Run `python server.py`
2. **Open the GUI** → Navigate to `http://127.0.0.1:8000/static/index.html` in your browser
3. **Enter project description** → Type what you want to build in the text area
4. **Configure settings** → Adjust recursion limit if needed (default: 100)
5. **Generate project** → Click the "Generate Project" button
6. **Watch real-time progress** → See status updates as agents work
7. **Access your project** → Click "Open Project Folder" when complete
8. **Browse history** → View all previously generated projects in the gallery
9. **Test and iterate** → Open the HTML file in a browser and refine as needed

### CLI Usage
1. **Start the application** → Run `python main.py`
2. **Enter project description** → Describe what you want to build in natural language
3. **Watch the agents work** → AI agents plan, architect, and code your project in sequence
4. **Review generated code** → Check the `projects/ProjectName_TIMESTAMP/` directory
5. **Test your project** → Open the generated HTML file in a browser
6. **Iterate and improve** → Run again with refined prompts for better results

### Input Examples
- **Web Applications**: "Build a responsive portfolio website with dark mode"
- **Utility Tools**: "Create a password generator with customizable options"
- **Games**: "Build a colorful memory card matching game" or "Create a modern tic-tac-toe game"
- **Productivity Apps**: "Create a habit tracker with progress visualization"
- **Calculators**: "Build a calculator with basic arithmetic operations"
- **Interactive Apps**: "Build a colorful modern todo app in HTML CSS and JS with local storage"
- **Quiz Applications**: "Create a simple quiz app with multiple choice questions"

### Real Generated Examples
Check the `projects/` directory for working examples:
- **Colorful Memory Match Game** - Interactive memory card matching game with colorful UI
- **Modern Tic-Tac-Toe** - Classic game with modern UI and winning animations
- **Simple Calculator** - Basic arithmetic operations with clean interface
- **Simple Quiz App** - Interactive quiz with scoring and feedback
- **Todo List App** - Task management with local storage persistence

## 📱 Generated Project Examples

### Supported Project Types
- ✅ **Web Applications** (HTML/CSS/JavaScript)
- ✅ **Interactive Tools** (Calculators, generators, utilities)
- ✅ **Games** (Browser-based games and puzzles)
- ✅ **Productivity Apps** (Todo lists, trackers, organizers)

### Output Quality
- ✅ **Complete File Structure** - Properly organized project files
- ✅ **Working Code** - Functional applications ready to run
- ✅ **Modern Standards** - Clean, semantic HTML/CSS/JS
- ✅ **Responsive Design** - Mobile-friendly layouts
- ✅ **Documentation** - Generated README files for each project

## 🔧 Configuration Options

### Environment Variables (.env file)
```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional - Model selection
GROQ_MODEL_NAME=openai/gpt-oss-120b  # Default model (configurable)

# Development flags (automatically enabled in graph.py)
# set_debug(True)   - Detailed debug logging
# set_verbose(True) - Verbose operation logging
```

### Server Configuration
The FastAPI server runs on `http://127.0.0.1:8000` by default. You can modify this in `server.py`:
```python
uvicorn.run(app, host="127.0.0.1", port=8000)
```

**Key API Endpoints:**
- `POST /generate` - Generate a new project from a prompt
- `GET /history` - Retrieve list of all generated projects with metadata
- `POST /open-folder` - Open a project folder in the system file explorer
- `GET /projects/{path}` - Serve static files from generated projects
- `GET /static/{path}` - Serve web interface files (HTML/CSS/JS)

### Model Configuration
The system uses Groq's high-performance models. Default configuration in `agent/graph.py`:
```python
model_name = os.environ.get("GROQ_MODEL_NAME", "openai/gpt-oss-120b")
llm = ChatGroq(model=model_name)
```

Available models through Groq API:
- `openai/gpt-oss-120b` (default) - Fast, high-quality generation for code
- Other Groq-supported models (llama, mixtral, etc.) can be configured via `GROQ_MODEL_NAME` environment variable

**Note**: The planner and architect agents use manual JSON parsing (`json.loads()`) instead of structured output for more reliable response handling.

### Recursion & Processing Limits
```python
# Default: 100 iterations
python main.py

# Complex projects: Increase limit
python main.py --recursion-limit 150

# The coder agent loops until all implementation tasks complete
# Limit prevents infinite loops while allowing multi-step generation
```

### Project Output Configuration
Projects are automatically saved with unique timestamps:
```python
# Format: projects/{ProjectName}_{YYYYMMDD_HHMMSS}/
# Example: projects/TodoListApp_20251031_094111/

# Configured in agent/graph.py create_project_workspace()
project_path = f"projects/{project_name}_{timestamp}"
```

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### Web Interface Issues
```bash
# Error: Blank page or "Cannot GET /"
Solution: Make sure to access the correct URL
http://127.0.0.1:8000/static/index.html

# Error: "Failed to fetch" or API connection error
Solution: Ensure the server is running
python server.py
# Then verify at: http://127.0.0.1:8000

# Error: Projects not appearing in gallery
Solution: Check if projects/ directory exists and contains folders
# Refresh the page or restart the server

# Error: "Open Folder" button not working
Solution: This feature only works when running locally
# Ensure proper file system permissions on Windows/Mac/Linux
```

#### API Connection Errors
```bash
# Error: "GROQ_API_KEY not found"
Solution: Create .env file with your API key
echo GROQ_API_KEY=your_key_here > .env

# Error: "Rate limit exceeded"
Solution: Wait a few minutes and retry, or upgrade your Groq API plan
Check usage at: https://console.groq.com

# Error: Connection timeout
Solution: Check internet connection and Groq API status
```

#### Generation Issues
```bash
# Error: "Planner did not return a valid response"
Solution: Be more specific in your prompt
- ✅ "Build a todo app with HTML, CSS, and JavaScript"
- ❌ "Make an app"

# Error: "Attempt to access files outside the project root"
Solution: This is a security feature working correctly
All files must be within the projects/ directory

# Error: Recursion limit exceeded
Solution: Increase the limit for complex projects
python main.py --recursion-limit 200
```

#### Dependencies & Installation
```bash
# Error: "Module not found: langchain/langgraph/fastapi/etc"
Solution: Install all dependencies
# Using uv (recommended)
uv sync
# Or manually with pip
pip install fastapi uvicorn groq langchain langchain-core langchain-groq langgraph pydantic python-dotenv

# Error: "Python version compatibility"
Solution: Upgrade to Python 3.11+
python --version  # Should be 3.11.0 or higher

# Error: ImportError for groq or fastapi
Solution: Install missing packages
pip install langchain-groq>=0.3.7 fastapi>=0.122.0 uvicorn>=0.38.0

# Error: "Address already in use" when starting server
Solution: Port 8000 is already occupied
# Either kill the existing process or change the port in server.py
```

#### Project Generation Issues
```bash
# No files created in projects/ directory
Solution: 
1. Check console for errors during generation
2. Verify PROJECT_ROOT path in agent/tools.py
3. Ensure write permissions in projects/ folder

# Incomplete projects (missing files)
Solution:
1. Increase recursion limit
2. Check if coder agent completed all tasks
3. Look for errors in verbose output (set_debug=True)
```

## 🎯 Key Technical Concepts

### AI & LangChain Patterns
- **Structured Output**: Using `llm.with_structured_output()` for type-safe AI responses
- **Pydantic Models**: Defining response schemas with `BaseModel` for validation
- **State Graphs**: LangGraph's `StateGraph` for orchestrating multi-agent workflows
- **Reactive Agents**: `create_react_agent()` pattern for tool-using AI agents
- **Prompt Engineering**: System and user prompts optimized for code generation

### Software Engineering Practices
- **File System Safety**: Path validation with `safe_path_for_project()` preventing directory traversal
- **Immutable State**: Pydantic models ensure state integrity across agent transitions
- **Recursion Control**: Configurable limits prevent infinite loops in agent execution
- **Isolated Builds**: Timestamped project directories for reproducible outputs
- **Tool Abstraction**: LangChain `@tool` decorator for AI-accessible functions

### Architecture Patterns
- **Pipeline Architecture**: Sequential agent processing (Planner → Architect → Coder)
- **State Machine**: Conditional edges for looping behavior (coder task iteration)
- **Dependency Injection**: Dynamic `PROJECT_ROOT` configuration via `set_project_root()`
- **Type Safety**: Full type hints and Pydantic validation throughout
- **Error Handling**: Graceful degradation with informative error messages

## 🔮 Future Enhancements

- [x] **Web Interface** - ✅ Browser-based project generation with modern GUI (Completed)
- [x] **Project History** - ✅ Gallery view of all generated projects (Completed)
- [ ] **Live Preview** - In-browser preview of generated projects without downloading
- [ ] **Multiple Tech Stacks** - Support for React/TypeScript, Vue, Python Flask/Django, Node.js
- [ ] **Template System** - Pre-built project templates (SPA, API, Full-stack)
- [ ] **README Generation** - Auto-generated project documentation
- [ ] **Multi-Model Support** - Fallback to different models (OpenAI, Anthropic, local LLMs)
- [ ] **Incremental Updates** - Modify existing projects instead of regenerating
- [ ] **Project Export** - Download projects as ZIP files
- [ ] **Dark Mode** - Theme toggle for the web interface
- [ ] **Project Sharing** - Share generated projects via unique links

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Here's how you can help:

### Getting Started
1. **Fork the Project** on GitHub
2. **Create Feature Branch** (`git checkout -b feature/AmazingFeature`)  
3. **Make Changes** and test thoroughly
4. **Commit Changes** (`git commit -m 'Add some AmazingFeature'`)
5. **Push to Branch** (`git push origin feature/AmazingFeature`)
6. **Open Pull Request** with detailed description

### Contribution Guidelines
- Follow existing code style and type hints
- Add docstrings for new functions and classes
- Test with different project types before submitting
- Update documentation for new features

### Development Setup
```bash
# Clone and setup development environment
git clone https://github.com/mayank-kumar214/codecompanion.git
cd CodeCompanion

# Install dependencies with uv (recommended)
uv sync

# Or install manually with pip
pip install fastapi>=0.122.0 uvicorn>=0.38.0 groq>=0.31.0 langchain>=0.3.27 langchain-core>=0.3.72 langchain-groq>=0.3.7 langgraph>=0.6.3 pydantic>=2.11.7 python-dotenv>=1.1.1

# Set up environment
# Create .env file manually
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
# Or edit .env in your text editor to add: GROQ_API_KEY=your_key_here

# Run the web server (recommended)
python server.py
# Then open: http://127.0.0.1:8000/static/index.html

# Or run the CLI version
python main.py
```

## 👨‍💻 Author

**Mayank Kumar**
- GitHub: [@mayank-kumar214](https://github.com/mayank-kumar214)
- LinkedIn: [Mayank Kumar](https://linkedin.com/in/mayankconnects)
- Email: iammayank214@gmail.com

## 📄 License

This project is open source and available under the MIT License.

### Third-Party Licenses
- **LangChain**: MIT License
- **LangGraph**: MIT License
- **Groq**: Check Groq's terms of service

## 🙏 Acknowledgments

- **[LangChain](https://langchain.com/)** for providing excellent AI application development framework
- **[Groq](https://groq.com/)** for high-performance language model inference
- **[Pydantic](https://pydantic.dev/)** for robust data validation and type safety
- **Open Source Community** for maintaining excellent documentation and tutorials
- **Contributors** who help improve this project

## 📊 Project Stats

- **Project Name**: coder-buddy (internal), CodeCompanion (public)
- **Language**: Python 3.11+
- **Core Dependencies**: 10 packages (FastAPI, Uvicorn, LangChain, LangGraph, Groq, Pydantic)
- **Architecture**: Multi-agent state machine with LangGraph + FastAPI REST API
- **Lines of Code**: ~600 LOC (agent logic + tools + prompts + server + frontend)
- **Code Quality**: Fully type-hinted with Pydantic models
- **Agent Count**: 4 specialized nodes (Planner, Workspace Creator, Architect, Coder)
- **Tool Count**: 5 file system tools (write_file, read_file, list_files, get_current_directory, run_cmd)
- **API Endpoints**: 5 REST endpoints (generate, history, open-folder, projects, static)
- **Interface Options**: 2 modes (Web GUI + CLI)
- **Maintenance**: Actively maintained and improved
- **Package Manager**: uv (modern Python package manager)
- **Learning Level**: Intermediate to Advanced Python + AI concepts
- **Generated Projects**: 6 example projects included

## 💡 Use Cases

- **Rapid Prototyping**: Generate working prototypes in seconds via web interface
- **Learning Tool**: Study generated code to learn web development patterns
- **Starter Templates**: Bootstrap new projects with AI-generated structure
- **Code Examples**: Get instant examples for specific features
- **Teaching Aid**: Demonstrate project structure and best practices with the visual GUI
- **Hackathons**: Quickly scaffold projects during time-constrained events
- **Portfolio Building**: Generate multiple project examples to showcase skills
- **Client Demos**: Create quick prototypes to show potential clients
- **Educational Workshops**: Use the gallery feature to show progression of projects

---

⭐ **Star this repo if you found it helpful!** ⭐

*Built with ❤️ as a demonstration of LangGraph multi-agent workflows, structured AI outputs, and intelligent code generation*
