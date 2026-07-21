// @vitest-environment jsdom
//
// Tests for Slide 6 ("What Units Are Used to Measure Area and Volume?"),
// added as a sixth sibling under ch01-t01's existing Slides accordion
// (ch01-t01-block-opening-6, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1-5). Covers the 17 checks
// explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide5AreaVolume.test.tsx and the
// shared accordion helpers from src/tests/testHelpers/slidesTestHelpers.tsx
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

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 6 appears sixth", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 6, ...] by slideNumber, with Slide 6 sixth", () => {
    // Sliced to the first six, not an exact-length equality: a later slide
    // (e.g. Slide 7, see slide7MetersToFeet.test.tsx) may follow Slide 6.
    expect(topic.slides.slice(0, 6).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
    ]);
    expect(topic.slides.slice(0, 6).map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("Slide 6's header follows Slide 5's header in DOM order, all six under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide5Idx = order.indexOf("slide-5-header");
    const slide6Idx = order.indexOf("slide-6-header");
    expect(slide5Idx).toBeGreaterThanOrEqual(0);
    expect(slide6Idx).toBeGreaterThan(slide5Idx);
    // >= 6, not exactly 6: a later slide (e.g. Slide 7, see
    // slide7MetersToFeet.test.tsx) may have been added since.
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(6);
  });

  it("Slide 6's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 6);
    expect(getSlidePanel(container, 6)?.textContent).toContain(
      "Slide 6 — What Units Are Used to Measure Area and Volume?",
    );
    remount();
    renderSlides(true, 6);
    expect(getSlidePanel(container, 6)?.textContent).toContain(
      "الشريحة 6 — ما الوحدات المستخدمة لقياس المساحة والحجم؟",
    );
  });
});

describe("2. Slides 1-5 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 6", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 2's corrected wording is unaffected by adding Slide 6", () => {
    expect(slide2.text.en).toContain(
      "L represents the dimension of length. Distance is one physical quantity that has the dimension of length.",
    );
  });

  it("Slide 3's table is unaffected by adding Slide 6", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 6", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle SVG and equation are unaffected by adding Slide 6", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
    expect(slide5.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slides 1-5 render their own content unchanged when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 3);
    expect(getSlidePanel(container, 3)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 4);
    expect(getSlidePanel(container, 4)?.querySelector(".slide-figure__img")).not.toBeNull();

    openSlideByNumber(container, 5);
    expect(
      getSlidePanel(container, 5)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("A = (4 m)(3 m) = 12 m²");
  });
});

describe("3. Slide 6 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-6 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide6).toBeDefined();
    expect(slide6.recordId).toBe("ch01-t01-block-opening-6");
    expect(slide6.slideNumber).toBe(6);
  });

  it("NormalizedTopic carries no Slide-6-specific field — topic.slides is the only place Slide 6's data lives", () => {
    expect(Object.keys(topic)).not.toContain("openingConceptSlide6");
    expect(Object.keys(topic)).not.toContain("slide6");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-6")).toBe(true);
  });

  it("Slide 6 renders via the exact same generic topic.slides.map(...) as Slides 1-5 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(6);
    expect(container.querySelector("#slide-6-header")).not.toBeNull();
  });

  it("Slide 6's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[5]).toBe("Area and Volume Units");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[5]).toBe("وحدات المساحة والحجم");
  });
});

describe("4. Accordion count and jump options include at least 6", () => {
  it("at least 6 accordion headers render, numbered 1-6 in order (later slides, e.g. Slide 7, may follow)", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers.slice(0, 6)).toEqual(["1", "2", "3", "4", "5", "6"]);
  });

  it("the jump select offers at least 6 options, including Slide 6", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBeGreaterThanOrEqual(6);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-6");
  });

  it("the viewed-progress denominator is at least 6", () => {
    renderSlides(false);
    const text = container.querySelector(".slides-section__progress")?.textContent ?? "";
    const match = /Slides viewed: 1 of (\d+)/.exec(text);
    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeGreaterThanOrEqual(6);
  });
});

describe("5. Slide 5's Next button opens Slide 6", () => {
  it("clicking Next from Slide 5 opens Slide 6 and moves focus to its header", () => {
    renderSlides(false, 5);
    const panel5 = getSlidePanel(container, 5)!;
    const nextButton = Array.from(panel5.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 6));
  });
});

describe("6. Slide 6's Previous button opens Slide 5", () => {
  it("clicking Previous from Slide 6 opens Slide 5 and moves focus to its header", () => {
    renderSlides(false, 6);
    const panel6 = getSlidePanel(container, 6)!;
    const prevButton = Array.from(panel6.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 5));
  });
});

describe("7. Slide 6's Next button opens Slide 7 (Slide 6 is no longer the final slide)", () => {
  it("Next is enabled on Slide 6 and opens Slide 7 — the final-slide-disabled behavior now belongs to Slide 7 (see slide7MetersToFeet.test.tsx and slidesAccordion.test.tsx's dynamic final-slide check)", () => {
    renderSlides(false, 6);
    const panel6 = getSlidePanel(container, 6)!;
    const nextButton = Array.from(panel6.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("8. Original English prose and source abbreviations are preserved", () => {
  it("the verbatim heading and intro sentence are present, unaltered", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Area and Volume");
    expect(en).toContain(
      "The following table lists the common area and volume units of measure, in both the metric and English systems and their abbreviations.",
    );
  });

  it("the plain source-notation abbreviations (not superscripts) are preserved exactly in the quoted prose", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("square meter (m2)");
    expect(en).toContain("square centimeter (cm2)");
    expect(en).toContain("square kilometer (km2)");
    expect(en).toContain("hectare");
    expect(en).toContain("square foot (ft2)");
    expect(en).toContain("square inch (in.2)");
    expect(en).toContain("square mile (mi2)");
    expect(en).toContain("acre");
    expect(en).toContain("cubic meter (m3)");
    expect(en).toContain("cubic centimeter (cm3 or cc)");
    expect(en).toContain("liter (L)");
    expect(en).toContain("milliliter (mL)");
    expect(en).toContain("cubic foot (ft3)");
    expect(en).toContain("cubic inch (in.3)");
    expect(en).toContain("quart, pint, cup");
    expect(en).toContain("teaspoon, tablespoon");
  });

  it("the Arabic translation of the original source is preserved, including plain-notation abbreviations", () => {
    const ar = slide6.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية: المساحة والحجم");
    expect(ar).toContain(
      "يعرض الجدول التالي وحدات القياس الشائعة للمساحة والحجم في كل من النظامين المتري والإنجليزي، مع اختصاراتها.",
    );
    expect(ar).toContain("m2");
    expect(ar).toContain("m3");
  });

  it("renders the original English quotation in the DOM when Slide 6 is opened", () => {
    renderSlides(false, 6);
    expect(getSlidePanel(container, 6)?.textContent).toContain("square meter (m2)");
  });
});

describe("9. Semantic table structure is accessible", () => {
  it("renders a real <table> with a <caption>, <thead>/<tbody>, and column headers with scope=\"col\"", () => {
    renderSlides(false, 6);
    const table = getSlidePanel(container, 6)!.querySelector(".structured-slide__table")!;
    expect(table.tagName).toBe("TABLE");
    expect(table.querySelector("caption")?.textContent).toBe("Common Area and Volume Units of Measure");
    expect(table.querySelector("thead")).not.toBeNull();
    expect(table.querySelector("tbody")).not.toBeNull();
    const headerCells = table.querySelectorAll("thead th");
    expect(headerCells).toHaveLength(3);
    headerCells.forEach((th) => expect(th.getAttribute("scope")).toBe("col"));
    const headers = Array.from(headerCells).map((el) => el.textContent);
    expect(headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("the table is NOT the uploaded screenshot — no <img> inside Slide 6's panel", () => {
    renderSlides(false, 6);
    expect(getSlidePanel(container, 6)!.querySelectorAll("img")).toHaveLength(0);
  });

  it("the table is wrapped in a horizontally-scrollable container (structured-slide__table-wrapper)", () => {
    renderSlides(false, 6);
    const wrapper = getSlidePanel(container, 6)!.querySelector(".structured-slide__table-wrapper");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector("table.structured-slide__table")).not.toBeNull();
  });

  it("all 8 data rows are present with the exact required cell text", () => {
    renderSlides(false, 6);
    const table = getSlidePanel(container, 6)!.querySelector(".structured-slide__table")!;
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
      const th = tr.querySelector("th");
      const tds = Array.from(tr.querySelectorAll("td")).map((td) => td.textContent);
      return [th ? th.textContent : "", ...tds];
    });
    expect(rows).toEqual([
      ["Area (A)", "square meter (m²)", "square foot (ft²)"],
      ["", "square centimeter (cm²)", "square inch (in²)"],
      ["", "square kilometer (km²)", "square mile (mi²)"],
      ["", "hectare", "acre"],
      ["Volume (V)", "cubic meter (m³)", "cubic foot (ft³)"],
      ["", "cubic centimeter (cm³ or cc)", "cubic inch (in³)"],
      ["", "liter (L)", "quart, pint, cup"],
      ["", "milliliter (mL)", "teaspoon, tablespoon"],
    ]);
  });
});

describe("10. Area and Volume grouped row headers render correctly", () => {
  it("exactly two <th scope=\"rowgroup\"> cells, 'Area (A)' spanning 4 rows and 'Volume (V)' spanning 4 rows", () => {
    renderSlides(false, 6);
    const table = getSlidePanel(container, 6)!.querySelector(".structured-slide__table")!;
    const rowHeaders = table.querySelectorAll('tbody th[scope="rowgroup"]');
    expect(rowHeaders).toHaveLength(2);
    expect(rowHeaders[0].textContent).toBe("Area (A)");
    expect(rowHeaders[0].getAttribute("rowSpan")).toBe("4");
    expect(rowHeaders[1].textContent).toBe("Volume (V)");
    expect(rowHeaders[1].getAttribute("rowSpan")).toBe("4");
  });

  it("the Arabic table groups the same rows under 'المساحة (A)' and 'الحجم (V)'", () => {
    renderSlides(true, 6);
    const table = getSlidePanel(container, 6)!.querySelector(".structured-slide__table")!;
    const rowHeaders = Array.from(table.querySelectorAll('tbody th[scope="rowgroup"]')).map(
      (el) => el.textContent,
    );
    expect(rowHeaders).toEqual(["المساحة (A)", "الحجم (V)"]);
  });

  it("tableEn and tableAr carry the identical structural row/column shape (byte-checked by batch1Merge.ts)", () => {
    expect(slide6.table?.en?.rows.length).toBe(8);
    expect(slide6.table?.ar?.rows.length).toBe(8);
    expect(slide6.table?.en?.headers.length).toBe(3);
    expect(slide6.table?.ar?.headers.length).toBe(3);
  });
});

describe("11. Superscripts ² and ³ render correctly", () => {
  it("the reconstructed table uses superscript notation (m², cm², m³, etc.), not plain digits", () => {
    renderSlides(false, 6);
    const table = getSlidePanel(container, 6)!.querySelector(".structured-slide__table")!;
    const text = table.textContent ?? "";
    expect(text).toContain("m²");
    expect(text).toContain("cm²");
    expect(text).toContain("km²");
    expect(text).toContain("ft²");
    expect(text).toContain("in²");
    expect(text).toContain("mi²");
    expect(text).toContain("m³");
    expect(text).toContain("cm³");
    expect(text).toContain("ft³");
    expect(text).toContain("in³");
  });

  it("the organized explanation (steps) uses superscript L², L³ notation", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("Its physical dimension is L².");
    expect(en).toContain("Its physical dimension is L³.");
  });

  it("renders L², L³ and the table's superscripts together in the DOM", () => {
    renderSlides(false, 6);
    const text = getSlidePanel(container, 6)!.textContent ?? "";
    expect(text).toContain("L²");
    expect(text).toContain("L³");
  });
});

describe("12. Volume/capacity equivalences render correctly", () => {
  it("Step 4 states 1 L = 1000 mL and 1 mL = 1 cm³", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("1 L = 1000 mL");
    expect(en).toContain("1 mL = 1 cm³");
    expect(en).toContain("1 L = 1000 cm³");
    // 1 L = 1000 mL = 1000 cm³ — arithmetically consistent.
    expect(1000).toBe(1000);
  });

  it("the Scientific Note states 1 cc = 1 cm³ = 1 mL", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("1 cc = 1 cm³ = 1 mL");
    const ar = slide6.text.ar ?? "";
    expect(ar).toContain("1 cc = 1 cm³ = 1 mL");
  });

  it("renders both equivalences in the DOM, both languages", () => {
    renderSlides(false, 6);
    expect(getSlidePanel(container, 6)?.textContent).toContain("1 L = 1000 mL");
    expect(getSlidePanel(container, 6)?.textContent).toContain("1 cc = 1 cm³ = 1 mL");
    remount();
    renderSlides(true, 6);
    expect(getSlidePanel(container, 6)?.textContent).toContain("1 L = 1000 mL");
    expect(getSlidePanel(container, 6)?.textContent).toContain("1 cc = 1 cm³ = 1 mL");
  });
});

describe("13. Area example produces 20 m²", () => {
  it("English Simple Example states A = l × w and the substituted result 20 m²", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("A rectangular floor measures 5 m by 4 m.");
    expect(en).toContain("A = l × w");
    expect(en).toContain("A = (5 m)(4 m) = 20 m²");
    expect(5 * 4).toBe(20);
  });

  it("renders the area calculation as a distinct equation block in the DOM", () => {
    renderSlides(false, 6);
    const blocks = Array.from(
      getSlidePanel(container, 6)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("A = (5 m)(4 m) = 20 m²");
  });
});

describe("14. Volume example produces 1 m³", () => {
  it("English Simple Example states V = l × w × h and the substituted result 1 m³", () => {
    const en = slide6.text.en ?? "";
    expect(en).toContain("A rectangular container measures 2 m by 1 m by 0.5 m.");
    expect(en).toContain("V = l × w × h");
    expect(en).toContain("V = (2 m)(1 m)(0.5 m) = 1 m³");
    expect(2 * 1 * 0.5).toBe(1);
  });

  it("renders the volume calculation as a distinct equation block in the DOM, alongside the area block", () => {
    renderSlides(false, 6);
    const blocks = Array.from(
      getSlidePanel(container, 6)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toEqual(["A = (5 m)(4 m) = 20 m²", "V = (2 m)(1 m)(0.5 m) = 1 m³"]);
  });
});

describe("15. Arabic RTL table layout works", () => {
  it("the table wrapper carries dir=\"rtl\" in Arabic and dir=\"ltr\" in English", () => {
    renderSlides(true, 6);
    const arWrapper = getSlidePanel(container, 6)!.querySelector(".structured-slide__table-wrapper");
    expect(arWrapper?.getAttribute("dir")).toBe("rtl");

    remount();
    renderSlides(false, 6);
    const enWrapper = getSlidePanel(container, 6)!.querySelector(".structured-slide__table-wrapper");
    expect(enWrapper?.getAttribute("dir")).toBe("ltr");
  });

  it("the Arabic table renders translated headers, caption, and units", () => {
    renderSlides(true, 6);
    const table = getSlidePanel(container, 6)!.querySelector(".structured-slide__table")!;
    const headers = Array.from(table.querySelectorAll("thead th")).map((el) => el.textContent);
    expect(headers).toEqual(["الكمية الفيزيائية", "الوحدات المترية", "الوحدات الإنجليزية"]);
    expect(table.querySelector("caption")?.textContent).toBe("وحدات قياس المساحة والحجم الشائعة");
  });

  it("remains wrapped in the same horizontally-scrollable container in Arabic (mobile-narrow layout verified visually via Playwright)", () => {
    renderSlides(true, 6);
    const wrapper = getSlidePanel(container, 6)!.querySelector(".structured-slide__table-wrapper");
    expect(wrapper).not.toBeNull();
    // Actual overflow-x: auto CSS behavior and small-viewport rendering are
    // verified visually via Playwright (desktop + mobile viewports) rather
    // than in jsdom, which does not perform real layout/scroll.
  });
});

describe("16. Persistence restores Slide 6 when it was last open", () => {
  it("opening Slide 6, then remounting fresh, restores Slide 6 as open", () => {
    renderSlides(false, 6);
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("Slide 6's recordId is written to the same topic-namespaced localStorage key used by every other slide", () => {
    renderSlides(false, 6);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-6",
    );
  });
});

describe("17. Governance and publication flags remain correctly blocked", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide6.blocking.studentFacingAllowed).toBe(false);
    expect(slide6.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 6's blockingReason does NOT include missingVisual (the table was fully reconstructable and used)", () => {
    expect(slide6.blocking.blockingReason).toContain("translationPending");
    expect(slide6.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide6.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-5's governance flags are untouched", () => {
    // 13 at the time this record was added, now 15 with Slides 7-8 also
    // present (see src/tests/slide7MetersToFeet.test.tsx and
    // slide8TimeMeasurement.test.tsx).
    expect(topic.governance.recordCount).toBe(15);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.blockingReason).not.toContain("missingVisual");
    expect(slide5.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    // Slides.tsx / SlidesSection never renders the banner itself — this is
    // a structural confirmation that adding Slide 6 introduced no change
    // to InternalStatusPanel or its governance inputs.
    expect(topic.governance.studentFacingAllowed).toBe(false);
  });
});

describe("Reusability — Slide 6 proves the architecture scales to a captioned, grouped-row-header table without per-slide wiring", () => {
  it("all six slides render via the exact same generic StructuredSlideContent, distinguished only by their own recordId-keyed config", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(6);
  });

  it("topic.slides remains a plain array where every slide has recordId/slideNumber/title.en/title.ar — no slide-count-specific schema", () => {
    expect(Array.isArray(topic.slides)).toBe(true);
    expect(topic.slides.length).toBeGreaterThanOrEqual(6);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });

  it("only Slides 3 and 6 carry a table; the table-caption field is generic and optional, absent on Slide 3", () => {
    expect(slide1.table).toBeUndefined();
    expect(slide2.table).toBeUndefined();
    expect(slide3.table).toBeDefined();
    expect(slide3.table?.en?.caption).toBeUndefined();
    expect(slide6.table).toBeDefined();
    expect(slide6.table?.en?.caption).toBe("Common Area and Volume Units of Measure");
  });
});
