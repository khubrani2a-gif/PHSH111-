import { useEffect, useState } from "react";
import { useLanguage } from "../../app/LanguageContext";

const COPY = {
  en: {
    label: "Fundamental Quantities section guide",
    heading: "Explore the topic",
    description:
      "Move between the original sections. The detailed explanation and equation can be collapsed whenever you want a shorter reading view.",
    steps: [
      "Fundamental Physical Quantities",
      "Main Idea",
      "Explanation",
      "Key Equation",
      "Scientific Visual",
      "Review Card",
    ],
  },
  ar: {
    label: "دليل أقسام موضوع الكميات الأساسية",
    heading: "استكشف الموضوع",
    description:
      "تنقّل بين الأقسام الأصلية. ويمكنك طيّ الشرح التفصيلي والمعادلة عندما تريد عرضًا أقصر للقراءة.",
    steps: [
      "الكميات الفيزيائية الأساسية",
      "الفكرة الرئيسية",
      "الشرح",
      "المعادلة الأساسية",
      "العنصر البصري العلمي",
      "بطاقة المراجعة",
    ],
  },
} as const;

const PROGRESS_LABEL = {
  en: (current: number, total: number) => `Step ${current} of ${total}`,
  ar: (current: number, total: number) => `الخطوة ${current} من ${total}`,
} as const;

const SECTION_IDS = [
  "topic-opening",
  "topic-main-idea",
  "topic-explanation",
  "topic-equation",
  "topic-visual",
  "topic-review",
] as const;

/**
 * Tracks which of the given section elements is currently closest to the
 * top of the viewport, for the active-step highlight and progress
 * indicator below. Client-only: guarded for the absence of
 * IntersectionObserver (this app's Node-environment test suite, and any
 * environment without it) so this effect is simply a no-op there rather
 * than throwing — activeId then stays null, matching this component's
 * pre-existing render output in those environments exactly.
 */
function useActiveSectionId(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        // Among currently-visible sections, the one nearest the top of the
        // viewport is treated as "the one being read".
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

/**
 * A presentation-only guide for ch01-t01. It links to the existing,
 * approved content blocks and adds no instructional claims of its own.
 * Sticky-positioned (see .topic-reading-guide in global.css) with an
 * active-step highlight and a step-progress indicator driven purely by
 * scroll position — no quiz/grading semantics, no data leaves the device.
 */
export function TopicReadingGuide() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const activeId = useActiveSectionId(SECTION_IDS);
  const activeIndex = activeId ? (SECTION_IDS as readonly string[]).indexOf(activeId) : -1;
  const progressText =
    activeIndex >= 0 ? PROGRESS_LABEL[language](activeIndex + 1, SECTION_IDS.length) : null;

  return (
    <nav className="topic-reading-guide" aria-label={copy.label}>
      <div className="topic-reading-guide__intro">
        <h2>{copy.heading}</h2>
        <p>{copy.description}</p>
      </div>

      <div className="topic-reading-guide__progress" role="status" aria-live="polite">
        <div className="topic-reading-guide__progress-track">
          <div
            className="topic-reading-guide__progress-fill"
            style={{
              width: `${((activeIndex >= 0 ? activeIndex + 1 : 0) / SECTION_IDS.length) * 100}%`,
            }}
          />
        </div>
        {progressText ? (
          <span className="topic-reading-guide__progress-text">{progressText}</span>
        ) : null}
      </div>

      <ol className="topic-reading-guide__steps">
        {copy.steps.map((step, index) => {
          const id = SECTION_IDS[index];
          const isActive = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "step" : undefined}
                className={
                  isActive
                    ? "topic-reading-guide__step topic-reading-guide__step--active"
                    : "topic-reading-guide__step"
                }
              >
                <span className="topic-reading-guide__number" aria-hidden="true">
                  {index + 1}
                </span>
                <span>{step}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
