const addTaskBtnEl = document.getElementById("add-task-btn");
const addTaskInputEl = document.getElementById("add-task-input");
const todoListEl = document.getElementById("todo-list");
const taskDoneFilterEl = document.getElementById("task-done-filter");
const portalEl = document.getElementById("portal");

// Tasks data
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display all tasks
document.addEventListener("DOMContentLoaded", () => {
  tasks.forEach((task) => {
    appendTask(task);
  });
});

// Add new task to the list of tasks
addTaskBtnEl.addEventListener("click", () => {
  const task = addTaskInputEl.value;
  if (task === "") {
    alert("Please write a task");
  } else {
    const id = generateRandomId();

    // Generate the task object and push it to the list of tasks
    const newTask = {
      id: id,
      label: task,
      done: false,
    };
    tasks.push(newTask);

    // Save to the list of tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Render task to DOM
    appendTask(newTask);

    // Reset input
    addTaskInputEl.value = "";
    addTaskInputEl.focus();
  }
});

// Remove a task
function deleteTask(id) {
  const taskEl = document.getElementById(id);

  if (taskEl) {
    taskEl.remove();
    tasks = tasks.filter((task) => "todo-" + task.id != id);
    // Save to the list of tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else {
    alert("Task not found!");
  }
}

// Update a task
function updateTask(inputId, taskId, modalId) {
  const inputEl = document.getElementById(inputId);
  const taskEl = document.getElementById(taskId);
  if (inputEl.value === "") {
    alert("Write a task");
  } else {
    taskEl.querySelector(".todo-label").textContent = inputEl.value;
    const task = tasks.find((task) => "todo-" + task.id == taskId);
    task.label = inputEl.value;

    // Save to the list of tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Close modal
    const modalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

// Check task done
function check(id) {
  const taskEl = document.getElementById(id);
  taskEl.classList.toggle("checked");
}

// Filter task done
taskDoneFilterEl.addEventListener("change", (e) => {
  if (e.target.checked) {
    todoListEl.classList.add("only-done");
  } else {
    todoListEl.classList.remove("only-done");
  }
});

// Generate a markup for task
function generateTaskMarkup(task) {
  const editModalId = "edit-modal-" + task.id;

  // Generate markup for new task
  const markup = `
      <li class="todo-item" id="todo-${task.id}">
        <button class="todo-btn-check" onclick="check('todo-${task.id}')">
          <ion-icon name="checkmark-outline" class="check-icon"></ion-icon>
        </button>
        <label for="todo-${task.id}" class="todo-label">${task.label}</label>
        <div class="btn-actions">
          <button
          class="btn btn-info"
          data-bs-toggle="modal"
          data-bs-target="#${editModalId}"
          >
            <ion-icon name="create-outline"></ion-icon>
          </button>
          <button class="btn btn-danger" onclick="deleteTask('todo-${task.id}')">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </li>
      `;

  return markup;
}

// Generate markup for modal
function generateModalMarkup(task) {
  const editModalId = "edit-modal-" + task.id;
  const editInputId = "edit-input-" + task.id;
  // Generate markup for edit task modal
  const markup = `
      <div
      class="modal fade"
      id="${editModalId}"
      tabindex="-1"
      aria-labelledby="${editModalId}"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="${editModalId}">Edit Task</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              type="text"
              class="form-control"
              id="${editInputId}"
              value="${task.label}"
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              onclick="updateTask('${editInputId}','todo-${task.id}', '${editModalId}')"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
      `;

  return markup;
}

function appendTask(task) {
  const editInputId = "edit-input-" + task.id;
  const editModalId = "edit-modal-" + task.id;

  // Generate markup for new task
  const taskMarkup = generateTaskMarkup(task);

  // Generate markup for edit task modal
  const modalMarkup = generateModalMarkup(task);

  // Add to the end of the list
  todoListEl.insertAdjacentHTML("beforeend", taskMarkup);
  portalEl.insertAdjacentHTML("beforeend", modalMarkup);

  // Add event on modal when it closes
  const modalEl = document.getElementById(editModalId);
  modalEl.addEventListener("hidden.bs.modal", (event) => {
    const editInputEl = document.getElementById(editInputId);
    const taskLabel = document.querySelector(`#todo-${task.id} .todo-label`);

    editInputEl.value = taskLabel.textContent;
  });

  // Add event on modal when it shows
  modalEl.addEventListener("shown.bs.modal", (event) => {
    const editInputEl = document.getElementById(editInputId);

    editInputEl.select();
  });
}
