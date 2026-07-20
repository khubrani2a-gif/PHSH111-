// @vitest-environment jsdom
//
// Dedicated tests for the removal of the electric-charge-derivation
// statement ("Electric charge is a derived quantity, obtained from current
// multiplied by time: Q = I t.") from ch01-t01's Slide 1 Scientific Note,
// and its replacement with a shorter project-owner-authored Scientific
// Note — per ENGLISH_BATCH1_BASELINE_APPROVAL.json revisionLog rev-006 and
// ARABIC_BATCH1_BASELINE_APPROVAL.json revisionLog rev-004. Covers the 8
// checks explicitly requested for this task.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../content/equationRenderer";
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

const NEW_SCIENTIFIC_NOTE_EN =
  "Scientific Note: This slide follows the textbook's introductory framework for the quantities discussed in this chapter. The complete modern SI system contains seven base quantities.";
const NEW_SCIENTIFIC_NOTE_AR =
  "ملاحظة علمية: يتبع هذا السلايد الإطار التمهيدي الذي يعتمده الكتاب للكميات المطروحة في هذا الفصل. ويحتوي نظام الوحدات الدولي الحديث على سبع كميات أساسية.";
const OLD_CHARGE_SENTENCE_EN =
  "Electric charge is a derived quantity, obtained from current multiplied by time: Q = I t.";
const OLD_CHARGE_SENTENCE_AR = "أما الشحنة الكهربائية فهي كمية مشتقة، تُحسب من ضرب التيار الكهربائي في الزمن: Q = I t.";

function renderSlide1(arabic: boolean) {
  if (arabic) window.localStorage.setItem("phsh111:language", "ar");
  act(() => {
    root.render(
      <LanguageProvider>
        <StructuredSlideContent
          blockId={topic.openingConcept!.recordId}
          text={topic.openingConcept!.text}
          italicTokens={PROSE_TOKENS}
        />
      </LanguageProvider>,
    );
  });
}

describe("1. Q = I t no longer appears in the English or Arabic Slide 1 content", () => {
  it("is absent from the raw approved English and Arabic source text", () => {
    expect(topic.openingConcept?.text.en ?? "").not.toContain("Q = I t");
    expect(topic.openingConcept?.text.ar ?? "").not.toContain("Q = I t");
  });

  it("is absent from the rendered English DOM", () => {
    renderSlide1(false);
    expect(container.textContent).not.toContain("Q = I t");
  });

  it("is absent from the rendered Arabic DOM", () => {
    renderSlide1(true);
    expect(container.textContent).not.toContain("Q = I t");
  });
});

describe("2. The old charge-derivation sentence is absent in both languages", () => {
  it("English sentence is fully absent from source and render", () => {
    expect(topic.openingConcept?.text.en ?? "").not.toContain(OLD_CHARGE_SENTENCE_EN);
    renderSlide1(false);
    expect(container.textContent).not.toContain(OLD_CHARGE_SENTENCE_EN);
  });

  it("Arabic sentence is fully absent from source and render", () => {
    expect(topic.openingConcept?.text.ar ?? "").not.toContain(OLD_CHARGE_SENTENCE_AR);
    renderSlide1(true);
    expect(container.textContent).not.toContain(OLD_CHARGE_SENTENCE_AR);
  });

  it("the surrounding SI base-quantity itemization sentence (current vs. charge) is also gone, not just the final clause", () => {
    const en = topic.openingConcept?.text.en ?? "";
    expect(en).not.toContain("electric current — not electric charge");
    expect(en).not.toContain("thermodynamic temperature, amount of substance, and luminous intensity");
  });
});

describe("3. The replacement Scientific Note appears exactly in both languages", () => {
  it("English replacement text matches exactly", () => {
    expect(topic.openingConcept?.text.en ?? "").toContain(NEW_SCIENTIFIC_NOTE_EN);
    renderSlide1(false);
    expect(container.textContent).toContain(NEW_SCIENTIFIC_NOTE_EN);
  });

  it("Arabic replacement text matches exactly", () => {
    expect(topic.openingConcept?.text.ar ?? "").toContain(NEW_SCIENTIFIC_NOTE_AR);
    renderSlide1(true);
    expect(container.textContent).toContain(NEW_SCIENTIFIC_NOTE_AR);
  });
});

describe("4. The Scientific Note callout still renders correctly", () => {
  it("renders its own bold heading and distinct callout class in English", () => {
    renderSlide1(false);
    const callout = container.querySelector(".structured-slide__callout--scientific-note");
    expect(callout).toBeTruthy();
    expect(callout?.querySelector("h4.structured-slide__heading")?.textContent).toBe("Scientific Note");
    expect(callout?.textContent).toContain(NEW_SCIENTIFIC_NOTE_EN);
  });

  it("renders its own bold heading and distinct callout class in Arabic", () => {
    renderSlide1(true);
    const callout = container.querySelector(".structured-slide__callout--scientific-note");
    expect(callout).toBeTruthy();
    expect(callout?.querySelector("h4.structured-slide__heading")?.textContent).toBe("ملاحظة علمية");
    expect(callout?.textContent).toContain(NEW_SCIENTIFIC_NOTE_AR);
  });

  it("remains visually distinct from the Misconception callout", () => {
    renderSlide1(false);
    const misconception = container.querySelector(".structured-slide__callout--misconception");
    const scientificNote = container.querySelector(".structured-slide__callout--scientific-note");
    expect(misconception?.className).not.toBe(scientificNote?.className);
  });
});

describe("5. The speed equation remains unchanged", () => {
  it("v = d / t = 100 m / 5 s = 20 m/s still renders in its own distinct equation block, English", () => {
    renderSlide1(false);
    const block = container.querySelector(".structured-slide__equation-block");
    expect(block?.textContent).toBe("v = d / t = 100 m / 5 s = 20 m/s");
    expect(block?.innerHTML).toContain("<em>v</em>");
    expect(block?.innerHTML).toContain("<em>d</em>");
    expect(block?.innerHTML).toContain("<em>t</em>");
  });

  it("v = d / t = 100 m / 5 s = 20 m/s still renders in its own distinct equation block, Arabic", () => {
    renderSlide1(true);
    const block = container.querySelector(".structured-slide__equation-block");
    expect(block?.textContent).toBe("v = d / t = 100 m / 5 s = 20 m/s");
  });
});

describe("6. Slide 1 headings and numbered steps remain unchanged", () => {
  it("all seven section headings still appear, in order, English", () => {
    renderSlide1(false);
    const headings = Array.from(container.querySelectorAll("h4.structured-slide__heading")).map((h) => h.textContent);
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

  it("all five numbered steps still appear, in order, unchanged", () => {
    renderSlide1(false);
    const steps = Array.from(container.querySelectorAll(".structured-slide__steps > li"));
    expect(steps).toHaveLength(5);
    const numerals = steps.map((li) => li.querySelector("strong.structured-slide__step-number")?.textContent);
    expect(numerals).toEqual(["1.", "2.", "3.", "4.", "5."]);
  });
});

describe("7. English and Arabic directions remain correct", () => {
  it("English paragraphs render dir=\"ltr\", including the Scientific Note callout", () => {
    renderSlide1(false);
    expect(container.querySelectorAll('p[dir="rtl"]').length).toBe(0);
    expect(container.querySelectorAll('p[dir="ltr"]').length).toBeGreaterThan(0);
    const callout = container.querySelector(".structured-slide__callout--scientific-note");
    expect(callout?.querySelector('p[dir="ltr"]')).toBeTruthy();
  });

  it("Arabic paragraphs render dir=\"rtl\", including the Scientific Note callout", () => {
    renderSlide1(true);
    expect(container.querySelectorAll('p[dir="ltr"]').length).toBe(0);
    expect(container.querySelectorAll('p[dir="rtl"]').length).toBeGreaterThan(0);
    const callout = container.querySelector(".structured-slide__callout--scientific-note");
    expect(callout?.querySelector('p[dir="rtl"]')).toBeTruthy();
  });
});

describe("8. Governance/publication flags remain unchanged", () => {
  it("studentFacingAllowed and studentPublicationAuthorized stay false; blocking status untouched", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    expect(topic.openingConcept?.blocking.studentFacingAllowed).toBe(false);
    expect(topic.openingConcept?.blocking.blockingStatus).toBe("blocked");
  });
});
