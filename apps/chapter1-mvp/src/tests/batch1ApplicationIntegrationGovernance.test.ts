// Governance-consistency tests for content-audit findings F-03 and F-15 —
// both corrections to stale application-integration metadata only (no
// instructional or translated content). Node-side raw-file-read pattern,
// mirroring src/tests/batch1Integrity.test.ts: reads the real governance
// and content JSON files directly (not through the runtime adapter, since
// generationNote/downstreamStatus/governanceRestrictions are not exposed
// on NormalizedSlide) and asserts against the actual current repository
// state, not hard-coded audit-era values.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTER01_DIR = resolve(__dirname, "../../../../docs/content-design/chapter-01");

const PILOT_AUTHORIZATION_PATH = resolve(CHAPTER01_DIR, "PILOT_AUTHORIZATION.json");
const ENGLISH_BASELINE_PATH = resolve(CHAPTER01_DIR, "ENGLISH_BATCH1_BASELINE_APPROVAL.json");
const ARABIC_BASELINE_PATH = resolve(CHAPTER01_DIR, "ARABIC_BATCH1_BASELINE_APPROVAL.json");
const ENGLISH_T01_PATH = resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t01-content.json");
const ARABIC_T01_PATH = resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t01-content.json");

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

const STALE_APPLICATION_INTEGRATION_CLAIMS = [
  "not mechanically possible",
  "is NOT read by apps/chapter1-mvp",
  "not application-facing content",
];

describe("F-03 — PILOT_AUTHORIZATION.json is the authority for internal application integration", () => {
  const pilotAuthorization = readJson(PILOT_AUTHORIZATION_PATH);

  it("contains a batch1ApplicationIntegrationAuthorization record", () => {
    expect(pilotAuthorization.batch1ApplicationIntegrationAuthorization).toBeDefined();
    expect(typeof pilotAuthorization.batch1ApplicationIntegrationAuthorization).toBe("object");
  });

  it("its applicableTopicIds include ch01-t01", () => {
    const applicableTopicIds = pilotAuthorization.batch1ApplicationIntegrationAuthorization.applicableTopicIds;
    expect(Array.isArray(applicableTopicIds)).toBe(true);
    expect(applicableTopicIds).toContain("ch01-t01");
  });

  it("its scopeNote confirms this authorization is internal/QA-only, not student-facing publication", () => {
    const scopeNote: string = pilotAuthorization.batch1ApplicationIntegrationAuthorization.scopeNote;
    expect(scopeNote).toMatch(/INTERNAL APPLICATION INTEGRATION AND QA/i);
    expect(scopeNote).toMatch(/does not authorize student-facing release, public deployment, or publication/i);
  });
});

describe("F-03 — English baseline-approval metadata no longer claims integration is impossible", () => {
  const englishBaseline = readJson(ENGLISH_BASELINE_PATH);
  const applicationIntegrationStatus: string = englishBaseline.downstreamStatus.applicationIntegrationStatus;

  it("does not contain any stale claim that integration is not mechanically possible or cannot be integrated", () => {
    for (const stale of STALE_APPLICATION_INTEGRATION_CLAIMS) {
      expect(applicationIntegrationStatus.toLowerCase()).not.toContain(stale.toLowerCase());
    }
    expect(applicationIntegrationStatus).not.toMatch(/not mechanically possible/i);
    expect(applicationIntegrationStatus).not.toMatch(/cannot be integrated/i);
  });

  it("now states internal application integration is authorized, referencing PILOT_AUTHORIZATION.json's batch1ApplicationIntegrationAuthorization", () => {
    expect(applicationIntegrationStatus).toMatch(/internally authorized/i);
    expect(applicationIntegrationStatus).toContain("PILOT_AUTHORIZATION.json");
    expect(applicationIntegrationStatus).toContain("batch1ApplicationIntegrationAuthorization");
  });

  it("references the actual current authorization version and date recorded in PILOT_AUTHORIZATION.json", () => {
    const pilotAuthorization = readJson(PILOT_AUTHORIZATION_PATH);
    const auth = pilotAuthorization.batch1ApplicationIntegrationAuthorization;
    expect(applicationIntegrationStatus).toContain(auth.addedInVersion);
    expect(applicationIntegrationStatus).toContain(auth.authorizedAt);
  });

  it("is scoped to internal/QA integration only, and states student-facing publication remains separately unauthorized", () => {
    expect(applicationIntegrationStatus).toMatch(/internal\/QA/i);
    expect(applicationIntegrationStatus).toMatch(/student.?facing publication remains separately unauthorized/i);
  });

  it("references rawImports.ts as the integration mechanism", () => {
    expect(applicationIntegrationStatus).toContain("src/content/rawImports.ts");
  });
});

describe("F-03 — Arabic baseline-approval metadata is consistent with the same authorization state", () => {
  const arabicBaseline = readJson(ARABIC_BASELINE_PATH);
  const applicationIntegrationAuthorized = arabicBaseline.governanceRestrictions.applicationIntegrationAuthorized;

  it("no longer implies application integration is flatly unauthorized (not a bare false)", () => {
    expect(applicationIntegrationAuthorized).not.toBe(false);
    expect(typeof applicationIntegrationAuthorized).toBe("string");
  });

  it("states internal application integration is authorized, referencing PILOT_AUTHORIZATION.json's batch1ApplicationIntegrationAuthorization", () => {
    expect(applicationIntegrationAuthorized).toMatch(/internally authorized/i);
    expect(applicationIntegrationAuthorized).toContain("PILOT_AUTHORIZATION.json");
    expect(applicationIntegrationAuthorized).toContain("batch1ApplicationIntegrationAuthorization");
  });

  it("is scoped to internal/QA integration only, and preserves the distinction from student-facing publication", () => {
    expect(applicationIntegrationAuthorized).toMatch(/internal\/QA/i);
    expect(applicationIntegrationAuthorized).toMatch(/student.?facing publication remains separately unauthorized/i);
  });

  it("does not contain any stale claim that integration is not mechanically possible", () => {
    for (const stale of STALE_APPLICATION_INTEGRATION_CLAIMS) {
      expect(applicationIntegrationAuthorized.toLowerCase()).not.toContain(stale.toLowerCase());
    }
  });
});

describe("F-15 — English content file's generationNote no longer claims the file is unread by the application", () => {
  const englishT01 = readJson(ENGLISH_T01_PATH);
  const generationNote: string = englishT01.generationNote;

  it("does not contain the stale 'is NOT read by apps/chapter1-mvp' or 'not application-facing content' claims", () => {
    expect(generationNote).not.toMatch(/is NOT read by apps\/chapter1-mvp/i);
    expect(generationNote).not.toMatch(/not application-facing content/i);
  });

  it("now states the file is read by apps/chapter1-mvp/ under PILOT_AUTHORIZATION.json's batch1ApplicationIntegrationAuthorization, for internal/QA integration only", () => {
    expect(generationNote).toMatch(/is read by apps\/chapter1-mvp/i);
    expect(generationNote).toContain("batch1ApplicationIntegrationAuthorization");
    expect(generationNote).toMatch(/internal\/QA/i);
  });

  it("still clearly states the file is not authorized for student-facing use", () => {
    expect(generationNote).toMatch(/not authorized for student-facing use/i);
  });

  it("still preserves the controlled-draft-artifact governance wording", () => {
    expect(generationNote).toMatch(/controlled draft artifact/i);
    expect(generationNote).toMatch(/not an approved canonical baseline/i);
  });
});

describe("F-15 — Arabic content file's generationNote no longer claims the file is unread by the application", () => {
  const arabicT01 = readJson(ARABIC_T01_PATH);
  const generationNote: string = arabicT01.generationNote;

  it("does not contain the stale 'is NOT read by apps/chapter1-mvp' or 'not application-facing content' claims", () => {
    expect(generationNote).not.toMatch(/is NOT read by apps\/chapter1-mvp/i);
    expect(generationNote).not.toMatch(/not application-facing content/i);
  });

  it("now states the file is read by apps/chapter1-mvp/ under PILOT_AUTHORIZATION.json's batch1ApplicationIntegrationAuthorization, for internal/QA integration only", () => {
    expect(generationNote).toMatch(/is read by apps\/chapter1-mvp/i);
    expect(generationNote).toContain("batch1ApplicationIntegrationAuthorization");
    expect(generationNote).toMatch(/internal\/QA/i);
  });

  it("still clearly states the file is not authorized for student-facing use", () => {
    expect(generationNote).toMatch(/not authorized for student-facing use/i);
  });

  it("still preserves the controlled-candidate-draft-artifact governance wording", () => {
    expect(generationNote).toMatch(/controlled candidate-draft artifact/i);
  });
});

describe("Publication, blocking, and review governance states are unaffected by F-03/F-15", () => {
  const englishBaseline = readJson(ENGLISH_BASELINE_PATH);
  const arabicBaseline = readJson(ARABIC_BASELINE_PATH);
  const englishT01 = readJson(ENGLISH_T01_PATH);
  const arabicT01 = readJson(ARABIC_T01_PATH);

  it("English baseline-approval governanceRestrictions: studentFacingAllowed and studentPublicationAuthorized remain false", () => {
    expect(englishBaseline.governanceRestrictions.studentFacingAllowed).toBe(false);
    expect(englishBaseline.governanceRestrictions.studentPublicationAuthorized).toBe(false);
    expect(englishBaseline.governanceRestrictions.independentExpertReviewCompleted).toBe(false);
  });

  it("Arabic baseline-approval governanceRestrictions: studentFacingAllowed and studentPublicationAuthorized remain false", () => {
    expect(arabicBaseline.governanceRestrictions.studentFacingAllowed).toBe(false);
    expect(arabicBaseline.governanceRestrictions.studentPublicationAuthorized).toBe(false);
    expect(arabicBaseline.governanceRestrictions.independentHumanReviewCompleted).toBe(false);
  });

  it("English downstreamStatus: scientific and translation review states remain pending/unchanged", () => {
    expect(englishBaseline.downstreamStatus.independentExpertReviewStatus).toBe("notCompleted");
    expect(englishBaseline.downstreamStatus.publicationStatus).toBe("notAuthorized");
  });

  it("every ch01-t01 record's blocking state is unchanged: still blocked, still not student-facing", () => {
    for (const envelope of englishT01.records) {
      if (envelope.recordType !== "contentBlock" && envelope.recordType !== "problem") continue;
      const blocking = envelope.record.blocking;
      if (!blocking) continue;
      expect(blocking.studentFacingAllowed).toBe(false);
    }
  });

  it("every ch01-t01 Arabic record's translationStatus remains a draft state (never 'approved')", () => {
    for (const envelope of arabicT01.records) {
      if (envelope.recordType !== "contentBlock" && envelope.recordType !== "problem") continue;
      const arabic = envelope.record.arabic;
      if (!arabic) continue;
      expect(["draft", "draft-ai-generated-unreviewed"]).toContain(arabic.translationStatus);
    }
  });
});

describe("No instructional or translated content changed by F-03/F-15", () => {
  const englishT01 = readJson(ENGLISH_T01_PATH);
  const arabicT01 = readJson(ARABIC_T01_PATH);

  it("English ch01-t01 record count is unchanged (20 records)", () => {
    expect(englishT01.records.length).toBe(20);
  });

  it("Arabic ch01-t01 record count is unchanged (20 records)", () => {
    expect(arabicT01.records.length).toBe(20);
  });

  it("English and Arabic record IDs/order remain identical", () => {
    const idOf = (r: any) => r.record.blockId ?? r.record.instructorScriptId ?? r.record.problemId;
    expect(arabicT01.records.map(idOf)).toEqual(englishT01.records.map(idOf));
  });

  it("Slide 13's Original English subsection is byte-for-byte unchanged", () => {
    const slide13 = englishT01.records.find((r: any) => r.record.blockId === "ch01-t01-block-opening-13");
    expect(slide13.record.localizedContent.en.text).toContain(
      "When you pull it along and speed it up or slow it down, you are experiencing its mass.",
    );
  });

  it("Slide 8's Arabic Key Concept correction (F-01) is still present, unaffected by this PR", () => {
    const slide8 = arabicT01.records.find((r: any) => r.record.blockId === "ch01-t01-block-opening-8");
    expect(slide8.record.localizedContent.ar.text).toContain("من خلال عدّ الدورات المنتظمة المتكررة");
  });

  it("Slide 13's F-02 constant-velocity/friction clarification is still present, unaffected by this PR", () => {
    const slide13 = englishT01.records.find((r: any) => r.record.blockId === "ch01-t01-block-opening-13");
    expect(slide13.record.localizedContent.en.text).toContain(
      "At a constant pulling speed, the net horizontal force is zero",
    );
  });

  it("schemaVersion and topicTitle remain unchanged and identical between English and Arabic files", () => {
    expect(englishT01.schemaVersion).toBe("2.3.0");
    expect(arabicT01.schemaVersion).toBe("2.3.0");
    expect(arabicT01.topicTitle).toBe(englishT01.topicTitle);
  });
});

describe("Checksums and baseline versions match the actual current files", () => {
  it("ENGLISH_BATCH1_BASELINE_APPROVAL.json's ch01-t01 sha256 matches the real file's current bytes", () => {
    const englishBaseline = readJson(ENGLISH_BASELINE_PATH);
    const entry = englishBaseline.approvedDraftFiles.find((f: any) => f.topicId === "ch01-t01");
    const actual = createHash("sha256").update(readFileSync(ENGLISH_T01_PATH)).digest("hex");
    expect(entry.sha256).toBe(actual);
  });

  it("ARABIC_BATCH1_BASELINE_APPROVAL.json's ch01-t01 sha256 matches the real file's current bytes", () => {
    const arabicBaseline = readJson(ARABIC_BASELINE_PATH);
    const entry = arabicBaseline.approvedCandidateFiles.find((f: any) => f.topicId === "ch01-t01");
    const actual = createHash("sha256").update(readFileSync(ARABIC_T01_PATH)).digest("hex");
    expect(entry.sha256).toBe(actual);
  });

  it("English baselineVersion was bumped and matches the newest revisionLog entry's toVersion", () => {
    const englishBaseline = readJson(ENGLISH_BASELINE_PATH);
    const revisionLog = englishBaseline.revisionControlPolicy.revisionLog;
    const latest = revisionLog[revisionLog.length - 1];
    expect(englishBaseline.baselineVersion).toBe(latest.toVersion);
    expect(latest.revisionId).toBe("ch01-english-baseline-rev-026");
  });

  it("Arabic baselineVersion was bumped and matches the newest revisionLog entry's toVersion", () => {
    const arabicBaseline = readJson(ARABIC_BASELINE_PATH);
    const revisionLog = arabicBaseline.revisionControlPolicy.revisionLog;
    const latest = revisionLog[revisionLog.length - 1];
    expect(arabicBaseline.baselineVersion).toBe(latest.toVersion);
    expect(latest.revisionId).toBe("ch01-arabic-baseline-rev-026");
  });

  it("the newest revisionLog entries on both files explicitly disclaim instructional/translation content changes", () => {
    const englishBaseline = readJson(ENGLISH_BASELINE_PATH);
    const arabicBaseline = readJson(ARABIC_BASELINE_PATH);
    const latestEn = englishBaseline.revisionControlPolicy.revisionLog.at(-1);
    const latestAr = arabicBaseline.revisionControlPolicy.revisionLog.at(-1);
    for (const entry of [latestEn, latestAr]) {
      expect(entry.scope).toMatch(/No instructional content changed/i);
      expect(entry.scope).toMatch(/No translation content changed/i);
      expect(entry.scope).toMatch(/No equation, table, figure, alt text, or slide order changed/i);
      expect(entry.scope).toMatch(/Publication authorization remains false/i);
    }
  });
});
