(function() {
    // Module scope variables
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    let currentInput = '';
    let previousValue = null;
    let operator = null;

    // Helper Functions
    function updateDisplay() {
        display.textContent = currentInput || '0';
    }

    function calculate(a, b, op) {
        const x = parseFloat(a);
        const y = parseFloat(b);
        if (isNaN(x) || isNaN(y)) return NaN;
        switch (op) {
            case '+':
                return x + y;
            case '-':
                return x - y;
            case '*':
                return x * y;
            case '/':
                // Handle division by zero
                return y === 0 ? NaN : x / y;
            default:
                return NaN;
        }
    }

    function resetCalculator() {
        currentInput = '';
        previousValue = null;
        operator = null;
        updateDisplay();
    }

    function backspace() {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
        }
    }

    // Core Logic Functions
    function appendNumber(num) {
        // Prevent multiple leading zeros
        if (num === '0' && currentInput === '0') return;
        // Ensure only one decimal point
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
        updateDisplay();
    }

    function setOperator(op) {
        if (currentInput === '' && previousValue === null) return; // nothing to operate on
        if (previousValue !== null && operator && currentInput !== '') {
            // Chain calculation if user presses another operator before equals
            computeResult();
        }
        if (currentInput !== '') {
            previousValue = currentInput;
            currentInput = '';
        }
        operator = op;
    }

    function computeResult() {
        if (previousValue === null || operator === null || currentInput === '') {
            return; // insufficient data
        }
        const result = calculate(previousValue, currentInput, operator);
        if (isNaN(result) || !isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Trim unnecessary decimal zeros
            currentInput = Number.isInteger(result) ? result.toString() : result.toString();
        }
        previousValue = null;
        operator = null;
        updateDisplay();
    }

    // Event Handlers
    function handleButtonClick(e) {
        const key = e.target.dataset.key;
        if (!key) return;
        routeKey(key);
    }

    function handleKeyPress(e) {
        // Normalize key values for operators
        let key = e.key;
        if (key === 'Enter') key = '=';
        if (key === 'Escape') key = 'c';
        if (key === '*') key = '*'; // already same
        if (key === 'x' || key === 'X') key = '*'; // some keyboards
        if (key === '/' || key === '÷') key = '/';
        if (key === '+' || key === '-') {
            // keep as is
        }
        if (key === 'Backspace') key = 'Backspace';
        // Only process known keys
        const validKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','=','c','Backspace'];
        if (validKeys.includes(key)) {
            e.preventDefault();
            routeKey(key);
        }
    }

    function routeKey(key) {
        switch (key) {
            case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '.':
                appendNumber(key);
                break;
            case '+': case '-': case '*': case '/':
                setOperator(key);
                break;
            case '=':
                computeResult();
                break;
            case 'c':
                resetCalculator();
                break;
            case 'Backspace':
                backspace();
                break;
            default:
                // ignore unknown keys
                break;
        }
    }

    // Event Listener Registration
    buttons.forEach(btn => btn.addEventListener('click', handleButtonClick));
    document.addEventListener('keydown', handleKeyPress);

    // Export for testing (optional)
    window.resetCalculator = resetCalculator;
})();