import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { InternalStatusBanner } from "../components/InternalStatusBanner";
import { LanguageToggle } from "../components/LanguageToggle";

// Official application name. Not translated — kept as a Latin proper noun
// in both languages, consistent with how the pilot SVGs keep Latin symbols
// as their own isolated elements inside Arabic content
// (see docs/content-design/chapter-01/VISUAL_HOUSE_STYLE.md §3).
const APP_NAME = "PHSH111";

const APP_SUBTITLE = {
  en: "Physics for Health Sciences",
  ar: "الفيزياء لعلوم الصحة",
} as const;

const CHAPTER_LINK_LABEL = {
  en: "Chapter 1",
  ar: "الفصل الأول",
} as const;

const SKIP_LINK_LABEL = {
  en: "Skip to content",
  ar: "الانتقال إلى المحتوى",
} as const;

/**
 * Top-level application shell: sets document lang/dir, renders the
 * persistent internal-status banner, header navigation, language toggle,
 * and the routed page content.
 */
export function AppShell() {
  const { language, direction } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language, direction]);

  return (
    <div className="app-shell" dir={direction}>
      <a href="#main-content" className="skip-link">
        {SKIP_LINK_LABEL[language]}
      </a>

      <InternalStatusBanner />

      <header className="app-header">
        <Link to="/" className="app-header__brand">
          <span className="app-header__title">{APP_NAME}</span>
          <span className="app-header__subtitle">{APP_SUBTITLE[language]}</span>
        </Link>
        <nav className="app-header__nav" aria-label={CHAPTER_LINK_LABEL[language]}>
          <Link to="/chapter/1">{CHAPTER_LINK_LABEL[language]}</Link>
        </nav>
        <LanguageToggle />
      </header>

      <main id="main-content" className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
