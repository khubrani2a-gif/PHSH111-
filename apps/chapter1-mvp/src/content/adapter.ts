// The content adapter: transforms validated raw pilot records
// (src/types/pilotSchema.ts) into the normalized, read-only UI model
// (src/types/normalized.ts). This is the ONLY place raw source records are
// interpreted into UI-facing shape. It is read-only end to end — it never
// mutates RAW_CONTENT_BY_TOPIC, never writes to any file, and never
// invents a value for a field that is absent in the source.
//
// Every normalized section keeps its original source record ID
// (NormalizedSection.recordId / NormalizedProblem.recordId / etc.) so any
// rendered element can always be traced back to the exact canonical
// record it came from.

import {
  APP_TOPIC_ORDER,
  type ContentBlockRecord,
  type InstructorScriptRecord,
  type LocalizedContent,
  type PilotTopicFile,
  type PilotTopicId,
  type ProblemRecord,
  type VisualValidationRecord,
} from "../types/pilotSchema";
import type {
  AdapterDiagnostic,
  AdapterResult,
  NormalizedGovernance,
  NormalizedInstructorNote,
  NormalizedProblem,
  NormalizedSection,
  NormalizedSlide,
  NormalizedSolutionStep,
  NormalizedText,
  NormalizedTopic,
  NormalizedVisual,
} from "../types/normalized";
import {
  RAW_CONTENT_BY_TOPIC,
  RAW_FIGURE_URL_BY_BLOCK_ID,
  RAW_SVG_MARKUP_BY_TOPIC,
  RAW_VISUAL_VALIDATION_BY_TOPIC,
} from "./rawImports";
import { validateTopicFile, validateTopicSet } from "./validate";
import { describeVisualReviewStatus, isLearnerVisible } from "./governance";

function toNormalizedText(lc: LocalizedContent): NormalizedText {
  return { en: lc.en.text, ar: lc.ar.text };
}

function findContentBlock(
  file: PilotTopicFile,
  blockType: ContentBlockRecord["blockType"],
): ContentBlockRecord | undefined {
  for (const r of file.records) {
    if (r.recordType === "contentBlock" && r.record.blockType === blockType) {
      return r.record;
    }
  }
  return undefined;
}

function findProblem(file: PilotTopicFile): ProblemRecord | undefined {
  for (const r of file.records) {
    if (r.recordType === "problem") return r.record;
  }
  return undefined;
}

function findInstructorScript(file: PilotTopicFile): InstructorScriptRecord | undefined {
  for (const r of file.records) {
    if (r.recordType === "instructorScript") return r.record;
  }
  return undefined;
}

function normalizeSection(block: ContentBlockRecord): NormalizedSection {
  return {
    recordId: block.blockId,
    blockType: block.blockType,
    visibility: block.visibility,
    text: toNormalizedText(block.localizedContent),
    blocking: block.blocking,
  };
}

/**
 * Collects every blockType "slide" record in a topic's file into an
 * ordered array, sorted by each record's own slideNumber field. Generic
 * over however many slide records exist — adding a new slide to a topic's
 * source file (with the next slideNumber) requires no change here.
 */
function normalizeSlides(file: PilotTopicFile): NormalizedSlide[] {
  return file.records
    .filter((r): r is Extract<typeof r, { recordType: "contentBlock" }> => r.recordType === "contentBlock")
    .map((r) => r.record)
    .filter((block) => block.blockType === "slide")
    .map((block) => ({
      recordId: block.blockId,
      slideNumber: block.slideNumber ?? 0,
      title: { en: block.slideTitleEn ?? null, ar: block.slideTitleAr ?? null },
      visibility: block.visibility,
      text: toNormalizedText(block.localizedContent),
      table: block.tableEn || block.tableAr ? { en: block.tableEn ?? null, ar: block.tableAr ?? null } : undefined,
      figure:
        RAW_FIGURE_URL_BY_BLOCK_ID[block.blockId] && block.figureAltEn
          ? {
              assetUrl: RAW_FIGURE_URL_BY_BLOCK_ID[block.blockId],
              alt: { en: block.figureAltEn ?? null, ar: block.figureAltAr ?? null },
            }
          : undefined,
      blocking: block.blocking,
    }))
    .sort((a, b) => a.slideNumber - b.slideNumber);
}

function normalizeInstructorNote(block: ContentBlockRecord): NormalizedInstructorNote {
  return {
    recordId: block.blockId,
    blockType: block.blockType,
    text: toNormalizedText(block.localizedContent),
    blocking: block.blocking,
  };
}

function normalizeVisual(
  file: PilotTopicFile,
  topicId: PilotTopicId,
  diagnostics: AdapterDiagnostic[],
): NormalizedVisual | undefined {
  const block = findContentBlock(file, "visualReference");
  if (!block) return undefined;

  const governanceEntry = block.visualGovernance?.[0];
  const svgMarkup = RAW_SVG_MARKUP_BY_TOPIC[topicId];
  if (!svgMarkup) {
    diagnostics.push({
      severity: "error",
      code: "missing-visual",
      message: `No bundled SVG asset found for topic "${topicId}"`,
      topicId,
      recordId: block.blockId,
    });
  }

  const rawValidation = RAW_VISUAL_VALIDATION_BY_TOPIC[topicId] as
    | VisualValidationRecord
    | undefined;
  if (!rawValidation) {
    diagnostics.push({
      severity: "warning",
      code: "missing-visual-validation",
      message: `No visual-validation record found for topic "${topicId}"`,
      topicId,
      recordId: block.blockId,
    });
  }

  return {
    recordId: block.blockId,
    visualId: governanceEntry?.visualId ?? rawValidation?.visualId ?? `${topicId}-visual-001`,
    assetPath: governanceEntry?.assetPath ?? rawValidation?.assetPath ?? "",
    svgMarkup: svgMarkup ?? null,
    assetStatus: governanceEntry?.assetStatus ?? rawValidation?.assetStatus ?? "unknown",
    availabilityStatus: governanceEntry?.availabilityStatus ?? "unknown",
    studentFacingAllowed: rawValidation?.studentFacingAllowed ?? false,
    reviewer: rawValidation?.reviewer ?? null,
    reviewedAt: rawValidation?.reviewedAt ?? null,
    readyForHumanReview: rawValidation?.readyForHumanReview ?? false,
  };
}

function normalizeProblem(problem: ProblemRecord): NormalizedProblem {
  const calculationsById = new Map(problem.calculation.map((c) => [c.calculationId, c]));

  const steps: NormalizedSolutionStep[] = problem.numberedSolution.map((step) => {
    const calc = step.calculationRef ? calculationsById.get(step.calculationRef) : undefined;
    const normalized: NormalizedSolutionStep = {
      stepNumber: step.stepNumber,
      purpose: step.purpose,
      explanation: toNormalizedText(step.explanation),
    };
    if (calc) {
      normalized.expression = {
        expression: calc.expression,
        substitution: calc.substitution,
        result: calc.result,
        unit: calc.unit,
      };
    }
    return normalized;
  });

  const hasFinalAnswerText =
    problem.finalAnswer.interpretation.en.text || problem.finalAnswer.interpretation.ar.text;

  return {
    recordId: problem.problemId,
    statement: toNormalizedText(problem.problemStatement),
    givenValues: problem.givenValues.map((g) => ({
      symbol: g.symbol,
      value: g.value,
      unit: g.unit,
    })),
    conceptualInterpretation:
      problem.conceptualInterpretation.en.text || problem.conceptualInterpretation.ar.text
        ? toNormalizedText(problem.conceptualInterpretation)
        : undefined,
    steps,
    finalAnswer: hasFinalAnswerText
      ? {
          value: problem.finalAnswer.value,
          unit: problem.finalAnswer.unit,
          interpretation: toNormalizedText(problem.finalAnswer.interpretation),
        }
      : undefined,
    commonMistake: problem.commonMistake ?? [],
    blocking: problem.blocking,
  };
}

function normalizeGovernance(
  file: PilotTopicFile,
  topicId: PilotTopicId,
): NormalizedGovernance {
  const recordCount = file.records.length;
  let blockedRecordCount = 0;
  let allStudentFacingAllowed = true;
  for (const r of file.records) {
    const blocking =
      r.recordType === "contentBlock" || r.recordType === "problem" || r.recordType === "instructorScript"
        ? r.record.blocking
        : undefined;
    if (blocking) {
      if (blocking.blockingStatus === "blocked") blockedRecordCount += 1;
      if (!blocking.studentFacingAllowed) allStudentFacingAllowed = false;
    }
  }

  const rawValidation = RAW_VISUAL_VALIDATION_BY_TOPIC[topicId] as
    | VisualValidationRecord
    | undefined;
  const studentPublicationAuthorized = rawValidation?.studentPublicationAuthorized ?? false;

  return {
    topicId,
    schemaVersion: file.schemaVersion,
    recordCount,
    blockedRecordCount,
    studentFacingAllowed: allStudentFacingAllowed,
    studentPublicationAuthorized,
    visualReviewStatus: describeVisualReviewStatus(
      rawValidation?.readyForHumanReview ?? false,
      rawValidation?.reviewer ?? null,
    ),
    visualReviewer: rawValidation?.reviewer ?? null,
  };
}

/**
 * Exported (alongside validateTopicFile/validateTopicSet) so tests can
 * exercise the reviewQuestion visibility-gating logic — and any other
 * per-record normalization decision — against small, synthetic
 * PilotTopicFile fixtures, the same way src/tests/validate.test.ts already
 * does for record-level validation. Not otherwise called from outside
 * src/content/adapter.ts.
 */
export function normalizeTopic(
  file: PilotTopicFile,
  topicId: PilotTopicId,
  diagnostics: AdapterDiagnostic[],
): NormalizedTopic {
  const mainIdeaBlock = findContentBlock(file, "mainIdea");
  const explanationBlock = findContentBlock(file, "organizedExplanation");
  const equationsBlock = findContentBlock(file, "equationSet");
  const exampleBlock = findContentBlock(file, "example");
  const reviewQuestionBlock = findContentBlock(file, "reviewQuestion");
  const problem = findProblem(file);
  const instructorScript = findInstructorScript(file);

  // Instructor-only content blocks (currently only "misconception" in
  // practice, but any block whose visibility is "instructor" qualifies —
  // never assume the block type, always check the visibility field).
  const instructorNotes: NormalizedInstructorNote[] = file.records
    .filter((r): r is Extract<typeof r, { recordType: "contentBlock" }> => r.recordType === "contentBlock")
    .map((r) => r.record)
    .filter((block) => !isLearnerVisible(block.visibility))
    .map(normalizeInstructorNote);

  const topic: NormalizedTopic = {
    topicId,
    title: { en: file.topicTitle, ar: file.topicTitleAr },
    slides: normalizeSlides(file),
    mainIdea: mainIdeaBlock ? normalizeSection(mainIdeaBlock) : undefined,
    explanation: explanationBlock ? normalizeSection(explanationBlock) : undefined,
    equations: equationsBlock ? normalizeSection(equationsBlock) : undefined,
    visual: normalizeVisual(file, topicId, diagnostics),
    workedExample: exampleBlock ? normalizeSection(exampleBlock) : undefined,
    // Only placed in the learner-visible field when the source record's own
    // visibility permits it. An instructor-only reviewQuestion is never
    // duplicated here — it already flows into instructorNotes below via the
    // generic visibility filter, exactly like any other instructor-only
    // contentBlock (see docs/app/MVP_IMPLEMENTATION_DECISIONS.json decision B).
    reviewQuestion:
      reviewQuestionBlock && isLearnerVisible(reviewQuestionBlock.visibility)
        ? normalizeSection(reviewQuestionBlock)
        : undefined,
    problem: problem ? normalizeProblem(problem) : undefined,
    instructorNotes,
    governance: normalizeGovernance(file, topicId),
  };

  if (instructorScript && Array.isArray(instructorScript.learningObjectives) && instructorScript.learningObjectives.length > 0) {
    const items = instructorScript.learningObjectives
      .filter((lo) => lo.text)
      .map((lo) => ({ en: lo.language === "en" ? lo.text : null, ar: lo.language === "ar" ? lo.text : null }));
    // learningObjectives is an array of single-language LocalizedText
    // entries in the source (not LocalizedContent pairs) — see
    // src/types/pilotSchema.ts. Pair them up by index when both languages
    // are present in source order; otherwise keep whichever language
    // exists, since inventing the other side is prohibited.
    if (items.length > 0) {
      topic.instructorLearningObjectives = {
        recordId: instructorScript.instructorScriptId,
        items,
      };
    }
  }

  return topic;
}

let cachedResult: AdapterResult | null = null;

/**
 * Loads, validates, and normalizes every application-integrated topic (the
 * four original pilot topics plus Batch 1's ch01-t01/ch01-t04, in the
 * correct chapter-wide numerical order — see APP_TOPIC_ORDER in
 * src/types/pilotSchema.ts). Result is cached for the lifetime of the
 * module (the source data is static build-time content, not something
 * that changes at runtime) — components should call this rather than
 * re-deriving it themselves.
 */
export function loadAllTopics(): AdapterResult {
  if (cachedResult) return cachedResult;

  const diagnostics: AdapterDiagnostic[] = [];
  const seenRecordIds = new Set<string>();
  const topics: NormalizedTopic[] = [];
  const loadedTopicIds: PilotTopicId[] = [];

  for (const topicId of APP_TOPIC_ORDER) {
    const raw = RAW_CONTENT_BY_TOPIC[topicId];
    const file = validateTopicFile(raw, topicId, diagnostics, seenRecordIds);
    if (file) {
      loadedTopicIds.push(topicId);
      topics.push(normalizeTopic(file, topicId, diagnostics));
    }
  }

  validateTopicSet(loadedTopicIds, diagnostics);

  cachedResult = { topics, diagnostics };
  return cachedResult;
}

export function getTopic(topicId: string): NormalizedTopic | undefined {
  return loadAllTopics().topics.find((t) => t.topicId === topicId);
}

export function getTopicOrder(): PilotTopicId[] {
  return loadAllTopics().topics.map((t) => t.topicId);
}
