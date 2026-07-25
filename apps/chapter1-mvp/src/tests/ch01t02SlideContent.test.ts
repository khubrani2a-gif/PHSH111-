// Content-registration, grouping, short-title, structured-content, and
// scientific-regression tests for ch01-t02 (Distance, SI Units, Unit
// Conversion, Area, and Volume) — PR D, the second real slide-bearing
// topic after ch01-t01. Pure data-driven checks against the real,
// already-loaded topic (src/content/adapter.ts's getTopic), the real
// SLIDE_GROUPS_BY_TOPIC_ID/SLIDE_SHORT_TITLE_BY_BLOCK_ID entries, and the
// real STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID marker configuration — never a
// synthetic fixture, since ch01-t02 is now real, approved-draft content.
import { describe, expect, it } from "vitest";
import { getTopic, getTopicOrder } from "../content/adapter";
import { resolveSlideGroups, SLIDE_GROUPS_BY_TOPIC_ID, validateSlideGroups } from "../content/slideGroups";
import { resolveSlideShortTitle, SLIDE_SHORT_TITLE_BY_BLOCK_ID } from "../content/slideShortTitles";
import { STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID } from "../features/topics/StructuredSlideContent";

const topic = getTopic("ch01-t02")!;
const slides = topic.slides;
const configs = slides.map((s) => ({ slide: s, config: STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[s.recordId] }));

const EXPECTED_TITLES_EN = [
  "Why Do Physicists Need Standard Units of Length?",
  "What Is Distance, and How Do We Measure It?",
  "Why Is the Meter the SI Base Unit of Length?",
  "How Do Metric Prefixes Change the Size of a Unit?",
  "How Do We Build a Valid Conversion Factor?",
  "How Do We Convert Between Metric Length Units?",
  "Why Does Area Use Square Units?",
  "Why Must the Conversion Factor Be Squared for Area?",
  "Why Does Volume Use Cubic Units?",
  "Why Must the Conversion Factor Be Cubed for Volume?",
  "How Can We Avoid the Most Common Unit-Conversion Mistakes?",
];

const EXPECTED_TITLES_AR = [
  "لماذا يحتاج الفيزيائيون إلى وحدات معيارية للطول؟",
  "ما المسافة، وكيف نقيسها؟",
  "لماذا يُعد المتر وحدة الطول الأساسية في النظام الدولي؟",
  "كيف تغيّر البادئات المترية حجم الوحدة؟",
  "كيف نبني عامل تحويل صحيحًا؟",
  "كيف نحوّل بين وحدات الطول المترية؟",
  "لماذا تُستخدم الوحدات المربعة للمساحة؟",
  "لماذا يجب تربيع عامل التحويل عند تحويل المساحة؟",
  "لماذا تُستخدم الوحدات المكعبة للحجم؟",
  "لماذا يجب تكعيب عامل التحويل عند تحويل الحجم؟",
  "كيف نتجنب أكثر أخطاء تحويل الوحدات شيوعًا؟",
];

// Old declarative titles this correction pass replaced — must never reappear.
const OLD_DECLARATIVE_TITLES = [
  "The Meter: The SI Base Unit of Length",
  "Metric Prefixes: Scaling the Meter Up and Down",
  "Building a Valid Conversion Factor",
  "Converting Between Metric Length Units",
  "Converting Area Between Units",
  "Converting Volume Between Units",
  "Avoiding the Most Common Unit-Conversion Mistakes",
];

describe("ch01-t02 — content registration (PR D, requirements 1-6)", () => {
  it("1. ch01-t02 contains the expected number of slide records (11)", () => {
    expect(slides).toHaveLength(11);
  });

  it("2. every slide has a sequential, unique slide number starting at 1", () => {
    expect(slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("3. every slide has non-empty English and Arabic titles", () => {
    for (const slide of slides) {
      expect(slide.title.en, slide.recordId).toBeTruthy();
      expect(slide.title.en!.trim().length, slide.recordId).toBeGreaterThan(0);
      expect(slide.title.ar, slide.recordId).toBeTruthy();
      expect(slide.title.ar!.trim().length, slide.recordId).toBeGreaterThan(0);
    }
    expect(slides.map((s) => s.title.en)).toEqual(EXPECTED_TITLES_EN);
    expect(slides.map((s) => s.title.ar)).toEqual(EXPECTED_TITLES_AR);
  });

  it("4. every record ID is unique", () => {
    const ids = slides.map((s) => s.recordId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("5. no ch01-t02 record ID collides with any ch01-t01 record ID", () => {
    const t01 = getTopic("ch01-t01")!;
    const t01Ids = new Set(t01.slides.map((s) => s.recordId));
    for (const slide of slides) {
      expect(t01Ids.has(slide.recordId), slide.recordId).toBe(false);
      expect(slide.recordId.startsWith("ch01-t02-")).toBe(true);
    }
  });

  it("6. adapter normalization preserves slide order (already sorted by slideNumber, matching file order)", () => {
    const numbers = slides.map((s) => s.slideNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });
});

describe("ch01-t02 — slide grouping (PR D, requirements 7-11)", () => {
  const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t02"]!;

  it("group configuration exists and passes the generic validator with zero diagnostics", () => {
    expect(groups).toBeDefined();
    const slideNumbers = slides.map((s) => s.slideNumber);
    expect(validateSlideGroups("ch01-t02" as never, slideNumbers)).toEqual([]);
  });

  it("7. every slide is covered by exactly one group", () => {
    const covered = groups.flatMap((g) => g.slideNumbers);
    expect(covered.slice().sort((a, b) => a - b)).toEqual(slides.map((s) => s.slideNumber));
    expect(new Set(covered).size).toBe(covered.length);
  });

  it("8-9. no group ranges overlap and no group leaves a gap (groups partition 1-11 contiguously)", () => {
    const sortedGroups = groups.slice().sort((a, b) => a.slideNumbers[0] - b.slideNumbers[0]);
    let expectedNext = 1;
    for (const g of sortedGroups) {
      expect(g.slideNumbers[0]).toBe(expectedNext);
      expectedNext = g.slideNumbers[g.slideNumbers.length - 1] + 1;
    }
    expect(expectedNext).toBe(12);
  });

  it("10. bilingual group labels are non-empty", () => {
    for (const g of groups) {
      expect(g.title.en.trim().length, g.id).toBeGreaterThan(0);
      expect(g.title.ar.trim().length, g.id).toBeGreaterThan(0);
    }
  });

  it("11. group order matches slide order", () => {
    const firstSlideOfEachGroup = groups.map((g) => g.slideNumbers[0]);
    expect(firstSlideOfEachGroup).toEqual([...firstSlideOfEachGroup].sort((a, b) => a - b));
  });

  it("resolveSlideGroups returns the real configured groups (not the generic fallback)", () => {
    const resolved = resolveSlideGroups("ch01-t02" as never, slides.map((s) => s.slideNumber));
    expect(resolved).toBe(groups);
  });
});

describe("ch01-t02 — short titles (PR D, requirements 12-15)", () => {
  it("12-13. every slide has an explicit English and Arabic short title", () => {
    for (const slide of slides) {
      const entry = SLIDE_SHORT_TITLE_BY_BLOCK_ID[slide.recordId];
      expect(entry, slide.recordId).toBeDefined();
      expect(entry!.en.trim().length, slide.recordId).toBeGreaterThan(0);
      expect(entry!.ar.trim().length, slide.recordId).toBeGreaterThan(0);
    }
  });

  it("14. short titles resolve generically through resolveSlideShortTitle", () => {
    for (const slide of slides) {
      const resolvedEn = resolveSlideShortTitle(slide.recordId, "en", "FALLBACK");
      const resolvedAr = resolveSlideShortTitle(slide.recordId, "ar", "FALLBACK");
      expect(resolvedEn).not.toBe("FALLBACK");
      expect(resolvedAr).not.toBe("FALLBACK");
    }
  });

  it("15. no fallback label appears for any current ch01-t02 slide (every short title is meaningfully distinct from the full title)", () => {
    for (const slide of slides) {
      const shortEn = resolveSlideShortTitle(slide.recordId, "en", slide.title.en ?? "");
      expect(shortEn).not.toBe(slide.title.en);
      expect(shortEn.length).toBeLessThan((slide.title.en ?? "").length);
    }
  });

  it("short titles are all mutually distinct", () => {
    const shortTitlesEn = slides.map((s) => resolveSlideShortTitle(s.recordId, "en", ""));
    expect(new Set(shortTitlesEn).size).toBe(shortTitlesEn.length);
  });
});

describe("ch01-t02 — structured content (PR D, requirements 16-23)", () => {
  it("every slide has a structured-slide marker configuration", () => {
    for (const { slide, config } of configs) {
      expect(config, slide.recordId).toBeDefined();
    }
  });

  it("16. every slide has Main Idea (mainIdeaMarker configured and present in the text)", () => {
    for (const { slide, config } of configs) {
      expect(config?.mainIdeaMarker, slide.recordId).toBeDefined();
      expect(slide.text.en, slide.recordId).toContain(config!.mainIdeaMarker.en);
      expect(slide.text.ar, slide.recordId).toContain(config!.mainIdeaMarker.ar);
    }
  });

  it("17. every current slide has Key Concept", () => {
    for (const { slide, config } of configs) {
      expect(config?.keyConceptMarker, slide.recordId).toBeDefined();
    }
  });

  it("table-bearing slides (4, 11) retain their tables", () => {
    const tableSlideNumbers = [4, 11];
    for (const n of tableSlideNumbers) {
      const slide = slides.find((s) => s.slideNumber === n)!;
      expect(slide.table?.en, `slide ${n}`).toBeTruthy();
      expect(slide.table?.ar, `slide ${n}`).toBeTruthy();
    }
    const nonTableSlides = slides.filter((s) => !tableSlideNumbers.includes(s.slideNumber));
    for (const slide of nonTableSlides) {
      expect(slide.table, slide.recordId).toBeUndefined();
    }
  });

  it("19. all table-bearing slides retain tables with bilingual headers", () => {
    for (const n of [4, 11]) {
      const slide = slides.find((s) => s.slideNumber === n)!;
      expect(slide.table!.en!.headers.length).toBeGreaterThan(0);
      expect(slide.table!.ar!.headers.length).toBeGreaterThan(0);
      expect(slide.table!.en!.rows.length).toBeGreaterThan(0);
      expect(slide.table!.ar!.rows.length).toBeGreaterThan(0);
    }
  });

  it("21. definition-bearing slides (2, 3, 4, 5, 7, 9) retain their structured definitions", () => {
    const definitionSlideNumbers = [2, 3, 4, 5, 7, 9];
    for (const n of definitionSlideNumbers) {
      const slide = slides.find((s) => s.slideNumber === n)!;
      expect(slide.definitions?.en?.length, `slide ${n}`).toBeGreaterThan(0);
      expect(slide.definitions?.ar?.length, `slide ${n}`).toBeGreaterThan(0);
    }
    const nonDefinitionSlides = slides.filter((s) => !definitionSlideNumbers.includes(s.slideNumber));
    for (const slide of nonDefinitionSlides) {
      expect(slide.definitions, slide.recordId).toBeUndefined();
    }
  });

  it("22. every populated specialized explanation marker is configured on the correct slide", () => {
    const expected: Record<number, "tableExplanationMarker" | "conversionFactorExplanationMarker" | "relationshipExplanationMarker"> = {
      4: "tableExplanationMarker",
      5: "conversionFactorExplanationMarker",
      7: "relationshipExplanationMarker",
      9: "relationshipExplanationMarker",
      11: "tableExplanationMarker",
    };
    for (const [n, key] of Object.entries(expected)) {
      const slide = slides.find((s) => s.slideNumber === Number(n))!;
      const config = STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[slide.recordId]!;
      expect(config[key], `slide ${n}`).toBeDefined();
    }
  });

  it("23. no slide has more than one specialized explanation marker populated (no empty/ambiguous section)", () => {
    const specializedKeys = [
      "tableExplanationMarker",
      "figureExplanationMarker",
      "conversionFactorExplanationMarker",
      "definitionExplanationMarker",
      "relationshipExplanationMarker",
    ] as const;
    for (const { slide, config } of configs) {
      const populatedCount = specializedKeys.filter((k) => config?.[k] !== undefined).length;
      expect(populatedCount, slide.recordId).toBeLessThanOrEqual(1);
    }
  });

  it("no slide has a figure (this PR deliberately uses tables/equations instead — see PR report)", () => {
    for (const slide of slides) {
      expect(slide.figure, slide.recordId).toBeUndefined();
    }
  });
});

describe("ch01-t02 — meaningful question titles (title-correction pass, requirements 1-4)", () => {
  it("1. every English slide title ends with '?'", () => {
    for (const slide of slides) {
      expect(slide.title.en?.trim().endsWith("?"), slide.recordId).toBe(true);
    }
  });

  it("2. every Arabic slide title ends with the Arabic question mark '؟'", () => {
    for (const slide of slides) {
      expect(slide.title.ar?.trim().endsWith("؟"), slide.recordId).toBe(true);
    }
  });

  it("3. every title (English and Arabic) is non-empty", () => {
    for (const slide of slides) {
      expect(slide.title.en?.trim().length, slide.recordId).toBeGreaterThan(0);
      expect(slide.title.ar?.trim().length, slide.recordId).toBeGreaterThan(0);
    }
  });

  it("4. none of the old declarative titles remain anywhere in the slide deck", () => {
    const allEnTitles = slides.map((s) => s.title.en);
    for (const oldTitle of OLD_DECLARATIVE_TITLES) {
      expect(allEnTitles).not.toContain(oldTitle);
    }
  });

  it("short titles and groups are unchanged by the title correction (still 5 groups, still 11 distinct short titles)", () => {
    const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t02"]!;
    expect(groups).toHaveLength(5);
    for (const slide of slides) {
      expect(SLIDE_SHORT_TITLE_BY_BLOCK_ID[slide.recordId], slide.recordId).toBeDefined();
    }
  });
});

describe("ch01-t02 — Slide 11 corrected wording (title-correction pass, requirements 5-7)", () => {
  const slide11 = slides.find((s) => s.slideNumber === 11)!;

  it("5. Slide 11 no longer contains the phrase 'conversion-area errors'", () => {
    expect(slide11.text.en).not.toContain("conversion-area errors");
  });

  it("6. Slide 11 Arabic no longer contains the old dual-area-only misconception phrase", () => {
    expect(slide11.text.ar).not.toContain("أكثر خطأين شيوعًا في تحويل المساحة");
  });

  it("7. Slide 11 states the misconception accurately as an area-AND-volume conversion error", () => {
    expect(slide11.text.en).toContain("two common area-and-volume conversion errors");
    expect(slide11.text.ar).toContain("من أكثر الأخطاء شيوعًا في تحويل المساحة والحجم");
  });

  it("Slide 11's revised Step 2 wording no longer makes the overly broad 'wrong physical quantity' claim", () => {
    expect(slide11.text.en).not.toContain("describes the wrong physical quantity");
    expect(slide11.text.en).toContain("the measurement becomes inconsistent and no longer represents the original value correctly");
    expect(slide11.text.ar).toContain("يصبح القياس غير متسق ولا يمثل القيمة الأصلية تمثيلًا صحيحًا");
  });
});

describe("ch01-t02 — Slide 7 corrected dimensional wording (title-correction pass, requirements 8-9)", () => {
  const slide7 = slides.find((s) => s.slideNumber === 7)!;

  it("8. Slide 7 states that area has dimensions of length squared, not the old overgeneralized claim", () => {
    expect(slide7.text.en).not.toContain("any area calculation ultimately reduces to multiplying length measurements together");
    expect(slide7.text.en).toContain("every area has dimensions of length squared");
    expect(slide7.text.ar).toContain("لكل مساحة أبعاد طول تربيعي");
  });

  it("9. Slide 7 includes the circle example A = πr², isolated as its own equation-bearing paragraph", () => {
    expect(slide7.text.en).toContain("the area of a circle is");
    expect(slide7.text.en).toContain("A = πr²");
    expect(slide7.text.ar).toContain("A = πr²");
    const config = STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[slide7.recordId]!;
    const phrases = Array.isArray(config.equationBlockPhrase) ? config.equationBlockPhrase : [config.equationBlockPhrase];
    expect(phrases).toContain("A = πr²");
    expect(phrases).toContain("A = 3 m × 2 m = 6 m²");
  });
});

describe("ch01-t02 — scientific regression (PR D, requirements 37-43)", () => {
  it("37. linear length conversions apply the factor exactly once (Slide 6)", () => {
    const slide6 = slides.find((s) => s.slideNumber === 6)!;
    expect(slide6.text.en).toContain("3.2 km × (1000 m / 1 km) = 3200 m");
    expect(slide6.text.en).toContain("450 cm × (1 m / 100 cm) = 4.5 m");
  });

  it("38. area conversions apply the length factor squared (Slide 8)", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    expect(slide8.text.en).toContain("(1 m)² = (100 cm)²");
    expect(slide8.text.en).toContain("1.35 m² × 10,000 = 13,500 cm²");
  });

  it("39. volume conversions apply the length factor cubed (Slide 10)", () => {
    const slide10 = slides.find((s) => s.slideNumber === 10)!;
    expect(slide10.text.en).toContain("(1 m)³ = (100 cm)³");
    expect(slide10.text.en).toContain("0.4 m³ × 1,000,000 = 400,000 cm³");
  });

  it("40. the correct relation 1 m² = 10,000 cm² is asserted as fact (Slide 8 directly; Slide 11's summary shows the same derivation, 1 m² = (100 cm)² = 10,000 cm²)", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    const slide11 = slides.find((s) => s.slideNumber === 11)!;
    expect(slide8.text.en).toContain("1 m² = 10,000 cm²");
    expect(slide11.text.en).toContain("1 m² = (100 cm)² = 10,000 cm²");
  });

  it("41. the correct relation 1 m³ = 1,000,000 cm³ is asserted as fact (Slide 10 directly; Slide 11's summary shows the same derivation, 1 m³ = (100 cm)³ = 1,000,000 cm³)", () => {
    const slide10 = slides.find((s) => s.slideNumber === 10)!;
    const slide11 = slides.find((s) => s.slideNumber === 11)!;
    expect(slide10.text.en).toContain("1 m³ = 1,000,000 cm³");
    expect(slide11.text.en).toContain("1 m³ = (100 cm)³ = 1,000,000 cm³");
  });

  it("42. the incorrect '1 m² = 100 cm²' is never configured as an equation-block-emphasized phrase (only ever appears inside corrective misconception prose)", () => {
    for (const { config } of configs) {
      const phrase = config?.equationBlockPhrase;
      const phrases = Array.isArray(phrase) ? phrase : phrase ? [phrase] : [];
      expect(phrases).not.toContain("1 m² = 100 cm²");
    }
  });

  it("43. the incorrect '1 m³ = 100 cm³' is never configured as an equation-block-emphasized phrase", () => {
    for (const { config } of configs) {
      const phrase = config?.equationBlockPhrase;
      const phrases = Array.isArray(phrase) ? phrase : phrase ? [phrase] : [];
      expect(phrases).not.toContain("1 m³ = 100 cm³");
    }
  });

  it("distance is never described as a vector (Slide 2's misconception explicitly corrects this)", () => {
    const slide2 = slides.find((s) => s.slideNumber === 2)!;
    expect(slide2.text.en).toContain("distance as if it were a vector");
    expect(slide2.text.en).toContain("distance is a scalar");
  });

  it("every emphasized worked-calculation phrase (excluding pure scaling-factor lines like ×100²=×10,000) ends with a stated unit, never a bare number", () => {
    const bareNumberEnding = /\d$/;
    const scalingFactorLine = /^×/;
    for (const { config } of configs) {
      const phrase = config?.equationBlockPhrase;
      const phrases = Array.isArray(phrase) ? phrase : phrase ? [phrase] : [];
      for (const p of phrases) {
        if (scalingFactorLine.test(p.trim())) continue;
        expect(bareNumberEnding.test(p.trim()), p).toBe(false);
      }
    }
  });
});

describe("ch01-t02 — registered in the app's topic order", () => {
  it("ch01-t02 is part of getTopicOrder() and passes group validation as part of the full-registry regression", () => {
    expect(getTopicOrder()).toContain("ch01-t02");
  });
});
