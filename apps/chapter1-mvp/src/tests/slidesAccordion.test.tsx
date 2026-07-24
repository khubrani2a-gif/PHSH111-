// @vitest-environment jsdom
//
// Tests for the Slides single-open accordion (src/features/topics/Slides.tsx)
// on ch01-t01 (Fundamental Quantities), covering the 13 checks explicitly
// requested for the original version of this task: header order,
// single-open behavior, default open state, persistence (last-open slide +
// viewed IDs), Previous/Next navigation and boundary disabling, jump
// navigation, viewed-count progress, focus movement,
// aria-expanded/aria-controls correctness, Arabic RTL, generic support for
// a synthetic future slide with zero new component logic, and preservation
// of Slides 1-5's educational content.
//
// Sections 14+ cover the fully-collapsible-accordion fix (a slide's own
// header can now close it, not just switch to another slide) and its 20
// required checks: toggle-close behavior, aria-expanded reaching "false"
// on every header once collapsed, Enter/Space keyboard activation, focus
// staying on the header after collapse, viewed-progress surviving a
// collapse, Previous/Next/jump still always opening (never toggling) their
// target — including reachable from a session that began fully
// collapsed — nullable persistence (explicit "closed", not the literal
// string "null") surviving a reload, safe fallback for invalid/obsolete
// persisted state, and Arabic/RTL parity.
//
// This is a presentation/navigation-only feature — no educational
// wording, figure, table, equation, or governance/publication flag is
// touched anywhere in this file. Uses the same jsdom + createRoot/act
// pattern as the rest of this suite.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { SlidesSection, type SlideDescriptor } from "../features/topics/Slides";
import {
  renderGenericSlides,
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

function renderSlides(arabic: boolean, openSlideNumber?: number) {
  renderGenericSlides(root, topic, arabic);
  if (openSlideNumber) openSlideByNumber(container, openSlideNumber);
}

function remount() {
  act(() => root.unmount());
  root = createRoot(container);
}

describe("1. Slide headers render in correct order", () => {
  it("renders one accordion header per slide, numbered 1..N in order", () => {
    renderSlides(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers).toEqual(topic.slides.map((s) => String(s.slideNumber)));
  });

  it("each header shows its short title", () => {
    renderSlides(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    // Only the first five entries are asserted here — a later slide (e.g.
    // Slide 6, see src/tests/slide6AreaVolumeUnits.test.tsx) may
    // legitimately extend this list without breaking this test.
    expect(shortTitles.slice(0, 5)).toEqual([
      "Fundamental Quantities",
      "Length, Mass, and Time",
      "Distance Units",
      "Choosing Units",
      "Area and Volume",
    ]);
  });
});

describe("2. Only one slide panel is open at a time", () => {
  it("opening Slide 3 closes Slide 1's panel", () => {
    renderSlides(false, 3);
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
    expect(getSlideHeader(container, 3)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlidePanel(container, 1)?.hidden).toBe(true);
    expect(getSlidePanel(container, 3)?.hidden).toBe(false);
  });

  it("across all 5 slides, exactly one is expanded at any moment", () => {
    renderSlides(false);
    for (const n of [1, 2, 3, 4, 5]) {
      openSlideByNumber(container, n);
      const expandedCount = [1, 2, 3, 4, 5].filter(
        (m) => getSlideHeader(container, m)?.getAttribute("aria-expanded") === "true",
      ).length;
      expect(expandedCount).toBe(1);
    }
  });
});

describe("3. Slide 1 opens by default with no saved state", () => {
  it("with a fresh (cleared) localStorage, Slide 1's panel is open and Slides 2-5 are closed", () => {
    renderSlides(false);
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("true");
    for (const n of [2, 3, 4, 5]) {
      expect(getSlideHeader(container, n)?.getAttribute("aria-expanded")).toBe("false");
    }
    expect(getSlidePanel(container, 1)?.textContent).toContain("Slide 1 —");
  });
});

describe("4. Last-open slide persists and restores", () => {
  it("opening Slide 4, then remounting fresh, restores Slide 4 as open", () => {
    renderSlides(false, 4);
    expect(getSlideHeader(container, 4)?.getAttribute("aria-expanded")).toBe("true");

    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 4)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("persists under a topic-namespaced localStorage key", () => {
    renderSlides(false, 4);
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.openRecordId")).toBe(
      JSON.stringify({ version: 1, openSlideId: "ch01-t01-block-opening-4" }),
    );
  });
});

describe("5. Previous/Next opens the correct slide", () => {
  it("clicking Next from Slide 2 opens Slide 3", () => {
    renderSlides(false, 2);
    const panel = getSlidePanel(container, 2)!;
    const nextButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton).toBeTruthy();
    act(() => nextButton.click());
    expect(getSlideHeader(container, 3)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 2)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("clicking Previous from Slide 3 opens Slide 2", () => {
    renderSlides(false, 3);
    const panel = getSlidePanel(container, 3)!;
    const prevButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    act(() => prevButton.click());
    expect(getSlideHeader(container, 2)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("the pager shows 'Slide N of Total' text", () => {
    renderSlides(false, 3);
    const panel = getSlidePanel(container, 3)!;
    expect(panel.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      `Slide 3 of ${topic.slides.length}`,
    );
  });

  it("the Arabic pager shows the exact required labels", () => {
    renderSlides(true, 3);
    const panel = getSlidePanel(container, 3)!;
    const buttons = Array.from(panel.querySelectorAll("button")).map((b) => b.textContent);
    expect(buttons).toContain("الشريحة السابقة");
    expect(buttons).toContain("الشريحة التالية");
    expect(panel.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      `الشريحة 3 من ${topic.slides.length}`,
    );
  });
});

describe("6. Boundary buttons are disabled correctly", () => {
  const finalSlideNumber = topic.slides[topic.slides.length - 1].slideNumber;

  it("Previous is disabled on Slide 1", () => {
    renderSlides(false, 1);
    const panel = getSlidePanel(container, 1)!;
    const prevButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevButton.disabled).toBe(true);
  });

  it("Next is disabled on the final slide", () => {
    renderSlides(false, finalSlideNumber);
    const panel = getSlidePanel(container, finalSlideNumber)!;
    const nextButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
  });

  it("Next is enabled on Slide 1 and Previous is enabled on the final slide", () => {
    renderSlides(false, 1);
    const panel1 = getSlidePanel(container, 1)!;
    const next1 = Array.from(panel1.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(next1.disabled).toBe(false);

    openSlideByNumber(container, finalSlideNumber);
    const panelFinal = getSlidePanel(container, finalSlideNumber)!;
    const prevFinal = Array.from(panelFinal.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    expect(prevFinal.disabled).toBe(false);
  });
});

describe("7. Jump navigation opens the selected slide", () => {
  it("selecting Slide 5 from the jump <select> opens Slide 5", () => {
    renderSlides(false, 1);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    const slide5RecordId = topic.slides.find((s) => s.slideNumber === 5)!.recordId;
    act(() => {
      select.value = slide5RecordId;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");
  });

  it("the jump select has one option per slide", () => {
    renderSlides(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBe(topic.slides.length);
  });

  it("the jump select reflects the currently open slide's value", () => {
    renderSlides(false, 3);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.value).toBe(topic.slides.find((s) => s.slideNumber === 3)!.recordId);
  });
});

describe("8. Viewed count updates and persists", () => {
  const total = topic.slides.length;

  it(`starts at 'Slides viewed: 1 of ${total}' (Slide 1 open by default counts as viewed)`, () => {
    renderSlides(false);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `Slides viewed: 1 of ${total}`,
    );
  });

  it("opening Slides 2 and 3 increases the viewed count to 3", () => {
    renderSlides(false, 2);
    openSlideByNumber(container, 3);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `Slides viewed: 3 of ${total}`,
    );
  });

  it("re-opening an already-viewed slide does not double-count it", () => {
    renderSlides(false, 2);
    openSlideByNumber(container, 1);
    openSlideByNumber(container, 2);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `Slides viewed: 2 of ${total}`,
    );
  });

  it("the viewed count persists across a remount", () => {
    renderSlides(false, 2);
    openSlideByNumber(container, 4);
    remount();
    renderSlides(false);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `Slides viewed: 3 of ${total}`,
    );
  });

  it("persists under a topic-namespaced localStorage key, as a JSON array", () => {
    renderSlides(false, 2);
    const raw = window.localStorage.getItem("phsh111:ch01-t01.slides.viewedRecordIds");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.sort()).toEqual(
      ["ch01-t01-block-opening", "ch01-t01-block-opening-2"].sort(),
    );
  });

  it("the Arabic progress text matches the exact required wording", () => {
    renderSlides(true, 2);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `الشرائح المشاهدة: 2 من ${total}`,
    );
  });
});

describe("9. Focus moves correctly after navigation", () => {
  it("clicking Next moves keyboard focus to Slide 3's header", () => {
    renderSlides(false, 2);
    const panel = getSlidePanel(container, 2)!;
    const nextButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    act(() => nextButton.click());
    expect(document.activeElement).toBe(getSlideHeader(container, 3));
  });

  it("clicking Previous moves keyboard focus to Slide 1's header", () => {
    renderSlides(false, 2);
    const panel = getSlidePanel(container, 2)!;
    const prevButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    act(() => prevButton.click());
    expect(document.activeElement).toBe(getSlideHeader(container, 1));
  });

  it("selecting a slide from the jump navigator moves focus to its header", () => {
    renderSlides(false, 1);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    const slide4RecordId = topic.slides.find((s) => s.slideNumber === 4)!.recordId;
    act(() => {
      select.value = slide4RecordId;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(document.activeElement).toBe(getSlideHeader(container, 4));
  });
});

describe("10. aria-expanded and aria-controls are correct", () => {
  it("every header has aria-expanded reflecting its open state and aria-controls pointing to an existing panel id", () => {
    renderSlides(false, 2);
    for (const s of topic.slides) {
      const n = s.slideNumber;
      const header = getSlideHeader(container, n)!;
      const expanded = header.getAttribute("aria-expanded");
      expect(expanded).toBe(n === 2 ? "true" : "false");
      const controlsId = header.getAttribute("aria-controls");
      expect(controlsId).toBe(`slide-${n}-panel`);
      expect(document.getElementById(controlsId!)).not.toBeNull();
    }
  });

  it("each panel's role=\"region\" is labelled by its own header id", () => {
    renderSlides(false, 3);
    const panel = getSlidePanel(container, 3)!;
    expect(panel.getAttribute("role")).toBe("region");
    expect(panel.getAttribute("aria-labelledby")).toBe("slide-3-header");
  });

  it("headers are real <button> elements, not divs with click handlers", () => {
    renderSlides(false);
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.tagName).toBe("BUTTON");
    }
  });
});

describe("11. Arabic RTL layout works", () => {
  it("the Slides section renders dir=\"rtl\" content and the exact Arabic 'الشرائح' heading", () => {
    renderSlides(true, 1);
    expect(container.querySelector("h2#slides-heading")?.textContent).toBe("الشرائح");
    const rtlNode = container.querySelector('[dir="rtl"]');
    expect(rtlNode).toBeTruthy();
  });

  it("Arabic short titles render on the collapsed headers", () => {
    renderSlides(true);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    // Only the first five entries are asserted here — a later slide (e.g.
    // Slide 6, see src/tests/slide6AreaVolumeUnits.test.tsx) may
    // legitimately extend this list without breaking this test.
    expect(shortTitles.slice(0, 5)).toEqual([
      "الكميات الأساسية",
      "الطول والكتلة والزمن",
      "وحدات المسافة",
      "اختيار الوحدة المناسبة",
      "المساحة والحجم",
    ]);
  });

  it("the jump-navigator label is the exact Arabic wording", () => {
    renderSlides(true);
    expect(container.querySelector('label[for="slides-jump-select"]')?.textContent).toBe(
      "الانتقال إلى شريحة",
    );
  });
});

describe("12. A synthetic future slide is automatically supported, with zero new component logic", () => {
  // Deliberately a fully independent, from-scratch descriptor array (not
  // derived from the real topic.slides, which now genuinely has a
  // Slide 6 — see src/tests/slide6AreaVolumeUnits.test.tsx) so this test
  // stays a pure proof of the architecture's generality, unaffected by
  // however many real slides the topic accumulates over time.
  const SYNTHETIC_SLIDES: SlideDescriptor[] = [
    {
      recordId: "synthetic-slide-1",
      slideNumber: 1,
      title: { en: "Synthetic Slide One", ar: "الشريحة الاصطناعية الأولى" },
      content: <p>synthetic slide 1 body</p>,
    },
    {
      recordId: "synthetic-slide-2",
      slideNumber: 2,
      title: { en: "Synthetic Slide Two", ar: "الشريحة الاصطناعية الثانية" },
      content: <p>synthetic slide 2 body</p>,
    },
    {
      recordId: "synthetic-slide-3",
      slideNumber: 3,
      title: { en: "Synthetic Slide Three", ar: "الشريحة الاصطناعية الثالثة" },
      content: <p>synthetic slide 3 body</p>,
    },
  ];

  function renderSynthetic(arabic: boolean) {
    if (arabic) window.localStorage.setItem("phsh111:language", "ar");
    act(() => {
      root.render(
        <LanguageProvider>
          <SlidesSection topicId="synthetic-topic" slides={SYNTHETIC_SLIDES} />
        </LanguageProvider>,
      );
    });
  }

  it("renders 3 headers, numbered 1-3, with no code change to Slides.tsx", () => {
    renderSynthetic(false);
    const numbers = Array.from(container.querySelectorAll(".slide-accordion__number")).map(
      (el) => el.textContent,
    );
    expect(numbers).toEqual(["1", "2", "3"]);
  });

  it("Slide 2's Next button opens the synthetic Slide 3", () => {
    renderSynthetic(false);
    openSlideByNumber(container, 2);
    const panel2 = getSlidePanel(container, 2)!;
    const nextButton = Array.from(panel2.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(false);
    act(() => nextButton.click());
    expect(getSlideHeader(container, 3)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlidePanel(container, 3)?.textContent).toContain("Slide 3 — Synthetic Slide Three");
  });

  it("Slide 3 is the final slide — its Next button is disabled and the pager reads 'Slide 3 of 3'", () => {
    renderSynthetic(false);
    openSlideByNumber(container, 3);
    const panel3 = getSlidePanel(container, 3)!;
    const nextButton = Array.from(panel3.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    expect(nextButton.disabled).toBe(true);
    expect(panel3.querySelector(".slide-accordion__pager-progress")?.textContent).toBe(
      "Slide 3 of 3",
    );
  });

  it("the jump select offers 3 options and the viewed-progress denominator is 3", () => {
    renderSynthetic(false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    expect(select.options.length).toBe(3);
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      "Slides viewed: 1 of 3",
    );
  });

  it("each synthetic slide's short title falls back to its full title (no short-title metadata entry exists for a synthetic recordId)", () => {
    renderSynthetic(false);
    const shortTitles = Array.from(container.querySelectorAll(".slide-accordion__short-title")).map(
      (el) => el.textContent,
    );
    expect(shortTitles).toEqual(["Synthetic Slide One", "Synthetic Slide Two", "Synthetic Slide Three"]);
  });
});

describe("13. Slides 1-5's educational content remains unchanged", () => {
  it("each slide's original English quotation is intact when opened through the accordion", () => {
    renderSlides(false, 1);
    expect(getSlidePanel(container, 1)?.textContent).toContain(
      "In physics, there are three basic aspects of the material universe",
    );

    openSlideByNumber(container, 2);
    expect(getSlidePanel(container, 2)?.textContent).toContain(
      "Mostly all quantities can be classified in terms of the fundamental physical quantities:",
    );

    openSlideByNumber(container, 3);
    expect(getSlidePanel(container, 3)?.textContent).toContain(
      "Distance represents a measure of space in one dimension.",
    );

    openSlideByNumber(container, 4);
    expect(getSlidePanel(container, 4)?.textContent).toContain(
      "Why are there so many different units in each system?",
    );

    openSlideByNumber(container, 5);
    expect(getSlidePanel(container, 5)?.textContent).toContain(
      "Two other physical quantities that are closely related to distance are area and volume.",
    );
  });

  it("each slide's own equation/table/figure content is unaffected by the accordion refactor", () => {
    renderSlides(false, 1);
    expect(
      getSlidePanel(container, 1)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("v = d / t = 100 m / 5 s = 20 m/s");

    openSlideByNumber(container, 3);
    expect(getSlidePanel(container, 3)?.querySelector("table.structured-slide__table")).not.toBeNull();

    openSlideByNumber(container, 4);
    expect(getSlidePanel(container, 4)?.querySelector(".slide-figure__img")).not.toBeNull();

    openSlideByNumber(container, 5);
    expect(
      getSlidePanel(container, 5)?.querySelector(".structured-slide__equation-block")?.textContent,
    ).toBe("A = (4 m)(3 m) = 12 m²");
  });

  it("governance and publication flags are untouched by this presentation-only feature", () => {
    expect(topic.governance.studentFacingAllowed).toBe(false);
    expect(topic.governance.studentPublicationAuthorized).toBe(false);
    for (const slide of topic.slides) {
      expect(slide.blocking.studentFacingAllowed).toBe(false);
      expect(slide.blocking.blockingStatus).toBe("blocked");
    }
  });
});

// ---------------------------------------------------------------------
// Fully-collapsible accordion fix: a header can now close its own slide,
// not just switch to a different one — zero or one slide may be open,
// never more than one. Sections 14+ below.
// ---------------------------------------------------------------------

const OPEN_KEY = "phsh111:ch01-t01.slides.openRecordId";
const VIEWED_KEY = "phsh111:ch01-t01.slides.viewedRecordIds";

/** Persists an explicit "nothing open" (or a specific slide) state before mount, using the same versioned envelope Slides.tsx itself writes — never the literal string "null". */
function seedOpenState(openSlideId: string | null) {
  window.localStorage.setItem(OPEN_KEY, JSON.stringify({ version: 1, openSlideId }));
}

/**
 * Simulates real-browser `<button>` keyboard activation (Enter/Space
 * synthesize a `click`) inside jsdom, which — unlike a real browser —
 * does not implement this native "activation behavior" itself. Mirrors
 * this suite's existing jsdom-gap polyfill precedent (the `<dialog>`
 * showModal/close polyfill in slide4DifferentUnits.test.tsx): the
 * underlying component adds no custom key handling of its own (a plain
 * `<button type="button">` already gets this for free in every real
 * browser), so this helper exists purely to make that native behavior
 * observable under jsdom.
 */
function activateViaKeyboard(el: HTMLButtonElement, key: "Enter" | " ") {
  act(() => {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    el.click();
  });
}

describe("14. Toggling the currently open header closes it (fully collapsible accordion)", () => {
  it("1. no more than one slide can be open at once, including zero", () => {
    renderSlides(false);
    for (const s of topic.slides) {
      const expandedCount = topic.slides.filter(
        (m) => getSlideHeader(container, m.slideNumber)?.getAttribute("aria-expanded") === "true",
      ).length;
      expect(expandedCount).toBeLessThanOrEqual(1);
      openSlideByNumber(container, s.slideNumber);
    }
  });

  it("2. selecting a closed header opens it", () => {
    renderSlides(false, 1);
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("false");
    act(() => getSlideHeader(container, 6)!.click());
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlidePanel(container, 6)?.hidden).toBe(false);
  });

  it("3. selecting the same open header closes it", () => {
    renderSlides(false, 5);
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("true");
    act(() => getSlideHeader(container, 5)!.click());
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("false");
    expect(getSlidePanel(container, 5)?.hidden).toBe(true);
  });

  it("no other slide opens automatically when the open one is collapsed", () => {
    renderSlides(false, 5);
    act(() => getSlideHeader(container, 5)!.click());
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("4. after closing, all 13 headers have aria-expanded=\"false\"", () => {
    renderSlides(false, 9);
    expect(topic.slides.length).toBe(13);
    act(() => getSlideHeader(container, 9)!.click());
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("the associated panel is hidden (not just visually) after collapse", () => {
    renderSlides(false, 3);
    const panel = getSlidePanel(container, 3)!;
    expect(panel.hidden).toBe(false);
    act(() => getSlideHeader(container, 3)!.click());
    expect(panel.hidden).toBe(true);
    // The panel's instructional body is unmounted too, not merely hidden by CSS.
    expect(panel.querySelector(".slide__content")).toBeNull();
  });

  it("5. selecting another header switches the open slide (closes the previous, opens the new one)", () => {
    renderSlides(false, 2);
    act(() => getSlideHeader(container, 7)!.click());
    expect(getSlideHeader(container, 2)?.getAttribute("aria-expanded")).toBe("false");
    expect(getSlideHeader(container, 7)?.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("15. Keyboard activation (Enter and Space) toggles the header", () => {
  it("6. Enter toggles the selected header open, then Enter again closes it", () => {
    renderSlides(false, 1);
    const header = getSlideHeader(container, 4)!;
    expect(header.getAttribute("aria-expanded")).toBe("false");
    activateViaKeyboard(header, "Enter");
    expect(header.getAttribute("aria-expanded")).toBe("true");
    activateViaKeyboard(header, "Enter");
    expect(header.getAttribute("aria-expanded")).toBe("false");
  });

  it("7. Space toggles the selected header open, then Space again closes it", () => {
    renderSlides(false, 1);
    const header = getSlideHeader(container, 4)!;
    expect(header.getAttribute("aria-expanded")).toBe("false");
    activateViaKeyboard(header, " ");
    expect(header.getAttribute("aria-expanded")).toBe("true");
    activateViaKeyboard(header, " ");
    expect(header.getAttribute("aria-expanded")).toBe("false");
  });

  it("8. focus remains on the header after collapse", () => {
    renderSlides(false, 5);
    const header = getSlideHeader(container, 5)!;
    header.focus();
    expect(document.activeElement).toBe(header);
    act(() => header.click());
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(header);
  });

  it("headers remain semantic <button> elements — no non-button clickable wrapper was introduced", () => {
    renderSlides(false);
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.tagName).toBe("BUTTON");
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("type")).toBe("button");
    }
  });

  it("aria-controls still points to the correct panel id, and the panel carries a matching accessible identifier, after a collapse", () => {
    renderSlides(false, 3);
    act(() => getSlideHeader(container, 3)!.click());
    const header = getSlideHeader(container, 3)!;
    const panel = getSlidePanel(container, 3)!;
    expect(header.getAttribute("aria-controls")).toBe("slide-3-panel");
    expect(panel.id).toBe("slide-3-panel");
    expect(panel.getAttribute("aria-labelledby")).toBe("slide-3-header");
  });
});

describe("16. Viewed-progress is independent of open/closed state", () => {
  it("9. collapsing a slide does not remove its viewed status", () => {
    renderSlides(false, 3);
    expect(getSlideHeader(container, 3)?.querySelector(".slide-accordion__viewed-badge")).not.toBeNull();
    act(() => getSlideHeader(container, 3)!.click());
    expect(getSlideHeader(container, 3)?.getAttribute("aria-expanded")).toBe("false");
    expect(getSlideHeader(container, 3)?.querySelector(".slide-accordion__viewed-badge")).not.toBeNull();
  });

  it("collapsing the open slide does not change the viewed-progress count", () => {
    renderSlides(false, 3);
    openSlideByNumber(container, 6);
    const before = container.querySelector(".slides-section__progress")?.textContent;
    act(() => getSlideHeader(container, 6)!.click());
    const after = container.querySelector(".slides-section__progress")?.textContent;
    expect(after).toBe(before);
  });

  it("10. reopening a slide after collapsing it does not double-count it in viewed-progress", () => {
    renderSlides(false, 3);
    const total = topic.slides.length;
    // Slide 1 (default-open on mount) and Slide 3 (opened above) are both
    // already viewed at this point.
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `Slides viewed: 2 of ${total}`,
    );
    act(() => getSlideHeader(container, 3)!.click()); // close (already viewed)
    act(() => getSlideHeader(container, 3)!.click()); // reopen
    expect(container.querySelector(".slides-section__progress")?.textContent).toBe(
      `Slides viewed: 2 of ${total}`,
    );
  });
});

describe("17. Previous/Next/jump always open their target — never a toggle", () => {
  it("Next does not close the current slide when clicked (it opens a different slide, so toggle-equality never applies)", () => {
    renderSlides(false, 2);
    const panel = getSlidePanel(container, 2)!;
    const nextButton = Array.from(panel.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    act(() => nextButton.click());
    expect(getSlideHeader(container, 3)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("13. the jump selector opens its target starting from a fully-collapsed accordion (all slides collapsed on mount)", () => {
    seedOpenState(null);
    renderGenericSlides(root, topic, false);
    // Confirm the accordion actually mounted fully collapsed first.
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("aria-expanded")).toBe("false");
    }
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    const slide8RecordId = topic.slides.find((s) => s.slideNumber === 8)!.recordId;
    act(() => {
      select.value = slide8RecordId;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(getSlideHeader(container, 8)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("11/12. Next and Previous still correctly open their unconditional target in a session that began fully collapsed", () => {
    // Previous/Next buttons live inside their own slide's panel, so they
    // are only ever reachable in the DOM once that slide is open — a
    // literal "click Next while the DOM shows zero open panels" is not a
    // state a real user (or this test) can reach. What this fix must
    // guarantee instead — and what actually could have regressed by a
    // careless toggle implementation — is that Next/Previous keep
    // unconditionally opening their target (never toggle-closing) even in
    // a session whose accordion started fully collapsed, once the user
    // has opened anything at all via the always-available jump selector.
    seedOpenState(null);
    renderGenericSlides(root, topic, false);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    const slide5RecordId = topic.slides.find((s) => s.slideNumber === 5)!.recordId;
    act(() => {
      select.value = slide5RecordId;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("true");

    const panel5 = getSlidePanel(container, 5)!;
    const nextButton = Array.from(panel5.querySelectorAll("button")).find(
      (b) => b.textContent === "Next Slide",
    ) as HTMLButtonElement;
    act(() => nextButton.click());
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("false");

    const panel6 = getSlidePanel(container, 6)!;
    const prevButton = Array.from(panel6.querySelectorAll("button")).find(
      (b) => b.textContent === "Previous Slide",
    ) as HTMLButtonElement;
    act(() => prevButton.click());
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("true");
    expect(getSlideHeader(container, 6)?.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("18. Nullable persistence: closed state and open state both survive a reload", () => {
  it("14. if the user closes the active slide and reloads, all slides remain collapsed", () => {
    renderSlides(false, 1);
    act(() => getSlideHeader(container, 1)!.click());
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("false");

    remount();
    renderSlides(false);
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("15. if the user leaves a slide open and reloads, that slide reopens", () => {
    renderSlides(false, 9);
    remount();
    renderSlides(false);
    expect(getSlideHeader(container, 9)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("the persisted closed state is a real JSON envelope with openSlideId: null, never the literal text \"null\"", () => {
    renderSlides(false, 1);
    act(() => getSlideHeader(container, 1)!.click());
    const raw = window.localStorage.getItem(OPEN_KEY);
    expect(raw).not.toBe("null");
    expect(raw).toBe(JSON.stringify({ version: 1, openSlideId: null }));
    expect(JSON.parse(raw!)).toEqual({ version: 1, openSlideId: null });
  });

  it("16. an invalid/obsolete persisted slide id falls back to the default (Slide 1 open) instead of crashing", () => {
    window.localStorage.setItem(
      OPEN_KEY,
      JSON.stringify({ version: 1, openSlideId: "ch01-t01-block-opening-does-not-exist" }),
    );
    expect(() => renderGenericSlides(root, topic, false)).not.toThrow();
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("malformed (non-JSON) persisted state is handled safely and falls back to the default", () => {
    window.localStorage.setItem(OPEN_KEY, "not valid json {{{");
    expect(() => renderGenericSlides(root, topic, false)).not.toThrow();
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("a stale pre-fix raw-string value (the old persistence format) is handled safely and falls back to the default", () => {
    window.localStorage.setItem(OPEN_KEY, "ch01-t01-block-opening-4");
    expect(() => renderGenericSlides(root, topic, false)).not.toThrow();
    expect(getSlideHeader(container, 1)?.getAttribute("aria-expanded")).toBe("true");
  });

  it("the viewed-ids list is untouched by the open-state persistence change (still a plain JSON string array)", () => {
    renderSlides(false, 2);
    const raw = window.localStorage.getItem(VIEWED_KEY);
    expect(raw).toBeTruthy();
    expect(Array.isArray(JSON.parse(raw!))).toBe(true);
  });
});

describe("19. Arabic / RTL parity for the fully-collapsible accordion", () => {
  it("18. selecting the open header again collapses it in Arabic too, and no other header opens", () => {
    renderSlides(true, 5);
    expect(getSlideHeader(container, 5)?.getAttribute("aria-expanded")).toBe("true");
    act(() => getSlideHeader(container, 5)!.click());
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("the Arabic expand/collapse indicator text still reflects state correctly across a collapse", () => {
    renderSlides(true, 5);
    const header = getSlideHeader(container, 5)!;
    expect(header.textContent).toContain("طيّ"); // "Collapse", while open
    act(() => header.click());
    expect(header.textContent).toContain("توسيع"); // "Expand", once closed
  });

  it("collapsed state persists after a reload in Arabic too", () => {
    renderSlides(true, 5);
    act(() => getSlideHeader(container, 5)!.click());
    remount();
    renderSlides(true);
    for (const s of topic.slides) {
      expect(getSlideHeader(container, s.slideNumber)?.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("the jump selector opens its target from a fully-collapsed accordion in Arabic too", () => {
    seedOpenState(null);
    renderGenericSlides(root, topic, true);
    const select = container.querySelector<HTMLSelectElement>("#slides-jump-select")!;
    const slide13RecordId = topic.slides.find((s) => s.slideNumber === 13)!.recordId;
    act(() => {
      select.value = slide13RecordId;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(getSlideHeader(container, 13)?.getAttribute("aria-expanded")).toBe("true");
  });
});

describe("20. Slides 1-13 educational content and governance are unaffected by this UI-only fix", () => {
  it("17/19. Slide 1's original English text and Slide 13's equations still render correctly through a toggle-close/reopen cycle", () => {
    renderSlides(false, 1);
    expect(getSlidePanel(container, 1)?.textContent).toContain(
      "In physics, there are three basic aspects of the material universe",
    );
    act(() => getSlideHeader(container, 1)!.click()); // close
    act(() => getSlideHeader(container, 1)!.click()); // reopen
    expect(getSlidePanel(container, 1)?.textContent).toContain(
      "In physics, there are three basic aspects of the material universe",
    );

    openSlideByNumber(container, 13);
    expect(getSlidePanel(container, 13)?.textContent).toContain(
      "Weight, a quantity that is related to, but is not the same as mass, is used instead.",
    );
  });

  it("20. governance and blocking flags for every slide remain unchanged by this UI/state-management-only fix", () => {
    for (const slide of topic.slides) {
      expect(slide.blocking.studentFacingAllowed).toBe(false);
      expect(slide.blocking.blockingStatus).toBe("blocked");
    }
    expect(topic.governance.recordCount).toBe(20);
  });
});
