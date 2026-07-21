let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

window.onload = function () {
  displayTasks();
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text === "") return;

  tasks.push({ text: text, completed: false });

  input.value = "";
  saveTasks();
  displayTasks();
}



function displayTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    

    li.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        
        
        <span onclick="toggleComplete(${index})"
          class="${task.completed ? 'completed' : ''}"
          style="cursor:pointer;">
          ${task.text}
        </span>
      </div>

      <div>
        <button onclick="editTask(${index})">✏</button>
        <button onclick="deleteTask(${index})">X</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  displayTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  displayTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);

  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText;
    saveTasks();
    displayTasks();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
let draggedItem = null;

function dragStart(e) {
  draggedItem = e.target;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (e.target.tagName === "LI") {
    e.target.parentNode.insertBefore(draggedItem, e.target);
  }
}
li.setAttribute("draggable", true);
li.addEventListener("dragstart", dragStart);
li.addEventListener("dragover", dragOver);
li.addEventListener("drop", drop);