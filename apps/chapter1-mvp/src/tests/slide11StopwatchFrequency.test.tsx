// @vitest-environment jsdom
//
// Tests for Slide 11 ("How Do We Calculate Frequency and Period from a
// Cycle Count?"), added as an eleventh sibling under ch01-t01's existing
// Slides accordion (ch01-t01-block-opening-11, blockType "slide" — the
// same generic, reusable slide blockType shared with Slides 1-10). Covers
// the 19 checks explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide10PeriodFrequencyHertz.test.tsx
// and the shared accordion helpers from
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
const slide8 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-8")!;
const slide9 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-9")!;
const slide10 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-10")!;
const slide11 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-11")!;

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 11 appears eleventh", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 11] by slideNumber", () => {
    expect(topic.slides.map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
      "ch01-t01-block-opening-7",
      "ch01-t01-block-opening-8",
      "ch01-t01-block-opening-9",
      "ch01-t01-block-opening-10",
      "ch01-t01-block-opening-11",
    ]);
    expect(topic.slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  it("Slide 11's header follows Slide 10's header in DOM order, all eleven under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide10Idx = order.indexOf("slide-10-header");
    const slide11Idx = order.indexOf("slide-11-header");
    expect(slide10Idx).toBeGreaterThanOrEqual(0);
    expect(slide11Idx).toBeGreaterThan(slide10Idx);
    expect(container.querySelectorAll(".slides-section .slide")).toHaveLength(11);
  });

  it("Slide 11's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 11);
    expect(getSlidePanel(container, 11)?.textContent).toContain(
      "Slide 11 — How Do We Calculate Frequency and Period from a Cycle Count?",
    );
    remount();
    renderSlides(true, 11);
    expect(getSlidePanel(container, 11)?.textContent).toContain(
      "الشريحة 11 — كيف نحسب التردد والزمن الدوري من عدد الدورات؟",
    );
  });
});

describe("2. Slides 1-10 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 11", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 11", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 11", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 11", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table is unaffected by adding Slide 11", () => {
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 7's corrected significant-figures wording is unaffected by adding Slide 11", () => {
    expect(slide7.text.en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
  });

  it("Slide 8's table is unaffected by adding Slide 11", () => {
    expect(slide8.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 9's definition cards are unaffected by adding Slide 11", () => {
    expect(slide9.definitions?.en?.map((d) => d.term)).toEqual(["Period", "Frequency"]);
  });

  it("Slide 10's relationship explanation and equations are unaffected by adding Slide 11", () => {
    expect(slide10.text.en).toContain("Relationship Explanation:");
    expect(slide10.text.en).toContain("91.5 MHz = 9.15 × 10⁷ Hz");
  });

  it("Slides 1-10 render their own content unchanged when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 6);
    expect(getSlidePanel(container, 6)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 9);
    expect(
      getSlidePanel(container, 9)?.querySelectorAll(".structured-slide__definition-card"),
    ).toHaveLength(2);

    openSlideByNumber(container, 10);
    expect(getSlidePanel(container, 10)?.textContent).toContain("Relationship Explanation");
  });
});

describe("3. Slide 11 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-11 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide11).toBeDefined();
    expect(slide11.recordId).toBe("ch01-t01-block-opening-11");
    expect(slide11.slideNumber).toBe(11);
  });

  it("NormalizedTopic carries no Slide-11-specific field — topic.slides is the only place Slide 11's data lives", () => {
    expect(Object.keys(topic)).not.toContain("slide11");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-11")).toBe(true);
  });

  it("Slide 11 renders via the exact same generic topic.slides.map(...) as Slides 1-10 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide")).toHaveLength(11);
    expect(container.querySelector("#slide-11-header")).not.toBeNull();
  });

  it("Slide 11's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[10]).toBe("Stopwatch Frequency");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[10]).toBe("تردد ساعة الإيقاف");
  });
});

describe("4. Accordion count and jump options update to 11", () => {
  it("11 accordion headers render, numbered 1-11", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]);
  });

  it("the jump select offers 11 options, including Slide 11", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBe(11);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-11");
  });

  it("the viewed-progress denominator is 11", () => {
    renderSlides(false);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      "Slides viewed: 1 of 11",
    );
  });
});

describe("5. Slide 10's Next button opens Slide 11", () => {
  it("clicking Next from Slide 10 opens Slide 11 and moves focus to its header", () => {
    renderSlides(false, 10);
    const panel10 = getSlidePanel(container, 10)!;
    const nextButton = Array.from(panel10.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 11)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 10)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 11));
  });
});

describe("6. Slide 11's Previous button opens Slide 10", () => {
  it("clicking Previous from Slide 11 opens Slide 10 and moves focus to its header", () => {
    renderSlides(false, 11);
    const panel11 = getSlidePanel(container, 11)!;
    const prevButton = Array.from(panel11.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 10)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 10));
  });
});

describe("7. Slide 11's Next button is disabled (final slide)", () => {
  it("Next is disabled and the pager reads 'Slide 11 of 11'", () => {
    renderSlides(false, 11);
    const panel11 = getSlidePanel(container, 11)!;
    const nextButton = Array.from(panel11.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
    expect(panel11.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      "Slide 11 of 11",
    );
  });
});

describe("8. Original English problem and source calculations are preserved", () => {
  it("the verbatim problem statement and both questions are present, unaltered", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("Example 1.1");
    expect(en).toContain(
      "A mechanical stopwatch uses a balance wheel that rotates back and forth 10 times in 2 seconds. What is the frequency of the balance wheel?",
    );
    expect(en).toContain("What is the period of the balance wheel?");
  });

  it("the verbatim source calculations are preserved exactly, not silently altered or qualified", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("frequency = number of cycles per time");
    expect(en).toContain("f = 10 cycles / 2 s = 5 Hz");
    expect(en).toContain("period = time for one cycle");
    expect(en).toContain("period = 1 divided by the frequency");
    expect(en).toContain("T = 1 / 5 Hz = 0.2 s");
  });

  it("the Arabic translation of the original source is preserved, including the same calculations", () => {
    const ar = slide11.text.ar ?? "";
    expect(ar).toContain("مثال 1.1");
    expect(ar).toContain(
      "تستخدم ساعة إيقاف ميكانيكية عجلة اتزان تتحرك ذهابًا وإيابًا 10 مرات خلال ثانيتين. ما تردد عجلة الاتزان؟",
    );
    expect(ar).toContain("f = 10 دورات / 2 s = 5 Hz");
    expect(ar).toContain("T = 1 / 5 Hz = 0.2 s");
  });

  it("renders the original English problem statement in the DOM when Slide 11 is opened", () => {
    renderSlides(false, 11);
    expect(getSlidePanel(container, 11)?.textContent).toContain(
      "A mechanical stopwatch uses a balance wheel that rotates back and forth 10 times in 2 seconds.",
    );
  });
});

describe("9. f = N / Δt renders correctly", () => {
  it("Step 2, the Relationship Explanation, the Scientific Note, and the Key Concept all state f = N / Δt", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("f = N / Δt");
  });

  it("renders as a distinct equation block inside Step 2", () => {
    renderSlides(false, 11);
    const blocks = Array.from(
      getSlidePanel(container, 11)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("f = N / Δt");
  });
});

describe("10. f = 10 cycles / 2 s = 5 Hz renders correctly", () => {
  it("Step 2 and Step 3 build up to the calculated frequency", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("f = 10 cycles / 2 s");
    expect(en).toContain("f = 5 cycles/s");
    expect(en).toContain("f = 5 Hz");
    expect(10 / 2).toBe(5);
  });

  it("renders the calculation clause as a distinct equation block inside Step 2", () => {
    renderSlides(false, 11);
    const blocks = Array.from(
      getSlidePanel(container, 11)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("f = 10 cycles / 2 s");
    expect(blocks).toContain("f = 5 Hz");
  });
});

describe("11. T = 1 / (5 Hz) = 0.2 s renders correctly in organized content", () => {
  it("Step 4 and Step 5 use the parenthesized denominator, distinct from the verbatim ungrouped form", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("T = 1 / (5 Hz)");
    expect(en).toContain("T = 0.2 s");
    expect(1 / 5).toBe(0.2);
  });

  it("the verbatim Original English section keeps the ungrouped 'T = 1 / 5 Hz = 0.2 s' form unchanged", () => {
    const en = slide11.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).toContain("T = 1 / 5 Hz = 0.2 s");
    expect(original).not.toContain("T = 1 / (5 Hz)");
  });

  it("renders the organized parenthesized form as a distinct equation block inside Step 4", () => {
    renderSlides(false, 11);
    const blocks = Array.from(
      getSlidePanel(container, 11)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("T = 1 / (5 Hz)");
  });
});

describe("12. f T = (5 s⁻¹)(0.2 s) = 1 renders correctly", () => {
  it("Step 5 verifies the reciprocal relationship numerically", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("f T = (5 s⁻¹)(0.2 s) = 1");
    expect(5 * 0.2).toBe(1);
  });

  it("renders as a distinct equation block inside Step 5", () => {
    renderSlides(false, 11);
    const blocks = Array.from(
      getSlidePanel(container, 11)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("f T = (5 s⁻¹)(0.2 s) = 1");
  });
});

describe("13. The Simple Example produces 4.0 Hz and 0.25 s", () => {
  it("English Simple Example states the question and both worked equations", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain("Simple Example: A wheel completes 12 cycles in 3.0 s.");
    expect(en).toContain("f = 12 cycles / 3.0 s = 4.0 Hz");
    expect(en).toContain("T = 1 / (4.0 Hz) = 0.25 s");
    expect(en).toContain("The wheel completes four cycles per second, and each cycle takes 0.25 s.");
    expect(12 / 3).toBe(4);
    expect(1 / 4).toBe(0.25);
  });

  it("renders both equations as distinct equation blocks in the DOM", () => {
    renderSlides(false, 11);
    const blocks = Array.from(
      getSlidePanel(container, 11)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("f = 12 cycles / 3.0 s = 4.0 Hz");
    expect(blocks).toContain("T = 1 / (4.0 Hz) = 0.25 s");
  });

  it("the Arabic Simple Example preserves the same equations, untranslated", () => {
    const ar = slide11.text.ar ?? "";
    expect(ar).toContain("f = 12 cycles / 3.0 s = 4.0 Hz");
    expect(ar).toContain("T = 1 / (4.0 Hz) = 0.25 s");
    expect(ar).toContain("تكمل العجلة أربع دورات في كل ثانية، وتستغرق كل دورة 0.25 s.");
  });
});

describe("14. f and T render as variables while units remain upright", () => {
  it("the standalone physical symbols 'f' and 'T' are italicized", () => {
    renderSlides(false, 11);
    const emTexts = Array.from(getSlidePanel(container, 11)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).toContain("f");
    expect(emTexts).toContain("T");
  });

  it("'s', 'Hz', and 'cycles/s' are never italicized (unit symbols, not variables)", () => {
    renderSlides(false, 11);
    const emTexts = Array.from(getSlidePanel(container, 11)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).not.toContain("s");
    expect(emTexts).not.toContain("Hz");
    expect(emTexts).not.toContain("cycles/s");
  });

  it("'N' renders entirely upright — no whitelist entry was added for it", () => {
    renderSlides(false, 11);
    const emTexts = Array.from(getSlidePanel(container, 11)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).not.toContain("N");
    const panelText = getSlidePanel(container, 11)!.textContent ?? "";
    expect(panelText).toContain("N = 10 cycles");
  });

  it("'Δt' renders with 'Δ' upright and 't' italic (no new whitelist entry — 't' was already whitelisted for ch01-t01 from Slide 1's v = d / t, and the existing word-boundary regex matches it immediately after 'Δ'; this matches the common physics-typesetting convention of an upright Δ operator applied to an italicized quantity symbol)", () => {
    renderSlides(false, 11);
    const panelText = getSlidePanel(container, 11)!.textContent ?? "";
    expect(panelText).toContain("Δt = 2 s");
    const emTexts = Array.from(getSlidePanel(container, 11)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).not.toContain("Δt");
    expect(emTexts).toContain("t");
  });
});

describe("15. The cycle-definition misconception renders in both languages", () => {
  it("the English Common Misconception explains the one-way-motion error", () => {
    const en = slide11.text.en ?? "";
    expect(en).toContain(
      "Misconception: moving from one side to the other is always one complete cycle.",
    );
    expect(en).toContain(
      "Correction: a cycle must return the system to its starting position and state of motion.",
    );
    expect(en).toContain("Counting each one-way motion as a full cycle would double the frequency incorrectly.");
  });

  it("the Arabic Common Misconception preserves the same explanation", () => {
    const ar = slide11.text.ar ?? "";
    expect(ar).toContain("مفهوم خاطئ: تمثل الحركة من جانب إلى الجانب الآخر دائمًا دورة كاملة.");
    expect(ar).toContain(
      "التصحيح: يجب أن تعيد الدورة النظام إلى موضع البداية وحالة الحركة نفسها.",
    );
  });

  it("renders the misconception callout in the DOM in both languages", () => {
    renderSlides(false, 11);
    expect(getSlidePanel(container, 11)?.textContent).toContain(
      "moving from one side to the other is always one complete cycle",
    );
    remount();
    renderSlides(true, 11);
    expect(getSlidePanel(container, 11)?.textContent).toContain(
      "تمثل الحركة من جانب إلى الجانب الآخر دائمًا دورة كاملة",
    );
  });
});

describe("16. Arabic RTL renders correctly", () => {
  it("the structured slide content carries dir=\"rtl\" in Arabic and dir=\"ltr\" in English", () => {
    renderSlides(true, 11);
    const arSection = getSlidePanel(container, 11)!.querySelector("[dir]");
    expect(arSection?.getAttribute("dir")).toBe("rtl");

    remount();
    renderSlides(false, 11);
    const enSection = getSlidePanel(container, 11)!.querySelector("[dir]");
    expect(enSection?.getAttribute("dir")).toBe("ltr");
  });

  it("the Arabic panel renders the translated Main Idea and Key Concept", () => {
    renderSlides(true, 11);
    const panelText = getSlidePanel(container, 11)!.textContent ?? "";
    expect(panelText).toContain("يُحسب التردد بقسمة عدد الدورات الكاملة على الزمن المنقضي");
    expect(panelText).toContain("المفهوم الأساسي");
  });
});

describe("17. Slide 11 persistence works across reload", () => {
  it("opening Slide 11, then remounting fresh, restores Slide 11 as open", () => {
    renderSlides(false, 11);
    expect(getSlideHeader(container, 11)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 11)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("Slide 11's recordId is written to the same topic-namespaced localStorage key used by every other slide", () => {
    renderSlides(false, 11);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-11",
    );
  });
});

describe("18. No source screenshot is rendered student-facing", () => {
  it("Slide 11's panel contains no <img> element anywhere", () => {
    renderSlides(false, 11);
    expect(getSlidePanel(container, 11)!.querySelectorAll("img")).toHaveLength(0);
    remount();
    renderSlides(true, 11);
    expect(getSlidePanel(container, 11)!.querySelectorAll("img")).toHaveLength(0);
  });

  it("slide11.figure is undefined — no figure asset exists for this record", () => {
    expect(slide11.figure).toBeUndefined();
  });
});

describe("19. Governance remains blocked and publication unauthorized", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide11.blocking.studentFacingAllowed).toBe(false);
    expect(slide11.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 11's blockingReason does NOT include missingVisual (the source has no instructional figure)", () => {
    expect(slide11.blocking.blockingReason).toContain("translationPending");
    expect(slide11.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide11.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-10's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(18);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.studentFacingAllowed).toBe(false);
    expect(slide7.blocking.studentFacingAllowed).toBe(false);
    expect(slide8.blocking.studentFacingAllowed).toBe(false);
    expect(slide9.blocking.studentFacingAllowed).toBe(false);
    expect(slide10.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide7.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide8.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide9.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide10.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
  });
});
