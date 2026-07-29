import { describe, expect, it } from "vitest";
import { getTopic } from "../content/adapter";
import { SLIDE_GROUPS_BY_TOPIC_ID } from "../content/slideGroups";
import { SLIDE_SHORT_TITLE_BY_BLOCK_ID } from "../content/slideShortTitles";
import { RAW_CONTENT_BY_TOPIC, RAW_FIGURE_URL_BY_BLOCK_ID, RAW_SVG_MARKUP_BY_TOPIC } from "../content/rawImports";

describe("ch01-t05 bilingual text-only slides", () => {
  const topic = getTopic("ch01-t05");

  it("merges seven sequential bilingual slides and keeps their RTL/LTR directions", () => {
    expect(topic?.slides.map((slide) => slide.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const raw = RAW_CONTENT_BY_TOPIC["ch01-t05"] as { records: Array<{ recordType: string; record: { blockType?: string; localizedContent?: { en?: { direction?: string }; ar?: { direction?: string } } } }> };
    const rawSlides = raw.records.filter((entry) => entry.recordType === "contentBlock" && entry.record.blockType === "slide");
    expect(rawSlides.every((entry) => entry.record.localizedContent?.en?.direction === "ltr" && entry.record.localizedContent?.ar?.direction === "rtl")).toBe(true);
    expect(topic?.slides.every((slide) => slide.blocking.studentFacingAllowed === false)).toBe(true);
  });

  it("preserves the approved average-speed, stop, speedometer, and problem facts", () => {
    const text = topic?.slides.map((slide) => `${slide.text.en}\n${slide.text.ar}`).join("\n") ?? "";
    expect(text).toContain("total elapsed time includes all");
    expect(text).toContain("speedometer displays an approximate instantaneous speed");
    expect(text).toContain("(40 km/h + 60 km/h) / 2 = 50 km/h");
    expect(text).toContain("3000 m / 410 s ≈ 7.3 m/s");
    expect(text).toContain("9.5 m/s");
    expect(text).not.toMatch(/Bolt|V10|ch01-corr-005|pace|calculus|limit/i);
  });

  it("uses grouped navigation, compact bilingual labels, and no visual asset", () => {
    expect(SLIDE_GROUPS_BY_TOPIC_ID["ch01-t05"]?.flatMap((group) => group.slideNumbers)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(SLIDE_SHORT_TITLE_BY_BLOCK_ID["ch01-t05-block-slide-6"]).toEqual({ en: "Delivery Trip", ar: "رحلة التوصيل" });
    expect(RAW_SVG_MARKUP_BY_TOPIC["ch01-t05"]).toBeUndefined();
    expect(Object.keys(RAW_FIGURE_URL_BY_BLOCK_ID).filter((id) => id.startsWith("ch01-t05"))).toEqual([]);
  });
});
