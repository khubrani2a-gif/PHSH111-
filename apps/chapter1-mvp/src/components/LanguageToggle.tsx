import { useLanguage } from "../app/LanguageContext";

const LABEL = {
  en: { self: "English", other: "العربية", ariaLabel: "Switch to Arabic" },
  ar: { self: "العربية", other: "English", ariaLabel: "التبديل إلى الإنجليزية" },
} as const;

/**
 * Two-state language toggle (English / Arabic).
 *
 * Switching updates UI labels, page direction, and document language
 * metadata together (see AppShell), never independently. No runtime
 * machine translation is used — only the two authored languages.
 */
export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const current = LABEL[language];

  return (
    <button
      type="button"
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={current.ariaLabel}
      aria-pressed={language === "ar"}
    >
      <span className="language-toggle__current">{current.self}</span>
      <span className="language-toggle__separator" aria-hidden="true">
        /
      </span>
      <span className="language-toggle__other">{current.other}</span>
    </button>
  );
}
