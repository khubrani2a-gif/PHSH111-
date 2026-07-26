// Content-registration, grouping, short-title, structured-content, and
// scientific-regression tests for ch01-t04 (Mass, Inertia, and Weight) —
// PR F, the fourth real slide-bearing topic after ch01-t01/ch01-t02/
// ch01-t03. Pure data-driven checks against the real, already-loaded topic
// (src/content/adapter.ts's getTopic), the real
// SLIDE_GROUPS_BY_TOPIC_ID/SLIDE_SHORT_TITLE_BY_BLOCK_ID entries, and the
// real STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID marker configuration — never a
// synthetic fixture, since ch01-t04 is now real, approved-draft content.
import { describe, expect, it } from "vitest";
import { getTopic, getTopicOrder } from "../content/adapter";
import { resolveSlideGroups, SLIDE_GROUPS_BY_TOPIC_ID, validateSlideGroups } from "../content/slideGroups";
import { resolveSlideShortTitle, SLIDE_SHORT_TITLE_BY_BLOCK_ID } from "../content/slideShortTitles";
import { STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID } from "../features/topics/StructuredSlideContent";

const topic = getTopic("ch01-t04")!;
const slides = topic.slides;
const configs = slides.map((s) => ({ slide: s, config: STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[s.recordId] }));

const EXPECTED_TITLES_EN = [
  "Why Are Some Objects Harder to Push Than Others?",
  "What Is Mass?",
  "What Is Weight?",
  "How Do We Calculate Weight Using W = mg?",
  "How Are Mass and Weight Different?",
  "Why Can Weight Change While Mass Stays Constant?",
  "What Happens to Mass and Weight on the Moon?",
  "What Does a Scale Actually Measure?",
  "How Can We Check Mass-and-Weight Answers?",
];

const EXPECTED_TITLES_AR = [
  "لماذا يصعب دفع بعض الأجسام أكثر من غيرها؟",
  "ما هي الكتلة؟",
  "ما هو الوزن؟",
  "كيف نحسب الوزن باستخدام W = mg؟",
  "كيف تختلف الكتلة عن الوزن؟",
  "لماذا يمكن أن يتغيّر الوزن بينما تبقى الكتلة ثابتة؟",
  "ماذا يحدث للكتلة والوزن على القمر؟",
  "ماذا يقيس الميزان فعليًا؟",
  "كيف يمكننا التحقق من إجابات الكتلة والوزن؟",
];

describe("ch01-t04 — content registration", () => {
  it("1. ch01-t04 contains the expected number of slide records (9)", () => {
    expect(slides).toHaveLength(9);
  });

  it("2. every slide has a sequential, unique slide number starting at 1", () => {
    expect(slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("3. all English titles end with '?' and all Arabic titles end with '؟'; titles match the approved list exactly", () => {
    for (const slide of slides) {
      expect(slide.title.en?.trim().endsWith("?"), slide.recordId).toBe(true);
      expect(slide.title.ar?.trim().endsWith("؟"), slide.recordId).toBe(true);
      expect(slide.title.en!.trim().length, slide.recordId).toBeGreaterThan(0);
      expect(slide.title.ar!.trim().length, slide.recordId).toBeGreaterThan(0);
    }
    expect(slides.map((s) => s.title.en)).toEqual(EXPECTED_TITLES_EN);
    expect(slides.map((s) => s.title.ar)).toEqual(EXPECTED_TITLES_AR);
  });

  it("4. every record ID is unique, topic-scoped, and does not collide with ch01-t01, ch01-t02, or ch01-t03", () => {
    const ids = slides.map((s) => s.recordId);
    expect(new Set(ids).size).toBe(ids.length);
    const t01Ids = new Set(getTopic("ch01-t01")!.slides.map((s) => s.recordId));
    const t02Ids = new Set(getTopic("ch01-t02")!.slides.map((s) => s.recordId));
    const t03Ids = new Set(getTopic("ch01-t03")!.slides.map((s) => s.recordId));
    for (const slide of slides) {
      expect(t01Ids.has(slide.recordId), slide.recordId).toBe(false);
      expect(t02Ids.has(slide.recordId), slide.recordId).toBe(false);
      expect(t03Ids.has(slide.recordId), slide.recordId).toBe(false);
      expect(slide.recordId.startsWith("ch01-t04-block-slide-")).toBe(true);
    }
  });

  it("5. adapter normalization preserves slide order (already sorted by slideNumber, matching file order)", () => {
    const numbers = slides.map((s) => s.slideNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("6. existing non-slide ch01-t04 records are untouched (still exactly 8 + 9 = 17 total records)", () => {
    expect(topic.governance.recordCount).toBe(17);
    expect(topic.mainIdea?.recordId).toBe("ch01-t04-block-mainidea");
    expect(topic.explanation?.recordId).toBe("ch01-t04-block-explanation");
    expect(topic.equations?.recordId).toBe("ch01-t04-block-equations");
    expect(topic.visual?.recordId).toBe("ch01-t04-block-visual");
    expect(topic.problem?.recordId).toBe("ch01-prob-104");
    expect(topic.instructorNotes[0]?.recordId).toBe("ch01-t04-block-misconception");
  });
});

describe("ch01-t04 — slide grouping", () => {
  const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t04"]!;

  it("group configuration exists and passes the generic validator with zero diagnostics", () => {
    expect(groups).toBeDefined();
    const slideNumbers = slides.map((s) => s.slideNumber);
    expect(validateSlideGroups("ch01-t04" as never, slideNumbers)).toEqual([]);
  });

  it("7. every slide is covered by exactly one group", () => {
    const covered = groups.flatMap((g) => g.slideNumbers);
    expect(covered.slice().sort((a, b) => a - b)).toEqual(slides.map((s) => s.slideNumber));
    expect(new Set(covered).size).toBe(covered.length);
  });

  it("8-9. no group ranges overlap and no group leaves a gap (groups partition 1-9 contiguously)", () => {
    const sortedGroups = groups.slice().sort((a, b) => a.slideNumbers[0] - b.slideNumbers[0]);
    let expectedNext = 1;
    for (const g of sortedGroups) {
      expect(g.slideNumbers[0]).toBe(expectedNext);
      expectedNext = g.slideNumbers[g.slideNumbers.length - 1] + 1;
    }
    expect(expectedNext).toBe(10);
  });

  it("bilingual group labels are non-empty and group order matches slide order", () => {
    for (const g of groups) {
      expect(g.title.en.trim().length, g.id).toBeGreaterThan(0);
      expect(g.title.ar.trim().length, g.id).toBeGreaterThan(0);
    }
    const firstSlideOfEachGroup = groups.map((g) => g.slideNumbers[0]);
    expect(firstSlideOfEachGroup).toEqual([...firstSlideOfEachGroup].sort((a, b) => a - b));
  });

  it("resolveSlideGroups returns the real configured groups (not the generic fallback)", () => {
    const resolved = resolveSlideGroups("ch01-t04" as never, slides.map((s) => s.slideNumber));
    expect(resolved).toBe(groups);
  });
});

describe("ch01-t04 — short titles", () => {
  it("10. every slide has an explicit, non-empty bilingual short title that resolves without fallback", () => {
    for (const slide of slides) {
      const entry = SLIDE_SHORT_TITLE_BY_BLOCK_ID[slide.recordId];
      expect(entry, slide.recordId).toBeDefined();
      expect(entry!.en.trim().length, slide.recordId).toBeGreaterThan(0);
      expect(entry!.ar.trim().length, slide.recordId).toBeGreaterThan(0);
      const resolvedEn = resolveSlideShortTitle(slide.recordId, "en", "FALLBACK");
      const resolvedAr = resolveSlideShortTitle(slide.recordId, "ar", "FALLBACK");
      expect(resolvedEn).not.toBe("FALLBACK");
      expect(resolvedAr).not.toBe("FALLBACK");
    }
  });

  it("short titles are all mutually distinct and shorter than or equal to the full title", () => {
    const shortTitlesEn = slides.map((s) => resolveSlideShortTitle(s.recordId, "en", ""));
    expect(new Set(shortTitlesEn).size).toBe(shortTitlesEn.length);
    for (const slide of slides) {
      const shortEn = resolveSlideShortTitle(slide.recordId, "en", slide.title.en ?? "");
      expect(shortEn.length).toBeLessThanOrEqual((slide.title.en ?? "").length);
    }
  });
});

describe("ch01-t04 — structured content", () => {
  it("every slide has a structured-slide marker configuration", () => {
    for (const { slide, config } of configs) {
      expect(config, slide.recordId).toBeDefined();
    }
  });

  it("11. every slide has Main Idea (mainIdeaMarker configured and present in the text)", () => {
    for (const { slide, config } of configs) {
      expect(config?.mainIdeaMarker, slide.recordId).toBeDefined();
      expect(slide.text.en, slide.recordId).toContain(config!.mainIdeaMarker.en);
      expect(slide.text.ar, slide.recordId).toContain(config!.mainIdeaMarker.ar);
    }
  });

  it("12. every slide has Key Concept", () => {
    for (const { slide, config } of configs) {
      expect(config?.keyConceptMarker, slide.recordId).toBeDefined();
    }
  });

  it("13. every slide has a Simple Example (simpleExampleMarker configured and present in the text)", () => {
    for (const { slide, config } of configs) {
      expect(config?.simpleExampleMarker, slide.recordId).toBeDefined();
      expect(slide.text.en, slide.recordId).toContain(config!.simpleExampleMarker.en);
      expect(slide.text.ar, slide.recordId).toContain(config!.simpleExampleMarker.ar);
    }
  });

  it("figure remains bilingual where present (Slide 8 only)", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    expect(slide8.figure?.assetUrl).toBeTruthy();
    expect(slide8.figure?.alt.en).toBeTruthy();
    expect(slide8.figure?.alt.ar).toBeTruthy();
    const nonFigureSlides = slides.filter((s) => s.slideNumber !== 8);
    for (const slide of nonFigureSlides) {
      expect(slide.figure, slide.recordId).toBeUndefined();
    }
  });

  it("tables remain bilingual where present (Slides 5 and 7 only)", () => {
    const tableSlides = slides.filter((s) => s.table);
    expect(tableSlides.map((s) => s.slideNumber)).toEqual([5, 7]);
    for (const slide of tableSlides) {
      expect(slide.table!.en!.headers.length, slide.recordId).toBeGreaterThan(0);
      expect(slide.table!.ar!.headers.length, slide.recordId).toBeGreaterThan(0);
      expect(slide.table!.en!.rows.length, slide.recordId).toBeGreaterThan(0);
      expect(slide.table!.ar!.rows.length, slide.recordId).toBeGreaterThan(0);
    }
  });

  it("14. definition-bearing slides (2, 3, 8) retain their structured definitions, covering exactly the five required terms once each", () => {
    const definitionSlideNumbers = [2, 3, 8];
    const allTermsEn: string[] = [];
    for (const n of definitionSlideNumbers) {
      const slide = slides.find((s) => s.slideNumber === n)!;
      expect(slide.definitions?.en?.length, `slide ${n}`).toBeGreaterThan(0);
      expect(slide.definitions?.ar?.length, `slide ${n}`).toBeGreaterThan(0);
      for (const d of slide.definitions!.en!) allTermsEn.push(d.term);
    }
    expect(allTermsEn.sort()).toEqual(
      ["Apparent Weight", "Gravitational Field Strength", "Inertia", "Mass", "Weight"].sort(),
    );
    const nonDefinitionSlides = slides.filter((s) => !definitionSlideNumbers.includes(s.slideNumber));
    for (const slide of nonDefinitionSlides) {
      expect(slide.definitions, slide.recordId).toBeUndefined();
    }
  });

  it("Mass is defined as a measure of inertia, not merely 'amount of matter'", () => {
    const slide2 = slides.find((s) => s.slideNumber === 2)!;
    const massDef = slide2.definitions!.en!.find((d) => d.term === "Mass")!;
    expect(massDef.definition).toContain("inertia");
    expect(massDef.definition.toLowerCase()).not.toContain("amount of matter");
  });

  it("Weight is defined as the gravitational force acting on an object", () => {
    const slide3 = slides.find((s) => s.slideNumber === 3)!;
    const weightDef = slide3.definitions!.en!.find((d) => d.term === "Weight")!;
    expect(weightDef.definition).toBe("The gravitational force acting on an object.");
  });

  it("Apparent Weight is defined as the support force measured by a scale", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    const apparentDef = slide8.definitions!.en!.find((d) => d.term === "Apparent Weight")!;
    expect(apparentDef.definition).toBe("The support force measured by a scale.");
  });

  it("15. every populated specialized explanation marker is configured on the correct slide, and no slide has more than one", () => {
    const expected: Record<
      number,
      "tableExplanationMarker" | "relationshipExplanationMarker" | "figureExplanationMarker"
    > = {
      5: "tableExplanationMarker",
      6: "relationshipExplanationMarker",
      7: "tableExplanationMarker",
      8: "figureExplanationMarker",
    };
    for (const [n, key] of Object.entries(expected)) {
      const slide = slides.find((s) => s.slideNumber === Number(n))!;
      const config = STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[slide.recordId]!;
      expect(config[key], `slide ${n}`).toBeDefined();
    }
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

  it("16. no empty specialized section exists: every configured specialized marker's text is actually present on that slide", () => {
    const specializedMarkerKeys = [
      "tableExplanationMarker",
      "figureExplanationMarker",
      "conversionFactorExplanationMarker",
      "definitionExplanationMarker",
      "relationshipExplanationMarker",
    ] as const;
    for (const { slide, config } of configs) {
      for (const key of specializedMarkerKeys) {
        const marker = config?.[key];
        if (!marker) continue;
        expect(slide.text.en, `${slide.recordId} ${key}`).toContain(marker.en);
        expect(slide.text.ar, `${slide.recordId} ${key}`).toContain(marker.ar);
      }
    }
  });

  it("17. every slide has 3 or 4 numbered steps using the 'Step N — ' convention", () => {
    const stepEn = /^Step\s+\d+\s+—/;
    for (const slide of slides) {
      const paras = slide.text.en!.split(/\n{2,}/);
      const steps = paras.filter((p) => stepEn.test(p));
      expect(steps.length, slide.recordId).toBeGreaterThanOrEqual(3);
      expect(steps.length, slide.recordId).toBeLessThanOrEqual(4);
    }
  });
});

describe("ch01-t04 — scientific regression", () => {
  const fullEn = slides.map((s) => s.text.en).join("\n\n");

  it("18. W = mg appears with g approx 9.8 m/s^2 at Earth's surface, matching the topic's own pre-existing ch01-t04-block-equations", () => {
    expect(fullEn).toContain("W = mg");
    expect(fullEn).toContain("g ≈ 9.8 m/s²");
    expect(topic.equations!.text.en).toContain("9.8");
  });

  it("19. the worked W = mg calculation is numerically correct and unit-complete", () => {
    expect(fullEn).toContain("W = mg = (2.0 kg)(9.8 m/s²) = 19.6 N");
    expect(2.0 * 9.8).toBeCloseTo(19.6, 10);
  });

  it("20. mass is never reported in newtons, and weight is never reported in kilograms, as a correct final answer", () => {
    expect(fullEn).not.toMatch(/mass[^.]*=\s*[\d.]+\s*N\b/i);
  });

  it("21. mass is explicitly stated to be independent of location/gravity", () => {
    expect(fullEn).toContain("does not depend on location");
    expect(fullEn.toLowerCase()).toContain("mass does not depend on gravity");
  });

  it("22. weight is explicitly stated to depend on the local gravitational field strength", () => {
    expect(fullEn).toContain("depends on the local gravitational field strength");
  });

  it("23. mass is explicitly identified as a scalar and weight as a vector", () => {
    expect(fullEn).toContain("Mass is a scalar");
    expect(fullEn).toContain("Weight, being a force, is a vector");
  });

  it("24. the Moon is explicitly stated to have real, nonzero gravity — never 'no gravity' or 'zero gravity' as fact", () => {
    const slide7 = slides.find((s) => s.slideNumber === 7)!;
    expect(slide7.text.en).toContain("not zero, just");
    expect(slide7.text.en).toContain("a real, nonzero gravitational field");
    // "no gravity"/"zero gravity" appear only inside the misconception being corrected.
    expect(slide7.text.en).toContain("some students think the Moon has");
    expect(slide7.text.en).toContain("no gravity");
    expect(slide7.text.en).toContain("zero gravity");
  });

  it("25. no specific numeric Moon gravitational-field-strength or Moon weight value is invented anywhere in the topic", () => {
    const slide7 = slides.find((s) => s.slideNumber === 7)!;
    expect(slide7.text.en).not.toMatch(/1\.6\s*m\/s/); // the commonly-cited Moon g value, deliberately not used
    expect(slide7.text.en).not.toMatch(/moon[^.]*=\s*[\d.]+\s*N/i);
  });

  it("26. apparent weight is explicitly distinguished, by name, from gravitational weight, even where their values agree", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    expect(slide8.text.en).toContain("distinct in name from gravitational weight, even when");
  });

  it("27. a scale is explicitly described as responding to a support force, not directly measuring mass", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    expect(slide8.text.en).toContain("A scale provides an upward support force");
    expect(slide8.text.en).toContain("not a direct kilogram");
  });

  it("28. no text asserts that 'harder to push' and 'heavier' always mean the same thing, except as the misconception being corrected", () => {
    const slide1 = slides.find((s) => s.slideNumber === 1)!;
    expect(slide1.text.en).toContain("Misconception: some students assume");
    expect(slide1.text.en).toContain("Correction: pushing tests resistance to a change in motion");
  });

  it("29. the Earth-versus-Moon table never states a specific numeric weight or gravitational-field-strength value", () => {
    const slide7 = slides.find((s) => s.slideNumber === 7)!;
    const flatCells = [...slide7.table!.en!.headers, ...slide7.table!.en!.rows.flat()];
    for (const cell of flatCells) {
      expect(cell).not.toMatch(/\d/);
    }
  });

  it("30. the mass-versus-weight table correctly assigns kilograms to mass and newtons to weight", () => {
    const slide5 = slides.find((s) => s.slideNumber === 5)!;
    const rows = slide5.table!.en!.rows;
    const unitRow = rows.find((r) => r[0] === "SI unit")!;
    expect(unitRow[1]).toContain("kilogram");
    expect(unitRow[2]).toContain("newton");
  });

  it("31. no text claims weight is measured in kilograms as a correct statement (only ever corrected as a misconception)", () => {
    expect(fullEn).not.toMatch(/weight is (?:always |properly )?measured in kilograms\b(?! —)/i);
    expect(fullEn).toContain("Weight is measured in newtons (N) — never kilograms.");
  });

  it("32. every weight worked-result ends in N, and every mass value is stated in kg (spot-checked equation phrases)", () => {
    const weightResults = ["W = mg = (2.0 kg)(9.8 m/s²) = 19.6 N", "2.0 kg × 9.8 m/s² = 19.6 N"];
    for (const eq of weightResults) {
      expect(fullEn, eq).toContain(eq);
      expect(eq.trim().endsWith("N")).toBe(true);
    }
  });

  it("33. no advanced, unsupported concept (elevator/accelerating-reference-frame apparent weight, orbit, free fall, weightlessness, a specific Moon g value) was silently introduced", () => {
    const forbidden = [
      "elevator",
      "accelerating reference frame",
      "orbit",
      "free fall",
      "weightlessness",
      "1.6 m/s",
      "1.62 m/s",
    ];
    for (const term of forbidden) {
      expect(fullEn.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });
});

describe("ch01-t04 — registered in the app's topic order", () => {
  it("ch01-t04 is part of getTopicOrder() and passes group validation as part of the full-registry regression", () => {
    expect(getTopicOrder()).toContain("ch01-t04");
  });
});
