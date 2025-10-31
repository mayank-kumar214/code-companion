# Colorful Memory Match Game

## Overview
A fun, interactive memory matching game where players flip cards to find matching pairs. The game features a vibrant 4x4 grid, smooth flip animations, move counting, a timer, and sound effects, all wrapped in a responsive layout that works on both desktop and mobile devices.

## Features
- **4x4 grid** of colorful cards
- **Flip animation** for a polished visual experience
- **Match detection** with automatic removal of matched pairs
- **Move counter** to track player performance
- **Timer** to challenge speed
- **Restart button** to start a new game at any time
- **Responsive layout** using Flexbox/Grid for all screen sizes
- **Sound effects** for flips, matches, and game completion

## Tech Stack
- **HTML5** – semantic markup
- **CSS3** – Flexbox/Grid, custom properties for colors and animations
- **JavaScript (ES6+)** – game logic, DOM manipulation, and event handling

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/colorful-memory-match.git
   cd colorful-memory-match
   ```
2. **Open the game**
   - Simply double‑click `index.html` or open it in your browser.
3. **Optional: Run with a local server** (recommended for best compatibility)
   - Using Node.js:
     ```bash
     npx serve .
     ```
   - Using Python:
     ```bash
     python -m http.server 8000
     ```
   - Then navigate to `http://localhost:8000` in your browser.

## How to Play
- **Goal:** Find all matching pairs of cards as quickly as possible.
- **Controls:**
  1. Click (or tap) a card to flip it over.
  2. Click a second card to attempt a match.
  3. If the two cards match, they stay face‑up; otherwise they flip back after a short delay.
  4. The move counter increments each time you flip two cards.
  5. The timer starts on the first flip and stops when all pairs are matched.
  6. Use the **Restart** button to reset the board, timer, and move counter.

## Folder Structure
```
/ (project root)
├─ index.html          # Main HTML file
├─ style.css           # Styling and layout
├─ app.js              # Game logic and interactivity
└─ README.md           # Project documentation
```

## Customization Points
- **Colors:** Edit the CSS custom properties in `style.css` (e.g., `--card-bg`, `--primary-color`).
- **Board Size:** Adjust the `boardSize` variable in `app.js` and provide a matching set of card images or colors to change the grid dimensions (e.g., 6x6 for a larger challenge).
- **Sounds:** Replace the audio files referenced in `app.js` with your own sound effects.

## License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.
