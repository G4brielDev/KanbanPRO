export const isValidHex = (value) =>
  /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
