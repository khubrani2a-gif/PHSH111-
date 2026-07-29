import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const chapter = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../docs/content-design/chapter-01");
const englishPath = resolve(chapter, "batch1-drafts/ch01-t05-content.json");
const candidatePath = resolve(chapter, "batch1-arabic-drafts/ch01-t05-content.json");
const englishBaselinePath = resolve(chapter, "ENGLISH_CH01T05_BASELINE_APPROVAL.json");
const approvalPath = resolve(chapter, "ARABIC_CH01T05_BASELINE_APPROVAL.json");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const recordId = ({ record }: any) => record.instructorScriptId ?? record.blockId ?? record.problemId;

describe("ch01-t05 Arabic baseline approval", () => {
  const english = json(englishPath);
  const candidate = json(candidatePath);
  const englishBaseline = json(englishBaselinePath);
  const approval = json(approvalPath);

  it("approves only the exact eight-record Arabic candidate and frozen English source", () => {
    expect(approval.status).toBe("approved");
    expect(approval.language).toBe("Arabic");
    expect(approval.topicId).toBe("ch01-t05");
    expect(approval.scope.applicableTopicIds).toEqual(["ch01-t05"]);
    expect(approval.approvedCandidateFiles).toHaveLength(1);
    expect(approval.approvedCandidateFiles[0].sha256).toBe(sha256(candidatePath));
    expect(approval.approvedCandidateFiles[0].recordCount).toBe(8);
    expect(approval.englishBaselineDependency.sha256).toBe(sha256(englishPath));
    expect(sha256(englishPath)).toBe(englishBaseline.approvedDraftFiles[0].sha256);
    expect(candidate.records.map(recordId)).toEqual(english.records.map(recordId));
    expect(approval.approvedRecordIds).toEqual(english.records.map(recordId));
  });

  it("retains draft translations and all student/publication blocks", () => {
    expect(candidate.generationStatus).toBe("draft-batch1-arabic-candidate-generation");
    expect(approval.governanceRestrictions.studentFacingAllowed).toBe(false);
    expect(approval.governanceRestrictions.studentPublicationAuthorized).toBe(false);
    for (const { record } of candidate.records) {
      expect(record.arabic.translationStatus).toBe("draft");
      expect(record.blocking.blockingStatus).toBe("blocked");
      expect(record.blocking.studentFacingAllowed).toBe(false);
    }
  });

  it("records the required scientific and Arabic-review safeguards", () => {
    const findings = approval.arabicReviewFindings.result;
    expect(findings).toContain("3000 m");
    expect(findings).toContain("410 s");
    expect(findings).toContain("9.5 m/s");
    expect(findings).toContain("40 km/h");
    expect(approval.glossaryDependency.mandatoryTermIds).toEqual([
      "ch01-term-speed", "ch01-term-distance", "ch01-term-scalar",
    ]);
    const teachingArabic = candidate.records
      .map(({ record }: any) => record.localizedContent?.ar?.text ?? record.arabic.canonicalArabicTranslation.text)
      .join(" ");
    expect(teachingArabic).not.toMatch(/Bolt|بولت|Berlin 2009|Beijing 2008|9\.58|9\.69/i);
  });

  it("does not authorize application integration, visuals, or publication", () => {
    const restrictions = approval.governanceRestrictions;
    expect(restrictions.visualProductionNotAuthorized).toContain("No visualReference");
    expect(restrictions.applicationIntegrationNotAuthorized).toContain("PilotTopicId");
    expect(restrictions.applicationIntegrationNotAuthorized).toContain("APP_TOPIC_ORDER");
    expect(approval.downstreamStatus.applicationIntegrationStatus).toBe("notAuthorized");
    expect(approval.downstreamStatus.publicationStatus).toBe("notAuthorized");
  });
});
