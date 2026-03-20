const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");
const emptyState = document.getElementById("emptyState");
const currentDate = document.getElementById("currentDate");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate() {
  const today = new Date();
  const options = { weekday: "short", day: "numeric", month: "short" };
  currentDate.textContent = today.toLocaleDateString("en-US", options);
}

function updateCounter() {
  const pending = tasks.filter(task => !task.completed).length;
  const total = tasks.length;

  if (total === 0) {
    taskCounter.textContent = "0 tasks";
  } else if (pending === 0) {
    taskCounter.textContent = `${total} completed`;
  } else {
    taskCounter.textContent = `${pending} pending of ${total}`;
  }
}

function getFilteredTasks() {
  if (currentFilter === "pending") {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.dataset.id = task.id;

    if (task.isEditing) {
      li.innerHTML = `
        <div class="custom-check"></div>
        <input type="text" class="edit-input" value="${escapeHtml(task.text)}" />
        <div class="task-meta">
          <span class="badge">Editing</span>
          <div class="action-buttons">
            <button class="save-edit-btn">Save</button>
            <button class="cancel-edit-btn">Cancel</button>
          </div>
        </div>
      `;

      const editInput = li.querySelector(".edit-input");
      const saveBtn = li.querySelector(".save-edit-btn");
      const cancelBtn = li.querySelector(".cancel-edit-btn");

      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);

      saveBtn.addEventListener("click", () => saveEditedTask(task.id, editInput.value));
      cancelBtn.addEventListener("click", () => cancelEdit(task.id));

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          saveEditedTask(task.id, editInput.value);
        }
        if (e.key === "Escape") {
          cancelEdit(task.id);
        }
      });
    } else {
      li.innerHTML = `
        <div class="custom-check" title="Mark as completed"></div>
        <p class="task-text">${escapeHtml(task.text)}</p>
        <div class="task-meta">
          <span class="badge">${task.completed ? "Completed" : "Pending"}</span>
          <div class="action-buttons">
            <button class="edit-btn" title="Edit task">Edit</button>
            <button class="delete-btn" title="Delete task">Delete</button>
          </div>
        </div>
      `;

      const check = li.querySelector(".custom-check");
      const editBtn = li.querySelector(".edit-btn");
      const deleteBtn = li.querySelector(".delete-btn");

      check.addEventListener("click", () => toggleTask(task.id));
      editBtn.addEventListener("click", () => startEdit(task.id));
      deleteBtn.addEventListener("click", () => removeTask(task.id, li));
    }

    taskList.appendChild(li);
  });

  updateCounter();
  saveTasks();
}

function addTask(text) {
  const cleanedText = text.trim();
  if (!cleanedText) return;

  tasks.unshift({
    id: Date.now(),
    text: cleanedText,
    completed: false,
    isEditing: false
  });

  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

function removeTask(id, element) {
  element.classList.add("removing");

  setTimeout(() => {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }, 280);
}

function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
}

function startEdit(id) {
  tasks = tasks.map(task => ({
    ...task,
    isEditing: task.id === id
  }));
  renderTasks();
}

function saveEditedTask(id, newText) {
  const cleanedText = newText.trim();

  if (!cleanedText) {
    return;
  }

  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, text: cleanedText, isEditing: false }
      : { ...task, isEditing: false }
  );

  renderTasks();
}

function cancelEdit(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, isEditing: false } : task
  );
  renderTasks();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

formatDate();
renderTasks();