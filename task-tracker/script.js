const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Array de objetos: cada tarefa tem um id único, o texto e se está concluída.
// Essa é a única fonte de verdade — a lista na tela é sempre reconstruída a
// partir dela pela função renderTasks().
let tasks = [];

// Gera um id simples e único para cada nova tarefa
function generateId() {
  return Date.now().toString();
}

function addTask(description) {
  tasks.push({
    id: generateId(),
    description,
    completed: false,
  });

  renderTasks();
}

function toggleTaskCompleted(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  renderTasks();
}

// Limpa a lista inteira e a reconstrói a partir do array `tasks`,
// como a dica do projeto recomenda.
function renderTasks() {
  taskList.innerHTML = "";

  // Tarefas pendentes primeiro, concluídas no final da lista
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const orderedTasks = [...pendingTasks, ...completedTasks];

  orderedTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "task-item completed" : "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleTaskCompleted(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.description;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

taskInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const description = taskInput.value.trim();
  if (description === "") return;

  addTask(description);
  taskInput.value = "";
});