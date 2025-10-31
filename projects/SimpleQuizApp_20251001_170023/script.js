// script.js - Simple Quiz Application
// Implements quiz logic as per specification

// Step 1: Define the quiz data structure
const quizData = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctIndex: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correctIndex: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctIndex: 3,
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Python", "C#", "JavaScript", "Java"],
    correctIndex: 2,
  },
];
// Expose for testing (e.g., in console or external scripts)
if (typeof window !== "undefined") {
  window.quizData = quizData;
}

// Step 2: Cache DOM elements
const startBtn = document.getElementById("start-btn");
const homeScreen = document.getElementById("home-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answerList = document.getElementById("answer-list");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score-display");
const restartBtn = document.getElementById("restart-btn");

// Step 3: State management variables
let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = null;

// Utility: Show a specific screen, hide others
function showScreen(screenElement) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach((el) => {
    if (el === screenElement) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}

// Step 5: Render a question
function renderQuestion(index) {
  const data = quizData[index];
  if (!data) return;

  // Update question text
  questionText.textContent = data.question;

  // Clear previous answers
  answerList.innerHTML = "";

  // Create answer buttons
  data.options.forEach((option, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer-btn";
    btn.dataset.index = i.toString();
    btn.textContent = option;
    btn.addEventListener("click", handleAnswerSelect);
    li.appendChild(btn);
    answerList.appendChild(li);
  });

  // Reset selection state
  selectedOptionIndex = null;
  nextBtn.classList.add("hidden");
}

// Step 6: Handle answer selection
function handleAnswerSelect(event) {
  const btn = event.currentTarget;
  const index = Number(btn.dataset.index);

  // Remove .selected from any previously selected button
  const allButtons = answerList.querySelectorAll("button");
  allButtons.forEach((b) => b.classList.remove("selected"));

  // Add .selected to the clicked button
  btn.classList.add("selected");
  selectedOptionIndex = index;

  // Reveal Next button
  nextBtn.classList.remove("hidden");
}

// Step 7: Advance to next question
function goToNext() {
  // Guard against missing selection
  if (selectedOptionIndex === null) return;

  const currentData = quizData[currentQuestionIndex];
  if (selectedOptionIndex === currentData.correctIndex) {
    score += 1;
  }

  currentQuestionIndex += 1;

  if (currentQuestionIndex < quizData.length) {
    renderQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

// Step 8: Show final results
function showResults() {
  scoreDisplay.textContent = `You scored ${score} out of ${quizData.length}`;
  showScreen(resultScreen);
}

// Step 9: Restart flow
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  selectedOptionIndex = null;
  renderQuestion(0);
  showScreen(questionScreen);
}

// Step 10: Attach event listeners
if (startBtn) {
  startBtn.addEventListener("click", () => {
    showScreen(questionScreen);
    renderQuestion(0);
  });
}
if (nextBtn) {
  nextBtn.addEventListener("click", goToNext);
}
if (restartBtn) {
  restartBtn.addEventListener("click", restartQuiz);
}

// Step 11: Initialize app on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  showScreen(homeScreen);
});
