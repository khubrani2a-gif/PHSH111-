import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "../types/language";

interface LanguageContextValue {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function directionFor(language: Language): "ltr" | "rtl" {
  return language === "ar" ? "rtl" : "ltr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Session-local React state only — no persistence, no backend, no
  // state-management library. See MVP_IMPLEMENTATION_DECISIONS.json, decision G.
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<LanguageContextValue>(() => {
    const direction = directionFor(language);
    return {
      language,
      direction,
      setLanguage,
      toggleLanguage: () =>
        setLanguage((current) => (current === "en" ? "ar" : "en")),
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider");
  }
  return context;
}
