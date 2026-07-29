// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
import { StructuredSlideContent } from "../features/topics/StructuredSlideContent";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const topic = getTopic("ch01-t05")!;
const markersEn = ["Original English", "Main Idea", "Step-by-Step Explanation", "Simple Example", "Common Misconception", "Scientific Note", "Key Concept", "Connection to the Next Slide"];
const markersAr = ["النص الإنجليزي الأصلي", "الفكرة الرئيسية", "الشرح خطوة بخطوة", "مثال بسيط", "مفهوم خاطئ شائع", "ملاحظة علمية", "المفهوم الأساسي", "الصلة بالشريحة التالية"];
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); });

function renderSlide(index: number, arabic = false, compact = false) {
  if (arabic) window.localStorage.setItem("phsh111:language", "ar");
  else window.localStorage.setItem("phsh111:language", "en");
  const slide = topic.slides[index]!;
  act(() => root.unmount());
  root = createRoot(container);
  act(() => root.render(<LanguageProvider><StructuredSlideContent blockId={slide.recordId} text={slide.text} italicTokens={EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t05"]} compact={compact} /></LanguageProvider>));
}

describe("ch01-t05 — complete structured bilingual slides", () => {
  it("contains exactly seven ordered, text-only slide records with no visual reference", () => {
    expect(topic.slides.map((slide) => slide.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(topic.slides.map((slide) => slide.recordId)).toEqual(Array.from({ length: 7 }, (_, i) => `ch01-t05-block-slide-${i + 1}`));
    expect(topic.slides.every((slide) => !slide.figure)).toBe(true);
  });

  it("renders all eight Study Mode sections for every slide in English and Arabic", () => {
    for (let i = 0; i < 7; i++) {
      renderSlide(i);
      const en = container.textContent ?? "";
      for (const marker of markersEn) expect(en, `English slide ${i + 1}: ${marker}`).toContain(marker);
      renderSlide(i, true);
      const ar = container.textContent ?? "";
      for (const marker of markersAr) expect(ar, `Arabic slide ${i + 1}: ${marker}`).toContain(marker);
      expect(container.querySelector(".structured-slide [dir=\"rtl\"]")).toBeTruthy();
    }
  });

  it("preserves the approved delivery-trip calculation and instantaneous phone reading", () => {
    renderSlide(5);
    expect(container.textContent).toContain("3000 m / 410 s ≈ 7.3 m/s");
    renderSlide(6, true);
    expect(container.textContent).toContain("9.5 m/s");
    expect(container.textContent).toContain("3000 m / 410 s ≈ 7.3 m/s");
  });

  it("keeps Review Mode compact while retaining Main Idea, Key Concept, and essential calculations", () => {
    renderSlide(5, false, true);
    const text = container.textContent ?? "";
    expect(text).toContain("Main Idea");
    expect(text).toContain("Key Concept");
    expect(text).toContain("3000 m / 410 s ≈ 7.3 m/s");
    expect(text).not.toContain("Original English");
    expect(text).not.toContain("Common Misconception");
  });

  it("keeps student-facing publication blocked and excludes prohibited content", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    const text = topic.slides.flatMap((slide) => [slide.text.en, slide.text.ar]).filter(Boolean).join("\n");
    expect(text).not.toMatch(/bolt|ch01-corr-005|svg|visualReference/i);
  });
});
