// @vitest-environment jsdom
//
// Review Mode / Study Mode verification for ch01-t03's 10 new slides
// (PR E). Reuses exactly the same StructuredSlideContent component and
// Review Mode selection logic from PR B — no new rendering code, no
// per-topic branch — proving the generic architecture works for a third
// slide-bearing topic with zero component changes.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
import { StructuredSlideContent } from "../features/topics/StructuredSlideContent";
import type { NormalizedSlide } from "../types/normalized";

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

const topic = getTopic("ch01-t03")!;
const PROSE_TOKENS = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t03"] ?? [];

function slideByNumber(n: number): NormalizedSlide {
  const slide = topic.slides.find((s) => s.slideNumber === n);
  if (!slide) throw new Error(`no ch01-t03 slide with slideNumber ${n}`);
  return slide;
}

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

function headings(): (string | null)[] {
  return Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
}

describe("ch01-t03 — Review Mode (PR E)", () => {
  it("definitions render in Review Mode (Slide 3 — Period)", () => {
    renderReview(slideByNumber(3));
    expect(headings()).toContain("Definitions");
    expect(container.querySelectorAll(".structured-slide__definition-card")).toHaveLength(1);
  });

  it("equation-bearing examples remain in Review Mode where essential (Slide 6)", () => {
    renderReview(slideByNumber(6));
    expect(headings()).toContain("Simple Example");
    expect(container.querySelector(".structured-slide__equation-block")?.textContent).toBe("f = 1/(0.50 s) = 2.0 Hz");
  });

  it("the figure and Figure Explanation remain in Review Mode (Slide 2)", () => {
    renderReview(slideByNumber(2));
    expect(container.querySelector(".slide-figure__img, img")).toBeTruthy();
    expect(headings()).toContain("Figure Explanation");
  });

  it("the table and Table Explanation remain in Review Mode (Slide 4)", () => {
    renderReview(slideByNumber(4));
    expect(container.querySelector(".structured-slide__table")).toBeTruthy();
    expect(headings()).toContain("Table Explanation");
  });

  it("Definition Explanation remains in Review Mode when present (Slide 3)", () => {
    renderReview(slideByNumber(3));
    expect(headings()).toContain("Definition Explanation");
  });

  it("Relationship Explanation remains in Review Mode when present (Slides 5 and 8)", () => {
    renderReview(slideByNumber(5));
    expect(headings()).toContain("Relationship Explanation");
    renderReview(slideByNumber(8));
    expect(headings()).toContain("Relationship Explanation");
  });

  it("Step-by-Step, Misconception, Scientific Note, Connection, and Original English/Arabic are all omitted in Review Mode (Slide 9)", () => {
    renderReview(slideByNumber(9));
    const text = container.textContent ?? "";
    expect(text).not.toContain("Original English");
    expect(text).not.toContain("Common Misconception");
    expect(text).not.toContain("Scientific Note");
    expect(text).not.toContain("Connection to the Next Slide");
    expect(headings()).not.toContain("Step-by-Step Explanation");
  });

  it("Arabic Review Mode remains correct (Slide 4, definitions + Table Explanation)", () => {
    renderReview(slideByNumber(4), true);
    expect(headings()).toContain("التعريفات");
    expect(headings()).toContain("شرح الجدول");
    const terms = Array.from(container.querySelectorAll(".structured-slide__definition-term")).map((t) => t.textContent);
    expect(terms).toEqual(["التردد", "الهرتز"]);
  });

  it("no empty heading or wrapper is created for any of the 10 slides in Review Mode", () => {
    for (let n = 1; n <= 10; n++) {
      renderReview(slideByNumber(n));
      const sections = Array.from(container.querySelectorAll(".structured-slide__section"));
      expect(sections.length, `slide ${n}`).toBeGreaterThan(0);
      for (const section of sections) {
        expect(section.children.length, `slide ${n} section ${section.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("Main Idea and Key Concept are present for all 10 slides in Review Mode", () => {
    for (let n = 1; n <= 10; n++) {
      renderReview(slideByNumber(n));
      expect(headings(), `slide ${n}`).toContain("Main Idea");
      expect(headings(), `slide ${n}`).toContain("Key Concept");
    }
  });
});

describe("ch01-t03 — Study Mode (PR E)", () => {
  it("full English content renders (Slide 1)", () => {
    renderStudy(slideByNumber(1));
    const text = container.textContent ?? "";
    expect(text).toContain("Time tells us how long something takes");
    expect(text).toContain("Original English");
  });

  it("full Arabic content renders (Slide 1)", () => {
    renderStudy(slideByNumber(1), true);
    const text = container.textContent ?? "";
    expect(text).toContain("يخبرنا الزمن بمدة استغراق أمر ما");
    expect(text).toContain("النص الإنجليزي الأصلي");
  });

  it("Step-by-Step content renders (Slide 2, 3 numbered steps)", () => {
    renderStudy(slideByNumber(2));
    expect(headings()).toContain("Step-by-Step Explanation");
    const steps = container.querySelectorAll(".structured-slide__steps > li");
    expect(steps).toHaveLength(3);
  });

  it("misconceptions render (Slide 9, the half-cycle error)", () => {
    renderStudy(slideByNumber(9));
    const text = container.textContent ?? "";
    expect(text).toContain("Common Misconception");
    expect(text).toContain("time only the outward pass");
  });

  it("scientific notes render (Slide 6)", () => {
    renderStudy(slideByNumber(6));
    const text = container.textContent ?? "";
    expect(text).toContain("Scientific Note");
    expect(text).toContain("no matter what the periodic process is");
  });

  it("connection sections render (Slide 10, the topic's last slide)", () => {
    renderStudy(slideByNumber(10));
    const text = container.textContent ?? "";
    expect(text).toContain("Connection to the Next Slide");
  });

  it("Study Mode heading order for a figure-bearing slide (Slide 2) matches the established convention", () => {
    renderStudy(slideByNumber(2));
    expect(headings()).toEqual([
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

  it("Study Mode retains the table inside Original English (Slide 4), same as ch01-t01/ch01-t02's convention", () => {
    renderStudy(slideByNumber(4));
    const original = container.querySelector(`#${slideByNumber(4).recordId}--original`);
    expect(original?.querySelector(".structured-slide__table")).toBeTruthy();
    expect(original?.querySelector(".structured-slide__definition-cards")).toBeTruthy();
  });

  it("Study Mode renders the figure inside the Figure Explanation section (Slide 2)", () => {
    renderStudy(slideByNumber(2));
    const figureExplanation = container.querySelector(`#${slideByNumber(2).recordId}--figure-explanation`);
    expect(figureExplanation?.querySelector("img")).toBeTruthy();
  });
});

describe("ch01-t03 — equation rendering reuses the shared renderer", () => {
  it("T and f render correctly (italicized, per the existing ch01-t03 whitelist) in both Study and Review Mode", () => {
    renderStudy(slideByNumber(5));
    expect(container.textContent).toContain("f = 1/T");
    renderReview(slideByNumber(7));
    expect(container.textContent).toContain("T = 1/f");
  });

  it("Arabic equation rendering does not reverse or corrupt the Latin notation (Slide 9, the pendulum calculation)", () => {
    renderStudy(slideByNumber(9), true);
    expect(container.textContent).toContain("T = 0.50 s + 0.50 s = 1.00 s");
    expect(container.textContent).toContain("f = 1/T = 1/1.00 s = 1.00 Hz");
  });

  it("multiple equation-block phrases on one slide all render correctly (Slide 8)", () => {
    renderStudy(slideByNumber(8));
    const blocks = Array.from(container.querySelectorAll(".structured-slide__equation-block")).map((el) => el.textContent);
    expect(blocks).toContain("f = 1/0.1 s = 10 Hz");
    expect(blocks).toContain("f = 1/2.0 s = 0.5 Hz");
  });
});
