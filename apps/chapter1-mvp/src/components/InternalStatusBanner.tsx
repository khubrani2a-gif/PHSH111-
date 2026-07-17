import { useLanguage } from "../app/LanguageContext";

const BANNER_TEXT = {
  en: "Internal Draft — Review Required — Not authorized for student-facing use",
  ar: "مسودة داخلية — تتطلب المراجعة — غير مصرح باستخدامها للطلاب",
} as const;

/**
 * Persistent, non-dismissible internal-status banner.
 *
 * This banner must remain visible on every route. It reflects the
 * governance state recorded in
 * docs/content-design/chapter-01/PILOT_AUTHORIZATION.json and
 * docs/app/MVP_IMPLEMENTATION_DECISIONS.json (decision A: application mode)
 * and must never be removed or hidden by application code.
 */
export function InternalStatusBanner() {
  const { language, direction } = useLanguage();

  return (
    <div className="internal-status-banner" role="status" dir={direction}>
      <span className="internal-status-banner__text">
        {BANNER_TEXT[language]}
      </span>
    </div>
  );
}
