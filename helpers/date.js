export const getMonthLabel = (date) =>
  date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
