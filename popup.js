document.addEventListener('DOMContentLoaded', function() {
  // Timer elements
  const timerDisplay = document.getElementById('timer');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const modeBtns = document.querySelectorAll('.mode-btn');
  
  // Todo elements
  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const todoList = document.getElementById('todo-list');
  
  // Background selector
  const bgSelect = document.getElementById('bg-select');
  
  // Timer variables
  let timeLeft = 25 * 60;
  let timerInterval;
  let isRunning = false;
  let currentMode = 'pomodoro';
  
  // Initialize
  loadTodos();
  updateTimerDisplay();
  loadBackground();
  
  // Timer controls
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  
  // Mode selection
  modeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      modeBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentMode = this.textContent.toLowerCase();
      const minutes = parseInt(this.dataset.minutes);
      timeLeft = minutes * 60;
      resetTimer();
    });
  });
  
  // Todo functionality
  addBtn.addEventListener('click', addTodo);
  todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') addTodo();
  });
  
  // Background selection
  bgSelect.addEventListener('change', changeBackground);
  
  // Timer functions
  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'Time is up!',
          message: `${currentMode} session has ended.`
        });
      }
    }, 1000);
  }
  
  function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
  }
  
  function resetTimer() {
    pauseTimer();
    const activeMode = document.querySelector('.mode-btn.active');
    const minutes = parseInt(activeMode.dataset.minutes);
    timeLeft = minutes * 60;
    updateTimerDisplay();
  }
  
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Todo functions
  function addTodo() {
    const task = todoInput.value.trim();
    if (task) {
      const li = document.createElement('li');
      li.innerHTML = `
        ${task}
        <button class="delete-btn">×</button>
      `;
      todoList.appendChild(li);
      todoInput.value = '';
      saveTodos();
      
      li.querySelector('.delete-btn').addEventListener('click', function() {
        li.remove();
        saveTodos();
      });
    }
  }
  
  function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
      todos.push(li.textContent.replace('×', '').trim());
    });
    chrome.storage.local.set({ todos });
  }
  
  function loadTodos() {
    chrome.storage.local.get(['todos'], function(result) {
      if (result.todos) {
        result.todos.forEach(task => {
          todoInput.value = task;
          addTodo();
          todoInput.value = '';
        });
      }
    });
  }
  
  // Background functions
  function changeBackground() {
    const bg = bgSelect.value;
    document.body.style.backgroundImage = `url('images/${bg}.jpg')`;
    chrome.storage.local.set({ background: bg });
  }
  
  function loadBackground() {
    chrome.storage.local.get(['background'], function(result) {
      const bg = result.background || 'bg1';
      bgSelect.value = bg;
      document.body.style.backgroundImage = `url('images/${bg}.jpg')`;
    });
  }
});
