import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const chapterDir = resolve(process.cwd(), "../../docs/content-design/chapter-01");
const englishPath = resolve(chapterDir, "batch2-drafts/ch01-t06-content.json");
const arabicPath = resolve(chapterDir, "batch2-arabic-drafts/ch01-t06-content.json");
const english = JSON.parse(readFileSync(englishPath, "utf8"));
const arabic = JSON.parse(readFileSync(arabicPath, "utf8"));
const authorization = JSON.parse(readFileSync(resolve(chapterDir, "PILOT_AUTHORIZATION.json"), "utf8"));

const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");
const idOf = (entry: { record: Record<string, string> }) => entry.record.instructorScriptId ?? entry.record.blockId;
const withoutArabic = (entry: { record: Record<string, unknown> }) => {
  const copy = structuredClone(entry);
  delete copy.record.arabic;
  if (copy.record.localizedContent) delete (copy.record.localizedContent as Record<string, unknown>).ar;
  return copy;
};

describe("ch01-t06 Arabic candidate draft", () => {
  it("preserves the approved English baseline, IDs, and order", () => {
    expect(sha256(englishPath)).toBe("b242fa01bcb5cfbedf4999536e7a557abf28ff6a3ed2751a3032e95048bd57f1");
    expect(arabic.records.map(idOf)).toEqual(english.records.map(idOf));
    expect(arabic.records).toHaveLength(4);
    for (let index = 0; index < english.records.length; index += 1) {
      expect(withoutArabic(arabic.records[index])).toEqual(withoutArabic(english.records[index]));
    }
  });

  it("uses draft Arabic translations and the required terminology", () => {
    const renderedArabic = JSON.stringify(arabic);
    for (const term of ["السرعة", "السرعة المتجهة", "كمية قياسية", "كمية متجهة", "المقدار", "الاتجاه"]) {
      expect(renderedArabic).toContain(term);
    }
    for (const entry of arabic.records) {
      expect(entry.record.arabic.translationStatus).toBe("draft");
      expect(entry.record.arabic.canonicalArabicTranslation.direction).toBe("rtl");
      expect(entry.record.blocking.studentFacingAllowed).toBe(false);
    }
    for (const entry of arabic.records.slice(1)) {
      expect(entry.record.localizedContent.ar).toMatchObject({
        status: "draft",
        language: "ar",
        direction: "rtl",
      });
      expect(entry.record.localizedContent.ar.text).toEqual(expect.any(String));
      expect(entry.record.localizedContent.ar.text.length).toBeGreaterThan(0);
    }
    expect(authorization.ch01T06ArabicCandidateDraftAuthorization.publicationRestrictions)
      .toMatchObject({ studentFacingAllowed: false, studentPublicationAuthorized: false });
  });

  it("keeps the candidate blocked and excludes unauthorized material", () => {
    expect(arabic.generationStatus).toBe("draft-batch2-arabic-candidate-generation");
    expect(arabic.generationNote).toContain("not student-facing");
    const renderedArabic = arabic.records.slice(1).map((entry: { record: Record<string, any> }) =>
      entry.record.localizedContent.ar.text,
    ).join(" ");
    for (const forbidden of ["الإزاحة", "معادلات", "حسابات", "محصل", "رسوم", "شرائح", "التسارع"]) expect(renderedArabic).not.toContain(forbidden);
    expect(arabic.records[3].record.localizedContent.ar.text).toContain("تتغير السرعة المتجهة");
    expect(arabic.records[3].record.localizedContent.ar.text).toContain("السرعة نفسها");
  });
});
