// Normalized, read-only UI model produced by the content adapter
// (src/content/adapter.ts) from the raw pilot schema
// (src/types/pilotSchema.ts). Components render this model — they never
// see raw JSON and never contain instructional text of their own.
//
// Every type here is a strict subset/transform of explicitly-present source
// fields. Nothing here should ever be populated with synthesized,
// invented, or default instructional content — an absent source field
// means the corresponding optional property is simply omitted.

import type {
  BlockingState,
  ContentBlockType,
  PilotTopicId,
  VisibilityState,
} from "./pilotSchema";

export type Language = "en" | "ar";

/**
 * A bilingual string pair. Either side may be `null` if the source
 * localization is genuinely missing for that language — components must
 * render a diagnostic note in that case, never silently fall back to the
 * other language's text (that would misrepresent bilingual completeness).
 * See MVP_PRODUCT_SPEC.md §10 / §16 and
 * docs/app/MVP_IMPLEMENTATION_DECISIONS.json decision G.
 */
export interface NormalizedText {
  en: string | null;
  ar: string | null;
}

export interface AdapterDiagnostic {
  severity: "error" | "warning";
  code: string;
  message: string;
  topicId?: string;
  recordId?: string;
}

/** A single learner-flow content section (mainIdea, organizedExplanation, equationSet, example). */
export interface NormalizedSection {
  recordId: string;
  blockType: ContentBlockType;
  visibility: VisibilityState;
  text: NormalizedText;
  blocking: BlockingState;
}

/** A small source table, one language's headers/cell text. `null` cells are genuinely empty in the source (a merged/blank cell), never a placeholder for missing data. */
export interface NormalizedSourceTable {
  headers: string[];
  rows: (string | null)[][];
}

/**
 * One ordered, presentation-oriented slide (blockType "slide") — see
 * src/types/pilotSchema.ts's ContentBlockType header note. topic.slides is
 * a generic, arbitrary-length collection: rendering code maps over it
 * rather than referencing individual slides by field name, so a new slide
 * requires no NormalizedTopic change and no adapter/TopicPage wiring.
 */
export interface NormalizedSlide {
  recordId: string;
  slideNumber: number;
  title: NormalizedText;
  visibility: VisibilityState;
  text: NormalizedText;
  /**
   * Present only when the underlying record carries a source table
   * (pilotSchema.ts's tableEn/tableAr) — generic to any slide, not tied
   * to a specific slide number. Absent (undefined) for slides with no
   * table, same convention as every other optional field here.
   */
  table?: { en: NormalizedSourceTable | null; ar: NormalizedSourceTable | null };
  /**
   * Present only when the underlying record carries an embedded raster
   * figure — generic to any slide, not tied to a specific slide number.
   * assetUrl is the build-time-resolved image URL (see
   * src/content/rawImports.ts's RAW_FIGURE_URL_BY_BLOCK_ID). Absent
   * (undefined) for slides with no figure.
   */
  figure?: { assetUrl: string; alt: NormalizedText };
  blocking: BlockingState;
}

/** An instructor-only record (currently: misconception), never shown in the learner flow. */
export interface NormalizedInstructorNote {
  recordId: string;
  blockType: ContentBlockType;
  text: NormalizedText;
  blocking: BlockingState;
}

export interface NormalizedVisual {
  recordId: string;
  visualId: string;
  assetPath: string;
  /** Raw SVG markup, imported at build time via `?raw` — see src/content/rawAssets.ts. */
  svgMarkup: string | null;
  assetStatus: string;
  availabilityStatus: string;
  studentFacingAllowed: boolean;
  reviewer: string | null;
  reviewedAt: string | null;
  readyForHumanReview: boolean;
}

export interface NormalizedSolutionStep {
  stepNumber: number;
  purpose: string;
  explanation: NormalizedText;
  /** Present only when calculationRef resolved to a real calculation entry. */
  expression?: {
    expression: string;
    substitution: string;
    result: number | null;
    unit: string | null;
  };
}

export interface NormalizedProblem {
  recordId: string;
  statement: NormalizedText;
  givenValues: { symbol: string; value: number; unit: string }[];
  conceptualInterpretation?: NormalizedText;
  steps: NormalizedSolutionStep[];
  finalAnswer?: {
    value: number | null;
    unit: string | null;
    interpretation: NormalizedText;
  };
  commonMistake: string[];
  blocking: BlockingState;
}

/** Governance facts surfaced verbatim for the internal status panel (§9). Never a UI decision point beyond display. */
export interface NormalizedGovernance {
  topicId: PilotTopicId;
  schemaVersion: string;
  recordCount: number;
  blockedRecordCount: number;
  studentFacingAllowed: boolean;
  studentPublicationAuthorized: boolean;
  visualReviewStatus: "readyForHumanReview" | "reviewed" | "unavailable";
  visualReviewer: string | null;
}

export interface NormalizedTopic {
  topicId: PilotTopicId;
  title: NormalizedText;
  /**
   * ch01-t01-only ordered collection of introductory slides (blockType
   * "slide"), rendered before mainIdea. Always sorted by slideNumber.
   * Empty (never undefined) for topics with no slide records. See
   * src/types/pilotSchema.ts's ContentBlockType header note — this is a
   * generic collection, not one field per slide, so adding another slide
   * to a topic never requires a NormalizedTopic change.
   */
  slides: NormalizedSlide[];
  mainIdea?: NormalizedSection;
  explanation?: NormalizedSection;
  equations?: NormalizedSection;
  visual?: NormalizedVisual;
  workedExample?: NormalizedSection;
  problem?: NormalizedProblem;
  /**
   * The topic's reviewQuestion content block, present ONLY when its source
   * visibility permits learner presentation ("shared" or "student" — see
   * src/content/governance.ts's isLearnerVisible). An instructor-only
   * reviewQuestion (visibility: "instructor") is never placed here; it is
   * instead picked up generically by the instructorNotes filter below,
   * same as any other instructor-only contentBlock.
   */
  reviewQuestion?: NormalizedSection;
  /** visibility:"instructor" records for this topic — rendered only inside the collapsed reviewer panel. */
  instructorNotes: NormalizedInstructorNote[];
  /**
   * instructorScript.learningObjectives, surfaced ONLY inside the reviewer
   * panel per docs/app/MVP_IMPLEMENTATION_DECISIONS.json decision C: no
   * learner-visible learning-objective field exists in the source schema,
   * so this data is never shown in the main learner flow. Omitted
   * entirely (not an empty array) when the source record has none.
   */
  instructorLearningObjectives?: { recordId: string; items: NormalizedText[] };
  governance: NormalizedGovernance;
}

export interface AdapterResult {
  topics: NormalizedTopic[];
  diagnostics: AdapterDiagnostic[];
}
