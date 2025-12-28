// Pomodoro Timer Logic
// Constants
const DEFAULT_WORK = 25;
const DEFAULT_BREAK = 5;
const ALERT_SOUND_URL = 'https://www.myinstants.com/media/sounds/bell-ring-01.mp3';

// Mutable state
let workDuration = DEFAULT_WORK;
let breakDuration = DEFAULT_BREAK;
let remainingSeconds = workDuration * 60;
let timerInterval = null;
let isRunning = false;
let currentSession = 'work'; // 'work' or 'break'

/**
 * Formats seconds into minutes and seconds strings padded to two digits.
 * @param {number} sec Total seconds.
 * @returns {{minutes: string, seconds: string}}
 */
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return { minutes: m, seconds: s };
}

/** Updates the timer display elements. */
function updateDisplay() {
  const { minutes, seconds } = formatTime(remainingSeconds);
  const minEl = document.getElementById('minutes');
  const secEl = document.getElementById('seconds');
  if (minEl) minEl.textContent = minutes;
  if (secEl) secEl.textContent = seconds;
}

/** Plays the alert sound. */
function playAlert() {
  const audio = new Audio(ALERT_SOUND_URL);
  audio.play();
}

/** Switches between work and break sessions. */
function switchSession() {
  // Toggle session type
  currentSession = currentSession === 'work' ? 'break' : 'work';

  // Set remaining seconds based on new session
  remainingSeconds = (currentSession === 'work' ? workDuration : breakDuration) * 60;

  // Update header text if present
  const header = document.getElementById('session-header');
  if (header) {
    header.textContent = currentSession === 'work' ? 'Work Session' : 'Break Session';
  }

  // Alert the user and refresh display
  playAlert();
  updateDisplay();
}

/** Starts the timer countdown. */
function startTimer() {
  if (isRunning) return;
  isRunning = true;

  // Button state management
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  if (startBtn) startBtn.disabled = true;
  if (pauseBtn) pauseBtn.disabled = false;
  if (resetBtn) resetBtn.disabled = false;

  timerInterval = setInterval(() => {
    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      switchSession();
      // Automatically start the next session
      startTimer();
    } else {
      remainingSeconds--;
      updateDisplay();
    }
  }, 1000);
}

/** Pauses the timer. */
function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;

  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  if (startBtn) startBtn.disabled = false;
  if (pauseBtn) pauseBtn.disabled = true;
}

/** Resets the timer to initial state. */
function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  currentSession = 'work';

  // Retrieve durations from inputs or fallback to defaults
  const workInput = document.getElementById('work-duration');
  const breakInput = document.getElementById('break-duration');
  workDuration = workInput ? Math.max(1, parseInt(workInput.value, 10) || DEFAULT_WORK) : DEFAULT_WORK;
  breakDuration = breakInput ? Math.max(1, parseInt(breakInput.value, 10) || DEFAULT_BREAK) : DEFAULT_BREAK;

  remainingSeconds = workDuration * 60;

  // Button state management
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  if (startBtn) startBtn.disabled = false;
  if (pauseBtn) pauseBtn.disabled = true;
  if (resetBtn) resetBtn.disabled = true;

  // Reset header if present
  const header = document.getElementById('session-header');
  if (header) header.textContent = 'Work Session';

  updateDisplay();
}

// Event listeners for user interaction
document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('work-duration').addEventListener('change', (e) => {
  const val = Math.max(1, parseInt(e.target.value, 10));
  workDuration = isNaN(val) ? DEFAULT_WORK : val;
  if (!isRunning && currentSession === 'work') {
    remainingSeconds = workDuration * 60;
    updateDisplay();
  }
});

document.getElementById('break-duration').addEventListener('change', (e) => {
  const val = Math.max(1, parseInt(e.target.value, 10));
  breakDuration = isNaN(val) ? DEFAULT_BREAK : val;
  if (!isRunning && currentSession === 'break') {
    remainingSeconds = breakDuration * 60;
    updateDisplay();
  }
});

// Initialise display on page load
updateDisplay();
