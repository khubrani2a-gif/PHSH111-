import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getTopic, getTopicOrder, loadAllTopics } from "../content/adapter";
import {
  RAW_CONTENT_BY_TOPIC,
  RAW_SVG_MARKUP_BY_TOPIC,
  RAW_VISUAL_VALIDATION_BY_TOPIC,
} from "../content/rawImports";

const __dirname = dirname(fileURLToPath(import.meta.url));
const chapterDir = resolve(__dirname, "../../../../docs/content-design/chapter-01");
const englishPath = resolve(chapterDir, "batch1-drafts/ch01-t05-content.json");
const arabicPath = resolve(chapterDir, "batch1-arabic-drafts/ch01-t05-content.json");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("ch01-t05 internal integration", () => {
  const topic = getTopic("ch01-t05");

  it("loads the approved English/Arabic pair through the in-memory merge with all fifteen source records", () => {
    expect(topic?.title.en).toBe("Average and Instantaneous Speed");
    expect(topic?.title.ar).toBe("السرعة المتوسطة والسرعة اللحظية");
    expect(topic?.governance.recordCount).toBe(15);
    expect(topic?.mainIdea?.recordId).toBe("ch01-t05-block-mainidea");
    expect(topic?.explanation?.recordId).toBe("ch01-t05-block-explanation");
    expect(topic?.equations?.recordId).toBe("ch01-t05-block-equations");
    expect(topic?.workedExample?.recordId).toBe("ch01-t05-block-example");
    expect(topic?.instructorNotes.map((note) => note.recordId)).toEqual(["ch01-t05-block-misconception"]);
    expect(topic?.reviewQuestion?.recordId).toBe("ch01-t05-block-review");
    expect(topic?.problem?.recordId).toBe("ch01-prob-105");
    expect(topic?.mainIdea?.text.ar).toBeTruthy();
    expect(topic?.equations?.text.ar).toContain("السرعة المتوسطة");
  });

  it("preserves the recorded immutable checksums and does not create a third content source", () => {
    expect(sha256(englishPath)).toBe("3982ab6e3f329816a6a3693cb8460c0a612bee78e3c04e1a4ebda91f1b362b72");
    expect(sha256(arabicPath)).toBe("800d02bdab2b0e29f81a1a63d4ecda858ec2e565127010fce8032c50d6556cf6");
    expect(RAW_CONTENT_BY_TOPIC["ch01-t05"]).toBeDefined();
  });

  it("keeps the bicycle problem, the total-distance/time reasoning, and 9.5 m/s instantaneous", () => {
    const text = JSON.stringify(topic?.problem);
    expect(text).toContain("9.5 m/s");
    expect(text).toMatch(/3000|3,000/);
    expect(text).toContain("410");
    expect(text).toContain("instantaneous");
    expect(text).toContain("لحظية");
  });

  it("adds ch01-t05 between t04 and t08 without changing the original pilot order", () => {
    expect(getTopicOrder()).toEqual([
      "ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04", "ch01-t05", "ch01-t08", "ch01-t10",
    ]);
  });

  it("has no visual, visual validation, SVG, Bolt material, or corr-005 teaching content", () => {
    expect(topic?.visual).toBeUndefined();
    expect(RAW_VISUAL_VALIDATION_BY_TOPIC["ch01-t05"]).toBeUndefined();
    expect(RAW_SVG_MARKUP_BY_TOPIC["ch01-t05"]).toBeUndefined();
    const learnerFields = JSON.stringify([
      topic?.mainIdea,
      topic?.explanation,
      topic?.equations,
      topic?.workedExample,
      topic?.reviewQuestion,
      topic?.problem,
    ]);
    expect(learnerFields).not.toContain("Bolt");
    expect(learnerFields).not.toContain("ch01-corr-005");
  });

  it("keeps internal Draft governance and student/publication access disabled", () => {
    expect(topic?.governance.studentFacingAllowed).toBe(false);
    expect(topic?.governance.studentPublicationAuthorized).toBe(false);
    const { diagnostics } = loadAllTopics();
    expect(diagnostics.filter((diagnostic) => diagnostic.topicId === "ch01-t05" && diagnostic.severity === "error")).toEqual([]);
  });
});
