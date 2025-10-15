import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Configuration ---
// It's best practice to move this to a separate file, e.g., `src/config/languages.ts`

type Language = {
  readonly code: string;
  readonly name: string;
  readonly flag: string;
};

const SUPPORTED_LANGUAGES: readonly Language[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
] as const;

const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0];

// --- Component ---

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  // On initial render, load the saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]); // Added i18n to dependency array as per exhaustive-deps rule

  /**
   * Changes the application language and saves the preference.
   * @param languageCode - The language code (e.g., "en", "bn").
   */
  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem("language", languageCode);
  };

  // Find the full language object for the current language, or fall back to default
  const currentLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ||
    DEFAULT_LANGUAGE;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full border px-4 py-2 transition-colors hover:bg-accent"
        >
          <Globe className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 rounded-xl border border-border bg-popover shadow-lg"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              // Applying conditional classes for active/inactive states
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm ${
                isActive
                  ? "bg-blue-100 font-semibold text-blue-600 dark:bg-gray-700"
                  : "hover:bg-muted"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}