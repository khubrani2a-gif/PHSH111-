import { useState, type SyntheticEvent } from "react";
import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText, renderEquationTextWithHighlight } from "../../content/equationRenderer";
import { readPersistedBoolean, writePersistedBoolean } from "../../app/persistedState";
import type { NormalizedText } from "../../types/normalized";

const HEADING = { en: "Key Equation", ar: "المعادلة الأساسية" } as const;
const MISSING = {
  en: "No English text is available for this equation.",
  ar: "لا يتوفر نص عربي لهذه المعادلة.",
} as const;

const COLLAPSE_LABEL = {
  en: "Collapse or expand the equation explanation",
  ar: "طيّ شرح المعادلة أو توسيعه",
} as const;

interface EquationBlockProps {
  text: NormalizedText;
  italicTokens: readonly string[];
  sectionId?: string;
  collapsible?: boolean;
  /** localStorage key for the collapsible open/closed state (see src/app/persistedState.ts and MVP_IMPLEMENTATION_DECISIONS.json amendments[0]); omit to keep it session-only (React state, resets on reload — the original decision-J behavior). */
  persistKey?: string;
  /**
   * One exact, verified substring (e.g. "v = d / t") to visually highlight
   * within the rendered text — see
   * src/content/equationRenderer.tsx's renderEquationTextWithHighlight for
   * why this never alters, drops, or reorders any authored character.
   */
  highlightPhrase?: string;
}

/**
 * Renders the equationSet content block. The block's own text is prose
 * with embedded notation (see src/content/equationRenderer.tsx's header
 * for why) rather than a bare formula, so this component renders the full
 * text through the tokenizer rather than trying to extract "just the
 * equation" out of it — extracting would mean guessing which substring is
 * the formula, which risks dropping explanatory content the block's own
 * governance record (visibility: "shared") intends to be shown.
 */
export function EquationBlock({
  text,
  italicTokens,
  sectionId,
  collapsible = false,
  persistKey,
  highlightPhrase,
}: EquationBlockProps) {
  const { language, direction } = useLanguage();
  const value = text[language];
  const [open, setOpen] = useState<boolean>(() =>
    persistKey ? readPersistedBoolean(persistKey, true) : true,
  );

  function handleToggle(e: SyntheticEvent<HTMLDetailsElement>) {
    const next = e.currentTarget.open;
    setOpen(next);
    if (persistKey) writePersistedBoolean(persistKey, next);
  }

  const rendered = value
    ? highlightPhrase
      ? renderEquationTextWithHighlight(value, italicTokens, highlightPhrase)
      : renderEquationText(value, italicTokens)
    : null;

  return (
    <section
      id={sectionId}
      className="equation-block"
      aria-labelledby="equation-block-heading"
    >
      <h2 id="equation-block-heading">{HEADING[language]}</h2>
      {value && collapsible ? (
        <details className="content-disclosure" open={open} onToggle={handleToggle}>
          <summary>{COLLAPSE_LABEL[language]}</summary>
          <p className="equation-block__text" dir={direction}>
            {rendered}
          </p>
        </details>
      ) : value ? (
        <p className="equation-block__text" dir={direction}>
          {rendered}
        </p>
      ) : (
        <p className="equation-block__missing" role="status">
          {MISSING[language]}
        </p>
      )}
    </section>
  );
}
