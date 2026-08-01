import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const chapter = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../docs/content-design/chapter-01");
const englishPath = resolve(chapter, "batch2-drafts/ch01-t06-content.json");
const candidatePath = resolve(chapter, "batch2-arabic-drafts/ch01-t06-content.json");
const englishApprovalPath = resolve(chapter, "ENGLISH_CH01T06_BASELINE_APPROVAL.json");
const approvalPath = resolve(chapter, "ARABIC_CH01T06_BASELINE_APPROVAL.json");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const recordId = ({ record }: any) => record.instructorScriptId ?? record.blockId;

describe("ch01-t06 Arabic baseline approval", () => {
  const english = json(englishPath);
  const candidate = json(candidatePath);
  const englishApproval = json(englishApprovalPath);
  const approval = json(approvalPath);

  it("approves the exact four-record Arabic baseline and matching English source", () => {
    expect(approval.status).toBe("approved");
    expect(approval.language).toBe("Arabic");
    expect(approval.topicId).toBe("ch01-t06");
    expect(approval.approvedCandidateFiles[0]).toMatchObject({
      path: "docs/content-design/chapter-01/batch2-arabic-drafts/ch01-t06-content.json",
      sha256: sha256(candidatePath),
      recordCount: 4,
    });
    expect(approval.approvedRecordIds).toEqual(english.records.map(recordId));
    expect(candidate.records.map(recordId)).toEqual(english.records.map(recordId));
    expect(approval.englishBaselineDependency.sha256).toBe(sha256(englishPath));
    expect(approval.englishBaselineDependency.sha256).toBe(englishApproval.approvedDraftFiles[0].sha256);
  });

  it("retains the draft translations and all downstream restrictions", () => {
    expect(candidate.generationStatus).toBe("draft-batch2-arabic-candidate-generation");
    expect(approval.governanceRestrictions).toMatchObject({
      visualProductionNotAuthorized: true,
      slidesNotAuthorized: true,
      applicationIntegrationNotAuthorized: true,
      studentFacingAllowed: false,
      studentPublicationAuthorized: false,
    });
    for (const { record } of candidate.records) {
      expect(record.arabic.translationStatus).toBe("draft");
      expect(record.blocking.blockingStatus).toBe("blocked");
      expect(record.blocking.studentFacingAllowed).toBe(false);
    }
  });

  it("records the approved Arabic terminology and limited scientific scope", () => {
    expect(approval.glossaryDependency.mandatoryTermIds).toEqual([
      "ch01-term-speed", "ch01-term-velocity", "ch01-term-scalar", "ch01-term-vector",
    ]);
    expect(approval.arabicReviewFindings.result).toContain("constant-speed turn");
    expect(approval.downstreamStatus).toMatchObject({
      visualStatus: "notProduced, notAuthorized",
      slideStatus: "notProduced, notAuthorized",
      applicationIntegrationStatus: "notAuthorized",
      publicationStatus: "notAuthorized",
      studentFacingStatus: "notAllowed",
    });
  });
});
