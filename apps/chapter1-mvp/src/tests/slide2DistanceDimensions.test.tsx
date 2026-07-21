// @vitest-environment jsdom
//
// Tests for Slide 2 ("How Are Physical Quantities Built from Distance,
// Mass, and Time?"), added as a sibling of Slide 1 under ch01-t01's
// existing Slides section (ch01-t01-block-opening-2, blockType "slide" —
// the generic, reusable slide blockType shared with Slide 1). Covers the
// 12 checks explicitly requested for the original task, plus the
// corrections requested in review: the length-vs-distance dimension
// wording, the Arabic unit definition, removal of the missingVisual
// blocking reason, and the generic topic.slides[] collection
// architecture. Uses the same jsdom + createRoot/act pattern as
// src/tests/ch01t01Interactions.test.tsx.
//
// Rendering now goes through the Slides accordion (see
// src/features/topics/Slides.tsx and src/tests/testHelpers/slidesTestHelpers.tsx)
// — only one slide's panel is mounted at a time, so any assertion about a
// slide's rendered content opens that slide first via openSlideByNumber.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
import { StructuredSlideContent } from "../features/topics/StructuredSlideContent";
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
const PROSE_TOKENS = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"];

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

describe("1. Slide 2 appears after Slide 1", () => {
  it("topic.slides is ordered [Slide 1, Slide 2, ...] by slideNumber", () => {
    // Only the first two entries are asserted here — a later slide (e.g.
    // Slide 3, see src/tests/slide3DistanceUnits.test.tsx) may legitimately
    // extend this array without breaking this Slide-2-scoped test.
    expect(topic.slides.slice(0, 2).map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
    ]);
    expect(topic.slides.slice(0, 2).map((s) => s.slideNumber)).toEqual([1, 2]);
  });

  it("Slide 2's header follows Slide 1's header in DOM order, both under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide1Idx = order.indexOf("slide-1-header");
    const slide2Idx = order.indexOf("slide-2-header");
    expect(slide1Idx).toBeGreaterThanOrEqual(0);
    expect(slide2Idx).toBeGreaterThan(slide1Idx);
    // At least Slide 1 and Slide 2 — a later slide (e.g. Slide 3) may
    // legitimately add more without breaking this assertion.
    expect(container.querySelectorAll(".slides-section .slide").length).toBeGreaterThanOrEqual(2);
  });

  it("Slide 2's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 2);
    expect(getSlidePanel(container, 2)?.textContent).toContain(
      "Slide 2 — How Are Physical Quantities Built from Distance, Mass, and Time?",
    );
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 2);
    expect(getSlidePanel(container, 2)?.textContent).toContain(
      "الشريحة 2 — كيف تُبنى الكميات الفيزيائية من المسافة والكتلة والزمن؟",
    );
  });
});

describe("2. Slide 1 remains byte-for-byte unchanged", () => {
  it("Slide 1's English and Arabic text are unchanged from before Slide 2 was added", () => {
    const en = slide1.text.en ?? "";
    const ar = slide1.text.ar ?? "";
    expect(en).toContain("In physics, there are three basic aspects of the material universe");
    expect(en).toContain("v = d / t = 100 m / 5 s = 20 m/s");
    expect(en).toContain(
      "Scientific Note: This slide follows the textbook's introductory framework for the quantities discussed in this chapter. The complete modern SI system contains seven base quantities.",
    );
    expect(en).not.toContain("Q = I t");
    expect(ar).toContain("في الفيزياء، توجد ثلاثة جوانب أساسية للكون المادي");
  });

  it("Slide 1 renders identically (same headings/steps/equation) alongside Slide 2, open by default", () => {
    renderSlides(false);
    const slide1Panel = getSlidePanel(container, 1)!;
    const headings = Array.from(slide1Panel.querySelectorAll(".structured-slide__heading")).map(
      (h) => h.textContent,
    );
    expect(headings).toEqual([
      "Original English",
      "Main Idea",
      "Step-by-Step Explanation",
      "Simple Example",
      "Common Misconception",
      "Scientific Note",
      "Connection to the Next Slide",
    ]);
    expect(slide1Panel.querySelector(".structured-slide__equation-block")?.textContent).toBe(
      "v = d / t = 100 m / 5 s = 20 m/s",
    );
  });
});

describe("3. The original English text appears exactly", () => {
  it("verbatim quotation from the uploaded slide renders unchanged", () => {
    renderSlides(false, 2);
    const text = container.textContent ?? "";
    expect(text).toContain("1.1 Fundamental Physical Quantities: Distance");
    expect(text).toContain("Mostly all quantities can be classified in terms of the fundamental physical quantities:");
    expect(text).toContain("Distance (L)");
    expect(text).toContain("Mass (M)");
    expect(text).toContain("Time (T)");
    expect(text).toContain("For example, speed has the unit of miles per hour (L/T).");
  });

  it("was not silently corrected — 'Mostly all quantities' (unusual but as-supplied) is preserved verbatim", () => {
    const en = slide2.text.en ?? "";
    expect(en).toContain("Mostly all quantities can be classified");
    expect(en).not.toContain("Most quantities can be classified");
  });

  it("Arabic translation of the original quote renders exactly as supplied", () => {
    renderSlides(true, 2);
    const text = container.textContent ?? "";
    expect(text).toContain("1.1 الكميات الفيزيائية الأساسية: المسافة");
    expect(text).toContain("يمكن تصنيف معظم الكميات من حيث الكميات الفيزيائية الأساسية:");
    expect(text).toContain("المسافة (L)");
    expect(text).toContain("الكتلة (M)");
    expect(text).toContain("الزمن (T)");
  });
});

describe("4. All structured headings render", () => {
  it("all 8 English headings render, in order (no Figure Explanation — omitted, see final report)", () => {
    renderSlides(false, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const headings = Array.from(slide2Panel.querySelectorAll(".structured-slide__heading")).map(
      (h) => h.textContent,
    );
    expect(headings).toEqual([
      "Original English",
      "Main Idea",
      "Step-by-Step Explanation",
      "Simple Example",
      "Common Misconception",
      "Scientific Note",
      "Key Concept",
      "Connection to the Next Slide",
    ]);
  });

  it("all 8 Arabic headings render, in order", () => {
    renderSlides(true, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const headings = Array.from(slide2Panel.querySelectorAll(".structured-slide__heading")).map(
      (h) => h.textContent,
    );
    expect(headings).toEqual([
      "النص الإنجليزي الأصلي",
      "الفكرة الرئيسية",
      "الشرح خطوة بخطوة",
      "مثال بسيط",
      "مفهوم خاطئ شائع",
      "ملاحظة علمية",
      "المفهوم الأساسي",
      "الصلة بالشريحة التالية",
    ]);
  });

  it("headings are real semantic <h4> elements, bold via CSS class", () => {
    renderSlides(false, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const headingTags = Array.from(slide2Panel.querySelectorAll(".structured-slide__heading")).map(
      (h) => h.tagName,
    );
    expect(headingTags.every((t) => t === "H4")).toBe(true);
  });
});

describe("5. The five numbered steps are in order", () => {
  it("English steps render with real bolded titles, in order 1-5", () => {
    renderSlides(false, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const steps = Array.from(slide2Panel.querySelectorAll(".structured-slide__steps > li"));
    expect(steps).toHaveLength(5);
    const titles = steps.map((li) => li.querySelector("strong.structured-slide__step-number")?.textContent);
    expect(titles).toEqual([
      "Step 1 — Distance is represented by L",
      "Step 2 — Mass is represented by M",
      "Step 3 — Time is represented by T",
      "Step 4 — Derived quantities combine fundamental quantities",
      "Step 5 — Speed combines distance and time",
    ]);
    // Each step's bullet lines render as sub-list items.
    expect(steps[0].querySelectorAll(".structured-slide__step-clauses li")).toHaveLength(3);
    expect(steps[4].querySelectorAll(".structured-slide__step-clauses li")).toHaveLength(4);
  });

  it("Arabic steps render with real bolded titles, in order 1-5", () => {
    renderSlides(true, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const steps = Array.from(slide2Panel.querySelectorAll(".structured-slide__steps > li"));
    const titles = steps.map((li) => li.querySelector("strong.structured-slide__step-number")?.textContent);
    expect(titles).toEqual([
      "الخطوة 1 — تُمثّل المسافة بالرمز L",
      "الخطوة 2 — تُمثّل الكتلة بالرمز M",
      "الخطوة 3 — يُمثّل الزمن بالرمز T",
      "الخطوة 4 — الكميات المشتقة تجمع بين الكميات الأساسية",
      "الخطوة 5 — تجمع السرعة بين المسافة والزمن",
    ]);
  });
});

describe("6. L, M, T, and L/T render correctly", () => {
  it("italicizes standalone L, M, T tokens (existing ch01-t01 whitelist already includes them)", () => {
    renderSlides(false, 2);
    expect(container.innerHTML).toContain("<em>L</em>");
    expect(container.innerHTML).toContain("<em>M</em>");
    expect(container.innerHTML).toContain("<em>T</em>");
  });

  it("L/T renders with both symbols italicized on either side of the slash", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <StructuredSlideContent blockId={slide2.recordId} text={slide2.text} italicTokens={PROSE_TOKENS} />
      </LanguageProvider>,
    );
    expect(markup).toContain("<em>L</em>/<em>T</em>");
  });
});

describe("7. The distinction between dimensions and units is present", () => {
  it("Step 4 and the Misconception both state L/M/T are dimensions, not units", () => {
    renderSlides(false, 2);
    const text = container.textContent ?? "";
    expect(text).toContain("L, M, and T represent dimensions, not individual units.");
    expect(text).toContain("Misconception: L, M, and T are units. Correction: they are symbols for physical dimensions.");
  });
});

describe("8. The speed example calculates 60 miles/h", () => {
  it("renders the exact worked equation in its own distinct equation block", () => {
    renderSlides(false, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const block = slide2Panel.querySelector(".structured-slide__equation-block");
    expect(block?.textContent).toBe("Speed = 120 miles / 2 h = 60 miles/h");
  });

  it("120 miles / 2 hours actually equals 60 miles/h (sanity-checks the authored numbers)", () => {
    expect(120 / 2).toBe(60);
  });
});

describe("9. Figure Explanation — intentionally omitted by explicit project-owner decision, not fabricated", () => {
  it("no Figure Explanation heading or image placeholder renders", () => {
    renderSlides(false, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    const headings = Array.from(slide2Panel.querySelectorAll(".structured-slide__heading")).map(
      (h) => h.textContent,
    );
    expect(headings).not.toContain("Figure Explanation");
    expect(slide2Panel.querySelector("img")).toBeNull();
  });

  it("the source record's blocking.blockingReason no longer includes missingVisual — the omission was an explicit decision, not an unresolved gap", () => {
    expect(slide2.blocking.blockingReason).not.toContain("missingVisual");
    // Other review-related blocking reasons and publication flags are retained.
    expect(slide2.blocking.blockingReason).toContain("translationPending");
    expect(slide2.blocking.blockingReason).toContain("scientificReviewPending");
    expect(slide2.blocking.blockingStatus).toBe("blocked");
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
  });
});

describe("10. Arabic RTL is correct", () => {
  it("Arabic Slide 2 paragraphs render dir=\"rtl\", including inside the equation block and callouts", () => {
    renderSlides(true, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    expect(slide2Panel.querySelectorAll('p[dir="rtl"]').length).toBeGreaterThan(0);
    expect(slide2Panel.querySelector(".structured-slide__equation-block")?.getAttribute("dir")).toBe("rtl");
    const steps = slide2Panel.querySelectorAll(".structured-slide__steps > li");
    expect(Array.from(steps).every((li) => li.getAttribute("dir") === "rtl")).toBe(true);
  });

  it("English Slide 2 paragraphs render dir=\"ltr\"", () => {
    renderSlides(false, 2);
    const slide2Panel = getSlidePanel(container, 2)!;
    expect(slide2Panel.querySelectorAll('p[dir="ltr"]').length).toBeGreaterThan(0);
    expect(slide2Panel.querySelectorAll('p[dir="rtl"]').length).toBe(0);
  });
});

describe("11. The scientific note limits the statement to mechanics", () => {
  it("English Scientific Note states the classification applies mainly to mechanics", () => {
    renderSlides(false, 2);
    const text = container.textContent ?? "";
    expect(text).toContain(
      "Scientific Note: This classification applies mainly to mechanics. Many mechanics quantities can be expressed using length, mass, and time, but the complete SI system contains seven base quantities.",
    );
  });

  it("Arabic Scientific Note states the same mechanics-only scope", () => {
    renderSlides(true, 2);
    const text = container.textContent ?? "";
    expect(text).toContain(
      "ملاحظة علمية: ينطبق هذا التصنيف بصورة أساسية على الميكانيكا. ويمكن التعبير عن كثير من كميات الميكانيكا باستخدام الطول والكتلة والزمن، بينما يحتوي نظام الوحدات الدولي الكامل على سبع كميات أساسية.",
    );
  });
});

describe("12. Governance and publication flags remain unchanged", () => {
  it("studentFacingAllowed / studentPublicationAuthorized stay false; blocking status is 'blocked' on the new record", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide2.blocking.studentFacingAllowed).toBe(false);
    expect(slide2.blocking.blockingStatus).toBe("blocked");
  });

  it("recordCount includes the new record, with no problem record for ch01-t01", () => {
    // 9 at the time this record was added, now 13 with Slides 3-6 also
    // present (see src/tests/slide3DistanceUnits.test.tsx,
    // slide4DifferentUnits.test.tsx, slide5AreaVolume.test.tsx, and
    // slide6AreaVolumeUnits.test.tsx) — no problem record exists for
    // ch01-t01, so this count is exactly the contentBlock +
    // instructorScript records.
    expect(topic.governance.recordCount).toBe(13);
  });
});

describe("Scientific correction — length is the dimension; distance is a quantity that has that dimension", () => {
  it("English Step 1 states the corrected length/distance distinction, without altering the original quoted 'Distance (L)'", () => {
    const en = slide2.text.en ?? "";
    expect(en).toContain("L represents the dimension of length. Distance is one physical quantity that has the dimension of length.");
    expect(en).not.toContain("L represents the dimension of length or distance.");
    // The original verbatim quote's "Distance (L)" line is untouched.
    expect(en).toContain("Distance (L)");
  });

  it("Arabic Step 1 states the corrected distinction with the project owner's exact wording", () => {
    const ar = slide2.text.ar ?? "";
    expect(ar).toContain("يمثّل الرمز L بُعد الطول، والمسافة إحدى الكميات الفيزيائية التي تمتلك بُعد الطول.");
    expect(ar).toContain("المسافة (L)");
  });

  it("Main Idea uses the three base dimensions of length/mass/time, not 'distance, mass, and time'", () => {
    const en = slide2.text.en ?? "";
    const ar = slide2.text.ar ?? "";
    expect(en).toContain(
      "Main Idea: Many quantities used in mechanics can be described using the three base dimensions of length, mass, and time.",
    );
    expect(en).not.toContain("combining three fundamental quantities: distance, mass, and time");
    expect(ar).toContain(
      "الفكرة الرئيسية: يمكن وصف كثير من الكميات المستخدمة في الميكانيكا باستخدام الأبعاد الأساسية الثلاثة: الطول والكتلة والزمن.",
    );
  });

  it("Key Concept's dimensional-foundation sentence uses length, not distance", () => {
    const en = slide2.text.en ?? "";
    const ar = slide2.text.ar ?? "";
    expect(en).toContain(
      "Key Concept: Length, mass, and time form the dimensional foundation of many quantities in mechanics",
    );
    expect(en).not.toContain("Distance, mass, and time form the dimensional foundation");
    expect(ar).toContain("المفهوم الأساسي: يشكّل الطول والكتلة والزمن الأساس البُعدي");
  });

  it("renders the corrected wording in the DOM, English and Arabic", () => {
    renderSlides(false, 2);
    expect(container.textContent).toContain(
      "L represents the dimension of length. Distance is one physical quantity that has the dimension of length.",
    );
    act(() => root.unmount());
    root = createRoot(container);
    renderSlides(true, 2);
    expect(container.textContent).toContain(
      "يمثّل الرمز L بُعد الطول، والمسافة إحدى الكميات الفيزيائية التي تمتلك بُعد الطول.",
    );
  });
});

describe("Scientific correction — Arabic unit definition", () => {
  it("Arabic Misconception uses the corrected 'وحدة القياس' definition", () => {
    const ar = slide2.text.ar ?? "";
    expect(ar).toContain("أما وحدة القياس فهي معيار محدد يُستخدم للتعبير عن مقدار الكمية، مثل المتر أو الكيلوجرام أو الثانية.");
    expect(ar).not.toContain("أما الوحدة فهي مقدار محدد مثل المتر أو الكيلوجرام أو الثانية.");
  });
});

describe("Reusability — generic Slide/StructuredSlideContent architecture over topic.slides[]", () => {
  it("both slides of the same topic use different marker configs keyed by blockId, not topicId, rendered via the same generic accordion map", () => {
    // Slide 1 uses its own equation phrase; Slide 2 uses a different one —
    // both rendered by the exact same StructuredSlideContent component,
    // driven purely by topic.slides.map inside SlidesSection, with no
    // per-slide-number conditional anywhere in the render path. Only one
    // slide's panel is open at a time, so each is checked in turn.
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 2);
    expect(
      getSlidePanel(container, 2)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("Speed = 120 miles / 2 h = 60 miles/h");
  });

  it("topic.slides is a plain array — adding a third slide would only require a new source record, not new NormalizedTopic fields or adapter wiring", () => {
    // Structural proof: NormalizedSlide carries everything rendering needs
    // (recordId, slideNumber, title, text, blocking) generically, with no
    // slide-specific field name anywhere on NormalizedTopic itself.
    expect(Array.isArray(topic.slides)).toBe(true);
    for (const slide of topic.slides) {
      expect(typeof slide.recordId).toBe("string");
      expect(typeof slide.slideNumber).toBe("number");
      expect(slide.title).toHaveProperty("en");
      expect(slide.title).toHaveProperty("ar");
    }
  });
});
