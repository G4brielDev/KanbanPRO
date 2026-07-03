import { DEFAULT_COLUMNS, getTaskStatusLabel, isOverdue } from "./tasks.js";
import { formatDate } from "./utils.js";

export const renderBoard = ({ columns, tasks, onTaskClick, onDrop }) => {
  const board = document.getElementById("board");
  if (!board) return;
  board.innerHTML = "";
  const fragment = document.createDocumentFragment();

  (columns || DEFAULT_COLUMNS).forEach((column) => {
    const colEl = document.createElement("section");
    colEl.className = "column";
    colEl.dataset.columnId = column.id;

    const columnTasks = tasks.filter(
      (task) => task.status === column.id && !task.archived,
    );
    colEl.innerHTML = `
      <div class="column-header">
        <h3>${column.title}</h3>
        <span class="column-count">${columnTasks.length}</span>
      </div>
      <div class="task-list" data-dropzone="${column.id}"></div>
    `;

    const list = colEl.querySelector(".task-list");
    if (columnTasks.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Sem tarefas";
      list.appendChild(empty);
    } else {
      columnTasks.forEach((task) => {
        const taskCard = document.createElement("article");
        taskCard.className = "task-card";
        taskCard.draggable = true;
        taskCard.dataset.taskId = task.id;
        taskCard.innerHTML = `
          <div class="task-title">${task.title}</div>
          <div class="task-meta">
            <span class="priority-pill priority-${task.priority}">${task.priority}</span>
            <span class="small">${task.dueDate ? formatDate(task.dueDate) : "Sem prazo"}</span>
          </div>
          <div class="task-tags">
            <span class="tag-pill">${getTaskStatusLabel(task.status)}</span>
            ${
              task.tags
                ?.slice(0, 2)
                .map((tag) => `<span class="tag-pill">${tag}</span>`)
                .join("") || ""
            }
          </div>
        `;
        if (isOverdue(task)) taskCard.style.border = "1px solid var(--danger)";
        taskCard.addEventListener("click", () => onTaskClick(task));
        taskCard.addEventListener("dragstart", (event) => {
          event.dataTransfer.setData("text/plain", task.id);
          taskCard.classList.add("dragging");
        });
        taskCard.addEventListener("dragend", () =>
          taskCard.classList.remove("dragging"),
        );
        list.appendChild(taskCard);
      });
    }

    list.addEventListener("dragover", (event) => {
      event.preventDefault();
      list.classList.add("drag-over");
    });
    list.addEventListener("dragleave", () =>
      list.classList.remove("drag-over"),
    );
    list.addEventListener("drop", (event) => {
      event.preventDefault();
      list.classList.remove("drag-over");
      const taskId = event.dataTransfer.getData("text/plain");
      onDrop(taskId, column.id);
    });

    fragment.appendChild(colEl);
  });

  board.appendChild(fragment);
};
