// The languages users can pick when signing up or creating decks and cards
export const LANGUAGES = ["English", "Spanish", "French"];

// Match a stored language ("spanish", "Spanish ") to one of the options, or "" if it isn't one
export function toLanguageOption(value) {
  const cleaned = (value ?? "").trim().toLowerCase();
  return LANGUAGES.find((lang) => lang.toLowerCase() === cleaned) ?? "";
}
