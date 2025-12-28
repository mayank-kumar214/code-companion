// Simple Calculator Logic
// Ensure the script runs after the DOM is fully loaded

document.addEventListener('DOMContentLoaded', () => {
  // Select the display element
  const display = document.querySelector('.calc-display');
  // Select all calculator buttons
  const buttons = document.querySelectorAll('.calc-button');

  // State variables
  let currentInput = '';
  let previousValue = null;
  let operator = null;

  // Update the calculator display
  const updateDisplay = () => {
    display.textContent = currentInput || (previousValue !== null ? previousValue : '0');
  };

  // Handle digit button press
  const handleDigit = (digit) => {
    // Prevent multiple leading zeros
    if (currentInput === '0' && digit === '0') return;
    if (currentInput === '0' && digit !== '0') {
      currentInput = digit;
    } else {
      currentInput += digit;
    }
    updateDisplay();
  };

  // Handle operator button press (+, -, *, /)
  const handleOperator = (op) => {
    if (currentInput !== '') {
      previousValue = parseFloat(currentInput);
    }
    operator = op;
    currentInput = '';
    updateDisplay();
  };

  // Perform the calculation based on the stored operator
  const calculateResult = () => {
    if (operator && previousValue !== null && currentInput !== '') {
      const currentNumber = parseFloat(currentInput);
      let result = 0;
      switch (operator) {
        case '+':
          result = previousValue + currentNumber;
          break;
        case '-':
          result = previousValue - currentNumber;
          break;
        case '*':
          result = previousValue * currentNumber;
          break;
        case '/':
          // Guard against division by zero
          result = currentNumber !== 0 ? previousValue / currentNumber : 'Error';
          break;
        default:
          result = currentNumber;
      }
      previousValue = typeof result === 'number' ? result : null;
      operator = null;
      currentInput = '';
    }
    updateDisplay();
  };

  // Reset the calculator to its initial state
  const clearAll = () => {
    currentInput = '';
    previousValue = null;
    operator = null;
    updateDisplay();
  };

  // Attach click listeners to each button
  buttons.forEach((button) => {
    const type = button.dataset.type;
    button.addEventListener('click', () => {
      const value = button.textContent.trim();
      switch (type) {
        case 'digit':
          handleDigit(value);
          break;
        case 'operator':
          handleOperator(value);
          break;
        case 'equals':
          calculateResult();
          break;
        case 'clear':
          clearAll();
          break;
        default:
          // No action for unknown types
          break;
      }
    });
  });

  // Initialise display
  updateDisplay();
});
