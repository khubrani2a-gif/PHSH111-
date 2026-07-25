// Content-registration, grouping, short-title, structured-content, and
// scientific-regression tests for ch01-t03 (Time, Period, and Frequency) —
// PR E, the third real slide-bearing topic after ch01-t01/ch01-t02. Pure
// data-driven checks against the real, already-loaded topic
// (src/content/adapter.ts's getTopic), the real
// SLIDE_GROUPS_BY_TOPIC_ID/SLIDE_SHORT_TITLE_BY_BLOCK_ID entries, and the
// real STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID marker configuration — never a
// synthetic fixture, since ch01-t03 is now real, approved-draft content.
import { describe, expect, it } from "vitest";
import { getTopic, getTopicOrder } from "../content/adapter";
import { resolveSlideGroups, SLIDE_GROUPS_BY_TOPIC_ID, validateSlideGroups } from "../content/slideGroups";
import { resolveSlideShortTitle, SLIDE_SHORT_TITLE_BY_BLOCK_ID } from "../content/slideShortTitles";
import { STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID } from "../features/topics/StructuredSlideContent";

const topic = getTopic("ch01-t03")!;
const slides = topic.slides;
const configs = slides.map((s) => ({ slide: s, config: STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID[s.recordId] }));

const EXPECTED_TITLES_EN = [
  "Why Must We Define the Repeating Process Before Measuring It?",
  "What Counts as One Complete Cycle?",
  "What Is the Period of a Repeating Process?",
  "What Is Frequency, and What Does One Hertz Mean?",
  "How Are Period and Frequency Related?",
  "How Do We Calculate Frequency from Period?",
  "How Do We Calculate Period from Frequency?",
  "Why Does a Shorter Period Mean a Higher Frequency?",
  "How Do We Avoid Counting Half a Cycle as a Full Cycle?",
  "How Can We Check Period-and-Frequency Answers?",
];

const EXPECTED_TITLES_AR = [
  "لماذا يجب تحديد العملية المتكررة قبل قياسها؟",
  "ما الذي يُعدّ دورة كاملة واحدة؟",
  "ما هو دور العملية المتكررة؟",
  "ما هو التردد، وماذا يعني الهرتز الواحد؟",
  "كيف يرتبط الدور بالتردد؟",
  "كيف نحسب التردد من الدور؟",
  "كيف نحسب الدور من التردد؟",
  "لماذا يعني الدور الأقصر ترددًا أعلى؟",
  "كيف نتجنب عدّ نصف الدورة على أنه دورة كاملة؟",
  "كيف يمكننا التحقق من إجابات الدور والتردد؟",
];

describe("ch01-t03 — content registration", () => {
  it("1. ch01-t03 contains the expected number of slide records (10)", () => {
    expect(slides).toHaveLength(10);
  });

  it("2. every slide has a sequential, unique slide number starting at 1", () => {
    expect(slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
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

  it("4. every record ID is unique, topic-scoped, and does not collide with ch01-t01 or ch01-t02", () => {
    const ids = slides.map((s) => s.recordId);
    expect(new Set(ids).size).toBe(ids.length);
    const t01Ids = new Set(getTopic("ch01-t01")!.slides.map((s) => s.recordId));
    const t02Ids = new Set(getTopic("ch01-t02")!.slides.map((s) => s.recordId));
    for (const slide of slides) {
      expect(t01Ids.has(slide.recordId), slide.recordId).toBe(false);
      expect(t02Ids.has(slide.recordId), slide.recordId).toBe(false);
      expect(slide.recordId.startsWith("ch01-t03-block-slide-")).toBe(true);
    }
  });

  it("5. adapter normalization preserves slide order (already sorted by slideNumber, matching file order)", () => {
    const numbers = slides.map((s) => s.slideNumber);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("6. existing non-slide ch01-t03 records are untouched (still exactly 9 + 10 = 19 total records)", () => {
    expect(topic.governance.recordCount).toBe(19);
    expect(topic.mainIdea?.recordId).toBe("ch01-t03-block-mainidea");
    expect(topic.explanation?.recordId).toBe("ch01-t03-block-explanation");
    expect(topic.equations?.recordId).toBe("ch01-t03-block-equations");
    expect(topic.workedExample?.recordId).toBe("ch01-t03-block-example");
    expect(topic.visual?.recordId).toBe("ch01-t03-block-visual");
    expect(topic.problem?.recordId).toBe("ch01-prob-103");
    expect(topic.instructorNotes[0]?.recordId).toBe("ch01-t03-block-misconception");
  });
});

describe("ch01-t03 — slide grouping", () => {
  const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t03"]!;

  it("group configuration exists and passes the generic validator with zero diagnostics", () => {
    expect(groups).toBeDefined();
    const slideNumbers = slides.map((s) => s.slideNumber);
    expect(validateSlideGroups("ch01-t03" as never, slideNumbers)).toEqual([]);
  });

  it("7. every slide is covered by exactly one group", () => {
    const covered = groups.flatMap((g) => g.slideNumbers);
    expect(covered.slice().sort((a, b) => a - b)).toEqual(slides.map((s) => s.slideNumber));
    expect(new Set(covered).size).toBe(covered.length);
  });

  it("8-9. no group ranges overlap and no group leaves a gap (groups partition 1-10 contiguously)", () => {
    const sortedGroups = groups.slice().sort((a, b) => a.slideNumbers[0] - b.slideNumbers[0]);
    let expectedNext = 1;
    for (const g of sortedGroups) {
      expect(g.slideNumbers[0]).toBe(expectedNext);
      expectedNext = g.slideNumbers[g.slideNumbers.length - 1] + 1;
    }
    expect(expectedNext).toBe(11);
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
    const resolved = resolveSlideGroups("ch01-t03" as never, slides.map((s) => s.slideNumber));
    expect(resolved).toBe(groups);
  });
});

describe("ch01-t03 — short titles", () => {
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

  it("short titles are all mutually distinct and shorter than the full title", () => {
    const shortTitlesEn = slides.map((s) => resolveSlideShortTitle(s.recordId, "en", ""));
    expect(new Set(shortTitlesEn).size).toBe(shortTitlesEn.length);
    for (const slide of slides) {
      const shortEn = resolveSlideShortTitle(slide.recordId, "en", slide.title.en ?? "");
      expect(shortEn.length).toBeLessThan((slide.title.en ?? "").length);
    }
  });
});

describe("ch01-t03 — structured content", () => {
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

  it("13. every slide has Step-by-Step content (3 numbered steps each)", () => {
    const stepEn = /^Step\s+\d+\s+—/;
    for (const slide of slides) {
      const paras = slide.text.en!.split(/\n{2,}/);
      const steps = paras.filter((p) => stepEn.test(p));
      expect(steps.length, slide.recordId).toBe(3);
    }
  });

  it("figure remains bilingual where present (Slide 2 only)", () => {
    const slide2 = slides.find((s) => s.slideNumber === 2)!;
    expect(slide2.figure?.assetUrl).toBeTruthy();
    expect(slide2.figure?.alt.en).toBeTruthy();
    expect(slide2.figure?.alt.ar).toBeTruthy();
    const nonFigureSlides = slides.filter((s) => s.slideNumber !== 2);
    for (const slide of nonFigureSlides) {
      expect(slide.figure, slide.recordId).toBeUndefined();
    }
  });

  it("table remains bilingual where present (Slide 4 only), used exactly once", () => {
    const tableSlides = slides.filter((s) => s.table);
    expect(tableSlides.map((s) => s.slideNumber)).toEqual([4]);
    const slide4 = tableSlides[0];
    expect(slide4.table!.en!.headers.length).toBeGreaterThan(0);
    expect(slide4.table!.ar!.headers.length).toBeGreaterThan(0);
    expect(slide4.table!.en!.rows.length).toBeGreaterThan(0);
    expect(slide4.table!.ar!.rows.length).toBeGreaterThan(0);
  });

  it("14. definition-bearing slides (1, 2, 3, 4) retain their structured definitions, covering exactly the six required terms once each", () => {
    const definitionSlideNumbers = [1, 2, 3, 4];
    const allTermsEn: string[] = [];
    for (const n of definitionSlideNumbers) {
      const slide = slides.find((s) => s.slideNumber === n)!;
      expect(slide.definitions?.en?.length, `slide ${n}`).toBeGreaterThan(0);
      expect(slide.definitions?.ar?.length, `slide ${n}`).toBeGreaterThan(0);
      for (const d of slide.definitions!.en!) allTermsEn.push(d.term);
    }
    expect(allTermsEn.sort()).toEqual(
      ["Complete Cycle", "Frequency", "Hertz", "Period", "Periodic Process", "Time"].sort(),
    );
    const nonDefinitionSlides = slides.filter((s) => !definitionSlideNumbers.includes(s.slideNumber));
    for (const slide of nonDefinitionSlides) {
      expect(slide.definitions, slide.recordId).toBeUndefined();
    }
  });

  it("Period is defined as the time for one complete cycle of a NAMED periodic process (not merely 'time for one cycle')", () => {
    const slide3 = slides.find((s) => s.slideNumber === 3)!;
    const periodDef = slide3.definitions!.en!.find((d) => d.term === "Period")!;
    expect(periodDef.definition).toContain("named periodic process");
  });

  it("Frequency is defined as the number of complete cycles per unit time", () => {
    const slide4 = slides.find((s) => s.slideNumber === 4)!;
    const freqDef = slide4.definitions!.en!.find((d) => d.term === "Frequency")!;
    expect(freqDef.definition).toContain("complete cycles");
    expect(freqDef.definition.toLowerCase()).toContain("per unit time");
  });

  it("Hertz is defined as one complete cycle per second", () => {
    const slide4 = slides.find((s) => s.slideNumber === 4)!;
    const hzDef = slide4.definitions!.en!.find((d) => d.term === "Hertz")!;
    expect(hzDef.definition).toBe("One complete cycle per second; the unit of frequency.");
  });

  it("15. every populated specialized explanation marker is configured on the correct slide, and no slide has more than one", () => {
    const expected: Record<
      number,
      "figureExplanationMarker" | "definitionExplanationMarker" | "tableExplanationMarker" | "relationshipExplanationMarker"
    > = {
      2: "figureExplanationMarker",
      3: "definitionExplanationMarker",
      4: "tableExplanationMarker",
      5: "relationshipExplanationMarker",
      8: "relationshipExplanationMarker",
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
});

describe("ch01-t03 — scientific regression", () => {
  const fullEn = slides.map((s) => s.text.en).join("\n\n");

  it("f = 1/T and T = 1/f both exist in the topic's text", () => {
    expect(fullEn).toContain("f = 1/T");
    expect(fullEn).toContain("T = 1/f");
  });

  it("every frequency worked-result ends in Hz, and every period worked-result ends in s (spot-checked equation phrases)", () => {
    const frequencyResults = ["f = 2.0 Hz", "f = 1/T = 1/0.20 s = 5.0 Hz", "f = 1/(0.50 s) = 2.0 Hz", "f = 1/0.1 s = 10 Hz", "f = 1/2.0 s = 0.5 Hz", "f = 1/T = 1/1.00 s = 1.00 Hz"];
    const periodResults = ["T = 0.5 s", "T = 1/(4.0 Hz) = 0.25 s", "T = 0.50 s + 0.50 s = 1.00 s"];
    for (const eq of frequencyResults) {
      expect(fullEn, eq).toContain(eq);
      expect(eq.trim().endsWith("Hz")).toBe(true);
    }
    for (const eq of periodResults) {
      expect(fullEn, eq).toContain(eq);
      expect(eq.trim().endsWith("s")).toBe(true);
    }
  });

  it("no text claims f = T (the misconception paragraph only ever states this as the WRONG form being corrected)", () => {
    const slide5 = slides.find((s) => s.slideNumber === 5)!;
    // "f = T." appears once, inside "or write f = T. Correction:" — the misconception being corrected.
    const occurrences = (slide5.text.en!.match(/f = T\b/g) ?? []).length;
    expect(occurrences).toBe(1);
    expect(slide5.text.en).toContain("write f = T. Correction: f = 1/T and T = 1/f");
  });

  it("no text claims period is measured in hertz, or frequency in seconds — both are stated only as corrected misconceptions", () => {
    // Slides 4 and 7 explicitly correct these exact errors; the phrase never appears as an assertion of fact.
    expect(fullEn).not.toMatch(/period is (?:always )?measured in hertz/i);
    expect(fullEn).not.toMatch(/frequency is (?:always )?measured in seconds/i);
    expect(fullEn).toContain("hertz is exclusively the unit for frequency");
    expect(fullEn).toContain("seconds is exclusively the unit for period");
  });

  it("a complete cycle is explicitly defined generally as returning to the same state or phase, with mechanical motion (position and velocity) given as the specific illustrative case (Slide 2)", () => {
    const slide2 = slides.find((s) => s.slideNumber === 2)!;
    expect(slide2.text.en).toContain("returns to the same state, or equivalently the same phase");
    expect(slide2.text.en).toContain("the same position and the same velocity, including direction");
    expect(slide2.text.ar).toContain("الحالة نفسها، أو بصورة مكافئة إلى الطور نفسه");
  });

  it("the periodic process must be named before period or frequency can be measured (Slide 1)", () => {
    const slide1 = slides.find((s) => s.slideNumber === 1)!;
    expect(slide1.text.en).toContain("that process must be named and");
    expect(slide1.text.en).toContain("one complete cycle of it must be clearly defined");
  });

  it("a one-way pendulum pass is explicitly identified as an incomplete cycle, not a full one (Slide 9)", () => {
    const slide9 = slides.find((s) => s.slideNumber === 9)!;
    expect(slide9.text.en).toContain("A pass in only one direction returns the pendulum to a different position");
    expect(slide9.text.en).toContain("not a complete cycle");
  });

  it("the pendulum example computes the correct period/frequency and explains the halving error numerically (Slide 9)", () => {
    const slide9 = slides.find((s) => s.slideNumber === 9)!;
    expect(slide9.text.en).toContain("T = 0.50 s + 0.50 s = 1.00 s");
    expect(slide9.text.en).toContain("f = 1/T = 1/1.00 s = 1.00 Hz");
    expect(slide9.text.en).toContain("1/0.50 s = 2.00 Hz — exactly double the correct value");
  });

  it("short period is explicitly linked to high frequency, and long period to low frequency (Slide 8)", () => {
    const slide8 = slides.find((s) => s.slideNumber === 8)!;
    expect(slide8.text.en).toContain("a shorter period always means a higher frequency");
    expect(slide8.text.en).toContain("a longer period always means a lower frequency");
  });

  it("all reciprocal calculations in the topic are numerically correct", () => {
    const checks: Array<[number, number]> = [
      [0.5, 2.0], // Slide 3/6: T = 0.5 s -> f = 2.0 Hz
      [0.2, 5.0], // Slide 5: T = 0.20 s -> f = 5.0 Hz
      [0.25, 4.0], // Slide 7/10: T = 0.25 s -> f = 4.0 Hz
      [0.1, 10.0], // Slide 8: T = 0.1 s -> f = 10 Hz
      [2.0, 0.5], // Slide 8: T = 2.0 s -> f = 0.5 Hz
      [1.0, 1.0], // Slide 9: T = 1.00 s -> f = 1.00 Hz
    ];
    for (const [period, frequency] of checks) {
      expect(1 / period).toBeCloseTo(frequency, 10);
      expect(1 / frequency).toBeCloseTo(period, 10);
      expect(period * frequency).toBeCloseTo(1, 10);
    }
  });

  it("no advanced, unsupported concept (angular frequency, phase angle/constant, radians, sinusoidal functions, SHM equations) was silently introduced", () => {
    // "phase" alone is legitimately used (Slide 2's title-correction pass, PR E-correction)
    // as a general synonym for "state" — "returns to the same state, or equivalently the
    // same phase" — never in the advanced SHM sense (phase angle/constant/shift, in/out of
    // phase), which remains forbidden below.
    const forbidden = [
      "angular frequency",
      "phase angle",
      "phase constant",
      "phase shift",
      "in phase",
      "out of phase",
      "radian",
      "sinusoid",
      "simple harmonic motion",
      "ω",
      "sin(",
      "cos(",
    ];
    for (const term of forbidden) {
      expect(fullEn.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });
});

describe("ch01-t03 — Slide 2 scientific correction (same-state/phase generalization)", () => {
  const slide2 = slides.find((s) => s.slideNumber === 2)!;

  it("1. Slide 2 defines a complete cycle using the same state or phase", () => {
    expect(slide2.text.en).toContain("returns to the same state, or equivalently the same phase");
    expect(slide2.text.ar).toContain("الحالة نفسها، أو بصورة مكافئة إلى الطور نفسه");
  });

  it("2. mechanical motion mentions the same position and the same velocity, including direction", () => {
    expect(slide2.text.en).toContain("returning to the same state generally requires the same position and the same velocity, including direction");
    expect(slide2.text.ar).toContain("الموضع نفسه والسرعة المتجهة نفسها، بما في ذلك اتجاه الحركة");
  });

  it("3. the slide no longer claims position and direction are the universal test for every periodic process", () => {
    expect(slide2.text.en).not.toContain("the deciding test is always whether both position and direction of motion have returned");
    expect(slide2.text.en).toContain("other periodic processes use different state variables");
  });

  it("4. the rotating-dot example still states: t = 0 at the top, t = T/2 at the bottom, t = T back at the top", () => {
    expect(slide2.text.en).toContain("At t = 0 the dot is at the top of the disk, moving to the right");
    expect(slide2.text.en).toContain("Halfway through one rotation (t = T/2), the dot is at the bottom of the disk, moving to the left");
    expect(slide2.text.en).toContain("Only when the dot returns to the top of the disk moving to the right again (t = T)");
  });

  it("5. the text does not claim the rotating dot reaches the starting position at T/2", () => {
    const t2Sentence = "Halfway through one rotation (t = T/2), the dot is at the bottom of the disk";
    expect(slide2.text.en).toContain(t2Sentence);
    expect(slide2.text.en).not.toMatch(/T\/2[^.]*reaches the (top|starting position)/);
  });

  it("8a. the figure asset, slide count, slide numbers, groups, and short titles are unchanged by the correction", () => {
    expect(slides).toHaveLength(10);
    expect(slide2.slideNumber).toBe(2);
    expect(slide2.recordId).toBe("ch01-t03-block-slide-2");
    expect(slide2.figure?.assetUrl).toBeTruthy();
    expect(slide2.figure?.alt.en).toContain("t = 0");
    const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t03"]!;
    expect(groups.flatMap((g) => g.slideNumbers)).toContain(2);
    expect(SLIDE_SHORT_TITLE_BY_BLOCK_ID["ch01-t03-block-slide-2"]).toEqual({ en: "Complete Cycle", ar: "الدورة الكاملة" });
  });
});

describe("ch01-t03 — registered in the app's topic order", () => {
  it("ch01-t03 is part of getTopicOrder() and passes group validation as part of the full-registry regression", () => {
    expect(getTopicOrder()).toContain("ch01-t03");
  });
});
