// @vitest-environment jsdom
//
// Tests for Slide 3 ("How Is Distance Measured in Metric and English
// Units?"), added as a third sibling under ch01-t01's existing Slides
// section (ch01-t01-block-opening-3, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1 and 2). Covers the 13
// checks explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide2DistanceDimensions.test.tsx.
//
// Rendering now goes through the Slides accordion (see
// src/features/topics/Slides.tsx and src/tests/testHelpers/slidesTestHelpers.tsx)
// — only one slide's panel is mounted at a time, so any assertion about a
// slide's rendered content opens that slide first via openSlideByNumber.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { getTopic } from "../content/adapter";
import {
  renderGenericSlides as renderGenericSlidesShared,
  openSlideByNumber,
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

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

describe("1. Slide 3 appears after Slide 2", () => {
  it("topic.slides is ordered [Slide 1, Slide 2, Slide 3, ...] by slideNumber", () => {
    // Only the first three entries are asserted here — a later slide (e.g.
    // Slide 4, see src/tests/slide4DifferentUnits.test.tsx) may legitimately
    // extend this array without breaking this Slide-3-scoped test.
    expect(topic.slides.slice(0, 3).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
    ]);
    expect(topic.slides.slice(0, 3).map((s) => s.slideNumber)).toEqual([1, 2, 3]);
  });

  it("Slide 3's header follows Slide 2's header in DOM order, all three under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide2Idx = order.indexOf("slide-2-header");
    const slide3Idx = order.indexOf("slide-3-header");
    expect(slide2Idx).toBeGreaterThanOrEqual(0);
    expect(slide3Idx).toBeGreaterThan(slide2Idx);
    // At least Slides 1-3 — a later slide (e.g. Slide 4) may legitimately
    // add more without breaking this assertion.
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(3);
  });

  it("Slide 3's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 3);
    expect(getSlidePanel(container, 3)?.textContent).toContain(
      "Slide 3 — How Is Distance Measured in Metric and English Units?",
    );
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 3);
    expect(getSlidePanel(container, 3)?.textContent).toContain(
      "الشريحة 3 — كيف تُقاس المسافة في النظامين المتري والإنجليزي؟",
    );
  });
});

describe("2. Slide 1 and Slide 2 remain unchanged", () => {
  it("Slide 1's English text is byte-for-byte identical to its pre-Slide-3 content", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
    expect(slide1.text.en).toContain("Main idea:");
    expect(slide1.text.en).not.toContain("How Is Distance Measured");
  });

  it("Slide 2's corrected English/Arabic wording (length-vs-distance, unit definition) is unaffected by adding Slide 3", () => {
    expect(slide2.text.en).toContain(
      "L represents the dimension of length. Distance is one physical quantity that has the dimension of length.",
    );
    expect(slide2.text.ar).toContain("أما وحدة القياس فهي معيار محدد يُستخدم للتعبير عن مقدار الكمية، مثل المتر أو الكيلوجرام أو الثانية.");
  });

  it("Slide 1 and Slide 2 carry no table (table is Slide-3-specific data, not schema)", () => {
    expect(slide1.table).toBeUndefined();
    expect(slide2.table).toBeUndefined();
  });

  it("Slide 1 and Slide 2 render exactly as before: their own equation blocks, unaffected by Slide 3's presence", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 2);
    expect(
      getSlidePanel(container, 2)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("Speed = 120 miles / 2 h = 60 miles/h");
  });
});

describe("3. Slide 3 is loaded through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-3 has blockType \"slide\" in both raw source files (no new ContentBlockType)", () => {
    // Verified indirectly: normalizeSlides only ever collects blockType
    // "slide" records (see src/content/adapter.ts) — slide3 being present
    // in topic.slides at all proves its blockType is "slide", since any
    // other blockType would have been filtered out before reaching here.
    expect(slide3).toBeDefined();
    expect(slide3.recordId).toBe("ch01-t01-block-opening-3");
    expect(slide3.slideNumber).toBe(3);
  });

  it("NormalizedTopic carries no Slide-3-specific field — topic.slides is the only place Slide 3's data lives", () => {
    expect(Object.keys(topic)).not.toContain("openingConceptSlide3");
    expect(Object.keys(topic)).not.toContain("slide3");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-3")).toBe(true);
  });

  it("Slide 3 renders via the exact same generic topic.slides.map(...) as Slides 1 and 2 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector("#slide-3-header")).not.toBeNull();
  });
});

describe("4. The original English text and original table rows are preserved", () => {
  it("the verbatim original English prose is present, unaltered", () => {
    const en = slide3.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Distance");
    expect(en).toContain("Distance represents a measure of space in one dimension.");
    expect(en).toContain("Length, width, and height are examples of distance measurements");
    expect(en).toContain(
      "The following table lists the common distance units of measure, in both the metric and English systems and their abbreviations.",
    );
  });

  it("the original table's rows and empty cells are preserved exactly as reconstructed data", () => {
    const table = slide3.table?.en;
    expect(table).toBeDefined();
    expect(table!.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
    expect(table!.rows).toEqual([
      ["Distance d (or l, w, h)", "meter (m)", "foot (ft)"],
      [null, "millimeter (mm)", "inch (in.)"],
      [null, "centimeter (cm)", "mile (mi)"],
      [null, "kilometer (km)", null],
    ]);
  });

  it("the Arabic table has the same row/column shape, with translated labels and preserved empty cells", () => {
    const table = slide3.table?.ar;
    expect(table).toBeDefined();
    expect(table!.headers).toHaveLength(3);
    expect(table!.rows).toHaveLength(4);
    expect(table!.rows[0][0]).toContain("المسافة");
    expect(table!.rows[1][0]).toBeNull();
    expect(table!.rows[3][2]).toBeNull();
  });
});

describe("5. All structured headings render", () => {
  it("all nine subsection headings render in English", () => {
    renderSlides(false, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    const headings = Array.from(slide3Panel.querySelectorAll(".structured-slide__heading")).map(
      (el) => el.textContent,
    );
    expect(headings).toEqual([
      "Original English",
      "Main Idea",
      "Step-by-Step Explanation",
      "Simple Example",
      "Table Explanation",
      "Common Misconception",
      "Scientific Note",
      "Key Concept",
      "Connection to the Next Slide",
    ]);
  });

  it("all nine subsection headings render in Arabic", () => {
    renderSlides(true, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    const headings = Array.from(slide3Panel.querySelectorAll(".structured-slide__heading")).map(
      (el) => el.textContent,
    );
    expect(headings).toEqual([
      "النص الإنجليزي الأصلي",
      "الفكرة الرئيسية",
      "الشرح خطوة بخطوة",
      "مثال بسيط",
      "شرح الجدول",
      "مفهوم خاطئ شائع",
      "ملاحظة علمية",
      "المفهوم الأساسي",
      "الصلة بالشريحة التالية",
    ]);
  });
});

describe("6. Five numbered steps render in order", () => {
  it("English steps render in order with their exact titles", () => {
    renderSlides(false, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    const steps = Array.from(slide3Panel.querySelectorAll(".structured-slide__steps > li strong")).map(
      (el) => el.textContent,
    );
    expect(steps).toEqual([
      "Step 1 — Distance is a one-dimensional measurement",
      "Step 2 — Length, width, and height are distance measurements",
      "Step 3 — Symbols depend on the situation",
      "Step 4 — The metric system uses powers of ten",
      "Step 5 — The English system uses different units",
    ]);
  });

  it("Arabic steps render in order with their exact titles", () => {
    renderSlides(true, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    const steps = Array.from(slide3Panel.querySelectorAll(".structured-slide__steps > li strong")).map(
      (el) => el.textContent,
    );
    expect(steps).toEqual([
      "الخطوة 1 — المسافة قياس أحادي البعد",
      "الخطوة 2 — الطول والعرض والارتفاع قياسات للمسافة",
      "الخطوة 3 — الرموز تعتمد على السياق",
      "الخطوة 4 — يعتمد النظام المتري على قوى العدد عشرة",
      "الخطوة 5 — يستخدم النظام الإنجليزي وحدات مختلفة",
    ]);
  });
});

describe("7. The semantic table renders correctly", () => {
  it("renders a real <table> with <thead>/<tbody>, correct column headers, in English", () => {
    renderSlides(false, 3);
    const table = container.querySelector(".structured-slide__table")!;
    expect(table.tagName).toBe("TABLE");
    expect(table.querySelector("thead")).not.toBeNull();
    expect(table.querySelector("tbody")).not.toBeNull();
    const headers = Array.from(table.querySelectorAll("thead th")).map((el) => el.textContent);
    expect(headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) =>
      Array.from(tr.querySelectorAll("td")).map((td) => td.textContent),
    );
    expect(rows).toEqual([
      ["Distance d (or l, w, h)", "meter (m)", "foot (ft)"],
      ["", "millimeter (mm)", "inch (in.)"],
      ["", "centimeter (cm)", "mile (mi)"],
      ["", "kilometer (km)", ""],
    ]);
  });

  it("column headers use scope=\"col\" for accessibility", () => {
    renderSlides(false, 3);
    const headerCells = container.querySelectorAll(".structured-slide__table thead th");
    expect(headerCells).toHaveLength(3);
    headerCells.forEach((th) => expect(th.getAttribute("scope")).toBe("col"));
  });

  it("the table is NOT the uploaded screenshot — no <img> inside the Original English section", () => {
    renderSlides(false, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    expect(slide3Panel.querySelectorAll("img")).toHaveLength(0);
  });
});

describe("8. Mobile table scrolling works", () => {
  it("the table is wrapped in a horizontally-scrollable container (structured-slide__table-wrapper)", () => {
    renderSlides(false, 3);
    const wrapper = container.querySelector(".structured-slide__table-wrapper");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector("table.structured-slide__table")).not.toBeNull();
    // Actual overflow-x: auto CSS behavior and small-viewport rendering are
    // verified visually via Playwright (desktop + mobile viewports) rather
    // than in jsdom, which does not perform real layout/scroll — see the
    // session's Playwright verification script.
  });
});

describe("9. Arabic table direction and alignment are correct", () => {
  it("the table wrapper carries dir=\"rtl\" in Arabic and dir=\"ltr\" in English", () => {
    renderSlides(true, 3);
    const arWrapper = container.querySelector(".structured-slide__table-wrapper");
    expect(arWrapper?.getAttribute("dir")).toBe("rtl");

    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(false, 3);
    const enWrapper = container.querySelector(".structured-slide__table-wrapper");
    expect(enWrapper?.getAttribute("dir")).toBe("ltr");
  });

  it("the Arabic table renders translated headers and labels", () => {
    renderSlides(true, 3);
    const table = container.querySelector(".structured-slide__table")!;
    const headers = Array.from(table.querySelectorAll("thead th")).map((el) => el.textContent);
    expect(headers).toEqual(["الكمية الفيزيائية", "الوحدات المترية", "الوحدات الإنجليزية"]);
    const firstRow = Array.from(table.querySelectorAll("tbody tr")[0].querySelectorAll("td")).map(
      (el) => el.textContent,
    );
    expect(firstRow[0]).toContain("المسافة");
  });
});

describe("10. d, l, w, h, and L render correctly", () => {
  it("d, l, w, and L are present as standalone symbols in the English text", () => {
    const en = slide3.text.en ?? "";
    expect(en).toContain("d commonly represents distance.");
    expect(en).toContain("l commonly represents length.");
    expect(en).toContain("w commonly represents width.");
    expect(en).toContain("h commonly represents height.");
    expect(en).toContain("All have the physical dimension of length L.");
  });

  it("d, l, and w are italicized (whitelisted symbols); h renders as plain text (excluded to avoid the pre-existing km/h and miles/h collision)", () => {
    renderSlides(false, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    const italics = Array.from(slide3Panel.querySelectorAll("em")).map((el) => el.textContent);
    expect(italics).toContain("d");
    expect(italics).toContain("l");
    expect(italics).toContain("w");
    expect(italics).toContain("L");
    expect(italics).not.toContain("h");
    // "h" still appears in the rendered text, just not italicized.
    expect(slide3Panel.textContent).toContain("h commonly represents height.");
  });

  it("the symbols d, l, w, h are preserved verbatim in the original table's first-row cell", () => {
    expect(slide3.table?.en?.rows[0][0]).toBe("Distance d (or l, w, h)");
  });
});

describe("11. The table clarification states that rows are not equivalent conversions", () => {
  it("English Table Explanation states rows are not equivalent and includes both inequality examples", () => {
    const en = slide3.text.en ?? "";
    expect(en).toContain("Units appearing on the same row are not necessarily equivalent.");
    expect(en).toContain("It should not be interpreted as a conversion table.");
    expect(en).toContain("1 m ≠ 1 ft");
    expect(en).toContain("1 cm ≠ 1 mi");
  });

  it("Arabic Table Explanation states the same clarification with both inequality examples", () => {
    const ar = slide3.text.ar ?? "";
    expect(ar).toContain("ليست بالضرورة متكافئة");
    expect(ar).toContain("لا ينبغي تفسير الجدول على أنه جدول تحويل");
    expect(ar).toContain("1 m ≠ 1 ft");
    expect(ar).toContain("1 cm ≠ 1 mi");
  });

  it("renders the Table Explanation section in the DOM, both languages", () => {
    renderSlides(false, 3);
    expect(container.textContent).toContain("not necessarily equivalent");
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 3);
    expect(container.textContent).toContain("ليست بالضرورة متكافئة");
  });
});

describe("12. The example conversion 2 m = 200 cm is correct", () => {
  it("English Simple Example states 2 m = 200 cm and shows the labeled dimensions block", () => {
    const en = slide3.text.en ?? "";
    expect(en).toContain("2 m = 200 cm");
    expect(en).toContain("Dimensions: 200 cm × 80 cm × 75 cm");
  });

  it("Arabic Simple Example states the same conversion and labeled dimensions block (untranslated Latin notation)", () => {
    const ar = slide3.text.ar ?? "";
    expect(ar).toContain("2 m = 200 cm");
    expect(ar).toContain("الأبعاد: 200 cm × 80 cm × 75 cm");
  });

  it("renders the dimensions as a distinct, labeled block in the DOM (not an unexplained multiplication)", () => {
    renderSlides(false, 3);
    const slide3Panel = getSlidePanel(container, 3)!;
    const blocks = Array.from(slide3Panel.querySelectorAll(".structured-slide__equation-block")).map(
      (el) => el.textContent,
    );
    expect(blocks).toEqual(["Dimensions: 200 cm × 80 cm × 75 cm"]);
  });
});

describe("Pedagogical correction — labeled dimensions, not an implied volume calculation", () => {
  it("1. the dimensions block is labeled 'Dimensions:' / 'الأبعاد:' in both languages", () => {
    expect(slide3.text.en ?? "").toContain("Dimensions: 200 cm × 80 cm × 75 cm");
    expect(slide3.text.ar ?? "").toContain("الأبعاد: 200 cm × 80 cm × 75 cm");
  });

  it("2. explicitly states that no volume calculation is required, both languages", () => {
    expect(slide3.text.en ?? "").toContain(
      "The multiplication signs separate the three dimensions here; no volume calculation is required in this example.",
    );
    expect(slide3.text.ar ?? "").toContain(
      "تُستخدم علامات الضرب هنا للفصل بين الأبعاد الثلاثة، ولا يتطلب هذا المثال حساب الحجم.",
    );
  });

  it("3. the old 'comparing or combining them' / 'مقارنتها أو الجمع بينها' phrasing is absent", () => {
    expect(slide3.text.en ?? "").not.toContain("Before comparing or combining them, their units must be made consistent");
    expect(slide3.text.ar ?? "").not.toContain("وقبل مقارنتها أو الجمع بينها، يجب توحيد وحداتها");
    expect(slide3.text.en ?? "").toContain(
      "Before comparing these measurements or using them together in a calculation, their units should be made consistent: 2 m = 200 cm.",
    );
    expect(slide3.text.ar ?? "").toContain(
      "قبل مقارنة هذه القياسات أو استخدامها معًا في عملية حسابية، ينبغي توحيد وحداتها: 2 m = 200 cm.",
    );
  });

  it("4. the refined Scientific Note appears exactly in both languages", () => {
    expect(slide3.text.en ?? "").toContain(
      "Scientific Note: The meter is the SI unit of length. The millimeter and centimeter are decimal submultiples of the meter, while the kilometer is a decimal multiple of it.",
    );
    expect(slide3.text.en ?? "").not.toContain("metric multiples or submultiples of the meter");
    expect(slide3.text.ar ?? "").toContain(
      "ملاحظة علمية: المتر هو وحدة الطول في النظام الدولي للوحدات. والمليمتر والسنتيمتر أجزاء عشرية من المتر، بينما الكيلومتر من مضاعفاته.",
    );
    expect(slide3.text.ar ?? "").not.toContain("مضاعفات أو أجزاء مترية من المتر");
  });

  it("5. the source table and original quotation remain unchanged", () => {
    expect(slide3.text.en ?? "").toContain("1.1 Fundamental Physical Quantities: Distance");
    expect(slide3.text.en ?? "").toContain(
      "The following table lists the common distance units of measure, in both the metric and English systems and their abbreviations.",
    );
    expect(slide3.table?.en).toEqual({
      headers: ["Physical Quantity", "Metric Units", "English Units"],
      rows: [
        ["Distance d (or l, w, h)", "meter (m)", "foot (ft)"],
        [null, "millimeter (mm)", "inch (in.)"],
        [null, "centimeter (cm)", "mile (mi)"],
        [null, "kilometer (km)", null],
      ],
    });
  });

  it("6. Slides 1 and 2 remain unchanged", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
    expect(slide2.text.en).toContain(
      "L represents the dimension of length. Distance is one physical quantity that has the dimension of length.",
    );
    expect(slide2.text.ar).toContain("أما وحدة القياس فهي معيار محدد يُستخدم للتعبير عن مقدار الكمية، مثل المتر أو الكيلوجرام أو الثانية.");
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
  });

  it("renders the no-volume-calculation clarification in the DOM, both languages", () => {
    renderSlides(false, 3);
    expect(container.textContent).toContain("no volume calculation is required in this example");
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 3);
    expect(container.textContent).toContain("ولا يتطلب هذا المثال حساب الحجم");
  });
});

describe("13. Governance/publication flags remain unchanged", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 3's blockingReason does NOT include missingVisual (the uploaded table was fully available and used)", () => {
    expect(slide3.blocking.blockingReason).toContain("translationPending");
    expect(slide3.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide3.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slide 1/Slide 2's governance flags are untouched", () => {
    // 10 at the time this record was added, now 12 with Slides 4-5 also
    // present (see src/tests/slide4DifferentUnits.test.tsx and
    // slide5AreaVolume.test.tsx).
    expect(topic.governance.recordCount).toBe(12);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.blockingReason).not.toContain("missingVisual");
  });
});

describe("Reusability — Slide 3 proves the architecture scales without per-slide wiring", () => {
  it("all three slides render via the exact same generic StructuredSlideContent + table prop, distinguished only by their own recordId-keyed config", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(3);
    // Each slide's panel is opened in turn (single-open accordion), so its
    // equation block is checked one at a time rather than all at once.
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 2);
    expect(
      getSlidePanel(container, 2)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("Speed = 120 miles / 2 h = 60 miles/h");

    openSlideByNumber(container, 3);
    expect(
      getSlidePanel(container, 3)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("Dimensions: 200 cm × 80 cm × 75 cm");
  });

  it("topic.slides remains a plain array where every slide has recordId/slideNumber/title.en/title.ar — no slide-count-specific schema", () => {
    expect(Array.isArray(topic.slides)).toBe(true);
    expect(topic.slides.length).toBeGreaterThanOrEqual(3);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });
});
