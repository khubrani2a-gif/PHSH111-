// Lightweight, hand-written development-time validation for the raw pilot
// content JSON. Custom TypeScript type guards were chosen over Zod: the
// source schema is small (one file shape, three record types, ~12 fields
// per contentBlock, all verified identical across all four topics — see
// src/types/pilotSchema.ts's header notes), so a general-purpose schema
// library was not a demonstrated need. See
// docs/app/MVP_IMPLEMENTATION_DECISIONS.json, decision F, and
// MVP_PRODUCT_SPEC.md §16 for the stated preference.
//
// Hard rules enforced throughout this file:
// - Never mutate the input.
// - Never invent a fallback value for a missing/invalid field.
// - Never silently drop an invalid record — every rejection produces an
//   AdapterDiagnostic explaining exactly what was wrong and where.

import type { AdapterDiagnostic } from "../types/normalized";
import {
  APP_TOPIC_ORDER,
  PILOT_SCHEMA_VERSION,
  type BlockingState,
  type ContentBlockRecord,
  type ContentBlockType,
  type InstructorScriptRecord,
  type LocalizedContent,
  type LocalizedText,
  type PilotRecord,
  type PilotTopicFile,
  type PilotTopicId,
  type ProblemRecord,
  type VisibilityState,
} from "../types/pilotSchema";

const KNOWN_BLOCK_TYPES: readonly ContentBlockType[] = [
  "mainIdea",
  "organizedExplanation",
  "equationSet",
  "example",
  "visualReference",
  "misconception",
  "reviewQuestion",
  "openingConcept",
  "openingConceptSlide2",
];

const KNOWN_VISIBILITY: readonly VisibilityState[] = [
  "shared",
  "student",
  "instructor",
];

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function diag(
  diagnostics: AdapterDiagnostic[],
  severity: "error" | "warning",
  code: string,
  message: string,
  topicId?: string,
  recordId?: string,
): void {
  diagnostics.push({ severity, code, message, topicId, recordId });
}

function isLocalizedText(x: unknown): x is LocalizedText {
  if (!isRecord(x)) return false;
  return (
    ("text" in x && (typeof x.text === "string" || x.text === null)) &&
    typeof x.status === "string" &&
    (x.language === "en" || x.language === "ar") &&
    (x.direction === "ltr" || x.direction === "rtl")
  );
}

function isLocalizedContent(x: unknown): x is LocalizedContent {
  if (!isRecord(x)) return false;
  return isLocalizedText(x.en) && isLocalizedText(x.ar);
}

function isBlockingState(x: unknown): x is BlockingState {
  if (!isRecord(x)) return false;
  return (
    typeof x.blockingStatus === "string" &&
    Array.isArray(x.blockingReason) &&
    typeof x.studentFacingAllowed === "boolean" &&
    typeof x.instructorFacingAllowed === "boolean" &&
    typeof x.resolutionStatus === "string"
  );
}

/**
 * Checks a LocalizedContent pair has real, non-null text in both languages.
 * Missing localization is reported as a warning (not an error) — the
 * record itself is still structurally valid, but the adapter must know it
 * cannot present that language for this field.
 */
function checkLocalizationComplete(
  lc: LocalizedContent,
  topicId: string,
  recordId: string,
  fieldLabel: string,
  diagnostics: AdapterDiagnostic[],
): void {
  if (!lc.en.text) {
    diag(
      diagnostics,
      "warning",
      "missing-localization-en",
      `${fieldLabel} has no English text`,
      topicId,
      recordId,
    );
  }
  if (!lc.ar.text) {
    diag(
      diagnostics,
      "warning",
      "missing-localization-ar",
      `${fieldLabel} has no Arabic text`,
      topicId,
      recordId,
    );
  }
}

function validateContentBlock(
  raw: unknown,
  topicId: PilotTopicId,
  diagnostics: AdapterDiagnostic[],
  seenRecordIds: Set<string>,
): ContentBlockRecord | null {
  if (!isRecord(raw)) {
    diag(diagnostics, "error", "malformed-record", "contentBlock record is not an object", topicId);
    return null;
  }
  const blockId = raw.blockId;
  if (typeof blockId !== "string" || blockId.length === 0) {
    diag(diagnostics, "error", "missing-record-id", "contentBlock is missing blockId", topicId);
    return null;
  }
  if (seenRecordIds.has(blockId)) {
    diag(diagnostics, "error", "duplicate-record-id", `Duplicate record ID "${blockId}"`, topicId, blockId);
    return null;
  }

  if (raw.topicId !== topicId) {
    diag(
      diagnostics,
      "error",
      "topic-id-mismatch",
      `Record's topicId "${String(raw.topicId)}" does not match file topic "${topicId}"`,
      topicId,
      blockId,
    );
    return null;
  }

  if (!KNOWN_BLOCK_TYPES.includes(raw.blockType as ContentBlockType)) {
    diag(
      diagnostics,
      "error",
      "invalid-block-type",
      `Unsupported blockType "${String(raw.blockType)}"`,
      topicId,
      blockId,
    );
    return null;
  }

  if (!KNOWN_VISIBILITY.includes(raw.visibility as VisibilityState)) {
    diag(
      diagnostics,
      "error",
      "invalid-visibility",
      `Unsupported visibility value "${String(raw.visibility)}"`,
      topicId,
      blockId,
    );
    return null;
  }

  if (!isLocalizedContent(raw.localizedContent)) {
    diag(diagnostics, "error", "malformed-localized-content", "localizedContent is malformed", topicId, blockId);
    return null;
  }

  if (!isBlockingState(raw.blocking)) {
    diag(diagnostics, "error", "missing-governance", "blocking/governance metadata is missing or malformed", topicId, blockId);
    return null;
  }

  checkLocalizationComplete(
    raw.localizedContent,
    topicId,
    blockId,
    `${raw.blockType as string} (${blockId})`,
    diagnostics,
  );

  seenRecordIds.add(blockId);
  return raw as unknown as ContentBlockRecord;
}

function validateProblem(
  raw: unknown,
  topicId: PilotTopicId,
  diagnostics: AdapterDiagnostic[],
  seenRecordIds: Set<string>,
): ProblemRecord | null {
  if (!isRecord(raw)) {
    diag(diagnostics, "error", "malformed-record", "problem record is not an object", topicId);
    return null;
  }
  const problemId = raw.problemId;
  if (typeof problemId !== "string" || problemId.length === 0) {
    diag(diagnostics, "error", "missing-record-id", "problem is missing problemId", topicId);
    return null;
  }
  if (seenRecordIds.has(problemId)) {
    diag(diagnostics, "error", "duplicate-record-id", `Duplicate record ID "${problemId}"`, topicId, problemId);
    return null;
  }

  const topicIds = raw.topicIds;
  if (!Array.isArray(topicIds) || !topicIds.includes(topicId)) {
    diag(
      diagnostics,
      "error",
      "topic-id-mismatch",
      `problem's topicIds does not include file topic "${topicId}"`,
      topicId,
      problemId,
    );
    return null;
  }

  if (!isLocalizedContent(raw.problemStatement)) {
    diag(diagnostics, "error", "malformed-problem", "problemStatement is malformed", topicId, problemId);
    return null;
  }
  if (!Array.isArray(raw.givenValues)) {
    diag(diagnostics, "error", "malformed-problem", "givenValues is not an array", topicId, problemId);
    return null;
  }
  if (!Array.isArray(raw.numberedSolution) || raw.numberedSolution.length === 0) {
    diag(diagnostics, "error", "malformed-problem", "numberedSolution is missing or empty", topicId, problemId);
    return null;
  }
  if (!Array.isArray(raw.calculation)) {
    diag(diagnostics, "error", "malformed-problem", "calculation is not an array", topicId, problemId);
    return null;
  }
  if (!isRecord(raw.finalAnswer)) {
    diag(diagnostics, "error", "malformed-problem", "finalAnswer is missing", topicId, problemId);
    return null;
  }
  if (!isBlockingState(raw.blocking)) {
    diag(diagnostics, "error", "missing-governance", "blocking/governance metadata is missing or malformed", topicId, problemId);
    return null;
  }

  checkLocalizationComplete(raw.problemStatement, topicId, problemId, `problemStatement (${problemId})`, diagnostics);

  seenRecordIds.add(problemId);
  return raw as unknown as ProblemRecord;
}

function validateInstructorScript(
  raw: unknown,
  topicId: PilotTopicId,
  diagnostics: AdapterDiagnostic[],
  seenRecordIds: Set<string>,
): InstructorScriptRecord | null {
  if (!isRecord(raw)) {
    diag(diagnostics, "error", "malformed-record", "instructorScript record is not an object", topicId);
    return null;
  }
  const id = raw.instructorScriptId;
  if (typeof id !== "string" || id.length === 0) {
    diag(diagnostics, "error", "missing-record-id", "instructorScript is missing instructorScriptId", topicId);
    return null;
  }
  if (seenRecordIds.has(id)) {
    diag(diagnostics, "error", "duplicate-record-id", `Duplicate record ID "${id}"`, topicId, id);
    return null;
  }
  const topicIds = raw.topicIds;
  if (!Array.isArray(topicIds) || !topicIds.includes(topicId)) {
    diag(diagnostics, "error", "topic-id-mismatch", `instructorScript's topicIds does not include file topic "${topicId}"`, topicId, id);
    return null;
  }
  if (!isBlockingState(raw.blocking)) {
    diag(diagnostics, "error", "missing-governance", "blocking/governance metadata is missing or malformed", topicId, id);
    return null;
  }
  if (!Array.isArray(raw.learningObjectives)) {
    diag(diagnostics, "warning", "malformed-instructor-script", "learningObjectives is not an array", topicId, id);
  }

  seenRecordIds.add(id);
  return raw as unknown as InstructorScriptRecord;
}

/**
 * Validates one topic's raw content file. Returns null (with diagnostics
 * explaining why) if the file-level shape itself is unusable; otherwise
 * returns a PilotTopicFile whose `records` array contains ONLY the
 * individual records that passed validation (invalid records are omitted
 * from the return value, each with its own diagnostic — never silently,
 * since the diagnostic array always explains the omission).
 */
export function validateTopicFile(
  raw: unknown,
  expectedTopicId: PilotTopicId,
  diagnostics: AdapterDiagnostic[],
  seenRecordIds: Set<string>,
): PilotTopicFile | null {
  if (!isRecord(raw)) {
    diag(diagnostics, "error", "malformed-file", "Topic file is not a JSON object", expectedTopicId);
    return null;
  }

  if (raw.schemaVersion !== PILOT_SCHEMA_VERSION) {
    diag(
      diagnostics,
      "error",
      "invalid-schema-version",
      `Expected schemaVersion "${PILOT_SCHEMA_VERSION}", found "${String(raw.schemaVersion)}"`,
      expectedTopicId,
    );
    return null;
  }

  if (raw.topicId !== expectedTopicId) {
    diag(
      diagnostics,
      "error",
      "topic-id-mismatch",
      `File's topicId "${String(raw.topicId)}" does not match expected "${expectedTopicId}"`,
      expectedTopicId,
    );
    return null;
  }

  if (typeof raw.topicTitle !== "string" || typeof raw.topicTitleAr !== "string") {
    diag(diagnostics, "error", "missing-topic-title", "topicTitle/topicTitleAr missing or not strings", expectedTopicId);
    return null;
  }

  if (!Array.isArray(raw.records)) {
    diag(diagnostics, "error", "malformed-file", "records is not an array", expectedTopicId);
    return null;
  }

  const validatedRecords: PilotRecord[] = [];
  for (const entry of raw.records) {
    if (!isRecord(entry)) {
      diag(diagnostics, "error", "malformed-record", "Record envelope is not an object", expectedTopicId);
      continue;
    }
    const recordType = entry.recordType;
    if (recordType === "contentBlock") {
      const rec = validateContentBlock(entry.record, expectedTopicId, diagnostics, seenRecordIds);
      if (rec) validatedRecords.push({ recordType: "contentBlock", record: rec });
    } else if (recordType === "problem") {
      const rec = validateProblem(entry.record, expectedTopicId, diagnostics, seenRecordIds);
      if (rec) validatedRecords.push({ recordType: "problem", record: rec });
    } else if (recordType === "instructorScript") {
      const rec = validateInstructorScript(entry.record, expectedTopicId, diagnostics, seenRecordIds);
      if (rec) validatedRecords.push({ recordType: "instructorScript", record: rec });
    } else {
      diag(
        diagnostics,
        "error",
        "unsupported-record-type",
        `Unsupported recordType "${String(recordType)}"`,
        expectedTopicId,
      );
    }
  }

  return {
    schemaVersion: raw.schemaVersion,
    topicId: expectedTopicId,
    topicTitle: raw.topicTitle,
    topicTitleAr: raw.topicTitleAr,
    generationStatus: typeof raw.generationStatus === "string" ? raw.generationStatus : "",
    generationNote: typeof raw.generationNote === "string" ? raw.generationNote : "",
    records: validatedRecords,
  };
}

/**
 * File-set-level checks that only make sense once every topic has been
 * parsed: topic count and topic order. Individual-record duplicate-ID
 * checking happens inline (via the shared `seenRecordIds` set) during
 * validateTopicFile so it catches duplicates across topics too, not only
 * within one file.
 *
 * Checked against APP_TOPIC_ORDER (the six-topic chapter-wide sequence:
 * ch01-t01, ch01-t02, ch01-t03, ch01-t04, ch01-t08, ch01-t10), not the
 * narrower four-topic PILOT_TOPIC_ORDER — see
 * docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md
 * §10-11. APP_TOPIC_ORDER's four originally-pilot topics remain in their
 * exact original relative order, so this subsumes the prior four-topic
 * check rather than replacing its intent.
 */
export function validateTopicSet(
  loadedTopicIds: PilotTopicId[],
  diagnostics: AdapterDiagnostic[],
): void {
  if (loadedTopicIds.length !== APP_TOPIC_ORDER.length) {
    diag(
      diagnostics,
      "error",
      "unexpected-topic-count",
      `Expected exactly ${APP_TOPIC_ORDER.length} topics, loaded ${loadedTopicIds.length}`,
    );
  }
  APP_TOPIC_ORDER.forEach((expected, index) => {
    const actual = loadedTopicIds[index];
    if (actual !== expected) {
      diag(
        diagnostics,
        "error",
        "unexpected-topic-order",
        `Expected topic at position ${index} to be "${expected}", found "${String(actual)}"`,
      );
    }
  });
}
