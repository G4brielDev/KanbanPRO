import { toIsoDate, uid } from "./utils.js";

export const DEFAULT_COLUMNS = [
  { id: "backlog", title: "Backlog" },
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

export const createTask = (overrides = {}) => ({
  id: overrides.id || uid(),
  title: overrides.title || "Nova tarefa",
  description: overrides.description || "",
  category: overrides.category || "Geral",
  priority: overrides.priority || "normal",
  status: overrides.status || "backlog",
  dueDate: overrides.dueDate || "",
  dueTime: overrides.dueTime || "",
  checklist: overrides.checklist || [],
  tags: overrides.tags || [],
  notes: overrides.notes || "",
  responsible: overrides.responsible || "",
  color: overrides.color || "#6366f1",
  archived: false,
  createdAt: overrides.createdAt || new Date().toISOString(),
  updatedAt: overrides.updatedAt || new Date().toISOString(),
});

export const normalizeTask = (task) => ({
  ...createTask(task),
  checklist: Array.isArray(task?.checklist) ? task.checklist : [],
  tags: Array.isArray(task?.tags) ? task.tags : [],
  dueDate: task?.dueDate || "",
  dueTime: task?.dueTime || "",
  status: task?.status || "backlog",
});

export const getTaskPriorityLabel = (priority) => {
  const labels = {
    urgent: "Urgente",
    high: "Alta",
    normal: "Normal",
    low: "Baixa",
  };
  return labels[priority] || "Normal";
};

export const isOverdue = (task) => {
  if (!task?.dueDate) return false;
  const today = toIsoDate(new Date());
  return task.dueDate < today;
};

export const getTaskStatusLabel = (status) => {
  const labels = {
    backlog: "Backlog",
    todo: "To Do",
    doing: "Doing",
    review: "Review",
    done: "Done",
  };
  return labels[status] || status;
};
