export const openTaskModal = ({ task, onSubmit, onDelete }) => {
  const dialog = document.getElementById("taskModal");
  if (!dialog) return;
  dialog.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${task ? "Editar tarefa" : "Nova tarefa"}</h2>
        <button class="icon-button" data-close="true" aria-label="Fechar modal">✕</button>
      </div>
      <form id="taskForm" class="form-grid">
        <label>
          Título
          <input name="title" required value="${task?.title || ""}" />
        </label>
        <label>
          Descrição
          <textarea name="description">${task?.description || ""}</textarea>
        </label>
        <label>
          Categoria
          <input name="category" value="${task?.category || "Geral"}" />
        </label>
        <label>
          Prioridade
          <select name="priority">
            <option value="low" ${task?.priority === "low" ? "selected" : ""}>Baixa</option>
            <option value="normal" ${task?.priority === "normal" || !task ? "selected" : ""}>Normal</option>
            <option value="high" ${task?.priority === "high" ? "selected" : ""}>Alta</option>
            <option value="urgent" ${task?.priority === "urgent" ? "selected" : ""}>Urgente</option>
          </select>
        </label>
        <label>
          Status
          <select name="status">
            <option value="backlog" ${task?.status === "backlog" ? "selected" : ""}>Backlog</option>
            <option value="todo" ${task?.status === "todo" ? "selected" : ""}>To Do</option>
            <option value="doing" ${task?.status === "doing" ? "selected" : ""}>Doing</option>
            <option value="review" ${task?.status === "review" ? "selected" : ""}>Review</option>
            <option value="done" ${task?.status === "done" ? "selected" : ""}>Done</option>
          </select>
        </label>
        <label>
          Data
          <input type="date" name="dueDate" value="${task?.dueDate || ""}" />
        </label>
        <label>
          Hora
          <input type="time" name="dueTime" value="${task?.dueTime || ""}" />
        </label>
        <label>
          Responsável
          <input name="responsible" value="${task?.responsible || ""}" />
        </label>
        <label>
          Tags
          <input name="tags" value="${(task?.tags || []).join(", ")}" />
        </label>
        <label>
          Notas
          <textarea name="notes">${task?.notes || ""}</textarea>
        </label>
      </form>
      <div class="modal-actions">
        ${task ? '<button class="ghost-button" id="deleteTaskButton">Excluir</button>' : ""}
        <button class="ghost-button" data-close="true">Cancelar</button>
        <button class="primary-button" id="submitTaskButton">Salvar</button>
      </div>
    </div>
  `;

  dialog.showModal();

  dialog
    .querySelector('[data-close="true"]')
    .addEventListener("click", () => dialog.close());
  dialog.querySelector("#submitTaskButton").addEventListener("click", () => {
    const form = dialog.querySelector("#taskForm");
    const formData = new FormData(form);
    const payload = {
      title: formData.get("title").toString().trim(),
      description: formData.get("description").toString().trim(),
      category: formData.get("category").toString().trim(),
      priority: formData.get("priority").toString(),
      status: formData.get("status").toString(),
      dueDate: formData.get("dueDate").toString(),
      dueTime: formData.get("dueTime").toString(),
      responsible: formData.get("responsible").toString().trim(),
      tags: formData
        .get("tags")
        .toString()
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      notes: formData.get("notes").toString().trim(),
    };
    onSubmit(payload);
  });

  if (task && onDelete) {
    dialog.querySelector("#deleteTaskButton").addEventListener("click", () => {
      onDelete(task.id);
      dialog.close();
    });
  }
};
