// State
let timeLeft = 25 * 60;
let timer;
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

// Timer
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

startBtn.addEventListener('click', () => {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! 🎉");
    }
  }, 1000);
});

pauseBtn.addEventListener('click', () => clearInterval(timer));
resetBtn.addEventListener('click', () => {
  clearInterval(timer);
  timeLeft = 25 * 60;
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

  // Add event listeners
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
      const notes = e.target.closest('.task-item').querySelector('.task-notes');
      notes.classList.toggle('active');
    });
  });

  document.querySelectorAll('.task-notes').forEach(notes => {
    notes.addEventListener('blur', (e) => {
      const taskId = e.target.closest('.task-item').dataset.id;
      const task = todos.find(t => t.id == taskId);
      task.notes = e.target.value;
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

// Initialize
updateTimer();
renderTodos();
function updateTime() {
  const now = new Date();
  
  // Time formatting (e.g., "2:45 PM")
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Date formatting (e.g., "Tuesday, May 21")
  const dateStr = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
  
  document.getElementById('time').textContent = timeStr;
  document.getElementById('date').textContent = dateStr;
}

// Update every second
updateTime();
setInterval(updateTime, 1000);

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
  // ... other images
];
function setRandomBackground() {
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = randomBg;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.transition = "background-image 0.5s ease";
}

// Run on page load
window.onload = setRandomBackground;