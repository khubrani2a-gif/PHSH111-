import { useState, type SyntheticEvent } from "react";
import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import { readPersistedBoolean, writePersistedBoolean } from "../../app/persistedState";
import type { ContentBlockType } from "../../types/pilotSchema";
import type { NormalizedText } from "../../types/normalized";

const SECTION_HEADING: Record<string, { en: string; ar: string }> = {
  mainIdea: { en: "Main Idea", ar: "الفكرة الرئيسية" },
  organizedExplanation: { en: "Explanation", ar: "الشرح" },
  example: { en: "Worked Example", ar: "مثال محلول" },
};

const MISSING_TEXT = {
  en: "No English text is available for this section.",
  ar: "لا يتوفر نص عربي لهذا القسم.",
} as const;

const COLLAPSE_LABEL = {
  en: "Collapse or expand this detailed section",
  ar: "طيّ هذا القسم التفصيلي أو توسيعه",
} as const;

interface ContentSectionProps {
  blockType: ContentBlockType;
  text: NormalizedText;
  sectionId?: string;
  collapsible?: boolean;
  /** localStorage key for the collapsible open/closed state (see src/app/persistedState.ts and MVP_IMPLEMENTATION_DECISIONS.json amendments[0]); omit to keep it session-only (React state, resets on reload — the original decision-J behavior). */
  persistKey?: string;
  /** Set for elements (e.g. h2) that should not repeat if a heading already exists nearby. */
  headingLevel?: "h1" | "h2";
  /**
   * Per-topic italic-variable whitelist (see
   * src/content/equationRenderer.tsx). Passed through so any embedded
   * notation in prose (e.g. the "example" block's worked-example text,
   * which does contain equations like "a_c = v^2/r = (7600)^2 / ...")
   * gets the same true-superscript/subscript/italic treatment as the
   * dedicated equation block, rather than showing raw "^2" text.
   */
  italicTokens?: readonly string[];
}

/**
 * Generic renderer for a single learner-visible content block (mainIdea,
 * organizedExplanation, example). Renders only what is explicitly present
 * in the source's localizedContent for the active language — if that
 * language's text is missing, shows a diagnostic note rather than
 * silently falling back to the other language (see
 * MVP_IMPLEMENTATION_DECISIONS.json decision G).
 */
export function ContentSection({
  blockType,
  text,
  sectionId,
  collapsible = false,
  persistKey,
  headingLevel = "h2",
  italicTokens = [],
}: ContentSectionProps) {
  const { language, direction } = useLanguage();
  const heading = SECTION_HEADING[blockType];
  const value = text[language];
  const Heading = headingLevel;
  const [open, setOpen] = useState<boolean>(() =>
    persistKey ? readPersistedBoolean(persistKey, true) : true,
  );

  function handleToggle(e: SyntheticEvent<HTMLDetailsElement>) {
    const next = e.currentTarget.open;
    setOpen(next);
    if (persistKey) writePersistedBoolean(persistKey, next);
  }

  return (
    <section id={sectionId} className={`content-section content-section--${blockType}`}>
      {heading ? <Heading>{heading[language]}</Heading> : null}
      {value && collapsible ? (
        <details className="content-disclosure" open={open} onToggle={handleToggle}>
          <summary>{COLLAPSE_LABEL[language]}</summary>
          <p className="content-section__text" dir={direction}>
            {renderEquationText(value, italicTokens)}
          </p>
        </details>
      ) : value ? (
        <p className="content-section__text" dir={direction}>
          {renderEquationText(value, italicTokens)}
        </p>
      ) : (
        <p className="content-section__missing" role="status">
          {MISSING_TEXT[language]}
        </p>
      )}
    </section>
  );
}
