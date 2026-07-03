export const notify = (message) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("KANBAN PRO", { body: message });
    return;
  }
  console.info(message);
};
