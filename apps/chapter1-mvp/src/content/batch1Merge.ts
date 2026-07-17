// Deterministic, in-memory merge of Batch 1's two separately-approved
// baseline files (English-only at docs/content-design/chapter-01/batch1-drafts/,
// Arabic candidate at docs/content-design/chapter-01/batch1-arabic-drafts/)
// into the single-file, English+Arabic-merged shape src/types/pilotSchema.ts
// already expects (matching the four pilot topics' own already-merged
// single-file convention).
//
// This module NEVER writes a merged file to disk — see
// docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md §7
// (selectedIntegrationSourceModel). It is invoked once, at module load time,
// by src/content/rawImports.ts, against the two approved source objects
// imported as live ES modules. Any structural mismatch between the English
// and Arabic files throws a Batch1MergeError with a precise, human-readable
// path — this module never silently continues with partial or
// best-effort content.
//
// Verified, by direct field-by-field diff of the real approved files
// (see the implementation-task's own static review), that the ONLY fields
// that legitimately differ between the English and Arabic files are:
//   - file-level `topicTitleAr` (English: null; Arabic: the real title)
//   - file-level `generationStatus`/`generationNote` (each file describes
//     its own generation step; the merge synthesizes a new, clearly-labeled
//     merged value rather than picking one)
//   - each record's own `arabic` governance sub-object (English: fully
//     "missing"; Arabic: populated, `translationStatus: "draft"`)
//   - the `.ar` side of every LocalizedContent field (English: null/missing;
//     Arabic: the real translated text)
// Every other field — every record ID, record order, blockType, visibility,
// provenanceLinks, scientificCorrectionIds, conflictRecordIds,
// duplicateHandling, blocking, contentLeakTestStatus, visualReferenceIds,
// visualGovernance, givenValues, equationSelection, calculation, units,
// directionSign, commonMistake, sourceAnswer, correctedAnswer,
// sourceVariants, selectedVariantIds, selectionRationale, and the `.en`
// side of every LocalizedContent field — must be byte-for-byte identical,
// and is verified as such below.

import type {
  ContentBlockRecord,
  InstructorScriptRecord,
  LocalizedContent,
  LocalizedText,
  PilotRecord,
  PilotTopicFile,
  PilotTopicId,
  ProblemRecord,
} from "../types/pilotSchema";

export class Batch1MergeError extends Error {
  constructor(message: string) {
    super(`Batch 1 English/Arabic merge failed: ${message}`);
    this.name = "Batch1MergeError";
  }
}

function isRecordObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

/** Strict, order-sensitive structural equality — no coercion, no partial match. */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (isRecordObject(a) && isRecordObject(b)) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length || aKeys.some((k, i) => k !== bKeys[i])) return false;
    return aKeys.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

function assertEqual(a: unknown, b: unknown, path: string): void {
  if (!deepEqual(a, b)) {
    throw new Batch1MergeError(
      `field "${path}" differs between the approved English and Arabic files (expected them to be identical outside Arabic-localization fields). ` +
        `English=${JSON.stringify(a)?.slice(0, 200)} Arabic=${JSON.stringify(b)?.slice(0, 200)}`,
    );
  }
}

function requireRecordObject(x: unknown, path: string): Record<string, unknown> {
  if (!isRecordObject(x)) {
    throw new Batch1MergeError(`"${path}" is missing or not an object`);
  }
  return x;
}

function requireLocalizedText(x: unknown, path: string): LocalizedText {
  const obj = requireRecordObject(x, path);
  if (
    !("text" in obj) ||
    typeof obj.status !== "string" ||
    (obj.language !== "en" && obj.language !== "ar") ||
    (obj.direction !== "ltr" && obj.direction !== "rtl")
  ) {
    throw new Batch1MergeError(`"${path}" is not a well-formed LocalizedText object`);
  }
  return obj as unknown as LocalizedText;
}

/**
 * The approved English baseline files omit the `ar` key entirely from every
 * LocalizedContent-shaped field (verified directly against the real files:
 * `localizedContent` on every contentBlock, and `problemStatement` /
 * `conceptualInterpretation` / `intuition` / each `numberedSolution[].explanation`
 * / `finalAnswer.interpretation` on the problem record, all carry only an
 * `en` key on the English side) — there is no `{text: null, status: "missing"}`
 * placeholder to validate there. Only the Arabic file's copy of the same
 * field is required to carry both `en` and `ar`. `sides` controls which keys
 * are validated/read from `x`.
 */
function requireLocalizedContentSide(
  x: unknown,
  path: string,
  sides: readonly ("en" | "ar")[],
): Partial<LocalizedContent> {
  const obj = requireRecordObject(x, path);
  const result: Partial<LocalizedContent> = {};
  for (const side of sides) {
    result[side] = requireLocalizedText(obj[side], `${path}.${side}`);
  }
  return result;
}

/**
 * Merges one LocalizedContent field: verifies the English sides are
 * identical, then takes the Arabic side from the Arabic file. Never
 * requires the English-baseline file to carry an `ar` key at all (see
 * requireLocalizedContentSide's header comment).
 */
function mergeLocalizedContentField(
  enRaw: unknown,
  arRaw: unknown,
  path: string,
): LocalizedContent {
  const en = requireLocalizedContentSide(enRaw, `${path} (English file)`, ["en"]);
  const ar = requireLocalizedContentSide(arRaw, `${path} (Arabic file)`, ["en", "ar"]);
  assertEqual(en.en, ar.en, `${path}.en`);
  return { en: en.en!, ar: ar.ar! };
}

function mergeArabicGovernance(arRaw: unknown, path: string): unknown {
  const ar = requireRecordObject(arRaw, path);
  if (
    typeof ar.translationStatus !== "string" ||
    typeof ar.terminologyApprovalStatus !== "string" ||
    !Array.isArray(ar.glossaryTermIds)
  ) {
    throw new Batch1MergeError(`"${path}" (Arabic file) is not a well-formed ArabicGovernance object`);
  }
  return ar;
}

function mergeContentBlockRecord(
  enRec: Record<string, unknown>,
  arRec: Record<string, unknown>,
  path: string,
): ContentBlockRecord {
  const blockId = enRec.blockId;
  if (typeof blockId !== "string" || blockId.length === 0) {
    throw new Batch1MergeError(`"${path}.blockId" is missing in the English file`);
  }
  assertEqual(enRec.blockId, arRec.blockId, `${path}.blockId`);
  assertEqual(enRec.blockType, arRec.blockType, `${path}.blockType`);
  assertEqual(enRec.topicId, arRec.topicId, `${path}.topicId`);
  assertEqual(enRec.visibility, arRec.visibility, `${path}.visibility`);
  assertEqual(enRec.provenanceLinks, arRec.provenanceLinks, `${path}.provenanceLinks`);
  assertEqual(enRec.scientificCorrectionIds, arRec.scientificCorrectionIds, `${path}.scientificCorrectionIds`);
  assertEqual(enRec.conflictRecordIds, arRec.conflictRecordIds, `${path}.conflictRecordIds`);
  assertEqual(enRec.duplicateHandling, arRec.duplicateHandling, `${path}.duplicateHandling`);
  assertEqual(enRec.blocking, arRec.blocking, `${path}.blocking`);
  assertEqual(enRec.contentLeakTestStatus, arRec.contentLeakTestStatus, `${path}.contentLeakTestStatus`);
  assertEqual(enRec.visualReferenceIds, arRec.visualReferenceIds, `${path}.visualReferenceIds`);
  assertEqual(enRec.visualGovernance, arRec.visualGovernance, `${path}.visualGovernance`);

  const localizedContent = mergeLocalizedContentField(
    enRec.localizedContent,
    arRec.localizedContent,
    `${path}.localizedContent`,
  );
  const arabic = mergeArabicGovernance(arRec.arabic, `${path}.arabic`);

  return {
    ...(enRec as unknown as ContentBlockRecord),
    localizedContent,
    arabic: arabic as ContentBlockRecord["arabic"],
  };
}

function mergeInstructorScriptRecord(
  enRec: Record<string, unknown>,
  arRec: Record<string, unknown>,
  path: string,
): InstructorScriptRecord {
  const id = enRec.instructorScriptId;
  if (typeof id !== "string" || id.length === 0) {
    throw new Batch1MergeError(`"${path}.instructorScriptId" is missing in the English file`);
  }
  // Every field except `arabic` (absent entirely on the English file, see
  // pilotSchema.ts's header note that this record type is not wrapped in a
  // LocalizedContent pair the way contentBlock is) must be identical.
  for (const key of Object.keys(enRec)) {
    if (key === "arabic") continue;
    assertEqual(enRec[key], arRec[key], `${path}.${key}`);
  }
  const arabic = mergeArabicGovernance(arRec.arabic, `${path}.arabic`);

  return {
    ...(enRec as unknown as InstructorScriptRecord),
    arabic: arabic as InstructorScriptRecord["arabic"],
  };
}

function mergeProblemRecord(
  enRec: Record<string, unknown>,
  arRec: Record<string, unknown>,
  path: string,
): ProblemRecord {
  const problemId = enRec.problemId;
  if (typeof problemId !== "string" || problemId.length === 0) {
    throw new Batch1MergeError(`"${path}.problemId" is missing in the English file`);
  }
  assertEqual(enRec.problemId, arRec.problemId, `${path}.problemId`);
  assertEqual(enRec.topicIds, arRec.topicIds, `${path}.topicIds`);
  assertEqual(enRec.givenValues, arRec.givenValues, `${path}.givenValues`);
  assertEqual(enRec.equationSelection, arRec.equationSelection, `${path}.equationSelection`);
  assertEqual(enRec.calculation, arRec.calculation, `${path}.calculation`);
  assertEqual(enRec.units, arRec.units, `${path}.units`);
  assertEqual(enRec.directionSign, arRec.directionSign, `${path}.directionSign`);
  assertEqual(enRec.commonMistake, arRec.commonMistake, `${path}.commonMistake`);
  assertEqual(enRec.sourceAnswer, arRec.sourceAnswer, `${path}.sourceAnswer`);
  assertEqual(enRec.correctedAnswer, arRec.correctedAnswer, `${path}.correctedAnswer`);
  assertEqual(enRec.sourceVariants, arRec.sourceVariants, `${path}.sourceVariants`);
  assertEqual(enRec.selectedVariantIds, arRec.selectedVariantIds, `${path}.selectedVariantIds`);
  assertEqual(enRec.selectionRationale, arRec.selectionRationale, `${path}.selectionRationale`);
  assertEqual(enRec.duplicateHandling, arRec.duplicateHandling, `${path}.duplicateHandling`);
  assertEqual(enRec.blocking, arRec.blocking, `${path}.blocking`);

  const problemStatement = mergeLocalizedContentField(
    enRec.problemStatement,
    arRec.problemStatement,
    `${path}.problemStatement`,
  );
  const conceptualInterpretation = mergeLocalizedContentField(
    enRec.conceptualInterpretation,
    arRec.conceptualInterpretation,
    `${path}.conceptualInterpretation`,
  );
  const intuition = mergeLocalizedContentField(enRec.intuition, arRec.intuition, `${path}.intuition`);

  const enSteps = enRec.numberedSolution;
  const arSteps = arRec.numberedSolution;
  if (!Array.isArray(enSteps) || !Array.isArray(arSteps)) {
    throw new Batch1MergeError(`"${path}.numberedSolution" is not an array in one of the two files`);
  }
  if (enSteps.length !== arSteps.length) {
    throw new Batch1MergeError(
      `"${path}.numberedSolution" length differs (English=${enSteps.length}, Arabic=${arSteps.length})`,
    );
  }
  const numberedSolution = enSteps.map((enStep: Record<string, unknown>, i: number) => {
    const arStep = arSteps[i] as Record<string, unknown>;
    assertEqual(enStep.stepNumber, arStep.stepNumber, `${path}.numberedSolution[${i}].stepNumber`);
    assertEqual(enStep.purpose, arStep.purpose, `${path}.numberedSolution[${i}].purpose`);
    assertEqual(enStep.calculationRef, arStep.calculationRef, `${path}.numberedSolution[${i}].calculationRef`);
    const explanation = mergeLocalizedContentField(
      enStep.explanation,
      arStep.explanation,
      `${path}.numberedSolution[${i}].explanation`,
    );
    return { ...enStep, explanation };
  });

  const enFinalAnswer = requireRecordObject(enRec.finalAnswer, `${path}.finalAnswer (English file)`);
  const arFinalAnswer = requireRecordObject(arRec.finalAnswer, `${path}.finalAnswer (Arabic file)`);
  assertEqual(enFinalAnswer.value, arFinalAnswer.value, `${path}.finalAnswer.value`);
  assertEqual(enFinalAnswer.unit, arFinalAnswer.unit, `${path}.finalAnswer.unit`);
  assertEqual(enFinalAnswer.direction, arFinalAnswer.direction, `${path}.finalAnswer.direction`);
  assertEqual(enFinalAnswer.sign, arFinalAnswer.sign, `${path}.finalAnswer.sign`);
  assertEqual(enFinalAnswer.referencePoint, arFinalAnswer.referencePoint, `${path}.finalAnswer.referencePoint`);
  const finalAnswerInterpretation = mergeLocalizedContentField(
    enFinalAnswer.interpretation,
    arFinalAnswer.interpretation,
    `${path}.finalAnswer.interpretation`,
  );

  const arabic = mergeArabicGovernance(arRec.arabic, `${path}.arabic`);

  return {
    ...(enRec as unknown as ProblemRecord),
    problemStatement,
    conceptualInterpretation,
    intuition,
    numberedSolution: numberedSolution as unknown as ProblemRecord["numberedSolution"],
    finalAnswer: { ...enFinalAnswer, interpretation: finalAnswerInterpretation } as unknown as ProblemRecord["finalAnswer"],
    arabic: arabic as ProblemRecord["arabic"],
  };
}

/**
 * Merges one Batch 1 topic's approved English file with its approved
 * Arabic candidate file into a single PilotTopicFile, matching the shape
 * every other part of the application (adapter, validate) already expects.
 * Throws Batch1MergeError — never returns partial content — on any
 * structural mismatch.
 */
export function mergeEnglishAndArabicTopicFile(
  englishRaw: unknown,
  arabicRaw: unknown,
  expectedTopicId: PilotTopicId,
): PilotTopicFile {
  const en = requireRecordObject(englishRaw, `${expectedTopicId} English file`);
  const ar = requireRecordObject(arabicRaw, `${expectedTopicId} Arabic file`);

  assertEqual(en.schemaVersion, ar.schemaVersion, `${expectedTopicId}.schemaVersion`);
  if (en.topicId !== expectedTopicId) {
    throw new Batch1MergeError(
      `English file's topicId "${String(en.topicId)}" does not match expected "${expectedTopicId}"`,
    );
  }
  if (ar.topicId !== expectedTopicId) {
    throw new Batch1MergeError(
      `Arabic file's topicId "${String(ar.topicId)}" does not match expected "${expectedTopicId}"`,
    );
  }
  assertEqual(en.topicTitle, ar.topicTitle, `${expectedTopicId}.topicTitle`);

  const enRecords = en.records;
  const arRecords = ar.records;
  if (!Array.isArray(enRecords) || !Array.isArray(arRecords)) {
    throw new Batch1MergeError(`"${expectedTopicId}.records" is not an array in one of the two files`);
  }
  if (enRecords.length !== arRecords.length) {
    throw new Batch1MergeError(
      `"${expectedTopicId}.records" length differs (English=${enRecords.length}, Arabic=${arRecords.length})`,
    );
  }

  const mergedRecords: PilotRecord[] = enRecords.map((enEnvelope: unknown, i: number) => {
    const arEnvelope = arRecords[i];
    const enEnv = requireRecordObject(enEnvelope, `${expectedTopicId}.records[${i}] (English file)`);
    const arEnv = requireRecordObject(arEnvelope, `${expectedTopicId}.records[${i}] (Arabic file)`);
    const recordType = enEnv.recordType;
    if (recordType !== arEnv.recordType) {
      throw new Batch1MergeError(
        `"${expectedTopicId}.records[${i}].recordType" differs (English="${String(enEnv.recordType)}", Arabic="${String(arEnv.recordType)}") — record order must be identical between the two files`,
      );
    }

    const enRec = requireRecordObject(enEnv.record, `${expectedTopicId}.records[${i}].record (English file)`);
    const arRec = requireRecordObject(arEnv.record, `${expectedTopicId}.records[${i}].record (Arabic file)`);
    const path = `${expectedTopicId}.records[${i}]`;

    if (recordType === "contentBlock") {
      if (enRec.blockId !== arRec.blockId) {
        throw new Batch1MergeError(
          `"${path}" blockId mismatch (English="${String(enRec.blockId)}", Arabic="${String(arRec.blockId)}") — record order/identity must match between English and Arabic files`,
        );
      }
      return { recordType: "contentBlock", record: mergeContentBlockRecord(enRec, arRec, path) };
    }
    if (recordType === "instructorScript") {
      if (enRec.instructorScriptId !== arRec.instructorScriptId) {
        throw new Batch1MergeError(
          `"${path}" instructorScriptId mismatch (English="${String(enRec.instructorScriptId)}", Arabic="${String(arRec.instructorScriptId)}")`,
        );
      }
      return { recordType: "instructorScript", record: mergeInstructorScriptRecord(enRec, arRec, path) };
    }
    if (recordType === "problem") {
      if (enRec.problemId !== arRec.problemId) {
        throw new Batch1MergeError(
          `"${path}" problemId mismatch (English="${String(enRec.problemId)}", Arabic="${String(arRec.problemId)}")`,
        );
      }
      return { recordType: "problem", record: mergeProblemRecord(enRec, arRec, path) };
    }
    throw new Batch1MergeError(`"${path}.recordType" is unsupported: "${String(recordType)}"`);
  });

  return {
    schemaVersion: en.schemaVersion as string,
    topicId: expectedTopicId,
    topicTitle: en.topicTitle as string,
    // Taken from the Arabic file — the English-only baseline deliberately
    // carries topicTitleAr: null (see ENGLISH_BATCH1_BASELINE_APPROVAL.json's
    // scope), and the Arabic candidate file is the one baseline-approved
    // source for this field's real value.
    topicTitleAr: (ar.topicTitleAr as string) ?? "",
    generationStatus: "merged-batch1-english-arabic-in-memory",
    generationNote:
      "This PilotTopicFile is an in-memory merge (never written to disk) of the approved English baseline " +
      `(docs/content-design/chapter-01/batch1-drafts/${expectedTopicId}-content.json, ENGLISH_BATCH1_BASELINE_APPROVAL.json v1.0.0) ` +
      `and the approved Arabic baseline (docs/content-design/chapter-01/batch1-arabic-drafts/${expectedTopicId}-content.json, ` +
      "ARABIC_BATCH1_BASELINE_APPROVAL.json v1.0.0), produced by src/content/batch1Merge.ts at module load time. " +
      "Every non-Arabic field was verified identical between the two source files before merging.",
    records: mergedRecords,
  };
}
