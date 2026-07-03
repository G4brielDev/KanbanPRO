import { renderBoard } from "./board.js";
import { renderCalendar } from "./calendar.js";
import { applyFilters, createFilterState, renderFilters } from "./filters.js";
import { openTaskModal } from "./modal.js";
import { setupSearch } from "./search.js";
import { applySettings, createSettingsState } from "./settings.js";
import { storage } from "./storage.js";
import { createTask, DEFAULT_COLUMNS, normalizeTask } from "./tasks.js";

const state = {
  columns: DEFAULT_COLUMNS,
  tasks: [],
  filters: createFilterState(),
  search: "",
  theme: "dark",
  settings: createSettingsState(),
};

const refs = {
  board: document.getElementById("board"),
  statsGrid: document.getElementById("statsGrid"),
  calendar: document.getElementById("calendar"),
  calendarMonthLabel: document.getElementById("calendarMonthLabel"),
  searchInput: document.getElementById("searchInput"),
  themeToggle: document.getElementById("themeToggle"),
  addTaskButton: document.getElementById("addTaskButton"),
  filterGroup: document.getElementById("filterGroup"),
  exportJsonButton: document.getElementById("exportJsonButton"),
  importJsonInput: document.getElementById("importJsonInput"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  toastContainer: document.getElementById("toastContainer"),
};

const saveState = async () => {
  await storage.set("app-state", {
    columns: state.columns,
    tasks: state.tasks,
    settings: state.settings,
    theme: state.theme,
  });
};

const loadState = async () => {
  const data = await storage.get("app-state");
  if (data) {
    state.columns = data.columns || DEFAULT_COLUMNS;
    state.tasks = (data.tasks || []).map(normalizeTask);
    state.settings = data.settings || state.settings;
    state.theme = data.theme || state.theme;
  }
};

const renderStats = () => {
  const total = state.tasks.filter((task) => !task.archived).length;
  const completed = state.tasks.filter(
    (task) => !task.archived && task.status === "done",
  ).length;
  const pending = total - completed;
  const urgent = state.tasks.filter(
    (task) => !task.archived && task.priority === "urgent",
  ).length;
  const doing = state.tasks.filter(
    (task) => !task.archived && task.status === "doing",
  ).length;
  refs.statsGrid.innerHTML = `
    <div class="stat-item"><div class="muted">Total</div><div class="stat-value">${total}</div></div>
    <div class="stat-item"><div class="muted">Concluídas</div><div class="stat-value">${completed}</div></div>
    <div class="stat-item"><div class="muted">Pendentes</div><div class="stat-value">${pending}</div></div>
    <div class="stat-item"><div class="muted">Urgentes</div><div class="stat-value">${urgent}</div></div>
    <div class="stat-item"><div class="muted">Em andamento</div><div class="stat-value">${doing}</div></div>
  `;
};

const getVisibleTasks = () => {
  const filtered = applyFilters(state.tasks, state.filters);
  return filtered.filter((task) => {
    const haystack =
      `${task.title} ${task.description} ${task.category} ${task.tags.join(" ")} ${task.notes}`.toLowerCase();
    return !state.search || haystack.includes(state.search);
  });
};

const render = () => {
  const visibleTasks = getVisibleTasks();
  renderBoard({
    columns: state.columns,
    tasks: visibleTasks,
    onTaskClick: (task) =>
      openTaskModal({
        task,
        onSubmit: (payload) => updateTask(task.id, payload),
        onDelete: (id) => deleteTask(id),
      }),
    onDrop: (taskId, newStatus) => moveTask(taskId, newStatus),
  });
  renderStats();
  renderCalendar({
    container: refs.calendar,
    monthLabel: refs.calendarMonthLabel,
    tasks: state.tasks,
  });
};

const showToast = (message) => {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  refs.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
};

const updateTask = async (taskId, payload) => {
  state.tasks = state.tasks.map((task) =>
    task.id === taskId
      ? { ...task, ...payload, updatedAt: new Date().toISOString() }
      : task,
  );
  await saveState();
  render();
  showToast("Tarefa atualizada");
};

const addTask = async (payload) => {
  state.tasks.unshift(
    createTask({ ...payload, status: payload.status || "backlog" }),
  );
  await saveState();
  render();
  showToast("Tarefa criada");
};

const deleteTask = async (taskId) => {
  state.tasks = state.tasks.filter((task) => task.id !== taskId);
  await saveState();
  render();
  showToast("Tarefa removida");
};

const moveTask = async (taskId, newStatus) => {
  state.tasks = state.tasks.map((task) =>
    task.id === taskId
      ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      : task,
  );
  await saveState();
  render();
};

const handleFilterChange = ({ key, value }) => {
  state.filters[key] = value;
  render();
};

const bindEvents = () => {
  refs.addTaskButton.addEventListener("click", () =>
    openTaskModal({
      task: null,
      onSubmit: (payload) => addTask(payload),
    }),
  );

  refs.themeToggle.addEventListener("click", async () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    await saveState();
  });

  refs.exportJsonButton.addEventListener("click", () => {
    const blob = new Blob(
      [JSON.stringify({ columns: state.columns, tasks: state.tasks }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kanban-pro.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  refs.importJsonInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text);
    state.columns = parsed.columns || state.columns;
    state.tasks = (parsed.tasks || []).map(normalizeTask);
    await saveState();
    render();
    showToast("Dados importados");
  });

  refs.exportCsvButton.addEventListener("click", () => {
    const rows = [["title", "status", "priority", "dueDate", "category"]];
    state.tasks.forEach((task) =>
      rows.push([
        task.title,
        task.status,
        task.priority,
        task.dueDate,
        task.category,
      ]),
    );
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kanban-pro.csv";
    link.click();
    URL.revokeObjectURL(url);
  });

  setupSearch({
    input: refs.searchInput,
    onSearch: (value) => {
      state.search = value;
      render();
    },
  });
  renderFilters({ container: refs.filterGroup, onChange: handleFilterChange });
};

const bootstrap = async () => {
  await loadState();
  document.documentElement.dataset.theme = state.theme;
  applySettings(state.settings);
  bindEvents();
  render();
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
};

window.addEventListener("DOMContentLoaded", bootstrap);
