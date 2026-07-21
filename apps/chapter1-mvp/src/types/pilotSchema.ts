// Raw-schema TypeScript types for the four canonical pilot content JSON
// files under docs/content-design/chapter-01/pilot/.
//
// These types describe the schema as it actually exists in the repository
// (schemaVersion "2.3.0", verified identical across ch01-t02/t03/t08/t10 as
// of this phase's inspection). They are intentionally NOT the shape the UI
// consumes directly — see src/types/normalized.ts for that. Keeping the raw
// shape separate lets validation/parsing stay honest about what the source
// actually contains before any adapter decisions are applied.
//
// Known, verified schema facts baked into these types (see Phase 2 report
// for the full inspection):
// - localizedContent.ar and arabic.canonicalArabicTranslation are always
//   kept in sync (0 mismatches found across all 36+ records inspected).
// - File-level topicTitle/topicTitleAr are PLAIN STRINGS, not the
//   {text,status,language,direction} shape used everywhere else in the
//   schema — a real, deliberate shape inconsistency, not a typo, so it is
//   modeled as its own distinct pair of fields rather than forced into
//   LocalizedContent.
// - contentBlock's 12-key shape (blockId, blockType, topicId, visibility,
//   localizedContent, arabic, provenanceLinks, scientificCorrectionIds,
//   conflictRecordIds, duplicateHandling, blocking, contentLeakTestStatus)
//   is identical across all seven blockTypes and all four topics.
// - instructorScript has NO visibility field at all, unlike every
//   contentBlock — a real asymmetry the adapter must account for
//   explicitly rather than assume a default.

export const PILOT_SCHEMA_VERSION = "2.3.0" as const;

// Extended from the original four-literal pilot union (ch01-t02/t03/t08/t10)
// under PILOT_AUTHORIZATION.json v1.5.0's batch1ApplicationIntegrationAuthorization
// to also include the two Batch 1 topics (ch01-t01, ch01-t04) — see
// docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md §11.
export type PilotTopicId =
  | "ch01-t01"
  | "ch01-t02"
  | "ch01-t03"
  | "ch01-t04"
  | "ch01-t08"
  | "ch01-t10";

// The original four-topic, application-BUILD-authorized set (mirrors
// PILOT_READINESS.json's chapter-wide `pilotTopicOrder`). This is a
// distinct, narrower governance concept than Batch 1's own separate
// authorization — it is NOT extended to six topics, so any logic that is
// specifically scoped to the four originally build-authorized pilot
// topics (rather than to "every topic the running application currently
// renders") keeps working against exactly this set. Nothing in the running
// application iterates this constant anymore for topic loading — see
// APP_TOPIC_ORDER below for that.
export const PILOT_TOPIC_ORDER: readonly PilotTopicId[] = [
  "ch01-t02",
  "ch01-t03",
  "ch01-t08",
  "ch01-t10",
] as const;

// Batch 1's own two topics, in the order used throughout their own
// governance records (ENGLISH_BATCH1_BASELINE_APPROVAL.json,
// ARABIC_BATCH1_BASELINE_APPROVAL.json, VISUAL_BATCH1_APPROVAL.json,
// IDENTIFIER_REGISTRY.json's batch1IdentifierRegistration, all list
// ch01-t01 before ch01-t04).
export const BATCH1_TOPIC_ORDER: readonly PilotTopicId[] = [
  "ch01-t01",
  "ch01-t04",
] as const;

// The correct, chapter-wide numerical sequence the running application
// actually displays and loads, derived from each topic's own numeric
// suffix (01 < 02 < 03 < 04 < 08 < 10) — see
// docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md
// §10. This is what src/content/adapter.ts's loadAllTopics() and
// src/content/validate.ts's validateTopicSet() now iterate/check against,
// not PILOT_TOPIC_ORDER. No placeholder topic (ch01-t05–t07, t09,
// t11–t14) is included — those remain entirely out of scope.
export const APP_TOPIC_ORDER: readonly PilotTopicId[] = [
  "ch01-t01",
  "ch01-t02",
  "ch01-t03",
  "ch01-t04",
  "ch01-t08",
  "ch01-t10",
] as const;

// ---- Shared leaf shapes ------------------------------------------------

export type LanguageStatus = "draft" | "reviewed" | "approved" | string;

/** The {text,status,language,direction} shape repeated throughout the schema. */
export interface LocalizedText {
  text: string | null;
  status: LanguageStatus | "missing";
  language: "en" | "ar";
  direction: "ltr" | "rtl";
}

export interface LocalizedContent {
  en: LocalizedText;
  ar: LocalizedText;
}

export interface ArabicGovernance {
  originalArabicText: LocalizedText;
  canonicalArabicTranslation: LocalizedText;
  translationStatus: string;
  translationReviewer: string | null;
  terminologyApprovalStatus: string;
  glossaryTermIds: string[];
}

export type VisibilityState = "shared" | "student" | "instructor";

export type BlockingReason =
  | "translationPending"
  | "terminologyPending"
  | "answerValidation"
  | "unverifiedVisual"
  | "missingVisual"
  | "other"
  | string;

export interface BlockingState {
  blockingStatus: "blocked" | "notBlocked" | string;
  blockingReason: BlockingReason[];
  blockingRecordIds: string[];
  studentFacingAllowed: boolean;
  instructorFacingAllowed: boolean;
  resolutionRequired: boolean;
  resolutionOwner: string;
  resolutionStatus: string;
}

export interface DuplicateHandling {
  duplicateGroupIds: string[];
  revisionGroupId: string | null;
  canonicalPreferenceStatus: string;
  preferredSourceRecordId: string | null;
  preferenceReason: string;
  supersededBy: string | null;
  retainedForHistoricalTrace: boolean;
}

export interface ProvenanceLink {
  sourceId: string;
  locatorType: string;
  locatorId: string;
  linkageType: string;
  confidence: string;
  contribution: string;
  rightsStatus: string;
  allowedUse: string;
  evidence?: string;
}

/**
 * A small source table quoted/reconstructed from an original slide —
 * generic to any contentBlock (not tied to any specific blockType or
 * slide number). `rows[i][j]` is `null` for a genuinely empty source
 * cell (e.g. a merged/blank cell in the original table), never an
 * empty string standing in for "no value".
 */
export interface SourceTable {
  headers: string[];
  rows: (string | null)[][];
}

export interface VisualGovernanceEntry {
  visualId: string;
  availabilityStatus: string;
  linkageConfidence: string;
  linkageType: string;
  rightsStatus: string;
  visualResolutionId: string | null;
  assetPath?: string;
  assetFormat?: string;
  assetStatus?: string;
  reviewRequired?: boolean;
  // t02's visualGovernance entry additionally carries a resolved
  // contentScopeResolution object; the other three topics do not. Kept
  // optional and untyped-deep here deliberately — the adapter never reads
  // into it, it only needs to know the entry exists.
  contentScopeResolution?: unknown;
}

// ---- contentBlock record -------------------------------------------------

export type ContentBlockType =
  | "mainIdea"
  | "organizedExplanation"
  | "equationSet"
  | "example"
  | "visualReference"
  | "misconception"
  | "reviewQuestion"
  // Generic, reusable slide blockType (see docs/content-design/chapter-01
  // /batch1-drafts/batch1-arabic-drafts's ch01-t01-block-opening and
  // ch01-t01-block-opening-2 records, ch01-t01 only): an ordered,
  // presentation-oriented slide that precedes mainIdea, built around a
  // project-owner-supplied source slide. Any number of "slide" records may
  // exist per topic — they are collected, ordered by slideNumber, and
  // rendered generically (see src/content/adapter.ts's normalizeSlides and
  // src/pages/TopicPage.tsx); adding another slide requires no new
  // ContentBlockType, no new NormalizedTopic field, and no per-slide
  // wiring. New, unreviewed AI-authored content — see each record's own
  // blocking/arabic governance fields for its actual review status, which
  // is intentionally NOT "approved"/"reviewed" like the rest of this
  // topic's batch-authored content.
  | "slide";

export interface ContentBlockRecord {
  blockId: string;
  blockType: ContentBlockType;
  topicId: PilotTopicId;
  visibility: VisibilityState;
  localizedContent: LocalizedContent;
  arabic: ArabicGovernance;
  provenanceLinks: ProvenanceLink[];
  scientificCorrectionIds: string[];
  conflictRecordIds: string[];
  visualGovernance?: VisualGovernanceEntry[];
  duplicateHandling: DuplicateHandling;
  blocking: BlockingState;
  /**
   * Present only when blockType is "slide": this record's 1-based display
   * order among its topic's slide records, and its bilingual display
   * title (rendered as "Slide N — {slideTitleEn}" / "الشريحة N — {slideTitleAr}"
   * by src/features/topics/Slides.tsx — see NormalizedSlide.title). Mirrors
   * the existing topicTitle/topicTitleAr convention: the English-only
   * baseline file supplies slideNumber and slideTitleEn only; the Arabic
   * candidate file supplies the identical slideNumber/slideTitleEn (byte-
   * checked by src/content/batch1Merge.ts) plus the real slideTitleAr.
   */
  slideNumber?: number;
  slideTitleEn?: string;
  slideTitleAr?: string;
  /**
   * Present only on records that reproduce an explicit table quoted from
   * an original source slide — generic to any contentBlock, independent
   * of blockType (a future non-"slide" record could carry one too).
   * Mirrors the slideTitleEn/slideTitleAr convention: the English-only
   * baseline file supplies tableEn (the source table's own headers/cell
   * text, verbatim); the Arabic candidate file supplies its own copy of
   * tableEn (byte-checked identical by src/content/batch1Merge.ts,
   * confirming the two files agree on the source table's English content
   * and shape) plus tableAr, the translated labels/units in the same
   * row/column shape.
   */
  tableEn?: SourceTable;
  tableAr?: SourceTable;
  /**
   * Present only on records whose source table carries an explicit,
   * authored caption — generic to any contentBlock, independent of
   * blockType. Mirrors the slideTitleEn/slideTitleAr convention exactly
   * (not the tableEn/tableAr structural-data convention): the
   * English-only baseline file supplies tableCaptionEn; the Arabic
   * candidate file supplies the identical tableCaptionEn (byte-checked by
   * src/content/batch1Merge.ts) plus the real tableCaptionAr translation.
   * Omitted entirely (both undefined) for tables with no authored
   * caption — src/features/topics/StructuredSlideContent.tsx's
   * <table> only renders a <caption> when one is present.
   */
  tableCaptionEn?: string;
  tableCaptionAr?: string;
  /**
   * Present only on records with an embedded raster figure (a photo, not
   * an SVG diagram) — generic to any contentBlock, independent of
   * blockType. The actual image file is resolved at build time via a
   * static Vite import in src/content/rawImports.ts's
   * RAW_FIGURE_URL_BY_BLOCK_ID, keyed by this record's own blockId;
   * figureAssetPath here is a human-readable governance pointer to that
   * same file (mirrors visualGovernance[].assetPath's role for the
   * topic-singular SVG visual), not itself read at runtime. Mirrors the
   * slideTitleEn/slideTitleAr convention: the English-only baseline
   * supplies figureAssetPath and figureAltEn; the Arabic file supplies an
   * identical figureAssetPath/figureAltEn (byte-checked) plus the real
   * figureAltAr.
   */
  figureAssetPath?: string;
  figureAltEn?: string;
  figureAltAr?: string;
  contentLeakTestStatus: string;
}

// ---- instructorScript record --------------------------------------------
//
// Deliberately NOT given a `visibility` field — the source schema does not
// have one. The adapter's own allow-list (see src/content/adapter.ts)
// decides which sub-fields are safe to surface anywhere in the UI, since
// this record mixes learner-adjacent fields (learningObjectives, mainIdea,
// intuition) with clearly instructor-only fields (instructorOnlyCautions,
// wordForWordTeachingScript, slidePageCues) with no schema-level marker
// distinguishing them.

export interface InstructorScriptRecord {
  instructorScriptId: string;
  topicIds: PilotTopicId[];
  openingHook: LocalizedText;
  meaningfulQuestion: LocalizedText;
  mainIdea: LocalizedText;
  learningObjectives: LocalizedText[];
  wordForWordTeachingScript: LocalizedText;
  slidePageCues: unknown[];
  figureCues: unknown[];
  intuition: LocalizedText;
  graphGuidance: unknown[];
  tableGuidance: unknown[];
  levelAdaptations: string[];
  questionsToAskStudents: LocalizedText[];
  expectedStudentResponses: LocalizedText[];
  misconceptionsToAnticipate: string[];
  analogies: string[];
  examples: string[];
  transitions: unknown[];
  emphasisNotes: string[];
  timing: { estimatedMinutes: number; pauseCues: string[] };
  instructorOnlyCautions: string[];
  scientificCorrectionReferences: string[];
  sourceTraceability: ProvenanceLink[];
  arabic: ArabicGovernance;
  duplicateHandling: DuplicateHandling;
  blocking: BlockingState;
}

// ---- problem record -------------------------------------------------------

export interface GivenValue {
  symbol: string;
  value: number;
  unit: string;
  exactOrApproximate: "exact" | "approximate" | string;
}

export interface EquationSelection {
  equationId: string;
  reason: string;
  conditionsSatisfied: string[];
  conditionsMissing: string[];
}

export interface NumberedSolutionStep {
  stepNumber: number;
  purpose: string;
  explanation: LocalizedContent;
  calculationRef: string | null;
}

export interface CalculationEntry {
  calculationId: string;
  expression: string;
  substitution: string;
  /** Nullable: intermediate symbolic steps carry no numeric result. */
  result: number | null;
  unit: string | null;
  roundingRule: string | null;
  significantFigures: number | null;
}

export interface FinalAnswer {
  value: number | null;
  unit: string | null;
  direction: string | null;
  sign: string | null;
  referencePoint: string | null;
  interpretation: LocalizedContent;
}

export interface DirectionSign {
  applicable: boolean;
  note: string;
}

export interface SourceVariant {
  variantId: string;
  sourceId: string;
  answerVariant: string;
  answerStatus: string;
  correctionRecordIds: string[];
  conflictRecordIds: string[];
  [key: string]: unknown;
}

export interface ProblemRecord {
  problemId: string;
  topicIds: PilotTopicId[];
  problemStatement: LocalizedContent;
  givenValues: GivenValue[];
  conceptualInterpretation: LocalizedContent;
  equationSelection: EquationSelection[];
  numberedSolution: NumberedSolutionStep[];
  calculation: CalculationEntry[];
  finalAnswer: FinalAnswer;
  units: string[];
  directionSign: DirectionSign;
  intuition: LocalizedContent;
  commonMistake: string[];
  sourceAnswer: unknown;
  correctedAnswer: unknown;
  sourceVariants: SourceVariant[];
  selectedVariantIds: string[];
  selectionRationale: string;
  arabic: ArabicGovernance;
  duplicateHandling: DuplicateHandling;
  blocking: BlockingState;
}

// ---- top-level record envelope + file -------------------------------------

export type PilotRecord =
  | { recordType: "instructorScript"; record: InstructorScriptRecord }
  | { recordType: "contentBlock"; record: ContentBlockRecord }
  | { recordType: "problem"; record: ProblemRecord };

export interface PilotTopicFile {
  schemaVersion: string;
  topicId: PilotTopicId;
  /** Plain string — NOT LocalizedText. See file header note. */
  topicTitle: string;
  /** Plain string — NOT LocalizedText. See file header note. */
  topicTitleAr: string;
  generationStatus: string;
  generationNote: string;
  records: PilotRecord[];
}

// ---- visual validation record ----------------------------------------------

export interface VisualValidationRecord {
  visualResolutionId: string;
  visualId: string;
  topicIds: PilotTopicId[];
  assetPath: string;
  assetFormat: string;
  assetStatus: string;
  reviewRequired: boolean;
  readyForHumanReview: boolean;
  readyForHumanReviewNote?: string;
  studentFacingAllowed: boolean;
  studentPublicationAuthorized: boolean;
  reviewer: string | null;
  reviewedAt: string | null;
  revisionHistory: unknown[];
}
