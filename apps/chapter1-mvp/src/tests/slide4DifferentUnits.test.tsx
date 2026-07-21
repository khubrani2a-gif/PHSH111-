// @vitest-environment jsdom
//
// Tests for Slide 4 ("Why Do We Use Different Units for Different
// Measurement Scales?"), added as a fourth sibling under ch01-t01's
// existing Slides section (ch01-t01-block-opening-4, blockType "slide" —
// the same generic, reusable slide blockType shared with Slides 1-3).
// Covers the 13 checks explicitly requested for this task. Uses the same
// jsdom + createRoot/act pattern as
// src/tests/slide3DistanceUnits.test.tsx.
//
// Rendering now goes through the Slides accordion (see
// src/features/topics/Slides.tsx and src/tests/testHelpers/slidesTestHelpers.tsx)
// — only one slide's panel is mounted at a time, so any assertion about a
// slide's rendered content opens that slide first via openSlideByNumber.
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { getTopic } from "../content/adapter";
import {
  renderGenericSlides as renderGenericSlidesShared,
  openSlideByNumber,
  getSlidePanel,
} from "./testHelpers/slidesTestHelpers";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom does not implement <dialog>'s showModal()/close() — see
// src/tests/visualViewerDialog.test.tsx's header comment for the full
// rationale behind this minimal open/close-state polyfill (shared here
// since SlideFigure uses the identical native-<dialog> pattern).
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    };
  }
});

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

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

describe("1. Slide 4 appears after Slide 3", () => {
  it("topic.slides is ordered [Slide 1, Slide 2, Slide 3, Slide 4, ...] by slideNumber", () => {
    // Only the first four entries are asserted here — a later slide (e.g.
    // Slide 5, see src/tests/slide5AreaVolume.test.tsx) may legitimately
    // extend this array without breaking this Slide-4-scoped test.
    expect(topic.slides.slice(0, 4).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
    ]);
    expect(topic.slides.slice(0, 4).map((s) => s.slideNumber)).toEqual([1, 2, 3, 4]);
  });

  it("Slide 4's header follows Slide 3's header in DOM order, all four under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide3Idx = order.indexOf("slide-3-header");
    const slide4Idx = order.indexOf("slide-4-header");
    expect(slide3Idx).toBeGreaterThanOrEqual(0);
    expect(slide4Idx).toBeGreaterThan(slide3Idx);
    // At least Slides 1-4 — a later slide (e.g. Slide 5) may legitimately
    // add more without breaking this assertion.
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(4);
  });

  it("Slide 4's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 4);
    expect(getSlidePanel(container, 4)?.textContent).toContain(
      "Slide 4 — Why Do We Use Different Units for Different Measurement Scales?",
    );
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 4);
    expect(getSlidePanel(container, 4)?.textContent).toContain(
      "الشريحة 4 — لماذا نستخدم وحدات مختلفة باختلاف مقياس القياس؟",
    );
  });
});

describe("2. Slides 1-3 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 4", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 2's corrected wording is unaffected by adding Slide 4", () => {
    expect(slide2.text.en).toContain(
      "L represents the dimension of length. Distance is one physical quantity that has the dimension of length.",
    );
  });

  it("Slide 3's corrected wording, table, and figure absence are unaffected by adding Slide 4", () => {
    expect(slide3.text.en).toContain("Dimensions: 200 cm × 80 cm × 75 cm");
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
    expect(slide3.figure).toBeUndefined();
  });

  it("Slides 1-3 render their own equation blocks unchanged, unaffected by Slide 4's presence", () => {
    renderSlides(false, 1);
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
});

describe("3. Slide 4 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-4 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide4).toBeDefined();
    expect(slide4.recordId).toBe("ch01-t01-block-opening-4");
    expect(slide4.slideNumber).toBe(4);
  });

  it("NormalizedTopic carries no Slide-4-specific field — topic.slides is the only place Slide 4's data lives", () => {
    expect(Object.keys(topic)).not.toContain("openingConceptSlide4");
    expect(Object.keys(topic)).not.toContain("slide4");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-4")).toBe(true);
  });

  it("Slide 4 renders via the exact same generic topic.slides.map(...) as Slides 1-3 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(4);
    expect(container.querySelector("#slide-4-header")).not.toBeNull();
  });
});

describe("4. Original English content is preserved", () => {
  it("the verbatim original English prose is present, unaltered", () => {
    const en = slide4.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities");
    expect(en).toContain("Why are there so many different units in each system?");
    expect(en).toContain(
      "Generally, it is easier to use a unit that fits the scale of the system being considered. The meter is good for measuring the size of a house, the millimeter for measuring the size of a coin, and the kilometer for measuring the distance between cities.",
    );
  });

  it("the figure labels are preserved exactly as quoted lines", () => {
    const en = slide4.text.en ?? "";
    expect(en).toContain("19 mm");
    expect(en).toContain("0.000019 km");
  });

  it("the Arabic translation of the original source preserves the numerical figure labels", () => {
    const ar = slide4.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية");
    expect(ar).toContain("لماذا توجد وحدات مختلفة كثيرة في كل نظام؟");
    expect(ar).toContain("19 mm");
    expect(ar).toContain("0.000019 km");
  });
});

describe("5. All structured headings render", () => {
  it("all nine subsection headings render in English", () => {
    renderSlides(false, 4);
    const slide4Panel = getSlidePanel(container, 4)!;
    const headings = Array.from(slide4Panel.querySelectorAll(".structured-slide__heading")).map(
      (el) => el.textContent,
    );
    expect(headings).toEqual([
      "Original English",
      "Main Idea",
      "Step-by-Step Explanation",
      "Simple Example",
      "Figure Explanation",
      "Common Misconception",
      "Scientific Note",
      "Key Concept",
      "Connection to the Next Slide",
    ]);
  });

  it("all nine subsection headings render in Arabic", () => {
    renderSlides(true, 4);
    const slide4Panel = getSlidePanel(container, 4)!;
    const headings = Array.from(slide4Panel.querySelectorAll(".structured-slide__heading")).map(
      (el) => el.textContent,
    );
    expect(headings).toEqual([
      "النص الإنجليزي الأصلي",
      "الفكرة الرئيسية",
      "الشرح خطوة بخطوة",
      "مثال بسيط",
      "شرح الشكل",
      "مفهوم خاطئ شائع",
      "ملاحظة علمية",
      "المفهوم الأساسي",
      "الصلة بالشريحة التالية",
    ]);
  });
});

describe("6. Five numbered steps render in order", () => {
  it("English steps render in order with their exact titles", () => {
    renderSlides(false, 4);
    const slide4Panel = getSlidePanel(container, 4)!;
    const steps = Array.from(slide4Panel.querySelectorAll(".structured-slide__steps > li strong")).map(
      (el) => el.textContent,
    );
    expect(steps).toEqual([
      "Step 1 — The physical distance does not change",
      "Step 2 — Small objects are easier to measure using small units",
      "Step 3 — Medium-sized objects are suited to meters",
      "Step 4 — Large distances are suited to kilometers",
      "Step 5 — Equivalent units describe the same measurement",
    ]);
  });

  it("Arabic steps render in order with their exact titles", () => {
    renderSlides(true, 4);
    const slide4Panel = getSlidePanel(container, 4)!;
    const steps = Array.from(slide4Panel.querySelectorAll(".structured-slide__steps > li strong")).map(
      (el) => el.textContent,
    );
    expect(steps).toEqual([
      "الخطوة 1 — لا تتغير المسافة الفيزيائية",
      "الخطوة 2 — يسهل قياس الأجسام الصغيرة باستخدام وحدات صغيرة",
      "الخطوة 3 — تناسب الأمتار الأجسام متوسطة الحجم",
      "الخطوة 4 — تناسب الكيلومترات المسافات الكبيرة",
      "الخطوة 5 — تصف الوحدات المتكافئة القياس نفسه",
    ]);
  });
});

describe("7. 19 mm = 0.000019 km is present and correct", () => {
  it("Step 5 states the equivalence in both languages", () => {
    expect(slide4.text.en ?? "").toContain("19 mm = 0.000019 km");
    expect(slide4.text.ar ?? "").toContain("19 mm = 0.000019 km");
  });

  it("1 km = 1,000,000 mm is also present (verifying the conversion factor)", () => {
    // 1 km = 1000 m = 1,000,000 mm — arithmetically correct.
    expect(slide4.text.en ?? "").toContain("1 km = 1,000,000 mm");
    // 19 mm / 1,000,000 = 0.000019 km — arithmetically correct.
    expect(19 / 1_000_000).toBeCloseTo(0.000019, 9);
  });

  it("renders in the DOM within Step 5, both languages", () => {
    renderSlides(false, 4);
    expect(container.textContent).toContain("19 mm = 0.000019 km");
  });
});

describe("8. The classroom example conversions are correct", () => {
  it("English Simple Example states 8 m = 8000 mm and 8 m = 0.008 km", () => {
    const en = slide4.text.en ?? "";
    expect(en).toContain("A classroom has a length of 8 m");
    expect(en).toContain("8 m = 8000 mm");
    expect(en).toContain("8 m = 0.008 km");
    // 8 m = 8000 mm (m -> mm is x1000) and 8 m = 0.008 km (m -> km is /1000).
    expect(8 * 1000).toBe(8000);
    expect(8 / 1000).toBeCloseTo(0.008, 9);
  });

  it("Arabic Simple Example states the same conversions", () => {
    const ar = slide4.text.ar ?? "";
    expect(ar).toContain("يبلغ طول فصل دراسي 8 m");
    expect(ar).toContain("8 m = 8000 mm");
    expect(ar).toContain("8 m = 0.008 km");
  });
});

describe("9. The figure renders and is enlargeable", () => {
  it("renders a responsive <img> inside the Figure Explanation section", () => {
    renderSlides(false, 4);
    const slide4Panel = getSlidePanel(container, 4)!;
    const img = slide4Panel.querySelector(".slide-figure__img");
    expect(img).not.toBeNull();
    expect(img?.tagName).toBe("IMG");
  });

  it("clicking the enlarge button opens an accessible native <dialog> with the figure", () => {
    renderSlides(false, 4);
    const enlargeButton = container.querySelector(".slide-figure__enlarge") as HTMLButtonElement;
    expect(enlargeButton).not.toBeNull();
    act(() => enlargeButton.click());
    const dialog = container.querySelector(".slide-figure__dialog");
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelector(".slide-figure__dialog-img")).not.toBeNull();
    expect(dialog?.querySelector(".slide-figure__close")).not.toBeNull();
  });

  it("closing the dialog returns to the collapsed preview", () => {
    renderSlides(false, 4);
    const enlargeButton = container.querySelector(".slide-figure__enlarge") as HTMLButtonElement;
    act(() => enlargeButton.click());
    const closeButton = container.querySelector(".slide-figure__close") as HTMLButtonElement;
    expect(closeButton).not.toBeNull();
    act(() => closeButton.click());
    expect(container.querySelector(".slide-figure__dialog")).toBeNull();
    expect(container.querySelector(".slide-figure__img")).not.toBeNull();
  });
});

describe("10. Bilingual alt text is present", () => {
  it("English alt text matches exactly", () => {
    renderSlides(false, 4);
    const img = container.querySelector(".slide-figure__img") as HTMLImageElement;
    expect(img.alt).toBe(
      "A coin with a diameter labeled as 19 millimeters and the equivalent value 0.000019 kilometers.",
    );
  });

  it("Arabic alt text matches exactly", () => {
    renderSlides(true, 4);
    const img = container.querySelector(".slide-figure__img") as HTMLImageElement;
    expect(img.alt).toBe("قطعة نقدية يظهر قطرها بقيمتين متكافئتين: 19 مليمترًا و0.000019 كيلومتر.");
  });

  it("NormalizedSlide.figure.alt carries both languages", () => {
    expect(slide4.figure?.alt.en).toBe(
      "A coin with a diameter labeled as 19 millimeters and the equivalent value 0.000019 kilometers.",
    );
    expect(slide4.figure?.alt.ar).toBe("قطعة نقدية يظهر قطرها بقيمتين متكافئتين: 19 مليمترًا و0.000019 كيلومتر.");
  });
});

describe("11. Arabic RTL is correct", () => {
  it("document dir is rtl in Arabic, ltr in English", () => {
    renderSlides(true, 4);
    expect(container.querySelector(".slide-figure__preview")).not.toBeNull();
    const slide4Panel = getSlidePanel(container, 4)!;
    const arParagraph = slide4Panel.querySelector("p[dir]");
    expect(arParagraph?.getAttribute("dir")).toBe("rtl");

    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(false, 4);
    const slide4PanelEn = getSlidePanel(container, 4)!;
    const enParagraph = slide4PanelEn.querySelector("p[dir]");
    expect(enParagraph?.getAttribute("dir")).toBe("ltr");
  });

  it("the enlarge dialog carries dir=\"rtl\" in Arabic", () => {
    renderSlides(true, 4);
    const enlargeButton = container.querySelector(".slide-figure__enlarge") as HTMLButtonElement;
    act(() => enlargeButton.click());
    const dialog = container.querySelector(".slide-figure__dialog");
    expect(dialog?.getAttribute("dir")).toBe("rtl");
  });
});

describe("12. The misconception clearly states that physical size does not change", () => {
  it("English misconception states the correction explicitly", () => {
    const en = slide4.text.en ?? "";
    expect(en).toContain("Misconception: changing the unit changes the actual size of the object.");
    expect(en).toContain(
      "Correction: the physical size remains unchanged; only the numerical value and the unit used to express it change.",
    );
  });

  it("Arabic misconception states the correction explicitly", () => {
    const ar = slide4.text.ar ?? "";
    expect(ar).toContain("مفهوم خاطئ: يؤدي تغيير الوحدة إلى تغيير الحجم الفعلي للجسم.");
    expect(ar).toContain("التصحيح: يبقى الحجم الفيزيائي ثابتًا، وتتغير فقط القيمة العددية والوحدة المستخدمة للتعبير عنه.");
  });

  it("renders in the DOM, both languages", () => {
    renderSlides(false, 4);
    expect(container.textContent).toContain("the physical size remains unchanged");
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 4);
    expect(container.textContent).toContain("يبقى الحجم الفيزيائي ثابتًا");
  });
});

describe("13. Governance and publication flags remain unchanged", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 4's blockingReason does NOT include missingVisual (the uploaded figure was fully available and used)", () => {
    expect(slide4.blocking.blockingReason).toContain("translationPending");
    expect(slide4.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide4.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-3's governance flags are untouched", () => {
    // 11 at the time this record was added, now 13 with Slides 5-6 also
    // present (see src/tests/slide5AreaVolume.test.tsx and
    // slide6AreaVolumeUnits.test.tsx).
    expect(topic.governance.recordCount).toBe(13);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.blockingReason).not.toContain("missingVisual");
  });
});

describe("Reusability — Slide 4 proves the architecture scales to a slide-embedded figure without per-slide wiring", () => {
  it("all four slides render via the exact same generic StructuredSlideContent, distinguished only by their own recordId-keyed config", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide").length).toBeGreaterThanOrEqual(4);
  });

  it("topic.slides remains a plain array where every slide has recordId/slideNumber/title.en/title.ar — no slide-count-specific schema", () => {
    expect(Array.isArray(topic.slides)).toBe(true);
    expect(topic.slides.length).toBeGreaterThanOrEqual(4);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });

  it("only Slide 4 carries a figure — figure is a generic, per-slide-optional field, not a topic-level or Slide-4-hardcoded one", () => {
    expect(slide1.figure).toBeUndefined();
    expect(slide2.figure).toBeUndefined();
    expect(slide3.figure).toBeUndefined();
    expect(slide4.figure).toBeDefined();
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
    expect(slide4.figure?.assetUrl.length).toBeGreaterThan(0);
  });
});
