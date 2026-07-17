import { describe, expect, it } from "vitest";
import { validateTopicFile, validateTopicSet } from "../content/validate";
import { PILOT_SCHEMA_VERSION } from "../types/pilotSchema";
import type { AdapterDiagnostic } from "../types/normalized";

function baseContentBlock(overrides: Record<string, unknown> = {}) {
  return {
    blockId: "ch01-t02-block-mainidea",
    blockType: "mainIdea",
    topicId: "ch01-t02",
    visibility: "shared",
    localizedContent: {
      en: { text: "English text.", status: "draft", language: "en", direction: "ltr" },
      ar: { text: "نص عربي.", status: "draft", language: "ar", direction: "rtl" },
    },
    arabic: {
      originalArabicText: { text: null, status: "missing", language: "ar", direction: "rtl" },
      canonicalArabicTranslation: {
        text: "نص عربي.",
        status: "draft",
        language: "ar",
        direction: "rtl",
      },
      translationStatus: "draft",
      translationReviewer: null,
      terminologyApprovalStatus: "approved",
      glossaryTermIds: [],
    },
    provenanceLinks: [],
    scientificCorrectionIds: [],
    conflictRecordIds: [],
    duplicateHandling: {
      duplicateGroupIds: [],
      revisionGroupId: null,
      canonicalPreferenceStatus: "preferred",
      preferredSourceRecordId: null,
      preferenceReason: "test fixture",
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

function baseFile(records: unknown[]) {
  return {
    schemaVersion: PILOT_SCHEMA_VERSION,
    topicId: "ch01-t02",
    topicTitle: "Test Topic",
    topicTitleAr: "موضوع اختبار",
    generationStatus: "draft-pilot-generation",
    generationNote: "test fixture",
    records,
  };
}

describe("validateTopicFile — synthetic malformed fixtures", () => {
  it("rejects a duplicate record ID and reports it as an error diagnostic", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile([
      { recordType: "contentBlock", record: baseContentBlock() },
      { recordType: "contentBlock", record: baseContentBlock({ blockType: "organizedExplanation" }) }, // same blockId as first
    ]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(1); // second (duplicate) record rejected
    expect(diagnostics.some((d) => d.code === "duplicate-record-id" && d.severity === "error")).toBe(
      true,
    );
  });

  it("reports an unsupported recordType without crashing and without including it in output", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile([
      { recordType: "somethingUnsupported", record: {} },
      { recordType: "contentBlock", record: baseContentBlock() },
    ]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(1);
    expect(
      diagnostics.some((d) => d.code === "unsupported-record-type" && d.severity === "error"),
    ).toBe(true);
  });

  it("rejects an invalid blockType", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile([
      { recordType: "contentBlock", record: baseContentBlock({ blockType: "notARealBlockType" }) },
    ]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "invalid-block-type")).toBe(true);
  });

  it("rejects an unsupported visibility value", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile([
      { recordType: "contentBlock", record: baseContentBlock({ visibility: "public" }) },
    ]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "invalid-visibility")).toBe(true);
  });

  it("flags a missing blocking/governance object as an error", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const record = baseContentBlock();
    delete (record as Record<string, unknown>).blocking;
    const file = baseFile([{ recordType: "contentBlock", record }]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "missing-governance")).toBe(true);
  });

  it("flags a topicId mismatch between a record and its containing file", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile([
      { recordType: "contentBlock", record: baseContentBlock({ topicId: "ch01-t03" }) },
    ]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "topic-id-mismatch")).toBe(true);
  });

  it("produces a warning diagnostic (not silent, not an invented translation) for missing Arabic localization", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const record = baseContentBlock();
    (record as any).localizedContent.ar.text = null;
    const file = baseFile([{ recordType: "contentBlock", record }]);
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    // Record is still structurally valid — missing localization is a
    // warning, not a rejection.
    expect(result?.records).toHaveLength(1);
    expect(diagnostics.some((d) => d.code === "missing-localization-ar" && d.severity === "warning")).toBe(
      true,
    );
  });

  it("rejects an invalid schemaVersion", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = { ...baseFile([]), schemaVersion: "1.0.0" };
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result).toBeNull();
    expect(diagnostics.some((d) => d.code === "invalid-schema-version")).toBe(true);
  });

  it("does not mutate the input record object", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const record = baseContentBlock();
    const snapshot = JSON.stringify(record);
    const file = baseFile([{ recordType: "contentBlock", record }]);
    validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(JSON.stringify(record)).toBe(snapshot);
  });
});

describe("validateTopicSet — topic count and order", () => {
  it("flags an unexpected topic count", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    validateTopicSet(["ch01-t02", "ch01-t03"], diagnostics);
    expect(diagnostics.some((d) => d.code === "unexpected-topic-count")).toBe(true);
  });

  it("flags an unexpected topic order", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    validateTopicSet(
      ["ch01-t02", "ch01-t01", "ch01-t03", "ch01-t04", "ch01-t08", "ch01-t10"] as any,
      diagnostics,
    );
    expect(diagnostics.some((d) => d.code === "unexpected-topic-order")).toBe(true);
  });

  it("flags the old (pre-Batch-1) four-topic-only order as an unexpected count, now that six topics are expected", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    validateTopicSet(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"] as any, diagnostics);
    expect(diagnostics.some((d) => d.code === "unexpected-topic-count")).toBe(true);
  });

  it("passes silently for the correct six-topic chapter-wide order", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    validateTopicSet(
      ["ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04", "ch01-t08", "ch01-t10"] as any,
      diagnostics,
    );
    expect(diagnostics).toEqual([]);
  });
});
