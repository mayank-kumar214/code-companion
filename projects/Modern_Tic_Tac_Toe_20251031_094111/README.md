# Modern Tic Tac Toe

A lightweight, responsive Tic Tac Toe web app built with **HTML**, **CSS**, and **vanilla JavaScript**. The game features a clean UI powered by Tailwind‑style utility classes, a dark‑mode toggle, and full keyboard‑accessible controls.

---

## ✨ Tech Stack
- **HTML5** – Semantic markup and ARIA attributes for accessibility.
- **CSS3** – Tailwind‑like utility classes, custom theme variables, and responsive layout.
- **JavaScript (ES6+)** – Game logic, DOM manipulation, and UI interactions.

---

## 🚀 Features
- **Two‑player gameplay** (X vs O) with turn indicator.
- **Win detection** with highlighted winning cells.
- **Draw detection** with board‑wide visual cue.
- **Restart button** to start a new match at any time.
- **Theme toggle** – switch between light and dark modes.
- **Responsive design** – works on mobile, tablet, and desktop.
- **Accessible UI** – ARIA live region for turn updates and keyboard‑friendly focus states.

---

## 📦 Installation / Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your‑username/modern-tic-tac-toe.git
   cd modern-tic-tac-toe
   ```
2. **Open the game**
   - Simply open `index.html` in your favourite browser (no build step or server required).
   - Alternatively, you can serve the folder with a static server (e.g., `npx serve .`).

---

## 🎮 Usage Instructions
1. **Play** – Click on any empty cell to place your mark (X starts first). The turn indicator updates automatically.
2. **Restart** – Click the **Restart Game** button to clear the board and begin a new match.
3. **Toggle Theme** – Click the **Toggle Theme** button to switch between light and dark themes.
4. **Responsive behavior** – The board scales down on smaller screens (max‑width 300 px on phones) while maintaining square cells.

---

## 📸 Screenshots
> *(Replace the placeholders with actual screenshots when publishing)*

| Light Theme | Dark Theme |
|------------|------------|
| ![Light Theme](./screenshots/light.png) | ![Dark Theme](./screenshots/dark.png) |

---

## 📂 Project Structure
```
├─ index.html      # Main HTML entry point
├─ script.js       # Game logic and UI interactions
├─ styles.css      # Tailwind‑style utilities & custom theming
└─ README.md       # Documentation (you are here!)
```

---

## 🤝 Contribution Guidelines
Contributions are welcome! If you’d like to improve the project:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and ensure the app still works by opening `index.html`.
4. Submit a pull request with a clear description of the changes.

Please keep the following in mind:
- Follow the existing coding style (2‑space indentation, semantic class names).
- Do not introduce external libraries; the project intentionally uses only vanilla JavaScript.
- Update this README if you add new features or change the file structure.

---

## 📄 License
This project is licensed under the **MIT License** – see the `LICENSE` file for details.
