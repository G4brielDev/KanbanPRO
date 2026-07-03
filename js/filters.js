const DEFAULT_FILTERS = {
  category: "",
  priority: "",
  status: "",
  date: "",
};

export const createFilterState = () => ({ ...DEFAULT_FILTERS });

export const applyFilters = (tasks, filters) =>
  tasks.filter((task) => {
    const categoryMatch =
      !filters.category ||
      task.category?.toLowerCase() === filters.category.toLowerCase();
    const priorityMatch =
      !filters.priority || task.priority === filters.priority;
    const statusMatch = !filters.status || task.status === filters.status;
    const dateMatch = !filters.date || task.dueDate === filters.date;
    return categoryMatch && priorityMatch && statusMatch && dateMatch;
  });

export const renderFilters = ({ container, onChange }) => {
  const categories = ["Geral", "Pessoal", "Estudo", "Trabalho", "Saúde"];
  const priorities = [
    { value: "urgent", label: "Urgente" },
    { value: "high", label: "Alta" },
    { value: "normal", label: "Normal" },
    { value: "low", label: "Baixa" },
  ];
  const statuses = [
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "doing", label: "Doing" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ];

  container.innerHTML = `
    <select data-filter="category">
      <option value="">Categoria</option>
      ${categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("")}
    </select>
    <select data-filter="priority">
      <option value="">Prioridade</option>
      ${priorities.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}
    </select>
    <select data-filter="status">
      <option value="">Status</option>
      ${statuses.map((item) => `<option value="${item.value}">${item.label}</option>`).join("")}
    </select>
    <input type="date" data-filter="date" />
  `;

  container.querySelectorAll("select, input").forEach((element) => {
    element.addEventListener("change", (event) => {
      const key = event.target.dataset.filter;
      onChange({ key, value: event.target.value });
    });
  });
};
