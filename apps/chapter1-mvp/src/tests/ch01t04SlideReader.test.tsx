// @vitest-environment jsdom
//
// Slide Reader / accordion verification for ch01-t04's 9 new slides
// (PR F). Reuses SlidesExperience and the same MemoryRouter/createMemoryRouter
// helpers as slideReader.test.tsx — no new reader code, no per-topic
// branch — proving the generic Reader, drawer, and accordion machinery
// works for a fourth slide-bearing topic with zero component changes.
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
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function () {};
  }
});

const topic = getTopic("ch01-t04") as NormalizedTopic;

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

describe("ch01-t04 — Slide Reader and accordion (PR F)", () => {
  it("the reader lists all 9 slides via the navigator", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04"] });
    expect(getNavigatorEntries()).toHaveLength(9);
    expect(getSlideOfTotal()).toBe("Slide 1 of 9");
  });

  it("View All Slides (the accordion/drawer) lists all 9 slides", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04"] });
    click(container.querySelector(".slide-reader__view-all-btn"));
    expect(container.querySelectorAll(".slide-accordion__header")).toHaveLength(9);
  });

  it("a direct ?slide=N deep link opens exactly the requested slide", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04?slide=7"] });
    expect(getSlideOfTotal()).toBe("Slide 7 of 9");
    expect(container.querySelector(".slide-reader__slide-title")?.textContent).toContain("Moon");
  });

  it("an invalid ?slide= falls back safely to Slide 1 (Slide 999 does not exist among the 9)", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04?slide=999"] });
    expect(getSlideOfTotal()).toBe("Slide 1 of 9");
  });

  it("a non-numeric ?slide= falls back safely", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04?slide=abc"] });
    expect(getSlideOfTotal()).toBe("Slide 1 of 9");
  });

  it("Previous/Next traverse the full 9-slide sequence, first to last, without wrapping", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04"] });
    expect(getFooterBtn("prev").disabled).toBe(true);
    for (let n = 2; n <= 9; n++) {
      click(getFooterBtn("next"));
      expect(getSlideOfTotal()).toBe(`Slide ${n} of 9`);
    }
    expect(getFooterBtn("next").disabled).toBe(true);
    for (let n = 8; n >= 1; n--) {
      click(getFooterBtn("prev"));
      expect(getSlideOfTotal()).toBe(`Slide ${n} of 9`);
    }
  });

  it("reader -> View All Slides -> accordion handoff preserves the active slide, already expanded", () => {
    const router = renderWithRouter(["/topic?slide=4"]);
    expect(getSlideOfTotal()).toBe("Slide 4 of 9");
    click(container.querySelector(".slide-reader__view-all-btn"));
    const header4 = container.querySelector<HTMLButtonElement>("#slide-4-header");
    expect(header4).toBeTruthy();
    expect(header4?.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector("#slide-4-panel .slide-accordion__pager-progress")?.textContent).toBe(
      "Slide 4 of 9",
    );
    expect(router.state.location.search).toBe("?slide=4");
  });

  it("accordion -> reader handoff (return-to-reader) preserves the slide opened in the accordion, not the prior reader slide", () => {
    const router = renderWithRouter(["/topic?slide=1"]);
    click(container.querySelector(".slide-reader__view-all-btn"));
    openAccordionSlide(7);
    click(container.querySelector(".slides-experience__return-to-reader"));
    expect(getSlideOfTotal()).toBe("Slide 7 of 9");
    expect(router.state.location.search).toBe("?slide=7");
  });

  it("the drawer/navigator exposes each slide's short title, distinct from the full slide title", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04"] });
    const labels = getNavigatorEntries().map((el) => el.textContent ?? "");
    expect(labels.some((l) => l.includes("Push versus Lift"))).toBe(true);
    expect(labels.some((l) => l.includes("What Is Mass?"))).toBe(true);
    const fullTitle1 = topic.slides.find((s) => s.slideNumber === 1)?.title.en ?? "";
    expect(labels.some((l) => l === fullTitle1)).toBe(false);
  });

  it("the navigator groups slides into the 4 configured groups", () => {
    renderSlidesExperience(root, topic, { initialEntries: ["/chapter/1/topic/ch01-t04"] });
    const groupHeadings = Array.from(container.querySelectorAll(".slide-navigator__group-title")).map(
      (el) => el.textContent,
    );
    expect(groupHeadings).toHaveLength(4);
  });

  it("Arabic reader renders the topic title and localized slide-of-total label", () => {
    renderSlidesExperience(root, topic, { arabic: true, initialEntries: ["/chapter/1/topic/ch01-t04?slide=3"] });
    expect(getSlideOfTotal()).toBe("الشريحة 3 من 9");
  });
});
