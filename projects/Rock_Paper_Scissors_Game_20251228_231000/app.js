// Rock Paper Scissors Game Logic
// --------------------------------------------------
// Constants
const CHOICES = ["rock", "paper", "scissors"];
const ICON_PATH = {
  rock: "icons/rock.svg",
  paper: "icons/paper.svg",
  scissors: "icons/scissors.svg",
};

// Scores
let playerScore = 0;
let computerScore = 0;

// Utility: get a random computer choice
const getComputerChoice = () => {
  const randomIndex = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[randomIndex];
};

// Determine result of a round
// Returns "win", "lose", or "tie"
const determineResult = (player, computer) => {
  if (player === computer) return "tie";
  const winMap = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };
  return winMap[player] === computer ? "win" : "lose";
};

// Update score DOM elements based on round result
const updateScore = (result) => {
  const playerScoreEl = document.getElementById("player-score");
  const computerScoreEl = document.getElementById("computer-score");

  if (result === "win") playerScore++;
  else if (result === "lose") computerScore++;

  playerScoreEl.innerText = playerScore;
  computerScoreEl.innerText = computerScore;
};

// Update visual display after a round
const updateDisplay = (playerChoice, computerChoice, result) => {
  const playerImg = document.getElementById("player-choice-img");
  const computerImg = document.getElementById("computer-choice-img");
  const resultText = document.getElementById("result-text");

  // Set images
  playerImg.src = ICON_PATH[playerChoice];
  playerImg.alt = playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1);
  computerImg.src = ICON_PATH[computerChoice];
  computerImg.alt = computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1);

  // Set result message
  if (result === "win") resultText.innerText = "You Win!";
  else if (result === "lose") resultText.innerText = "You Lose!";
  else resultText.innerText = "Tie!";
};

// Reset the game state and UI
const resetGame = () => {
  playerScore = 0;
  computerScore = 0;
  document.getElementById("player-score").innerText = "0";
  document.getElementById("computer-score").innerText = "0";
  document.getElementById("player-choice-img").src = "";
  document.getElementById("player-choice-img").alt = "";
  document.getElementById("computer-choice-img").src = "";
  document.getElementById("computer-choice-img").alt = "";
  document.getElementById("result-text").innerText = "Make your move!";
};

// Attach event listeners after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Choice buttons
  const choiceButtons = document.querySelectorAll(".choice-btn");
  choiceButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const playerChoice = btn.dataset.choice;
      const computerChoice = getComputerChoice();
      const result = determineResult(playerChoice, computerChoice);
      updateDisplay(playerChoice, computerChoice, result);
      updateScore(result);
    });
  });

  // Reset button
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
  }
});
