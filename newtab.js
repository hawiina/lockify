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
      "Great work! Take a 15 minute break." : 
      "Time for a 5 minute break! ");
  } else {
    timeLeft = 25 * 60;
    alert("Break's over! Ready to focus?");
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
  "url('./images/miffy.jpg')",
  "url('./images/miffy2.jpg')",
  "url('./images/miffy3.jpg')",
  "url('./images/miffy4.jpg')",
  "url('./images/sponge.jpg')",
  "url('./images/sponge1.jpg')",
  "url('./images/sponge2.jpg')",
  "url('./images/sponge3.jpg')",
  "url('./images/sponge5.jpg')",
  "url('./images/adventure.jpg')",
  "url('./images/adventure1.jpg')",
  "url('./images/adventure2.jpg')",
  "url('./images/adventure3.jpg')",
  "url('./images/adventure4.jpg')",
  "url('./images/adventure5.jpg')",
  "url('./images/adventure6.jpg')",
  "url('./images/adventure7.jpg')",
  "url('./images/adventure8.jpg')",
  "url('./images/adventure9.jpg')",
  "url('./images/adventure10.jpg')",
  "url('./images/adventure11.jpg')",
  "url('./images/adventure12.jpg')",
  "url('./images/adventure13.jpg')",
  "url('./images/adventure14.jpg')",
  "url('./images/totoro1.jpg')",
];

function setRandomBackground() {
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  document.body.style.backgroundImage = randomBg;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.transition = "background-image 0.5s ease";
}

// Unified Draggable System
function setupDraggables() {
  // Make main container draggable
  makeDraggable('.container', 'widgetPosition');
  
  // Make quote widget draggable (with separate position memory)
  makeDraggable('.quote-widget', 'quoteWidgetPosition');
}

function makeDraggable(selector, storageKey) {
  const element = document.querySelector(selector);
  if (!element) return;

  let isDragging = false;
  let offsetX, offsetY;

  // Initialize position
  element.style.position = 'absolute';
  
  // Load saved position
  const savedPosition = localStorage.getItem(storageKey);
  if (savedPosition) {
    const { left, top } = JSON.parse(savedPosition);
    element.style.left = left;
    element.style.top = top;
    element.style.transform = 'none';
  } else {
    // Set default positions
    if (selector === '.container') {
      element.style.left = '50%';
      element.style.top = '50%';
      element.style.transform = 'translate(-50%, -50%)';
    } else if (selector === '.quote-widget') {
      element.style.right = '30px';
      element.style.top = '30px';
    }
  }

  element.addEventListener('mousedown', (e) => {
    // For container: only drag on empty areas
    // For quote widget: drag anywhere on the widget
    const shouldDrag = selector === '.quote-widget' 
      ? e.target.closest('.quote-widget')
      : !e.target.closest('button, input, #todos');
    
    if (e.button === 0 && shouldDrag) {
      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      element.style.cursor = 'grabbing';
      element.style.zIndex = 100; // Bring to front when dragging
      e.preventDefault();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;
    element.style.transform = 'none';
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    element.style.cursor = 'move';
    element.style.zIndex = 10;
    localStorage.setItem(storageKey, JSON.stringify({
      left: element.style.left,
      top: element.style.top
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
  setupDraggables();
  updateTimer();
  renderTodos();
  updateTime();
  setInterval(updateTime, 1000);
  setRandomBackground();
  makeContainerDraggable();
  setupSearch();
});

const quotes = [
  // ADVENTURE TIME (10 quotes)
  {
    text: "Dude, suckin' at something is the first step to being sorta good at something.",
    source: "Jake (Adventure Time)"
  },
  {
    text: "Everything small is just a smaller version of something big.",
    source: "Finn (Adventure Time)"
  },
  {
    text: "You gotta focus on what's real, man.",
    source: "Jake (Adventure Time)"
  },
  {
    text: "Making people happy is the best kind of wizardry.",
    source: "Marceline (Adventure Time)"
  },
  {
    text: "Homies help homies. Always.",
    source: "Finn (Adventure Time)"
  },
  {
    text: "Bad biscuits make the baker broke, bro.",
    source: "Jake (Adventure Time)"
  },
  {
    text: "Responsibility demands sacrifice.",
    source: "Ice King (Adventure Time)"
  },
  {
    text: "Being crazy isn't enough to make you special.",
    source: "Princess Bubblegum (Adventure Time)"
  },
  {
    text: "People make mistakes. It's part of growing up.",
    source: "Flame Princess (Adventure Time)"
  },
  {
    text: "This cosmic dance of bursting decadence and withheld permissions twists all our arms collectively.",
    source: "Tree Trunks (Adventure Time)"
  },

  // STUDIO GHIBLI (10 quotes)
  {
    text: "Life is suffering. It is hard. The world is cursed. But still, you find reasons to keep living.",
    source: "Osono (Kiki's Delivery Service)"
  },
  {
    text: "Once you've met someone you never really forget them.",
    source: "Chihiro (Spirited Away)"
  },
  {
    text: "The world is full of wonderful things you haven't seen yet.",
    source: "Howl (Howl's Moving Castle)"
  },
  {
    text: "You must see with eyes unclouded by hate.",
    source: "Moro (Princess Mononoke)"
  },
  {
    text: "Even miracles take a little time.",
    source: "Fairy Godmother (Cinderella)"
  },
  {
    text: "A heart's a heavy burden.",
    source: "Sophie (Howl's Moving Castle)"
  },
  {
    text: "Life isn't about waiting for the storm to pass. It's about learning to dance in the rain.",
    source: "Ponyo (Ponyo)"
  },
  {
    text: "The best thing you can do is move forward.",
    source: "Seiji (Whisper of the Heart)"
  },
  {
    text: "Sometimes you have to fight for what you believe in.",
    source: "Nausicaä (Nausicaä of the Valley of the Wind)"
  },
  {
    text: "In this world, there are things you can only do alone, and things you can only do with somebody else.",
    source: "Shizuku (Whisper of the Heart)"
  },

  // SPONGEBOB (10 quotes)
  {
    text: "I'm ready! I'm ready! I'm ready!",
    source: "SpongeBob SquarePants"
  },
  {
    text: "The best time to wear a striped sweater is all the time.",
    source: "SpongeBob SquarePants"
  },
  {
    text: "Remember: Laughing, fun, and friendship are the best medicine!",
    source: "Patchy the Pirate (SpongeBob)"
  },
  {
    text: "Being grown-up is boring. Besides, I don't get jazz.",
    source: "Patrick Star"
  },
  {
    text: "The inner machinations of my mind are an enigma.",
    source: "Patrick Star"
  },
  {
    text: "F is for friends who do stuff together!",
    source: "SpongeBob SquarePants"
  },
  {
    text: "You don't need a license to drive a sandwich.",
    source: "SpongeBob SquarePants"
  },
  {
    text: "I wumbo, you wumbo, he-she-me wumbo.",
    source: "Patrick Star"
  },

  // TEEN TITANS (10 quotes)
  {
    text: "Booyah!",
    source: "Cyborg (Teen Titans)"
  },
  {
    text: "Sometimes the only way to win is not to play.",
    source: "Raven (Teen Titans)"
  },
  {
    text: "You don't have to be alone to be strong.",
    source: "Starfire (Teen Titans)"
  },
  {
    text: "Masks protect us. They let us be who we want to be.",
    source: "Robin (Teen Titans)"
  },
  {
    text: "The darkness doesn't frighten me. I was born in it.",
    source: "Raven (Teen Titans)"
  },
  {
    text: "Friendship isn't about who you've known the longest. It's about who walked into your life and said 'I'm here for you'.",
    source: "Beast Boy (Teen Titans)"
  },
  {
    text: "You can't force friendship. It's like a garden. You have to nurture it.",
    source: "Starfire (Teen Titans)"
  },
  {
    text: "Sometimes you have to lose yourself before you can find yourself.",
    source: "Raven (Teen Titans)"
  },
  {
    text: "The best battles are the ones we fight together.",
    source: "Robin (Teen Titans)"
  },
  {
    text: "Caring is what makes us strong.",
    source: "Starfire (Teen Titans)"
  },

  // BONUS QUOTES (10 more)
  {
    text: "You're braver than you believe, stronger than you seem, and smarter than you think.",
    source: "Christopher Robin (Winnie the Pooh)"
  },
  {
    text: "The flower that blooms in adversity is the most rare and beautiful of all.",
    source: "The Emperor (Mulan)"
  },
  {
    text: "In every job that must be done, there is an element of fun.",
    source: "Mary Poppins"
  },
  {
    text: "Everything is better with someone by your side.",
    source: "Branch (Trolls)"
  },
  {
    text: "The very things that hold you down are going to lift you up.",
    source: "Timothy Mouse (Dumbo)"
  },
  {
    text: "Sometimes the smallest things take up the most room in your heart.",
    source: "Winnie the Pooh"
  },
  {
    text: "Life's a little bit messy. We all make mistakes.",
    source: "Ralph (Wreck-It Ralph)"
  },
  {
    text: "The past can hurt. But the way I see it, you can either run from it, or learn from it.",
    source: "Rafiki (The Lion King)"
  },
  {
    text: "When life gets you down, you know what you gotta do? Just keep swimming!",
    source: "Dory (Finding Nemo)"
  },
  {
    text: "You can't just give up! Is that what a dinosaur would do?",
    source: "BMO (Adventure Time)"
  }
];

function updateQuote() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector('.quote-text').textContent = `"${randomQuote.text}"`;
  document.querySelector('.quote-source').innerHTML = `&mdash; ${randomQuote.source}`;
}
// Add to DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
  updateQuote();
  setInterval(updateQuote, 60000); // Change quote every minute
  makeWidgetDraggable('.quote-widget'); // Make it draggable
});

// Update draggable function to handle any widget:
function makeWidgetDraggable(selector) {
  const widget = document.querySelector(selector);
  if (!widget) return;

  let isDragging = false;
  let offsetX, offsetY;

  widget.addEventListener('mousedown', (e) => {
    if (e.target.tagName !== 'DIV') return;
    isDragging = true;
    offsetX = e.clientX - widget.getBoundingClientRect().left;
    offsetY = e.clientY - widget.getBoundingClientRect().top;
    widget.style.zIndex = 100;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    widget.style.left = `${e.clientX - offsetX}px`;
    widget.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    widget.style.zIndex = 5;
  });
}
