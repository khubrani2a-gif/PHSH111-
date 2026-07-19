import { useLanguage } from "../../app/LanguageContext";

const COPY = {
  en: {
    label: "Fundamental Quantities section guide",
    heading: "Explore the topic",
    description:
      "Move between the original sections. The detailed explanation and equation can be collapsed whenever you want a shorter reading view.",
    steps: ["Main Idea", "Explanation", "Key Equation", "Scientific Visual", "Review Card"],
  },
  ar: {
    label: "دليل أقسام موضوع الكميات الأساسية",
    heading: "استكشف الموضوع",
    description:
      "تنقّل بين الأقسام الأصلية. ويمكنك طيّ الشرح التفصيلي والمعادلة عندما تريد عرضًا أقصر للقراءة.",
    steps: ["الفكرة الرئيسية", "الشرح", "المعادلة الأساسية", "العنصر البصري العلمي", "بطاقة المراجعة"],
  },
} as const;

const SECTION_IDS = [
  "topic-main-idea",
  "topic-explanation",
  "topic-equation",
  "topic-visual",
  "topic-review",
] as const;

/**
 * A presentation-only guide for ch01-t01. It links to the existing,
 * approved content blocks and adds no instructional claims of its own.
 */
export function TopicReadingGuide() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <nav className="topic-reading-guide" aria-label={copy.label}>
      <div className="topic-reading-guide__intro">
        <h2>{copy.heading}</h2>
        <p>{copy.description}</p>
      </div>
      <ol className="topic-reading-guide__steps">
        {copy.steps.map((step, index) => (
          <li key={SECTION_IDS[index]}>
            <a href={`#${SECTION_IDS[index]}`}>
              <span className="topic-reading-guide__number" aria-hidden="true">
                {index + 1}
              </span>
              <span>{step}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
