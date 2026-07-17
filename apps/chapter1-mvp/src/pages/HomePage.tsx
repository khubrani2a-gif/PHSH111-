import { Link } from "react-router-dom";
import { useLanguage } from "../app/LanguageContext";

// See src/app/AppShell.tsx for the naming rationale (app name is an
// untranslated Latin proper noun in both languages).
const APP_NAME = "PHSH111";

const SUBTITLE = {
  en: "Physics for Health Sciences",
  ar: "الفيزياء لعلوم الصحة",
} as const;

const RELEASE_LABEL = {
  en: "Chapter 1 Internal Pilot",
  ar: "الفصل الأول — نسخة داخلية تجريبية",
} as const;

const TEXT = {
  en: {
    intro:
      "This is an internal review build. It exists to validate content rendering, bilingual behavior, and navigation for a small pilot set of Chapter 1 topics — it is not a released product and has not been approved for student use.",
    scope:
      "This MVP currently covers six topics from Chapter 1, out of the full chapter.",
    cta: "Go to Chapter 1",
  },
  ar: {
    intro:
      "هذه نسخة مراجعة داخلية. الغرض منها التحقق من عرض المحتوى والسلوك ثنائي اللغة والتنقل لمجموعة تجريبية صغيرة من مواضيع الفصل الأول — وهي ليست منتجًا نهائيًا ولم تُعتمد للاستخدام من قبل الطلاب.",
    scope:
      "يغطي هذا الإصدار التجريبي حاليًا ستة مواضيع من الفصل الأول، من إجمالي الفصل الكامل.",
    cta: "الانتقال إلى الفصل الأول",
  },
} as const;

export function HomePage() {
  const { language } = useLanguage();
  const text = TEXT[language];

  return (
    <section className="home-page">
      {/* Title/subtitle are already visible in the persistent app header
          (AppShell) on every route. Repeating them here would duplicate the
          brand at full hero size on small screens, so they stay for
          assistive tech / document semantics only. */}
      <h1 className="visually-hidden">
        {APP_NAME} — {SUBTITLE[language]}
      </h1>
      <p className="home-page__release-label" role="status">
        {RELEASE_LABEL[language]}
      </p>
      <p className="home-page__intro">{text.intro}</p>
      <p className="home-page__scope">{text.scope}</p>
      <Link to="/chapter/1" className="home-page__cta">
        {text.cta}
      </Link>
    </section>
  );
}
