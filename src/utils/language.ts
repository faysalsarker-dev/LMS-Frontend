const LANGUAGE_STORAGE_KEY = "language";
const SUPPORTED_LANGUAGES = ["en", "zh"] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Detects user's default language based on browser settings
 * Returns 'zh' if browser language is Chinese, otherwise 'en'
 */
function detectDefaultLanguage(): SupportedLanguage {
  // Check browser language preferences
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  
  // Check if browser language starts with 'zh' (covers zh-CN, zh-TW, zh-HK, etc.)
  if (browserLang.toLowerCase().startsWith("zh")) {
    return "zh";
  }
  
  // Default to English
  return "en";
}

/**
 * Gets the current language from localStorage or detects default
 */
export function getInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  
  // If language is stored and valid, use it
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }
  
  // Otherwise, detect default language
  const defaultLang = detectDefaultLanguage();
  
  // Store the detected language for future use
  localStorage.setItem(LANGUAGE_STORAGE_KEY, defaultLang);
  
  return defaultLang;
}

/**
 * Changes the application language
 * Updates i18n and localStorage
 * @param i18nInstance - The i18n instance to update
 * @param lang - The language to change to
 */
export function changeLanguage(i18nInstance: { changeLanguage: (lang: string) => void }, lang: SupportedLanguage): void {
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    console.warn(`Unsupported language: ${lang}. Falling back to 'en'.`);
    lang = "en";
  }
  
  // Update i18n
  i18nInstance.changeLanguage(lang);
  
  // Persist to localStorage
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

/**
 * Gets the current language from i18n instance
 * @param i18nInstance - The i18n instance to read from
 */
export function getCurrentLanguage(i18nInstance: { language: string }): SupportedLanguage {
  const currentLang = i18nInstance.language;
  
  // Handle language codes like 'en-US' or 'zh-CN'
  const baseLang = currentLang.split("-")[0] as SupportedLanguage;
  
  if (SUPPORTED_LANGUAGES.includes(baseLang)) {
    return baseLang;
  }
  
  return "en";
}

/**
 * Toggles between 'en' and 'zh'
 * @param i18nInstance - The i18n instance to update
 */
export function toggleLanguage(i18nInstance: { language: string; changeLanguage: (lang: string) => void }): SupportedLanguage {
  const current = getCurrentLanguage(i18nInstance);
  const newLang = current === "en" ? "zh" : "en";
  changeLanguage(i18nInstance, newLang);
  return newLang;
}
