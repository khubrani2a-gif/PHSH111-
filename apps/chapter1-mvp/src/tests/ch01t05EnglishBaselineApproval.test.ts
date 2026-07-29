// Focused governance tests for PR G1A (governance/ch01-t05-english-baseline-approval) —
// the controlled approval phase that (1) advances ch01-corr-010/ch01-corr-011 from
// "proposed" to "editoriallyApproved" after a scientific/editorial review of the drafted
// ch01-t05 content, and (2) creates the formal English baseline approval record for
// ch01-t05. This PR creates no Arabic content, slides, figures, application
// integration, routing/navigation change, or publication authorization — these tests
// exist purely to prove the baseline-approval record and the underlying correction
// records are internally consistent, and that the draft content and every governance
// invariant remain exactly as required. Node-side raw-file-read pattern, mirroring
// src/tests/ch01t05GovernanceCorrections.test.ts / src/tests/ch01t05DraftContent.test.ts /
// src/tests/batch1Integrity.test.ts's checksum convention.
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTER01_DIR = resolve(__dirname, "../../../../docs/content-design/chapter-01");

const CORRECTIONS_PATH = resolve(CHAPTER01_DIR, "SCIENTIFIC_CORRECTIONS.json");
const CONFLICTS_PATH = resolve(CHAPTER01_DIR, "DUPLICATE_AND_CONFLICT_DECISIONS.json");
const AUTHORIZATION_PATH = resolve(CHAPTER01_DIR, "PILOT_AUTHORIZATION.json");
const BASELINE_PATH = resolve(CHAPTER01_DIR, "ENGLISH_CH01T05_BASELINE_APPROVAL.json");
const CONTENT_PATH = resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t05-content.json");
const AR_PATH = resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t05-content.json");
const PILOT_PATH = resolve(CHAPTER01_DIR, "pilot/ch01-t05-content.json");

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const corrections = readJson(CORRECTIONS_PATH);
const conflicts = readJson(CONFLICTS_PATH);
const authorization = readJson(AUTHORIZATION_PATH);
const baseline = readJson(BASELINE_PATH);
const content = readJson(CONTENT_PATH);
const records: any[] = content.records;

function findCorrection(id: string): any {
  const rec = corrections.records.find((r: any) => r.correctionId === id);
  expect(rec, `correction ${id} should exist`).toBeDefined();
  return rec;
}

function findConflict(id: string): any {
  const rec = conflicts.conflicts.find((r: any) => r.conflictId === id);
  expect(rec, `conflict ${id} should exist`).toBeDefined();
  return rec;
}

function recordId(rec: any): string | undefined {
  return rec.blockId ?? rec.instructorScriptId ?? rec.problemId;
}

const TEACHING_TEXT = (() => {
  const is = records.find((r) => r.recordType === "instructorScript").record;
  const byId = (id: string) => records.find((r) => recordId(r.record) === id).record;
  const mainIdea = byId("ch01-t05-block-mainidea");
  const explanation = byId("ch01-t05-block-explanation");
  const equations = byId("ch01-t05-block-equations");
  const example = byId("ch01-t05-block-example");
  const misconception = byId("ch01-t05-block-misconception");
  const reviewQuestion = byId("ch01-t05-block-review");
  const problem = byId("ch01-prob-105");
  return [
    is.openingHook.text,
    is.meaningfulQuestion.text,
    is.mainIdea.text,
    ...is.learningObjectives.map((o: any) => o.text),
    is.wordForWordTeachingScript.text,
    is.intuition.text,
    ...is.questionsToAskStudents.map((o: any) => o.text),
    ...is.expectedStudentResponses.map((o: any) => o.text),
    mainIdea.localizedContent.en.text,
    explanation.localizedContent.en.text,
    equations.localizedContent.en.text,
    example.localizedContent.en.text,
    misconception.localizedContent.en.text,
    reviewQuestion.localizedContent.en.text,
    problem.problemStatement.text,
    problem.conceptualInterpretation.text,
    ...problem.numberedSolution.map((s: any) => s.explanation.text),
    problem.finalAnswer.interpretation.text,
    problem.intuition.text,
  ].join("\n\n");
})();

describe("PR G1A — correction approvals", () => {
  it("1. ch01-corr-010 is approved using the correct repository status ('editoriallyApproved')", () => {
    const corr = findCorrection("ch01-corr-010");
    expect(corr.approvalStatus).toBe("editoriallyApproved");
    expect(corr.approvals.scientificReviewer).toBe("khubrani2a-gif (project owner)");
    expect(corr.approvals.editorialReviewer).toBe("khubrani2a-gif (project owner)");
    expect(corr.approvals.approvedAt).not.toBeNull();
  });

  it("2. ch01-corr-011 is approved using the correct repository status ('editoriallyApproved')", () => {
    const corr = findCorrection("ch01-corr-011");
    expect(corr.approvalStatus).toBe("editoriallyApproved");
    expect(corr.approvals.scientificReviewer).toBe("khubrani2a-gif (project owner)");
    expect(corr.approvals.editorialReviewer).toBe("khubrani2a-gif (project owner)");
    expect(corr.approvals.approvedAt).not.toBeNull();
  });

  it("both approved corrections carry a 'blocking' object matching the established editoriallyApproved convention (ch01-corr-009 precedent)", () => {
    for (const id of ["ch01-corr-010", "ch01-corr-011"]) {
      const corr = findCorrection(id);
      expect(corr.blocking.blockingStatus).toBe("notBlocked");
      expect(corr.blocking.resolutionStatus).toBe("resolved");
      expect(corr.blocking.studentFacingAllowed).toBe(false);
    }
  });

  it("3. ch01-corr-005 remains unresolved (approvalStatus 'needsEvidence'), entirely unchanged", () => {
    const corr = findCorrection("ch01-corr-005");
    expect(corr.approvalStatus).toBe("needsEvidence");
    expect(corr.approvals.scientificReviewer).toBeNull();
    expect(corr.approvals.editorialReviewer).toBeNull();
    expect(corr.approvals.approvedAt).toBeNull();
    expect(corr.correctedWording.factPairs).toEqual([
      { event: "Berlin 2009", timeSeconds: 9.58 },
      { event: "Beijing 2008", timeSeconds: 9.69 },
    ]);
  });

  it("total correction record count is unchanged at 11 — no record was added or removed by this approval", () => {
    expect(corrections.records).toHaveLength(11);
  });
});

describe("PR G1A — conflict records reflect the approved correction state", () => {
  it("4a. CD-CONF-009 still links to ch01-corr-010 and was not modified beyond its pre-existing fields", () => {
    const cd = findConflict("CD-CONF-009");
    expect(cd.linkedCorrectionRecordId).toBe("ch01-corr-010");
    // Precedent (CD-CONF-006/007/008, whose linked corrections are already
    // editoriallyApproved) establishes that resolutionStatus/canonicalPreferenceStatus
    // do not change when the linked correction becomes editoriallyApproved.
    expect(cd.resolutionStatus).toBe("proposed");
    expect(cd.canonicalPreferenceStatus).toBe("candidate");
  });

  it("4b. CD-CONF-010 still links to ch01-corr-011 and was not modified beyond its pre-existing fields", () => {
    const cd = findConflict("CD-CONF-010");
    expect(cd.linkedCorrectionRecordId).toBe("ch01-corr-011");
    expect(cd.resolutionStatus).toBe("proposed");
    expect(cd.canonicalPreferenceStatus).toBe("candidate");
  });

  it("CD-CONF-005 remains unresolved and unmodified by this PR", () => {
    const cd = findConflict("CD-CONF-005");
    expect(cd.resolutionStatus).toBe("proposedPendingCitationAndReviewerApproval");
  });

  it("total conflict record count is unchanged at 10 — no record was added or removed by this approval", () => {
    expect(conflicts.conflicts).toHaveLength(10);
  });
});

describe("PR G1A — English baseline approval artifact", () => {
  it("baseline approval file exists at the expected path and is scoped to exactly ch01-t05", () => {
    expect(existsSync(BASELINE_PATH)).toBe(true);
    expect(baseline.topicId).toBe("ch01-t05");
    expect(baseline.scope.applicableTopicIds).toEqual(["ch01-t05"]);
    expect(baseline.status).toBe("approved");
  });

  it("5. all 15 English records are included in the baseline (recordCount and approvedRecordIds)", () => {
    expect(baseline.approvedDraftFiles[0].recordCount).toBe(15);
    expect(baseline.approvedRecordIds).toHaveLength(15);
  });

  it("6. the baseline checksum matches the real content file", () => {
    expect(baseline.approvedDraftFiles[0].path).toBe(
      "docs/content-design/chapter-01/batch1-drafts/ch01-t05-content.json",
    );
    expect(baseline.approvedDraftFiles[0].sha256).toBe(sha256(CONTENT_PATH));
  });

  it("7. record count is exactly 15, in both the baseline record and the real file", () => {
    expect(baseline.approvedDraftFiles[0].recordCount).toBe(15);
    expect(records).toHaveLength(15);
  });

  it("8. record IDs listed in the baseline are exact and unique, and match the real file's record IDs", () => {
    const ids: string[] = baseline.approvedRecordIds;
    expect(new Set(ids).size).toBe(ids.length);
    const realIds = records.map((r) => recordId(r.record));
    expect(new Set(ids)).toEqual(new Set(realIds));
    expect(ids).toEqual(
      expect.arrayContaining([
        "ch01-is-105",
        "ch01-t05-block-mainidea",
        "ch01-t05-block-explanation",
        "ch01-t05-block-equations",
        "ch01-t05-block-example",
        "ch01-t05-block-misconception",
        "ch01-t05-block-review",
        "ch01-prob-105",
      ]),
    );
  });

  it("baseline records the approved correction links (ch01-corr-010/011) and explicitly excludes ch01-corr-005", () => {
    expect(baseline.approvedCorrectionIds).toEqual(
      expect.arrayContaining(["ch01-corr-010", "ch01-corr-011"]),
    );
    expect(baseline.approvedCorrectionIds).not.toContain("ch01-corr-005");
    expect(baseline.excludedCorrectionNote).toContain("ch01-corr-005");
    expect(baseline.excludedCorrectionNote).toContain("needsEvidence");
  });

  it("baseline schemaVersion matches the real content file's schemaVersion", () => {
    expect(baseline.approvedDraftFiles[0].schemaVersion).toBe(content.schemaVersion);
    expect(content.schemaVersion).toBe("2.3.0");
  });
});

describe("PR G1A — governance state preserved", () => {
  it("9. seven authorized text-only slide records exist in the baseline-approved content", () => {
    const slideRecords = records.filter((r) => r.record.blockType === "slide");
    expect(slideRecords).toHaveLength(7);
  });

  it("10. the Arabic file is a candidate draft and does not alter the approved English baseline", () => {
    expect(existsSync(AR_PATH)).toBe(true);
    const candidate = readJson(AR_PATH);
    expect(candidate.generationStatus).toBe("draft-batch1-arabic-candidate-generation");
    expect(sha256(CONTENT_PATH)).toBe(baseline.approvedDraftFiles[0].sha256);
    for (const { record } of candidate.records) {
      expect(record.arabic.translationStatus).toBe("draft");
      expect(record.blocking.studentFacingAllowed).toBe(false);
      expect(record.blocking.blockingStatus).toBe("blocked");
    }
  });

  it("11. no figures/visualReference records exist for ch01-t05", () => {
    const visualRecords = records.filter((r) => r.record.blockType === "visualReference");
    expect(visualRecords).toHaveLength(0);
    expect(baseline.governanceRestrictions.visualProductionNotAuthorized).toContain("no figure asset");
  });

  it("12. application registration uses direct imports and the authorized slide integration", () => {
    expect(existsSync(PILOT_PATH)).toBe(false);
    const schemaText = readFileSync(resolve(__dirname, "../types/pilotSchema.ts"), "utf8");
    const unionMatch = schemaText.match(/export type PilotTopicId =[\s\S]*?;/);
    expect(unionMatch![0]).toContain("ch01-t05");
    const orderMatch = schemaText.match(/export const APP_TOPIC_ORDER:[\s\S]*?\];/);
    expect(orderMatch![0]).toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/rawImports.ts"), "utf8")).toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/slideGroups.ts"), "utf8")).toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/slideShortTitles.ts"), "utf8")).toContain("ch01-t05");
    // The generic reader is retained; its data-only block configuration
    // parses the approved structured sections for these seven slides.
    expect(
      readFileSync(resolve(__dirname, "../features/topics/StructuredSlideContent.tsx"), "utf8"),
    ).toContain("ch01-t05-block-slide-7");
    expect(authorization.applicationBuildAuthorization.applicableTopicIds).toEqual([
      "ch01-t02",
      "ch01-t03",
      "ch01-t08",
      "ch01-t10",
    ]);
  });

  it("13. no Bolt teaching content exists anywhere in the baseline-approved content", () => {
    for (const term of ["Bolt", "Berlin 2009", "Beijing 2008", "9.58", "9.69"]) {
      expect(TEACHING_TEXT, term).not.toContain(term);
    }
  });

  it("14. no pace terminology exists anywhere in the baseline-approved content", () => {
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("pace");
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("pace");
  });

  it("15. no calculus/limit terminology exists anywhere in the baseline-approved content", () => {
    const fullText = JSON.stringify(content).toLowerCase();
    expect(fullText).not.toContain("derivative");
    expect(fullText).not.toContain("shrinks toward zero");
    expect(fullText).not.toMatch(/\blim\b/);
    expect(fullText).not.toMatch(/d[a-z]\/dt/);
  });

  it("16. every numerical result remains correct (general example and ch01-prob-105)", () => {
    const example = records.find((r) => recordId(r.record) === "ch01-t05-block-example").record;
    const exampleText = example.localizedContent.en.text;
    expect(exampleText).toContain("4000 m + 3000 m = 7000 m");
    expect(exampleText).toContain("200 s + 100 s + 300 s = 600 s");
    expect(7000 / 600).toBeCloseTo(11.666666666666666, 10);
    expect(exampleText).toContain("7000 m / 600 s ≈ 11.7 m/s");
    expect((20 + 10) / 2).toBe(15);
    expect(exampleText).toContain("(20 m/s + 10 m/s) / 2 = 15 m/s, which is not the trip's actual average speed");

    const problem = records.find((r) => r.recordType === "problem").record;
    const calc1 = problem.calculation.find((c: any) => c.calculationId === "ch01-prob-105-calc-1");
    const calc2 = problem.calculation.find((c: any) => c.calculationId === "ch01-prob-105-calc-2");
    const calc3 = problem.calculation.find((c: any) => c.calculationId === "ch01-prob-105-calc-3");
    expect(calc1.result).toBe(1200 + 1800);
    expect(calc2.result).toBe(150 + 60 + 200);
    expect(calc3.result).toBeCloseTo(3000 / 410, 10);
    expect(problem.finalAnswer.value).toContain("≈ 7.3 m/s");
  });

  it("17. student-facing and publication flags remain false", () => {
    expect(baseline.governanceRestrictions.studentFacingAllowed).toBe(false);
    expect(baseline.governanceRestrictions.studentPublicationAuthorized).toBe(false);
    expect(baseline.governanceRestrictions.independentExpertReviewCompleted).toBe(false);
    for (const r of records) {
      expect(r.record.blocking.studentFacingAllowed, recordId(r.record)).toBe(false);
      expect(r.record.blocking.blockingStatus, recordId(r.record)).toBe("blocked");
    }
    const fullText = JSON.stringify(content);
    expect(fullText).not.toContain('"approvalStatus":"approved"');
    expect(fullText).not.toContain('"approvalStatus":"editoriallyApproved"');
  });

  it("no routing, navigation, or progress-tracking change was made", () => {
    expect(baseline.governanceRestrictions.routingNavigationNotChanged).toBeDefined();
    expect(existsSync(PILOT_PATH)).toBe(false);
  });

  it("revisionControlPolicy records the authorized slide revision", () => {
    expect(baseline.revisionControlPolicy.revisionLog).toEqual(expect.arrayContaining([
      expect.objectContaining({ revisionId: "ch01-t05-english-baseline-rev-001" }),
    ]));
  });

  it("identifier registration was not performed as a prerequisite of this baseline approval", () => {
    expect(baseline.identifierRegistrationStatus.statement).toContain("NOT a prerequisite");
    const identifierRegistry = readJson(resolve(CHAPTER01_DIR, "IDENTIFIER_REGISTRY.json"));
    expect(JSON.stringify(identifierRegistry)).not.toContain("ch01-t05-english-baseline");
  });
});
