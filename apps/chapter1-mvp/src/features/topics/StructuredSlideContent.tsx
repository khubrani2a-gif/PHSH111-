import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import type { NormalizedText } from "../../types/normalized";

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
  keyConcept: { en: "Key Concept", ar: "المفهوم الأساسي" },
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
  /** Optional — when present, an additional "Key Concept" subsection is parsed between Scientific Note and Connection. Omitted entirely for slides (e.g. Slide 1) that have no such subsection. */
  keyConceptMarker?: Marker;
  /** Exact phrase (identical in both languages — untranslated Latin notation) rendered in a distinct equation-block style within Simple Example. */
  equationBlockPhrase?: string;
  /**
   * Per-language pattern identifying the start of one numbered-step
   * paragraph. Defaults to DEFAULT_STEP_PATTERN ("1. ", "2. ", ...,
   * identical in both languages) when omitted — Slide 1's convention.
   * A slide whose steps use a different lead-in convention per language
   * (e.g. "Step 1 — ..." / "الخطوة 1 — ...") supplies its own pair here;
   * only the matched prefix is bolded as the step's title, and the
   * remainder becomes the step's body.
   */
  stepPattern?: { en: RegExp; ar: RegExp };
}

const DEFAULT_STEP_PATTERN = /^\d+\.\s/;

/**
 * Per-block marker configuration for openingConcept-family blocks that
 * follow the "Original quote / Main idea / numbered steps / Simple example
 * / misconception / scientific note / (optional key concept) / connection"
 * convention. Keyed by the content block's own recordId (blockId) rather
 * than topicId, since one topic (ch01-t01) can have more than one slide,
 * each with its own marker wording. Adding a config entry for a future
 * slide's blockId makes StructuredSlideContent parse and label its
 * sections the same way — the component itself never hardcodes any
 * slide's wording. A block with no entry here (or whose text doesn't
 * actually contain the markers in the expected order) simply renders as
 * plain paragraphs, unchanged.
 */
export const STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID: Partial<Record<string, StructuredSlideConfig>> = {
  "ch01-t01-block-opening": {
    mainIdeaMarker: { en: "Main idea:", ar: "الفكرة الأساسية:" },
    simpleExampleMarker: { en: "Simple example:", ar: "مثال بسيط:" },
    misconceptionMarker: { en: "Common misconception:", ar: "مفهوم خاطئ شائع:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    connectionMarker: { en: "Connection to the next part:", ar: "الصلة بالجزء التالي:" },
    equationBlockPhrase: "v = d / t = 100 m / 5 s = 20 m/s",
  },
  "ch01-t01-block-opening-2": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: "Speed = 120 miles / 2 h = 60 miles/h",
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
};

/** Splits a step's remaining body text into bullet clauses. Prefers an already-authored line-break + "* "/"- " bullet convention (used when a step spans multiple lines); falls back to an already-authored "; "/"؛ " connector within a single line (Slide 1's convention). Either way, only the pre-existing structural separator itself (a newline+marker, or the connector) is consumed — no character of the authored text is altered. */
const CLAUSE_SPLIT = /;\s+|؛\s+/;

function splitStepBody(rest: string): string[] {
  const lines = rest
    .split(/\n+/)
    .map((line) => line.replace(/^[*-]\s+/, "").trim())
    .filter((line) => line.length > 0);
  if (lines.length > 1) return lines;
  return rest.split(CLAUSE_SPLIT);
}

interface ParsedSections {
  original: string[];
  mainIdea: string[];
  steps: string[];
  simpleExample: string[];
  misconception: string[];
  scientificNote: string[];
  keyConcept: string[];
  connection: string[];
}

/**
 * Locates each subsection as a contiguous run of paragraphs, using only
 * exact, pre-verified marker substrings (see
 * STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID). Returns null — meaning "render the
 * plain paragraphs unchanged" — unless every required marker is found, in
 * the expected order, with at least one contiguous numbered-step paragraph
 * between Main Idea and Simple Example. This guarantees any block/language
 * whose text doesn't match the expected convention falls back to the
 * original, unrestructured rendering rather than risking a garbled or
 * incomplete split.
 */
function parseSections(value: string, config: StructuredSlideConfig, lang: "en" | "ar"): ParsedSections | null {
  const paragraphs = value.split(/\n{2,}/);
  const stepPattern = config.stepPattern ? config.stepPattern[lang] : DEFAULT_STEP_PATTERN;

  const mainIdeaIdx = paragraphs.findIndex((p) => p.startsWith(config.mainIdeaMarker[lang]));
  const firstStepIdx = paragraphs.findIndex((p) => stepPattern.test(p));
  const simpleExampleIdx = paragraphs.findIndex((p) => p.startsWith(config.simpleExampleMarker[lang]));
  const misconceptionIdx = paragraphs.findIndex((p) => p.startsWith(config.misconceptionMarker[lang]));
  const scientificNoteIdx = paragraphs.findIndex((p) => p.startsWith(config.scientificNoteMarker[lang]));
  const keyConceptIdx = config.keyConceptMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.keyConceptMarker![lang]))
    : -1;
  const connectionIdx = paragraphs.findIndex((p) => p.startsWith(config.connectionMarker[lang]));

  const ordered = config.keyConceptMarker
    ? [mainIdeaIdx, firstStepIdx, simpleExampleIdx, misconceptionIdx, scientificNoteIdx, keyConceptIdx, connectionIdx]
    : [mainIdeaIdx, firstStepIdx, simpleExampleIdx, misconceptionIdx, scientificNoteIdx, connectionIdx];
  const inOrder = ordered.every((idx, i) => idx >= 0 && (i === 0 || idx > ordered[i - 1]));
  if (!inOrder) return null;

  const stepParagraphs = paragraphs.slice(firstStepIdx, simpleExampleIdx);
  if (!stepParagraphs.every((p) => stepPattern.test(p))) return null;

  const scientificNoteEnd = config.keyConceptMarker ? keyConceptIdx : connectionIdx;

  return {
    original: paragraphs.slice(0, mainIdeaIdx),
    mainIdea: paragraphs.slice(mainIdeaIdx, firstStepIdx),
    steps: stepParagraphs,
    simpleExample: paragraphs.slice(simpleExampleIdx, misconceptionIdx),
    misconception: paragraphs.slice(misconceptionIdx, scientificNoteIdx),
    scientificNote: paragraphs.slice(scientificNoteIdx, scientificNoteEnd),
    keyConcept: config.keyConceptMarker ? paragraphs.slice(keyConceptIdx, connectionIdx) : [],
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

function renderSteps(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  stepPattern: RegExp,
) {
  return (
    <ol className="structured-slide__steps">
      {paragraphs.map((paragraph, i) => {
        const match = stepPattern.exec(paragraph);
        const title = match ? match[0].trim() : "";
        const rest = match ? paragraph.slice(match[0].length) : paragraph;
        const clauses = splitStepBody(rest);

        return (
          <li className="structured-slide__step" dir={direction} key={i}>
            <strong className="structured-slide__step-number">{title}</strong>
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
  /** The content block's own recordId (e.g. "ch01-t01-block-opening"), used to look up its marker configuration in STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID. */
  blockId: string;
  text: NormalizedText;
  italicTokens?: readonly string[];
}

/**
 * Reformats an openingConcept-family block's approved prose into clearly
 * labeled subsections (Original English, Main Idea, Step-by-Step
 * Explanation, Simple Example, Common Misconception, Scientific Note,
 * optionally Key Concept, Connection to the Next Slide) — presentation
 * only. No character of the approved text is ever rewritten, translated,
 * or reordered: paragraphs are only grouped under headings and, for
 * numbered steps and equation lines, given additional semantic markup.
 * Falls back to the original single-block paragraph rendering (identical
 * to ContentSection's default) whenever the block has no
 * STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID entry, or the text doesn't actually
 * contain that entry's markers in the expected order — so this is safe to
 * use for future slides without per-slide hardcoding.
 */
export function StructuredSlideContent({ blockId, text, italicTokens = [] }: StructuredSlideContentProps) {
  const { language, direction } = useLanguage();
  const value = text[language];

  if (!value) {
    return (
      <p className="content-section__missing" role="status">
        {MISSING_TEXT[language]}
      </p>
    );
  }

  const config = STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[blockId];
  const sections = config ? parseSections(value, config, language) : null;

  if (!sections) {
    return <>{renderPlainParagraphs(value.split(/\n{2,}/), italicTokens, direction)}</>;
  }

  const stepPattern = config?.stepPattern ? config.stepPattern[language] : DEFAULT_STEP_PATTERN;

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
        {renderSteps(sections.steps, italicTokens, direction, stepPattern)}
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
        {renderPlainParagraphs(sections.scientificNote, italicTokens, direction)}
      </section>

      {sections.keyConcept.length > 0 ? (
        <section className="structured-slide__section">
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.keyConcept[language]}</h4>
          {renderPlainParagraphs(sections.keyConcept, italicTokens, direction)}
        </section>
      ) : null}

      <section className="structured-slide__section">
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.connection[language]}</h4>
        {renderPlainParagraphs(sections.connection, italicTokens, direction)}
      </section>
    </div>
  );
}
