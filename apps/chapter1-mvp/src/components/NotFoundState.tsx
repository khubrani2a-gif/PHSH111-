import { Link } from "react-router-dom";
import { useLanguage } from "../app/LanguageContext";

const TEXT = {
  en: {
    heading: "Not found",
    backHome: "Return to home",
    backChapter: "Return to Chapter 1",
  },
  ar: {
    heading: "غير موجود",
    backHome: "العودة إلى الصفحة الرئيسية",
    backChapter: "العودة إلى الفصل الأول",
  },
} as const;

interface NotFoundStateProps {
  /** Bilingual detail message describing what was not found. */
  message: { en: string; ar: string };
  /** Where the "return" link should go. Defaults to the chapter list. */
  backTo?: "home" | "chapter";
}

export function NotFoundState({ message, backTo = "chapter" }: NotFoundStateProps) {
  const { language } = useLanguage();
  const text = TEXT[language];
  const target = backTo === "home" ? "/" : "/chapter/1";
  const label = backTo === "home" ? text.backHome : text.backChapter;

  return (
    <div className="not-found-state" role="alert">
      <h2>{text.heading}</h2>
      <p>{message[language]}</p>
      <Link to={target} className="not-found-state__link">
        {label}
      </Link>
    </div>
  );
}
