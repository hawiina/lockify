// State
let timeLeft = 25 * 60; // 25 minutes work by default
let timer;
let isWorkSession = true;
let sessionCount = 0;
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const pastelColors = ['#a2d2ff', '#ffafcc', '#bde0fe', '#cdb4db', '#ffd6a5'];

// DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add');
const todosContainer = document.getElementById('todos');

// Pomodoro Timer
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  document.title = `${minutes}:${seconds.toString().padStart(2, '0')} - ${isWorkSession ? 'Work' : 'Break'}`;
  
  // Visual feedback
  timerDisplay.style.color = isWorkSession ? '#ff6b6b' : '#51cf66';
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleSessionEnd();
    }
  }, 1000);
}

function handleSessionEnd() {
  const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
  audio.play();
  
  if (isWorkSession) {
    sessionCount++;
    const isLongBreak = sessionCount % 4 === 0;
    timeLeft = isLongBreak ? 15 * 60 : 5 * 60;
    alert(isLongBreak ? 
      "Great work! Take a 15 minute break. 🎉" : 
      "Time for a 5 minute break! ☕");
  } else {
    timeLeft = 25 * 60;
    alert("Break's over! Ready to focus? 🚀");
  }
  
  isWorkSession = !isWorkSession;
  updateTimer();
  startTimer(); // Auto-start next session
}

// Timer Controls
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => clearInterval(timer));
resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  timeLeft = isWorkSession ? 25 * 60 : 5 * 60;
  updateTimer();
});

// Todo List
function renderTodos() {
  todosContainer.innerHTML = todos.map(todo => `
    <div class="task-item" data-id="${todo.id}">
      <input type="checkbox" class="task-checkbox" ${todo.done ? 'checked' : ''}>
      <span class="task-text" style="${todo.done ? 'text-decoration: line-through; opacity: 0.7;' : ''}">
        ${todo.text}
      </span>
      <div class="task-actions">
        <button class="pastel-btn notes-btn" style="background: ${pastelColors[Math.floor(Math.random() * pastelColors.length)]}">
           Notes
        </button>
        <button class="pastel-btn delete-btn"> Delete </button>
      </div>
      <textarea class="task-notes" placeholder="Add notes...">${todo.notes || ''}</textarea>
    </div>
  `).join('');

  // Event listeners for todos
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const taskId = e.target.closest('.task-item').dataset.id;
      const task = todos.find(t => t.id == taskId);
      task.done = e.target.checked;
      saveTodos();
      renderTodos();
    });
  });

  document.querySelectorAll('.notes-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.task-item').querySelector('.task-notes').classList.toggle('active');
    });
  });

  document.querySelectorAll('.task-notes').forEach(notes => {
    notes.addEventListener('blur', (e) => {
      const taskId = e.target.closest('.task-item').dataset.id;
      todos.find(t => t.id == taskId).notes = e.target.value;
      saveTodos();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      todos = todos.filter(t => t.id != e.target.closest('.task-item').dataset.id);
      saveTodos();
      renderTodos();
    });
  });
}

addBtn.addEventListener('click', () => {
  if (todoInput.value.trim()) {
    todos.push({
      id: Date.now(),
      text: todoInput.value.trim(),
      done: false,
      notes: ''
    });
    todoInput.value = '';
    saveTodos();
    renderTodos();
  }
});

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Time and Date
function updateTime() {
  const now = new Date();
  document.getElementById('time').textContent = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', minute: '2-digit', hour12: true 
  });
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  });
}

// Background Images
const backgrounds = [

 "url('./images/snoopydesk.jpg')",  // Example if images are in /images folder
  "url('./images/jiji1.jpg')",
  "url('./images/miffy1.jpg')",
  "url('./images/snoopydesk1.jpg')",
  "url('./images/snoopydesk2.jpg')",
  "url('./images/snoopydesk3.jpg')",
  "url('./images/snoopydesk4.jpg')",
  "url('./images/snoopydesk5.jpg')",
  "url('./images/snoopydesk6.jpg')",
  "url('./images/snoopydesk7.jpg')",
  "url('./images/miffy2.jpg')",
  "url('./images/miffy3.jpg')",
  "url('./images/miffy4.jpg')",
  "url('./images/sponge.jpg')",
  "url('./images/sponge1.jpg')",
  "url('./images/sponge2.jpg')",
  "url('./images/sponge3.jpg')",
  "url('./images/adventure.jpg')",
  "url('./images/adventure1.jpg')",
  "url('./images/adventure2.jpg')",
  "url('./images/adventure3.jpg')",
  "url('./images/adventure4.jpg')",
  "url('./images/adventure5.jpg')",
];

function setRandomBackground() {
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = randomBg;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.transition = "background-image 0.5s ease";
}

// Draggable Container
function makeContainerDraggable() {
  const container = document.querySelector('.container');
  if (!container) return;

  let isDragging = false;
  let offsetX, offsetY;

  // Load saved position
  const savedPosition = localStorage.getItem('widgetPosition');
  if (savedPosition) {
    const { left, top } = JSON.parse(savedPosition);
    container.style.left = left;
    container.style.top = top;
    container.style.transform = 'none';
  }

  container.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || e.target.closest('button, input, #todos')) return;
    isDragging = true;
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    container.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    container.style.left = `${e.clientX - offsetX}px`;
    container.style.top = `${e.clientY - offsetY}px`;
    container.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    container.style.cursor = 'move';
    localStorage.setItem('widgetPosition', JSON.stringify({
      left: container.style.left,
      top: container.style.top
    }));
  });
}

// Search Functionality
function setupSearch() {
  const searchForm = document.getElementById('search-form');
  const searchEngine = document.querySelector('.search-engine');
  
  searchEngine?.addEventListener('change', function() {
    switch(this.value) {
      case 'bing': searchForm.action = 'https://www.bing.com/search'; break;
      case 'duckduckgo': searchForm.action = 'https://duckduckgo.com/'; break;
      case 'youtube': 
        searchForm.action = 'https://www.youtube.com/results';
        searchForm.setAttribute('name', 'search_query');
        break;
      case 'wikipedia': 
        searchForm.action = 'https://en.wikipedia.org/w/index.php';
        searchForm.setAttribute('name', 'search');
        break;
      default: // Google
        searchForm.action = 'https://www.google.com/search';
        searchForm.setAttribute('name', 'q');
    }
  });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  updateTimer();
  renderTodos();
  updateTime();
  setInterval(updateTime, 1000);
  setRandomBackground();
  makeContainerDraggable();
  setupSearch();
});
