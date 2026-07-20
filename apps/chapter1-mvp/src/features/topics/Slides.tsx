import type { ReactNode } from "react";
import { useLanguage } from "../../app/LanguageContext";

const SLIDES_LABEL = { en: "Slides", ar: "الشرائح" } as const;

interface SlidesSectionProps {
  /** One or more <Slide> elements, in display order. */
  children: ReactNode;
}

/**
 * Parent container for a topic's slide-based content. Presentation-only —
 * it carries no instructional text of its own, just the bilingual "Slides"
 * / "الشرائح" heading and a list wrapper for its <Slide> children. Designed
 * so a topic can add Slide 2, Slide 3, etc. as additional children later
 * without any change to this component or to the underlying content
 * schema (each slide still reads from its own existing normalized content
 * field, e.g. topic.openingConcept for Slide 1 — see TopicPage.tsx).
 */
export function SlidesSection({ children }: SlidesSectionProps) {
  const { language } = useLanguage();

  return (
    <section className="slides-section" aria-labelledby="slides-heading">
      <h2 id="slides-heading">{SLIDES_LABEL[language]}</h2>
      <div className="slides-section__list">{children}</div>
    </section>
  );
}

const SLIDE_LABEL = {
  en: (n: number, title: string) => `Slide ${n} — ${title}`,
  ar: (n: number, title: string) => `الشريحة ${n} — ${title}`,
} as const;

interface SlideProps {
  /** 1-based slide number, shown as "Slide N — title" / "الشريحة N — العنوان". */
  number: number;
  title: { en: string; ar: string };
  /** Anchor id for the reading guide / scroll-to-section navigation. */
  id?: string;
  children: ReactNode;
}

/**
 * One slide within a SlidesSection. Purely a labeled container — the
 * actual instructional content (original quote, main idea, steps,
 * example, misconception, scientific note, connection) is rendered by
 * whatever is passed as children (currently a single ContentSection for
 * ch01-t01's openingConcept block); this component only supplies the
 * "Slide N — title" heading and a distinct visual boundary so the parent
 * Slides section and each individual slide read as clearly separate.
 */
export function Slide({ number, title, id, children }: SlideProps) {
  const { language } = useLanguage();
  const label = SLIDE_LABEL[language](number, title[language]);

  return (
    <section id={id} className="slide" aria-labelledby={`slide-${number}-heading`}>
      <h3 id={`slide-${number}-heading`} className="slide__title">
        {label}
      </h3>
      <div className="slide__content">{children}</div>
    </section>
  );
}
