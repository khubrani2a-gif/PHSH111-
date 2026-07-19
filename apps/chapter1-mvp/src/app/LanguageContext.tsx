import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "../types/language";
import { readPersistedString, writePersistedString } from "./persistedState";

const LANGUAGE_STORAGE_KEY = "language";

function isLanguage(value: string): value is Language {
  return value === "en" || value === "ar";
}

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
  // React state only, no backend and no state-management library (see
  // MVP_IMPLEMENTATION_DECISIONS.json, decision G). The initial value and
  // subsequent changes are persisted to localStorage only (see
  // src/app/persistedState.ts's header comment for the scoped amendment
  // to decision J this represents) so a returning visitor keeps their
  // chosen language across a reload.
  const [language, setLanguage] = useState<Language>(() => {
    const stored = readPersistedString(LANGUAGE_STORAGE_KEY, "en");
    return isLanguage(stored) ? stored : "en";
  });

  useEffect(() => {
    writePersistedString(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

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
