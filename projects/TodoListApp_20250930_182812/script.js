// Todo List App - script.js
// This script implements the full application logic for the Todo List App.
// It manages tasks, persistence via localStorage, UI rendering, CRUD operations,
// filtering, and keyboard shortcuts.

// ------------------------------------------------------------
// 1. Data Model & Persistence
// ------------------------------------------------------------

/**
 * The in‑memory array of task objects.
 * Each task has the shape: { id: string, text: string, completed: boolean }
 */
let tasks = [];

/**
 * Factory function to create a new task.
 * @param {string} text - The task description.
 * @returns {{id:string, text:string, completed:boolean}}
 */
function createTask(text) {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
  };
}

/**
 * Load tasks from localStorage. If parsing fails, fall back to an empty array.
 */
function loadTasks() {
  const raw = localStorage.getItem('todo-tasks');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // Ensure we have an array of objects with required fields.
      if (Array.isArray(parsed)) {
        tasks = parsed.map((t) => ({
          id: String(t.id),
          text: String(t.text),
          completed: Boolean(t.completed),
        }));
        return;
      }
    } catch (e) {
      console.warn('Failed to parse stored tasks:', e);
    }
  }
  tasks = [];
}

/**
 * Save the current tasks array to localStorage.
 */
function saveTasks() {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

// Expose for debugging (optional)
window.todoApp = { loadTasks, saveTasks, tasks };

// ------------------------------------------------------------
// 2. UI Caching & Rendering
// ------------------------------------------------------------

const taskListEl = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const filterAllBtn = document.getElementById('filter-all');
const filterActiveBtn = document.getElementById('filter-active');
const filterCompletedBtn = document.getElementById('filter-completed');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

let currentFilter = 'all'; // all | active | completed

/**
 * Render the task list according to the current filter.
 * @param {string} [filter] - Optional filter override.
 */
function renderTasks(filter = currentFilter) {
  // Clear existing list
  taskListEl.innerHTML = '';

  const filtered = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // all
  });

  filtered.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      toggleTaskCompletion(task.id);
    });

    // Text span (or edit input later)
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      enterEditMode(li, task);
    });

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id);
    });

    // Assemble
    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(textSpan);

    li.appendChild(label);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskListEl.appendChild(li);
  });
}

/**
 * Switch a task list item into edit mode.
 * @param {HTMLLIElement} li - The list item element.
 * @param {{id:string, text:string, completed:boolean}} task - The task object.
 */
function enterEditMode(li, task) {
  // Prevent multiple edit inputs
  if (li.querySelector('.edit-input')) return;

  const textSpan = li.querySelector('.task-text');
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = task.text;

  // Replace the span with the input
  textSpan.replaceWith(editInput);
  editInput.focus();

  // Save on Enter, cancel on Escape
  const finishEdit = (save) => {
    if (save) {
      const newText = editInput.value.trim();
      if (newText && newText !== task.text) {
        editTask(task.id, newText);
      }
    }
    // Restore span regardless of save/cancel
    const newSpan = document.createElement('span');
    newSpan.className = 'task-text';
    newSpan.textContent = task.text; // will be updated after re‑render
    editInput.replaceWith(newSpan);
    // Re‑render to reflect any changes (including completed class)
    renderTasks();
  };

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEdit(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      finishEdit(false);
    }
  });

  // Blur also finishes edit (save)
  editInput.addEventListener('blur', () => {
    finishEdit(true);
  });
}

// ------------------------------------------------------------
// 3. CRUD Operations
// ------------------------------------------------------------

function addTask(text) {
  if (!text || !text.trim()) return;
  const task = createTask(text);
  tasks.push(task);
  saveTasks();
  renderTasks();
}

function editTask(id, newText) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// ------------------------------------------------------------
// 4. Filter Management
// ------------------------------------------------------------

function setFilter(filter) {
  currentFilter = filter;
  // Update button active states
  [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTasks();
}

// ------------------------------------------------------------
// 5. Clear Completed
// ------------------------------------------------------------

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
}

// ------------------------------------------------------------
// 6. Keyboard Shortcuts & Global Event Listeners
// ------------------------------------------------------------

function bindGlobalEvents() {
  // Add task via button
  addTaskBtn.addEventListener('click', () => {
    addTask(newTaskInput.value);
    newTaskInput.value = '';
  });

  // Add task via Enter key on input
  newTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask(newTaskInput.value);
      newTaskInput.value = '';
    } else if (e.key === 'Escape') {
      e.preventDefault();
      newTaskInput.value = '';
    }
  });

  // Filter buttons
  filterAllBtn.addEventListener('click', () => setFilter('all'));
  filterActiveBtn.addEventListener('click', () => setFilter('active'));
  filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

  // Clear completed button
  clearCompletedBtn.addEventListener('click', clearCompleted);
}

// ------------------------------------------------------------
// 7. Initialization
// ------------------------------------------------------------

function init() {
  loadTasks();
  setFilter('all'); // also triggers initial render
  bindGlobalEvents();
}

// Run init after the script is loaded (deferred ensures DOM ready)
init();
