let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let dragIndex = null;

// LOAD
window.onload = function () {
  displayTasks();

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  requestNotificationPermission();
  checkReminders();
};

// SAVE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ADD TASK
function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("dueDate").value;

  if (text === "") return;

  tasks.push({

    text,
    completed:false,
    priority,
    dueDate,

    category:
    document.getElementById("category").value,

    notes:
    document.getElementById("notes").value

  });

  saveTasks();
  displayTasks();
  showToast("✅ Task Added");

  document.getElementById("taskInput").value = "";
}

// DISPLAY
function displayTasks() {
  const list = document.getElementById("taskList");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const emptyMsg = document.getElementById("emptyMsg");

  list.innerHTML = "";

  let filtered = tasks
    .filter(task => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    })
    .filter(task => task.text.toLowerCase().includes(search));

  filtered.forEach((task, index) => {
    const li = document.createElement("li");

    li.classList.add(task.priority);
    li.draggable = true;

    // DRAG
    li.addEventListener("dragstart", () => {
      dragIndex = index;
    });

    li.addEventListener("dragover", (e) => e.preventDefault());

    li.addEventListener("drop", () => {
      const temp = tasks[dragIndex];
      tasks[dragIndex] = tasks[index];
      tasks[index] = temp;

      saveTasks();
      displayTasks();
    });

    li.innerHTML = `
      <div>
        <span onclick="toggleComplete(${index})"
          class="${task.completed ? 'completed' : ''}">
          ${task.text}
        </span>
        <small>📅 ${task.dueDate || "No date"}</small>
        <small>
          📂 ${task.category || "Personal"}
        </small>

        <small>
          📝 ${task.notes || "No notes"}
        </small>
      </div>

      <div>
        <button onclick="editTask(${index})">✏</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    list.appendChild(li);
  });

  emptyMsg.style.display = tasks.length === 0 ? "block" : "none";

  updateProgress();
  updateAnalytics();
  smartSuggestion();
}

// PROGRESS
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  document.getElementById("progress").innerText =
    `Completed: ${done} / ${total}`;

  const percent = total === 0 ? 0 : (done / total) * 100;
  document.getElementById("progressFill").style.width = percent + "%";
}

// DELETE
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
  showToast("❌ Task Deleted");
}

// COMPLETE
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  displayTasks();
}

// EDIT
function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);

  if (newText && newText.trim() !== "") {
    tasks[index].text = newText;
    saveTasks();
    displayTasks();
  }
}

// FILTER
function filterTasks(type) {
  currentFilter = type;
  displayTasks();
}

// DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// 🔔 NOTIFICATION
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

// REMINDER
function checkReminders() {
  const today = new Date().toISOString().split("T")[0];

  tasks.forEach(task => {
    if (task.dueDate === today && !task.completed) {
      if (Notification.permission === "granted") {
        new Notification("⏰ Reminder", {
          body: task.text
        });
      }
    }
  });
}

// 🔥 SMART SUGGESTION
function smartSuggestion() {
  const highPending = tasks.filter(t => !t.completed && t.priority === "high");

  if (highPending.length > 0) {
    showToast("⚡ Complete high priority tasks first!");
  }
}

// TOAST
function showToast(msg) {
  const toast = document.createElement("div");
  toast.innerText = msg;
  toast.className = "toast";
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2000);
}
function updateAnalytics(){

let total = tasks.length;

let completed =
tasks.filter(t=>t.completed).length;


document.getElementById("totalTasks")
.innerText=total;


document.getElementById("completedTasks")
.innerText=completed;


let percent =
total===0 ? 0 :
Math.round((completed/total)*100);


document.getElementById("productivity")
.innerText=percent+"%";


}

