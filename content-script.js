// Create a floating timer div
const timerDiv = document.createElement('div');
timerDiv.id = 'floating-pomodoro';
timerDiv.innerHTML = `
  <div id="timer">25:00</div>
  <button id="start-btn">Start</button>
  <button id="pause-btn">Pause</button>
`;
document.body.appendChild(timerDiv);

// Style it (or use content-style.css)
timerDiv.style.position = 'fixed';
timerDiv.style.bottom = '20px';
timerDiv.style.right = '20px';
timerDiv.style.zIndex = '9999';
timerDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
timerDiv.style.padding = '10px';
timerDiv.style.borderRadius = '5px';
timerDiv.style.color = 'white';

// Add timer logic (simplified)
let timeLeft = 25 * 60;
let timerInterval;

document.getElementById('start-btn').addEventListener('click', () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = 
      `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`;
  }, 1000);
});

// Pause button logic
document.getElementById('pause-btn').addEventListener('click', () => {
  clearInterval(timerInterval);
});