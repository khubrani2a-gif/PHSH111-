import { describe, expect, it } from "vitest";
import { normalizeTopic, getTopic } from "../content/adapter";
import { PILOT_SCHEMA_VERSION } from "../types/pilotSchema";
import type { AdapterDiagnostic } from "../types/normalized";
import type { PilotTopicFile } from "../types/pilotSchema";

/**
 * Synthetic-fixture tests for reviewQuestion normalization/visibility
 * gating, mirroring src/tests/validate.test.ts's fixture pattern. Real
 * canonical data currently has reviewQuestion at visibility:"student" on
 * all four topics (see the real-data assertions at the bottom of this
 * file) — these synthetic fixtures exist specifically to prove the
 * instructor-only exclusion path, which no real topic currently exercises.
 */

function baseContentBlock(overrides: Record<string, unknown> = {}) {
  return {
    blockId: "ch01-t02-block-review",
    blockType: "reviewQuestion",
    topicId: "ch01-t02",
    visibility: "student",
    localizedContent: {
      en: { text: "Sample review question text.", status: "draft", language: "en", direction: "ltr" },
      ar: { text: "نص سؤال مراجعة تجريبي.", status: "draft", language: "ar", direction: "rtl" },
    },
    arabic: {
      originalArabicText: { text: null, status: "missing", language: "ar", direction: "rtl" },
      canonicalArabicTranslation: {
        text: "نص سؤال مراجعة تجريبي.",
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

function baseFile(records: unknown[]): PilotTopicFile {
  return {
    schemaVersion: PILOT_SCHEMA_VERSION,
    topicId: "ch01-t02",
    topicTitle: "Test Topic",
    topicTitleAr: "موضوع اختبار",
    generationStatus: "draft-pilot-generation",
    generationNote: "test fixture",
    records: records as PilotTopicFile["records"],
  };
}

describe("reviewQuestion normalization — synthetic fixtures", () => {
  it("places a learner-visible (student) reviewQuestion into topic.reviewQuestion, preserving its record ID and bilingual text", () => {
    const file = baseFile([{ recordType: "contentBlock", record: baseContentBlock() }]);
    const diagnostics: AdapterDiagnostic[] = [];
    const topic = normalizeTopic(file, "ch01-t02", diagnostics);

    expect(topic.reviewQuestion).toBeDefined();
    expect(topic.reviewQuestion?.recordId).toBe("ch01-t02-block-review");
    expect(topic.reviewQuestion?.text.en).toBe("Sample review question text.");
    expect(topic.reviewQuestion?.text.ar).toBe("نص سؤال مراجعة تجريبي.");
  });

  it("places a learner-visible (shared) reviewQuestion into topic.reviewQuestion too — isLearnerVisible accepts both shared and student", () => {
    const file = baseFile([
      { recordType: "contentBlock", record: baseContentBlock({ visibility: "shared" }) },
    ]);
    const topic = normalizeTopic(file, "ch01-t02", []);
    expect(topic.reviewQuestion).toBeDefined();
  });

  it("never places an instructor-only reviewQuestion into topic.reviewQuestion (learner flow) — it is routed to instructorNotes instead", () => {
    const file = baseFile([
      { recordType: "contentBlock", record: baseContentBlock({ visibility: "instructor" }) },
    ]);
    const topic = normalizeTopic(file, "ch01-t02", []);

    expect(topic.reviewQuestion).toBeUndefined();
    expect(topic.instructorNotes).toHaveLength(1);
    expect(topic.instructorNotes[0].blockType).toBe("reviewQuestion");
    expect(topic.instructorNotes[0].recordId).toBe("ch01-t02-block-review");
  });

  it("leaves topic.reviewQuestion undefined (not an empty section) when no reviewQuestion block exists at all — the section is omitted, never invented", () => {
    const file = baseFile([]);
    const topic = normalizeTopic(file, "ch01-t02", []);
    expect(topic.reviewQuestion).toBeUndefined();
  });

  it("preserves the source blocking/governance metadata on the normalized reviewQuestion section", () => {
    const file = baseFile([{ recordType: "contentBlock", record: baseContentBlock() }]);
    const topic = normalizeTopic(file, "ch01-t02", []);
    expect(topic.reviewQuestion?.blocking.studentFacingAllowed).toBe(false);
    expect(topic.reviewQuestion?.blocking.blockingStatus).toBe("blocked");
  });
});

describe("reviewQuestion — real canonical data (four pilot topics + Batch 1)", () => {
  const topicIds = ["ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04", "ch01-t08", "ch01-t10"] as const;

  it("every one of the six real topics currently has a learner-visible reviewQuestion with governance flags left false", () => {
    for (const topicId of topicIds) {
      const topic = getTopic(topicId);
      expect(topic?.reviewQuestion).toBeDefined();
      expect(topic?.reviewQuestion?.visibility).not.toBe("instructor");
      expect(topic?.reviewQuestion?.blocking.studentFacingAllowed).toBe(false);
      expect(topic?.reviewQuestion?.recordId).toBe(`${topicId}-block-review`);
    }
  });

  it("does not duplicate a learner-visible reviewQuestion into instructorNotes", () => {
    for (const topicId of topicIds) {
      const topic = getTopic(topicId);
      const reviewRecordId = topic?.reviewQuestion?.recordId;
      expect(topic?.instructorNotes.some((n) => n.recordId === reviewRecordId)).toBe(false);
    }
  });
});
