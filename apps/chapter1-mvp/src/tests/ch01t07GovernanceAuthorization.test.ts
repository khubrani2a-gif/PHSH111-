import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const chapterDir = resolve(process.cwd(), "../../docs/content-design/chapter-01");
const authorization = JSON.parse(readFileSync(resolve(chapterDir, "PILOT_AUTHORIZATION.json"), "utf8"));
const glossary = JSON.parse(readFileSync(resolve(chapterDir, "BILINGUAL_GLOSSARY.json"), "utf8"));
const corrections = JSON.parse(readFileSync(resolve(chapterDir, "SCIENTIFIC_CORRECTIONS.json"), "utf8"));

describe("ch01-t07 governance authorization", () => {
  it("approves the required terminology and corrected scientific boundary", () => {
    for (const [termId, arabic] of Object.entries({"ch01-term-vector":"كمية متجهة","ch01-term-velocity":"السرعة المتجهة","ch01-term-resultant":"المحصلة"})) {
      expect(glossary.terms.find((term: { termId: string }) => term.termId === termId)).toMatchObject({approvedArabicTerm:{text:arabic,status:"approved"},approvalStatus:"approved"});
    }
    const correction = corrections.records.find((record: { correctionId: string }) => record.correctionId === "ch01-corr-003");
    expect(correction).toMatchObject({approvalStatus:"editoriallyApproved",studentFacingSuppression:true});
    expect(correction.correctionRationale).toContain("not merely the presence of a right angle");
  });

  it("limits the grant to English drafting and a distinct abstract A/B/R visual", () => {
    const grant = authorization.ch01T07GovernanceAndEnglishDraftingAuthorization;
    expect(authorization.authorizationVersion).toBe("1.15.0");
    expect(grant.applicableTopicIds).toEqual(["ch01-t07"]);
    expect(grant.visualProductionAuthorization).toMatchObject({visualId:"ch01-t07-visual-001",authorized:true});
    expect(grant.visualProductionAuthorization.prohibited).toContain("bird");
    const prohibited = grant.prohibitedActions.join(" ");
    for (const item of ["Arabic", "Application integration", "slides", "student-facing", "Figure 1.13", "components"]) expect(prohibited).toContain(item);
    expect(grant.publicationRestrictions).toMatchObject({studentFacingAllowed:false,studentPublicationAuthorized:false});
  });
});
