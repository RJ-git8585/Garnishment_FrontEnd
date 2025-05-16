
/**
 * Removes zero-width spaces and trims the input string.
 * @param {string} input - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeString = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(/\u200B/g, "").trim(); // Remove zero-width spaces and trim
};
