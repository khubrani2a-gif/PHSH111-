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

/** A synthetic slide-type contentBlock fixture — never real content. */
function baseSlideBlock(slideNumber: unknown, overrides: Record<string, unknown> = {}) {
  return baseContentBlock({
    blockId: `ch01-t02-block-slide-${String(slideNumber)}-${Math.random().toString(36).slice(2)}`,
    blockType: "slide",
    slideNumber,
    slideTitleEn: `Slide ${String(slideNumber)} Title`,
    slideTitleAr: `عنوان الشريحة ${String(slideNumber)}`,
    ...overrides,
  });
}

function slideRecords(...blocks: unknown[]) {
  return blocks.map((record) => ({ recordType: "contentBlock", record }));
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

describe("validateTopicFile — slide-number sequence and uniqueness (PR A, requirements 1-2)", () => {
  it("1. a valid contiguous 1..N sequence passes with no slide-sequence diagnostics", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1), baseSlideBlock(2), baseSlideBlock(3)));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(3);
    expect(diagnostics.some((d) => d.code === "duplicate-slide-number")).toBe(false);
    expect(diagnostics.some((d) => d.code === "non-sequential-slide-numbers")).toBe(false);
  });

  it("2. a duplicate slide number fails with topic ID, the duplicated number, and both block IDs", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1), baseSlideBlock(2), baseSlideBlock(2)));
    validateTopicFile(file, "ch01-t02", diagnostics, seen);
    const found = diagnostics.find((d) => d.code === "duplicate-slide-number");
    expect(found).toBeDefined();
    expect(found?.topicId).toBe("ch01-t02");
    expect(found?.message).toContain("2");
    expect(found?.message).toMatch(/block/i);
  });

  it("3. a missing number (gap) fails as non-sequential", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1), baseSlideBlock(2), baseSlideBlock(4)));
    validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(diagnostics.some((d) => d.code === "non-sequential-slide-numbers")).toBe(true);
  });

  it("4. a sequence starting above 1 fails", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(2), baseSlideBlock(3), baseSlideBlock(4)));
    validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(diagnostics.some((d) => d.code === "non-sequential-slide-numbers")).toBe(true);
  });

  it("5. slideNumber 0 fails (per-record malformed-slide check, before sequence validation ever runs)", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(0)));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide")).toBe(true);
  });

  it("6. a negative slideNumber fails", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(-1)));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide")).toBe(true);
  });

  it("7. a fractional slideNumber fails the existing per-record check (must be an integer)", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1.5)));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide")).toBe(true);
  });

  it("8. a non-number slideNumber fails the existing per-record check", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock("1")));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide")).toBe(true);
  });

  it("9. source records out of file order fail — sequence validation runs against file/encounter order, before any sort (e.g. slides authored 1, 3, 2)", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1), baseSlideBlock(3), baseSlideBlock(2)));
    validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(diagnostics.some((d) => d.code === "non-sequential-slide-numbers")).toBe(true);
  });

  it("a duplicated-then-repeated sequence (1, 1, 2) fails both the duplicate and the sequence checks", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1), baseSlideBlock(1), baseSlideBlock(2)));
    validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(diagnostics.some((d) => d.code === "duplicate-slide-number")).toBe(true);
    expect(diagnostics.some((d) => d.code === "non-sequential-slide-numbers")).toBe(true);
  });
});

describe("validateTopicFile — localized slide-title validation (PR A, requirement 3)", () => {
  it("10. valid English and Arabic titles pass with no malformed-slide diagnostic", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1)));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(1);
    expect(diagnostics.some((d) => d.code === "malformed-slide")).toBe(false);
  });

  it("11. a missing Arabic title (key absent) fails with topic ID, and block ID in context", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const record = baseSlideBlock(1);
    delete (record as Record<string, unknown>).slideTitleAr;
    const file = baseFile(slideRecords(record));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    const found = diagnostics.find((d) => d.code === "malformed-slide" && d.message.includes("slideTitleAr"));
    expect(found).toBeDefined();
    expect(found?.topicId).toBe("ch01-t02");
    expect(found?.recordId).toBe((record as Record<string, unknown>).blockId);
  });

  it("12. an empty-string Arabic title fails", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1, { slideTitleAr: "" })));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide" && d.message.includes("slideTitleAr"))).toBe(true);
  });

  it("13. a whitespace-only Arabic title fails", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1, { slideTitleAr: "   " })));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide" && d.message.includes("slideTitleAr"))).toBe(true);
  });

  it("14. a non-string Arabic title fails", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1, { slideTitleAr: 12345 })));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide" && d.message.includes("slideTitleAr"))).toBe(true);
  });

  it("15. the existing English-title failure (missing slideTitleEn) remains covered, unchanged", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const record = baseSlideBlock(1);
    delete (record as Record<string, unknown>).slideTitleEn;
    const file = baseFile(slideRecords(record));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide" && d.message.includes("slideTitleEn"))).toBe(true);
  });

  it("an empty-string English title still fails, exactly as before this PR (English behavior unchanged, not whitespace-trimmed)", () => {
    const diagnostics: AdapterDiagnostic[] = [];
    const seen = new Set<string>();
    const file = baseFile(slideRecords(baseSlideBlock(1, { slideTitleEn: "" })));
    const result = validateTopicFile(file, "ch01-t02", diagnostics, seen);
    expect(result?.records).toHaveLength(0);
    expect(diagnostics.some((d) => d.code === "malformed-slide" && d.message.includes("slideTitleEn"))).toBe(true);
  });
});
