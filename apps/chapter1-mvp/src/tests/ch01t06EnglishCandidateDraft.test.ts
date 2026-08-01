import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../../../..");
const chapter = resolve(root, "docs/content-design/chapter-01");
const draft = JSON.parse(readFileSync(resolve(chapter, "batch2-drafts/ch01-t06-content.json"), "utf8"));
const grant = JSON.parse(readFileSync(resolve(chapter, "PILOT_AUTHORIZATION.json"), "utf8")).ch01T06EnglishDraftingAuthorization;
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("ch01-t06 limited English candidate draft", () => {
  it("contains only the four authorized records and concepts", () => {
    expect(draft.topicId).toBe("ch01-t06");
    expect(draft.generationStatus).toBe("draft-batch2-english-candidate-generation");
    expect(draft.records.map((item: any) => item.record.instructorScriptId ?? item.record.blockId)).toEqual([
      "ch01-is-106", "ch01-t06-block-mainidea", "ch01-t06-block-explanation", "ch01-t06-block-review",
    ]);
    const text = JSON.stringify(draft.records.map((item: any) => item.record.localizedContent?.en.text ?? item.record.mainIdea.text)).toLowerCase();
    for (const term of ["displacement", "equation", "calculation", "resultant", "graph", "acceleration", "svg"]) expect(text).not.toContain(term);
  });

  it("retains an English-only blocked draft state", () => {
    for (const item of draft.records) {
      const record = item.record;
      expect(record.blocking.blockingStatus).toBe("blocked");
      expect(record.blocking.studentFacingAllowed).toBe(false);
      if (record.arabic) expect(record.arabic.translationStatus).toBe("missing");
      expect(record.visualReferenceIds).toBeUndefined();
      expect(record.visualGovernance).toBeUndefined();
    }
  });

  it("keeps both authorized source checksums intact", () => {
    expect(sha256(resolve(root, "Lectures pdf/Chapter One- The Study of Motion.pdf"))).toBe(grant.sourceEvidence[0].sha256);
    expect(sha256(resolve(root, "docs/content-audits/chapter-01/raw-sources/source-kahoot-001-pasted-text.txt"))).toBe(grant.sourceEvidence[1].sha256);
  });
});
