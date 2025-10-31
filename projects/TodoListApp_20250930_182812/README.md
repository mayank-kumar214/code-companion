# TodoListApp

## Project Overview

**TodoListApp** is a simple, lightweight web application that lets users manage their daily tasks. It provides an intuitive interface for adding, editing, completing, and filtering tasks, with data persisted in the browser using `localStorage`.

---

## Tech Stack
- **HTML** – Structure of the application.
- **CSS** – Styling and responsive layout.
- **JavaScript** – Core functionality, DOM manipulation, and persistence.

---

## Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari, etc.) that supports ES6 JavaScript and `localStorage`.
- No build tools, package managers, or server setup is required.

---

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository‑url>
   cd <repository‑directory>
   ```
2. **Open the application**
   - Locate the `index.html` file in the project root.
   - Double‑click `index.html` or open it via your browser’s *File → Open* menu.
   - The TodoListApp will load and be ready for use.

---

## Usage Guide
### Adding Tasks
- **Enter key**: Type a task into the input field at the top and press **Enter**.
- **Add button**: Click the **Add** button next to the input field.

### Editing Tasks
- Double‑click on a task’s text to turn it into an editable input.
- Press **Enter** to save changes or **Escape** to cancel.

### Deleting Tasks
- Click the **✕** (delete) icon that appears when you hover over a task.

### Marking Tasks Complete
- Click the checkbox next to a task. Completed tasks are shown with a strikethrough style.

### Filtering Views
- **All** – Shows every task (default view).
- **Active** – Shows only tasks that are not completed.
- **Completed** – Shows only tasks that have been marked complete.
- Click the respective filter button at the bottom of the list to switch views.

### Keyboard Shortcuts
- **Enter** – Add a new task (when the input field is focused) or confirm an edit.
- **Escape** – Cancel an edit and revert to the original text.

### Clearing Completed Tasks
- Click the **Clear completed** button at the bottom of the list to remove all tasks that are marked as completed.

---

## Persistence
The app stores the task list in the browser’s `localStorage` under the key `todos`. This means:
- Tasks remain available after page reloads or browser restarts.
- Data is scoped to the specific domain (i.e., the local file path) and is not shared across browsers or devices.

---

## Code Structure Overview
| File | Purpose | Key Functions / Variables |
|------|---------|----------------------------|
| `index.html` | Markup for the UI, includes the input field, task list container, and filter/footer. | – |
| `styles.css` | Styling for layout, colors, responsiveness, and visual states (e.g., completed tasks). | – |
| `script.js` | All interactive logic: handling user input, DOM updates, filtering, and persistence. | 
- `todos` – Array that holds task objects `{ id, text, completed }`.
- `render()` – Renders the task list based on the current filter.
- `addTodo(text)` – Creates a new task and updates storage.
- `toggleTodo(id)` – Toggles the completed state of a task.
- `editTodo(id, newText)` – Updates a task’s text.
- `deleteTodo(id)` – Removes a task from the array.
- `clearCompleted()` – Deletes all completed tasks.
- `saveTodos()` / `loadTodos()` – Persist to and retrieve from `localStorage`.
- Event listeners for input, buttons, and keyboard shortcuts.

---

## Contribution Guidelines
Contributions are welcome! If you’d like to improve the app:
1. Fork the repository.
2. Create a new branch for your feature or bug‑fix.
3. Ensure the existing functionality remains intact (manual testing is sufficient; no test suite is currently set up).
4. Submit a pull request describing your changes.

---

## License
[Insert License Here] – This project is provided under an open‑source license. Replace this placeholder with the appropriate license text (e.g., MIT, Apache 2.0).
