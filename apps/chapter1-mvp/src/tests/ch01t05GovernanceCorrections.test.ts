// Governance-consistency tests for PR G0 (governance/ch01-t05-corrections-authorization) —
// a governance-and-scientific-corrections-only PR. No student-facing content,
// slide, or application file is created by this PR; these tests exist purely
// to prove the correction/conflict/authorization records are internally
// consistent and that publication restrictions were preserved. Node-side
// raw-file-read pattern, mirroring src/tests/batch1ApplicationIntegrationGovernance.test.ts:
// reads the real governance JSON files directly (not through the runtime
// adapter, since none of this is topic content the adapter loads) and
// asserts against the actual current repository state.
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTER01_DIR = resolve(__dirname, "../../../../docs/content-design/chapter-01");

const CORRECTIONS_PATH = resolve(CHAPTER01_DIR, "SCIENTIFIC_CORRECTIONS.json");
const CONFLICTS_PATH = resolve(CHAPTER01_DIR, "DUPLICATE_AND_CONFLICT_DECISIONS.json");
const AUTHORIZATION_PATH = resolve(CHAPTER01_DIR, "PILOT_AUTHORIZATION.json");

function readJson(path: string): any {
  return JSON.parse(readFileSync(path, "utf8"));
}

const corrections = readJson(CORRECTIONS_PATH);
const conflicts = readJson(CONFLICTS_PATH);
const authorization = readJson(AUTHORIZATION_PATH);

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

describe("PR G0 — ch01-corr-005 (Usain Bolt citation-pairing) evidence and status", () => {
  const corr005 = findCorrection("ch01-corr-005");

  it("1a. ch01-corr-005 remains approvalStatus 'needsEvidence' (not approved, not proposed)", () => {
    expect(corr005.approvalStatus).toBe("needsEvidence");
  });

  it("1b. ch01-corr-005 carries an improved, actionable evidence-gap statement", () => {
    expect(typeof corr005.evidenceGapDetail).toBe("string");
    expect(corr005.evidenceGapDetail.length).toBeGreaterThan(50);
    expect(corr005.evidenceGapDetail).toContain("primary");
  });

  it("1c. ch01-corr-005 explicitly classifies the Bolt example as an average-speed example, not instantaneous", () => {
    expect(corr005.exampleClassification).toContain("average-speed example");
    expect(corr005.exampleClassification).toContain("not an instantaneous-speed example");
  });

  it("2. neither Bolt event/time pairing is marked approved anywhere in the correction record", () => {
    expect(corr005.approvalStatus).not.toBe("approved");
    expect(corr005.approvalStatus).not.toBe("editoriallyApproved");
    expect(corr005.approvals.scientificReviewer).toBeNull();
    expect(corr005.approvals.editorialReviewer).toBeNull();
    expect(corr005.approvals.approvedAt).toBeNull();
  });

  it("both candidate fact pairs remain recorded, without either being singled out as canonical", () => {
    const pairs = corr005.correctedWording.factPairs;
    expect(pairs).toHaveLength(2);
    expect(pairs.map((p: any) => p.event)).toEqual(["Berlin 2009", "Beijing 2008"]);
    expect(corr005.correctedWording.en).toContain("Do not combine the Berlin event label with the Beijing time");
  });

  it("studentFacingSuppression remains true", () => {
    expect(corr005.studentFacingSuppression).toBe(true);
  });
});

describe("PR G0 — SCA06/SCA07 explicit correction records", () => {
  it("3. SCA06 has an explicit correction record (ch01-corr-010)", () => {
    const corr010 = findCorrection("ch01-corr-010");
    expect(corr010.scientificAuditRecordIds).toContain("SCA06");
    expect(corr010.topicIds).toEqual(["ch01-t05"]);
  });

  it("4. SCA07 has an explicit correction record (ch01-corr-011)", () => {
    const corr011 = findCorrection("ch01-corr-011");
    expect(corr011.scientificAuditRecordIds).toContain("SCA07");
    expect(corr011.topicIds).toEqual(["ch01-t05"]);
  });

  it("neither new correction is self-approved by Claude — both remain 'proposed' pending real reviewer sign-off", () => {
    for (const id of ["ch01-corr-010", "ch01-corr-011"]) {
      const corr = findCorrection(id);
      expect(corr.approvalStatus).toBe("proposed");
      expect(corr.approvals.scientificReviewer).toBeNull();
      expect(corr.approvals.editorialReviewer).toBeNull();
      expect(corr.approvals.approvedAt).toBeNull();
      expect(corr.studentFacingSuppression).toBe(true);
    }
  });

  it("both new corrections carry non-empty scientificAuditRecordIds and conflictRecordIds, per this file's own validationRules", () => {
    for (const id of ["ch01-corr-010", "ch01-corr-011"]) {
      const corr = findCorrection(id);
      expect(corr.scientificAuditRecordIds.length).toBeGreaterThan(0);
      expect(corr.conflictRecordIds.length).toBeGreaterThan(0);
    }
    expect(corrections.validationRules).toContain("scientificAuditRecordIds must be non-empty");
    expect(corrections.validationRules).toContain("conflictRecordIds must be non-empty");
  });

  it("both new corrections disclose that SCA06/SCA07's own raw audit text is not present in this repository", () => {
    for (const id of ["ch01-corr-010", "ch01-corr-011"]) {
      const corr = findCorrection(id);
      expect(corr.provenanceNote).toContain("not present anywhere in this repository");
    }
  });
});

describe("PR G0 — required scientific principles (average speed, instantaneous speed, stops, distance)", () => {
  const corr010 = findCorrection("ch01-corr-010");
  const corr011 = findCorrection("ch01-corr-011");

  it("5. average speed is defined as total distance divided by total elapsed time", () => {
    expect(corr010.correctedWording.en).toContain(
      "average speed = total distance / total elapsed time",
    );
  });

  it("6. arithmetic averaging of speeds is not presented as the general rule", () => {
    expect(corr010.correctedWording.en).toContain(
      "not, in general, the same as the arithmetic mean of the speed values",
    );
    expect(corr010.correctedWording.en).toContain(
      "gives the correct average speed only in the special case where each speed was maintained for an equal time interval",
    );
  });

  it("7. instantaneous speed is explicitly distinguished from average speed", () => {
    expect(corr011.correctedWording.en).toContain("Instantaneous speed is the speed of an object at one particular moment");
    expect(corr011.correctedWording.en).toContain("average speed is the total distance traveled divided by the total elapsed time");
  });

  it("8. a speedometer is described as an approximate instantaneous display, never as the whole-trip average", () => {
    expect(corr011.correctedWording.en).toContain("A speedometer displays an approximate instantaneous speed");
    expect(corr011.correctedWording.en).toContain(
      "it does not display, and cannot be read as, the average speed for the whole journey",
    );
  });

  it("9. total elapsed time is stated to include stops unless a problem asks for moving-time-only average speed", () => {
    expect(corr010.correctedWording.en).toContain("Total elapsed time includes stops, waiting, and pauses");
    expect(corr010.correctedWording.en).toContain("unless a problem explicitly asks for average speed while moving only");
  });

  it("10. average speed is stated to use total distance (path length), not displacement", () => {
    expect(corr010.correctedWording.en).toContain("Total distance means total path length actually traveled, not displacement");
    expect(corr010.correctedWording.en).toContain("returning to a starting point does not make total distance, or average speed, zero");
  });

  it("no calculus or limit notation is introduced for instantaneous speed", () => {
    const text = corr011.correctedWording.en.toLowerCase();
    expect(text).not.toContain("lim");
    expect(text).not.toContain("derivative");
    expect(text).not.toMatch(/d[a-z]\/dt/);
  });
});

describe("PR G0 — CD-CONF-005/009/010 conflict-record links", () => {
  it("11a. CD-CONF-005 links to ch01-corr-005 and records resolved/unresolved aspects without marking itself resolved", () => {
    const cd005 = findConflict("CD-CONF-005");
    expect(cd005.linkedCorrectionRecordId).toBe("ch01-corr-005");
    expect(typeof cd005.resolvedAspects).toBe("string");
    expect(typeof cd005.unresolvedAspects).toBe("string");
    expect(cd005.resolutionStatus).not.toBe("resolved");
    expect(cd005.preferredSourceRecordId).toBeNull();
  });

  it("11b. CD-CONF-009 links to ch01-corr-010 (SCA06)", () => {
    const cd009 = findConflict("CD-CONF-009");
    expect(cd009.linkedCorrectionRecordId).toBe("ch01-corr-010");
    expect(cd009.scientificAuditRecordIds).toContain("SCA06");
  });

  it("11c. CD-CONF-010 links to ch01-corr-011 (SCA07)", () => {
    const cd010 = findConflict("CD-CONF-010");
    expect(cd010.linkedCorrectionRecordId).toBe("ch01-corr-011");
    expect(cd010.scientificAuditRecordIds).toContain("SCA07");
  });

  it("every ch01-corr-01x's conflictRecordIds resolve to a real conflict record in this file", () => {
    const conflictIds = new Set(conflicts.conflicts.map((c: any) => c.conflictId));
    for (const id of ["ch01-corr-005", "ch01-corr-010", "ch01-corr-011"]) {
      const corr = findCorrection(id);
      for (const cid of corr.conflictRecordIds) {
        expect(conflictIds.has(cid), `${id} -> ${cid}`).toBe(true);
      }
    }
  });
});

describe("PR G0 — ch01-t05 drafting authorization in PILOT_AUTHORIZATION.json", () => {
  it("12a. authorizationVersion was bumped and ch01T05DraftingAuthorization exists", () => {
    expect(authorization.authorizationVersion).toBe("1.7.0");
    expect(authorization.ch01T05DraftingAuthorization).toBeDefined();
  });

  it("12b. the authorization applies to exactly ch01-t05", () => {
    expect(authorization.ch01T05DraftingAuthorization.applicableTopicIds).toEqual(["ch01-t05"]);
  });

  it("12c. the authorization's prerequisite corrections are ch01-corr-010 and ch01-corr-011, not ch01-corr-005", () => {
    expect(authorization.ch01T05DraftingAuthorization.prerequisiteCorrectionIds).toEqual([
      "ch01-corr-010",
      "ch01-corr-011",
    ]);
    expect(authorization.ch01T05DraftingAuthorization.prerequisiteCorrectionIds).not.toContain("ch01-corr-005");
  });

  it("12d. the authorization explicitly excludes ch01-corr-005-dependent content (the Bolt example)", () => {
    expect(authorization.ch01T05DraftingAuthorization.excludedFromThisAuthorization).toContain("ch01-corr-005");
    expect(authorization.ch01T05DraftingAuthorization.prohibitedActions).toEqual(
      expect.arrayContaining([expect.stringContaining("Usain Bolt")]),
    );
  });

  it("13a. drafting authorization does not authorize publication, application build, or Arabic generation", () => {
    const prohibited = authorization.ch01T05DraftingAuthorization.prohibitedActions;
    expect(prohibited).toEqual(expect.arrayContaining([expect.stringContaining("Student release or student-facing publication")]));
    expect(prohibited).toEqual(expect.arrayContaining([expect.stringContaining("Rendering ch01-t05 inside apps/chapter1-mvp/")]));
    expect(prohibited).toEqual(expect.arrayContaining([expect.stringContaining("Arabic translation or Arabic canonical content generation")]));
    expect(prohibited).toEqual(expect.arrayContaining([expect.stringContaining("Public deployment")]));
  });

  it("13b. publicationRestrictions explicitly keep studentFacingAllowed/studentPublicationAuthorized false for ch01-t05", () => {
    const restrictions: string[] = authorization.ch01T05DraftingAuthorization.publicationRestrictions;
    expect(restrictions.some((r) => r.includes("studentFacingAllowed") && r.includes("studentPublicationAuthorized") && r.includes("false"))).toBe(true);
  });

  it("does not expand scope.authorizedTopicIds, applicationBuildAuthorization, or batch1DraftingAuthorization", () => {
    expect(authorization.scope.authorizedTopicIds).toEqual(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]);
    expect(authorization.applicationBuildAuthorization.applicableTopicIds).toEqual(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]);
    expect(authorization.batch1DraftingAuthorization.applicableTopicIds).toEqual(["ch01-t01", "ch01-t04"]);
  });
});

describe("PR G0 — publication state unchanged chapter-wide", () => {
  it("14. studentFacingAllowed remains false for every corrected/authorized record touched by this PR", () => {
    for (const id of ["ch01-corr-005", "ch01-corr-010", "ch01-corr-011"]) {
      const corr = findCorrection(id);
      expect(corr.studentFacingSuppression).toBe(true);
    }
    const authText = JSON.stringify(authorization.ch01T05DraftingAuthorization);
    expect(authText).toContain("studentFacingAllowed and studentPublicationAuthorized remain false");
  });

  it("15. studentPublicationAuthorized remains false — no publication authorization was granted", () => {
    const authText = JSON.stringify(authorization.ch01T05DraftingAuthorization);
    expect(authText).toContain("studentPublicationAuthorized remain false");
    expect(authText.toLowerCase()).not.toContain('"studentpublicationauthorized": true');
  });
});

describe("PR G0 — no content, slide, or application file was created", () => {
  // PR G0 itself created no content file (verified by its own PR diff at merge time —
  // exactly 4 files, none of them ch01-t05-content.json). A later, separately-authorized
  // PR (PR G1, content/ch01-t05-english-draft) legitimately creates
  // batch1-drafts/ch01-t05-content.json under ch01T05DraftingAuthorization — see
  // src/tests/ch01t05DraftContent.test.ts for that PR's own focused coverage. This test
  // therefore asserts the invariants that remain true regardless of PR G1: no ch01-t05
  // content exists under pilot/ (never authorized, and PR G1 does not use that path) or
  // under batch1-arabic-drafts/ (Arabic generation remains unauthorized for ch01-t05).
  it("16. no ch01-t05-content.json exists under pilot/ or batch1-arabic-drafts/ (Arabic remains unauthorized)", () => {
    expect(existsSync(resolve(CHAPTER01_DIR, "pilot/ch01-t05-content.json"))).toBe(false);
    expect(existsSync(resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t05-content.json"))).toBe(false);
  });

  it("16b. if batch1-drafts/ch01-t05-content.json exists, it is English-only, per ch01T05DraftingAuthorization", () => {
    const path = resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t05-content.json");
    if (!existsSync(path)) return; // not yet drafted — also valid, if PR G1 has not landed
    const doc = readJson(path);
    expect(doc.topicId).toBe("ch01-t05");
    expect(doc.topicTitleAr).toBeNull();
    expect(doc.generationStatus).toBe("draft-batch1-english-only-generation");
  });

  it("17a. src/types/pilotSchema.ts's PilotTopicId union and APP_TOPIC_ORDER do not include ch01-t05", () => {
    const schemaPath = resolve(__dirname, "../types/pilotSchema.ts");
    const schemaText = readFileSync(schemaPath, "utf8");
    const unionMatch = schemaText.match(/export type PilotTopicId =[\s\S]*?;/);
    expect(unionMatch, "PilotTopicId union should be found").toBeTruthy();
    expect(unionMatch![0]).not.toContain("ch01-t05");
    const orderMatch = schemaText.match(/export const APP_TOPIC_ORDER:[\s\S]*?\];/);
    expect(orderMatch, "APP_TOPIC_ORDER should be found").toBeTruthy();
    expect(orderMatch![0]).not.toContain("ch01-t05");
  });

  it("17b. no rawImports.ts import references ch01-t05", () => {
    const rawImportsPath = resolve(__dirname, "../content/rawImports.ts");
    const rawImportsText = readFileSync(rawImportsPath, "utf8");
    expect(rawImportsText).not.toContain("ch01-t05");
  });

  it("17c. no slideGroups.ts or slideShortTitles.ts entry references ch01-t05", () => {
    const slideGroupsText = readFileSync(resolve(__dirname, "../content/slideGroups.ts"), "utf8");
    const shortTitlesText = readFileSync(resolve(__dirname, "../content/slideShortTitles.ts"), "utf8");
    expect(slideGroupsText).not.toContain("ch01-t05");
    expect(shortTitlesText).not.toContain("ch01-t05");
  });
});
