// @vitest-environment jsdom
//
// Tests for the single-slide learning reader (SlideReader/SlidesExperience),
// the new default replacement for the accordion-first Slides view. Uses
// the same jsdom + createRoot/act pattern as every other slide test file,
// plus a MemoryRouter (see testHelpers/slideReaderTestHelpers.tsx) since
// the reader deep-links the active slide via ?slide=N.
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { getTopic } from "../content/adapter";
import { LanguageProvider } from "../app/LanguageContext";
import { SlidesExperience } from "../features/topics/SlidesExperience";
import { renderSlidesExperience } from "./testHelpers/slideReaderTestHelpers";
import type { NormalizedTopic } from "../types/normalized";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  // jsdom does not implement scrollIntoView — see
  // slidesTestHelpers-adjacent test files' identical polyfill rationale
  // for HTMLDialogElement. A no-op is sufficient: the reader's own
  // navigator auto-scroll and section-nav scroll-to are exercised for
  // "was called", not for actual layout/scroll-position effects jsdom
  // cannot compute anyway.
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function () {};
  }
});

const topic = getTopic("ch01-t01") as NormalizedTopic;

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

function getFooterBtn(name: "prev" | "complete" | "next"): HTMLButtonElement {
  const btn = container.querySelector<HTMLButtonElement>(`.slide-reader-footer__btn--${name}`);
  if (!btn) throw new Error(`footer button "${name}" not found`);
  return btn;
}

function getSlideOfTotal(): string {
  return container.querySelector(".slide-reader__slide-of-total")?.textContent ?? "";
}

function getNavigatorEntries(): HTMLButtonElement[] {
  return Array.from(container.querySelectorAll<HTMLButtonElement>(".slide-navigator__entry"));
}

function click(el: Element | null) {
  if (!el) throw new Error("element not found for click");
  act(() => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function pressKey(key: string, target: EventTarget = window) {
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
  });
}

describe("Reader rendering", () => {
  it("renders exactly one active slide's content at a time", () => {
    renderSlidesExperience(root, topic);
    const contentSections = container.querySelectorAll(".slide-reader__content .structured-slide");
    expect(contentSections.length).toBe(1);
  });

  it("initial active slide is valid (defaults to Slide 1 with no URL param)", () => {
    renderSlidesExperience(root, topic);
    expect(getSlideOfTotal()).toBe("Slide 1 of 13");
  });

  it("an invalid slide number in the URL falls back safely to a valid slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=999"] });
    expect(getSlideOfTotal()).toBe("Slide 1 of 13");
  });

  it("a non-numeric slide param falls back safely", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=abc"] });
    expect(getSlideOfTotal()).toBe("Slide 1 of 13");
  });

  it("renders the topic title, current slide number, and total slide count", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=8"] });
    expect(container.querySelector(".slide-reader__topic-title")?.textContent).toBe("Fundamental Quantities");
    expect(getSlideOfTotal()).toBe("Slide 8 of 13");
  });

  it("opening a specific slide number via the URL opens exactly that slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    expect(getSlideOfTotal()).toBe("Slide 13 of 13");
    expect(container.querySelector(".slide-reader__slide-title")?.textContent).toContain("Mass and Weight");
  });
});

describe("Navigation", () => {
  it("Next opens the next slide", () => {
    renderSlidesExperience(root, topic);
    click(getFooterBtn("next"));
    expect(getSlideOfTotal()).toBe("Slide 2 of 13");
  });

  it("Previous opens the previous slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=5"] });
    click(getFooterBtn("prev"));
    expect(getSlideOfTotal()).toBe("Slide 4 of 13");
  });

  it("Previous is disabled on Slide 1 and does not wrap to the last slide", () => {
    renderSlidesExperience(root, topic);
    const prev = getFooterBtn("prev");
    expect(prev.disabled).toBe(true);
    click(prev);
    expect(getSlideOfTotal()).toBe("Slide 1 of 13");
  });

  it("Next is disabled on the final slide and does not wrap to the first slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    const next = getFooterBtn("next");
    expect(next.disabled).toBe(true);
    click(next);
    expect(getSlideOfTotal()).toBe("Slide 13 of 13");
  });

  it("ArrowRight navigates to the next slide, ArrowLeft navigates back", () => {
    renderSlidesExperience(root, topic);
    pressKey("ArrowRight");
    expect(getSlideOfTotal()).toBe("Slide 2 of 13");
    pressKey("ArrowRight");
    expect(getSlideOfTotal()).toBe("Slide 3 of 13");
    pressKey("ArrowLeft");
    expect(getSlideOfTotal()).toBe("Slide 2 of 13");
  });

  it("arrow keys do not navigate while focus is inside an input/textarea/select/contenteditable element", () => {
    renderSlidesExperience(root, topic);
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    pressKey("ArrowRight", input);
    expect(getSlideOfTotal()).toBe("Slide 1 of 13");
    input.remove();

    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    editable.tabIndex = 0;
    document.body.appendChild(editable);
    editable.focus();
    pressKey("ArrowRight", editable);
    expect(getSlideOfTotal()).toBe("Slide 1 of 13");
    editable.remove();
  });

  it("browser Back/Forward restores the previously active slide", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/topic",
          element: (
            <LanguageProvider>
              <SlidesExperience topic={topic} />
            </LanguageProvider>
          ),
        },
      ],
      { initialEntries: ["/topic?slide=1"] },
    );
    act(() => {
      root.render(<RouterProvider router={router} />);
    });

    click(getFooterBtn("next")); // -> slide 2
    click(getFooterBtn("next")); // -> slide 3
    expect(getSlideOfTotal()).toBe("Slide 3 of 13");

    act(() => {
      router.navigate(-1);
    });
    expect(getSlideOfTotal()).toBe("Slide 2 of 13");

    act(() => {
      router.navigate(1);
    });
    expect(getSlideOfTotal()).toBe("Slide 3 of 13");
  });
});

describe("Navigator", () => {
  it("the desktop sidebar lists every slide", () => {
    renderSlidesExperience(root, topic);
    const sidebarEntries = container.querySelectorAll(".slide-reader__sidebar .slide-navigator__entry");
    expect(sidebarEntries.length).toBe(13);
  });

  it("slides are grouped into the configured learning sections", () => {
    renderSlidesExperience(root, topic);
    const groupTitles = Array.from(
      container.querySelectorAll(".slide-reader__sidebar .slide-navigator__group-title"),
    ).map((el) => el.textContent);
    expect(groupTitles).toEqual(["Measurement and Length", "Time and Periodic Motion", "Mass, Inertia, and Weight"]);
  });

  it("the current slide's navigator entry carries aria-current", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=8"] });
    const entries = container.querySelectorAll(".slide-reader__sidebar .slide-navigator__entry");
    const current = Array.from(entries).find((el) => el.getAttribute("aria-current") === "true");
    expect(current?.textContent).toContain("Time Measurement");
  });

  it("clicking a navigator entry opens that slide", () => {
    renderSlidesExperience(root, topic);
    const entries = getNavigatorEntries();
    const slide9 = entries.find((el) => el.textContent?.includes("Period and Frequency"));
    click(slide9 ?? null);
    expect(getSlideOfTotal()).toBe("Slide 9 of 13");
  });

  it("the mobile drawer opens and closes", () => {
    renderSlidesExperience(root, topic);
    const trigger = container.querySelector<HTMLButtonElement>(".slide-navigator-drawer__trigger");
    expect(container.querySelector(".slide-navigator-drawer__panel")).toBeNull();
    click(trigger);
    expect(container.querySelector(".slide-navigator-drawer__panel")).not.toBeNull();
    const closeBtn = container.querySelector<HTMLButtonElement>(".slide-navigator-drawer__close");
    click(closeBtn);
    expect(container.querySelector(".slide-navigator-drawer__panel")).toBeNull();
  });

  it("Escape closes the mobile drawer", () => {
    renderSlidesExperience(root, topic);
    const trigger = container.querySelector<HTMLButtonElement>(".slide-navigator-drawer__trigger");
    click(trigger);
    expect(container.querySelector(".slide-navigator-drawer__panel")).not.toBeNull();
    pressKey("Escape", document);
    expect(container.querySelector(".slide-navigator-drawer__panel")).toBeNull();
  });
});

describe("Progress", () => {
  it("opening a slide marks it viewed", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    const stored = JSON.parse(window.localStorage.getItem("phsh111:ch01-t01.slides.learningState") ?? "{}");
    expect(stored.records["ch01-t01-block-opening-3"].viewedAt).toBeTypeOf("string");
  });

  it("opening a slide does not mark it completed", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    const stored = JSON.parse(window.localStorage.getItem("phsh111:ch01-t01.slides.learningState") ?? "{}");
    expect(stored.records["ch01-t01-block-opening-3"].completedAt).toBeUndefined();
    expect(getFooterBtn("complete").getAttribute("aria-pressed")).toBe("false");
  });

  it("Mark as Completed persists across a re-render (simulated reload)", () => {
    renderSlidesExperience(root, topic);
    click(getFooterBtn("complete"));
    expect(getFooterBtn("complete").getAttribute("aria-pressed")).toBe("true");

    act(() => root.unmount());
    container.remove();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    renderSlidesExperience(root, topic);

    expect(getFooterBtn("complete").getAttribute("aria-pressed")).toBe("true");
  });

  it("Mark as Incomplete reverses completion", () => {
    renderSlidesExperience(root, topic);
    click(getFooterBtn("complete"));
    expect(getFooterBtn("complete").getAttribute("aria-pressed")).toBe("true");
    click(getFooterBtn("complete"));
    expect(getFooterBtn("complete").getAttribute("aria-pressed")).toBe("false");
  });

  it("progress percentage reflects completed slides out of the total", () => {
    renderSlidesExperience(root, topic);
    const percentText = () => container.querySelector(".slide-progress-bar__label")?.textContent;
    expect(percentText()).toBe("0% complete");
    click(getFooterBtn("complete"));
    expect(percentText()).toBe("8% complete"); // 1 of 13, rounded
    click(getFooterBtn("next"));
    click(getFooterBtn("complete"));
    expect(percentText()).toBe("15% complete"); // 2 of 13, rounded
  });

  it("a pre-existing legacy 'viewedRecordIds' list migrates into viewed state without being cleared", () => {
    window.localStorage.setItem(
      "phsh111:ch01-t01.slides.viewedRecordIds",
      JSON.stringify(["ch01-t01-block-opening", "ch01-t01-block-opening-2"]),
    );
    renderSlidesExperience(root, topic);
    const entries = getNavigatorEntries();
    const slide1 = entries[0];
    const slide2 = entries[1];
    expect(slide1.querySelector(".slide-navigator__status")?.textContent).toBe("●");
    expect(slide2.querySelector(".slide-navigator__status")?.textContent).toBe("●");
    // Legacy key itself must survive untouched (never cleared).
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.viewedRecordIds")).not.toBeNull();
  });
});

describe("Study/Review mode", () => {
  it("Study Mode shows the full slide content, including Original English and Scientific Note", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    const text = container.querySelector(".slide-reader__content")?.textContent ?? "";
    expect(text).toContain("Original English");
    expect(text).toContain("Scientific Note");
  });

  it("Review Mode shows a compact subset (Main Idea/Key Concept) and omits Original English", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    click(container.querySelector('.slide-view-mode-toggle__btn[aria-pressed="false"]'));
    const text = container.querySelector(".slide-reader__content")?.textContent ?? "";
    expect(text).toContain("Main Idea");
    expect(text).not.toContain("Original English");
    expect(text).not.toContain("Scientific Note");
  });

  it("switching modes does not mutate the underlying slide content (Study Mode still renders identically afterward)", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    const before = container.querySelector(".slide-reader__content")?.textContent;
    click(container.querySelector('.slide-view-mode-toggle__btn[aria-pressed="false"]')); // -> review
    click(container.querySelector('.slide-view-mode-toggle__btn[aria-pressed="false"]')); // -> study
    const after = container.querySelector(".slide-reader__content")?.textContent;
    expect(after).toBe(before);
  });

  it("the selected display mode persists across a re-render (simulated reload)", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    click(container.querySelector('.slide-view-mode-toggle__btn[aria-pressed="false"]')); // -> review
    expect(window.localStorage.getItem("phsh111:ch01-t01.reader.mode")).toBe("review");

    act(() => root.unmount());
    container.remove();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });

    const reviewBtn = container.querySelector('.slide-view-mode-toggle__btn[aria-pressed="true"]');
    expect(reviewBtn?.textContent).toBe("Review");
  });
});

describe("Section navigation", () => {
  it("only sections that actually exist on the current slide appear in the section bar", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=1"] });
    const labels = Array.from(container.querySelectorAll(".slide-section-nav__btn")).map((el) => el.textContent);
    // Slide 1 has no Key Concept subsection (see StructuredSlideContent's config) — must not appear.
    expect(labels).not.toContain("Key Concept");
    expect(labels).toContain("Main Idea");
  });

  it("a slide with a Key Concept subsection shows it in the section bar", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    const labels = Array.from(container.querySelectorAll(".slide-section-nav__btn")).map((el) => el.textContent);
    expect(labels).toContain("Key Concept");
  });

  it("clicking a section entry scrolls that section into view", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    let called = false;
    const target = container.querySelector<HTMLElement>("#ch01-t01-block-opening-13--key-concept");
    if (target) target.scrollIntoView = () => { called = true; };
    const entry = Array.from(container.querySelectorAll(".slide-section-nav__btn")).find(
      (el) => el.textContent === "Key Concept",
    );
    click(entry ?? null);
    expect(called).toBe(true);
  });

  it("section labels render in Arabic when the language is Arabic", () => {
    renderSlidesExperience(root, topic, { arabic: true, initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    const labels = Array.from(container.querySelectorAll(".slide-section-nav__btn")).map((el) => el.textContent);
    expect(labels).toContain("المفهوم الأساسي");
  });
});

describe("View All Slides (existing accordion) compatibility", () => {
  it("the existing accordion remains available via 'View All Slides'", () => {
    renderSlidesExperience(root, topic);
    click(container.querySelector(".slide-reader__view-all-btn"));
    expect(container.querySelector(".slides-section")).not.toBeNull();
    expect(container.querySelectorAll(".slide-accordion__header").length).toBe(13);
  });

  it("the accordion retains its fully collapsible single-open behavior in this mode", () => {
    renderSlidesExperience(root, topic);
    click(container.querySelector(".slide-reader__view-all-btn"));
    const header1 = container.querySelector<HTMLButtonElement>("#slide-1-header");
    const header2 = container.querySelector<HTMLButtonElement>("#slide-2-header");
    click(header2);
    expect(header1?.getAttribute("aria-expanded")).toBe("false");
    expect(header2?.getAttribute("aria-expanded")).toBe("true");
    click(header2); // closing the open one leaves zero open — the accordion's existing fix
    expect(header2?.getAttribute("aria-expanded")).toBe("false");
  });

  it("returning to the reader preserves the active slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=7"] });
    click(container.querySelector(".slide-reader__view-all-btn"));
    expect(container.querySelector("#slide-7-panel")).not.toBeNull();
    click(container.querySelector(".slides-experience__return-to-reader"));
    expect(getSlideOfTotal()).toBe("Slide 7 of 13");
  });

  it("the preferred view (reader vs. all slides) persists across a re-render (simulated reload)", () => {
    renderSlidesExperience(root, topic);
    click(container.querySelector(".slide-reader__view-all-btn"));
    expect(window.localStorage.getItem("phsh111:ch01-t01.slides.viewMode")).toBe("all");

    act(() => root.unmount());
    container.remove();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    renderSlidesExperience(root, topic);

    expect(container.querySelector(".slides-section")).not.toBeNull();
    expect(container.querySelector(".slide-reader")).toBeNull();
  });

  it("new visitors (no stored preference) default to the reader, not the accordion", () => {
    renderSlidesExperience(root, topic);
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();
  });
});

describe("View All Slides — return-to-reader active-slide handoff (regression)", () => {
  // These tests need the current URL's search string (router.state.location.search),
  // which a plain MemoryRouter doesn't expose to test code — createMemoryRouter does.
  function renderWithRouter(initialEntries: string[]) {
    const router = createMemoryRouter(
      [
        {
          path: "/topic",
          element: (
            <LanguageProvider>
              <SlidesExperience topic={topic} />
            </LanguageProvider>
          ),
        },
      ],
      { initialEntries },
    );
    act(() => {
      root.render(<RouterProvider router={router} />);
    });
    return router;
  }

  function openAccordionSlide(slideNumber: number) {
    const header = container.querySelector<HTMLButtonElement>(`#slide-${slideNumber}-header`);
    if (!header) throw new Error(`accordion header for slide ${slideNumber} not found`);
    click(header);
    expect(header.getAttribute("aria-expanded")).toBe("true");
  }

  it("reproduces and fixes the stale-query scenario: reader Slide 3 -> View All Slides -> open Slide 7 -> return shows Slide 7, not stale Slide 3", () => {
    const router = renderWithRouter(["/topic?slide=3"]);
    expect(getSlideOfTotal()).toBe("Slide 3 of 13");

    click(container.querySelector(".slide-reader__view-all-btn"));
    openAccordionSlide(7);

    click(container.querySelector(".slides-experience__return-to-reader"));

    expect(getSlideOfTotal()).toBe("Slide 7 of 13");
    expect(getSlideOfTotal()).not.toBe("Slide 3 of 13");
    expect(router.state.location.search).toBe("?slide=7");
  });

  it("preserves unrelated query parameters while correcting the slide param", () => {
    const router = renderWithRouter(["/topic?debug=1&slide=3"]);
    click(container.querySelector(".slide-reader__view-all-btn"));
    openAccordionSlide(7);
    click(container.querySelector(".slides-experience__return-to-reader"));

    const params = new URLSearchParams(router.state.location.search);
    expect(params.get("debug")).toBe("1");
    expect(params.get("slide")).toBe("7");
  });

  it("an invalid persisted accordion openRecordId does not generate ?slide=undefined or ?slide=NaN", () => {
    const router = renderWithRouter(["/topic?slide=3"]);
    click(container.querySelector(".slide-reader__view-all-btn"));
    // Simulate a stale/invalid persisted value (e.g. content regenerated,
    // record id no longer exists) rather than a real accordion selection.
    window.localStorage.setItem(
      "phsh111:ch01-t01.slides.openRecordId",
      JSON.stringify({ version: 1, openSlideId: "not-a-real-record-id" }),
    );
    click(container.querySelector(".slides-experience__return-to-reader"));

    const params = new URLSearchParams(router.state.location.search);
    expect(params.get("slide")).not.toBe("undefined");
    expect(params.get("slide")).not.toBe("NaN");
    // Falls back safely through SlideReader's own existing logic rather than crashing or showing nothing.
    expect(getSlideOfTotal()).toMatch(/^Slide \d+ of 13$/);
  });

  it("returning without opening a different accordion slide preserves the expected current slide", () => {
    const router = renderWithRouter(["/topic?slide=5"]);
    click(container.querySelector(".slide-reader__view-all-btn"));
    click(container.querySelector(".slides-experience__return-to-reader"));

    expect(getSlideOfTotal()).toBe("Slide 5 of 13");
    expect(router.state.location.search).toBe("?slide=5");
  });

  it("browser Back/Forward remains coherent after a View All Slides round trip", () => {
    const router = renderWithRouter(["/topic?slide=3"]);
    click(container.querySelector(".slide-reader__view-all-btn"));
    openAccordionSlide(7);
    click(container.querySelector(".slides-experience__return-to-reader"));
    expect(getSlideOfTotal()).toBe("Slide 7 of 13");

    click(getFooterBtn("next")); // -> Slide 8, a real pushed navigation
    expect(getSlideOfTotal()).toBe("Slide 8 of 13");

    act(() => {
      router.navigate(-1);
    });
    expect(getSlideOfTotal()).toBe("Slide 7 of 13");

    act(() => {
      router.navigate(1);
    });
    expect(getSlideOfTotal()).toBe("Slide 8 of 13");
  });
});

describe("Reader-label regression — position/slideNumber consistency (PR A, requirement 5)", () => {
  it("34. displays the correct current position and total for a mid-deck slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    expect(getSlideOfTotal()).toBe("Slide 3 of 13");
  });

  it("35. the Arabic label renders using the correct localized position/total format", () => {
    renderSlidesExperience(root, topic, { arabic: true, initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    expect(getSlideOfTotal()).toBe("الشريحة 3 من 13");
  });

  it("36. deep linking still uses the actual slideNumber, not a positional index, in the URL", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/topic",
          element: (
            <LanguageProvider>
              <SlidesExperience topic={topic} />
            </LanguageProvider>
          ),
        },
      ],
      { initialEntries: ["/topic?slide=8"] },
    );
    act(() => {
      root.render(<RouterProvider router={router} />);
    });
    expect(getSlideOfTotal()).toBe("Slide 8 of 13");
    expect(router.state.location.search).toBe("?slide=8");
  });

  it("37. Previous/Next remain array-index based and stay consistent with the displayed position", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=1"] });
    click(getFooterBtn("next"));
    expect(getSlideOfTotal()).toBe("Slide 2 of 13");
    click(getFooterBtn("next"));
    expect(getSlideOfTotal()).toBe("Slide 3 of 13");
    click(getFooterBtn("prev"));
    expect(getSlideOfTotal()).toBe("Slide 2 of 13");
  });

  it("38. the accordion's own slide count and pager text remain unchanged (still positional, byte-for-byte as before this PR)", () => {
    renderSlidesExperience(root, topic);
    click(container.querySelector(".slide-reader__view-all-btn"));
    expect(container.querySelectorAll(".slide-accordion__header").length).toBe(13);
    const header3 = container.querySelector<HTMLButtonElement>("#slide-3-header");
    click(header3);
    const pagerProgress = container.querySelector("#slide-3-panel .slide-accordion__pager-progress");
    expect(pagerProgress?.textContent).toBe("Slide 3 of 13");
  });
});

describe("Regression — untouched content and governance", () => {
  it("Slide 8's Arabic counting-cycles correction (F-01) remains present", () => {
    renderSlidesExperience(root, topic, { arabic: true, initialEntries: ["/chapter/1/topic/ch01-t01?slide=8"] });
    const text = container.querySelector(".slide-reader__content")?.textContent ?? "";
    expect(text).toContain("من خلال عدّ الدورات المنتظمة المتكررة");
  });

  it("Slide 13's F-02 constant-velocity/friction clarification remains present", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    const text = container.querySelector(".slide-reader__content")?.textContent ?? "";
    expect(text).toContain("At a constant pulling speed, the net horizontal force is zero");
  });

  it("Slide 13's figure and equations still render in the reader", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    expect(container.querySelectorAll(".slide-reader__content img").length).toBe(1);
    const text = container.querySelector(".slide-reader__content")?.textContent ?? "";
    expect(text).toContain("W = m g");
    expect(text).toContain("196 N");
  });

  it("rendering the reader does not mutate the underlying topic data object", () => {
    const before = JSON.stringify(topic);
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=13"] });
    click(getFooterBtn("complete"));
    click(getFooterBtn("next"));
    expect(JSON.stringify(topic)).toBe(before);
  });
});

// ===========================================================================
// PR B — Review Mode Completeness: section-navigation regression.
// ===========================================================================

function toggleToReview() {
  click(container.querySelector('.slide-view-mode-toggle__btn[aria-pressed="false"]'));
}

function navLabels(): (string | null)[] {
  return Array.from(container.querySelectorAll(".slide-section-nav__btn")).map((el) => el.textContent);
}

describe("Review Mode section navigation", () => {
  it("Review Mode nav for Slide 9 (definitions + Definition Explanation, no table/figure) includes exactly the sections that are present", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=9"] });
    toggleToReview();
    const labels = navLabels();
    expect(labels).toContain("Main Idea");
    expect(labels).toContain("Definitions");
    expect(labels).toContain("Key Concept");
    expect(labels).toContain("Simple Example");
    expect(labels).toContain("Definition Explanation");
    expect(labels).not.toContain("Table");
    expect(labels).not.toContain("Table Explanation");
    expect(labels).not.toContain("Figure");
    expect(labels).not.toContain("Figure Explanation");
    expect(labels).not.toContain("Conversion-Factor Explanation");
    expect(labels).not.toContain("Relationship Explanation");
  });

  it("Review Mode nav for Slide 3 (table + Table Explanation, no definitions/figure) includes Table and Table Explanation only", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    toggleToReview();
    const labels = navLabels();
    expect(labels).toContain("Table");
    expect(labels).toContain("Table Explanation");
    expect(labels).not.toContain("Definitions");
    expect(labels).not.toContain("Figure");
    expect(labels).not.toContain("Figure Explanation");
  });

  it("Review Mode nav for Slide 4 (figure + Figure Explanation) includes Figure and Figure Explanation only", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=4"] });
    toggleToReview();
    const labels = navLabels();
    expect(labels).toContain("Figure");
    expect(labels).toContain("Figure Explanation");
    expect(labels).not.toContain("Table");
    expect(labels).not.toContain("Definitions");
  });

  it("Review Mode nav has no empty entries — every entry corresponds to a real, non-empty rendered section", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=9"] });
    toggleToReview();
    const labels = navLabels();
    expect(labels.every((l) => !!l && l.trim().length > 0)).toBe(true);
    const ids = new Set(Array.from(container.querySelectorAll(".structured-slide__section[id]")).map((el) => el.id));
    expect(ids.size).toBeGreaterThan(0);
  });

  it("Review Mode section IDs remain unique", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=9"] });
    toggleToReview();
    const ids = Array.from(container.querySelectorAll(".structured-slide__section[id]")).map((el) => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("switching Study -> Review on Slide 9 refreshes the nav: 'Original English' drops out, 'Definitions' appears", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=9"] });
    const studyLabels = navLabels();
    expect(studyLabels).toContain("Original English");
    expect(studyLabels).not.toContain("Definitions");

    toggleToReview();
    const reviewLabels = navLabels();
    expect(reviewLabels).not.toContain("Original English");
    expect(reviewLabels).toContain("Definitions");
  });

  it("Arabic labels are correct for the newly added Review Mode sections (Slide 9)", () => {
    renderSlidesExperience(root, topic, { arabic: true, initialEntries: ["/chapter/1/topic/ch01-t01?slide=9"] });
    toggleToReview();
    const labels = navLabels();
    expect(labels).toContain("التعريفات");
    expect(labels).toContain("شرح التعريف");
    expect(labels).toContain("المفهوم الأساسي");
  });

  it("Arabic labels are correct for Table/Table Explanation (Slide 3)", () => {
    renderSlidesExperience(root, topic, { arabic: true, initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    toggleToReview();
    const labels = navLabels();
    expect(labels).toContain("الجدول");
    expect(labels).toContain("شرح الجدول");
  });

  it("clicking the 'Definitions' nav entry scrolls that section into view (Slide 9)", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=9"] });
    toggleToReview();
    let called = false;
    const target = container.querySelector<HTMLElement>("#ch01-t01-block-opening-9--definitions");
    if (target) target.scrollIntoView = () => { called = true; };
    const entry = Array.from(container.querySelectorAll(".slide-section-nav__btn")).find(
      (el) => el.textContent === "Definitions",
    );
    click(entry ?? null);
    expect(called).toBe(true);
  });

  it("clicking the 'Table Explanation' nav entry scrolls that section into view (Slide 3)", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t01?slide=3"] });
    toggleToReview();
    let called = false;
    const target = container.querySelector<HTMLElement>("#ch01-t01-block-opening-3--table-explanation");
    if (target) target.scrollIntoView = () => { called = true; };
    const entry = Array.from(container.querySelectorAll(".slide-section-nav__btn")).find(
      (el) => el.textContent === "Table Explanation",
    );
    click(entry ?? null);
    expect(called).toBe(true);
  });
});
