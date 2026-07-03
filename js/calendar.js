
export const renderCalendar = ({ container, monthLabel, tasks }) => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const startDay = firstDay.getDay();
  const days = [];

  for (let i = 0; i < startDay; i += 1) days.push(null);
  for (let i = 1; i <= lastDay.getDate(); i += 1) days.push(i);

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const weekdayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
  weekdayLabels.forEach((label) => {
    const day = document.createElement("div");
    day.className = "calendar-day muted";
    day.textContent = label;
    fragment.appendChild(day);
  });

  days.forEach((day) => {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    if (day) {
      cell.textContent = day;
      const dayTasks = tasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate ===
            `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      );
      if (dayTasks.length) cell.classList.add("has-task");
      if (day === today.getDate()) cell.classList.add("active");
    }
    fragment.appendChild(cell);
  });

  container.appendChild(fragment);
  monthLabel.textContent = today.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
};
