// @vitest-environment jsdom
//
// Tests for Slide 7 ("How Do We Convert 23 Meters to Feet Correctly?"),
// added as a seventh sibling under ch01-t01's existing Slides accordion
// (ch01-t01-block-opening-7, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1-6). Covers the 18 checks
// explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide6AreaVolumeUnits.test.tsx and
// the shared accordion helpers from
// src/tests/testHelpers/slidesTestHelpers.tsx (only one slide's panel is
// mounted at a time, so any assertion about a slide's rendered content
// opens that slide first via openSlideByNumber).
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { getTopic } from "../content/adapter";
import {
  renderGenericSlides as renderGenericSlidesShared,
  openSlideByNumber,
  getSlideHeader,
  getSlidePanel,
} from "./testHelpers/slidesTestHelpers";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const topic = getTopic("ch01-t01")!;
const slide1 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening")!;
const slide2 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-2")!;
const slide3 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-3")!;
const slide4 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-4")!;
const slide5 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-5")!;
const slide6 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-6")!;
const slide7 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-7")!;

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 7 appears seventh", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 7, ...] by slideNumber, with Slide 7 seventh", () => {
    // Sliced to the first seven, not an exact-length equality: a later
    // slide (e.g. Slide 8, see slide8TimeMeasurement.test.tsx) may follow
    // Slide 7.
    expect(topic.slides.slice(0, 7).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
      "ch01-t01-block-opening-7",
    ]);
    expect(topic.slides.slice(0, 7).map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("Slide 7's header follows Slide 6's header in DOM order, all seven under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide6Idx = order.indexOf("slide-6-header");
    const slide7Idx = order.indexOf("slide-7-header");
    expect(slide6Idx).toBeGreaterThanOrEqual(0);
    expect(slide7Idx).toBeGreaterThan(slide6Idx);
    // >= 7, not exactly 7: a later slide (e.g. Slide 8) may have been
    // added since.
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(7);
  });

  it("Slide 7's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 7);
    expect(getSlidePanel(container, 7)?.textContent).toContain(
      "Slide 7 — How Do We Convert 23 Meters to Feet Correctly?",
    );
    remount();
    renderSlides(true, 7);
    expect(getSlidePanel(container, 7)?.textContent).toContain(
      "الشريحة 7 — كيف نحوّل 23 مترًا إلى أقدام بطريقة صحيحة؟",
    );
  });
});

describe("2. Slides 1-6 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 7", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 7", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 7", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 7", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table and superscript units are unaffected by adding Slide 7", () => {
    expect(slide6.text.en).toContain("square meter (m2)");
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slides 1-6 render their own content unchanged when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 3);
    expect(getSlidePanel(container, 3)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 6);
    expect(getSlidePanel(container, 6)?.querySelector("table.structured-slide__table")).not.toBeNull();
  });
});

describe("3. Slide 7 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-7 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide7).toBeDefined();
    expect(slide7.recordId).toBe("ch01-t01-block-opening-7");
    expect(slide7.slideNumber).toBe(7);
  });

  it("NormalizedTopic carries no Slide-7-specific field — topic.slides is the only place Slide 7's data lives", () => {
    expect(Object.keys(topic)).not.toContain("openingConceptSlide7");
    expect(Object.keys(topic)).not.toContain("slide7");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-7")).toBe(true);
  });

  it("Slide 7 renders via the exact same generic topic.slides.map(...) as Slides 1-6 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(7);
    expect(container.querySelector("#slide-7-header")).not.toBeNull();
  });

  it("Slide 7's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[6]).toBe("Meters to Feet");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[6]).toBe("التحويل من المتر إلى القدم");
  });

  it("Slide 7 has no table and no figure — a plain structured slide with a Conversion-Factor Explanation subsection instead", () => {
    expect(slide7.table).toBeUndefined();
    expect(slide7.figure).toBeUndefined();
    renderSlides(false, 7);
    expect(getSlidePanel(container, 7)!.querySelectorAll("img")).toHaveLength(0);
    expect(getSlidePanel(container, 7)!.querySelectorAll("table")).toHaveLength(0);
  });
});

describe("4. Accordion count and jump options include at least 7", () => {
  it("at least 7 accordion headers render, numbered 1-7 in order (later slides, e.g. Slide 8, may follow)", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers.slice(0, 7)).toEqual(["1", "2", "3", "4", "5", "6", "7"]);
  });

  it("the jump select offers at least 7 options, including Slide 7", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBeGreaterThanOrEqual(7);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-7");
  });

  it("the viewed-progress denominator is at least 7", () => {
    renderSlides(false);
    const text = container.querySelector(".slides-section__progress")?.textContent ?? "";
    const match = /Slides viewed: 1 of (\d+)/.exec(text);
    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(7);
  });
});

describe("5. Slide 6's Next button opens Slide 7", () => {
  it("clicking Next from Slide 6 opens Slide 7 and moves focus to its header", () => {
    renderSlides(false, 6);
    const panel6 = getSlidePanel(container, 6)!;
    const nextButton = Array.from(panel6.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 7));
  });
});

describe("6. Slide 7's Previous button opens Slide 6", () => {
  it("clicking Previous from Slide 7 opens Slide 6 and moves focus to its header", () => {
    renderSlides(false, 7);
    const panel7 = getSlidePanel(container, 7)!;
    const prevButton = Array.from(panel7.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 6));
  });
});

describe("7. Slide 7's Next button opens Slide 8 (Slide 7 is no longer the final slide)", () => {
  it("Next is enabled on Slide 7 and opens Slide 8 — the final-slide-disabled behavior now belongs to Slide 8 (see slide8TimeMeasurement.test.tsx and slidesAccordion.test.tsx's dynamic final-slide check)", () => {
    renderSlides(false, 7);
    const panel7 = getSlidePanel(container, 7)!;
    const nextButton = Array.from(panel7.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("8. Original English contains only the question, not the solution", () => {
  it("the verbatim heading and question are present, unaltered", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Converting Distance Measurements");
    expect(en).toContain("Example: Convert 23 meters to feet.");
  });

  it("no solution content (the worked calculation or final answer) appears before the Main Idea marker", () => {
    const en = slide7.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).not.toContain("75.45932");
    expect(original).not.toContain("75.5");
    expect(original).not.toContain("3.28084");
  });

  it("the Arabic translation of the original source is likewise question-only", () => {
    const ar = slide7.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية: تحويل قياسات المسافة");
    expect(ar).toContain("مثال: حوّل 23 مترًا إلى أقدام.");
    const mainIdeaIdx = ar.indexOf("الفكرة الرئيسية:");
    const original = ar.slice(0, mainIdeaIdx);
    expect(original).not.toContain("75.45932");
  });

  it("renders the original English quotation in the DOM when Slide 7 is opened", () => {
    renderSlides(false, 7);
    expect(getSlidePanel(container, 7)?.textContent).toContain("Example: Convert 23 meters to feet.");
  });
});

describe("9. The metric-to-English conversion relationship renders", () => {
  it("Step 2 states the approximate relationship 1 m ≈ 3.28084 ft", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("1 m ≈ 3.28084 ft");
  });

  it("renders in the DOM inside Slide 7's Step-by-Step Explanation", () => {
    renderSlides(false, 7);
    expect(getSlidePanel(container, 7)?.textContent).toContain("1 m ≈ 3.28084 ft");
  });
});

describe("10. The conversion factor has meters in the denominator", () => {
  it("Step 3's equation renders '23 m × (3.28084 ft / 1 m)' with 1 m as the denominator", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("23 m × (3.28084 ft / 1 m)");
  });

  it("renders Step 3's equation as a distinct equation block in the DOM", () => {
    renderSlides(false, 7);
    const blocks = Array.from(
      getSlidePanel(container, 7)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("23 m × (3.28084 ft / 1 m)");
  });
});

describe("11. The meter unit cancels, leaving feet", () => {
  it("Step 4 explains m / m = 1 so meters cancel and ft remains", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("m / m = 1, so the meter units cancel");
    expect(en).toContain("Only \"ft\" remains attached to the numerical result.");
  });

  it("does not depend on LaTeX \\cancel notation — Step 4 renders as plain styled text/list items", () => {
    renderSlides(false, 7);
    const panelHtml = getSlidePanel(container, 7)!.innerHTML;
    expect(panelHtml).not.toContain("\\cancel");
    expect(getSlidePanel(container, 7)!.textContent).toContain("m / m = 1");
  });
});

describe("12. Calculation '23 × 3.28084 = 75.45932' renders", () => {
  it("Step 5 states the multiplication result", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("23 × 3.28084 = 75.45932");
    expect(23 * 3.28084).toBeCloseTo(75.45932, 5);
  });

  it("renders in the DOM", () => {
    renderSlides(false, 7);
    expect(getSlidePanel(container, 7)?.textContent).toContain("23 × 3.28084 = 75.45932");
  });
});

describe("13. Final rounded results '23 m ≈ 75.5 ft' and '23 m ≈ 75 ft' both render, explicitly labeled", () => {
  it("Step 5 does NOT claim 75.5 ft is rounded to three significant figures (23 m has only two)", () => {
    const en = slide7.text.en ?? "";
    expect(en).not.toContain("Rounded to three significant figures, this becomes 23 m ≈ 75.5 ft");
    expect(en).toContain(
      "The calculated value is 75.45932 ft. Rounded to one decimal place, it is 75.5 ft. However, because the original measurement 23 m is written with two significant figures, the result based strictly on significant figures is approximately 75 ft.",
    );
  });

  it("renders both labeled results: 75.5 ft rounded to one decimal place, and 75 ft rounded to two significant figures", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
    expect(en).toContain("23 m ≈ 75 ft (rounded to two significant figures)");
  });

  it("the Common Misconception also includes the '23 m × (3.28084 ft / 1 m)' line, per the required content", () => {
    const en = slide7.text.en ?? "";
    const misconceptionIdx = en.indexOf("Misconception:");
    const misconceptionSection = en.slice(misconceptionIdx);
    expect(misconceptionSection).toContain("23 m × (3.28084 ft / 1 m)");
  });

  it("renders both labeled results in the DOM", () => {
    renderSlides(false, 7);
    const panelText = getSlidePanel(container, 7)?.textContent ?? "";
    expect(panelText).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
    expect(panelText).toContain("23 m ≈ 75 ft (rounded to two significant figures)");
  });

  it("the Arabic Step 5 renders the corrected explanation and both labeled results, as a single combined sentence", () => {
    const ar = slide7.text.ar ?? "";
    expect(ar).toContain(
      "القيمة المحسوبة هي 75.45932 ft. وعند التقريب إلى منزلة عشرية واحدة تصبح 75.5 ft. لكن بما أن القياس الأصلي 23 m مكتوب برقمين معنويين، فإن الناتج وفق قاعدة الأرقام المعنوية يساوي تقريبًا 75 ft.",
    );
    expect(ar).toContain("23 m ≈ 75.5 ft (مقرّبة إلى منزلة عشرية واحدة)");
    expect(ar).toContain("23 m ≈ 75 ft (مقرّبة إلى رقمين معنويين)");
  });
});

describe("14. Simple Example gives '5.00 m ≈ 16.4 ft', matched significant figures", () => {
  it("English Simple Example states the question, the worked equation, and the rounded result, with matching significant figures", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("Simple Example: Convert 5.00 m to feet.");
    expect(en).toContain("5.00 m × (3.28084 ft / 1 m) = 16.4042 ft");
    expect(en).toContain("5.00 m ≈ 16.4 ft");
    expect(en).toContain(
      "This result is rounded to three significant figures, matching the three significant figures in 5.00 m.",
    );
    expect(5 * 3.28084).toBeCloseTo(16.4042, 4);
  });

  it("renders the Simple Example's equation as a distinct equation block in the DOM", () => {
    renderSlides(false, 7);
    const blocks = Array.from(
      getSlidePanel(container, 7)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toEqual(["23 m × (3.28084 ft / 1 m)", "5.00 m × (3.28084 ft / 1 m) = 16.4042 ft"]);
  });

  it("the Arabic Simple Example preserves the same equations, untranslated, with the matching significant-figures sentence", () => {
    const ar = slide7.text.ar ?? "";
    expect(ar).toContain("مثال بسيط: حوّل 5.00 m إلى أقدام.");
    expect(ar).toContain("5.00 m × (3.28084 ft / 1 m) = 16.4042 ft");
    expect(ar).toContain("5.00 m ≈ 16.4 ft");
    expect(ar).toContain(
      "هذا الناتج مقرّب إلى ثلاثة أرقام معنوية، بما يتوافق مع الأرقام المعنوية الثلاثة في 5.00 m.",
    );
  });
});

describe("Conversion-Factor Explanation no longer implies the rounded ratio is exact", () => {
  it("states the exact relation (1 ft = 0.3048 m) and its approximate reciprocal (1 m = 3.28084 ft) distinctly", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain(
      "A conversion factor is formed from two equivalent measurements. The exact relation is 1 ft = 0.3048 m. Its reciprocal is approximately 1 m = 3.28084 ft, so the displayed conversion factor represents unity to the precision shown and changes only the unit representation.",
    );
    expect(en).not.toContain("dividing both sides by 0.3048 m gives 1 = 3.28084 ft / 1 m");
  });

  it("the Arabic Conversion-Factor Explanation matches", () => {
    const ar = slide7.text.ar ?? "";
    expect(ar).toContain(
      "يتكوّن عامل التحويل من قياسين متكافئين. والعلاقة الدقيقة هي 1 ft = 0.3048 m، أما مقلوبها فهو تقريبًا 1 m = 3.28084 ft.",
    );
  });
});

describe("15. '1 ft = 0.3048 m' is identified as an exact defined value", () => {
  it("the Scientific Note states both defined conversions as exact", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("1 in = 2.54 cm exactly");
    expect(en).toContain("1 ft = 0.3048 m exactly");
    expect(en).toContain("these are defined values, not measured approximations");
  });

  it("the Scientific Note identifies 1 m ≈ 3.28084 ft as the rounded reciprocal", () => {
    const en = slide7.text.en ?? "";
    expect(en).toContain("1 m ≈ 3.28084 ft is the rounded reciprocal of 1 ft = 0.3048 m");
    expect(1 / 0.3048).toBeCloseTo(3.28084, 4);
  });

  it("renders the Scientific Note in the DOM", () => {
    renderSlides(false, 7);
    const panelText = getSlidePanel(container, 7)?.textContent ?? "";
    expect(panelText).toContain("1 ft = 0.3048 m exactly");
  });
});

describe("16. Arabic RTL renders correctly", () => {
  it("Slide 7's panel content carries Arabic text with rtl direction attributes on its paragraphs/sections", () => {
    renderSlides(true, 7);
    const panel = getSlidePanel(container, 7)!;
    expect(panel.textContent).toContain("الفكرة الرئيسية");
    const rtlEls = panel.querySelectorAll('[dir="rtl"]');
    expect(rtlEls.length).toBeGreaterThan(0);
  });

  it("equations/notation inside Arabic prose stay untranslated and render left-to-right within their own run", () => {
    renderSlides(true, 7);
    const panel = getSlidePanel(container, 7)!;
    expect(panel.textContent).toContain("23 m × (3.28084 ft / 1 m)");
    const ltrRun = Array.from(panel.querySelectorAll(".equation-latin-run")).find((el) =>
      el.textContent?.includes("23 m × (3.28084 ft / 1 m)"),
    );
    expect(ltrRun).toBeDefined();
  });

  it("does not italicize the meter unit 'm' anywhere in Slide 7's rendered content (English or Arabic)", () => {
    renderSlides(false, 7);
    const emTextsEn = Array.from(getSlidePanel(container, 7)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTextsEn).not.toContain("m");

    remount();
    renderSlides(true, 7);
    const emTextsAr = Array.from(getSlidePanel(container, 7)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTextsAr).not.toContain("m");
  });
});

describe("17. Persistence restores Slide 7 when it was last open", () => {
  it("opening Slide 7, then remounting fresh, restores Slide 7 as open", () => {
    renderSlides(false, 7);
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("Slide 7's recordId is written to the same topic-namespaced localStorage key used by every other slide", () => {
    renderSlides(false, 7);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-7",
    );
  });
});

describe("18. Governance and publication flags remain correctly blocked", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide7.blocking.studentFacingAllowed).toBe(false);
    expect(slide7.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 7's blockingReason does NOT include missingVisual (no figure is required for this slide)", () => {
    expect(slide7.blocking.blockingReason).toContain("translationPending");
    expect(slide7.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide7.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-6's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(15);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    // Slides.tsx / SlidesSection never renders the banner itself — this is
    // a structural confirmation that adding Slide 7 introduced no change
    // to InternalStatusPanel or its governance inputs.
    expect(topic.governance.studentFacingAllowed).toBe(false);
  });
});

describe("Reusability — Slide 7 proves the architecture scales to a third mutually-exclusive Conversion-Factor Explanation slot without per-slide wiring", () => {
  it("all seven slides render via the exact same generic StructuredSlideContent, distinguished only by their own recordId-keyed config", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(7);
  });

  it("topic.slides remains a plain array where every slide has recordId/slideNumber/title.en/title.ar — no slide-count-specific schema", () => {
    expect(Array.isArray(topic.slides)).toBe(true);
    expect(topic.slides.length).toBeGreaterThanOrEqual(7);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });

  it("Slide 7's Conversion-Factor Explanation subsection renders in the same slot Slide 3's Table Explanation and Slide 4/5's Figure Explanation occupy, with none of the other two present on this record", () => {
    renderSlides(false, 7);
    const panel = getSlidePanel(container, 7)!;
    const headings = Array.from(panel.querySelectorAll(".structured-slide__heading")).map(
      (el) => el.textContent,
    );
    expect(headings).toContain("Conversion-Factor Explanation");
    expect(headings).not.toContain("Table Explanation");
    expect(headings).not.toContain("Figure Explanation");
  });
});
