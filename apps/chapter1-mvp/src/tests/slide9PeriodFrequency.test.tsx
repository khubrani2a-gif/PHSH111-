// @vitest-environment jsdom
//
// Tests for Slide 9 ("What Is the Difference Between Period and
// Frequency?"), added as a ninth sibling under ch01-t01's existing Slides
// accordion (ch01-t01-block-opening-9, blockType "slide" — the same
// generic, reusable slide blockType shared with Slides 1-8). Covers the 18
// checks explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide8TimeMeasurement.test.tsx and
// the shared accordion helpers from src/tests/testHelpers/slidesTestHelpers.tsx
// (only one slide's panel is mounted at a time, so any assertion about a
// slide's rendered content opens that slide first via openSlideByNumber).
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

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 9 appears ninth", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 9, ...] by slideNumber", () => {
    expect(topic.slides.slice(0, 9).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
      "ch01-t01-block-opening-7",
      "ch01-t01-block-opening-8",
      "ch01-t01-block-opening-9",
    ]);
    expect(topic.slides.slice(0, 9).map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("Slide 9's header follows Slide 8's header in DOM order, all nine under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide8Idx = order.indexOf("slide-8-header");
    const slide9Idx = order.indexOf("slide-9-header");
    expect(slide8Idx).toBeGreaterThanOrEqual(0);
    expect(slide9Idx).toBeGreaterThan(slide8Idx);
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(9);
  });

  it("Slide 9's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 9);
    expect(getSlidePanel(container, 9)?.textContent).toContain(
      "Slide 9 — What Is the Difference Between Period and Frequency?",
    );
    remount();
    renderSlides(true, 9);
    expect(getSlidePanel(container, 9)?.textContent).toContain(
      "الشريحة 9 — ما الفرق بين الزمن الدوري والتردد؟",
    );
  });
});

describe("2. Slides 1-8 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 9", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 9", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 9", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 9", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table is unaffected by adding Slide 9", () => {
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 7's corrected significant-figures wording is unaffected by adding Slide 9", () => {
    expect(slide7.text.en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
  });

  it("Slide 8's table is unaffected by adding Slide 9", () => {
    expect(slide8.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slides 1-8 render their own content unchanged when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 6);
    expect(getSlidePanel(container, 6)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 8);
    expect(getSlidePanel(container, 8)?.querySelector("table.structured-slide__table")).not.toBeNull();
  });
});

describe("3. Slide 9 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-9 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide9).toBeDefined();
    expect(slide9.recordId).toBe("ch01-t01-block-opening-9");
    expect(slide9.slideNumber).toBe(9);
  });

  it("NormalizedTopic carries no Slide-9-specific field — topic.slides is the only place Slide 9's data lives", () => {
    expect(Object.keys(topic)).not.toContain("slide9");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-9")).toBe(true);
  });

  it("Slide 9 renders via the exact same generic topic.slides.map(...) as Slides 1-8 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(9);
    expect(container.querySelector("#slide-9-header")).not.toBeNull();
  });

  it("Slide 9's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[8]).toBe("Period and Frequency");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[8]).toBe("الزمن الدوري والتردد");
  });
});

describe("4. Accordion count and jump options update to at least 9", () => {
  it("at least 9 accordion headers render, numbered 1-9 in order", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers.slice(0, 9)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  });

  it("the jump select offers at least 9 options, including Slide 9", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBeGreaterThanOrEqual(9);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-9");
  });

  it("the viewed-progress denominator is at least 9", () => {
    renderSlides(false);
    const text = container.querySelector(".slides-section__progress")?.textContent ?? "";
    const match = /Slides viewed: 1 of (\d+)/.exec(text);
    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(9);
  });
});

describe("5. Slide 8's Next button opens Slide 9", () => {
  it("clicking Next from Slide 8 opens Slide 9 and moves focus to its header", () => {
    renderSlides(false, 8);
    const panel8 = getSlidePanel(container, 8)!;
    const nextButton = Array.from(panel8.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 9));
  });
});

describe("6. Slide 9's Previous button opens Slide 8", () => {
  it("clicking Previous from Slide 9 opens Slide 8 and moves focus to its header", () => {
    renderSlides(false, 9);
    const panel9 = getSlidePanel(container, 9)!;
    const prevButton = Array.from(panel9.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 8));
  });
});

describe("7. Slide 9's Next button opens Slide 10 (Slide 9 is no longer the final slide)", () => {
  it("Next is enabled on Slide 9 and opens Slide 10 — the final-slide-disabled behavior now belongs to Slide 10 (see slide10PeriodFrequencyHertz.test.tsx and slidesAccordion.test.tsx's dynamic final-slide check)", () => {
    renderSlides(false, 9);
    const panel9 = getSlidePanel(container, 9)!;
    const nextButton = Array.from(panel9.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 10)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("8. Original English definitions are preserved verbatim", () => {
  it("the verbatim heading and both definitions are present, unaltered, including the plain (non-superscript) 's−1' notation", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Time");
    expect(en).toContain(
      "Period: The time for one complete cycle of a process that repeats. It is abbreviated T, and the units are seconds, minutes, and so forth.",
    );
    expect(en).toContain(
      "Frequency: The number of cycles of a periodic process that occur per unit time. It is abbreviated f and has units s−1 or hertz (Hz).",
    );
  });

  it("no equation is added inside the verbatim Original English subsection", () => {
    const en = slide9.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).not.toContain("f = 1 / T");
    expect(original).not.toContain("T = 1 / f");
  });

  it("the Arabic translation of the original source is preserved, using the source's own superscript 's⁻¹' notation", () => {
    const ar = slide9.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية: الزمن");
    expect(ar).toContain(
      "الزمن الدوري: الزمن اللازم لإكمال دورة واحدة كاملة من عملية متكررة. يُرمز إليه بالرمز T، وتكون وحداته الثانية والدقيقة وما شابه ذلك.",
    );
    expect(ar).toContain("ووحدته s⁻¹ أو الهرتز (Hz)");
  });

  it("renders the original English quotation in the DOM when Slide 9 is opened", () => {
    renderSlides(false, 9);
    expect(getSlidePanel(container, 9)?.textContent).toContain(
      "It is abbreviated T, and the units are seconds, minutes, and so forth.",
    );
  });
});

describe("9. Period/Frequency definition cards are semantic and accessible", () => {
  it("renders two <dl> elements, one per term, each with a single <dt>/<dd> pair", () => {
    renderSlides(false, 9);
    const cards = getSlidePanel(container, 9)!.querySelectorAll(
      ".structured-slide__definition-cards dl.structured-slide__definition-card",
    );
    expect(cards).toHaveLength(2);
    cards.forEach((card) => {
      expect(card.querySelectorAll("dt")).toHaveLength(1);
      expect(card.querySelectorAll("dd")).toHaveLength(1);
    });
  });

  it("the two cards' terms are 'Period' and 'Frequency', in that order", () => {
    renderSlides(false, 9);
    const terms = Array.from(
      getSlidePanel(container, 9)!.querySelectorAll(".structured-slide__definition-term"),
    ).map((el) => el.textContent);
    expect(terms).toEqual(["Period", "Frequency"]);
  });

  it("the reconstructed definitions use scientifically formatted superscript 's⁻¹', distinct from the plain source quote", () => {
    renderSlides(false, 9);
    const bodies = Array.from(
      getSlidePanel(container, 9)!.querySelectorAll(".structured-slide__definition-body"),
    ).map((el) => el.textContent);
    expect(bodies[1]).toContain("s⁻¹");
  });

  it("the decorative vertical 'DEFINI' lettering from the source image is not reproduced as content", () => {
    renderSlides(false, 9);
    expect(getSlidePanel(container, 9)!.textContent).not.toContain("DEFINI");
  });

  it("no screenshot <img> is rendered for the definition cards", () => {
    renderSlides(false, 9);
    expect(getSlidePanel(container, 9)!.querySelectorAll("img")).toHaveLength(0);
  });
});

describe("10. T and f render as italicized physical-symbol variables", () => {
  it("the standalone physical symbols 'T' and 'f' are italicized", () => {
    renderSlides(false, 9);
    const emTexts = Array.from(getSlidePanel(container, 9)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).toContain("T");
    expect(emTexts).toContain("f");
  });

  it("'s' and 'Hz' are never italicized (unit symbols, not variables)", () => {
    renderSlides(false, 9);
    const emTexts = Array.from(getSlidePanel(container, 9)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).not.toContain("s");
    expect(emTexts).not.toContain("Hz");
  });

  it("'f' was added to ch01-t01's equation-italics whitelist after confirming zero prior collisions; 'T' was already present", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("It is represented by the symbol T.");
    expect(en).toContain("It is represented by the symbol f.");
  });
});

describe("11. '1 Hz = 1 s⁻¹' renders correctly", () => {
  it("Step 3 and the Scientific Note both state 1 Hz = 1 s⁻¹", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("1 Hz = 1 s⁻¹.");
    expect(en).toContain("One hertz equals one inverse second: 1 Hz = 1 s⁻¹");
  });

  it("renders the equivalence in the DOM with a clear negative exponent", () => {
    renderSlides(false, 9);
    expect(getSlidePanel(container, 9)!.textContent).toContain("1 Hz = 1 s⁻¹");
  });
});

describe("12. 'f = 1 / T' and 'T = 1 / f' render as equation blocks", () => {
  it("Step 4 contains both reciprocal equations", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("f = 1 / T");
    expect(en).toContain("T = 1 / f");
  });

  it("renders both as distinct equation-block-styled clauses inside Step 4", () => {
    renderSlides(false, 9);
    const blocks = Array.from(
      getSlidePanel(container, 9)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("f = 1 / T");
    expect(blocks).toContain("T = 1 / f");
  });

  it("the Key Concept restates both equations together", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("f = 1 / T and T = 1 / f");
  });
});

describe("13. The Simple Example produces 'f = 4.0 Hz' with explicit significant figures", () => {
  it("English Simple Example states the question and all four worked equations, with a parenthesized measured denominator", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("Simple Example: A vibrating object completes one cycle every 0.25 s.");
    expect(en).toContain("T = 0.25 s");
    expect(en).toContain("f = 1 / (0.25 s) = 4.0 s⁻¹");
    expect(en).toContain("f = 4.0 Hz");
    expect(en).toContain(
      "The object completes 4.0 cycles every second. The result has two significant figures, matching the given period 0.25 s.",
    );
    expect(1 / 0.25).toBe(4);
  });

  it("renders all four equations as distinct equation blocks in the DOM", () => {
    renderSlides(false, 9);
    const blocks = Array.from(
      getSlidePanel(container, 9)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("T = 0.25 s");
    expect(blocks).toContain("f = 1 / (0.25 s) = 4.0 s⁻¹");
    expect(blocks).toContain("f = 4.0 Hz");
  });

  it("the Arabic Simple Example preserves the same equations, untranslated", () => {
    const ar = slide9.text.ar ?? "";
    expect(ar).toContain("T = 0.25 s");
    expect(ar).toContain("f = 1 / (0.25 s) = 4.0 s⁻¹");
    expect(ar).toContain("f = 4.0 Hz");
    expect(ar).toContain(
      "يكمل الجسم 4.0 دورات في كل ثانية. ويحتوي الناتج على رقمين معنويين بما يتفق مع الزمن الدوري المعطى 0.25 s.",
    );
  });
});

describe("14. The misconception example produces 'T = 0.100 s' with explicit significant figures", () => {
  it("the Common Misconception uses f = 10.0 Hz and correctly derives T = 1 / (10.0 Hz) = 0.100 s", () => {
    const en = slide9.text.en ?? "";
    expect(en).toContain("f = 10.0 Hz");
    expect(en).toContain("T = 1 / (10.0 Hz) = 0.100 s");
    expect(1 / 10).toBe(0.1);
  });

  it("the Arabic misconception preserves the same equations, untranslated", () => {
    const ar = slide9.text.ar ?? "";
    expect(ar).toContain("f = 10.0 Hz");
    expect(ar).toContain("T = 1 / (10.0 Hz) = 0.100 s");
  });
});

describe("15. Arabic RTL definition-card layout works correctly", () => {
  it("the definition-cards container carries dir=\"rtl\" in Arabic and dir=\"ltr\" in English", () => {
    renderSlides(true, 9);
    const arCards = getSlidePanel(container, 9)!.querySelector(".structured-slide__definition-cards");
    expect(arCards?.getAttribute("dir")).toBe("rtl");

    remount();
    renderSlides(false, 9);
    const enCards = getSlidePanel(container, 9)!.querySelector(".structured-slide__definition-cards");
    expect(enCards?.getAttribute("dir")).toBe("ltr");
  });

  it("the Arabic definition cards render translated terms", () => {
    renderSlides(true, 9);
    const terms = Array.from(
      getSlidePanel(container, 9)!.querySelectorAll(".structured-slide__definition-term"),
    ).map((el) => el.textContent);
    expect(terms).toEqual(["الزمن الدوري", "التردد"]);
  });
});

describe("16. Persistence restores Slide 9 when it was last open", () => {
  it("opening Slide 9, then remounting fresh, restores Slide 9 as open", () => {
    renderSlides(false, 9);
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("Slide 9's recordId is written to the same topic-namespaced localStorage key used by every other slide", () => {
    renderSlides(false, 9);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-9",
    );
  });
});

describe("17. No source screenshot is rendered student-facing", () => {
  it("Slide 9's panel contains no <img> element anywhere", () => {
    renderSlides(false, 9);
    expect(getSlidePanel(container, 9)!.querySelectorAll("img")).toHaveLength(0);
    remount();
    renderSlides(true, 9);
    expect(getSlidePanel(container, 9)!.querySelectorAll("img")).toHaveLength(0);
  });

  it("slide9.figure is undefined — no figure asset exists for this record", () => {
    expect(slide9.figure).toBeUndefined();
  });
});

describe("18. Governance remains blocked and publication unauthorized", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide9.blocking.studentFacingAllowed).toBe(false);
    expect(slide9.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 9's blockingReason does NOT include missingVisual (the source has no instructional figure)", () => {
    expect(slide9.blocking.blockingReason).toContain("translationPending");
    expect(slide9.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide9.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-8's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(17);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.studentFacingAllowed).toBe(false);
    expect(slide7.blocking.studentFacingAllowed).toBe(false);
    expect(slide8.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide7.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide8.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
  });
});
