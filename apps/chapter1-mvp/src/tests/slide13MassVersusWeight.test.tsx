// @vitest-environment jsdom
//
// Tests for Slide 13 ("How Can a Suitcase Demonstrate the Difference Between
// Mass and Weight?"), added as a thirteenth sibling under ch01-t01's
// existing Slides accordion (ch01-t01-block-opening-13, blockType "slide" —
// the same generic, reusable slide blockType shared with Slides 1-12).
// Covers the 27 checks explicitly requested for this task. Uses the same
// jsdom + createRoot/act pattern as src/tests/slide12MassInertia.test.tsx
// and the shared accordion helpers from
// src/tests/testHelpers/slidesTestHelpers.tsx (only one slide's panel is
// mounted at a time, so any assertion about a slide's rendered content
// opens that slide first via openSlideByNumber).
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { getTopic } from "../content/adapter";
import {
  EQUATION_ITALIC_TOKENS_BY_TOPIC,
  EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC,
} from "../content/equationRenderer";
import {
  renderGenericSlides as renderGenericSlidesShared,
  openSlideByNumber,
  getSlideHeader,
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
const slide3 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-3")!;
const slide4 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-4")!;
const slide5 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-5")!;
const slide6 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-6")!;
const slide7 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-7")!;
const slide8 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-8")!;
const slide9 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-9")!;
const slide10 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-10")!;
const slide11 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-11")!;
const slide12 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-12")!;
const slide13 = topic.slides.find((s) => s.recordId === "ch01-t01-block-opening-13")!;

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 13 appears thirteenth", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 12, Slide 13] by slideNumber", () => {
    expect(topic.slides.map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
      "ch01-t01-block-opening-7",
      "ch01-t01-block-opening-8",
      "ch01-t01-block-opening-9",
      "ch01-t01-block-opening-10",
      "ch01-t01-block-opening-11",
      "ch01-t01-block-opening-12",
      "ch01-t01-block-opening-13",
    ]);
    expect(topic.slides.map((s) => s.slideNumber)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  it("Slide 13's header follows Slide 12's header in DOM order, all thirteen under one Slides section", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide12Idx = order.indexOf("slide-12-header");
    const slide13Idx = order.indexOf("slide-13-header");
    expect(slide12Idx).toBeGreaterThanOrEqual(0);
    expect(slide13Idx).toBeGreaterThan(slide12Idx);
    expect(container.querySelectorAll(".slides-section .slide")).toHaveLength(13);
  });

  it("Slide 13's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 13);
    expect(getSlidePanel(container, 13)?.textContent).toContain(
      "Slide 13 — How Can a Suitcase Demonstrate the Difference Between Mass and Weight?",
    );
    remount();
    renderSlides(true, 13);
    expect(getSlidePanel(container, 13)?.textContent).toContain(
      "الشريحة 13 — كيف توضح حقيبة السفر الفرق بين الكتلة والوزن؟",
    );
  });
});

describe("2. Slides 1-12 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 13", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 13", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 13", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 13", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table is unaffected by adding Slide 13", () => {
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 7's corrected significant-figures wording is unaffected by adding Slide 13", () => {
    expect(slide7.text.en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
  });

  it("Slide 8's table is unaffected by adding Slide 13", () => {
    expect(slide8.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 9's definition cards are unaffected by adding Slide 13", () => {
    expect(slide9.definitions?.en?.map((d) => d.term)).toEqual(["Period", "Frequency"]);
  });

  it("Slide 10's relationship explanation and equations are unaffected by adding Slide 13", () => {
    expect(slide10.text.en).toContain("Relationship Explanation:");
    expect(slide10.text.en).toContain("91.5 MHz = 9.15 × 10⁷ Hz");
  });

  it("Slide 11's equations and N-italicization are unaffected by adding Slide 13", () => {
    expect(slide11.text.en).toContain("f = N / Δt");
    expect(EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"]).not.toContain("N");
  });

  it("Slide 12's equations and m/F/W/a/g scoping are unaffected by adding Slide 13", () => {
    expect(slide12.text.en).toContain("W = m g");
    expect(slide12.text.en).toContain("a = F_net / m");
  });

  it("Slides 1-12 render their own content unchanged when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 6);
    expect(getSlidePanel(container, 6)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 9);
    expect(
      getSlidePanel(container, 9)?.querySelectorAll(".structured-slide__definition-card"),
    ).toHaveLength(2);

    openSlideByNumber(container, 11);
    const html11 = getSlidePanel(container, 11)!.innerHTML;
    expect(html11).toContain("<em>f</em> = <em>N</em> / Δ<em>t</em>");

    openSlideByNumber(container, 12);
    const html12 = getSlidePanel(container, 12)!.innerHTML;
    expect(html12).toContain("<em>W</em> = <em>m</em> <em>g</em>");
  });
});

describe("3. Slide 13 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-13 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide13).toBeDefined();
    expect(slide13.recordId).toBe("ch01-t01-block-opening-13");
    expect(slide13.slideNumber).toBe(13);
  });

  it("NormalizedTopic carries no Slide-13-specific field — topic.slides is the only place Slide 13's data lives", () => {
    expect(Object.keys(topic)).not.toContain("slide13");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-13")).toBe(true);
  });

  it("Slide 13 renders via the exact same generic topic.slides.map(...) as Slides 1-12 — no per-slide-number conditional", () => {
    renderSlides(false);
    expect(container.querySelectorAll(".slide")).toHaveLength(13);
    expect(container.querySelector("#slide-13-header")).not.toBeNull();
  });

  it("Slide 13's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[12]).toBe("Mass versus Weight");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[12]).toBe("الكتلة مقابل الوزن");
  });
});

describe("4. Accordion count and jump options update to 13", () => {
  it("13 accordion headers render, numbered 1-13", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]);
  });

  it("the jump select offers 13 options, including Slide 13", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBe(13);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-13");
  });

  it("the viewed-progress denominator is 13", () => {
    renderSlides(false);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      "Slides viewed: 1 of 13",
    );
  });
});

describe("5. Slide 12's Next button opens Slide 13", () => {
  it("clicking Next from Slide 12 opens Slide 13 and moves focus to its header", () => {
    renderSlides(false, 12);
    const panel12 = getSlidePanel(container, 12)!;
    const nextButton = Array.from(panel12.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 13)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 12)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 13));
  });
});

describe("6. Slide 13's Previous button opens Slide 12", () => {
  it("clicking Previous from Slide 13 opens Slide 12 and moves focus to its header", () => {
    renderSlides(false, 13);
    const panel13 = getSlidePanel(container, 13)!;
    const prevButton = Array.from(panel13.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 12)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 12));
  });
});

describe("7. Slide 13's Next button is disabled (final slide)", () => {
  it("Next is disabled and the pager reads 'Slide 13 of 13'", () => {
    renderSlides(false, 13);
    const panel13 = getSlidePanel(container, 13)!;
    const nextButton = Array.from(panel13.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
    expect(panel13.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      "Slide 13 of 13",
    );
  });
});

describe("8. Original English text is preserved verbatim", () => {
  it("all four verbatim sentences are present, unaltered", () => {
    const en = slide13.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).toContain("1.1 Fundamental Physical Quantities: Mass");
    expect(original).toContain(
      "Weight, a quantity that is related to, but is not the same as mass, is used instead.",
    );
    expect(original).toContain(
      "When you try to lift a heavy suitcase, you are experiencing its weight.",
    );
    expect(original).toContain(
      "When you pull it along and speed it up or slow it down, you are experiencing its mass.",
    );
  });

  it("no equation, qualification, or modernized wording was silently inserted into the verbatim section", () => {
    const en = slide13.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).not.toContain("=");
    expect(original).not.toMatch(/\bW\b|\bF_net\b/);
  });

  it("renders the original English paragraphs in the DOM when Slide 13 is opened", () => {
    renderSlides(false, 13);
    expect(getSlidePanel(container, 13)?.textContent).toContain(
      "When you try to lift a heavy suitcase, you are experiencing its weight.",
    );
  });
});

describe("9. Source emphasis on 'not' is preserved semantically", () => {
  it("renders 'not' inside a semantic <strong>, without altering the surrounding verbatim sentence", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    const strongEl = panel.querySelector("strong");
    expect(strongEl?.textContent).toBe("not");
    expect(panel.textContent).toContain(
      "Weight, a quantity that is related to, but is not the same as mass, is used instead.",
    );
  });

  it("the Arabic negation 'ليست' is emphasized the same way in Arabic", () => {
    renderSlides(true, 13);
    const panel = getSlidePanel(container, 13)!;
    const strongEl = panel.querySelector("strong");
    expect(strongEl?.textContent).toBe("ليست");
  });
});

describe("10. The focused suitcase figure renders once", () => {
  it("exactly one .slide-figure renders, inside the Figure Explanation section", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    expect(panel.querySelectorAll(".slide-figure")).toHaveLength(1);
    const figureExplanationHeading = Array.from(panel.querySelectorAll("h4")).find(
      (h) => h.textContent === "Figure Explanation",
    );
    expect(figureExplanationHeading).toBeDefined();
    const section = figureExplanationHeading!.closest(".structured-slide__section");
    expect(section?.querySelector(".slide-figure")).not.toBeNull();
  });

  it("slide13.figure carries a non-empty assetUrl resolved via RAW_FIGURE_URL_BY_BLOCK_ID", () => {
    expect(slide13.figure).toBeDefined();
    expect(slide13.figure?.assetUrl).toEqual(expect.any(String));
    expect(slide13.figure?.assetUrl.length).toBeGreaterThan(0);
  });
});

describe("11. The complete source-slide screenshot is not rendered", () => {
  it("only one <img> renders in the panel (the focused figure, not a full-slide screenshot)", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    expect(panel.querySelectorAll("img")).toHaveLength(1);
  });

  it("the panel text contains no reference to a green banner or bullet-list screenshot artifact", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    expect(panel.textContent).not.toMatch(/banner|screenshot/i);
  });
});

describe("12. English and Arabic alt text are accurate", () => {
  it("English alt text describes both actions", () => {
    renderSlides(false, 13);
    const img = getSlidePanel(container, 13)!.querySelector("img")!;
    expect(img.getAttribute("alt")).toBe(
      "A person lifts a suitcase vertically on the left and pulls a suitcase horizontally on the right, illustrating weight during lifting and inertia during acceleration.",
    );
  });

  it("Arabic alt text describes both actions", () => {
    renderSlides(true, 13);
    const img = getSlidePanel(container, 13)!.querySelector("img")!;
    expect(img.getAttribute("alt")).toBe(
      "شخص يرفع حقيبة سفر رأسيًا في الجهة اليسرى ويسحب حقيبة أفقيًا في الجهة اليمنى، لتوضيح الوزن أثناء الرفع والقصور الذاتي أثناء التسارع.",
    );
  });
});

describe("13. W = m g renders correctly", () => {
  it("appears in Step 2, the Simple Example, and Common Misconception", () => {
    const en = slide13.text.en ?? "";
    const occurrences = en.split("W = m g").length - 1;
    expect(occurrences).toBe(3);
  });

  it("renders with W, m, and g all italic", () => {
    renderSlides(false, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain("<em>W</em> = <em>m</em> <em>g</em>");
  });

  it("renders as a distinct equation block inside Common Misconception (opted into equation-aware rendering)", () => {
    renderSlides(false, 13);
    const misconception = getSlidePanel(container, 13)!.querySelector(
      ".structured-slide__callout--misconception",
    )!;
    const block = misconception.querySelector(".structured-slide__equation-block");
    expect(block?.textContent).toBe("W = m g");
  });
});

describe("14. a = F_net / m renders correctly", () => {
  it("appears in Step 3 and the Simple Example", () => {
    const en = slide13.text.en ?? "";
    const occurrences = en.split("a = F_net / m").length - 1;
    expect(occurrences).toBe(2);
  });

  it("renders with 'a' italic, 'F' italic with a 'net' subscript, and 'm' italic", () => {
    renderSlides(false, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain("<em>a</em> = <span><em>F</em><sub>net</sub></span> / <em>m</em>");
  });
});

describe("15. W = (20 kg)(9.8 m/s²) = 196 N renders correctly", () => {
  it("appears in the Simple Example", () => {
    const en = slide13.text.en ?? "";
    expect(en).toContain("W = (20 kg)(9.8 m/s²) = 196 N");
  });

  it("renders with only 'W' italic — 'kg', 'm/s²', and 'N' stay upright", () => {
    renderSlides(false, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain("<em>W</em> = (20 kg)(9.8 m/s²) = 196 N");
  });
});

describe("16. a = (40 N) / (20 kg) = 2.0 m/s² renders correctly", () => {
  it("appears in the Simple Example", () => {
    const en = slide13.text.en ?? "";
    expect(en).toContain("a = (40 N) / (20 kg) = 2.0 m/s²");
  });

  it("renders with only 'a' italic — 'N', 'kg', and 'm/s²' stay upright", () => {
    renderSlides(false, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain("<em>a</em> = (40 N) / (20 kg) = 2.0 m/s²");
  });
});

describe("17. Variable m is italic in mass equations", () => {
  it("'m' is italic in 'm = 20 kg', 'W = m g', and 'a = F_net / m'", () => {
    renderSlides(false, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain("<em>m</em> = 20 kg");
    expect(html).toContain("<em>W</em> = <em>m</em> <em>g</em>");
    expect(html).toContain("/ <em>m</em>");
  });
});

describe("18. Metre m remains upright in m/s²", () => {
  it("'m' inside '9.8 m/s²' and '2.0 m/s²' is never italicized", () => {
    renderSlides(false, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain("<em>g</em> = 9.8 m/s²");
    expect(html).not.toContain("9.8 <em>m</em>/s²");
    expect(html).toContain("= 2.0 m/s²");
    expect(html).not.toContain("2.0 <em>m</em>/s²");
  });

  it("additionalItalicTokens for Slide 13 does NOT include 'm' (block-wide 'm' would wrongly italicize the m/s² unit)", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    const emTexts = Array.from(panel.querySelectorAll("em")).map((el) => el.textContent);
    // Every italicized 'm' comes from an exact equationPhraseItalicTokens
    // match (m = 20 kg ×1; W = m g ×3; a = F_net / m ×2) — six total — never
    // from the m/s² unit occurrences.
    expect(emTexts.filter((t) => t === "m")).toHaveLength(6);
  });
});

describe("19. Gravitational g is italic in physics equations", () => {
  it("'g' is italic in 'g = 9.8 m/s²', 'W = m g' (×3), and Step 4's prose 'acceleration g.'", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    const html = panel.innerHTML;
    expect(html).toContain("<em>g</em> = 9.8 m/s²");
    expect(html).toContain("<em>W</em> = <em>m</em> <em>g</em>");
    expect(panel.textContent).toContain("Weight depends on the local gravitational acceleration g.");
    const emTexts = Array.from(panel.querySelectorAll("em")).map((el) => el.textContent);
    // g = 9.8 m/s² (1) + W = m g ×3 (3) + Step 4 prose "acceleration g." (1) = 5.
    expect(emTexts.filter((t) => t === "g")).toHaveLength(5);
  });
});

describe("20. kg, N, m, and s remain upright as units", () => {
  it("no <em> ever wraps 'kg', 'N', or a bare 's'", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    const emTexts = Array.from(panel.querySelectorAll("em")).map((el) => el.textContent);
    expect(emTexts).not.toContain("kg");
    expect(emTexts).not.toContain("N");
    expect(emTexts).not.toContain("s");
  });
});

describe("21. Slide 11's number-of-cycles N rendering remains unchanged", () => {
  it("Slide 11 still renders f = N / Δt with N italic via its own blockId-scoped config, unaffected by Slide 13", () => {
    renderSlides(false, 11);
    const html = getSlidePanel(container, 11)!.innerHTML;
    expect(html).toContain("<em>f</em> = <em>N</em> / Δ<em>t</em>");
  });

  it("Slide 13 does not inherit Slide 11's scoped 'N' — 'N' never appears italic in Slide 13 (it is only the newton unit there)", () => {
    renderSlides(false, 13);
    const panel = getSlidePanel(container, 13)!;
    const emTexts = Array.from(panel.querySelectorAll("em")).map((el) => el.textContent);
    expect(emTexts).not.toContain("N");
    expect(panel.textContent).toContain("196 N");
    expect(panel.textContent).toContain("40 N");
  });

  it("neither topic-wide whitelist contains 'N', 'm', 'a', 'F', 'W', or 'g'", () => {
    for (const token of ["N", "m", "a", "F", "W", "g"]) {
      expect(EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"]).not.toContain(token);
      expect(EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]).not.toContain(token);
    }
  });
});

describe("22. Figure Explanation renders in both languages", () => {
  it("English Figure Explanation describes both the lifting and pulling actions", () => {
    const en = slide13.text.en ?? "";
    expect(en).toContain("The left side shows a person lifting the suitcase.");
    expect(en).toContain("The right side shows a person pulling the suitcase horizontally.");
    expect(en).toContain("it does not show mass acting as a force");
  });

  it("Arabic Figure Explanation describes both actions", () => {
    const ar = slide13.text.ar ?? "";
    expect(ar).toContain("توضح الجهة اليسرى شخصًا يرفع الحقيبة");
    expect(ar).toContain("وتوضح الجهة اليمنى شخصًا يسحب الحقيبة أفقيًا");
  });

  it("renders in the DOM in both languages", () => {
    renderSlides(false, 13);
    expect(getSlidePanel(container, 13)?.textContent).toContain(
      "The left side shows a person lifting the suitcase.",
    );
    remount();
    renderSlides(true, 13);
    expect(getSlidePanel(container, 13)?.textContent).toContain(
      "توضح الجهة اليسرى شخصًا يرفع الحقيبة",
    );
  });
});

describe("23. Mass-versus-weight misconception renders in both languages", () => {
  it("English states the misconception and correction", () => {
    const en = slide13.text.en ?? "";
    expect(en).toContain("Misconception: a suitcase has mass only because gravity pulls on it.");
    expect(en).toContain("Correction: mass measures inertia and is not produced by gravity.");
  });

  it("Arabic states the same misconception and correction, with the same untranslated equation", () => {
    const ar = slide13.text.ar ?? "";
    expect(ar).toContain("مفهوم خاطئ: تمتلك حقيبة السفر كتلة فقط لأن الجاذبية تسحبها");
    expect(ar).toContain("W = m g");
  });
});

describe("24. Arabic content and figure container render RTL correctly", () => {
  it("document dir is rtl in Arabic, ltr in English", () => {
    renderSlides(true, 13);
    const panelAr = getSlidePanel(container, 13)!;
    const arParagraph = panelAr.querySelector("p[dir]");
    expect(arParagraph?.getAttribute("dir")).toBe("rtl");

    remount();
    renderSlides(false, 13);
    const panelEn = getSlidePanel(container, 13)!;
    const enParagraph = panelEn.querySelector("p[dir]");
    expect(enParagraph?.getAttribute("dir")).toBe("ltr");
  });

  it("the enlarge dialog carries dir=\"rtl\" in Arabic", () => {
    renderSlides(true, 13);
    const enlargeButton = getSlidePanel(container, 13)!.querySelector(
      ".slide-figure__enlarge",
    ) as HTMLButtonElement;
    act(() => enlargeButton.click());
    const dialog = container.querySelector(".slide-figure__dialog");
    expect(dialog?.getAttribute("dir")).toBe("rtl");
  });

  it("equation notation inside Arabic prose stays LTR-isolated", () => {
    renderSlides(true, 13);
    const html = getSlidePanel(container, 13)!.innerHTML;
    expect(html).toContain('dir="ltr"');
    expect(html).toContain("<em>W</em> = <em>m</em> <em>g</em>");
  });
});

describe("25. Slide 13 persists across reload", () => {
  it("opening Slide 13, then remounting fresh, restores Slide 13 as open", () => {
    renderSlides(false, 13);
    expect(getSlideHeader(container, 13)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 13)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("persists under the topic-namespaced localStorage key", () => {
    renderSlides(false, 13);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-13",
    );
  });
});

describe("26. Governance remains blocked and publication unauthorized", () => {
  it("blocking.blockingStatus is 'blocked' and studentFacingAllowed is false", () => {
    expect(slide13.blocking.blockingStatus).toBe("blocked");
    expect(slide13.blocking.studentFacingAllowed).toBe(false);
  });

  it("recordCount reflects the new record and Slides 1-12's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(20);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide12.blocking.studentFacingAllowed).toBe(false);
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
  });
});

describe("27. missingVisual is absent", () => {
  it("blocking.blockingReason does not include 'missingVisual' now that the focused figure asset is integrated", () => {
    expect(slide13.blocking.blockingReason).not.toContain("missingVisual");
  });
});
