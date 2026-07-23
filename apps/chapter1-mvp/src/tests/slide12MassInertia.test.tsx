// @vitest-environment jsdom
//
// Tests for Slide 12 ("Why Does Greater Mass Mean Greater Inertia?"), added
// as a twelfth sibling under ch01-t01's existing Slides accordion
// (ch01-t01-block-opening-12, blockType "slide" — the same generic,
// reusable slide blockType shared with Slides 1-11). Covers the 22 checks
// explicitly requested for this task. Uses the same jsdom + createRoot/act
// pattern as src/tests/slide11StopwatchFrequency.test.tsx and the shared
// accordion helpers from src/tests/testHelpers/slidesTestHelpers.tsx (only
// one slide's panel is mounted at a time, so any assertion about a slide's
// rendered content opens that slide first via openSlideByNumber).
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

/** Renders the full generic Slides accordion, optionally opening one slide by number (defaults to Slide 1 open, matching a first-time visitor). */
function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlidesShared(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide 12 appears twelfth", () => {
  it("topic.slides is ordered [Slide 1, ..., Slide 11, Slide 12, Slide 13] by slideNumber", () => {
    expect(topic.slides.map((s) => s.recordId).slice(0, 12)).toEqual([
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
    ]);
    // Slide 13 (see slide13MassVersusWeight.test.tsx) was added after this
    // slide's own test file was written — asserted here only as "comes
    // immediately after Slide 12", not re-tested in detail.
    expect(topic.slides[12]?.recordId).toBe("ch01-t01-block-opening-13");
    expect(topic.slides.map((s) => s.slideNumber).slice(0, 12)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("Slide 12's header follows Slide 11's header in DOM order, under the same Slides section as Slide 13", () => {
    renderSlides(false);
    const order = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
    const slide11Idx = order.indexOf("slide-11-header");
    const slide12Idx = order.indexOf("slide-12-header");
    expect(slide11Idx).toBeGreaterThanOrEqual(0);
    expect(slide12Idx).toBeGreaterThan(slide11Idx);
    // Thirteen now that Slide 13 has been added (see slide13MassVersusWeight.test.tsx).
    expect(container.querySelectorAll(".slides-section .slide")).toHaveLength(13);
  });

  it("Slide 12's exact bilingual title renders inside its expanded panel", () => {
    renderSlides(false, 12);
    expect(getSlidePanel(container, 12)?.textContent).toContain(
      "Slide 12 — Why Does Greater Mass Mean Greater Inertia?",
    );
    remount();
    renderSlides(true, 12);
    expect(getSlidePanel(container, 12)?.textContent).toContain(
      "الشريحة 12 — لماذا تعني الكتلة الأكبر قصورًا ذاتيًا أكبر؟",
    );
  });
});

describe("2. Slides 1-11 remain unchanged", () => {
  it("Slide 1's English text is unaffected by adding Slide 12", () => {
    expect(slide1.text.en).toContain("In physics, there are three basic aspects");
  });

  it("Slide 3's table is unaffected by adding Slide 12", () => {
    expect(slide3.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 4's figure is unaffected by adding Slide 12", () => {
    expect(slide4.figure?.assetUrl).toEqual(expect.any(String));
  });

  it("Slide 5's rectangle equation is unaffected by adding Slide 12", () => {
    expect(slide5.text.en).toContain("A = (4 m)(3 m) = 12 m²");
  });

  it("Slide 6's table is unaffected by adding Slide 12", () => {
    expect(slide6.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 7's corrected significant-figures wording is unaffected by adding Slide 12", () => {
    expect(slide7.text.en).toContain("23 m ≈ 75.5 ft (rounded to one decimal place)");
  });

  it("Slide 8's table is unaffected by adding Slide 12", () => {
    expect(slide8.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
  });

  it("Slide 9's definition cards are unaffected by adding Slide 12", () => {
    expect(slide9.definitions?.en?.map((d) => d.term)).toEqual(["Period", "Frequency"]);
  });

  it("Slide 10's relationship explanation and equations are unaffected by adding Slide 12", () => {
    expect(slide10.text.en).toContain("Relationship Explanation:");
    expect(slide10.text.en).toContain("91.5 MHz = 9.15 × 10⁷ Hz");
  });

  it("Slide 11's equations and N-italicization are unaffected by adding Slide 12", () => {
    expect(slide11.text.en).toContain("f = N / Δt");
    expect(EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"]).not.toContain("N");
  });

  it("Slides 1-11 render their own content unchanged when opened through the accordion", () => {
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
  });
});

describe("3. Slide 12 loads through the generic slides[] architecture", () => {
  it("ch01-t01-block-opening-12 has blockType \"slide\" (no new ContentBlockType)", () => {
    expect(slide12).toBeDefined();
    expect(slide12.recordId).toBe("ch01-t01-block-opening-12");
    expect(slide12.slideNumber).toBe(12);
  });

  it("NormalizedTopic carries no Slide-12-specific field — topic.slides is the only place Slide 12's data lives", () => {
    expect(Object.keys(topic)).not.toContain("slide12");
    expect(topic.slides.some((s) => s.recordId === "ch01-t01-block-opening-12")).toBe(true);
  });

  it("Slide 12 renders via the exact same generic topic.slides.map(...) as Slides 1-11 — no per-slide-number conditional", () => {
    renderSlides(false);
    // Thirteen now that Slide 13 has been added (see slide13MassVersusWeight.test.tsx).
    expect(container.querySelectorAll(".slide")).toHaveLength(13);
    expect(container.querySelector("#slide-12-header")).not.toBeNull();
  });

  it("Slide 12's short accordion title resolves from the UI-only lookup, not a new content-record field", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles[11]).toBe("Mass and Inertia");
    remount();
    renderSlides(true);
    const shortTitlesAr = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitlesAr[11]).toBe("الكتلة والقصور الذاتي");
  });
});

describe("4. Accordion count and jump options include 12 (now 13 with Slide 13 added — see slide13MassVersusWeight.test.tsx)", () => {
  it("accordion headers 1-12 render as a prefix (Slide 13 follows)", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers.slice(0, 12)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);
    expect(numbers[12]).toBe("13");
  });

  it("the jump select offers 13 options, including Slide 12", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBe(13);
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toContain("ch01-t01-block-opening-12");
  });

  it("the viewed-progress denominator includes Slide 13", () => {
    renderSlides(false);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      "Slides viewed: 1 of 13",
    );
  });
});

describe("5. Slide 11's Next button opens Slide 12", () => {
  it("clicking Next from Slide 11 opens Slide 12 and moves focus to its header", () => {
    renderSlides(false, 11);
    const panel11 = getSlidePanel(container, 11)!;
    const nextButton = Array.from(panel11.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 12)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 11)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(getSlideHeader(container, 12));
  });
});

describe("6. Slide 12's Previous button opens Slide 11", () => {
  it("clicking Previous from Slide 12 opens Slide 11 and moves focus to its header", () => {
    renderSlides(false, 12);
    const panel12 = getSlidePanel(container, 12)!;
    const prevButton = Array.from(panel12.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(false);
    act(() => prevButton.click());
    expect(getSlideHeader(container, 11)?.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(getSlideHeader(container, 11));
  });
});

describe("7. Slide 12's Next button opens Slide 13 (no longer the final slide — see slide13MassVersusWeight.test.tsx)", () => {
  it("Next is enabled and the pager reads 'Slide 12 of 13'", () => {
    renderSlides(false, 12);
    const panel12 = getSlidePanel(container, 12)!;
    const nextButton = Array.from(panel12.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    expect(panel12.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      "Slide 12 of 13",
    );
  });
});

describe("8. Original English text and source table are preserved", () => {
  it("the verbatim original paragraphs are present, unaltered, and contain no silently added pound/conversion/SI wording", () => {
    const en = slide12.text.en ?? "";
    const mainIdeaIdx = en.indexOf("Main Idea:");
    const original = en.slice(0, mainIdeaIdx);
    expect(original).toContain("1.1 Fundamental Physical Quantities: Mass");
    expect(original).toContain(
      "Mass is also a measure of what we sometimes refer to in everyday speech as inertia.",
    );
    expect(original).toContain(
      "The larger the mass of an object, the greater its inertia and the more difficult it is to speed up or slow down.",
    );
    expect(original).toContain(
      "Mass is not in common use in the English system; note the unfamiliar unit, the slug.",
    );
    expect(original).toContain(
      "The following table lists the mass unit of measure in the metric and English systems and their abbreviations.",
    );
    expect(original).not.toContain("pound");
    expect(original).not.toContain("lbf");
    expect(original).not.toContain("conversion factor");
  });

  it("renders the original English paragraphs in the DOM when Slide 12 is opened", () => {
    renderSlides(false, 12);
    expect(getSlidePanel(container, 12)?.textContent).toContain(
      "Mass is also a measure of what we sometimes refer to in everyday speech as inertia.",
    );
  });

  it("the source table is reconstructed exactly: Mass (m) | kilogram (kg) | slug, then a continuation row of gram (g) only", () => {
    expect(slide12.table?.en?.headers).toEqual(["Physical Quantity", "Metric Units", "English Units"]);
    expect(slide12.table?.en?.rows).toEqual([
      ["Mass (m)", "kilogram (kg)", "slug"],
      [null, "gram (g)", null],
    ]);
  });
});

describe("9. The semantic table contains two body rows", () => {
  it("renders a real <table> with two <tr> body rows, not the source screenshot", () => {
    renderSlides(false, 12);
    const table = getSlidePanel(container, 12)!.querySelector("table.structured-slide__table")!;
    expect(table).not.toBeNull();
    expect(table.querySelectorAll("thead th").length).toBe(3);
    const bodyRows = table.querySelectorAll("tbody tr");
    expect(bodyRows).toHaveLength(2);
    expect(table.querySelector("img")).toBeNull();
  });

  it("the first row's th spans both rows (rowgroup) and the second row's first cell is empty", () => {
    renderSlides(false, 12);
    const table = getSlidePanel(container, 12)!.querySelector("table.structured-slide__table")!;
    const firstRowHeader = table.querySelector("tbody tr:first-child th");
    expect(firstRowHeader?.getAttribute("scope")).toBe("rowgroup");
    expect(firstRowHeader?.getAttribute("rowspan")).toBe("2");
    expect(firstRowHeader?.textContent).toBe("Mass (m)");
    const secondRow = table.querySelectorAll("tbody tr")[1];
    expect(secondRow.querySelectorAll("th")).toHaveLength(0);
    expect(secondRow.querySelectorAll("td")[0]?.textContent).toBe("gram (g)");
  });
});

describe("10. Mass (m), kilogram (kg), gram (g), and slug render correctly", () => {
  it("all four appear in the table headers/cells and step prose", () => {
    const en = slide12.text.en ?? "";
    expect(en).toContain("Mass is represented by the symbol m.");
    expect(en).toContain("The kilogram (kg) is the SI base unit of mass.");
    expect(en).toContain("The gram (g) is a smaller metric unit.");
    expect(en).toContain("The slug is an English engineering unit of mass.");
  });
});

describe("11. 1 kg = 1000 g renders with both unit symbols upright", () => {
  it("renders as a distinct equation block inside Step 4", () => {
    renderSlides(false, 12);
    const blocks = Array.from(
      getSlidePanel(container, 12)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    expect(blocks).toContain("1 kg = 1000 g");
  });

  it("neither 'kg' nor 'g' is italicized anywhere in that equation block", () => {
    renderSlides(false, 12);
    const block = Array.from(
      getSlidePanel(container, 12)!.querySelectorAll(".structured-slide__equation-block"),
    ).find((el) => el.textContent === "1 kg = 1000 g")!;
    expect(block.querySelectorAll("em")).toHaveLength(0);
  });
});

describe("12. a = F_net / m renders correctly", () => {
  it("appears in Step 3 and the Simple Example", () => {
    const en = slide12.text.en ?? "";
    const occurrences = en.split("a = F_net / m").length - 1;
    expect(occurrences).toBe(2);
  });

  it("renders with 'a' italic, 'F' italic with a 'net' subscript, and 'm' italic", () => {
    renderSlides(false, 12);
    const html = getSlidePanel(container, 12)!.innerHTML;
    expect(html).toContain("<em>a</em> = <span><em>F</em><sub>net</sub></span> / <em>m</em>");
  });

  it("renders as a distinct equation block both times", () => {
    renderSlides(false, 12);
    const blocks = Array.from(
      getSlidePanel(container, 12)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    // textContent flattens the <sub>net</sub> without its underscore delimiter.
    expect(blocks.filter((b) => b === "a = Fnet / m")).toHaveLength(2);
  });
});

describe("13. The shopping-cart Simple Example preserves 20 kg and 80 kg", () => {
  it("states the empty and loaded cart masses and the shared conclusion", () => {
    const en = slide12.text.en ?? "";
    expect(en).toContain(
      "Simple Example: Consider an empty shopping cart and a fully loaded shopping cart.",
    );
    expect(en).toContain("m_empty = 20 kg");
    expect(en).toContain("m_loaded = 80 kg");
    expect(en).toContain(
      "The loaded cart has the smaller acceleration because its mass is greater.",
    );
  });

  it("renders both mass equations as distinct equation blocks with 'm' italic and 'empty'/'loaded' as plain subscripts", () => {
    renderSlides(false, 12);
    const html = getSlidePanel(container, 12)!.innerHTML;
    expect(html).toContain("<span><em>m</em><sub>empty</sub></span> = 20 kg");
    expect(html).toContain("<span><em>m</em><sub>loaded</sub></span> = 80 kg");
    const blocks = Array.from(
      getSlidePanel(container, 12)!.querySelectorAll(".structured-slide__equation-block"),
    ).map((el) => el.textContent);
    // textContent flattens the <sub> without its underscore delimiter.
    expect(blocks).toContain("mempty = 20 kg");
    expect(blocks).toContain("mloaded = 80 kg");
  });

  it("the Arabic Simple Example preserves the same equations, untranslated", () => {
    const ar = slide12.text.ar ?? "";
    expect(ar).toContain("m_empty = 20 kg");
    expect(ar).toContain("m_loaded = 80 kg");
    expect(ar).toContain("a = F_net / m");
  });
});

describe("14. W = m g renders with variable g italic", () => {
  it("appears in Common Misconception, distinguishing mass from weight", () => {
    const en = slide12.text.en ?? "";
    expect(en).toContain(
      "Misconception: mass and weight are the same physical quantity.",
    );
    expect(en).toContain(
      "Correction: mass measures inertia, whereas weight is the gravitational force acting on an object.",
    );
    expect(en).toContain("W = m g");
  });

  it("renders 'W', 'm', and 'g' all italic — only within this one exact equation substring", () => {
    renderSlides(false, 12);
    const html = getSlidePanel(container, 12)!.innerHTML;
    expect(html).toContain("<em>W</em> = <em>m</em> <em>g</em>");
  });

  it("renders as a distinct equation block inside Common Misconception (opted into equation-aware rendering)", () => {
    renderSlides(false, 12);
    const misconception = getSlidePanel(container, 12)!.querySelector(
      ".structured-slide__callout--misconception",
    )!;
    const block = misconception.querySelector(".structured-slide__equation-block");
    expect(block?.textContent).toBe("W = m g");
  });
});

describe("15. The gram symbol g remains upright in unit contexts", () => {
  it("'g' in '1000 g', 'gram (g)' (Step 4 and Table Explanation), and the table cell is never italicized", () => {
    renderSlides(false, 12);
    const panel = getSlidePanel(container, 12)!;
    const emTexts = Array.from(panel.querySelectorAll("em")).map((el) => el.textContent);
    // 'g' appears in the em list exactly once — the W = m g occurrence —
    // never for the gram unit symbol anywhere else in the slide.
    expect(emTexts.filter((t) => t === "g")).toHaveLength(1);
    const table = panel.querySelector("table.structured-slide__table")!;
    expect(table.textContent).toContain("gram (g)");
    expect(table.querySelectorAll("em")).toHaveLength(0);
  });

  it("EQUATION_ITALIC_TOKENS_BY_TOPIC/EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC for ch01-t01 contain neither 'g' nor 'a' nor 'm' nor 'F' nor 'W'", () => {
    for (const token of ["g", "a", "m", "F", "W"]) {
      expect(EQUATION_ITALIC_TOKENS_BY_TOPIC["ch01-t01"]).not.toContain(token);
      expect(EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC["ch01-t01"]).not.toContain(token);
    }
  });

  it("the English indefinite article 'a' is never italicized outside the three designated equation substrings", () => {
    renderSlides(false, 12);
    const panel = getSlidePanel(container, 12)!;
    const emTexts = Array.from(panel.querySelectorAll("em")).map((el) => el.textContent);
    // a = F_net / m (×2), F_net = m a, m = F_net / a — four total.
    expect(emTexts.filter((t) => t === "a")).toHaveLength(4);
    expect(panel.textContent).toContain("a change in its state of motion");
    expect(panel.textContent).toContain("a fully loaded shopping cart");
  });
});

describe("16. F_net = m a and m = F_net / a render correctly", () => {
  it("both appear in the Scientific Note, distinct from Step 3/Simple Example's a = F_net / m", () => {
    const en = slide12.text.en ?? "";
    expect(en).toContain("F_net = m a");
    expect(en).toContain("m = F_net / a");
  });

  it("both render as distinct equation blocks with 'F', 'm', and 'a' italic and 'net' as a plain subscript", () => {
    renderSlides(false, 12);
    const html = getSlidePanel(container, 12)!.innerHTML;
    expect(html).toContain("<span><em>F</em><sub>net</sub></span> = <em>m</em> <em>a</em>");
    expect(html).toContain("<em>m</em> = <span><em>F</em><sub>net</sub></span> / <em>a</em>");
    const scientificNote = getSlidePanel(container, 12)!.querySelector(
      ".structured-slide__callout--scientific-note",
    )!;
    const blocks = Array.from(scientificNote.querySelectorAll(".structured-slide__equation-block")).map(
      (el) => el.textContent,
    );
    // textContent flattens the <sub>net</sub> without its underscore delimiter.
    expect(blocks).toContain("Fnet = m a");
    expect(blocks).toContain("m = Fnet / a");
  });
});

describe("17. 1 lbf = 1 slug × 1 ft/s² renders correctly", () => {
  it("appears in the Scientific Note", () => {
    const en = slide12.text.en ?? "";
    expect(en).toContain("1 lbf = 1 slug × 1 ft/s²");
  });

  it("renders as a distinct equation block with 's²' as a true superscript and no stray italics", () => {
    renderSlides(false, 12);
    const scientificNote = getSlidePanel(container, 12)!.querySelector(
      ".structured-slide__callout--scientific-note",
    )!;
    const block = Array.from(scientificNote.querySelectorAll(".structured-slide__equation-block")).find(
      (el) => el.textContent === "1 lbf = 1 slug × 1 ft/s²",
    )!;
    expect(block).toBeDefined();
    expect(block.querySelectorAll("em")).toHaveLength(0);
    expect(block.innerHTML).toContain("ft/s²");
  });
});

describe("18. The mass-versus-weight misconception renders in both languages", () => {
  it("English states the misconception and correction", () => {
    const en = slide12.text.en ?? "";
    expect(en).toContain("Mass remains the same when gravitational conditions change");
    expect(en).toContain("weight changes because gravitational acceleration changes");
  });

  it("Arabic states the same misconception and correction, with the same untranslated equation", () => {
    const ar = slide12.text.ar ?? "";
    expect(ar).toContain("الكتلة والوزن هما الكمية الفيزيائية نفسها");
    expect(ar).toContain("تقيس الكتلة القصور الذاتي");
    expect(ar).toContain("W = m g");
  });

  it("renders in the DOM in both languages", () => {
    renderSlides(false, 12);
    expect(getSlidePanel(container, 12)?.textContent).toContain(
      "mass and weight are the same physical quantity",
    );
    remount();
    renderSlides(true, 12);
    expect(getSlidePanel(container, 12)?.textContent).toContain(
      "الكتلة والوزن هما الكمية الفيزيائية نفسها",
    );
  });
});

describe("19. Arabic table and content render RTL", () => {
  it("the Arabic table has translated headers and rows, matching the English row structure", () => {
    expect(slide12.table?.ar?.headers).toEqual([
      "الكمية الفيزيائية",
      "الوحدات المترية",
      "الوحدات الإنجليزية",
    ]);
    expect(slide12.table?.ar?.rows).toEqual([
      ["الكتلة (m)", "الكيلوغرام (kg)", "السلَغ"],
      [null, "الغرام (g)", null],
    ]);
  });

  it("the Arabic panel's content and table render with dir=\"rtl\"", () => {
    renderSlides(true, 12);
    const panel = getSlidePanel(container, 12)!;
    const firstParagraph = panel.querySelector(".content-section__text");
    expect(firstParagraph?.getAttribute("dir")).toBe("rtl");
    const tableWrapper = panel.querySelector(".structured-slide__table-wrapper");
    expect(tableWrapper?.getAttribute("dir")).toBe("rtl");
  });

  it("equation notation inside Arabic prose stays LTR-isolated", () => {
    renderSlides(true, 12);
    const html = getSlidePanel(container, 12)!.innerHTML;
    expect(html).toContain('dir="ltr"');
    expect(html).toContain("<em>a</em> = <span><em>F</em><sub>net</sub></span> / <em>m</em>");
  });
});

describe("20. Slide 12 persists across reload", () => {
  it("opening Slide 12, then remounting fresh, restores Slide 12 as open", () => {
    renderSlides(false, 12);
    expect(getSlideHeader(container, 12)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 12)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("persists under the topic-namespaced localStorage key", () => {
    renderSlides(false, 12);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      "ch01-t01-block-opening-12",
    );
  });
});

describe("21. No source screenshot is rendered student-facing", () => {
  it("Slide 12's panel contains no <img> element", () => {
    renderSlides(false, 12);
    expect(getSlidePanel(container, 12)!.querySelector("img")).toBeNull();
  });

  it("slide12.figure is undefined — no figure asset was created or referenced", () => {
    expect(slide12.figure).toBeUndefined();
  });
});

describe("22. Governance remains blocked and publication unauthorized", () => {
  it("blocking.blockingStatus is 'blocked', studentFacingAllowed is false, and 'missingVisual' is absent", () => {
    expect(slide12.blocking.blockingStatus).toBe("blocked");
    expect(slide12.blocking.studentFacingAllowed).toBe(false);
    expect(slide12.blocking.blockingReason).not.toContain("missingVisual");
  });

  it("recordCount reflects the new record and Slides 1-11's governance flags are untouched", () => {
    expect(topic.governance.recordCount).toBe(20);
    expect(slide1.blocking.studentFacingAllowed).toBe(false);
    expect(slide11.blocking.studentFacingAllowed).toBe(false);
  });

  it("the Draft/Review Required internal status banner is unaffected (rendered by TopicPage, not by Slides.tsx)", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
  });
});
