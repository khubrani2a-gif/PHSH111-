import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import type { DefinitionEntry, NormalizedSourceTable, NormalizedText } from "../../types/normalized";
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
  conversionFactorExplanation: { en: "Conversion-Factor Explanation", ar: "شرح عامل التحويل" },
  definitionExplanation: { en: "Definition Explanation", ar: "شرح التعريف" },
  relationshipExplanation: { en: "Relationship Explanation", ar: "شرح العلاقة" },
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
  /** Optional — when present, an additional "Figure Explanation" subsection is parsed between Simple Example and Common Misconception. Omitted entirely for slides with no embedded figure. Mutually exclusive with tableExplanationMarker/conversionFactorExplanationMarker in current usage — all three occupy the same slot. */
  figureExplanationMarker?: Marker;
  /** Optional — when present, an additional "Conversion-Factor Explanation" subsection is parsed between Simple Example and Common Misconception. Used by slides with neither a source table nor an embedded figure that still need a labeled explanatory subsection there (e.g. a unit-conversion slide explaining why its conversion factor is valid). Mutually exclusive with tableExplanationMarker/figureExplanationMarker/definitionExplanationMarker/relationshipExplanationMarker in current usage — all five occupy the same slot. */
  conversionFactorExplanationMarker?: Marker;
  /** Optional — when present, an additional "Definition Explanation" subsection is parsed between Simple Example and Common Misconception. Used by slides built around one or more reconstructed source definitions (see NormalizedSlide.definitions) that still need a labeled explanatory subsection contrasting/relating those definitions. Mutually exclusive with tableExplanationMarker/figureExplanationMarker/conversionFactorExplanationMarker/relationshipExplanationMarker in current usage — all five occupy the same slot. */
  definitionExplanationMarker?: Marker;
  /** Optional — when present, an additional "Relationship Explanation" subsection is parsed between Simple Example and Common Misconception. Used by slides built around a reciprocal or other quantity-to-quantity relationship (e.g. period/frequency) that still need a labeled explanatory subsection describing how the two quantities relate. Mutually exclusive with tableExplanationMarker/figureExplanationMarker/conversionFactorExplanationMarker/definitionExplanationMarker in current usage — all five occupy the same slot. */
  relationshipExplanationMarker?: Marker;
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
  /**
   * Additional italic tokens merged into the caller-supplied italicTokens
   * prop, scoped strictly to this one blockId's own rendering — never
   * written into src/content/equationRenderer.tsx's topic-wide
   * EQUATION_ITALIC_TOKENS_BY_TOPIC/EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC
   * whitelists, so it cannot italicize the same token in any other content
   * block or slide in the topic (mainIdea, organizedExplanation, or any of
   * this slide's siblings). Use this for a symbol that is unambiguous
   * within one specific slide's own equations (e.g. Slide 11's "N", the
   * number-of-cycles variable) but that the project owner has not asked to
   * be treated as a general-purpose physics symbol for the whole topic's
   * natural-language prose.
   */
  additionalItalicTokens?: readonly string[];
  /**
   * Extra italic tokens applied ONLY within one exact, verified equation
   * substring (a key from this map, matched the same way as
   * equationBlockPhrase — via string.includes, never a generic regex),
   * layered on top of additionalItalicTokens/italicTokens for just that
   * substring's own render call. Use this for a bare letter that is a
   * genuine physics variable inside one specific equation but is NOT safe
   * to italicize as a blockId-wide token (additionalItalicTokens) because
   * it collides with an English word or a unit symbol elsewhere in the
   * SAME slide's own text — e.g. Slide 12's "a" (acceleration), which
   * collides with the English indefinite article throughout the slide's
   * own prose ("a change in its state of motion"), and "g" (gravitational
   * acceleration in "W = m g"), which collides with the gram unit symbol
   * elsewhere in the same slide ("1000 g", "gram (g)"). Every other
   * occurrence of the same letter — including in a DIFFERENT equation
   * substring not listed as a key here — is completely unaffected.
   */
  equationPhraseItalicTokens?: Record<string, readonly string[]>;
  /**
   * Opts specific normally-plain subsections into equation-aware rendering
   * (equationBlockPhrase visual styling + equationPhraseItalicTokens),
   * the same treatment Steps and Simple Example already always receive.
   * Omitted (or a section name left out) for every existing slide's
   * config, so this is purely additive — Steps/Simple Example rendering,
   * and the exact <p>/<div> output of every other slide's plain
   * subsections, are byte-for-byte unchanged unless a slide's config
   * explicitly opts a section in. Use this only for a subsection that
   * actually contains one of the slide's own equationBlockPhrase entries
   * (e.g. Slide 12's Common Misconception, which states "W = m g", and
   * Scientific Note, which states "F_net = m a").
   */
  equationAwareSections?: readonly (
    | "original"
    | "mainIdea"
    | "tableExplanation"
    | "figureExplanation"
    | "conversionFactorExplanation"
    | "definitionExplanation"
    | "relationshipExplanation"
    | "misconception"
    | "scientificNote"
    | "keyConcept"
    | "connection"
  )[];
  /**
   * Exact, verified substrings within the Original English/Arabic
   * subsection to wrap in a semantic <strong> — see
   * renderParagraphsWithEmphasis's header comment. Preserves a source
   * slide's own word-level emphasis (e.g. Slide 13's "not" in "but is
   * not the same as mass") without inserting any markup into the
   * approved verbatim text itself. Omitted for every other existing
   * slide's config, so this is purely additive.
   */
  originalEmphasisPhrases?: readonly string[];
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
  "ch01-t01-block-opening-7": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    conversionFactorExplanationMarker: { en: "Conversion-Factor Explanation:", ar: "شرح عامل التحويل:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: ["23 m × (3.28084 ft / 1 m)", "5.00 m × (3.28084 ft / 1 m) = 16.4042 ft"],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-8": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    tableExplanationMarker: { en: "Table Explanation:", ar: "شرح الجدول:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: [
      "1.5 h × (60 min / 1 h) = 90 min",
      "90 min × (60 s / 1 min) = 5400 s",
      "1.5 h = 90 min = 5.4 × 10³ s",
    ],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-9": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    definitionExplanationMarker: { en: "Definition Explanation:", ar: "شرح التعريف:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: [
      "f = 1 / T",
      "T = 1 / f",
      "T = 0.25 s",
      "f = 1 / (0.25 s) = 4.0 s⁻¹",
      "f = 4.0 Hz",
    ],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-10": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    relationshipExplanationMarker: { en: "Relationship Explanation:", ar: "شرح العلاقة:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: [
      "T = 1 / f",
      "f = 1 / T",
      "1 Hz = 1 s⁻¹",
      "1 MHz = 10⁶ Hz",
      "1 GHz = 10⁹ Hz",
      "91.5 MHz = 9.15 × 10⁷ Hz",
      "2 GHz = 2 × 10⁹ Hz",
      "f = 5.00 Hz",
      "T = 1 / (5.00 Hz) = 0.200 s",
    ],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
  },
  "ch01-t01-block-opening-11": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    relationshipExplanationMarker: { en: "Relationship Explanation:", ar: "شرح العلاقة:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: [
      "f = N / Δt",
      "f = 10 cycles / 2 s",
      "f = 5 cycles/s",
      "1 Hz = 1 cycle/s",
      "f = 5 Hz",
      "T = 1 / f",
      "T = 1 / (5 Hz)",
      "T = 0.2 s",
      "f T = (5 s⁻¹)(0.2 s) = 1",
      "f = 12 cycles / 3.0 s = 4.0 Hz",
      "T = 1 / (4.0 Hz) = 0.25 s",
    ],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
    // "N" (number of cycles) is unambiguous throughout this slide's own
    // equations and step values, but is deliberately NOT added to
    // EQUATION_ITALIC_TOKENS_BY_TOPIC/EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC
    // in src/content/equationRenderer.tsx — that would italicize every
    // standalone "N" in ch01-t01's other content blocks and slides too.
    // This blockId-scoped entry italicizes "N" only within Slide 11's own
    // rendering (see additionalItalicTokens's header comment above).
    additionalItalicTokens: ["N"],
  },
  "ch01-t01-block-opening-12": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    tableExplanationMarker: { en: "Table Explanation:", ar: "شرح الجدول:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: [
      "a = F_net / m",
      "m_empty = 20 kg",
      "m_loaded = 80 kg",
      "1 kg = 1000 g",
      "W = m g",
      "F_net = m a",
      "m = F_net / a",
      "1 lbf = 1 slug × 1 ft/s²",
    ],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
    // "m" (mass), "F" (fused only as "F_net", never a bare standalone
    // word), and "W" (weight) are unambiguous throughout this slide's own
    // equations and step values — verified collision-free against every
    // other rendered field in this record, including no meters-unit "m"
    // (unlike ch01-t04's excluded "m") since Slide 12 never states a
    // distance in meters. None are added to
    // EQUATION_ITALIC_TOKENS_BY_TOPIC/EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC
    // in src/content/equationRenderer.tsx — that would italicize every
    // standalone "m"/"F"/"W" in ch01-t01's other content blocks and slides
    // too (in particular "m" would wrongly italicize the meters unit
    // abbreviation used throughout Slides 1-11). This blockId-scoped entry
    // italicizes them only within Slide 12's own rendering (see
    // additionalItalicTokens's header comment above).
    additionalItalicTokens: ["m", "F", "W"],
    // "a" (acceleration) and "g" (gravitational acceleration) are NOT
    // blockId-wide safe like m/F/W above: "a" is the English indefinite
    // article and appears repeatedly in this slide's own prose (e.g. Step
    // 1's "a change in its state of motion", the Simple Example's "a
    // fully loaded shopping cart"), and "g" collides with the gram unit
    // symbol elsewhere in this same slide ("1 kg = 1000 g", "gram (g)").
    // Each is instead italicized ONLY within the one exact equation
    // substring it is a genuine variable in — see
    // equationPhraseItalicTokens's header comment on StructuredSlideConfig.
    // Every other "a"/"g" in Slide 12, including in a different equation,
    // renders as plain upright text.
    equationPhraseItalicTokens: {
      "a = F_net / m": ["a"],
      "F_net = m a": ["a"],
      "m = F_net / a": ["a"],
      "W = m g": ["g"],
    },
    // Common Misconception states "W = m g" and Scientific Note states
    // "F_net = m a" / "m = F_net / a" / "1 lbf = 1 slug × 1 ft/s²" as
    // their own equation lines — opted into equation-aware rendering
    // (equation-block styling + equationPhraseItalicTokens) the same way
    // Steps and Simple Example always are. Every other existing slide's
    // config leaves equationAwareSections unset, so this option changes
    // nothing about any other slide's rendering.
    equationAwareSections: ["misconception", "scientificNote"],
  },
  "ch01-t01-block-opening-13": {
    mainIdeaMarker: { en: "Main Idea:", ar: "الفكرة الرئيسية:" },
    simpleExampleMarker: { en: "Simple Example:", ar: "مثال بسيط:" },
    figureExplanationMarker: { en: "Figure Explanation:", ar: "شرح الشكل:" },
    misconceptionMarker: { en: "Misconception:", ar: "مفهوم خاطئ:" },
    scientificNoteMarker: { en: "Scientific Note:", ar: "ملاحظة علمية:" },
    keyConceptMarker: { en: "Key Concept:", ar: "المفهوم الأساسي:" },
    connectionMarker: { en: "Connection to the Next Slide:", ar: "الصلة بالشريحة التالية:" },
    equationBlockPhrase: [
      "m = 20 kg",
      "g = 9.8 m/s²",
      "W = m g",
      "W = (20 kg)(9.8 m/s²) = 196 N",
      "F_net = 40 N",
      "a = F_net / m",
      "a = (40 N) / (20 kg) = 2.0 m/s²",
    ],
    stepPattern: {
      en: /^Step\s+\d+\s+—[^\n]*/,
      ar: /^الخطوة\s+\d+\s+—[^\n]*/,
    },
    // "F" (fused only as "F_net", never a bare standalone word) and "W"
    // (weight) are unambiguous throughout this slide's own equations and
    // step values — verified collision-free. "g" (gravitational
    // acceleration) is ALSO safe as a blockId-wide token here — unlike
    // Slide 12, Slide 13 never states a mass in grams, so there is no
    // gram-unit collision to guard against; "g" is intentionally included
    // here (not phrase-scoped) so it also italicizes correctly in plain
    // prose, e.g. Step 4's "Weight depends on the local gravitational
    // acceleration g." None of these three is added to
    // EQUATION_ITALIC_TOKENS_BY_TOPIC/EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC
    // in src/content/equationRenderer.tsx — that would italicize every
    // standalone "F"/"W"/"g" in ch01-t01's other content blocks and slides
    // too. This blockId-scoped entry italicizes them only within Slide
    // 13's own rendering (see additionalItalicTokens's header comment
    // above). Slide 13 does NOT inherit Slide 11's separate blockId-scoped
    // "N" entry — additionalItalicTokens is scoped per blockId, so Slide
    // 11's entry has no effect here.
    additionalItalicTokens: ["F", "W", "g"],
    // "m" (mass) and "a" (acceleration) are NOT blockId-wide safe like
    // F/W/g above: "m" collides with the metres-per-second-squared unit
    // abbreviation used in this very slide's own equations ("9.8 m/s²",
    // "2.0 m/s²") — a genuine ambiguity of exactly the kind
    // additionalItalicTokens's own house rule exists to catch (mirroring
    // ch01-t04's excluded "m"). "a" is the English indefinite article and
    // would collide with this slide's own prose ("a suitcase", "a
    // horizontal net force"). Each is instead italicized ONLY within the
    // one exact equation substring it is a genuine variable in — see
    // equationPhraseItalicTokens's header comment on StructuredSlideConfig.
    // Every other "m"/"a" in Slide 13, including "m/s²" in a DIFFERENT
    // equation, renders as plain upright text.
    equationPhraseItalicTokens: {
      "m = 20 kg": ["m"],
      "W = m g": ["m"],
      "a = F_net / m": ["a", "m"],
      "a = (40 N) / (20 kg) = 2.0 m/s²": ["a"],
    },
    // Common Misconception states "W = m g" as its own equation line —
    // opted into equation-aware rendering (equation-block styling +
    // equationPhraseItalicTokens) the same way Steps and Simple Example
    // always are. Scientific Note deliberately does NOT restate any
    // equation (avoiding visually duplicating "W = m g" a third time), so
    // it is left as a plain prose section, unlike Slide 12. Every other
    // existing slide's config leaves equationAwareSections unset, so this
    // option changes nothing about any other slide's rendering.
    equationAwareSections: ["misconception"],
    // Preserves the source's own emphasis on "not" in "but is not the
    // same as mass" (Original English subsection) via a semantic
    // <strong>, without inserting any markup into the approved verbatim
    // text itself — see originalEmphasisPhrases's header comment. "ليست"
    // is the Arabic negation word used in the Arabic Original subsection's
    // equivalent sentence ("لكنها ليست الكتلة نفسها") — included here too
    // so the same source emphasis is preserved in both languages; each
    // entry only ever matches its own language's paragraphs (English
    // paragraphs never contain Arabic script and vice versa), so having
    // both in one list is safe.
    originalEmphasisPhrases: ["not", "ليست"],
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
  conversionFactorExplanation: string[];
  definitionExplanation: string[];
  relationshipExplanation: string[];
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
  const conversionFactorExplanationIdx = config.conversionFactorExplanationMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.conversionFactorExplanationMarker![lang]))
    : -1;
  const definitionExplanationIdx = config.definitionExplanationMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.definitionExplanationMarker![lang]))
    : -1;
  const relationshipExplanationIdx = config.relationshipExplanationMarker
    ? paragraphs.findIndex((p) => p.startsWith(config.relationshipExplanationMarker![lang]))
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
  if (config.conversionFactorExplanationMarker) ordered.push(conversionFactorExplanationIdx);
  if (config.definitionExplanationMarker) ordered.push(definitionExplanationIdx);
  if (config.relationshipExplanationMarker) ordered.push(relationshipExplanationIdx);
  ordered.push(misconceptionIdx, scientificNoteIdx);
  if (config.keyConceptMarker) ordered.push(keyConceptIdx);
  ordered.push(connectionIdx);

  const inOrder = ordered.every((idx, i) => idx >= 0 && (i === 0 || idx > ordered[i - 1]));
  if (!inOrder) return null;

  const stepParagraphs = paragraphs.slice(firstStepIdx, simpleExampleIdx);
  if (!stepParagraphs.every((p) => stepPattern.test(p))) return null;

  // Table Explanation, Figure Explanation, Conversion-Factor Explanation,
  // Definition Explanation, and Relationship Explanation are mutually
  // exclusive in current usage (each slide has at most a source table, an
  // embedded figure, or neither and instead a plain explanatory
  // subsection, never more than one) — all five occupy the same slot
  // immediately after Simple Example, so whichever is configured
  // determines where Simple Example ends and itself ends at Common
  // Misconception.
  const simpleExampleEnd = config.tableExplanationMarker
    ? tableExplanationIdx
    : config.figureExplanationMarker
      ? figureExplanationIdx
      : config.conversionFactorExplanationMarker
        ? conversionFactorExplanationIdx
        : config.definitionExplanationMarker
          ? definitionExplanationIdx
          : config.relationshipExplanationMarker
            ? relationshipExplanationIdx
            : misconceptionIdx;
  const scientificNoteEnd = config.keyConceptMarker ? keyConceptIdx : connectionIdx;

  return {
    original: paragraphs.slice(0, mainIdeaIdx),
    mainIdea: paragraphs.slice(mainIdeaIdx, firstStepIdx),
    steps: stepParagraphs,
    simpleExample: paragraphs.slice(simpleExampleIdx, simpleExampleEnd),
    tableExplanation: config.tableExplanationMarker ? paragraphs.slice(tableExplanationIdx, misconceptionIdx) : [],
    figureExplanation: config.figureExplanationMarker ? paragraphs.slice(figureExplanationIdx, misconceptionIdx) : [],
    conversionFactorExplanation: config.conversionFactorExplanationMarker
      ? paragraphs.slice(conversionFactorExplanationIdx, misconceptionIdx)
      : [],
    definitionExplanation: config.definitionExplanationMarker
      ? paragraphs.slice(definitionExplanationIdx, misconceptionIdx)
      : [],
    relationshipExplanation: config.relationshipExplanationMarker
      ? paragraphs.slice(relationshipExplanationIdx, misconceptionIdx)
      : [],
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

/** Matches a paragraph/clause against a slide's equationBlockPhrase entries (string.includes, never a generic regex), returning the exact phrase that matched — used both for equation-block visual styling and for equationPhraseItalicTokens lookup. */
function findMatchingEquationBlockPhrase(
  text: string,
  equationBlockPhrase: string | string[] | undefined,
): string | undefined {
  if (!equationBlockPhrase) return undefined;
  const phrases = Array.isArray(equationBlockPhrase) ? equationBlockPhrase : [equationBlockPhrase];
  return phrases.find((phrase) => text.includes(phrase));
}

/**
 * Renders one paragraph/clause of text, checking whether it matches one of
 * the slide's own equationBlockPhrase entries and, if so, layering that
 * exact phrase's equationPhraseItalicTokens (if any) on top of the base
 * italicTokens for this one render only — see equationPhraseItalicTokens's
 * header comment on StructuredSlideConfig. Every non-matching paragraph
 * uses the base italicTokens completely unchanged, so a slide with no
 * equationPhraseItalicTokens entries (every slide except one that opts in)
 * renders byte-for-byte the same as calling renderEquationText directly.
 */
function renderTextWithPhraseItalics(
  text: string,
  italicTokens: readonly string[],
  equationBlockPhrase: string | string[] | undefined,
  phraseItalicTokens: Record<string, readonly string[]> | undefined,
): { node: ReturnType<typeof renderEquationText>; isEquationBlock: boolean } {
  const matchedPhrase = findMatchingEquationBlockPhrase(text, equationBlockPhrase);
  if (matchedPhrase === undefined) {
    return { node: renderEquationText(text, italicTokens), isEquationBlock: false };
  }
  const extra = phraseItalicTokens?.[matchedPhrase] ?? [];
  const tokens = extra.length > 0 ? [...italicTokens, ...extra] : italicTokens;
  return { node: renderEquationText(text, tokens), isEquationBlock: true };
}

function renderEquationAwareParagraphs(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  equationBlockPhrase: string | string[] | undefined,
  phraseItalicTokens?: Record<string, readonly string[]>,
) {
  return paragraphs.map((paragraph, i) => {
    const { node, isEquationBlock } = renderTextWithPhraseItalics(
      paragraph,
      italicTokens,
      equationBlockPhrase,
      phraseItalicTokens,
    );
    return isEquationBlock ? (
      <div className="structured-slide__equation-block" dir={direction} key={i}>
        {node}
      </div>
    ) : (
      <p className="content-section__text" dir={direction} key={i}>
        {node}
      </p>
    );
  });
}

/** Chooses renderEquationAwareParagraphs vs renderPlainParagraphs per config.equationAwareSections — see that field's header comment. */
function renderSection(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  equationBlockPhrase: string | string[] | undefined,
  phraseItalicTokens: Record<string, readonly string[]> | undefined,
  equationAware: boolean,
) {
  return equationAware
    ? renderEquationAwareParagraphs(paragraphs, italicTokens, direction, equationBlockPhrase, phraseItalicTokens)
    : renderPlainParagraphs(paragraphs, italicTokens, direction);
}

/**
 * Same as renderPlainParagraphs, plus wrapping one exact, verified
 * substring per matching paragraph in a semantic <strong> — used to
 * preserve a source slide's own emphasis on a specific word (e.g. Slide
 * 13's "not" in "but is not the same as mass") without inserting any
 * markup into the approved text itself. Matched the same way as
 * equationBlockPhrase (string.includes, never a generic regex): if
 * emphasisPhrases is empty/undefined, or no entry matches a given
 * paragraph, that paragraph renders identically to renderPlainParagraphs.
 * Distinct from equationPhraseItalicTokens/<em> — <em> is reserved
 * throughout this file for italicized physics variables, so ordinary
 * prose emphasis uses <strong> instead, avoiding any visual or semantic
 * collision between the two.
 */
function renderParagraphsWithEmphasis(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  emphasisPhrases: readonly string[] | undefined,
) {
  return paragraphs.map((paragraph, i) => {
    const phrase = emphasisPhrases?.find((p) => paragraph.includes(p));
    if (!phrase) {
      return (
        <p className="content-section__text" dir={direction} key={i}>
          {renderEquationText(paragraph, italicTokens)}
        </p>
      );
    }
    const index = paragraph.indexOf(phrase);
    const before = paragraph.slice(0, index);
    const match = paragraph.slice(index, index + phrase.length);
    const after = paragraph.slice(index + phrase.length);
    return (
      <p className="content-section__text" dir={direction} key={i}>
        {renderEquationText(before, italicTokens)}
        <strong>{renderEquationText(match, italicTokens)}</strong>
        {renderEquationText(after, italicTokens)}
      </p>
    );
  });
}

function renderSteps(
  paragraphs: string[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
  stepPattern: RegExp,
  equationBlockPhrase: string | string[] | undefined,
  phraseItalicTokens?: Record<string, readonly string[]>,
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
                {clauses.map((clause, j) => {
                  const { node, isEquationBlock } = renderTextWithPhraseItalics(
                    clause,
                    italicTokens,
                    equationBlockPhrase,
                    phraseItalicTokens,
                  );
                  return isEquationBlock ? (
                    <li key={j}>
                      <div className="structured-slide__equation-block" dir={direction}>
                        {node}
                      </div>
                    </li>
                  ) : (
                    <li key={j}>{node}</li>
                  );
                })}
              </ul>
            ) : (
              (() => {
                const { node, isEquationBlock } = renderTextWithPhraseItalics(
                  rest,
                  italicTokens,
                  equationBlockPhrase,
                  phraseItalicTokens,
                );
                return isEquationBlock ? (
                  <div className="structured-slide__equation-block" dir={direction}>
                    {node}
                  </div>
                ) : (
                  <span>{node}</span>
                );
              })()
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

/**
 * Renders one or more reconstructed term/definition pairs (see
 * NormalizedSlide.definitions) as accessible semantic definition cards —
 * one <dl> per entry, each holding a single <dt>/<dd> pair, rather than a
 * single flat definition list, so each source definition box has its own
 * clearly delimited, screen-reader-navigable group. Never renders the
 * original screenshot; generic to any slide with a definitions field, not
 * specific to any one slide's terms.
 */
function renderDefinitionCards(
  definitions: DefinitionEntry[],
  italicTokens: readonly string[],
  direction: "ltr" | "rtl",
) {
  return (
    <div className="structured-slide__definition-cards" dir={direction}>
      {definitions.map((entry, i) => (
        <dl className="structured-slide__definition-card" key={i}>
          <dt className="structured-slide__definition-term">{renderEquationText(entry.term, italicTokens)}</dt>
          <dd className="structured-slide__definition-body">{renderEquationText(entry.definition, italicTokens)}</dd>
        </dl>
      ))}
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
  /** Present only for slides carrying reconstructed term/definition pairs (see NormalizedSlide.definitions) — generic to any slide, not tied to a specific slide number. */
  definitions?: { en: DefinitionEntry[] | null; ar: DefinitionEntry[] | null };
  italicTokens?: readonly string[];
  /**
   * When true, renders the Slide Reader's Review Mode: only Main Idea, Key
   * Concept (when present), the figure/table (when present), and any
   * equation-block paragraphs within Simple Example — reusing exactly the
   * same `sections` object Study Mode renders from, never a re-parse of
   * rendered HTML. Every other subsection (Original English/Arabic, full
   * Steps, Table/Figure/Conversion-Factor/Definition/Relationship
   * Explanation, Common Misconception, Scientific Note, Connection) is
   * simply not rendered in this mode — the underlying approved text is
   * untouched; this is presentation-only, matching Study Mode's own
   * "reformats... presentation only" contract. Defaults to false, which
   * preserves this component's exact current (Study Mode) output for
   * every existing caller.
   */
  compact?: boolean;
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
export function StructuredSlideContent({ blockId, text, table, figure, definitions, italicTokens = [], compact = false }: StructuredSlideContentProps) {
  const { language, direction } = useLanguage();
  const value = text[language];
  const tableForLanguage = table ? table[language] : null;
  const definitionsForLanguage = definitions ? definitions[language] : null;

  if (!value) {
    return (
      <p className="content-section__missing" role="status">
        {MISSING_TEXT[language]}
      </p>
    );
  }

  const config = STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[blockId];
  // Merged in locally, never written back into the caller-supplied
  // italicTokens or into equationRenderer.tsx's topic-wide whitelists — see
  // additionalItalicTokens's header comment on StructuredSlideConfig.
  const effectiveItalicTokens = config?.additionalItalicTokens
    ? [...italicTokens, ...config.additionalItalicTokens]
    : italicTokens;
  const sections = config ? parseSections(value, config, language) : null;

  if (!sections) {
    return <>{renderPlainParagraphs(value.split(/\n{2,}/), effectiveItalicTokens, direction)}</>;
  }

  const stepPattern = config?.stepPattern ? config.stepPattern[language] : DEFAULT_STEP_PATTERN;
  const equationAwareSections = config?.equationAwareSections ?? [];

  if (compact) {
    const equationParagraphs = sections.simpleExample.filter(
      (p) => findMatchingEquationBlockPhrase(p, config?.equationBlockPhrase) !== undefined,
    );
    return (
      <div className="structured-slide structured-slide--compact">
        <section className="structured-slide__section" id={`${blockId}--main-idea`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.mainIdea[language]}</h4>
          {renderSection(
            sections.mainIdea,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            equationAwareSections.includes("mainIdea"),
          )}
        </section>

        {tableForLanguage ? (
          <section className="structured-slide__section" id={`${blockId}--table`}>
            {renderSourceTable(tableForLanguage, direction)}
          </section>
        ) : null}

        {figure ? (
          <section className="structured-slide__section" id={`${blockId}--figure`}>
            <SlideFigure assetUrl={figure.assetUrl} alt={figure.alt} />
          </section>
        ) : null}

        {equationParagraphs.length > 0 ? (
          <section className="structured-slide__section" id={`${blockId}--simple-example`}>
            <h4 className="structured-slide__heading">{SUBSECTION_LABEL.simpleExample[language]}</h4>
            {renderEquationAwareParagraphs(
              equationParagraphs,
              effectiveItalicTokens,
              direction,
              config?.equationBlockPhrase,
              config?.equationPhraseItalicTokens,
            )}
          </section>
        ) : null}

        {sections.keyConcept.length > 0 ? (
          <section className="structured-slide__section" id={`${blockId}--key-concept`}>
            <h4 className="structured-slide__heading">{SUBSECTION_LABEL.keyConcept[language]}</h4>
            {renderSection(
              sections.keyConcept,
              effectiveItalicTokens,
              direction,
              config?.equationBlockPhrase,
              config?.equationPhraseItalicTokens,
              equationAwareSections.includes("keyConcept"),
            )}
          </section>
        ) : null}
      </div>
    );
  }

  const isEquationAware = (
    name:
      | "original"
      | "mainIdea"
      | "tableExplanation"
      | "figureExplanation"
      | "conversionFactorExplanation"
      | "definitionExplanation"
      | "relationshipExplanation"
      | "misconception"
      | "scientificNote"
      | "keyConcept"
      | "connection",
  ) => equationAwareSections.includes(name);

  return (
    <div className="structured-slide">
      {sections.original.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--original`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.original[language]}</h4>
          {config?.originalEmphasisPhrases
            ? renderParagraphsWithEmphasis(
                sections.original,
                effectiveItalicTokens,
                direction,
                config.originalEmphasisPhrases,
              )
            : renderSection(
                sections.original,
                effectiveItalicTokens,
                direction,
                config?.equationBlockPhrase,
                config?.equationPhraseItalicTokens,
                isEquationAware("original"),
              )}
          {tableForLanguage ? renderSourceTable(tableForLanguage, direction) : null}
          {definitionsForLanguage ? renderDefinitionCards(definitionsForLanguage, effectiveItalicTokens, direction) : null}
        </section>
      ) : null}

      <section className="structured-slide__section" id={`${blockId}--main-idea`}>
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.mainIdea[language]}</h4>
        {renderSection(
          sections.mainIdea,
          effectiveItalicTokens,
          direction,
          config?.equationBlockPhrase,
          config?.equationPhraseItalicTokens,
          isEquationAware("mainIdea"),
        )}
      </section>

      <section className="structured-slide__section" id={`${blockId}--steps`}>
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.steps[language]}</h4>
        {renderSteps(
          sections.steps,
          effectiveItalicTokens,
          direction,
          stepPattern,
          config?.equationBlockPhrase,
          config?.equationPhraseItalicTokens,
        )}
      </section>

      <section className="structured-slide__section" id={`${blockId}--simple-example`}>
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.simpleExample[language]}</h4>
        {renderEquationAwareParagraphs(
          sections.simpleExample,
          effectiveItalicTokens,
          direction,
          config?.equationBlockPhrase,
          config?.equationPhraseItalicTokens,
        )}
      </section>

      {sections.tableExplanation.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--table-explanation`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.tableExplanation[language]}</h4>
          {renderSection(
            sections.tableExplanation,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            isEquationAware("tableExplanation"),
          )}
        </section>
      ) : null}

      {sections.figureExplanation.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--figure-explanation`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.figureExplanation[language]}</h4>
          {figure ? <SlideFigure assetUrl={figure.assetUrl} alt={figure.alt} /> : null}
          {renderSection(
            sections.figureExplanation,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            isEquationAware("figureExplanation"),
          )}
        </section>
      ) : null}

      {sections.conversionFactorExplanation.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--conversion-factor-explanation`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.conversionFactorExplanation[language]}</h4>
          {renderSection(
            sections.conversionFactorExplanation,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            isEquationAware("conversionFactorExplanation"),
          )}
        </section>
      ) : null}

      {sections.definitionExplanation.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--definition-explanation`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.definitionExplanation[language]}</h4>
          {renderSection(
            sections.definitionExplanation,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            isEquationAware("definitionExplanation"),
          )}
        </section>
      ) : null}

      {sections.relationshipExplanation.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--relationship-explanation`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.relationshipExplanation[language]}</h4>
          {renderSection(
            sections.relationshipExplanation,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            isEquationAware("relationshipExplanation"),
          )}
        </section>
      ) : null}

      <section
        className="structured-slide__section structured-slide__callout structured-slide__callout--misconception"
        id={`${blockId}--misconception`}
      >
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.misconception[language]}</h4>
        {renderSection(
          sections.misconception,
          effectiveItalicTokens,
          direction,
          config?.equationBlockPhrase,
          config?.equationPhraseItalicTokens,
          isEquationAware("misconception"),
        )}
      </section>

      <section
        className="structured-slide__section structured-slide__callout structured-slide__callout--scientific-note"
        id={`${blockId}--scientific-note`}
      >
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.scientificNote[language]}</h4>
        {renderSection(
          sections.scientificNote,
          effectiveItalicTokens,
          direction,
          config?.equationBlockPhrase,
          config?.equationPhraseItalicTokens,
          isEquationAware("scientificNote"),
        )}
      </section>

      {sections.keyConcept.length > 0 ? (
        <section className="structured-slide__section" id={`${blockId}--key-concept`}>
          <h4 className="structured-slide__heading">{SUBSECTION_LABEL.keyConcept[language]}</h4>
          {renderSection(
            sections.keyConcept,
            effectiveItalicTokens,
            direction,
            config?.equationBlockPhrase,
            config?.equationPhraseItalicTokens,
            isEquationAware("keyConcept"),
          )}
        </section>
      ) : null}

      <section className="structured-slide__section" id={`${blockId}--connection`}>
        <h4 className="structured-slide__heading">{SUBSECTION_LABEL.connection[language]}</h4>
        {renderSection(
          sections.connection,
          effectiveItalicTokens,
          direction,
          config?.equationBlockPhrase,
          config?.equationPhraseItalicTokens,
          isEquationAware("connection"),
        )}
      </section>
    </div>
  );
}
