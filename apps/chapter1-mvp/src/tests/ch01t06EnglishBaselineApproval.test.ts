import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const chapter = resolve(root, "docs/content-design/chapter-01");
const approval = JSON.parse(readFileSync(resolve(chapter, "ENGLISH_CH01T06_BASELINE_APPROVAL.json"), "utf8"));
const draftPath = resolve(chapter, "batch2-drafts/ch01-t06-content.json");
const draft = JSON.parse(readFileSync(draftPath, "utf8"));
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("ch01-t06 English baseline approval", () => {
  it("approves only the four ordered English candidate records", () => {
    expect(approval.status).toBe("approved");
    expect(approval.baselineVersion).toBe("1.0.0");
    expect(approval.scope.applicableTopicIds).toEqual(["ch01-t06"]);
    expect(approval.approvedRecordIds).toEqual([
      "ch01-is-106", "ch01-t06-block-mainidea", "ch01-t06-block-explanation", "ch01-t06-block-review",
    ]);
    expect(approval.approvedDraftFiles[0].recordCount).toBe(4);
    expect(draft.records.map((item: any) => item.record.instructorScriptId ?? item.record.blockId)).toEqual(approval.approvedRecordIds);
  });

  it("locks the approved checksum without changing blocked downstream state", () => {
    expect(sha256(draftPath)).toBe(approval.approvedDraftFiles[0].sha256);
    expect(approval.governanceRestrictions.studentFacingAllowed).toBe(false);
    expect(approval.governanceRestrictions.studentPublicationAuthorized).toBe(false);
    expect(approval.governanceRestrictions.arabicNotAuthorized).toBe(true);
    expect(approval.governanceRestrictions.visualProductionNotAuthorized).toBe(true);
    expect(approval.governanceRestrictions.applicationIntegrationNotAuthorized).toBe(true);
  });
});
