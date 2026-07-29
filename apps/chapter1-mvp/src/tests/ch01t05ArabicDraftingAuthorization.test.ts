// Focused governance tests for PR G2A (governance/ch01-t05-arabic-drafting-authorization) —
// a governance-authorization-only PR that amends PILOT_AUTHORIZATION.json to grant a
// narrow Arabic candidate-draft authorization for ch01-t05, following the project
// owner's approval of ch01-t05's English baseline (PR G1A). This PR creates no Arabic
// content, slide, figure, application integration, routing/navigation change, or
// publication authorization — these tests exist purely to prove the new authorization
// section is internally consistent, correctly scoped, and that every governance
// invariant remains exactly as required. Node-side raw-file-read pattern, mirroring
// src/tests/ch01t05GovernanceCorrections.test.ts / src/tests/ch01t05EnglishBaselineApproval.test.ts.
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTER01_DIR = resolve(__dirname, "../../../../docs/content-design/chapter-01");

const AUTHORIZATION_PATH = resolve(CHAPTER01_DIR, "PILOT_AUTHORIZATION.json");
const BASELINE_PATH = resolve(CHAPTER01_DIR, "ENGLISH_CH01T05_BASELINE_APPROVAL.json");
const CORRECTIONS_PATH = resolve(CHAPTER01_DIR, "SCIENTIFIC_CORRECTIONS.json");
const CONTENT_PATH = resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t05-content.json");
const AR_PATH = resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t05-content.json");
const PILOT_PATH = resolve(CHAPTER01_DIR, "pilot/ch01-t05-content.json");

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const authorization = readJson(AUTHORIZATION_PATH);
const baseline = readJson(BASELINE_PATH);
const corrections = readJson(CORRECTIONS_PATH);
const grant = authorization.ch01T05ArabicGenerationAuthorization;

function findCorrection(id: string): any {
  const rec = corrections.records.find((r: any) => r.correctionId === id);
  expect(rec, `correction ${id} should exist`).toBeDefined();
  return rec;
}

describe("PR G2A — dedicated Arabic authorization exists and is scoped correctly", () => {
  it("1. a dedicated Arabic authorization exists for ch01-t05", () => {
    expect(grant).toBeDefined();
    expect(grant.authorizationStatus).toBe("granted");
    expect(grant.addedInVersion).toBe("1.8.0");
    expect(authorization.authorizationVersion).toBe("1.9.0");
  });

  it("2. it applies only to ch01-t05", () => {
    expect(grant.applicableTopicIds).toEqual(["ch01-t05"]);
  });

  it("3. it references the correct English baseline file", () => {
    expect(grant.prerequisites.englishBaselineApproved).toContain("ENGLISH_CH01T05_BASELINE_APPROVAL.json");
    expect(existsSync(BASELINE_PATH)).toBe(true);
    expect(baseline.topicId).toBe("ch01-t05");
  });

  it("4. it references the correct checksum", () => {
    const expectedChecksum = "894e8c65d997dbf35aceed06ce30cdbc44077693b8aa0af395bcbe0350bb8374";
    expect(grant.prerequisites.englishBaselineChecksum.sha256).toBe(expectedChecksum);
    expect(grant.packagingModel.immutableSourceFile).toContain(expectedChecksum);
    expect(baseline.approvedDraftFiles[0].sha256).toBe(expectedChecksum);
    expect(sha256(CONTENT_PATH)).toBe(expectedChecksum);
  });

  it("5. it requires exactly 8 records", () => {
    expect(grant.prerequisites.approvedRecordCount).toBe(8);
    expect(grant.translationScope.recordIds).toHaveLength(8);
    expect(grant.translationScope.recordIds).toEqual([
      "ch01-is-105",
      "ch01-t05-block-mainidea",
      "ch01-t05-block-explanation",
      "ch01-t05-block-equations",
      "ch01-t05-block-example",
      "ch01-t05-block-misconception",
      "ch01-t05-block-review",
      "ch01-prob-105",
    ]);
  });

  it("6. it authorizes only the Arabic candidate output path", () => {
    expect(grant.authorizedOutputPaths.primary).toContain(
      "docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t05-content.json",
    );
    expect(grant.authorizedOutputPaths.primary).toContain("NOT an authorized output path");
    expect(grant.packagingModel.authorizedCandidateFile).toBe(
      "docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t05-content.json",
    );
  });
});

describe("PR G2A — what this authorization does NOT authorize", () => {
  it("7. it does not authorize Arabic baseline approval", () => {
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("Arabic baseline approval")]),
    );
    expect(grant.publicationRestrictions.join(" ")).toContain("not an approved Arabic baseline");
  });

  it("8. it does not authorize slides", () => {
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("Creating slide records")]),
    );
  });

  it("9. it does not authorize figures", () => {
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("Creating figures, visual assets")]),
    );
  });

  it("10. it does not authorize application integration", () => {
    const prohibited = grant.prohibitedActions.join(" ");
    expect(prohibited).toContain("PilotTopicId");
    expect(prohibited).toContain("APP_TOPIC_ORDER");
    expect(prohibited).toContain("rawImports.ts");
    expect(prohibited).toContain("slideGroups.ts");
    expect(prohibited).toContain("slideShortTitles.ts");
    expect(prohibited).toContain("StructuredSlideContent.tsx");
  });

  it("11. it does not authorize routing/navigation changes", () => {
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("routing or navigation change")]),
    );
  });

  it("12. it does not authorize publication", () => {
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("Student-facing publication")]),
    );
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("Public deployment or deployment authorization")]),
    );
  });

  it("13. student-facing flags remain false", () => {
    expect(grant.publicationRestrictions.join(" ")).toContain(
      "studentFacingAllowed and studentPublicationAuthorized remain false",
    );
    expect(grant.blockingRequirements.studentFacingAllowed).toBe(false);
    expect(grant.blockingRequirements.blockingStatus).toBe("blocked");
  });

  it("14. ch01-corr-005 remains excluded", () => {
    const corr005 = findCorrection("ch01-corr-005");
    expect(corr005.approvalStatus).toBe("needsEvidence");
    expect(grant.prerequisites.boltExclusionConfirmed).toContain("needsEvidence");
    expect(grant.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("ch01-corr-005")]),
    );
  });

  it("15. Bolt-related content remains prohibited", () => {
    const prohibitedText = JSON.stringify(grant.prohibitedActions);
    expect(prohibitedText).toContain("Berlin 2009");
    expect(prohibitedText).toContain("Beijing 2008");
    expect(prohibitedText).toContain("9.58");
    expect(prohibitedText).toContain("9.69");
    expect(prohibitedText.toLowerCase()).toContain("bolt");
  });
});

describe("PR G2A — prerequisite corrections and existing scopes are unaffected", () => {
  it("prerequisite corrections ch01-corr-010/ch01-corr-011 remain editoriallyApproved", () => {
    expect(findCorrection("ch01-corr-010").approvalStatus).toBe("editoriallyApproved");
    expect(findCorrection("ch01-corr-011").approvalStatus).toBe("editoriallyApproved");
  });

  it("16. existing authorization scopes remain unchanged", () => {
    expect(authorization.scope.authorizedTopicIds).toEqual(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]);
    expect(authorization.applicationBuildAuthorization.applicableTopicIds).toEqual([
      "ch01-t02",
      "ch01-t03",
      "ch01-t08",
      "ch01-t10",
    ]);
    expect(authorization.batch1DraftingAuthorization.applicableTopicIds).toEqual(["ch01-t01", "ch01-t04"]);
    expect(authorization.batch1ArabicGenerationAuthorization.applicableTopicIds).toEqual(["ch01-t01", "ch01-t04"]);
    expect(authorization.ch01T05DraftingAuthorization.applicableTopicIds).toEqual(["ch01-t05"]);
  });

  it("17. the subsequently authorized Arabic output remains a blocked candidate draft", () => {
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

  it("internal application wiring exists without a pilot/ file or slides", () => {
    expect(existsSync(PILOT_PATH)).toBe(false);
    const schemaText = readFileSync(resolve(__dirname, "../types/pilotSchema.ts"), "utf8");
    const unionMatch = schemaText.match(/export type PilotTopicId =[\s\S]*?;/);
    expect(unionMatch![0]).toContain("ch01-t05");
    const orderMatch = schemaText.match(/export const APP_TOPIC_ORDER:[\s\S]*?\];/);
    expect(orderMatch![0]).toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/rawImports.ts"), "utf8")).toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/slideGroups.ts"), "utf8")).not.toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/slideShortTitles.ts"), "utf8")).not.toContain("ch01-t05");
    expect(
      readFileSync(resolve(__dirname, "../features/topics/StructuredSlideContent.tsx"), "utf8"),
    ).not.toContain("ch01-t05");
  });

  it("the English baseline file remains byte-identical to its recorded checksum (immutability check)", () => {
    expect(sha256(CONTENT_PATH)).toBe(baseline.approvedDraftFiles[0].sha256);
  });

  it("glossary requirements reference only existing approved terms, and no glossary file was modified", () => {
    expect(grant.glossaryEnforcement.mandatoryTermIds).toEqual([
      "ch01-term-speed",
      "ch01-term-distance",
      "ch01-term-scalar",
    ]);
    const glossary = readJson(resolve(CHAPTER01_DIR, "BILINGUAL_GLOSSARY.json"));
    expect(glossary.glossaryVersion).toBe("1.3.0");
    for (const termId of grant.glossaryEnforcement.mandatoryTermIds) {
      const term = glossary.terms.find((t: any) => t.termId === termId);
      expect(term, termId).toBeDefined();
      expect(term.approvalStatus, termId).toBe("approved");
    }
  });

  it("compound-phrase guidance covers average speed, instantaneous speed, total elapsed time, and speedometer", () => {
    const guidance = grant.glossaryEnforcement.compoundPhraseGuidance;
    expect(guidance.averageSpeed).toBeDefined();
    expect(guidance.instantaneousSpeed).toBeDefined();
    expect(guidance.totalElapsedTime).toBeDefined();
    expect(guidance.speedometer).toBeDefined();
  });

  it("blockingRequirements match the established Batch1 blocking convention", () => {
    expect(grant.blockingRequirements.blockingReason).toEqual(
      expect.arrayContaining(["translationPending", "scientificReviewPending", "editorialReviewPending"]),
    );
    expect(grant.blockingRequirements.resolutionStatus).toBe("open");
    expect(grant.blockingRequirements.instructorFacingAllowed).toBe(true);
  });

  it("authorizationHistory has a new 1.8.0 entry describing this grant", () => {
    const entry = authorization.authorizationHistory.find((h: any) => h.version === "1.8.0");
    expect(entry).toBeDefined();
    expect(entry.action).toBe("amended");
    expect(entry.summary).toContain("ch01-t05");
    expect(entry.summary.toLowerCase()).toContain("arabic");
  });
});
