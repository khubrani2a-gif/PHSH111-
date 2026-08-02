import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "../..");
const approval = JSON.parse(readFileSync(resolve(root, "docs/content-design/chapter-01/ENGLISH_CH01T07_BASELINE_APPROVAL.json"), "utf8"));
const draftPath = resolve(root, approval.approvedDraft.path);
const hash = createHash("sha256").update(readFileSync(draftPath)).digest("hex");

describe("ch01-t07 English baseline approval", () => {
  it("pins the reviewed four-record candidate without authorizing downstream work", () => {
    expect(hash).toBe(approval.approvedDraft.sha256);
    expect(approval.approvedDraft.recordIdsInOrder).toEqual(["ch01-is-107", "ch01-t07-block-mainidea", "ch01-t07-block-explanation", "ch01-t07-block-review"]);
    expect(approval.scientificReview.correctionDependency).toContain("ch01-corr-003");
    expect(approval.scopeBoundary.excluded).toEqual(expect.arrayContaining(["components", "Arabic", "application integration", "slides", "Figure 1.13 reuse"]));
    expect(approval.publicationRestrictions).toMatchObject({studentFacingAllowed:false,studentPublicationAuthorized:false,applicationIntegrationAuthorized:false});
  });
});
