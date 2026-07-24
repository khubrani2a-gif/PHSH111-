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
import {
  selectEssentialSimpleExampleParagraphs,
  selectReviewSections,
  StructuredSlideContent,
  type ReviewSectionKey,
} from "../features/topics/StructuredSlideContent";
import type { NormalizedSlide, NormalizedText } from "../types/normalized";

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

/** Every one of ch01-t01's current 13 slides, in slideNumber order — used by the Review Mode current-content regression suite below (PR B). */
const ALL_SLIDES: NormalizedSlide[] = topic.slides.slice().sort((a, b) => a.slideNumber - b.slideNumber);
function slideByNumber(n: number): NormalizedSlide {
  const slide = ALL_SLIDES.find((s) => s.slideNumber === n);
  if (!slide) throw new Error(`no slide with slideNumber ${n}`);
  return slide;
}

/** Renders one real slide's StructuredSlideContent in Review Mode (compact=true), reusing its actual table/figure/definitions/text props unchanged. */
function renderReview(slide: NormalizedSlide, arabic = false) {
  if (arabic) window.localStorage.setItem("phsh111:language", "ar");
  act(() => {
    root.render(
      <LanguageProvider>
        <StructuredSlideContent
          blockId={slide.recordId}
          text={slide.text}
          table={slide.table}
          figure={slide.figure}
          definitions={slide.definitions}
          italicTokens={PROSE_TOKENS}
          compact
        />
      </LanguageProvider>,
    );
  });
}

/** Same as renderReview but Study Mode (compact=false/default) — used by the Study Mode regression suite below. */
function renderStudy(slide: NormalizedSlide, arabic = false) {
  if (arabic) window.localStorage.setItem("phsh111:language", "ar");
  act(() => {
    root.render(
      <LanguageProvider>
        <StructuredSlideContent
          blockId={slide.recordId}
          text={slide.text}
          table={slide.table}
          figure={slide.figure}
          definitions={slide.definitions}
          italicTokens={PROSE_TOKENS}
        />
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

// ===========================================================================
// PR B — Review Mode Completeness (generic, schema-driven, bilingual,
// reusable across all current and future topics; no per-slide exceptions).
// ===========================================================================

// Every flag explicitly false — the "nothing eligible" baseline synthetic
// input reused by several tests below via spreading, so each test only
// needs to override the one or two flags it's actually exercising.
const NO_REVIEW_CONTENT = {
  hasMainIdea: false,
  hasDefinitions: false,
  hasKeyConcept: false,
  hasEssentialSimpleExample: false,
  hasTable: false,
  hasTableExplanation: false,
  hasFigure: false,
  hasFigureExplanation: false,
  hasConversionFactorExplanation: false,
  hasDefinitionExplanation: false,
  hasRelationshipExplanation: false,
} as const;

describe("StructuredSlideContent — Review Mode selection logic (pure, generic, cross-topic)", () => {
  it("11a. hasMainIdea: true includes mainIdea", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasMainIdea: true });
    expect(keys).toEqual(["mainIdea"]);
  });

  it("11b. hasMainIdea: false omits mainIdea, and every flag false returns no sections at all — Main Idea is not exempt from the presence-driven policy", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT });
    expect(keys).toEqual([]);
  });

  it("12. selectReviewSections returns every populated key in the documented pedagogical order when all flags are true — synthetic input, no topic ID/slide number/block ID involved", () => {
    const keys: ReviewSectionKey[] = selectReviewSections({
      hasMainIdea: true,
      hasDefinitions: true,
      hasKeyConcept: true,
      hasEssentialSimpleExample: true,
      hasTable: true,
      hasTableExplanation: true,
      hasFigure: true,
      hasFigureExplanation: true,
      hasConversionFactorExplanation: true,
      hasDefinitionExplanation: true,
      hasRelationshipExplanation: true,
    });
    expect(keys).toEqual([
      "mainIdea",
      "definitions",
      "keyConcept",
      "simpleExample",
      "table",
      "tableExplanation",
      "figure",
      "figureExplanation",
      "conversionFactorExplanation",
      "definitionExplanation",
      "relationshipExplanation",
    ]);
  });

  it("13. multiple populated specialized-explanation slots are all returned together, none dropped for a 'pick one' shortcut — synthetic input, no known block ID", () => {
    const keys = selectReviewSections({
      ...NO_REVIEW_CONTENT,
      hasMainIdea: true,
      hasTableExplanation: true,
      hasFigureExplanation: true,
      hasConversionFactorExplanation: true,
      hasDefinitionExplanation: true,
      hasRelationshipExplanation: true,
    });
    expect(keys).toEqual([
      "mainIdea",
      "tableExplanation",
      "figureExplanation",
      "conversionFactorExplanation",
      "definitionExplanation",
      "relationshipExplanation",
    ]);
  });

  it("13b. a synthetic slide with no Main Idea but with definitions selects Definitions without Main Idea — no topic/slide/block ID involved", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasDefinitions: true });
    expect(keys).toEqual(["definitions"]);
  });

  it("13c. a synthetic slide with no Main Idea but with a table selects the Table without a Main Idea wrapper", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasTable: true });
    expect(keys).toEqual(["table"]);
  });

  it("13d. a synthetic slide with no Main Idea but with a figure selects the Figure without a Main Idea wrapper", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasFigure: true });
    expect(keys).toEqual(["figure"]);
  });

  it("13e. a synthetic slide with no Main Idea but with a Key Concept selects Key Concept alone", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasKeyConcept: true });
    expect(keys).toEqual(["keyConcept"]);
  });

  it("13f. a synthetic slide with no Main Idea but with a specialized explanation selects that explanation alone", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasRelationshipExplanation: true });
    expect(keys).toEqual(["relationshipExplanation"]);
  });

  it("13g. a synthetic slide with no eligible content at all selects nothing — the compact root would render zero .structured-slide__section elements", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT });
    expect(keys).toEqual([]);
  });

  it("14. selectEssentialSimpleExampleParagraphs retains an equation-bearing paragraph and drops a purely narrative one — synthetic paragraphs, no topic ID", () => {
    const paragraphs = [
      "Simple example: consider a fabricated scenario with no numbers.",
      "v = d / t = 100 m / 5 s = 20 m/s",
    ];
    const essential = selectEssentialSimpleExampleParagraphs(paragraphs, "v = d / t = 100 m / 5 s = 20 m/s");
    expect(essential).toEqual(["v = d / t = 100 m / 5 s = 20 m/s"]);
  });

  it("15. selectEssentialSimpleExampleParagraphs matches any entry of an array of formula/conversion phrases (multi-expression slides)", () => {
    const paragraphs = ["A = (5 m)(4 m) = 20 m²", "V = (2 m)(1 m)(0.5 m) = 1 m³", "unrelated narrative sentence"];
    const essential = selectEssentialSimpleExampleParagraphs(paragraphs, [
      "A = (5 m)(4 m) = 20 m²",
      "V = (2 m)(1 m)(0.5 m) = 1 m³",
    ]);
    expect(essential).toEqual(["A = (5 m)(4 m) = 20 m²", "V = (2 m)(1 m)(0.5 m) = 1 m³"]);
  });

  it("16. a purely narrative Simple Example (no equationBlockPhrase configured) returns empty — Review Mode omits that subsection entirely", () => {
    const paragraphs = ["Simple example: a fabricated example with no numbers at all."];
    expect(selectEssentialSimpleExampleParagraphs(paragraphs, undefined)).toEqual([]);
  });

  it("17. neither selection function's own implementation hardcodes a topic ID, block ID, or slide-number literal", () => {
    const forbidden = ["ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04", "ch01-t08", "ch01-t10", "block-opening", "slideNumber"];
    const sourceA = selectReviewSections.toString();
    const sourceB = selectEssentialSimpleExampleParagraphs.toString();
    for (const token of forbidden) {
      expect(sourceA).not.toContain(token);
      expect(sourceB).not.toContain(token);
    }
  });
});

describe("StructuredSlideContent — Review Mode definitions", () => {
  it("18. Review Mode renders Slide 9's structured Period/Frequency definitions", () => {
    renderReview(slideByNumber(9));
    expect(container.querySelectorAll(".structured-slide__definition-card")).toHaveLength(2);
  });

  it("19. English term/definition pairs render correctly", () => {
    renderReview(slideByNumber(9));
    const terms = Array.from(container.querySelectorAll(".structured-slide__definition-term")).map((el) => el.textContent);
    const bodies = Array.from(container.querySelectorAll(".structured-slide__definition-body")).map((el) => el.textContent);
    expect(terms).toEqual(["Period", "Frequency"]);
    expect(bodies[0]).toContain("The time for one complete cycle");
    expect(bodies[1]).toContain("The number of cycles of a periodic process");
  });

  it("20. Arabic term/definition pairs render correctly, in an RTL wrapper", () => {
    renderReview(slideByNumber(9), true);
    const terms = Array.from(container.querySelectorAll(".structured-slide__definition-term")).map((el) => el.textContent);
    expect(terms).toHaveLength(2);
    expect(terms.every((t) => !!t && t.trim().length > 0)).toBe(true);
    expect(container.querySelector(".structured-slide__definition-cards")?.getAttribute("dir")).toBe("rtl");
  });

  it("21. a slide with no definitions renders no definition-cards wrapper (and no --definitions section) in Review Mode", () => {
    const slide1Real = slideByNumber(1);
    renderReview(slide1Real);
    expect(container.querySelector(".structured-slide__definition-cards")).toBeNull();
    expect(container.querySelector(`#${slide1Real.recordId}--definitions`)).toBeNull();
  });

  it("22. definitions containing equation-safe symbols still use the shared equation renderer (italicized T/f, not a second parser)", () => {
    renderReview(slideByNumber(9));
    const bodies = Array.from(container.querySelectorAll(".structured-slide__definition-body"));
    expect(bodies[0].innerHTML).toContain("<em>T</em>");
    expect(bodies[1].innerHTML).toContain("<em>f</em>");
  });

  it("23. structured definitions render exactly once (no accidental duplicate rendering) alongside a separately-rendered Definition Explanation", () => {
    renderReview(slideByNumber(9));
    expect(container.querySelectorAll(".structured-slide__definition-cards")).toHaveLength(1);
    expect(container.querySelectorAll(".structured-slide__definition-card")).toHaveLength(2);
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings.filter((h) => h === "Definition Explanation")).toHaveLength(1);
  });
});

describe("StructuredSlideContent — Review Mode specialized explanation slots", () => {
  it("24. Table Explanation renders when populated (Slide 3)", () => {
    renderReview(slideByNumber(3));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Table Explanation");
    expect(container.querySelector("#ch01-t01-block-opening-3--table-explanation")).toBeTruthy();
  });

  it("25. Figure Explanation renders when populated (Slide 4)", () => {
    renderReview(slideByNumber(4));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Figure Explanation");
    expect(container.querySelector("#ch01-t01-block-opening-4--figure-explanation")).toBeTruthy();
  });

  it("26. Conversion-Factor Explanation renders when populated (Slide 7)", () => {
    renderReview(slideByNumber(7));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Conversion-Factor Explanation");
  });

  it("27. Definition Explanation renders when populated (Slide 9)", () => {
    renderReview(slideByNumber(9));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Definition Explanation");
  });

  it("28. Relationship Explanation renders when populated (Slide 10)", () => {
    renderReview(slideByNumber(10));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Relationship Explanation");
  });

  it("29. multiple populated explanation slots at once render every one of them without losing any (selectReviewSections is exercised directly since no current slide's own config populates more than one slot at a time)", () => {
    const keys = selectReviewSections({
      ...NO_REVIEW_CONTENT,
      hasMainIdea: true,
      hasTableExplanation: true,
      hasConversionFactorExplanation: true,
      hasRelationshipExplanation: true,
    });
    expect(keys).toEqual(["mainIdea", "tableExplanation", "conversionFactorExplanation", "relationshipExplanation"]);
  });

  it("30. a slide with none of the five specialized explanation markers renders none of their headings, and no empty section/heading (Slide 1)", () => {
    renderReview(slideByNumber(1));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).not.toContain("Table Explanation");
    expect(headings).not.toContain("Figure Explanation");
    expect(headings).not.toContain("Conversion-Factor Explanation");
    expect(headings).not.toContain("Definition Explanation");
    expect(headings).not.toContain("Relationship Explanation");
    expect(container.querySelector("[id$='--table-explanation']")).toBeNull();
    expect(container.querySelector("[id$='--figure-explanation']")).toBeNull();
    expect(container.querySelector("[id$='--conversion-factor-explanation']")).toBeNull();
    expect(container.querySelector("[id$='--definition-explanation']")).toBeNull();
    expect(container.querySelector("[id$='--relationship-explanation']")).toBeNull();
  });
});

describe("StructuredSlideContent — Review Mode tables and figures", () => {
  it("31. Review Mode retains the table for every table-bearing slide (3, 6, 8, 12)", () => {
    for (const n of [3, 6, 8, 12]) {
      renderReview(slideByNumber(n));
      expect(container.querySelector(".structured-slide__table"), `slide ${n}`).toBeTruthy();
    }
  });

  it("32. Table Explanation appears after the table in document order", () => {
    renderReview(slideByNumber(3));
    const ids = Array.from(container.querySelectorAll(".structured-slide__section[id]")).map((el) => el.id);
    const tableIdx = ids.indexOf("ch01-t01-block-opening-3--table");
    const explIdx = ids.indexOf("ch01-t01-block-opening-3--table-explanation");
    expect(tableIdx).toBeGreaterThanOrEqual(0);
    expect(explIdx).toBeGreaterThan(tableIdx);
  });

  it("33. Review Mode retains the figure (with its alt text) for every figure-bearing slide (4, 5, 13)", () => {
    for (const n of [4, 5, 13]) {
      renderReview(slideByNumber(n));
      const img = container.querySelector<HTMLImageElement>(".slide-figure__img");
      expect(img, `slide ${n}`).toBeTruthy();
      expect(img?.alt.length ?? 0, `slide ${n}`).toBeGreaterThan(0);
    }
  });

  it("34. Figure Explanation appears after the figure in document order", () => {
    renderReview(slideByNumber(4));
    const ids = Array.from(container.querySelectorAll(".structured-slide__section[id]")).map((el) => el.id);
    const figIdx = ids.indexOf("ch01-t01-block-opening-4--figure");
    const explIdx = ids.indexOf("ch01-t01-block-opening-4--figure-explanation");
    expect(figIdx).toBeGreaterThanOrEqual(0);
    expect(explIdx).toBeGreaterThan(figIdx);
  });

  it("35. Arabic/RTL tables remain correct in Review Mode", () => {
    renderReview(slideByNumber(3), true);
    expect(container.querySelector(".structured-slide__table-wrapper")?.getAttribute("dir")).toBe("rtl");
  });

  it("36. Arabic/RTL figures remain correct and responsive in Review Mode", () => {
    renderReview(slideByNumber(4), true);
    const img = container.querySelector<HTMLImageElement>(".slide-figure__img");
    expect(img).toBeTruthy();
    expect(img?.alt.length ?? 0).toBeGreaterThan(0);
  });
});

describe("StructuredSlideContent — Review Mode essential Simple Example", () => {
  it("37. an equation-bearing Simple Example is retained in Review Mode (Slide 1)", () => {
    renderReview(slideByNumber(1));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Simple Example");
    expect(container.querySelector(".structured-slide__equation-block")?.textContent).toBe(
      "v = d / t = 100 m / 5 s = 20 m/s",
    );
  });

  it("38. a formula-bearing Simple Example with several worked expressions is retained (Slide 9)", () => {
    renderReview(slideByNumber(9));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Simple Example");
    expect(container.querySelectorAll(".structured-slide__equation-block").length).toBeGreaterThan(0);
  });

  it("39. a purely narrative Simple Example (Slide 4, no configured equationBlockPhrase) is omitted from Review Mode", () => {
    renderReview(slideByNumber(4));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).not.toContain("Simple Example");
  });
});

describe("StructuredSlideContent — Review Mode current-content regression (all 13 slides)", () => {
  it("40. Slide 9 Review Mode renders both structured definitions", () => {
    renderReview(slideByNumber(9));
    expect(container.querySelectorAll(".structured-slide__definition-card")).toHaveLength(2);
  });

  it("41. Slide 9 renders Definition Explanation", () => {
    renderReview(slideByNumber(9));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Definition Explanation");
  });

  it("42. Slide 9 retains its Key Concept", () => {
    renderReview(slideByNumber(9));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toContain("Key Concept");
  });

  it("43. all figure-bearing current slides retain their figure in Review Mode", () => {
    for (const n of [4, 5, 13]) {
      renderReview(slideByNumber(n));
      expect(container.querySelector(".slide-figure__img"), `slide ${n}`).toBeTruthy();
    }
  });

  it("44. all table-bearing current slides retain their table in Review Mode", () => {
    for (const n of [3, 6, 8, 12]) {
      renderReview(slideByNumber(n));
      expect(container.querySelector(".structured-slide__table thead"), `slide ${n}`).toBeTruthy();
      expect(container.querySelectorAll(".structured-slide__table tbody tr").length, `slide ${n}`).toBeGreaterThan(0);
    }
  });

  it("45. all populated specialized explanation slots across Slides 1-13 render", () => {
    const expectedHeadingBySlideNumber: Record<number, string> = {
      3: "Table Explanation",
      4: "Figure Explanation",
      5: "Figure Explanation",
      6: "Table Explanation",
      7: "Conversion-Factor Explanation",
      8: "Table Explanation",
      9: "Definition Explanation",
      10: "Relationship Explanation",
      11: "Relationship Explanation",
      12: "Table Explanation",
      13: "Figure Explanation",
    };
    for (const [slideNumber, expectedHeading] of Object.entries(expectedHeadingBySlideNumber)) {
      renderReview(slideByNumber(Number(slideNumber)));
      const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
      expect(headings, `slide ${slideNumber}`).toContain(expectedHeading);
    }
  });

  it("46. no current Review Mode slide (1-13) is effectively empty — every slide renders Main Idea content beyond its own heading", () => {
    for (const slide of ALL_SLIDES) {
      renderReview(slide);
      const mainIdeaSection = container.querySelector(`#${slide.recordId}--main-idea`);
      expect(mainIdeaSection, `slide ${slide.slideNumber}`).toBeTruthy();
      expect(mainIdeaSection!.children.length, `slide ${slide.slideNumber}`).toBeGreaterThan(1);
    }
  });
});

describe("StructuredSlideContent — Main Idea presence-driven policy (correction: Main Idea is no longer unconditional)", () => {
  // Under the current parser (parseSections), a slide only produces a
  // non-null `sections` object once its own mainIdeaMarker has actually
  // been found in the text — and when that happens, sections.mainIdea
  // always has at least one paragraph. So no existing ch01-t01 slide (nor
  // any slide using today's single marker-based parsing convention) can
  // ever reach the component with sections.mainIdea empty — that is
  // exactly why "no empty Main Idea" could ship silently wrong before this
  // correction. The presence-driven policy itself, and the fact that
  // Main Idea is no longer special-cased, is proven at the selection
  // layer (selectReviewSections above) — the same pure function whose
  // output the compact JSX's `include("mainIdea")` check consumes
  // one-to-one, so a "mainIdea" key excluded there can never produce a
  // rendered `--main-idea` section, for any future topic or slide shape.

  it("1. hasMainIdea: true includes mainIdea (see also 11a above)", () => {
    expect(selectReviewSections({ ...NO_REVIEW_CONTENT, hasMainIdea: true })).toEqual(["mainIdea"]);
  });

  it("2. hasMainIdea: false omits mainIdea even when every other flag is true (see also 12 above, which is the mirror case with hasMainIdea: true)", () => {
    const keys = selectReviewSections({
      hasMainIdea: false,
      hasDefinitions: true,
      hasKeyConcept: true,
      hasEssentialSimpleExample: true,
      hasTable: true,
      hasTableExplanation: true,
      hasFigure: true,
      hasFigureExplanation: true,
      hasConversionFactorExplanation: true,
      hasDefinitionExplanation: true,
      hasRelationshipExplanation: true,
    });
    expect(keys).not.toContain("mainIdea");
    expect(keys).toEqual([
      "definitions",
      "keyConcept",
      "simpleExample",
      "table",
      "tableExplanation",
      "figure",
      "figureExplanation",
      "conversionFactorExplanation",
      "definitionExplanation",
      "relationshipExplanation",
    ]);
  });

  it("3. a synthetic slide with no Main Idea but with definitions selects only Definitions (see also 13b above)", () => {
    expect(selectReviewSections({ ...NO_REVIEW_CONTENT, hasDefinitions: true })).toEqual(["definitions"]);
  });

  it("4. a synthetic slide with no Main Idea but with a table selects only the Table, no Main Idea wrapper (see also 13c above)", () => {
    expect(selectReviewSections({ ...NO_REVIEW_CONTENT, hasTable: true })).toEqual(["table"]);
  });

  it("5. a synthetic slide with no Main Idea and no other eligible content selects nothing — the compact root would render zero .structured-slide__section elements (see also 13g above)", () => {
    expect(selectReviewSections({ ...NO_REVIEW_CONTENT })).toEqual([]);
  });

  it("6. excluding 'mainIdea' from the selected keys means the JSX's include(\"mainIdea\") gate is false, so no --main-idea section (and therefore no section-navigator entry, since SlideReader's nav is built only from rendered .structured-slide__section[id] elements) can ever be produced for it", () => {
    const keys = selectReviewSections({ ...NO_REVIEW_CONTENT, hasDefinitions: true });
    expect(keys.includes("mainIdea")).toBe(false);
    // Cross-checked against real rendering: every current slide that DOES
    // include "mainIdea" always renders a non-empty --main-idea section
    // (test 46 above), confirming the include(key) gate in the compact
    // JSX is wired directly off this same selection output.
  });

  it("7. current Slides 1-13 still render Main Idea, because their real parsed content is genuinely non-empty (regression, English)", () => {
    for (const slide of ALL_SLIDES) {
      renderReview(slide);
      const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
      expect(headings, `slide ${slide.slideNumber}`).toContain("Main Idea");
    }
  });

  it("8. current Slides 1-13 still render Main Idea in Arabic (regression, Arabic/RTL)", () => {
    for (const slide of ALL_SLIDES) {
      renderReview(slide, true);
      const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
      expect(headings, `slide ${slide.slideNumber}`).toContain("الفكرة الرئيسية");
    }
  });
});

describe("StructuredSlideContent — Study Mode regression (compact-only changes must not affect Study Mode)", () => {
  it("47. Study Mode's rendered section-heading order for Slide 9 is unchanged: Original English, Main Idea, Steps, Simple Example, Definition Explanation, Misconception, Scientific Note, Key Concept, Connection", () => {
    renderStudy(slideByNumber(9));
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
    expect(headings).toEqual([
      "Original English",
      "Main Idea",
      "Step-by-Step Explanation",
      "Simple Example",
      "Definition Explanation",
      "Common Misconception",
      "Scientific Note",
      "Key Concept",
      "Connection to the Next Slide",
    ]);
  });

  it("48. Study Mode continues rendering Original English", () => {
    renderStudy(slideByNumber(1));
    expect(container.textContent ?? "").toContain("Original English");
  });

  it("49. Study Mode continues rendering Step-by-Step Explanation", () => {
    renderStudy(slideByNumber(1));
    expect(container.textContent ?? "").toContain("Step-by-Step Explanation");
  });

  it("50. Study Mode continues rendering Common Misconception", () => {
    renderStudy(slideByNumber(1));
    expect(container.textContent ?? "").toContain("Common Misconception");
  });

  it("51. Study Mode continues rendering Scientific Note", () => {
    renderStudy(slideByNumber(1));
    expect(container.textContent ?? "").toContain("Scientific Note");
  });

  it("52. Study Mode continues rendering Connection to the Next Slide", () => {
    renderStudy(slideByNumber(1));
    expect(container.textContent ?? "").toContain("Connection to the Next Slide");
  });

  it("53. Study Mode still renders structured definitions inside Original English exactly as before — Review Mode's new dedicated '--definitions' section id is Review-Mode-only", () => {
    renderStudy(slideByNumber(9));
    const original = container.querySelector("#ch01-t01-block-opening-9--original");
    expect(original?.querySelector(".structured-slide__definition-cards")).toBeTruthy();
    expect(container.querySelector("#ch01-t01-block-opening-9--definitions")).toBeNull();
  });
});
