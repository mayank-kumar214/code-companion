// Memory Matching Game
// --------------------------------------------------
// Constants
const BOARD_SIZE = 4;
const TOTAL_TILES = BOARD_SIZE * BOARD_SIZE;
// 8 distinct colors – each will appear twice (pair)
const COLORS = [
  '#e74c3c', '#3498db', '#f1c40f', '#2ecc71',
  '#9b59b6', '#e67e22', '#1abc9c', '#e84393'
];

// State variables
let firstFlipped = null;
let secondFlipped = null;
let moves = 0;
let timerInterval = null;
let secondsElapsed = 0;

// Optional sound effects (ensure files exist in the project root)
const flipSound = new Audio('flip.wav');
const matchSound = new Audio('match.wav');

/**
 * Fisher‑Yates shuffle – mutates the original array
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Initialise / reset the game board
 */
function initGame() {
  // Create a shuffled array of colors (pairs)
  const tileColors = shuffleArray([...COLORS, ...COLORS]); // length = 16

  const tiles = document.querySelectorAll('.tile');
  tiles.forEach((tile, i) => {
    const color = tileColors[i];
    // Store the colour for matching logic
    tile.dataset.color = color;
    // Apply colour to the back side via CSS custom property
    const back = tile.querySelector('.tile-back');
    if (back) back.style.setProperty('--tile-color', color);

    // Reset visual state
    tile.classList.remove('flipped', 'matched', 'no-match');
  });

  // Reset counters and UI
  moves = 0;
  secondsElapsed = 0;
  const moveCounterEl = document.getElementById('move-counter');
  if (moveCounterEl) moveCounterEl.textContent = `Moves: ${moves}`;
  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = `Time: ${formatTime(secondsElapsed)}`;

  // Clear any lingering selections
  firstFlipped = null;
  secondFlipped = null;

  // Attach click handlers (remove previous to avoid duplicates)
  tiles.forEach(tile => {
    tile.removeEventListener('click', handleTileClick);
    tile.addEventListener('click', handleTileClick);
  });
}

/**
 * Click handler for each tile
 */
function handleTileClick(event) {
  const tile = event.currentTarget;

  // Ignore clicks on tiles that are already matched or currently flipped
  if (tile.classList.contains('matched') || tile.classList.contains('flipped')) return;

  // Flip the tile visually
  tile.classList.add('flipped');
  // Play flip sound (ignore errors if file missing)
  flipSound.play().catch(() => {});

  // Start timer on the very first flip
  if (!timerInterval) startTimer();

  if (!firstFlipped) {
    firstFlipped = tile;
    return;
  }

  // Second tile selected
  secondFlipped = tile;
  moves++;
  const moveCounterEl = document.getElementById('move-counter');
  if (moveCounterEl) moveCounterEl.textContent = `Moves: ${moves}`;

  // Short pause before checking for a match
  setTimeout(checkMatch, 500);
}

/**
 * Compare the two currently flipped tiles
 */
function checkMatch() {
  if (!firstFlipped || !secondFlipped) return;

  const isMatch = firstFlipped.dataset.color === secondFlipped.dataset.color;

  if (isMatch) {
    // Matched – keep them flipped and mark as matched
    firstFlipped.classList.add('matched');
    secondFlipped.classList.add('matched');
    matchSound.play().catch(() => {});
    clearSelection();
  } else {
    // Not a match – show brief indicator then hide again
    firstFlipped.classList.add('no-match');
    secondFlipped.classList.add('no-match');
    setTimeout(() => {
      firstFlipped.classList.remove('flipped', 'no-match');
      secondFlipped.classList.remove('flipped', 'no-match');
      clearSelection();
    }, 800);
  }

  // After handling match/no‑match, verify if the game is finished
  setTimeout(checkGameEnd, 850);
}

/**
 * Reset the temporary selection variables
 */
function clearSelection() {
  firstFlipped = null;
  secondFlipped = null;
}

/**
 * Determine if all tiles are matched – if so, end the game
 */
function checkGameEnd() {
  const matchedTiles = document.querySelectorAll('.tile.matched');
  if (matchedTiles.length === TOTAL_TILES) {
    stopTimer();
    // Simple overlay – replace with a nicer UI if desired
    setTimeout(() => {
      alert(`Congratulations!\nTime: ${formatTime(secondsElapsed)}\nMoves: ${moves}`);
    }, 300);
  }
}

/**
 * Timer utilities
 */
function startTimer() {
  if (timerInterval) return; // already running
  timerInterval = setInterval(() => {
    secondsElapsed++;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.textContent = `Time: ${formatTime(secondsElapsed)}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const secs = String(totalSeconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

/**
 * Reset the entire game – used by the restart button
 */
function resetGame() {
  stopTimer();
  initGame();
}

// Event listeners for DOM ready and restart button
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) restartBtn.addEventListener('click', resetGame);
});
