export const createSettingsState = () => ({
  accent: "#6366f1",
  language: "pt-BR",
});

export const applySettings = (settings = {}) => {
  const root = document.documentElement;
  root.style.setProperty("--accent", settings.accent || "#6366f1");
  root.lang = settings.language || "pt-BR";
};
