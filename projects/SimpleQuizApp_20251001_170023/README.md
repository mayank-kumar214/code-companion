# SimpleQuizApp

## Brief Description
SimpleQuizApp is a lightweight, static web application that lets users take a multiple‑choice quiz. It runs entirely in the browser without any build tools or server‑side components. Users can start the quiz, answer questions, navigate through them, view their results, and restart the quiz.

---

## Tech Stack
- **HTML** – Structure of the application.
- **CSS** – Styling and responsive layout (Tailwind‑like utility classes are mimicked with custom CSS).
- **JavaScript** – Core quiz logic, DOM manipulation, and event handling.

---

## Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari, etc.).
- No additional software, package managers, or build tools are required.

---

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. **Open the app**
   - Locate the `index.html` file in the project root.
   - Double‑click the file or open it directly in your browser (e.g., drag & drop into a browser window).
   - The quiz will load automatically.

---

## Usage Guide
1. **Home** – The landing screen displays a brief welcome message and a **Start Quiz** button.
2. **Start** – Clicking **Start Quiz** loads the first question with answer options.
3. **Answer** – Select an answer and click **Next** (or **Submit** on the final question).
4. **Result** – After the last question, a result screen shows the total correct answers and a **Restart Quiz** button.
5. **Restart** – Clicking **Restart Quiz** returns you to the home screen, allowing the quiz to be taken again.

---

## Project Structure
| File | Purpose |
|------|---------|
| `index.html` | The main HTML page. Contains the markup for the home, quiz, and result screens. |
| `styles.css` | All styling rules, including layout, colors, and media queries for responsive design. |
| `script.js` | JavaScript logic handling quiz data, UI updates, navigation between screens, and result calculation. |

---

## Adding or Modifying Questions
The quiz questions are stored in the `quizData` array inside **`script.js`**. Each question follows this structure:
```js
{
  question: "Your question text?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  answer: 0 // index of the correct option (0‑based)
}
```
To add a new question, simply push a new object into the array. To edit an existing one, modify the `question`, `options`, or `answer` fields accordingly. After saving the file, reload `index.html` in the browser to see the changes.

---

## Responsive Design
`styles.css` includes media queries that adapt the layout for different screen widths:
- **Mobile (≤ 640px)** – Stacks content vertically, uses full‑width buttons, and provides comfortable tap targets.
- **Tablet (641 – 1024px)** – Increases spacing and font sizes for better readability.
- **Desktop (≥ 1025px)** – Centers the quiz container and adds subtle shadows.
These queries ensure the quiz looks great on phones, tablets, and desktop monitors.

---

## License
[Insert license information here]
