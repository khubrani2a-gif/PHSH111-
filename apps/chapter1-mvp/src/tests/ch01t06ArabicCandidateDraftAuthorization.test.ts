import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const chapterDir = resolve(process.cwd(), "../../docs/content-design/chapter-01");
const authorization = JSON.parse(readFileSync(resolve(chapterDir, "PILOT_AUTHORIZATION.json"), "utf8"));
const glossary = JSON.parse(readFileSync(resolve(chapterDir, "BILINGUAL_GLOSSARY.json"), "utf8"));
const grant = authorization.ch01T06ArabicCandidateDraftAuthorization;
const englishBaselinePath = resolve(chapterDir, "batch2-drafts/ch01-t06-content.json");

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("ch01-t06 Arabic candidate-draft authorization", () => {
  it("authorizes only a four-record Arabic candidate for ch01-t06", () => {
    expect(authorization.authorizationVersion).toBe("1.12.0");
    expect(grant.authorizationStatus).toBe("granted");
    expect(grant.applicableTopicIds).toEqual(["ch01-t06"]);
    expect(grant.translationScope.recordIdsInRequiredOrder).toEqual([
      "ch01-is-106",
      "ch01-t06-block-mainidea",
      "ch01-t06-block-explanation",
      "ch01-t06-block-review",
    ]);
    expect(grant.translationScope.supportedConcepts).toHaveLength(4);
  });

  it("binds the immutable English baseline and the four approved terms", () => {
    expect(sha256(englishBaselinePath)).toBe(
      "b242fa01bcb5cfbedf4999536e7a557abf28ff6a3ed2751a3032e95048bd57f1",
    );
    expect(grant.prerequisites.englishBaselineChecksum.sha256).toBe(
      "b242fa01bcb5cfbedf4999536e7a557abf28ff6a3ed2751a3032e95048bd57f1",
    );
    expect(grant.prerequisites.approvedTerminology).toEqual({
      "ch01-term-speed": "السرعة",
      "ch01-term-velocity": "السرعة المتجهة",
      "ch01-term-scalar": "كمية قياسية",
      "ch01-term-vector": "كمية متجهة",
    });
    for (const [termId, text] of Object.entries(grant.prerequisites.approvedTerminology)) {
      const term = glossary.terms.find((entry: { termId: string }) => entry.termId === termId);
      expect(term).toMatchObject({
        approvalStatus: "approved",
        approvedArabicTerm: { text, status: "approved" },
      });
    }
    expect(glossary.terms.find((entry: { termId: string }) => entry.termId === "ch01-term-vector"))
      .toMatchObject({ topicIds: ["ch01-t06"] });
  });

  it("keeps every downstream capability blocked and excludes out-of-scope physics", () => {
    const prohibited = grant.prohibitedActions.join(" ").toLowerCase();
    for (const term of [
      "displacement", "equations", "calculations", "vector addition", "resultants",
      "graphs", "acceleration", "svg", "visualreference", "application integration", "slides",
      "publication", "student-facing",
    ]) expect(prohibited).toContain(term);
    expect(grant.publicationRestrictions).toEqual({
      studentFacingAllowed: false,
      studentPublicationAuthorized: false,
      applicationIntegrationAuthorized: false,
      arabicBaselineApproved: false,
      visualProductionAuthorized: false,
    });
  });
});
