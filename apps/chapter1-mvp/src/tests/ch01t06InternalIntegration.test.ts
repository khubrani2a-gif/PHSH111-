import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  RAW_CONTENT_BY_TOPIC,
  RAW_SVG_MARKUP_BY_TOPIC,
  RAW_VISUAL_VALIDATION_BY_TOPIC,
} from "../content/rawImports";
import { getTopic, getTopicOrder } from "../content/adapter";

const chapterDir = resolve(process.cwd(), "../../docs/content-design/chapter-01");
const englishPath = resolve(chapterDir, "batch2-drafts/ch01-t06-content.json");
const arabicPath = resolve(chapterDir, "batch2-arabic-drafts/ch01-t06-content.json");
const authorizationPath = resolve(chapterDir, "PILOT_AUTHORIZATION.json");
const readinessPath = resolve(chapterDir, "PILOT_READINESS.json");
const sha256 = (path: string) => createHash("sha256").update(readFileSync(path)).digest("hex");

describe("ch01-t06 internal integration without a visual", () => {
  const topic = getTopic("ch01-t06");

  it("merges the approved English and Arabic baselines in memory", () => {
    expect(sha256(englishPath)).toBe("b242fa01bcb5cfbedf4999536e7a557abf28ff6a3ed2751a3032e95048bd57f1");
    expect(sha256(arabicPath)).toBe("3f7dbd678bda5c7e4ab588fff19d45209de2ae5408a89c5ecbe0aa14b9b0ed02");
    expect(RAW_CONTENT_BY_TOPIC["ch01-t06"]).toBeDefined();
    expect(topic?.topicId).toBe("ch01-t06");
    expect(topic?.mainIdea?.recordId).toBe("ch01-t06-block-mainidea");
    expect(topic?.explanation?.recordId).toBe("ch01-t06-block-explanation");
    expect(topic?.reviewQuestion?.recordId).toBe("ch01-t06-block-review");
    expect(topic?.mainIdea?.text.ar).toContain("كمية قياسية");
    const rawRecords = (RAW_CONTENT_BY_TOPIC["ch01-t06"] as any).records;
    for (const record of rawRecords) {
      expect(record.record.arabic.canonicalArabicTranslation.direction).toBe("rtl");
    }
    for (const record of rawRecords.slice(1)) {
      expect(record.record.localizedContent.ar.direction).toBe("rtl");
    }
    expect(topic?.reviewQuestion?.text.ar).toContain("تتغير السرعة المتجهة");
  });

  it("keeps t06 before the later t07 integration without changing prior topics", () => {
    expect(getTopicOrder()).toEqual([
      "ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04",
      "ch01-t05", "ch01-t06", "ch01-t07", "ch01-t08", "ch01-t10",
    ]);
  });

  it("has no visual or student/publication authorization", () => {
    expect(RAW_VISUAL_VALIDATION_BY_TOPIC["ch01-t06"]).toBeUndefined();
    expect(RAW_SVG_MARKUP_BY_TOPIC["ch01-t06"]).toBeUndefined();
    expect(topic?.visual).toBeUndefined();
    for (const record of (RAW_CONTENT_BY_TOPIC["ch01-t06"] as any).records) {
      expect(record.record.blocking.studentFacingAllowed).toBe(false);
      expect(record.record.arabic.translationStatus).toBe("draft");
    }
    const authorization = JSON.parse(readFileSync(authorizationPath, "utf8"));
    const readiness = JSON.parse(readFileSync(readinessPath, "utf8"));
    expect(authorization.ch01T06ApplicationIntegrationAuthorization.publicationRestrictions.studentPublicationAuthorized).toBe(false);
    expect(readiness.ch01T06InternalIntegrationReadiness.studentPublicationAuthorized).toBe(false);
  });
});
