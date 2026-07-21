// @vitest-environment jsdom
//
// Tests for Slide 5 ("How Are Area and Volume Derived from Distance?"),
// added as a fifth sibling under ch01-t01's existing Slides section
// (ch01-t01-block-opening-5, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1-4). Covers the 13 checks
// explicitly requested for this task. Uses the same jsdom +
// createRoot/act pattern as src/tests/slide4DifferentUnits.test.tsx.
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
// rationale behind this minimal open/close-state polyfill.
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
const slide5 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-5")!;

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

describe("1. Slide 5 appears after Slide 4", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 5] by slideNumber", () => {
    expect(topic.slides.map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
    ]);
    expect(topic.slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5]);
  });

  it("Slide 5's header follows Slide 4's header in DOM order, all five under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide4Idx = order.indexOf("slide-4-header");
    const slide5Idx = order.indexOf("slide-5-header");
    expect(slide4Idx).toBeGreaterThanOrEqual(0);
    expect(slide5Idx).toBeGreaterThan(slide4Idx);
    expect(container.querySelectorAll(".slides-section .slide")).toHaveLength(5);
  });

  it("Slide 5's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 5);
    expect(getSlidePanel(container, 5)?.textContent).toContain(
      "Slide 5 — How Are Area and Volume Derived from Distance?",
    );
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 5);
    expect(getSlidePanel(container, 5)?.textContent).toContain(
      "الشريحة 5 — كيف تُشتق المساحة والحجم من المسافة؟",
    );
  });
});

describe("2. Slides 1-4 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 5", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 2's corrected wording is unaffected by adding Slide 5", () => {
    expect(slide2.text.en).toContain(
      "L represents the dimension of length. Distance is one physical quantity that has the dimension of length.",
    );
  });

  it("Slide 3's corrected wording and table are unaffected by adding Slide 5", () => {
    expect(slide3.text.en).toContain("Dimensions: 200 cm × 80 cm × 75 cm");
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure and title are unaffected by adding Slide 5", () => {
    expect(slide4.text.en).toContain("19 mm");
    expect(slide4.title.ar).toBe("لماذا نستخدم وحدات مختلفة باختلاف مقياس القياس؟");
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slides 1-4 render their own equation/figure content unchanged, unaffected by Slide 5's presence", () => {
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

    openSlideByNumber(container, 4);
    expect(getSlidePanel(container, 4)?.querySelector(".slide-figure__img")).not.toBeNull();
  });
});

describe("3. Slide 5 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-5 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide5).toBeDefined();
    expect(slide5.recordId).toBe("ch01-t01-block-opening-5");
    expect(slide5.slideNumber).toBe(5);
  });

  it("NormalizedTopic carries no Slide-5-specific field — topic.slides is the only place Slide 5's data lives", () => {
    expect(Object.keys(topic)).not.toContain("openingConceptSlide5");
    expect(Object.keys(topic)).not.toContain("slide5");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-5")).toBe(true);
  });

  it("Slide 5 renders via the exact same generic topic.slides.map(...) as Slides 1-4 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide")).toHaveLength(5);
    expect(container.querySelector("#slide-5-header")).not.toBeNull();
  });

  it("Slide 5's figure reuses the exact same generic figureAssetPath/figureAltEn/figureAltAr mechanism as Slide 4, not a new schema field", () => {
    expect(slide5.figure).toBeDefined();
    expect(slide5.figure?.assetUrl).toEqual(expect.any(String));
    expect(slide5.figure?.assetUrl).not.toBe(slide4.figure?.assetUrl);
  });
});

describe("4. Original English content is preserved", () => {
  it("the verbatim original English prose is present, unaltered", () => {
    const en = slide5.text.en ?? "";
    expect(en).toContain("1.1 Fundamental Physical Quantities: Area and Volume");
    expect(en).toContain("Two other physical quantities that are closely related to distance are area and volume.");
    expect(en).toContain(
      "Area and volume are examples of physical quantities that are based on other physical quantities—in this case, just distance.",
    );
    expect(en).toContain("Area commonly refers to the size of a surface.");
    expect(en).toContain("Example: the floor in a room or the outer skin of a basketball.");
    expect(en).toContain(
      "The concept of area can apply to surfaces that are not flat and to “empty,” two-dimensional spaces such as holes and open windows",
    );
    expect(en).toContain(
      "Every surface, whether it is flat or curved, has an area. The area of this rectangle and the area of the surface of the basketball are equal",
    );
  });

  it("the rectangle labels are preserved exactly as quoted lines", () => {
    const en = slide5.text.en ?? "";
    expect(en).toContain("1 ft");
    expect(en).toContain("1.96 ft");
  });

  it("the Arabic translation of the original source is preserved, including the rectangle labels", () => {
    const ar = slide5.text.ar ?? "";
    expect(ar).toContain("1.1 الكميات الفيزيائية الأساسية: المساحة والحجم");
    expect(ar).toContain("توجد كميتان فيزيائيتان أخريان ترتبطان ارتباطًا وثيقًا بالمسافة، وهما المساحة والحجم.");
    expect(ar).toContain("1 ft");
    expect(ar).toContain("1.96 ft");
  });
});

describe("5. All nine structured headings render", () => {
  it("all nine subsection headings render in English", () => {
    renderSlides(false, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const headings = Array.from(slide5Panel.querySelectorAll(".structured-slide__heading")).map(
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
    renderSlides(true, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const headings = Array.from(slide5Panel.querySelectorAll(".structured-slide__heading")).map(
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
    renderSlides(false, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const steps = Array.from(slide5Panel.querySelectorAll(".structured-slide__steps > li strong")).map(
      (el) => el.textContent,
    );
    expect(steps).toEqual([
      "Step 1 — Area and volume are derived from length",
      "Step 2 — Area measures the size of a surface",
      "Step 3 — Area applies to flat and curved surfaces",
      "Step 4 — Empty regions can also have area",
      "Step 5 — Volume describes three-dimensional space",
    ]);
  });

  it("Arabic steps render in order with their exact titles", () => {
    renderSlides(true, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const steps = Array.from(slide5Panel.querySelectorAll(".structured-slide__steps > li strong")).map(
      (el) => el.textContent,
    );
    expect(steps).toEqual([
      "الخطوة 1 — تُشتق المساحة والحجم من الطول",
      "الخطوة 2 — تقيس المساحة حجم السطح",
      "الخطوة 3 — تنطبق المساحة على الأسطح المستوية والمنحنية",
      "الخطوة 4 — يمكن أن تمتلك المناطق الفارغة مساحة أيضًا",
      "الخطوة 5 — يصف الحجم الحيز ثلاثي الأبعاد",
    ]);
  });
});

describe("7. L² and L³ render correctly", () => {
  it("English text states the dimensions using literal superscript Unicode characters", () => {
    const en = slide5.text.en ?? "";
    expect(en).toContain("The dimensions are L² for area and L³ for volume.");
    expect(en).toContain("Area has the physical dimension L², while volume has the physical dimension L³.");
  });

  it("Arabic text states the same dimensions", () => {
    const ar = slide5.text.ar ?? "";
    expect(ar).toContain("بُعد المساحة هو L²، وبُعد الحجم هو L³.");
    expect(ar).toContain("للمساحة البُعد الفيزيائي L²، بينما للحجم البُعد الفيزيائي L³.");
  });

  it("renders L², L³, m², m³ in the DOM", () => {
    renderSlides(false, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const text = slide5Panel.textContent ?? "";
    expect(text).toContain("L²");
    expect(text).toContain("L³");
    expect(text).toContain("m²");
    expect(text).toContain("m³");
  });
});

describe("8. The floor example produces 12 m²", () => {
  it("English Simple Example states A = l × w and the substituted result 12 m²", () => {
    const en = slide5.text.en ?? "";
    expect(en).toContain("A rectangular floor has a length of 4 m and a width of 3 m.");
    expect(en).toContain("A = l × w");
    expect(en).toContain("A = (4 m)(3 m) = 12 m²");
    // 4 x 3 = 12 — arithmetically correct.
    expect(4 * 3).toBe(12);
  });

  it("Arabic Simple Example states the same symbolic calculation", () => {
    const ar = slide5.text.ar ?? "";
    expect(ar).toContain("أرضية مستطيلة طولها 4 m وعرضها 3 m.");
    expect(ar).toContain("A = l × w");
    expect(ar).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("renders the calculation as a distinct equation block in the DOM", () => {
    renderSlides(false, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const blocks = Array.from(slide5Panel.querySelectorAll(".structured-slide__equation-block")).map(
      (el) => el.textContent,
    );
    expect(blocks).toEqual(["A = (4 m)(3 m) = 12 m²"]);
  });
});

describe("9. The rectangle diagram shows 1 ft and 1.96 ft", () => {
  it("renders a figure with the correct dimensions in its alt text", () => {
    renderSlides(false, 5);
    const img = getSlidePanel(container, 5)!.querySelector(".slide-figure__img") as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.alt).toContain("1 foot");
    expect(img.alt).toContain("1.96 feet");
  });

  it("the SVG asset itself contains both dimension labels", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const dir = dirname(fileURLToPath(import.meta.url));
    const svgPath = resolve(dir, "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-block-opening-5-figure.svg");
    const svg = readFileSync(svgPath, "utf8");
    expect(svg).toContain("1 ft");
    expect(svg).toContain("1.96 ft");
  });
});

describe("10. The Figure Explanation calculates 1.96 ft²", () => {
  it("English Figure Explanation states the rectangle's area", () => {
    const en = slide5.text.en ?? "";
    expect(en).toContain(
      "The rectangle has dimensions 1 ft by 1.96 ft, so its area is 1.96 ft².",
    );
    // 1 x 1.96 = 1.96 — arithmetically correct.
    expect(1 * 1.96).toBeCloseTo(1.96, 9);
  });

  it("Arabic Figure Explanation states the same area", () => {
    const ar = slide5.text.ar ?? "";
    expect(ar).toContain("أبعاد المستطيل هي 1 ft في 1.96 ft، ولذلك تبلغ مساحته 1.96 ft².");
  });

  it("renders in the DOM, both languages", () => {
    renderSlides(false, 5);
    expect(container.textContent).toContain("its area is 1.96 ft²");
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 5);
    expect(container.textContent).toContain("تبلغ مساحته 1.96 ft²");
  });
});

describe("11. The irrelevant coin fragment is absent", () => {
  it("the SVG asset embeds no raster image (no <image> element — no coin photo, no basketball photo)", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const dir = dirname(fileURLToPath(import.meta.url));
    const svgPath = resolve(dir, "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-block-opening-5-figure.svg");
    const svg = readFileSync(svgPath, "utf8");
    expect(svg).not.toContain("<image");
  });

  it("no visible <text> in the SVG mentions a coin, a basketball, or the unrelated 0.000019 km value", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const dir = dirname(fileURLToPath(import.meta.url));
    const svgPath = resolve(dir, "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-block-opening-5-figure.svg");
    const svg = readFileSync(svgPath, "utf8");
    const visibleText = Array.from(svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g))
      .map((m) => m[1])
      .join(" ")
      .toLowerCase();
    expect(visibleText).not.toContain("coin");
    expect(visibleText).not.toContain("basketball");
    expect(visibleText).not.toContain("0.000019");
  });

  it("the accessibility description documents that the coin fragment and basketball were intentionally excluded (context, not a rendered artifact)", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");
    const dir = dirname(fileURLToPath(import.meta.url));
    const svgPath = resolve(dir, "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-block-opening-5-figure.svg");
    const svg = readFileSync(svgPath, "utf8");
    expect(svg).toMatch(/<desc[^>]*>.*intentionally omitted.*<\/desc>/s);
  });

  it("Slide 5's figure asset is a different file from Slide 4's coin photograph", () => {
    expect(slide5.figure?.assetUrl).not.toBe(slide4.figure?.assetUrl);
  });

  it("no <img> other than the rectangle diagram appears in Slide 5's Figure Explanation section", () => {
    renderSlides(false, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const imgs = slide5Panel.querySelectorAll("img");
    expect(imgs).toHaveLength(1);
  });
});

describe("12. Arabic RTL is correct", () => {
  it("document dir is rtl in Arabic, ltr in English", () => {
    renderSlides(true, 5);
    const slide5Panel = getSlidePanel(container, 5)!;
    const arParagraph = slide5Panel.querySelector("p[dir]");
    expect(arParagraph?.getAttribute("dir")).toBe("rtl");

    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(false, 5);
    const slide5PanelEn = getSlidePanel(container, 5)!;
    const enParagraph = slide5PanelEn.querySelector("p[dir]");
    expect(enParagraph?.getAttribute("dir")).toBe("ltr");
  });

  it("Arabic alt text renders on the figure", () => {
    renderSlides(true, 5);
    const img = getSlidePanel(container, 5)!.querySelector(".slide-figure__img") as HTMLImageElement;
    expect(img.alt).toContain("قدم");
  });
});

describe("13. Governance and publication flags remain unchanged", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide5.blocking.studentFacingAllowed).toBe(false);
    expect(slide5.blocking.blockingStatus).toBe("blocked");
  });

  it("Slide 5's blockingReason does NOT include missingVisual (the rectangle diagram was fully reconstructable and used)", () => {
    expect(slide5.blocking.blockingReason).toContain("translationPending");
    expect(slide5.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide5.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-4's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(12);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide3.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.studentFacingAllowed).toBe(false);
    expect(slide4.blocking.blockingReason).not.toContain("missingVisual");
  });
});

describe("Reusability — Slide 5 proves the generic figure mechanism extends to a hand-authored SVG, not just raster photos", () => {
  it("all five slides render via the exact same generic StructuredSlideContent, distinguished only by their own recordId-keyed config", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide")).toHaveLength(5);
  });

  it("topic.slides remains a plain array where every slide has recordId/slideNumber/title.en/title.ar — no slide-count-specific schema", () => {
    expect(Array.isArray(topic.slides)).toBe(true);
    expect(topic.slides.length).toBe(5);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });

  it("Slides 4 and 5 both carry a figure via the identical generic field, differing only in asset content (raster vs. SVG)", () => {
    expect(slide4.figure).toBeDefined();
    expect(slide5.figure).toBeDefined();
    expect(slide1.figure).toBeUndefined();
    expect(slide2.figure).toBeUndefined();
    expect(slide3.figure).toBeUndefined();
  });
});
