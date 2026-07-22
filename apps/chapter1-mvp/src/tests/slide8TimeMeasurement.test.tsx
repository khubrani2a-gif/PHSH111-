// @vitest-environment jsdom
//
// Tests for Slide 8 ("How Is Time Measured Using Repeating Phenomena?"),
// added as an eighth sibling under ch01-t01's existing Slides accordion
// (ch01-t01-block-opening-8, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1-7). Covers the 17 checks
// explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide6AreaVolumeUnits.test.tsx and
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

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 8 appears eighth", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 8, ...] by slideNumber", () => {
    expect(topic.slides.slice(0, 8).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
      "ch01-t01-block-opening-7",
      "ch01-t01-block-opening-8",
    ]);
    expect(topic.slides.slice(0, 8).map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("Slide 8's header follows Slide 7's header in DOM order, all eight under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide7Idx = order.indexOf("slide-7-header");
    const slide8Idx = order.indexOf("slide-8-header");
    expect(slide7Idx).toBeGreaterThanOrEqual(0);
    expect(slide8Idx).toBeGreaterThan(slide7Idx);
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(8);
  });

  it("Slide 8's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 8);
    expect(getSlidePanel(container, 8)?.textContent).toContain(
      "Slide 8 — How Is Time Measured Using Repeating Phenomena?",
    );
    remount();
    renderSlides(true, 8);
    expect(getSlidePanel(container, 8)?.textContent).toContain(
      "الشريحة 8 — كيف يُقاس الزمن باستخدام الظواهر المتكررة؟",
    );
  });
});

describe("2. Slides 1-7 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 8", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 8", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 8", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 8", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table is unaffected by adding Slide 8", () => {
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 7's corrected significant-figures wording is unaffected by adding Slide 8", () => {
    expect(slide7.text.en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
    expect(slide7.text.en).toContain("23 m ≈ 75 ft (rounded to two significant figures)");
  });

  it("Slides 1-7 render their own content unchanged when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 3);
    expect(getSlidePanel(container, 3)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 6);
    expect(getSlidePanel(container, 6)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 7);
    expect(getSlidePanel(container, 7)?.textContent).toContain("23 m × (3.28084 ft / 1 m)");
  });
});

describe("3. Slide 8 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-8 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide8).toBeDefined();
    expect(slide8.recordId).toBe("ch01-t01-block-opening-8");
    expect(slide8.slideNumber).toBe(8);
  });

  it("NormalizedTopic carries no Slide-8-specific field — topic.slides is the only place Slide 8's data lives", () => {
    expect(Object.keys(topic)).not.toContain("slide8");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-8")).toBe(true);
  });

  it("Slide 8 renders via the exact same generic topic.slides.map(...) as Slides 1-7 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(8);
    expect(container.querySelector("#slide-8-header")).not.toBeNull();
  });

  it("Slide 8's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[7]).toBe("Time Measurement");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[7]).toBe("قياس الزمن");
  });
});

describe("4. Accordion count and jump options update to at least 8", () => {
  it("at least 8 accordion headers render, numbered 1-8 in order", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers.slice(0, 8)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8"]);
  });

  it("the jump select offers at least 8 options, including Slide 8", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBeGreaterThanOrEqual(8);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-8");
  });

  it("the viewed-progress denominator is at least 8", () => {
    renderSlides(false);
    const text = container.querySelector(".slides-section__progress")?.textContent ?? "";
    const match = /Slides viewed: 1 of (\d+)/.exec(text);
    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(8);
  });
});

describe("5. Slide 7's Next button opens Slide 8", () => {
  it("clicking Next from Slide 7 opens Slide 8 and moves focus to its header", () => {
    renderSlides(false, 7);
    const panel7 = getSlidePanel(container, 7)!;
    const nextButton = Array.from(panel7.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 8));
  });
});

describe("6. Slide 8's Previous button opens Slide 7", () => {
  it("clicking Previous from Slide 8 opens Slide 7 and moves focus to its header", () => {
    renderSlides(false, 8);
    const panel8 = getSlidePanel(container, 8)!;
    const prevButton = Array.from(panel8.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 7));
  });
});

describe("7. Slide 8's Next button opens Slide 9 (Slide 8 is no longer the final slide)", () => {
  it("Next is enabled on Slide 8 and opens Slide 9 — the final-slide-disabled behavior now belongs to Slide 9 (see slide9PeriodFrequency.test.tsx and slidesAccordion.test.tsx's dynamic final-slide check)", () => {
    renderSlides(false, 8);
    const panel8 = getSlidePanel(container, 8)!;
    const nextButton = Array.from(panel8.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("8. Original English text is preserved", () => {
  it("the verbatim heading, description, and table lead-in sentence are present, unaltered", () => {
    const en = slide8.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Time");
    expect(en).toContain(
      "The measure of time is based on periodic phenomena—processes that repeat over and over at a regular rate.",
    );
    expect(en).toContain("Both the metric system and the English system use the same units for time");
  });

  it("the Arabic translation of the original source is preserved", () => {
    const ar = slide8.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية: الزمن");
    expect(ar).toContain(
      "يعتمد قياس الزمن على الظواهر الدورية، وهي عمليات تتكرر مرارًا وتكرارًا بمعدل منتظم.",
    );
    expect(ar).toContain("يستخدم كل من النظام المتري والنظام الإنجليزي الوحدات نفسها لقياس الزمن.");
  });

  it("renders the original English quotation in the DOM when Slide 8 is opened", () => {
    renderSlides(false, 8);
    expect(getSlidePanel(container, 8)?.textContent).toContain(
      "The measure of time is based on periodic phenomena—processes that repeat over and over at a regular rate.",
    );
  });
});

describe("9. Semantic table structure is accessible", () => {
  it("renders a real <table> with a <caption>, <thead>/<tbody>, and column headers with scope=\"col\"", () => {
    renderSlides(false, 8);
    const table = getSlidePanel(container, 8)!.querySelector(".structured-slide__table")!;
    expect(table.tagName).toBe("TABLE");
    expect(table.querySelector("caption")?.textContent).toBe("Common Units of Time");
    expect(table.querySelector("thead")).not.toBeNull();
    expect(table.querySelector("tbody")).not.toBeNull();
    const headerCells = table.querySelectorAll("thead th");
    expect(headerCells).toHaveLength(3);
    headerCells.forEach((th) => expect(th.getAttribute("scope")).toBe("col"));
    const headers = Array.from(headerCells).map((el) => el.textContent);
    expect(headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("groups all three rows under one <th scope=\"rowgroup\"> 'Time (t)' spanning 3 rows", () => {
    renderSlides(false, 8);
    const table = getSlidePanel(container, 8)!.querySelector(".structured-slide__table")!;
    const rowHeaders = table.querySelectorAll('tbody th[scope="rowgroup"]');
    expect(rowHeaders).toHaveLength(1);
    expect(rowHeaders[0].textContent).toBe("Time (t)");
    expect(rowHeaders[0].getAttribute("rowSpan")).toBe("3");
  });

  it("the table is NOT the uploaded screenshot — no <img> inside Slide 8's panel", () => {
    renderSlides(false, 8);
    expect(getSlidePanel(container, 8)!.querySelectorAll("img")).toHaveLength(0);
  });

  it("the table is wrapped in a horizontally-scrollable container (structured-slide__table-wrapper)", () => {
    renderSlides(false, 8);
    const wrapper = getSlidePanel(container, 8)!.querySelector(".structured-slide__table-wrapper");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector("table.structured-slide__table")).not.toBeNull();
  });
});

describe("10. Both system columns contain identical time units", () => {
  it("all three rows show the same wording in the Metric and English columns", () => {
    renderSlides(false, 8);
    const table = getSlidePanel(container, 8)!.querySelector(".structured-slide__table")!;
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
      const th = tr.querySelector("th");
      const tds = Array.from(tr.querySelectorAll("td")).map((td) => td.textContent);
      return [th ? th.textContent : "", ...tds];
    });
    expect(rows).toEqual([
      ["Time (t)", "second (s)", "second (s)"],
      ["", "minute (min)", "minute (min)"],
      ["", "hour (h)", "hour (h)"],
    ]);
  });

  it("the Table Explanation states the units are identical, not approximate equivalents", () => {
    const en = slide8.text.en ?? "";
    expect(en).toContain(
      "Units aligned in the two system columns are identical rather than approximate equivalents.",
    );
  });
});

describe("11. Fixed time-unit relationships render correctly", () => {
  it("Step 5 and the Scientific Note state 1 min = 60 s, 1 h = 60 min, and 1 h = 3600 s", () => {
    const en = slide8.text.en ?? "";
    expect(en).toContain("1 min = 60 s");
    expect(en).toContain("1 h = 60 min");
    expect(en).toContain("1 h = 3600 s");
    expect(60 * 60).toBe(3600);
  });

  it("renders all three relationships in the DOM", () => {
    renderSlides(false, 8);
    const panelText = getSlidePanel(container, 8)!.textContent ?? "";
    expect(panelText).toContain("1 min = 60 s");
    expect(panelText).toContain("1 h = 60 min");
    expect(panelText).toContain("1 h = 3600 s");
  });
});

describe("12. The lecture example produces 90 min and 5.4 × 10³ s (5400 s, with significant figures made explicit)", () => {
  it("English Simple Example states the question and both worked conversions, with the final equivalence in scientific notation", () => {
    const en = slide8.text.en ?? "";
    expect(en).toContain("Simple Example: A lecture lasts 1.5 h.");
    expect(en).toContain("1.5 h × (60 min / 1 h) = 90 min");
    expect(en).toContain("90 min × (60 s / 1 min) = 5400 s");
    expect(en).toContain("1.5 h = 90 min = 5.4 × 10³ s");
    expect(en).toContain(
      "The value 5400 s is numerically equivalent, but 5.4 × 10³ s makes the two significant figures inherited from 1.5 h explicit.",
    );
    expect(1.5 * 60).toBe(90);
    expect(90 * 60).toBe(5400);
  });

  it("renders all three equations as distinct equation blocks in the DOM, the third in scientific notation", () => {
    renderSlides(false, 8);
    const blocks = Array.from(
      getSlidePanel(container, 8)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toEqual([
      "1.5 h × (60 min / 1 h) = 90 min",
      "90 min × (60 s / 1 min) = 5400 s",
      "1.5 h = 90 min = 5.4 × 10³ s",
    ]);
  });

  it("the Arabic Simple Example preserves the same equations, untranslated, with the matching significant-figures sentence", () => {
    const ar = slide8.text.ar ?? "";
    expect(ar).toContain("مثال بسيط: تستمر محاضرة مدة 1.5 h.");
    expect(ar).toContain("1.5 h × (60 min / 1 h) = 90 min");
    expect(ar).toContain("90 min × (60 s / 1 min) = 5400 s");
    expect(ar).toContain("1.5 h = 90 min = 5.4 × 10³ s");
    expect(ar).toContain(
      "تساوي القيمة 5400 s المقدار نفسه عدديًا، لكن كتابة 5.4 × 10³ s تُظهر بوضوح الرقمين المعنويين الموروثين من 1.5 h.",
    );
  });
});

describe("13. t renders as a variable while s, min, and h render as units", () => {
  it("the standalone physical symbol 't' is italicized", () => {
    renderSlides(false, 8);
    const emTexts = Array.from(getSlidePanel(container, 8)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).toContain("t");
  });

  it("'h', 's', and 'min' are never italicized (unit symbols, not variables)", () => {
    renderSlides(false, 8);
    const emTexts = Array.from(getSlidePanel(container, 8)!.querySelectorAll("em")).map(
      (el) => el.textContent,
    );
    expect(emTexts).not.toContain("h");
    expect(emTexts).not.toContain("s");
    expect(emTexts).not.toContain("min");
  });

  it("no equation-italics whitelist change was needed — 't' was already whitelisted and 'h' was already excluded for ch01-t01", () => {
    // Regression guard: confirms the existing per-topic whitelist already
    // distinguishes the time variable from the hour unit, so this slide
    // required zero changes to src/content/equationRenderer.tsx.
    const en = slide8.text.en ?? "";
    expect(en).toContain("The physical symbol commonly used for time is t.");
    expect(en).toContain("second (s), minute (min), and hour (h)");
  });
});

describe("14. Arabic RTL table layout works correctly", () => {
  it("the table wrapper carries dir=\"rtl\" in Arabic and dir=\"ltr\" in English", () => {
    renderSlides(true, 8);
    const arWrapper = getSlidePanel(container, 8)!.querySelector(".structured-slide__table-wrapper");
    expect(arWrapper?.getAttribute("dir")).toBe("rtl");

    remount();
    renderSlides(false, 8);
    const enWrapper = getSlidePanel(container, 8)!.querySelector(".structured-slide__table-wrapper");
    expect(enWrapper?.getAttribute("dir")).toBe("ltr");
  });

  it("the Arabic table renders translated headers, caption, and grouped row header", () => {
    renderSlides(true, 8);
    const table = getSlidePanel(container, 8)!.querySelector(".structured-slide__table")!;
    const headers = Array.from(table.querySelectorAll("thead th")).map((el) => el.textContent);
    expect(headers).toEqual(["الكمية الفيزيائية", "الوحدات المترية", "الوحدات الإنجليزية"]);
    expect(table.querySelector("caption")?.textContent).toBe("وحدات الزمن الشائعة");
    const rowHeader = table.querySelector('tbody th[scope="rowgroup"]');
    expect(rowHeader?.textContent).toBe("الزمن (t)");
    expect(rowHeader?.getAttribute("rowSpan")).toBe("3");
  });

  it("remains wrapped in the same horizontally-scrollable container in Arabic (mobile-narrow layout verified visually via Playwright)", () => {
    renderSlides(true, 8);
    const wrapper = getSlidePanel(container, 8)!.querySelector(".structured-slide__table-wrapper");
    expect(wrapper).not.toBeNull();
  });
});

describe("15. Persistence restores Slide 8 when it was last open", () => {
  it("opening Slide 8, then remounting fresh, restores Slide 8 as open", () => {
    renderSlides(false, 8);
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("Slide 8's recordId is written to the same topic-namespaced localStorage key used by every other slide", () => {
    renderSlides(false, 8);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-8",
    );
  });
});

describe("16. No screenshot is rendered student-facing", () => {
  it("Slide 8's panel contains no <img> element anywhere", () => {
    renderSlides(false, 8);
    expect(getSlidePanel(container, 8)!.querySelectorAll("img")).toHaveLength(0);
    remount();
    renderSlides(true, 8);
    expect(getSlidePanel(container, 8)!.querySelectorAll("img")).toHaveLength(0);
  });

  it("slide8.figure is undefined — no figure asset exists for this record", () => {
    expect(slide8.figure).toBeUndefined();
  });
});

describe("17. Governance remains blocked and publication unauthorized", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide8.blocking.studentFacingAllowed).toBe(false);
    expect(slide8.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 8's blockingReason does NOT include missingVisual (the source has no instructional figure)", () => {
    expect(slide8.blocking.blockingReason).toContain("translationPending");
    expect(slide8.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide8.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-7's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(17);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.studentFacingAllowed).toBe(false);
    expect(slide7.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide7.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
  });
});

describe("Reusability — Slide 8 proves the architecture scales to an eighth table-bearing slide without per-slide wiring", () => {
  it("at least eight slides render via the exact same generic StructuredSlideContent, distinguished only by their own recordId-keyed config", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(8);
  });

  it("topic.slides remains a plain array where every slide has recordId/slideNumber/title.en/title.ar — no slide-count-specific schema", () => {
    expect(Array.isArray(topic.slides)).toBe(true);
    expect(topic.slides.length).toBeGreaterThanOrEqual(8);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });

  it("Slides 3, 6, and 8 carry a table; the table-caption field is generic and optional, absent on Slide 3", () => {
    expect(slide3.table).toBeDefined();
    expect(slide3.table?.en?.caption).toBeUndefined();
    expect(slide6.table).toBeDefined();
    expect(slide6.table?.en?.caption).toBe("Common Area and Volume Units of Measure");
    expect(slide8.table).toBeDefined();
    expect(slide8.table?.en?.caption).toBe("Common Units of Time");
  });
});
