// @vitest-environment jsdom
//
// Tests for Slide 10 ("How Are Period, Frequency, and Hertz Related?"),
// added as a tenth sibling under ch01-t01's existing Slides accordion
// (ch01-t01-block-opening-10, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1-9). Covers the 20 checks
// explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide9PeriodFrequency.test.tsx and
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
const slide10 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-10")!;

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 10 appears tenth", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 10] by slideNumber", () => {
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
    ]);
    expect(topic.slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it("Slide 10's header follows Slide 9's header in DOM order, all ten under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide9Idx = order.indexOf("slide-9-header");
    const slide10Idx = order.indexOf("slide-10-header");
    expect(slide9Idx).toBeGreaterThanOrEqual(0);
    expect(slide10Idx).toBeGreaterThan(slide9Idx);
    expect(container.querySelectorAll(".slides-section .slide")).toHaveLength(10);
  });

  it("Slide 10's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 10);
    expect(getSlidePanel(container, 10)?.textContent).toContain(
      "Slide 10 — How Are Period, Frequency, and Hertz Related?",
    );
    remount();
    renderSlides(true, 10);
    expect(getSlidePanel(container, 10)?.textContent).toContain(
      "الشريحة 10 — كيف يرتبط الزمن الدوري والتردد والهرتز؟",
    );
  });
});

describe("2. Slides 1-9 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 10", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 10", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 10", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 10", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table is unaffected by adding Slide 10", () => {
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 7's corrected significant-figures wording is unaffected by adding Slide 10", () => {
    expect(slide7.text.en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
  });

  it("Slide 8's table is unaffected by adding Slide 10", () => {
    expect(slide8.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 9's definition cards and corrected equations are unaffected by adding Slide 10", () => {
    expect(slide9.definitions?.en?.map((d) => d.term)).toEqual(["Period", "Frequency"]);
    expect(slide9.text.en).toContain("f = 1 / (0.25 s) = 4.0 s⁻¹");
  });

  it("Slides 1-9 render their own content unchanged when opened through the accordion", () => {
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
  });
});

describe("3. Slide 10 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-10 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide10).toBeDefined();
    expect(slide10.recordId).toBe("ch01-t01-block-opening-10");
    expect(slide10.slideNumber).toBe(10);
  });

  it("NormalizedTopic carries no Slide-10-specific field — topic.slides is the only place Slide 10's data lives", () => {
    expect(Object.keys(topic)).not.toContain("slide10");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-10")).toBe(true);
  });

  it("Slide 10 renders via the exact same generic topic.slides.map(...) as Slides 1-9 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide")).toHaveLength(10);
    expect(container.querySelector("#slide-10-header")).not.toBeNull();
  });

  it("Slide 10's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[9]).toBe("Period–Frequency Relationship");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[9]).toBe("العلاقة بين الزمن الدوري والتردد");
  });
});

describe("4. Accordion count and jump options update to 10", () => {
  it("10 accordion headers render, numbered 1-10", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  });

  it("the jump select offers 10 options, including Slide 10", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBe(10);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-10");
  });

  it("the viewed-progress denominator is 10", () => {
    renderSlides(false);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      "Slides viewed: 1 of 10",
    );
  });
});

describe("5. Slide 9's Next button opens Slide 10", () => {
  it("clicking Next from Slide 9 opens Slide 10 and moves focus to its header", () => {
    renderSlides(false, 9);
    const panel9 = getSlidePanel(container, 9)!;
    const nextButton = Array.from(panel9.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 10)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 10));
  });
});

describe("6. Slide 10's Previous button opens Slide 9", () => {
  it("clicking Previous from Slide 10 opens Slide 9 and moves focus to its header", () => {
    renderSlides(false, 10);
    const panel10 = getSlidePanel(container, 10)!;
    const prevButton = Array.from(panel10.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 9));
  });
});

describe("7. Slide 10's Next button is disabled (final slide)", () => {
  it("Next is disabled and the pager reads 'Slide 10 of 10'", () => {
    renderSlides(false, 10);
    const panel10 = getSlidePanel(container, 10)!;
    const nextButton = Array.from(panel10.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
    expect(panel10.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      "Slide 10 of 10",
    );
  });
});

describe("8. Original English source text and examples are preserved", () => {
  it("the verbatim heading, relationship prose, and relationships are present, unaltered", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Time");
    expect(en).toContain(
      "The relationship between the period of a cyclic phenomenon and its frequency is simple.",
    );
    expect(en).toContain("The period equals 1 divided by the frequency, and vice versa.");
    expect(en).toContain("period = 1 / frequency");
    expect(en).toContain(
      "The standard unit of frequency is the hertz (Hz), which equals 1 cycle per second.",
    );
  });

  it("the verbatim source examples are preserved exactly, not silently replaced", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("1 Hz = 1/s = 1 s⁻¹");
    expect(en).toContain("91.5 MHz = 91,500,000 Hz");
    expect(en).toContain("2 GHz = 2,000,000,000 Hz");
  });

  it("no equation is added inside the verbatim Original English subsection beyond the source's own", () => {
    const en = slide10.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).not.toContain("9.15 × 10⁷");
    expect(original).not.toContain("2 × 10⁹");
  });

  it("the Arabic translation of the original source is preserved, including the same examples", () => {
    const ar = slide10.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية: الزمن");
    expect(ar).toContain("العلاقة بين الزمن الدوري لظاهرة دورية وترددها بسيطة.");
    expect(ar).toContain("1 Hz = 1/s = 1 s⁻¹");
    expect(ar).toContain("91.5 MHz = 91,500,000 Hz");
    expect(ar).toContain("2 GHz = 2,000,000,000 Hz");
  });

  it("renders the original English relationship prose in the DOM when Slide 10 is opened", () => {
    renderSlides(false, 10);
    expect(getSlidePanel(container, 10)?.textContent).toContain(
      "The relationship between the period of a cyclic phenomenon and its frequency is simple.",
    );
  });
});

describe("9. T = 1 / f and f = 1 / T render correctly", () => {
  it("Step 3 and the Key Concept both state the reciprocal relationships", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("T = 1 / f");
    expect(en).toContain("f = 1 / T");
  });

  it("renders both as distinct equation-block-styled clauses inside Step 3", () => {
    renderSlides(false, 10);
    const blocks = Array.from(
      getSlidePanel(container, 10)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("T = 1 / f");
    expect(blocks).toContain("f = 1 / T");
  });
});

describe("10. 1 Hz = 1 s⁻¹ renders correctly", () => {
  it("Step 4 and the Key Concept both state 1 Hz = 1 s⁻¹", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("1 Hz = 1 s⁻¹");
  });

  it("renders as a distinct equation block inside Step 4", () => {
    renderSlides(false, 10);
    const blocks = Array.from(
      getSlidePanel(container, 10)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("1 Hz = 1 s⁻¹");
  });
});

describe("11. 1 MHz = 10⁶ Hz and 1 GHz = 10⁹ Hz render correctly", () => {
  it("Step 5 states both base prefix equivalences", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("1 MHz = 10⁶ Hz");
    expect(en).toContain("1 GHz = 10⁹ Hz");
  });

  it("renders both as distinct equation blocks inside Step 5", () => {
    renderSlides(false, 10);
    const blocks = Array.from(
      getSlidePanel(container, 10)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("1 MHz = 10⁶ Hz");
    expect(blocks).toContain("1 GHz = 10⁹ Hz");
  });
});

describe("12. 91.5 MHz = 9.15 × 10⁷ Hz renders correctly", () => {
  it("Step 5 and the Scientific Note both state the converted value", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("91.5 MHz = 9.15 × 10⁷ Hz");
    expect(91.5e6).toBe(9.15e7);
  });

  it("renders as a distinct equation block inside Step 5", () => {
    renderSlides(false, 10);
    const blocks = Array.from(
      getSlidePanel(container, 10)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("91.5 MHz = 9.15 × 10⁷ Hz");
  });

  it("the Scientific Note shows the full three-part equivalence", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("91.5 MHz = 91,500,000 Hz = 9.15 × 10⁷ Hz");
  });
});

describe("13. 2 GHz = 2 × 10⁹ Hz renders correctly", () => {
  it("Step 5 and the Scientific Note both state the converted value", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("2 GHz = 2 × 10⁹ Hz");
    expect(2e9).toBe(2e9);
  });

  it("renders as a distinct equation block inside Step 5", () => {
    renderSlides(false, 10);
    const blocks = Array.from(
      getSlidePanel(container, 10)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("2 GHz = 2 × 10⁹ Hz");
  });

  it("the Scientific Note shows the full three-part equivalence", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("2 GHz = 2,000,000,000 Hz = 2 × 10⁹ Hz");
  });
});

describe("14. The Simple Example produces T = 0.200 s", () => {
  it("English Simple Example states the question and all three worked equations", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("Simple Example: A periodic signal has a frequency of 5.00 Hz.");
    expect(en).toContain("f = 5.00 Hz");
    expect(en).toContain("T = 1 / (5.00 Hz) = 0.200 s");
    expect(en).toContain(
      "The signal completes one cycle every 0.200 s. The result has three significant figures, matching the given frequency 5.00 Hz.",
    );
    expect(1 / 5).toBe(0.2);
  });

  it("renders all three equations as distinct equation blocks in the DOM", () => {
    renderSlides(false, 10);
    const blocks = Array.from(
      getSlidePanel(container, 10)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("f = 5.00 Hz");
    expect(blocks).toContain("T = 1 / (5.00 Hz) = 0.200 s");
  });

  it("the Arabic Simple Example preserves the same equations, untranslated", () => {
    const ar = slide10.text.ar ?? "";
    expect(ar).toContain("f = 5.00 Hz");
    expect(ar).toContain("T = 1 / (5.00 Hz) = 0.200 s");
    expect(ar).toContain(
      "تكمل الإشارة دورة واحدة كل 0.200 s. ويحتوي الناتج على ثلاثة أرقام معنوية بما يتفق مع التردد المعطى 5.00 Hz.",
    );
  });
});

describe("15. The misconception example produces T = 0.0500 s", () => {
  it("the Common Misconception uses f = 20.0 Hz and correctly derives T = 1 / (20.0 Hz) = 0.0500 s", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("f = 20.0 Hz");
    expect(en).toContain("T = 1 / (20.0 Hz) = 0.0500 s");
    expect(1 / 20).toBe(0.05);
  });

  it("the Arabic misconception preserves the same equations, untranslated", () => {
    const ar = slide10.text.ar ?? "";
    expect(ar).toContain("f = 20.0 Hz");
    expect(ar).toContain("T = 1 / (20.0 Hz) = 0.0500 s");
  });
});

describe("16. T and f are italic, while all units remain upright", () => {
  it("the standalone physical symbols 'T' and 'f' are italicized", () => {
    renderSlides(false, 10);
    const emTexts = Array.from(getSlidePanel(container, 10)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).toContain("T");
    expect(emTexts).toContain("f");
  });

  it("'s', 'Hz', 'MHz', and 'GHz' are never italicized (unit symbols, not variables)", () => {
    renderSlides(false, 10);
    const emTexts = Array.from(getSlidePanel(container, 10)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).not.toContain("s");
    expect(emTexts).not.toContain("Hz");
    expect(emTexts).not.toContain("MHz");
    expect(emTexts).not.toContain("GHz");
  });

  it("no new equation-italics whitelist entry was needed — T and f were already whitelisted for ch01-t01", () => {
    const en = slide10.text.en ?? "";
    expect(en).toContain("Period is represented by T.");
    expect(en).toContain("Frequency is represented by f.");
  });
});

describe("17. Arabic RTL renders correctly", () => {
  it("the structured slide content carries dir=\"rtl\" in Arabic and dir=\"ltr\" in English", () => {
    renderSlides(true, 10);
    const arSection = getSlidePanel(container, 10)!.querySelector("[dir]");
    expect(arSection?.getAttribute("dir")).toBe("rtl");

    remount();
    renderSlides(false, 10);
    const enSection = getSlidePanel(container, 10)!.querySelector("[dir]");
    expect(enSection?.getAttribute("dir")).toBe("ltr");
  });

  it("the Arabic panel renders the translated Main Idea and Key Concept", () => {
    renderSlides(true, 10);
    const panelText = getSlidePanel(container, 10)!.textContent ?? "";
    expect(panelText).toContain("الزمن الدوري والتردد كميتان متبادلتان");
    expect(panelText).toContain("المفهوم الأساسي");
  });
});

describe("18. Slide 10 persistence works across reload", () => {
  it("opening Slide 10, then remounting fresh, restores Slide 10 as open", () => {
    renderSlides(false, 10);
    expect(getSlideHeader(container, 10)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 10)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("Slide 10's recordId is written to the same topic-namespaced localStorage key used by every other slide", () => {
    renderSlides(false, 10);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-10",
    );
  });
});

describe("19. No source screenshot is rendered student-facing", () => {
  it("Slide 10's panel contains no <img> element anywhere", () => {
    renderSlides(false, 10);
    expect(getSlidePanel(container, 10)!.querySelectorAll("img")).toHaveLength(0);
    remount();
    renderSlides(true, 10);
    expect(getSlidePanel(container, 10)!.querySelectorAll("img")).toHaveLength(0);
  });

  it("slide10.figure is undefined — no figure asset exists for this record", () => {
    expect(slide10.figure).toBeUndefined();
  });
});

describe("20. Governance remains blocked and publication unauthorized", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide10.blocking.studentFacingAllowed).toBe(false);
    expect(slide10.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 10's blockingReason does NOT include missingVisual (the source has no instructional figure)", () => {
    expect(slide10.blocking.blockingReason).toContain("translationPending");
    expect(slide10.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide10.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-9's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(17);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.studentFacingAllowed).toBe(false);
    expect(slide7.blocking.studentFacingAllowed).toBe(false);
    expect(slide8.blocking.studentFacingAllowed).toBe(false);
    expect(slide9.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide7.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide8.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide9.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
  });
});
