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
        <button class="pastel-btn delete-btn"> delete </button>
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