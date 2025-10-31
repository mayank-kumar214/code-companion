// Tic Tac Toe game logic
// Vanilla JavaScript implementation with DOM manipulation
// No external dependencies

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const PLAYER_X = 'X';
  const PLAYER_O = 'O';

  // State variables
  let board = Array(9).fill(null);
  let currentPlayer = PLAYER_X;
  let gameActive = true;
  let darkMode = false;

  // DOM references
  const boardEl = document.getElementById('board');
  const turnIndicatorEl = document.getElementById('turn-indicator');
  const restartBtn = document.getElementById('restart-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Initialize the game
  const initGame = () => {
    board = Array(9).fill(null);
    currentPlayer = PLAYER_X;
    gameActive = true;
    renderBoard();
    updateTurnIndicator();
  };

  // Render the board cells
  const renderBoard = () => {
    // Clear any existing cells
    boardEl.innerHTML = '';

    board.forEach((value, index) => {
      const cell = document.createElement('div');
      cell.classList.add('cell', 'flex', 'items-center', 'justify-center', 'h-20', 'w-20', 'border', 'border-gray-400', 'text-4xl', 'font-bold', 'cursor-pointer');
      cell.dataset.index = index.toString();
      cell.addEventListener('click', handleCellClick);
      boardEl.appendChild(cell);
    });
  };

  // Handle a cell click
  const handleCellClick = (event) => {
    const target = event.target;
    const index = Number(target.dataset.index);

    if (!gameActive || board[index] !== null) return;

    board[index] = currentPlayer;
    target.textContent = currentPlayer;
    target.classList.add('fade-in');

    checkResult();
    if (gameActive) {
      switchTurn();
    }
  };

  // Switch player turn
  const switchTurn = () => {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    updateTurnIndicator();
  };

  // Update the turn indicator UI
  const updateTurnIndicator = () => {
    turnIndicatorEl.textContent = `${currentPlayer}'s Turn`;
    turnIndicatorEl.classList.remove('player-x', 'player-o');
    turnIndicatorEl.classList.add(currentPlayer === PLAYER_X ? 'player-x' : 'player-o');
  };

  // Check for win or draw
  const checkResult = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        handleWin(combo);
        return;
      }
    }

    // Draw condition: no nulls left
    if (!board.includes(null)) {
      handleDraw();
    }
  };

  // Handle winning scenario
  const handleWin = (combo) => {
    gameActive = false;
    combo.forEach((i) => {
      const cell = boardEl.children[i];
      if (cell) cell.classList.add('win');
    });
    turnIndicatorEl.textContent = `${currentPlayer} Wins!`;
    turnIndicatorEl.classList.remove('player-x', 'player-o');
    turnIndicatorEl.classList.add('winner');
  };

  // Handle draw scenario
  const handleDraw = () => {
    gameActive = false;
    Array.from(boardEl.children).forEach((cell) => {
      cell.classList.add('draw');
    });
    turnIndicatorEl.textContent = 'Draw!';
    turnIndicatorEl.classList.remove('player-x', 'player-o');
    turnIndicatorEl.classList.add('draw');
  };

  // Restart the game
  const restartGame = () => {
    // Remove any win/draw styling from cells
    Array.from(boardEl.children).forEach((cell) => {
      cell.classList.remove('win', 'draw', 'fade-in');
      cell.textContent = '';
    });
    initGame();
  };

  // Theme toggle handler
  const toggleTheme = () => {
    darkMode = !darkMode;
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
  };

  // Attach control button listeners
  restartBtn?.addEventListener('click', restartGame);
  themeToggleBtn?.addEventListener('click', toggleTheme);

  // Kick‑off the game
  initGame();
});
