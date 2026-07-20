// @vitest-environment jsdom
//
// Tests for StructuredSlideContent — the presentation-only reformatting of
// ch01-t01's openingConcept block (Slide 1) into labeled subsections
// (Original English, Main Idea, Step-by-Step Explanation, Simple Example,
// Common Misconception, Scientific Note, Connection to the Next Slide).
// Uses the same jsdom + createRoot/act pattern as
// src/tests/ch01t01Interactions.test.tsx so language toggling (via the
// real persisted-language mechanism) and dir="rtl" can be asserted on an
// actual DOM tree.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
import { StructuredSlideContent } from "../features/topics/StructuredSlideContent";
import type { NormalizedText } from "../types/normalized";

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
const PROSE_TOKENS = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"];

function renderStructured(text: NormalizedText = slide1.text) {
  act(() => {
    root.render(
      <LanguageProvider>
        <StructuredSlideContent blockId={slide1.recordId} text={text} italicTokens={PROSE_TOKENS} />
      </LanguageProvider>,
    );
  });
}

describe("StructuredSlideContent — English", () => {
  it("1. renders all seven visible section headings", () => {
    renderStructured();
    const text = container.textContent ?? "";
    expect(text).toContain("Original English");
    expect(text).toContain("Main Idea");
    expect(text).toContain("Step-by-Step Explanation");
    expect(text).toContain("Simple Example");
    expect(text).toContain("Common Misconception");
    expect(text).toContain("Scientific Note");
    expect(text).toContain("Connection to the Next Slide");
  });

  it("2. uses real semantic heading elements (h4) for every section label, not styled divs/spans", () => {
    renderStructured();
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map(
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
  });

  it("3. renders the five numbered steps as list items, in the correct 1-5 order, each with a bold numeral", () => {
    renderStructured();
    const steps = Array.from(container.querySelectorAll(".structured-slide__steps > li"));
    expect(steps).toHaveLength(5);
    const numerals = steps.map((li) => li.querySelector("strong.structured-slide__step-number")?.textContent);
    expect(numerals).toEqual(["1.", "2.", "3.", "4.", "5."]);
    // Steps 1 and 5 have pre-existing "; " clauses in the approved text —
    // these render as sub-bullets; steps 2-4 have none.
    expect(steps[0].querySelectorAll(".structured-slide__step-clauses li")).toHaveLength(3);
    expect(steps[4].querySelectorAll(".structured-slide__step-clauses li")).toHaveLength(2);
    expect(steps[1].querySelector(".structured-slide__step-clauses")).toBeNull();
  });

  it("4. renders the worked equation in a distinct equation-block element, with italicized v/d/t", () => {
    renderStructured();
    const block = container.querySelector(".structured-slide__equation-block");
    expect(block).toBeTruthy();
    expect(block?.textContent).toBe("v = d / t = 100 m / 5 s = 20 m/s");
    expect(block?.innerHTML).toContain("<em>v</em>");
    expect(block?.innerHTML).toContain("<em>d</em>");
    expect(block?.innerHTML).toContain("<em>t</em>");
  });

  it("5. visually distinguishes Common Misconception and Scientific Note with distinct callout classes", () => {
    renderStructured();
    const misconception = container.querySelector(".structured-slide__callout--misconception");
    const scientificNote = container.querySelector(".structured-slide__callout--scientific-note");
    expect(misconception).toBeTruthy();
    expect(scientificNote).toBeTruthy();
    expect(misconception?.className).not.toBe(scientificNote?.className);
    // Q = I t was removed from the approved content (outside this
    // introductory slide's instructional scope) — no inline equation chip
    // should render inside the Scientific Note callout.
    expect(scientificNote?.querySelector("mark.equation-inline")).toBeNull();
    expect(scientificNote?.querySelector("mark")).toBeNull();
  });

  it("6. preserves every approved English sentence verbatim (no rewritten, shortened, or expanded wording), and confirms Q = I t was deliberately removed", () => {
    renderStructured();
    const text = container.textContent ?? "";
    expect(text).toContain(
      "In physics, there are three basic aspects of the material universe that we must describe and quantify in various ways:",
    );
    expect(text).toContain("Main idea: physics describes the physical universe through measurements");
    expect(text).toContain("v = d / t = 100 m / 5 s = 20 m/s");
    expect(text).toContain("Common misconception: space and distance are exactly the same thing.");
    expect(text).toContain(
      "Scientific Note: This slide follows the textbook's introductory framework for the quantities discussed in this chapter. The complete modern SI system contains seven base quantities.",
    );
    expect(text).toContain(
      "Connection to the next part: after identifying these physical quantities",
    );
    expect(text).not.toContain("Q = I t");
    expect(text).not.toContain("Electric charge is a derived quantity");
  });
});

describe("StructuredSlideContent — Arabic / RTL", () => {
  it("6b. preserves every approved Arabic sentence verbatim and shows the Arabic section headings", () => {
    window.localStorage.setItem("phsh111:language", "ar");
    renderStructured();
    const text = container.textContent ?? "";
    expect(text).toContain("النص الإنجليزي الأصلي");
    expect(text).toContain("الفكرة الرئيسية");
    expect(text).toContain("الشرح خطوة بخطوة");
    expect(text).toContain("مثال بسيط");
    expect(text).toContain("مفهوم خاطئ شائع");
    expect(text).toContain("ملاحظة علمية");
    expect(text).toContain("الصلة بالشريحة التالية");
    expect(text).toContain("الفكرة الأساسية: تصف الفيزياء الكون المادي");
    expect(text).toContain("v = d / t = 100 m / 5 s = 20 m/s");
    expect(text).toContain(
      "ملاحظة علمية: يتبع هذا السلايد الإطار التمهيدي الذي يعتمده الكتاب للكميات المطروحة في هذا الفصل. ويحتوي نظام الوحدات الدولي الحديث على سبع كميات أساسية.",
    );
    expect(text).not.toContain("Q = I t");
  });

  it("7. renders Arabic paragraphs with dir=\"rtl\", numbering and Latin notation intact", () => {
    window.localStorage.setItem("phsh111:language", "ar");
    renderStructured();
    const rtlParagraphs = container.querySelectorAll('p[dir="rtl"]');
    expect(rtlParagraphs.length).toBeGreaterThan(0);
    const steps = Array.from(container.querySelectorAll(".structured-slide__steps > li"));
    expect(steps.every((li) => li.getAttribute("dir") === "rtl")).toBe(true);
    const numerals = steps.map((li) => li.querySelector("strong.structured-slide__step-number")?.textContent);
    expect(numerals).toEqual(["1.", "2.", "3.", "4.", "5."]);
    const equationBlock = container.querySelector(".structured-slide__equation-block");
    expect(equationBlock?.textContent).toBe("v = d / t = 100 m / 5 s = 20 m/s");
  });
});

describe("StructuredSlideContent — responsive class hooks (viewport-agnostic; CSS media queries key off these)", () => {
  it("8. renders the same structural classes regardless of viewport — no JS-based branching on window size", () => {
    renderStructured();
    const before = container.innerHTML;
    // No resize-driven re-render exists in this component; simulate a
    // narrow-viewport remount and confirm identical structure/classes.
    act(() => root.unmount());
    root = createRoot(container);
    renderStructured();
    expect(container.innerHTML).toBe(before);
    expect(container.querySelector(".structured-slide")).toBeTruthy();
    expect(container.querySelector(".structured-slide__equation-block")).toBeTruthy();
  });
});

describe("StructuredSlideContent — reusability for future slides", () => {
  it("9a. falls back to plain paragraph rendering (unchanged behavior) for a topic with no structured-slide config", () => {
    const otherTopic = getTopic("ch01-t04")!;
    act(() => {
      root.render(
        <LanguageProvider>
          <StructuredSlideContent
            blockId={otherTopic.mainIdea!.recordId}
            text={{ en: "First paragraph.\n\nSecond paragraph.", ar: "الفقرة الأولى.\n\nالفقرة الثانية." }}
          />
        </LanguageProvider>,
      );
    });
    expect(container.querySelector(".structured-slide")).toBeNull();
    const paragraphs = container.querySelectorAll("p.content-section__text");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("First paragraph.");
    expect(paragraphs[1].textContent).toBe("Second paragraph.");
    // otherTopic is only referenced to document that a real six-topic ID was used, not a fabricated one.
    expect(otherTopic.topicId).toBe("ch01-t04");
  });

  it("9b. structures arbitrary text sharing ch01-t01's marker convention, proving the parser is marker-driven, not hardcoded to Slide 1's specific wording", () => {
    const fabricated: NormalizedText = {
      en:
        "Some unrelated introductory quote about a different concept entirely.\n\n" +
        "Main idea: this is a completely different idea from Slide 1's.\n\n" +
        "1. First fabricated step.\n\n" +
        "2. Second fabricated step.\n\n" +
        "Simple example: a fabricated example with no numbers at all.\n\n" +
        "Common misconception: a fabricated misconception.\n\n" +
        "Scientific Note: a fabricated scientific note.\n\n" +
        "Connection to the next part: a fabricated connection sentence.",
      ar: null,
    };
    renderStructured(fabricated);
    const text = container.textContent ?? "";
    expect(text).toContain("Some unrelated introductory quote about a different concept entirely.");
    expect(text).toContain("this is a completely different idea from Slide 1's.");
    expect(text).toContain("First fabricated step.");
    expect(text).toContain("Second fabricated step.");
    expect(text).toContain("a fabricated example with no numbers at all.");
    expect(text).toContain("a fabricated misconception.");
    expect(text).toContain("a fabricated scientific note.");
    expect(text).toContain("a fabricated connection sentence.");
    expect(container.querySelector(".structured-slide")).toBeTruthy();
    const steps = container.querySelectorAll(".structured-slide__steps > li");
    expect(steps).toHaveLength(2);
  });
});

describe("StructuredSlideContent — governance untouched", () => {
  it("10. rendering does not mutate the topic's governance flags (studentFacingAllowed / studentPublicationAuthorized stay false)", () => {
    renderStructured();
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
  });
});
