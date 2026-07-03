import { debounce } from "./utils.js";

export const setupSearch = ({ input, onSearch }) => {
  const handler = debounce(
    (value) => onSearch(value.trim().toLowerCase()),
    180,
  );
  input.addEventListener("input", (event) => handler(event.target.value));
};
