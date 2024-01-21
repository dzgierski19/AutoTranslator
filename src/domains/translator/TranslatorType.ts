export const LANGUAGES = {
  POLISH: "pl",
  ENGLISH: "en",
  RUSSIAN: "ru",
  FRENCH: "fr",
  ITALIAN: "it",
} as const;

export type language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
