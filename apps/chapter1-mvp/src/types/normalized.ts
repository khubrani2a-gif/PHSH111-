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
   * ch01-t01-only introductory block (blockType "openingConcept") that
   * precedes mainIdea when present. See src/types/pilotSchema.ts's
   * ContentBlockType header note on its provenance/review status.
   */
  openingConcept?: NormalizedSection;
  /**
   * ch01-t01-only second opening/introductory block (blockType
   * "openingConceptSlide2"), sibling to openingConcept (Slide 1) — see
   * src/types/pilotSchema.ts's ContentBlockType header note.
   */
  openingConceptSlide2?: NormalizedSection;
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
