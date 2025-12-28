// Classic Snake Game Logic
// --------------------------------------------------
// This script assumes the following HTML structure (see index.html):
// <canvas class="game-canvas"></canvas>
// <span class="score-value"></span>
// <button class="restart-button"></button>

// ---------- DOM ELEMENTS ----------
const canvas = document.querySelector('.game-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('.score-value');
const restartBtn = document.querySelector('.restart-button');

// ---------- CONSTANTS ----------
const GRID_SIZE = 20; // size of each grid cell in pixels
const CANVAS_SIZE = canvas.width; // canvas is square (600px)
const CELLS_COUNT = CANVAS_SIZE / GRID_SIZE; // number of cells per side

// ---------- GAME STATE ----------
let snake = [{ x: 10, y: 10 }]; // initial position (grid coordinates)
let direction = { x: 0, y: 0 }; // no movement until a key is pressed
let food = { x: 0, y: 0 };
let score = 0;
let speed = 200; // ms per frame
let gameInterval = null;

// ---------- INITIALISATION ----------
function initGame() {
  // Reset state
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  speed = 200;
  placeFood();
  updateScore();

  // Enable/disable UI
  restartBtn.disabled = true;

  // Clear any existing loop
  if (gameInterval) clearTimeout(gameInterval);

  // Start the loop
  gameLoop();
}

// ---------- FOOD ----------
function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * CELLS_COUNT),
      y: Math.floor(Math.random() * CELLS_COUNT)
    };
    // Ensure food does not appear on the snake
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

// ---------- DRAWING ----------
function drawGame() {
  // Clear canvas
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--canvas-bg') || '#fff';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  drawSnake();
  drawFood();
}

function drawSnake() {
  const snakeColor = getComputedStyle(document.documentElement).getPropertyValue('--snake-color') || getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#4caf50';
  ctx.fillStyle = snakeColor.trim();
  snake.forEach(segment => {
    ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

// ---------- SNAKE LOGIC ----------
function updateSnake() {
  // Compute new head based on current direction
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Insert new head at the beginning of the array
  snake.unshift(newHead);

  // Check if food is eaten
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 1;
    updateScore();
    placeFood();
    increaseSpeed();
    // Do NOT remove tail – snake grows
  } else {
    // Remove tail segment to keep length constant
    snake.pop();
  }
}

// ---------- INPUT ----------
function changeDirection(event) {
  const key = event.key;
  // Map arrow keys to direction vectors
  const directionMap = {
    ArrowUp:    { x: 0, y: -1 },
    ArrowDown:  { x: 0, y: 1 },
    ArrowLeft:  { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };
  if (!directionMap[key]) return; // ignore other keys

  const newDir = directionMap[key];
  // Prevent reversing directly onto itself
  if (snake.length > 1) {
    const nextX = snake[0].x + newDir.x;
    const nextY = snake[0].y + newDir.y;
    if (nextX === snake[1].x && nextY === snake[1].y) return;
  }
  direction = newDir;
}

// ---------- COLLISION ----------
function checkCollision() {
  const head = snake[0];
  // Wall collision
  if (head.x < 0 || head.x >= CELLS_COUNT || head.y < 0 || head.y >= CELLS_COUNT) {
    return true;
  }
  // Self collision (skip head index 0)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// ---------- GAME OVER ----------
function gameOver() {
  if (gameInterval) clearTimeout(gameInterval);
  alert('Game Over! Your score: ' + score);
  restartBtn.disabled = false;
}

// ---------- SCORE ----------
function updateScore() {
  scoreEl.textContent = score;
}

// ---------- SPEED CONTROL ----------
function increaseSpeed() {
  // Reduce delay by 10ms, but never faster than 50ms per frame
  speed = Math.max(50, speed - 10);
  // Restart loop with new speed if game is running
  if (gameInterval) {
    clearTimeout(gameInterval);
    gameLoop();
  }
}

// ---------- MAIN LOOP ----------
function gameLoop() {
  // Schedule next frame based on current speed
  gameInterval = setTimeout(() => {
    // If direction is zero (no movement), keep waiting – snake stays still until first input
    if (direction.x !== 0 || direction.y !== 0) {
      updateSnake();
      if (checkCollision()) {
        gameOver();
        return;
      }
    }
    drawGame();
    // Continue loop if not game over
    if (!gameInterval) return; // safety check
    gameLoop();
  }, speed);
}

// ---------- RESTART HANDLER ----------
function handleRestart() {
  initGame();
}

// ---------- EVENT LISTENERS ----------
window.addEventListener('keydown', changeDirection);
restartBtn.addEventListener('click', handleRestart);

// Start the game when the script loads
initGame();
