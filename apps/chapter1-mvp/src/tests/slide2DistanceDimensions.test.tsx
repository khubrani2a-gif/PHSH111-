// @vitest-environment jsdom
//
// Tests for Slide 2 ("How Are Physical Quantities Built from Distance,
// Mass, and Time?"), added as a sibling of Slide 1 under ch01-t01's
// existing Slides section (ch01-t01-block-opening-2, blockType
// "openingConceptSlide2"). Covers the 12 checks explicitly requested for
// this task. Uses the same jsdom + createRoot/act pattern as
// src/tests/ch01t01Interactions.test.tsx.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
import { SlidesSection, Slide } from "../features/topics/Slides";
import { StructuredSlideContent } from "../features/topics/StructuredSlideContent";

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
const PROSE_TOKENS = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"];

const SLIDE1_TITLE = { en: "Fundamental Physical Quantities", ar: "الكميات الفيزيائية الأساسية" };
const SLIDE2_TITLE = {
  en: "How Are Physical Quantities Built from Distance, Mass, and Time?",
  ar: "كيف تُبنى الكميات الفيزيائية من المسافة والكتلة والزمن؟",
};

function renderBothSlides(arabic: boolean) {
  if (arabic) window.localStorage.setItem("phsh111:language", "ar");
  act(() => {
    root.render(
      <LanguageProvider>
        <SlidesSection>
          <Slide number={1} title={SLIDE1_TITLE} id="topic-opening">
            <StructuredSlideContent
              blockId={topic.openingConcept!.recordId}
              text={topic.openingConcept!.text}
              italicTokens={PROSE_TOKENS}
            />
          </Slide>
          <Slide number={2} title={SLIDE2_TITLE}>
            <StructuredSlideContent
              blockId={topic.openingConceptSlide2!.recordId}
              text={topic.openingConceptSlide2!.text}
              italicTokens={PROSE_TOKENS}
            />
          </Slide>
        </SlidesSection>
      </LanguageProvider>,
    );
  });
}

describe("1. Slide 2 appears after Slide 1", () => {
  it("Slide 2's heading follows Slide 1's heading in DOM order, both under one Slides section", () => {
    renderBothSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide1Idx = order.indexOf("slide-1-heading");
    const slide2Idx = order.indexOf("slide-2-heading");
    expect(slide1Idx).toBeGreaterThanOrEqual(0);
    expect(slide2Idx).toBeGreaterThan(slide1Idx);
    expect(container.querySelectorAll(".slides-section .slide")).toHaveLength(2);
  });

  it("Slide 2's exact bilingual title renders", () => {
    renderBothSlides(false);
    expect(container.querySelector("#slide-2-heading")?.textContent).toBe(
      "Slide 2 — How Are Physical Quantities Built from Distance, Mass, and Time?",
    );
    act(() => root.unmount());
    root = createRoot(container);
    renderBothSlides(true);
    expect(container.querySelector("#slide-2-heading")?.textContent).toBe(
      "الشريحة 2 — كيف تُبنى الكميات الفيزيائية من المسافة والكتلة والزمن؟",
    );
  });
});

describe("2. Slide 1 remains byte-for-byte unchanged", () => {
  it("Slide 1's English and Arabic openingConcept text are unchanged from before this addition", () => {
    const en = topic.openingConcept?.text.en ?? "";
    const ar = topic.openingConcept?.text.ar ?? "";
    expect(en).toContain("In physics, there are three basic aspects of the material universe");
    expect(en).toContain("v = d / t = 100 m / 5 s = 20 m/s");
    expect(en).toContain(
      "Scientific Note: This slide follows the textbook's introductory framework for the quantities discussed in this chapter. The complete modern SI system contains seven base quantities.",
    );
    expect(en).not.toContain("Q = I t");
    expect(ar).toContain("في الفيزياء، توجد ثلاثة جوانب أساسية للكون المادي");
  });

  it("Slide 1 renders identically (same headings/steps/equation) alongside Slide 2", () => {
    renderBothSlides(false);
    const slide1 = document.getElementById("topic-opening")!;
    const headings = Array.from(slide1.querySelectorAll(".structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toEqual([
      "Original English",
      "Main Idea",
      "Step-by-Step Explanation",
      "Simple Example",
      "Common Misconception",
      "Scientific Note",
      "Connection to the Next Slide",
    ]);
    expect(slide1.querySelector(".structured-slide__equation-block")?.textContent).toBe(
      "v = d / t = 100 m / 5 s = 20 m/s",
    );
  });
});

describe("3. The original English text appears exactly", () => {
  it("verbatim quotation from the uploaded slide renders unchanged", () => {
    renderBothSlides(false);
    const text = container.textContent ?? "";
    expect(text).toContain("1.1 Fundamental Physical Quantities: Distance");
    expect(text).toContain("Mostly all quantities can be classified in terms of the fundamental physical quantities:");
    expect(text).toContain("Distance (L)");
    expect(text).toContain("Mass (M)");
    expect(text).toContain("Time (T)");
    expect(text).toContain("For example, speed has the unit of miles per hour (L/T).");
  });

  it("was not silently corrected — 'Mostly all quantities' (unusual but as-supplied) is preserved verbatim", () => {
    const en = topic.openingConceptSlide2?.text.en ?? "";
    expect(en).toContain("Mostly all quantities can be classified");
    expect(en).not.toContain("Most quantities can be classified");
  });

  it("Arabic translation of the original quote renders exactly as supplied", () => {
    renderBothSlides(true);
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
    renderBothSlides(false);
    const slide2 = document.querySelectorAll(".slide")[1];
    const headings = Array.from(slide2.querySelectorAll(".structured-slide__heading")).map((h) => h.textContent);
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
    renderBothSlides(true);
    const slide2 = document.querySelectorAll(".slide")[1];
    const headings = Array.from(slide2.querySelectorAll(".structured-slide__heading")).map((h) => h.textContent);
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
    renderBothSlides(false);
    const slide2 = document.querySelectorAll(".slide")[1];
    const headingTags = Array.from(slide2.querySelectorAll(".structured-slide__heading")).map((h) => h.tagName);
    expect(headingTags.every((t) => t === "H4")).toBe(true);
  });
});

describe("5. The five numbered steps are in order", () => {
  it("English steps render with real bolded titles, in order 1-5", () => {
    renderBothSlides(false);
    const slide2 = document.querySelectorAll(".slide")[1];
    const steps = Array.from(slide2.querySelectorAll(".structured-slide__steps > li"));
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
    renderBothSlides(true);
    const slide2 = document.querySelectorAll(".slide")[1];
    const steps = Array.from(slide2.querySelectorAll(".structured-slide__steps > li"));
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
    renderBothSlides(false);
    expect(container.innerHTML).toContain("<em>L</em>");
    expect(container.innerHTML).toContain("<em>M</em>");
    expect(container.innerHTML).toContain("<em>T</em>");
  });

  it("L/T renders with both symbols italicized on either side of the slash", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <StructuredSlideContent
          blockId={topic.openingConceptSlide2!.recordId}
          text={topic.openingConceptSlide2!.text}
          italicTokens={PROSE_TOKENS}
        />
      </LanguageProvider>,
    );
    expect(markup).toContain("<em>L</em>/<em>T</em>");
  });
});

describe("7. The distinction between dimensions and units is present", () => {
  it("Step 4 and the Misconception both state L/M/T are dimensions, not units", () => {
    renderBothSlides(false);
    const text = container.textContent ?? "";
    expect(text).toContain("L, M, and T represent dimensions, not individual units.");
    expect(text).toContain("Misconception: L, M, and T are units. Correction: they are symbols for physical dimensions.");
  });
});

describe("8. The speed example calculates 60 miles/h", () => {
  it("renders the exact worked equation in its own distinct equation block", () => {
    renderBothSlides(false);
    const slide2 = document.querySelectorAll(".slide")[1];
    const block = slide2.querySelector(".structured-slide__equation-block");
    expect(block?.textContent).toBe("Speed = 120 miles / 2 h = 60 miles/h");
  });

  it("120 miles / 2 hours actually equals 60 miles/h (sanity-checks the authored numbers)", () => {
    expect(120 / 2).toBe(60);
  });
});

describe("9. Figure Explanation — intentionally omitted, not fabricated", () => {
  it("no Figure Explanation heading or image placeholder renders (image could not be located/extracted this session)", () => {
    renderBothSlides(false);
    const slide2 = document.querySelectorAll(".slide")[1];
    const headings = Array.from(slide2.querySelectorAll(".structured-slide__heading")).map((h) => h.textContent);
    expect(headings).not.toContain("Figure Explanation");
    expect(slide2.querySelector("img")).toBeNull();
  });

  it("the source record's blocking.blockingReason records the missing visual instead of inventing one", () => {
    expect(topic.openingConceptSlide2?.blocking.blockingReason).toContain("missingVisual");
  });
});

describe("10. Arabic RTL is correct", () => {
  it("Arabic Slide 2 paragraphs render dir=\"rtl\", including inside the equation block and callouts", () => {
    renderBothSlides(true);
    const slide2 = document.querySelectorAll(".slide")[1];
    expect(slide2.querySelectorAll('p[dir="rtl"]').length).toBeGreaterThan(0);
    expect(slide2.querySelector(".structured-slide__equation-block")?.getAttribute("dir")).toBe("rtl");
    const steps = slide2.querySelectorAll(".structured-slide__steps > li");
    expect(Array.from(steps).every((li) => li.getAttribute("dir") === "rtl")).toBe(true);
  });

  it("English Slide 2 paragraphs render dir=\"ltr\"", () => {
    renderBothSlides(false);
    const slide2 = document.querySelectorAll(".slide")[1];
    expect(slide2.querySelectorAll('p[dir="ltr"]').length).toBeGreaterThan(0);
    expect(slide2.querySelectorAll('p[dir="rtl"]').length).toBe(0);
  });
});

describe("11. The scientific note limits the statement to mechanics", () => {
  it("English Scientific Note states the classification applies mainly to mechanics", () => {
    renderBothSlides(false);
    const text = container.textContent ?? "";
    expect(text).toContain(
      "Scientific Note: This classification applies mainly to mechanics. Many mechanics quantities can be expressed using length, mass, and time, but the complete SI system contains seven base quantities.",
    );
  });

  it("Arabic Scientific Note states the same mechanics-only scope", () => {
    renderBothSlides(true);
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
    expect(topic.openingConceptSlide2?.blocking.studentFacingAllowed).toBe(false);
    expect(topic.openingConceptSlide2?.blocking.blockingStatus).toBe("blocked");
  });

  it("recordCount reflects the new record (9), with no problem record for ch01-t01", () => {
    expect(topic.governance.recordCount).toBe(9);
  });
});

describe("Reusability — generic Slide/StructuredSlideContent architecture, no Slide-2-only component", () => {
  it("both slides of the same topic use different marker configs keyed by blockId, not topicId", () => {
    renderBothSlides(false);
    // Slide 1 uses its own equation phrase; Slide 2 uses a different one —
    // both rendered by the exact same StructuredSlideContent component.
    const blocks = Array.from(container.querySelectorAll(".structured-slide__equation-block")).map(
      (el) => el.textContent,
    );
    expect(blocks).toEqual(["v = d / t = 100 m / 5 s = 20 m/s", "Speed = 120 miles / 2 h = 60 miles/h"]);
  });
});
