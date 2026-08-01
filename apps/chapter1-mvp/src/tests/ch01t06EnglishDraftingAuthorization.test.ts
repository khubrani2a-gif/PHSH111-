import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const chapterDir = resolve(__dirname, "../../../../docs/content-design/chapter-01");
const authorization = JSON.parse(readFileSync(resolve(chapterDir, "PILOT_AUTHORIZATION.json"), "utf8"));
const grant = authorization.ch01T06EnglishDraftingAuthorization;
const pdfPath = resolve(chapterDir, "../../../Lectures pdf/Chapter One- The Study of Motion.pdf");
const rawKahootPath = resolve(chapterDir, "../../content-audits/chapter-01/raw-sources/source-kahoot-001-pasted-text.txt");
const recordPath = resolve(chapterDir, "../../../docs/app/PHSH111_CH01T06_ENGLISH_DRAFTING_AUTHORIZATION_RECORD.md");

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("ch01-t06 limited English drafting authorization", () => {
  it("exists in the root authorization version that includes v1.11.0 and applies only to ch01-t06", () => {
    const [major, minor] = authorization.authorizationVersion.split(".").map(Number);
    expect(major).toBe(1);
    expect(minor).toBeGreaterThanOrEqual(11);
    expect(grant.authorizationStatus).toBe("granted");
    expect(grant.applicableTopicIds).toEqual(["ch01-t06"]);
    expect(existsSync(recordPath)).toBe(true);
    expect(authorization.relatedRecords.ch01T06EnglishDraftingAuthorizationRecord).toContain("CH01T06_ENGLISH_DRAFTING_AUTHORIZATION_RECORD");
    expect(authorization.scope.authorizedTopicIds).toEqual(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]);
    expect(authorization.applicationBuildAuthorization.applicableTopicIds).toEqual([
      "ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10",
    ]);
  });

  it("binds both audited sources to their current checksums", () => {
    expect(existsSync(pdfPath)).toBe(true);
    expect(existsSync(rawKahootPath)).toBe(true);
    expect(sha256(pdfPath)).toBe(grant.sourceEvidence[0].sha256);
    expect(sha256(rawKahootPath)).toBe(grant.sourceEvidence[1].sha256);
  });

  it("permits only the four source-supported concepts", () => {
    expect(grant.supportedConcepts).toEqual([
      "Distinguish speed from velocity through direction.",
      "Speed is a scalar and velocity is a vector.",
      "A vector has magnitude and direction.",
      "Velocity changes when direction changes even if speed remains constant.",
    ]);
  });

  it("blocks all downstream and out-of-scope work", () => {
    const prohibited = grant.prohibitedActions.join(" ");
    for (const term of [
      "Arabic", "displacement", "Equations", "vector addition", "resultants", "graphs",
      "acceleration", "visualReference", "Application integration", "publication", "student-facing",
    ]) expect(prohibited).toContain(term);
    expect(grant.publicationRestrictions.join(" ")).toContain("studentFacingAllowed and studentPublicationAuthorized remain false");
  });
});
