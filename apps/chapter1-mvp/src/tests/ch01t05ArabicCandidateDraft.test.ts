import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const chapter = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../docs/content-design/chapter-01");
const englishPath = resolve(chapter, "batch1-drafts/ch01-t05-content.json");
const candidatePath = resolve(chapter, "batch1-arabic-drafts/ch01-t05-content.json");
const baselinePath = resolve(chapter, "ENGLISH_CH01T05_BASELINE_APPROVAL.json");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"));

function normalized(record: any) {
  const copy = structuredClone(record);
  delete copy.record.slideTitleAr;
  delete copy.record.arabic;
  delete copy.record.localizedContent?.ar;
  for (const key of ["problemStatement", "conceptualInterpretation", "intuition"]) delete copy.record[key]?.ar;
  delete copy.record.finalAnswer?.interpretation?.ar;
  for (const step of copy.record.numberedSolution ?? []) delete step.explanation?.ar;
  return copy;
}

describe("ch01-t05 Arabic candidate draft", () => {
  const english = json(englishPath);
  const candidate = json(candidatePath);

  it("preserves the approved English baseline byte-for-byte", () => {
    expect(sha256(englishPath)).toBe(json(baselinePath).approvedDraftFiles[0].sha256);
    expect(sha256(englishPath)).toBe("3982ab6e3f329816a6a3693cb8460c0a612bee78e3c04e1a4ebda91f1b362b72");
  });

  it("contains exactly the same fifteen records and IDs", () => {
    expect(existsSync(candidatePath)).toBe(true);
    expect(candidate.records).toHaveLength(15);
    expect(candidate.records.map((item: any) => item.record.instructorScriptId ?? item.record.blockId ?? item.record.problemId))
      .toEqual(english.records.map((item: any) => item.record.instructorScriptId ?? item.record.blockId ?? item.record.problemId));
    expect(candidate.records.map(normalized)).toEqual(english.records.map(normalized));
  });

  it("marks every Arabic translation as a draft and keeps every record blocked", () => {
    expect(candidate.generationStatus).toBe("draft-batch1-arabic-candidate-generation");
    for (const { record } of candidate.records) {
      expect(record.arabic.translationStatus).toBe("draft");
      expect(record.arabic.canonicalArabicTranslation.language).toBe("ar");
      expect(record.arabic.canonicalArabicTranslation.direction).toBe("rtl");
      expect(record.blocking.blockingStatus).toBe("blocked");
      expect(record.blocking.studentFacingAllowed).toBe(false);
      expect(record.blocking.resolutionStatus).toBe("open");
    }
  });

  it("uses the authorized glossary terms and has no Bolt teaching content", () => {
    const learnerArabic = candidate.records.map(({ record }: any) => record.localizedContent?.ar?.text ?? record.arabic.canonicalArabicTranslation.text).join(" ");
    expect(learnerArabic).not.toMatch(/Bolt|بولت|برلين|بكين|9\.58|9\.69/i);
    const glossaryIds = candidate.records.flatMap(({ record }: any) => record.arabic.glossaryTermIds);
    expect(glossaryIds).toEqual(expect.arrayContaining(["ch01-term-speed", "ch01-term-distance", "ch01-term-scalar"]));
  });

  it("faithfully translates the delivery-cyclist problem and its instantaneous-reading step", () => {
    const problem = candidate.records.find((item: any) => item.record.problemId === "ch01-prob-105").record;
    const prompt = problem.problemStatement.ar.text;
    expect(prompt).toContain("راكب توصيل بالدراجة");
    expect(prompt).toContain("المسافة الكلية");
    expect(prompt).toContain("الزمن الكلي");
    expect(prompt).toContain("9.5 m/s");
    expect(prompt).not.toContain("سيارة إسعاف");
    expect(prompt).not.toContain("المتوسط الحسابي");
    expect(problem.numberedSolution[3].explanation.ar.text).toContain("9.5 m/s");
    expect(problem.numberedSolution[3].explanation.ar.text).toContain("سرعة لحظية");
    expect(problem.numberedSolution[3].explanation.ar.text).toContain("ليست متوسط سرعة الرحلة");
    expect(problem.arabic.canonicalArabicTranslation.text).toContain("9.5 m/s");
  });

  it("retains the instructor's 40/60 equal-time teaching case", () => {
    const script = candidate.records.find((item: any) => item.record.instructorScriptId === "ch01-is-105").record;
    const text = script.arabic.canonicalArabicTranslation.text;
    expect(text).toContain("40 km/h");
    expect(text).toContain("60 km/h");
    expect(text).toContain("الأزمنة متساوية");
    expect(text).toContain("المسافة الكلية");
    expect(text).toContain("الزمن الكلي");
  });
});
