import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText, renderEquationTextWithHighlight } from "../../content/equationRenderer";
import type { NormalizedText } from "../../types/normalized";
import type { PilotTopicId } from "../../types/pilotSchema";

const MISSING_TEXT = {
  en: "No English text is available for this section.",
  ar: "لا يتوفر نص عربي لهذا القسم.",
} as const;

const SUBSECTION_LABEL = {
  original: { en: "Original English", ar: "النص الإنجليزي الأصلي" },
  mainIdea: { en: "Main Idea", ar: "الفكرة الرئيسية" },
  steps: { en: "Step-by-Step Explanation", ar: "الشرح خطوة بخطوة" },
  simpleExample: { en: "Simple Example", ar: "مثال بسيط" },
  misconception: { en: "Common Misconception", ar: "مفهوم خاطئ شائع" },
  scientificNote: { en: "Scientific Note", ar: "ملاحظة علمية" },
  connection: { en: "Connection to the Next Slide", ar: "الصلة بالشريحة التالية" },
} as const;

/** A verified, verbatim lead-in substring that marks the start of one paragraph, per language. */
interface Marker {
  en: string;
  ar: string;
}

export interface StructuredSlideConfig {
  mainIdeaMarker: Marker;
  simpleExampleMarker: Marker;
  misconceptionMarker: Marker;
  scientificNoteMarker: Marker;
  connectionMarker: Marker;
  /** Exact phrase (identical in both languages — untranslated Latin notation) rendered in a distinct equation-block style within Simple Example. */
  equationBlockPhrase?: string;
  /** Exact phrase rendered in a distinct inline equation style within Scientific Note. */
  inlineEquationPhrase?: string;
}

/**
 * Per-topic marker configuration for openingConcept blocks that follow the
 * "Original quote / Main idea / numbered steps / Simple example /
 * misconception / scientific note / connection" convention. Adding a
 * config entry for a future topic (e.g. a Slide 2) makes
 * StructuredSlideContent parse and label its sections the same way — the
 * component itself never hardcodes any topic's wording. A topic with no
 * entry here (or whose text doesn't actually contain the markers in the
 * expected order) simply renders as plain paragraphs, unchanged.
 */
export const STRUCTURED_SLIDE_CONFIG_BY_TOPIC: Partial<Record<PilotTopicId, StructuredSlideConfig>> = {
  "ch01-t01": {
    mainIdeaMarker: { en: "Main idea:", ar: "الفكرة الأساسية:" },
    simpleExampleMarker: { en: "Simple example:", ar: "مثال بسيط:" },
    misconceptionMarker: { en: "Common misconception:", ar: "مفهوم خاطئ شائع:" },
    scientificNoteMarker: { en: "Scientific note:", ar: "ملاحظة علمية:" },
    connectionMarker: { en: "Connection to the next part:", ar: "الصلة بالجزء التالي:" },
    equationBlockPhrase: "v = d / t = 100 m / 5 s = 20 m/s",
    inlineEquationPhrase: "Q = I t",
  },
};

const STEP_PATTERN = /^\d+\.\s/;
/** Splits a step paragraph's remaining text into bullet clauses on an already-authored "; " or "؛ " connector — the same kind of pre-existing structural separator that paragraph-splitting already consumes on "\n\n" (see ContentSection.tsx's renderParagraphs). No characters other than the connector itself are ever dropped. */
const CLAUSE_SPLIT = /;\s+|؛\s+/;

interface ParsedSections {
  original: string[];
  mainIdea: string[];
  steps: string[];
  simpleExample: string[];
  misconception: string[];
  scientificNote: string[];
  connection: string[];
}

/**
 * Locates each subsection as a contiguous run of paragraphs, using only
 * exact, pre-verified marker substrings (see STRUCTURED_SLIDE_CONFIG_BY_TOPIC).
 * Returns null — meaning "render the plain paragraphs unchanged" — unless
 * every marker is found, in the expected order, with at least one
 * contiguous numbered-step paragraph between Main Idea and Simple Example.
 * This guarantees any topic/language whose text doesn't match the expected
 * convention falls back to the original, unrestructured rendering rather
 * than risking a garbled or incomplete split.
 */
function parseSections(value: string, config: StructuredSlideConfig, lang: "en" | "ar"): ParsedSections | null {
  const paragraphs = value.split(/\n{2,}/);

  const mainIdeaIdx = paragraphs.findIndex((p) => p.startsWith(config.mainIdeaMarker[lang]));
  const firstStepIdx = paragraphs.findIndex((p) => STEP_PATTERN.test(p));
  const simpleExampleIdx = paragraphs.findIndex((p) => p.startsWith(config.simpleExampleMarker[lang]));
  const misconceptionIdx = paragraphs.findIndex((p) => p.startsWith(config.misconceptionMarker[lang]));
  const scientificNoteIdx = paragraphs.findIndex((p) => p.startsWith(config.scientificNoteMarker[lang]));
  const connectionIdx = paragraphs.findIndex((p) => p.startsWith(config.connectionMarker[lang]));

  const ordered = [mainIdeaIdx, firstStepIdx, simpleExampleIdx, misconceptionIdx, scientificNoteIdx, connectionIdx];
  const inOrder = ordered.every((idx, i) => idx >= 0 && (i === 0 || idx > ordered[i - 1]));
  if (!inOrder) return null;

  const stepParagraphs = paragraphs.slice(firstStepIdx, simpleExampleIdx);
  if (!stepParagraphs.every((p) => STEP_PATTERN.test(p))) return null;

  return {
    original: paragraphs.slice(0, mainIdeaIdx),
    mainIdea: paragraphs.slice(mainIdeaIdx, firstStepIdx),
    steps: stepParagraphs,
    simpleExample: paragraphs.slice(simpleExampleIdx, misconceptionIdx),
    misconception: paragraphs.slice(misconceptionIdx, scientificNoteIdx),
    scientificNote: paragraphs.slice(scientificNoteIdx, connectionIdx),
    connection: paragraphs.slice(connectionIdx),
  };
}

function renderPlainParagraphs(paragraphs: string[], italicTokens: readonly string[], direction: "ltr" | "rtl") {
  return paragraphs.map((paragraph, i) => (
    <p className="content-section__text" dir={direction} key={i}>
      {renderEquationText(paragraph, italicTokens)}
    </p>
  ));
}

function renderEquationAwareParagraphs(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  equationBlockPhrase: string | undefined,
) {
  return paragraphs.map((paragraph, i) =>
    equationBlockPhrase && paragraph === equationBlockPhrase ? (
      <div className="structured-slide__equation-block" dir={direction} key={i}>
        {renderEquationText(paragraph, italicTokens)}
      </div>
    ) : (
      <p className="content-section__text" dir={direction} key={i}>
        {renderEquationText(paragraph, italicTokens)}
      </p>
    ),
  );
}

function renderScientificNoteParagraphs(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  inlineEquationPhrase: string | undefined,
) {
  return paragraphs.map((paragraph, i) => (
    <p className="content-section__text" dir={direction} key={i}>
      {inlineEquationPhrase
        ? renderEquationTextWithHighlight(paragraph, italicTokens, inlineEquationPhrase, "equation-inline")
        : renderEquationText(paragraph, italicTokens)}
    </p>
  ));
}

function renderSteps(paragraphs: string[], italicTokens: readonly string[], direction: "ltr" | "rtl") {
  return (
    <ol className="structured-slide__steps">
      {paragraphs.map((paragraph, i) => {
        const match = STEP_PATTERN.exec(paragraph);
        const numeral = match ? match[0].trim() : "";
        const rest = match ? paragraph.slice(match[0].length) : paragraph;
        const clauses = rest.split(CLAUSE_SPLIT);

        return (
          <li className="structured-slide__step" dir={direction} key={i}>
            <strong className="structured-slide__step-number">{numeral}</strong>
            {clauses.length > 1 ? (
              <ul className="structured-slide__step-clauses">
                {clauses.map((clause, j) => (
                  <li key={j}>{renderEquationText(clause, italicTokens)}</li>
                ))}
              </ul>
            ) : (
              <span>{renderEquationText(rest, italicTokens)}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface StructuredSlideContentProps {
  topicId: PilotTopicId;
  text: NormalizedText;
  italicTokens?: readonly string[];
}

/**
 * Reformats an openingConcept block's approved prose into clearly labeled
 * subsections (Original English, Main Idea, Step-by-Step Explanation,
 * Simple Example, Common Misconception, Scientific Note, Connection to the
 * Next Slide) — presentation only. No character of the approved text is
 * ever rewritten, translated, or reordered: paragraphs are only grouped
 * under headings and, for numbered steps and equation lines, given
 * additional semantic markup. Falls back to the original single-block
 * paragraph rendering (identical to ContentSection's default) whenever the
 * topic has no STRUCTURED_SLIDE_CONFIG_BY_TOPIC entry, or the text doesn't
 * actually contain that entry's markers in the expected order — so this is
 * safe to use for future slides without per-slide hardcoding.
 */
export function StructuredSlideContent({ topicId, text, italicTokens = [] }: StructuredSlideContentProps) {
  const { language, direction } = useLanguage();
  const value = text[language];

  if (!value) {
    return (
      <p className="content-section__missing" role="status">
        {MISSING_TEXT[language]}
      </p>
    );
  }

  const config = STRUCTURED_SLIDE_CONFIG_BY_TOPIC[topicId];
  const sections = config ? parseSections(value, config, language) : null;

  if (!sections) {
    return <>{renderPlainParagraphs(value.split(/\n{2,}/), italicTokens, direction)}</>;
  }

  return (
    <div className="structured-slide">
      {sections.original.length > 0 ? (
        <section className="structured-slide__section">
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.original[language]}</h4>
          {renderPlainParagraphs(sections.original, italicTokens, direction)}
        </section>
      ) : null}

      <section className="structured-slide__section">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.mainIdea[language]}</h4>
        {renderPlainParagraphs(sections.mainIdea, italicTokens, direction)}
      </section>

      <section className="structured-slide__section">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.steps[language]}</h4>
        {renderSteps(sections.steps, italicTokens, direction)}
      </section>

      <section className="structured-slide__section">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.simpleExample[language]}</h4>
        {renderEquationAwareParagraphs(sections.simpleExample, italicTokens, direction, config?.equationBlockPhrase)}
      </section>

      <section className="structured-slide__section structured-slide__callout structured-slide__callout--misconception">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.misconception[language]}</h4>
        {renderPlainParagraphs(sections.misconception, italicTokens, direction)}
      </section>

      <section className="structured-slide__section structured-slide__callout structured-slide__callout--scientific-note">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.scientificNote[language]}</h4>
        {renderScientificNoteParagraphs(sections.scientificNote, italicTokens, direction, config?.inlineEquationPhrase)}
      </section>

      <section className="structured-slide__section">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.connection[language]}</h4>
        {renderPlainParagraphs(sections.connection, italicTokens, direction)}
      </section>
    </div>
  );
}
