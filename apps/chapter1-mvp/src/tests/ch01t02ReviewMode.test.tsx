// @vitest-environment jsdom
//
// Review Mode / Study Mode verification for ch01-t02's 11 new slides
// (PR D). Reuses exactly the same StructuredSlideContent component and
// Review Mode selection logic from PR B — no new rendering code, no
// per-topic branch — proving the generic architecture works for a second
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

const topic = getTopic("ch01-t02")!;
const PROSE_TOKENS = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t02"] ?? [];

function slideByNumber(n: number): NormalizedSlide {
  const slide = topic.slides.find((s) => s.slideNumber === n);
  if (!slide) throw new Error(`no ch01-t02 slide with slideNumber ${n}`);
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

describe("ch01-t02 — Review Mode (PR D, requirements 24-30)", () => {
  it("24. definitions render in Review Mode (Slide 2)", () => {
    renderReview(slideByNumber(2));
    expect(headings()).toContain("Definitions");
    expect(container.querySelectorAll(".structured-slide__definition-card")).toHaveLength(1);
  });

  it("25. equation-bearing examples remain in Review Mode (Slide 7)", () => {
    renderReview(slideByNumber(7));
    expect(headings()).toContain("Simple Example");
    expect(container.querySelector(".structured-slide__equation-block")?.textContent).toBe("A = 3 m × 2 m = 6 m²");
  });

  it("26. narrative-only examples are omitted in Review Mode (Slide 1, no equationBlockPhrase configured)", () => {
    renderReview(slideByNumber(1));
    expect(headings()).not.toContain("Simple Example");
  });

  it("27. tables remain in Review Mode (Slide 4)", () => {
    renderReview(slideByNumber(4));
    expect(container.querySelector(".structured-slide__table")).toBeTruthy();
    expect(headings()).toContain("Table Explanation");
  });

  it("27b. figures are absent (this topic has none) without breaking Review Mode", () => {
    renderReview(slideByNumber(4));
    expect(container.querySelector(".slide-figure__img")).toBeNull();
  });

  it("28. specialized explanations remain in Review Mode (conversion-factor, relationship, table)", () => {
    renderReview(slideByNumber(5));
    expect(headings()).toContain("Conversion-Factor Explanation");

    renderReview(slideByNumber(7));
    expect(headings()).toContain("Relationship Explanation");

    renderReview(slideByNumber(9));
    expect(headings()).toContain("Relationship Explanation");

    renderReview(slideByNumber(11));
    expect(headings()).toContain("Table Explanation");
  });

  it("29. omitted Study-Mode-only sections remain absent from Review Mode (Slide 5)", () => {
    renderReview(slideByNumber(5));
    const text = container.textContent ?? "";
    expect(text).not.toContain("Original English");
    expect(text).not.toContain("Common Misconception");
    expect(text).not.toContain("Scientific Note");
    expect(text).not.toContain("Connection to the Next Slide");
    expect(headings()).not.toContain("Step-by-Step Explanation");
  });

  it("30. Arabic Review Mode remains correct (Slide 9, definitions + relationship explanation)", () => {
    renderReview(slideByNumber(9), true);
    expect(headings()).toContain("التعريفات");
    expect(headings()).toContain("شرح العلاقة");
    const term = container.querySelector(".structured-slide__definition-term");
    expect(term?.textContent).toBe("الحجم");
  });

  it("no empty heading or wrapper is created for any of the 11 slides in Review Mode", () => {
    for (let n = 1; n <= 11; n++) {
      renderReview(slideByNumber(n));
      const sections = Array.from(container.querySelectorAll(".structured-slide__section"));
      expect(sections.length, `slide ${n}`).toBeGreaterThan(0);
      for (const section of sections) {
        expect(section.children.length, `slide ${n} section ${section.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("Main Idea is present for all 11 slides in Review Mode", () => {
    for (let n = 1; n <= 11; n++) {
      renderReview(slideByNumber(n));
      expect(headings(), `slide ${n}`).toContain("Main Idea");
    }
  });

  it("Key Concept is present for all 11 slides in Review Mode", () => {
    for (let n = 1; n <= 11; n++) {
      renderReview(slideByNumber(n));
      expect(headings(), `slide ${n}`).toContain("Key Concept");
    }
  });
});

describe("ch01-t02 — Study Mode (PR D, requirements 31-36)", () => {
  it("31. full English content renders (Slide 1)", () => {
    renderStudy(slideByNumber(1));
    const text = container.textContent ?? "";
    expect(text).toContain("Imagine describing a coin");
    expect(text).toContain("Original English");
  });

  it("32. full Arabic content renders (Slide 1)", () => {
    renderStudy(slideByNumber(1), true);
    const text = container.textContent ?? "";
    expect(text).toContain("تخيّل أن تصف قطعة نقدية");
    expect(text).toContain("النص الإنجليزي الأصلي");
  });

  it("33. Step-by-Step content renders (Slide 3)", () => {
    renderStudy(slideByNumber(3));
    expect(headings()).toContain("Step-by-Step Explanation");
    const steps = container.querySelectorAll(".structured-slide__steps > li");
    expect(steps).toHaveLength(3);
  });

  it("34. misconceptions render (Slide 8)", () => {
    renderStudy(slideByNumber(8));
    const text = container.textContent ?? "";
    expect(text).toContain("Common Misconception");
    expect(text).toContain("1 m² = 100 cm²");
  });

  it("35. scientific notes render (Slide 5)", () => {
    renderStudy(slideByNumber(5));
    const text = container.textContent ?? "";
    expect(text).toContain("Scientific Note");
    expect(text).toContain("multiply by a ratio equal to 1");
  });

  it("36. connection sections render (Slide 11, the topic's last slide)", () => {
    renderStudy(slideByNumber(11));
    const text = container.textContent ?? "";
    expect(text).toContain("Connection to the Next Slide");
  });

  it("Study Mode heading order for a table-bearing slide (Slide 4) matches the established convention", () => {
    renderStudy(slideByNumber(4));
    expect(headings()).toEqual([
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

  it("Study Mode retains the table inside Original English (Slide 4), same as ch01-t01's convention", () => {
    renderStudy(slideByNumber(4));
    const original = container.querySelector(`#${slideByNumber(4).recordId}--original`);
    expect(original?.querySelector(".structured-slide__table")).toBeTruthy();
    expect(original?.querySelector(".structured-slide__definition-cards")).toBeTruthy();
  });
});

describe("ch01-t02 — equation rendering reuses the shared renderer", () => {
  it("superscripts render correctly (m² / m³) in both Study and Review Mode", () => {
    renderStudy(slideByNumber(7));
    expect(container.textContent).toContain("m²");
    renderReview(slideByNumber(9));
    expect(container.textContent).toContain("m³");
  });

  it("Arabic equation rendering does not reverse or corrupt the Latin notation (Slide 6)", () => {
    renderStudy(slideByNumber(6), true);
    expect(container.textContent).toContain("3.2 km × (1000 m / 1 km) = 3200 m");
    expect(container.textContent).toContain("450 cm × (1 m / 100 cm) = 4.5 m");
  });
});
