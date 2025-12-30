// app.js - Calculator logic and UI interaction
// Uses exact IDs and classes defined in index.html

// DOM element references
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calc-buttons button');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Internal state
let expression = '';
let history = [];

/** Initialize calculator: attach listeners and load history */
function initCalculator() {
    // Button click listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', handleButtonClick);
    });

    // Clear history button
    clearHistoryBtn.addEventListener('click', () => {
        animateButton(clearHistoryBtn);
        clearHistory();
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);

    // Load persisted history
    loadHistory();
}

/** Central click handler for all calculator buttons */
function handleButtonClick(event) {
    const btn = event.currentTarget;
    animateButton(btn);
    const classList = btn.classList;

    if (classList.contains('btn-number')) {
        appendToExpression(btn.textContent.trim());
    } else if (classList.contains('btn-operator')) {
        appendToExpression(btn.textContent.trim());
    } else if (classList.contains('btn-clear')) {
        handleClear();
    } else if (classList.contains('btn-delete')) {
        handleDelete();
    } else if (classList.contains('btn-equals')) {
        calculateResult();
    } else if (classList.contains('btn-clear-history')) {
        clearHistory();
    }
}

/** Append a value (digit, decimal or operator) to the current expression */
function appendToExpression(value) {
    if (/^[0-9]$/.test(value)) {
        // Simple digit
        expression += value;
    } else if (value === '.') {
        // Allow a single decimal per number segment
        const parts = expression.split(/[+\-*/]/);
        const lastSegment = parts[parts.length - 1];
        if (!lastSegment.includes('.')) {
            // Prevent leading decimal without a preceding digit (e.g., "." -> "0.")
            expression += (lastSegment === '' ? '0' : '') + '.';
        }
    } else if (/^[+\-*/]$/.test(value)) {
        // Operator handling
        if (expression === '' && value === '-') {
            // Allow starting a negative number
            expression = '-';
        } else {
            const lastChar = expression[expression.length - 1];
            if (/[+\-*/]/.test(lastChar)) {
                // Replace the previous operator with the new one
                expression = expression.slice(0, -1) + value;
            } else {
                expression += value;
            }
        }
    }
    updateDisplay(expression);
}

/** Evaluate the current expression and update UI */
function calculateResult() {
    // Trim trailing operator if present
    if (/[+\-*/]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }
    if (expression === '' || expression === '-') {
        updateDisplay('');
        return;
    }
    let result;
    try {
        // Using Function constructor for evaluation – safe enough for controlled input
        result = Function('return ' + expression)();
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Invalid result');
        }
        // Round to avoid floating‑point noise
        result = parseFloat(result.toFixed(10));
        const entry = `${expression} = ${result}`;
        saveToHistory(entry);
        expression = result.toString();
        updateDisplay(expression);
    } catch (e) {
        updateDisplay('Error');
        expression = '';
    }
}

/** Update the calculator display with a fade‑in effect */
function updateDisplay(value) {
    display.textContent = value;
    // Simple fade‑in using CSS class; class should be defined in style.css
    display.classList.add('fade-in');
    setTimeout(() => display.classList.remove('fade-in'), 200);
}

/** Persist a history entry and re‑render the list */
function saveToHistory(entry) {
    history.push(entry);
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

/** Load history from localStorage */
function loadHistory() {
    const stored = localStorage.getItem('calcHistory');
    if (stored) {
        try {
            history = JSON.parse(stored);
        } catch (_) {
            history = [];
        }
    }
    renderHistory();
}

/** Render the history UI */
function renderHistory() {
    // Clear existing list
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }
    // Populate with current entries (most recent last)
    history.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        historyList.appendChild(li);
    });
}

/** Clear all stored history */
function clearHistory() {
    history = [];
    localStorage.removeItem('calcHistory');
    renderHistory();
}

/** Reset calculator display and expression */
function handleClear() {
    expression = '';
    updateDisplay('');
}

/** Delete the last character of the current expression */
function handleDelete() {
    if (expression.length > 0) {
        expression = expression.slice(0, -1);
        updateDisplay(expression);
    }
}

/** Keyboard handling – maps keys to calculator actions */
function handleKeyboard(e) {
    const key = e.key;
    if (/^[0-9]$/.test(key)) {
        const btn = document.querySelector(`.btn-number[data-key="${key}"]`) ||
                    Array.from(document.querySelectorAll('.btn-number')).find(b => b.textContent.trim() === key);
        if (btn) {
            animateButton(btn);
            appendToExpression(key);
        }
    } else if (key === '.' ) {
        const btn = Array.from(document.querySelectorAll('.btn-number')).find(b => b.textContent.trim() === '.');
        if (btn) animateButton(btn);
        appendToExpression('.');
    } else if (['+', '-', '*', '/'].includes(key)) {
        const btn = Array.from(document.querySelectorAll('.btn-operator')).find(b => b.textContent.trim() === key);
        if (btn) animateButton(btn);
        appendToExpression(key);
    } else if (key === 'Enter' || key === '=') {
        const btn = document.querySelector('.btn-equals');
        if (btn) animateButton(btn);
        calculateResult();
    } else if (key === 'Backspace') {
        const btn = document.querySelector('.btn-delete');
        if (btn) animateButton(btn);
        handleDelete();
    } else if (key === 'Escape') {
        const btn = document.querySelector('.btn-clear');
        if (btn) animateButton(btn);
        handleClear();
    }
}

/** Visual feedback for button press */
function animateButton(btn) {
    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 150);
}

// Initialise once DOM is ready
document.addEventListener('DOMContentLoaded', initCalculator);
