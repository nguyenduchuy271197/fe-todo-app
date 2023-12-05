const addTaskBtnEl = document.getElementById("add-task-btn");
const addTaskInputEl = document.getElementById("add-task-input");
const todoListEl = document.getElementById("todo-list");
const taskDoneFilterEl = document.getElementById("task-done-filter");
const portalEl = document.getElementById("portal");

// Check tasks empty
checkTasksEmpty();

// Add new task to the list of tasks
addTaskBtnEl.addEventListener("click", () => {
  const task = addTaskInputEl.value;
  if (task === "") {
    alert("Please write a task");
  } else {
    const id = generateRandomId();
    const editModalId = "edit-modal-" + id;
    const editInputId = "edit-input-" + id;

    // Generate markup for new task
    const markup = `
    <li class="todo-item" id="todo-${id}">
      <button class="todo-btn-check" onclick="check('todo-${id}')">
        <ion-icon name="checkmark-outline" class="check-icon"></ion-icon>
      </button>
      <label for="todo-${id}" class="todo-label">${task}</label>
      <div class="btn-actions">
        <button
        class="btn btn-info"
        data-bs-toggle="modal"
        data-bs-target="#${editModalId}"
        >
          <ion-icon name="create-outline"></ion-icon>
        </button>
        <button class="btn btn-danger" onclick="deleteTask('todo-${id}')">
          <ion-icon name="trash-outline"></ion-icon>
        </button>
      </div>
    </li>
    `;

    // Generate markup for edit task modal
    const modal = `
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
            value="${task}"
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
            onclick="updateTask('${editInputId}','todo-${id}', '${editModalId}')"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
    `;

    // Add to the end of the list
    todoListEl.insertAdjacentHTML("beforeend", markup);
    portalEl.insertAdjacentHTML("beforeend", modal);

    const modalEl = document.getElementById(editModalId);

    // Add event on modal when it closes
    modalEl.addEventListener("hidden.bs.modal", (event) => {
      const editInputEl = document.getElementById(editInputId);
      const taskLabel = document.querySelector(`#todo-${id} .todo-label`);

      editInputEl.value = taskLabel.textContent;
    });

    // Add event on modal when it shows
    modalEl.addEventListener("shown.bs.modal", (event) => {
      const editInputEl = document.getElementById(editInputId);

      editInputEl.select();
    });

    // Remove alert
    checkTasksEmpty();

    // Reset input
    addTaskInputEl.value = "";
    addTaskInputEl.focus();
  }
});

taskDoneFilterEl.addEventListener("change", (e) => {
  if (e.target.checked) {
    todoListEl.classList.add("only-done");
  } else {
    todoListEl.classList.remove("only-done");
  }
});

// Remove a task
function deleteTask(id) {
  const taskEl = document.getElementById(id);

  if (taskEl) {
    taskEl.remove();
    checkTasksEmpty();
  } else {
    alert("Task not found!");
  }
}

// Check task done
function check(id) {
  const taskEl = document.getElementById(id);
  taskEl.classList.toggle("checked");
}

function updateTask(inputId, taskId, modalId) {
  const inputEl = document.getElementById(inputId);
  const taskEl = document.getElementById(taskId);
  if (inputEl.value === "") {
    alert("Write a task");
  } else {
    taskEl.querySelector(".todo-label").textContent = inputEl.value;

    // Close modal
    const modalEl = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

function checkTasksEmpty() {
  const todoListEl = document.getElementById("todo-list");
  const alertEl = document.getElementById("alert");
  if (todoListEl.firstChild) {
    alertEl.textContent = "";
  } else {
    alertEl.textContent = "No tasks found.";
  }
}
