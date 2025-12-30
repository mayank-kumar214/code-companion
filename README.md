# CodeCompanion 🤖

A powerful AI-powered project generator that converts natural language prompts into complete, working web applications using LangGraph and LangChain.

## 🌟 Features

- **AI-Powered Planning** - Converts prompts into structured project plans
- **Smart Architecture** - Breaks complex projects into implementation tasks
- **Autonomous Code Generation** - Generates complete applications with proper structure
- **Multi-Agent Workflow** - Coordinated planner, architect, and coder agents
- **Modern Web Interface** - Beautiful GUI with real-time progress and project history
- **Interactive CLI** - Simple command-line project generation
- **Safe Operations** - Sandboxed file operations within project directories

## 🛠️ Technologies

**Backend & AI:**
- Python 3.11+
- LangGraph 0.6.3 & LangChain 0.3.27
- Groq 0.31.0+ (openai/gpt-oss-120b)
- Pydantic 2.11.7
- FastAPI 0.122.0+ & Uvicorn 0.38.0+

**Frontend:**
- HTML/CSS/JavaScript

## 🎯 Architecture

### Multi-Agent Pipeline

1. **Planner Agent** - Converts prompts into structured `Plan` objects
2. **Project Workspace** - Creates timestamped directories: `projects/{Name}_{Timestamp}/`
3. **Architect Agent** - Transforms plans into detailed implementation tasks
4. **Coder Agent** - Executes tasks using file system tools until completion

### Workflow
```
User Prompt → Planner → Workspace → Architect → Coder (loop) → Complete Project
```

### State Management
```python
class GraphState(BaseModel):
    user_prompt: str
    plan: Optional[Plan]
    project_path: Optional[str]
    task_plan: Optional[TaskPlan]
    coder_state: Optional[CoderState]
    status: Optional[str]
```

## 🗂️ Project Structure

```
CodeCompanion/
├── agent/               # Core AI system
│   ├── graph.py        # LangGraph workflow
│   ├── prompts.py      # Agent prompt templates
│   ├── states.py       # Pydantic models
│   └── tools.py        # File system tools
├── projects/           # Generated projects
├── web/                # Web interface
│   ├── index.html
│   ├── style.css
│   └── app.js
├── main.py             # CLI entry point
├── server.py           # FastAPI server
├── pyproject.toml
└── .env
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Groq API key ([get one free](https://groq.com))
- Modern web browser

### Installation

```bash
# Clone repository
git clone https://github.com/mayank-kumar214/codecompanion.git
cd CodeCompanion

# Install dependencies
uv sync
# Or with pip
pip install fastapi uvicorn groq langchain langchain-core langchain-groq langgraph pydantic python-dotenv

# Configure environment
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
```

### Usage

**Web Interface (Recommended):**
```bash
python server.py
# Open: http://127.0.0.1:8000/static/index.html
```

**CLI Mode:**
```bash
python main.py
# With custom recursion limit
python main.py --recursion-limit 150
```

Projects are saved to: `projects/ProjectName_YYYYMMDD_HHMMSS/`

## 🎮 Example Prompts

- "Create a Tic Tac Toe game"
- "Create a Pomodoro Timer"
- "Create a ToDo App"
- "Build a Memory Matching game"
- "Create a Calculator with basic operations"

## 📱 Generated Examples

Check the `projects/` directory for working examples:
- **Colorful Memory Match Game** - Interactive card matching with animations
- **Pomodoro Timer** - Productivity timer with work/break cycles
- **Simple Calculator** - Clean calculator with arithmetic operations
- **Tic Tac Toe** - Classic game with modern UI
- **Todo List App** - Task manager with localStorage

## 🔧 Configuration

### Environment Variables
```bash
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL_NAME=openai/gpt-oss-120b  # Optional
```

### API Endpoints
- `POST /generate-stream` - Stream project generation with real-time updates
- `GET /project-files` - Retrieve project files and content
- `GET /history` - List all generated projects
- `POST /open-folder` - Open project in file explorer
- `GET /static/{path}` - Serve web interface files

### Recursion Limits
```bash
# Default: 100 iterations
python main.py

# For complex projects
python main.py --recursion-limit 200
```

## 🚨 Troubleshooting

**Web Interface Issues:**
- Blank page? Use correct URL: `http://127.0.0.1:8000/static/index.html`
- API errors? Ensure server is running: `python server.py`

**API Connection:**
- Check `.env` file has valid `GROQ_API_KEY`
- Verify internet connection

**Generation Issues:**
- Be specific in prompts: ✅ "Build a todo app with HTML, CSS, and JavaScript"
- Increase recursion limit for complex projects: `--recursion-limit 200`

**Dependencies:**
```bash
# Reinstall if needed
uv sync
# Or
pip install fastapi uvicorn groq langchain langchain-core langchain-groq langgraph pydantic python-dotenv
```

## 🎯 Key Features Explained

### AI & LangChain Patterns
- Structured output with Pydantic validation
- State graphs for multi-agent orchestration
- Reactive agents with tool integration
- Optimized prompts for code generation

### Safety & Quality
- Path validation preventing directory traversal
- Timestamped isolated builds
- Recursion control to prevent infinite loops
- Full type hints throughout codebase

## 💡 Use Cases

- **Rapid Prototyping** - Generate working prototypes in seconds
- **Learning Tool** - Study generated code patterns
- **Starter Templates** - Bootstrap new projects quickly
- **Hackathons** - Scaffold projects under time constraints
- **Portfolio Building** - Generate multiple project examples

## 🤝 Contributing

Contributions welcome! Here's how:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Setup
```bash
git clone https://github.com/mayank-kumar214/codecompanion.git
cd CodeCompanion
uv sync
echo "GROQ_API_KEY=your_key_here" > .env
python server.py
```

## 👨‍💻 Author

**Mayank Kumar**
- GitHub: [@mayank-kumar214](https://github.com/mayank-kumar214)
- LinkedIn: [Mayank Kumar](https://linkedin.com/in/mayankconnects)
- Email: iammayank214@gmail.com

## 📄 License

MIT License - Open source and free to use.

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for AI development framework
- [Groq](https://groq.com/) for high-performance inference
- [Pydantic](https://pydantic.dev/) for data validation
- Open Source Community for excellent documentation

## 📊 Project Stats

- **Language**: Python 3.11+
- **Architecture**: Multi-agent state machine with LangGraph + FastAPI
- **Code Quality**: Fully type-hinted, production-ready
- **Agent Count**: 4 specialized nodes
- **Tool Count**: 5 file system tools
- **Interface Options**: Web GUI + CLI

---

⭐ **Star this repo if you found it helpful!** ⭐

*Built with ❤️ to demonstrate LangGraph multi-agent workflows and intelligent code generation*