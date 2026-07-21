import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import type { NormalizedSourceTable, NormalizedText } from "../../types/normalized";
import { SlideFigure } from "./SlideFigure";

const MISSING_TEXT = {
  en: "No English text is available for this section.",
  ar: "لا يتوفر نص عربي لهذا القسم.",
} as const;

const SUBSECTION_LABEL = {
  original: { en: "Original English", ar: "النص الإنجليزي الأصلي" },
  mainIdea: { en: "Main Idea", ar: "الفكرة الرئيسية" },
  steps: { en: "Step-by-Step Explanation", ar: "الشرح خطوة بخطوة" },
  simpleExample: { en: "Simple Example", ar: "مثال بسيط" },
  tableExplanation: { en: "Table Explanation", ar: "شرح الجدول" },
  figureExplanation: { en: "Figure Explanation", ar: "شرح الشكل" },
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
  /** Optional — when present, an additional "Table Explanation" subsection is parsed between Simple Example and Common Misconception. Omitted entirely for slides with no source table (e.g. Slides 1 and 2). Mutually exclusive with figureExplanationMarker in current usage — both occupy the same slot. */
  tableExplanationMarker?: Marker;
  /** Optional — when present, an additional "Figure Explanation" subsection is parsed between Simple Example and Common Misconception. Omitted entirely for slides with no embedded figure. Mutually exclusive with tableExplanationMarker in current usage — both occupy the same slot. */
  figureExplanationMarker?: Marker;
  /**
   * Untranslated Latin notation, identical in both languages, that marks a
   * paragraph within Simple Example for distinct equation-block styling.
   * Matched as a substring (not full equality) so a per-language label may
   * precede it in the authored text (e.g. "Dimensions: 200 cm × 80 cm ×
   * 75 cm" / "الأبعاد: 200 cm × 80 cm × 75 cm" both match the phrase "200
   * cm × 80 cm × 75 cm") while the notation itself stays untranslated. A
   * slide with more than one worked calculation in its Simple Example
   * (e.g. Slide 6's separate area and volume examples) supplies an array
   * — a paragraph matching ANY entry gets equation-block styling.
   */
  equationBlockPhrase?: string | string[];
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
  "ch01-t01-block-opening-3": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    tableExplanationMarker: { en: "Table Explanation:", ar: "شرح الجدول:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: "200 cm × 80 cm × 75 cm",
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-4": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    figureExplanationMarker: { en: "Figure Explanation:", ar: "شرح الشكل:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-5": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    figureExplanationMarker: { en: "Figure Explanation:", ar: "شرح الشكل:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: "A = (4 m)(3 m) = 12 m²",
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-6": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    tableExplanationMarker: { en: "Table Explanation:", ar: "شرح الجدول:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: ["A = (5 m)(4 m) = 20 m²", "V = (2 m)(1 m)(0.5 m) = 1 m³"],
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
  tableExplanation: string[];
  figureExplanation: string[];
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
  const tableExplanationIdx = config.tableExplanationMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.tableExplanationMarker![lang]))
    : -1;
  const figureExplanationIdx = config.figureExplanationMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.figureExplanationMarker![lang]))
    : -1;
  const misconceptionIdx = paragraphs.findIndex((p) => p.startsWith(config.misconceptionMarker[lang]));
  const scientificNoteIdx = paragraphs.findIndex((p) => p.startsWith(config.scientificNoteMarker[lang]));
  const keyConceptIdx = config.keyConceptMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.keyConceptMarker![lang]))
    : -1;
  const connectionIdx = paragraphs.findIndex((p) => p.startsWith(config.connectionMarker[lang]));

  const ordered = [mainIdeaIdx, firstStepIdx, simpleExampleIdx];
  if (config.tableExplanationMarker) ordered.push(tableExplanationIdx);
  if (config.figureExplanationMarker) ordered.push(figureExplanationIdx);
  ordered.push(misconceptionIdx, scientificNoteIdx);
  if (config.keyConceptMarker) ordered.push(keyConceptIdx);
  ordered.push(connectionIdx);

  const inOrder = ordered.every((idx, i) => idx >= 0 && (i === 0 || idx > ordered[i - 1]));
  if (!inOrder) return null;

  const stepParagraphs = paragraphs.slice(firstStepIdx, simpleExampleIdx);
  if (!stepParagraphs.every((p) => stepPattern.test(p))) return null;

  // Table Explanation and Figure Explanation are mutually exclusive in
  // current usage (each slide has at most a source table OR an embedded
  // figure, never both) — both occupy the same slot immediately after
  // Simple Example, so whichever is configured determines where Simple
  // Example ends and itself ends at Common Misconception.
  const simpleExampleEnd = config.tableExplanationMarker
    ? tableExplanationIdx
    : config.figureExplanationMarker
      ? figureExplanationIdx
      : misconceptionIdx;
  const scientificNoteEnd = config.keyConceptMarker ? keyConceptIdx : connectionIdx;

  return {
    original: paragraphs.slice(0, mainIdeaIdx),
    mainIdea: paragraphs.slice(mainIdeaIdx, firstStepIdx),
    steps: stepParagraphs,
    simpleExample: paragraphs.slice(simpleExampleIdx, simpleExampleEnd),
    tableExplanation: config.tableExplanationMarker ? paragraphs.slice(tableExplanationIdx, misconceptionIdx) : [],
    figureExplanation: config.figureExplanationMarker ? paragraphs.slice(figureExplanationIdx, misconceptionIdx) : [],
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

function matchesEquationBlockPhrase(paragraph: string, equationBlockPhrase: string | string[] | undefined): boolean {
  if (!equationBlockPhrase) return false;
  return Array.isArray(equationBlockPhrase)
    ? equationBlockPhrase.some((phrase) => paragraph.includes(phrase))
    : paragraph.includes(equationBlockPhrase);
}

function renderEquationAwareParagraphs(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  equationBlockPhrase: string | string[] | undefined,
) {
  return paragraphs.map((paragraph, i) =>
    matchesEquationBlockPhrase(paragraph, equationBlockPhrase) ? (
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

/**
 * For each row, how many rows (including itself) its first cell should
 * span: a non-null first cell starts a new row-group and its span grows
 * by one for every immediately-following row whose own first cell is
 * null (the established convention for a "continuation" row — see e.g.
 * Slide 3's table, whose first column is null on every row after its
 * first). A continuation row's own span is 0 (it contributes no
 * `<th>` cell of its own; it's covered by the group's rowSpan).
 */
function computeRowGroupSpans(rows: NormalizedSourceTable["rows"]): number[] {
  const spans = rows.map(() => 0);
  let groupStart = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] !== null) {
      groupStart = i;
      spans[i] = 1;
    } else if (groupStart >= 0) {
      spans[groupStart] += 1;
    }
  }
  return spans;
}

/**
 * Renders a source table (see NormalizedSlide.table) as a real, accessible
 * <table> — semantic markup reconstructed from the source's headers/rows,
 * never the original screenshot/image itself. Wrapped in a scrollable
 * container so a wide table degrades to horizontal scroll on narrow
 * viewports instead of overlapping text; `dir` on the wrapper gives correct
 * RTL column order and cell alignment in Arabic.
 *
 * The first column is treated as a grouped row header: a row whose first
 * cell is non-null renders it as a `<th scope="rowgroup">` spanning every
 * immediately-following row whose own first cell is null (the existing
 * null-as-continuation convention already used by every table-bearing
 * slide's data) — generic to any table, not specific to any one slide.
 */
function renderSourceTable(table: NormalizedSourceTable, direction: "ltr" | "rtl") {
  const rowGroupSpans = computeRowGroupSpans(table.rows);
  return (
    <div className="structured-slide__table-wrapper" dir={direction}>
      <table className="structured-slide__table">
        {table.caption ? <caption>{table.caption}</caption> : null}
        <thead>
          <tr>
            {table.headers.map((header, i) => (
              <th scope="col" key={i}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  cell !== null ? (
                    <th scope="rowgroup" rowSpan={rowGroupSpans[i]} key={j}>
                      {cell}
                    </th>
                  ) : null
                ) : (
                  <td key={j}>{cell ?? ""}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StructuredSlideContentProps {
  /** The content block's own recordId (e.g. "ch01-t01-block-opening"), used to look up its marker configuration in STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID. */
  blockId: string;
  text: NormalizedText;
  /** Present only for slides carrying a source table (see NormalizedSlide.table) — generic to any slide, not tied to a specific slide number. */
  table?: { en: NormalizedSourceTable | null; ar: NormalizedSourceTable | null };
  /** Present only for slides carrying an embedded figure (see NormalizedSlide.figure) — generic to any slide, not tied to a specific slide number. */
  figure?: { assetUrl: string; alt: NormalizedText };
  italicTokens?: readonly string[];
}

/**
 * Reformats an openingConcept-family block's approved prose into clearly
 * labeled subsections (Original English, Main Idea, Step-by-Step
 * Explanation, Simple Example, optionally Table Explanation, Common
 * Misconception, Scientific Note, optionally Key Concept, Connection to
 * the Next Slide) — presentation only. No character of the approved text
 * is ever rewritten, translated, or reordered: paragraphs are only grouped
 * under headings and, for numbered steps, equation lines, and an optional
 * source table, given additional semantic markup. Falls back to the
 * original single-block paragraph rendering (identical to ContentSection's
 * default) whenever the block has no STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID
 * entry, or the text doesn't actually contain that entry's markers in the
 * expected order — so this is safe to use for future slides without
 * per-slide hardcoding.
 */
export function StructuredSlideContent({ blockId, text, table, figure, italicTokens = [] }: StructuredSlideContentProps) {
  const { language, direction } = useLanguage();
  const value = text[language];
  const tableForLanguage = table ? table[language] : null;

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
          {tableForLanguage ? renderSourceTable(tableForLanguage, direction) : null}
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

      {sections.tableExplanation.length > 0 ? (
        <section className="structured-slide__section">
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.tableExplanation[language]}</h4>
          {renderPlainParagraphs(sections.tableExplanation, italicTokens, direction)}
        </section>
      ) : null}

      {sections.figureExplanation.length > 0 ? (
        <section className="structured-slide__section">
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.figureExplanation[language]}</h4>
          {figure ? <SlideFigure assetUrl={figure.assetUrl} alt={figure.alt} /> : null}
          {renderPlainParagraphs(sections.figureExplanation, italicTokens, direction)}
        </section>
      ) : null}

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
