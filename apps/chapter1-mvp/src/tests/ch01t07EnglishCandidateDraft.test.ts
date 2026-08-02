import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const draft = JSON.parse(readFileSync(resolve(process.cwd(), "../../docs/content-design/chapter-01/batch3-drafts/ch01-t07-content.json"), "utf8"));
const text = JSON.stringify(draft);
const learnerText = draft.records.slice(1).map((item: { record: { localizedContent: { en: { text: string } } } }) => item.record.localizedContent.en.text).join(" ");

describe("ch01-t07 English candidate draft", () => {
  it("keeps the authorized four-record scope and draft restrictions", () => {
    expect(draft.records.map((item: { record: { instructorScriptId?: string; blockId?: string } }) => item.record.instructorScriptId ?? item.record.blockId)).toEqual(["ch01-is-107","ch01-t07-block-mainidea","ch01-t07-block-explanation","ch01-t07-block-review"]);
    expect(draft.generationStatus).toContain("candidate");
    for (const item of draft.records) {
      expect(item.record.blocking.studentFacingAllowed).toBe(false);
    }
  });
  it("teaches the correction without source-artwork or component leakage", () => {
    expect(text).toContain("head-to-tail");
    expect(text).toContain("resultant");
    expect(text).toContain("do not infer");
    for (const forbidden of ["bird", "wind", "Figure 1.13"]) expect(learnerText).not.toContain(forbidden);
  });
});
