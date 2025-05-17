// Timer
let timeLeft = 25 * 60;
let timer;
const timerDisplay = document.getElementById('timer');

document.getElementById('start').addEventListener('click', () => {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
    }
  }, 1000);
});

document.getElementById('pause').addEventListener('click', () => {
  clearInterval(timer);
});

// Todo List
const todos = JSON.parse(localStorage.getItem('todos')) || [];

function renderTodos() {
  const list = document.getElementById('todos');
  list.innerHTML = todos.map(todo => `
    <li>
      ${todo.text}
      <button class="delete" data-id="${todo.id}">×</button>
    </li>
  `).join('');

  // Add delete handlers
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== btn.dataset.id);
      saveTodos();
    });
  });
}

document.getElementById('add').addEventListener('click', () => {
  const input = document.getElementById('todo-input');
  if (input.value) {
    todos.push({ id: Date.now(), text: input.value });
    input.value = '';
    saveTodos();
  }
});

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
  renderTodos();
}

// Init
renderTodos();