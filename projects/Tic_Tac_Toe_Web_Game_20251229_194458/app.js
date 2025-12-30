// app.js – Tic‑Tac‑Toe game logic (production ready)
// ------------------------------------------------------------
// Implements the full feature set described in the task brief.
// ------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // ---------- DOM ELEMENTS (exact selectors) ----------
  const boardEl = document.getElementById('game-board');
  const cells = boardEl.querySelectorAll('.cell');
  const turnEl = document.getElementById('current-turn');
  const playerXScoreEl = document.querySelector('#player-x-score .score-value');
  const playerOScoreEl = document.querySelector('#player-o-score .score-value');
  const resetBtn = document.getElementById('reset-btn');
  const newGameBtn = document.getElementById('new-game-btn');

  // ---------- GAME STATE ----------
  let boardState = Array(9).fill(null); // null | 'X' | 'O'
  let currentPlayer = 'X';
  let scores = { X: 0, O: 0 };
  let gameActive = true; // prevents moves after a win

  // ---------- AUDIO ----------
  const moveSound = new Audio('move.mp3');
  const winSound = new Audio('win.mp3');

  // ---------- CONSTANTS ----------
  const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // ---------- LOCAL STORAGE ----------
  const STORAGE_KEY = 'ticTacToeScores';
  const loadScore = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          scores = { X: parsed.X || 0, O: parsed.O || 0 };
        }
      } catch (e) {
        console.warn('Failed to parse stored scores', e);
      }
    }
    // reflect in UI
    playerXScoreEl.textContent = scores.X;
    playerOScoreEl.textContent = scores.O;
  };

  const saveScore = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  };

  // ---------- RENDERING ----------
  const renderBoard = () => {
    cells.forEach((cell, i) => {
      const value = boardState[i];
      cell.textContent = value ? value : '';
      if (value) {
        cell.dataset.player = value;
        cell.disabled = true; // prevent further clicks on occupied cells
      } else {
        delete cell.dataset.player;
        cell.disabled = false;
      }
      cell.classList.remove('highlight');
    });
  };

  // ---------- TURN INDICATOR ----------
  const toggleTurnIndicator = () => {
    // Switch player first, then update UI
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnEl.textContent = currentPlayer;
    // Brief animation – add class and remove after animation duration (300ms)
    turnEl.classList.add('turn-animate');
    setTimeout(() => turnEl.classList.remove('turn-animate'), 300);
  };

  // ---------- SCORE MANAGEMENT ----------
  const updateScore = (winner) => {
    if (!winner) return;
    scores[winner]++;
    if (winner === 'X') {
      playerXScoreEl.textContent = scores.X;
    } else {
      playerOScoreEl.textContent = scores.O;
    }
    saveScore();
  };

  // ---------- WIN CHECK ----------
  const checkWin = () => {
    for (const combo of WIN_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        // Highlight winning cells
        combo.forEach(idx => cells[idx].classList.add('highlight'));
        // Update scores and play win sound
        updateScore(boardState[a]);
        winSound.currentTime = 0;
        winSound.play();
        gameActive = false;
        return boardState[a]; // return winner
      }
    }
    // Check for draw – no winner and board full
    if (boardState.every(cell => cell !== null)) {
      // Draw: simply deactivate the board (no score change)
      gameActive = false;
    }
    return null;
  };

  // ---------- EVENT HANDLERS ----------
  const handleCellClick = (event) => {
    if (!gameActive) return;
    const cell = event.currentTarget;
    const idx = Number(cell.dataset.index);
    if (boardState[idx]) return; // already occupied – safety check

    // Apply move
    boardState[idx] = currentPlayer;
    cell.dataset.player = currentPlayer;
    cell.textContent = currentPlayer;
    cell.disabled = true;
    moveSound.currentTime = 0;
    moveSound.play();

    // Evaluate board
    const winner = checkWin();
    if (!winner && gameActive) {
      // No win yet – switch turn
      toggleTurnIndicator();
    }
  };

  // ---------- RESET / NEW GAME ----------
  const resetGame = () => {
    boardState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';
    renderBoard();
    turnEl.textContent = currentPlayer;
  };

  const startNewGame = () => {
    resetGame();
    scores = { X: 0, O: 0 };
    playerXScoreEl.textContent = 0;
    playerOScoreEl.textContent = 0;
    localStorage.removeItem(STORAGE_KEY);
  };

  // ---------- KEYBOARD NAVIGATION (optional) ----------
  const focusCell = (index) => {
    const cell = cells[index];
    if (cell) cell.focus();
  };

  const handleKeyDown = (e) => {
    const focused = document.activeElement;
    const isCell = focused && focused.classList.contains('cell');
    if (!isCell) return;
    const idx = Number(focused.dataset.index);
    let targetIdx = null;
    switch (e.key) {
      case 'ArrowUp':
        if (idx >= 3) targetIdx = idx - 3;
        break;
      case 'ArrowDown':
        if (idx <= 5) targetIdx = idx + 3;
        break;
      case 'ArrowLeft':
        if (idx % 3 !== 0) targetIdx = idx - 1;
        break;
      case 'ArrowRight':
        if (idx % 3 !== 2) targetIdx = idx + 1;
        break;
      case 'Enter':
      case ' ': // space also triggers click
        e.preventDefault();
        focused.click();
        break;
      default:
        return; // ignore other keys
    }
    if (targetIdx !== null) {
      e.preventDefault();
      focusCell(targetIdx);
    }
  };

  // ---------- INITIALISATION ----------
  const initGame = () => {
    loadScore();
    renderBoard();
    turnEl.textContent = currentPlayer;
    // Attach listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
    newGameBtn.addEventListener('click', startNewGame);
    document.addEventListener('keydown', handleKeyDown);
  };

  initGame();
});
