# Classic Snake Game

## Overview

A simple, classic **Snake** game built with vanilla web technologies. The player controls a growing snake that moves around a responsive canvas, eating food to increase its length and score. The game speeds up as the snake grows, and it ends when the snake collides with the walls or itself.

## Features

- **Keyboard Controls** – Use the arrow keys (← ↑ → ↓) to change the snake’s direction.
- **Real‑time Score** – The current score is displayed and updates instantly when the snake eats food.
- **Speed Increase** – The snake’s movement speed increases gradually as the score rises, making the game more challenging.
- **Game‑Over Detection** – The game automatically ends when the snake hits a wall or its own body.
- **Responsive Canvas** – The playing area adapts to the size of the browser window while maintaining the grid layout.
- **Restart Button** – A visible button allows the player to restart the game without reloading the page.

## Tech Stack

- **HTML5** – Semantic markup (`<header>`, `<main>`, `<section>`, etc.).
- **CSS3** – Flexbox/Grid for layout, CSS variables for easy color customization, and responsive design.
- **JavaScript (ES6+)** – Game logic, DOM manipulation, and event handling.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/classic-snake-game.git
   cd classic-snake-game
   ```
2. **Open the game**
   - Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
   - No additional build steps or server are required.

## Controls

- **Arrow Keys** – Move the snake up, down, left, or right.
- The snake cannot reverse direction directly (e.g., moving left then immediately right).

## Restarting the Game

- Click the **Restart** button located below the canvas to reset the game state, score, and speed.
- Alternatively, refresh the page to start a new session.

## Customization Points

- **Grid Size** – Adjust the `GRID_SIZE` constant in `app.js` to change the number of cells per row/column.
- **Colors** – Edit the CSS variables in `style.css` to change the visual theme:
  ```css
  :root {
    --bg-color: #111;
    --snake-color: #4caf50;
    --food-color: #ff5722;
    --text-color: #fff;
  }
  ```
- **Speed Settings** – Modify the `initialSpeed` and `speedIncrement` values in `app.js` to control how quickly the snake moves and how fast the speed increases.

Enjoy playing and feel free to tweak the code to create your own variations!
