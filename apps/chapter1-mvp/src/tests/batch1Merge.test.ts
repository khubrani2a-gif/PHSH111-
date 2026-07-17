import { describe, expect, it } from "vitest";
import { Batch1MergeError, mergeEnglishAndArabicTopicFile } from "../content/batch1Merge";
import { PILOT_SCHEMA_VERSION } from "../types/pilotSchema";

function enBlock(overrides: Record<string, unknown> = {}) {
  return {
    blockId: "ch01-t01-block-mainidea",
    blockType: "mainIdea",
    topicId: "ch01-t01",
    visibility: "shared",
    localizedContent: {
      en: { text: "English text.", status: "draft", language: "en", direction: "ltr" },
      ar: { text: null, status: "missing", language: "ar", direction: "rtl" },
    },
    arabic: {
      originalArabicText: { text: null, status: "missing", language: "ar", direction: "rtl" },
      canonicalArabicTranslation: { text: null, status: "missing", language: "ar", direction: "rtl" },
      translationStatus: "missing",
      translationReviewer: null,
      terminologyApprovalStatus: "notStarted",
      glossaryTermIds: [],
    },
    provenanceLinks: [],
    scientificCorrectionIds: ["ch01-corr-001"],
    conflictRecordIds: [],
    duplicateHandling: {
      duplicateGroupIds: [],
      revisionGroupId: null,
      canonicalPreferenceStatus: "preferred",
      preferredSourceRecordId: null,
      preferenceReason: "test",
      supersededBy: null,
      retainedForHistoricalTrace: true,
    },
    blocking: {
      blockingStatus: "blocked",
      blockingReason: ["other"],
      blockingRecordIds: [],
      studentFacingAllowed: false,
      instructorFacingAllowed: true,
      resolutionRequired: true,
      resolutionOwner: "test",
      resolutionStatus: "open",
    },
    contentLeakTestStatus: "notRun",
    ...overrides,
  };
}

function arBlock(overrides: Record<string, unknown> = {}) {
  const base = enBlock();
  return {
    ...base,
    localizedContent: {
      en: base.localizedContent.en,
      ar: { text: "نص عربي.", status: "draft", language: "ar", direction: "rtl" },
    },
    arabic: {
      originalArabicText: { text: null, status: "missing", language: "ar", direction: "rtl" },
      canonicalArabicTranslation: { text: "نص عربي.", status: "draft", language: "ar", direction: "rtl" },
      translationStatus: "draft",
      translationReviewer: null,
      terminologyApprovalStatus: "approved",
      glossaryTermIds: ["ch01-term-fundamental-quantity"],
    },
    ...overrides,
  };
}

function enFile(records: unknown[], overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: PILOT_SCHEMA_VERSION,
    topicId: "ch01-t01",
    topicTitle: "Fundamental Quantities",
    topicTitleAr: null,
    generationStatus: "draft-batch1-english-only-generation",
    generationNote: "test",
    records,
    ...overrides,
  };
}

function arFile(records: unknown[], overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: PILOT_SCHEMA_VERSION,
    topicId: "ch01-t01",
    topicTitle: "Fundamental Quantities",
    topicTitleAr: "الكميات الأساسية",
    generationStatus: "draft-batch1-arabic-candidate-generation",
    generationNote: "test",
    records,
    ...overrides,
  };
}

describe("mergeEnglishAndArabicTopicFile — synthetic fixtures", () => {
  it("merges a valid matching pair: English text/IDs preserved, Arabic text taken from the Arabic file", () => {
    const merged = mergeEnglishAndArabicTopicFile(
      enFile([{ recordType: "contentBlock", record: enBlock() }]),
      arFile([{ recordType: "contentBlock", record: arBlock() }]),
      "ch01-t01",
    );
    expect(merged.topicId).toBe("ch01-t01");
    expect(merged.topicTitleAr).toBe("الكميات الأساسية");
    const rec = merged.records[0];
    if (rec.recordType !== "contentBlock") throw new Error("expected contentBlock");
    expect(rec.record.blockId).toBe("ch01-t01-block-mainidea");
    expect(rec.record.localizedContent.en.text).toBe("English text.");
    expect(rec.record.localizedContent.ar.text).toBe("نص عربي.");
    expect(rec.record.arabic.translationStatus).toBe("draft");
    expect(rec.record.scientificCorrectionIds).toEqual(["ch01-corr-001"]);
  });

  it("never writes to disk / never mutates its inputs", () => {
    const en = enFile([{ recordType: "contentBlock", record: enBlock() }]);
    const ar = arFile([{ recordType: "contentBlock", record: arBlock() }]);
    const enSnapshot = JSON.stringify(en);
    const arSnapshot = JSON.stringify(ar);
    mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01");
    expect(JSON.stringify(en)).toBe(enSnapshot);
    expect(JSON.stringify(ar)).toBe(arSnapshot);
  });

  it("throws Batch1MergeError on schemaVersion mismatch", () => {
    const en = enFile([]);
    const ar = { ...arFile([]), schemaVersion: "9.9.9" };
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("throws on topicId mismatch against the expected ID", () => {
    const en = { ...enFile([]), topicId: "ch01-t04" };
    const ar = arFile([]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("throws on record-count mismatch between English and Arabic files", () => {
    const en = enFile([{ recordType: "contentBlock", record: enBlock() }]);
    const ar = arFile([]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("throws on a blockId mismatch at the same record position", () => {
    const en = enFile([{ recordType: "contentBlock", record: enBlock() }]);
    const ar = arFile([
      { recordType: "contentBlock", record: arBlock({ blockId: "ch01-t01-block-explanation" }) },
    ]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("throws when a non-Arabic field differs between the two files (e.g. scientificCorrectionIds)", () => {
    const en = enFile([{ recordType: "contentBlock", record: enBlock() }]);
    const ar = arFile([
      { recordType: "contentBlock", record: arBlock({ scientificCorrectionIds: ["ch01-corr-999"] }) },
    ]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("throws when the English text itself differs between the two files' .en side (not just .ar)", () => {
    const en = enFile([{ recordType: "contentBlock", record: enBlock() }]);
    const driftedArBlock = arBlock();
    driftedArBlock.localizedContent = {
      en: { text: "DRIFTED English text.", status: "draft", language: "en", direction: "ltr" },
      ar: driftedArBlock.localizedContent.ar,
    };
    const ar = arFile([{ recordType: "contentBlock", record: driftedArBlock }]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("throws on a recordType mismatch at the same position (record order must match)", () => {
    const en = enFile([{ recordType: "contentBlock", record: enBlock() }]);
    const ar = arFile([{ recordType: "problem", record: { problemId: "x" } }]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("does not silently continue with partial content on any mismatch — the whole merge throws, no partial file is returned", () => {
    const en = enFile([
      { recordType: "contentBlock", record: enBlock() },
      { recordType: "contentBlock", record: enBlock({ blockId: "ch01-t01-block-explanation" }) },
    ]);
    const ar = arFile([
      { recordType: "contentBlock", record: arBlock() },
      // Second record has a drifted field — the whole call must throw,
      // not return a two-record array with only the first one merged.
      { recordType: "contentBlock", record: arBlock({ blockId: "ch01-t01-block-explanation", scientificCorrectionIds: ["WRONG"] }) },
    ]);
    expect(() => mergeEnglishAndArabicTopicFile(en, ar, "ch01-t01")).toThrow(Batch1MergeError);
  });

  it("merges an instructorScript record (arabic field absent on English side, present on Arabic side)", () => {
    const enScript = {
      instructorScriptId: "ch01-is-101",
      topicIds: ["ch01-t01"],
      openingHook: { text: "Hook.", status: "draft", language: "en", direction: "ltr" },
      learningObjectives: [],
      blocking: enBlock().blocking,
    };
    const arScript = {
      ...enScript,
      arabic: {
        originalArabicText: { text: null, status: "missing", language: "ar", direction: "rtl" },
        canonicalArabicTranslation: { text: null, status: "missing", language: "ar", direction: "rtl" },
        translationStatus: "draft",
        translationReviewer: null,
        terminologyApprovalStatus: "approved",
        glossaryTermIds: [],
      },
    };
    const merged = mergeEnglishAndArabicTopicFile(
      enFile([{ recordType: "instructorScript", record: enScript }]),
      arFile([{ recordType: "instructorScript", record: arScript }]),
      "ch01-t01",
    );
    const rec = merged.records[0];
    if (rec.recordType !== "instructorScript") throw new Error("expected instructorScript");
    expect(rec.record.instructorScriptId).toBe("ch01-is-101");
    expect(rec.record.arabic.translationStatus).toBe("draft");
  });

  it("throws when an instructorScript field other than `arabic` differs", () => {
    const enScript = {
      instructorScriptId: "ch01-is-101",
      topicIds: ["ch01-t01"],
      openingHook: { text: "Hook.", status: "draft", language: "en", direction: "ltr" },
      learningObjectives: [],
      blocking: enBlock().blocking,
    };
    const arScript = {
      ...enScript,
      openingHook: { text: "DRIFTED Hook.", status: "draft", language: "en", direction: "ltr" },
      arabic: {
        originalArabicText: { text: null, status: "missing", language: "ar", direction: "rtl" },
        canonicalArabicTranslation: { text: null, status: "missing", language: "ar", direction: "rtl" },
        translationStatus: "draft",
        translationReviewer: null,
        terminologyApprovalStatus: "approved",
        glossaryTermIds: [],
      },
    };
    expect(() =>
      mergeEnglishAndArabicTopicFile(
        enFile([{ recordType: "instructorScript", record: enScript }]),
        arFile([{ recordType: "instructorScript", record: arScript }]),
        "ch01-t01",
      ),
    ).toThrow(Batch1MergeError);
  });
});
