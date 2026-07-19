import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
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
}: EquationBlockProps) {
  const { language, direction } = useLanguage();
  const value = text[language];

  return (
    <section
      id={sectionId}
      className="equation-block"
      aria-labelledby="equation-block-heading"
    >
      <h2 id="equation-block-heading">{HEADING[language]}</h2>
      {value && collapsible ? (
        <details className="content-disclosure" open>
          <summary>{COLLAPSE_LABEL[language]}</summary>
          <p className="equation-block__text" dir={direction}>
            {renderEquationText(value, italicTokens)}
          </p>
        </details>
      ) : value ? (
        <p className="equation-block__text" dir={direction}>
          {renderEquationText(value, italicTokens)}
        </p>
      ) : (
        <p className="equation-block__missing" role="status">
          {MISSING[language]}
        </p>
      )}
    </section>
  );
}
