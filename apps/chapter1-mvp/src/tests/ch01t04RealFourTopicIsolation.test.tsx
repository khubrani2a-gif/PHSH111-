// @vitest-environment jsdom
//
// Real four-topic progress isolation for PR F — extends
// ch01t03RealThreeTopicIsolation.test.tsx's three-real-topic pattern (PR E)
// to all four now-real slide-bearing topics: ch01-t01, ch01-t02, ch01-t03,
// and ch01-t04. No new progress code, no per-topic branch — same
// SlidesExperience component, same canonical slideProgress.ts storage,
// reused verbatim across four real topics simultaneously.
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, RouterProvider, useParams } from "react-router-dom";
import { LanguageProvider } from "../app/LanguageContext";
import { getTopic } from "../content/adapter";
import { SlidesExperience } from "../features/topics/SlidesExperience";
import type { NormalizedTopic } from "../types/normalized";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function () {};
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

const T01 = getTopic("ch01-t01") as NormalizedTopic;
const T02 = getTopic("ch01-t02") as NormalizedTopic;
const T03 = getTopic("ch01-t03") as NormalizedTopic;
const T04 = getTopic("ch01-t04") as NormalizedTopic;
const TOPICS_BY_ID: Record<string, NormalizedTopic> = {
  [T01.topicId]: T01,
  [T02.topicId]: T02,
  [T03.topicId]: T03,
  [T04.topicId]: T04,
};

/** Mirrors TopicPage.tsx's real useParams()-driven lookup — same component instance, changing :topicId param, across all four real topics. */
function RealTopicRoute() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? TOPICS_BY_ID[topicId] : undefined;
  if (!topic) return null;
  return <SlidesExperience topic={topic} />;
}

function renderAt(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: "/topic/:topicId",
        element: (
          <LanguageProvider>
            <RealTopicRoute />
          </LanguageProvider>
        ),
      },
    ],
    { initialEntries: [initialPath] },
  );
  act(() => {
    root.render(<RouterProvider router={router} />);
  });
  return router;
}

function navigateTo(router: ReturnType<typeof createMemoryRouter>, path: string) {
  act(() => {
    router.navigate(path);
  });
}

function readCanonical(topicId: string) {
  const raw = window.localStorage.getItem(`phsh111:${topicId}.slides.learningState`);
  return raw
    ? (JSON.parse(raw) as { version: number; records: Record<string, { viewedAt?: string; completedAt?: string }> })
    : null;
}

function markComplete() {
  act(() => {
    container
      .querySelector<HTMLButtonElement>(".slide-reader-footer__btn--complete")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function clickNext() {
  act(() => {
    container
      .querySelector<HTMLButtonElement>(".slide-reader-footer__btn--next")
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function clickViewAllSlides() {
  act(() => {
    container.querySelector<HTMLButtonElement>(".slide-reader__view-all-btn")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function getSlideOfTotal(): string {
  return container.querySelector(".slide-reader__slide-of-total")?.textContent ?? "";
}

describe("Real four-topic isolation — ch01-t01, ch01-t02, ch01-t03, ch01-t04 (PR F)", () => {
  it("52. opening ch01-t04's first slide marks it Viewed; no progress exists yet for ch01-t01/ch01-t02/ch01-t03", () => {
    renderAt("/topic/ch01-t04");
    const state04 = readCanonical("ch01-t04");
    expect(state04?.records[T04.slides[0].recordId].viewedAt).toBeTypeOf("string");
    expect(readCanonical("ch01-t01")).toBeNull();
    expect(readCanonical("ch01-t02")).toBeNull();
    expect(readCanonical("ch01-t03")).toBeNull();
  });

  it("53. unopened ch01-t04 slides remain unseen after opening only Slide 1", () => {
    renderAt("/topic/ch01-t04");
    const state04 = readCanonical("ch01-t04");
    expect(state04?.records[T04.slides[1].recordId]).toBeUndefined();
  });

  it("54-55. mark one slide Completed in each of ch01-t01/ch01-t02/ch01-t03, then open ch01-t04 — confirm no completion leaks", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    const t01StateBefore = readCanonical("ch01-t01");
    expect(t01StateBefore?.records[T01.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    const t02StateBefore = readCanonical("ch01-t02");
    expect(t02StateBefore?.records[T02.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t03");
    markComplete();
    const t03StateBefore = readCanonical("ch01-t03");
    expect(t03StateBefore?.records[T03.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t04");

    expect(container.querySelector(".slide-navigator__status--completed")).toBeNull();
    const state04 = readCanonical("ch01-t04");
    for (const slide of T04.slides) {
      expect(state04?.records[slide.recordId]?.completedAt).toBeUndefined();
    }
    // ch01-t01/ch01-t02/ch01-t03's own canonical storage remain untouched by opening ch01-t04.
    expect(readCanonical("ch01-t01")).toEqual(t01StateBefore);
    expect(readCanonical("ch01-t02")).toEqual(t02StateBefore);
    expect(readCanonical("ch01-t03")).toEqual(t03StateBefore);
  });

  it("56-57. mark a DIFFERENT slide Completed in each of the four topics — each restores only its own state", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete(); // ch01-t01 Slide 1
    const t01State = readCanonical("ch01-t01");

    navigateTo(router, "/topic/ch01-t02");
    clickNext();
    markComplete(); // ch01-t02 Slide 2
    const t02State = readCanonical("ch01-t02");
    expect(t02State?.records[T02.slides[1].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t03");
    clickNext();
    clickNext();
    markComplete(); // ch01-t03 Slide 3
    const t03State = readCanonical("ch01-t03");
    expect(t03State?.records[T03.slides[2].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t04");
    clickNext();
    clickNext();
    clickNext();
    markComplete(); // ch01-t04 Slide 4 — a distinct topic and slide from the other three
    const t04State = readCanonical("ch01-t04");
    expect(t04State?.records[T04.slides[3].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t01");
    expect(readCanonical("ch01-t01")).toEqual(t01State);
    expect(getSlideOfTotal()).toBe(`Slide 1 of ${T01.slides.length}`);
    expect(container.querySelector(".slide-navigator__entry")?.querySelector(".slide-navigator__status")?.textContent).toBe("✓");

    navigateTo(router, "/topic/ch01-t02");
    expect(readCanonical("ch01-t02")).toEqual(t02State);

    navigateTo(router, "/topic/ch01-t03");
    expect(readCanonical("ch01-t03")).toEqual(t03State);

    navigateTo(router, "/topic/ch01-t04");
    expect(readCanonical("ch01-t04")).toEqual(t04State);
    expect(getSlideOfTotal()).toBe(`Slide 4 of ${T04.slides.length}`);
  });

  it("58. no write pairs any topic's topicId with another topic's record ID", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    navigateTo(router, "/topic/ch01-t03");
    markComplete();
    navigateTo(router, "/topic/ch01-t04");
    markComplete();

    const idsByTopic = {
      "ch01-t01": new Set(T01.slides.map((s) => s.recordId)),
      "ch01-t02": new Set(T02.slides.map((s) => s.recordId)),
      "ch01-t03": new Set(T03.slides.map((s) => s.recordId)),
      "ch01-t04": new Set(T04.slides.map((s) => s.recordId)),
    };
    for (const [topicId, ownIds] of Object.entries(idsByTopic)) {
      const state = readCanonical(topicId)!;
      for (const key of Object.keys(state.records)) {
        expect(ownIds.has(key), `${topicId} record ${key} should belong to ${topicId}`).toBe(true);
        for (const [otherTopicId, otherIds] of Object.entries(idsByTopic)) {
          if (otherTopicId === topicId) continue;
          expect(otherIds.has(key), `${topicId}'s record ${key} should not belong to ${otherTopicId}`).toBe(false);
        }
      }
    }
  });

  it("59. viewMode is restored independently per topic across all four", () => {
    const router = renderAt("/topic/ch01-t04");
    clickViewAllSlides();
    expect(window.localStorage.getItem("phsh111:ch01-t04.slides.viewMode")).toBe("all");

    navigateTo(router, "/topic/ch01-t01");
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t02");
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t03");
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t04");
    expect(container.querySelector(".slides-section")).not.toBeNull(); // ch01-t04's own "all" preference restored
  });

  it("60. openRecordId is restored independently per topic", () => {
    const router = renderAt("/topic/ch01-t04");
    clickViewAllSlides();
    const header3 = container.querySelector<HTMLButtonElement>("#slide-3-header");
    act(() => header3?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(JSON.parse(window.localStorage.getItem("phsh111:ch01-t04.slides.openRecordId")!).openSlideId).toBe(
      T04.slides[2].recordId,
    );

    navigateTo(router, "/topic/ch01-t03");
    clickViewAllSlides();
    // ch01-t03 has no stored openRecordId yet — defaults to its own first slide.
    const t03header1 = container.querySelector<HTMLButtonElement>("#slide-1-header");
    expect(t03header1?.getAttribute("aria-expanded")).toBe("true");
  });

  it("61. last-opened slide number (reader.lastSlideNumber) is restored independently per topic", () => {
    const router = renderAt("/topic/ch01-t01?slide=3");
    navigateTo(router, "/topic/ch01-t02?slide=5");
    navigateTo(router, "/topic/ch01-t03?slide=8");
    navigateTo(router, "/topic/ch01-t04?slide=6");
    expect(getSlideOfTotal()).toBe(`Slide 6 of ${T04.slides.length}`);

    navigateTo(router, "/topic/ch01-t01");
    expect(window.localStorage.getItem("phsh111:ch01-t01.reader.lastSlideNumber")).toBe("3");

    navigateTo(router, "/topic/ch01-t02");
    expect(window.localStorage.getItem("phsh111:ch01-t02.reader.lastSlideNumber")).toBe("5");

    navigateTo(router, "/topic/ch01-t03");
    expect(window.localStorage.getItem("phsh111:ch01-t03.reader.lastSlideNumber")).toBe("8");
  });

  it("progress survives a full unmount/remount (reload) for all four real topics independently", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    navigateTo(router, "/topic/ch01-t03");
    markComplete();
    navigateTo(router, "/topic/ch01-t04");
    markComplete();
    const t01Before = readCanonical("ch01-t01");
    const t02Before = readCanonical("ch01-t02");
    const t03Before = readCanonical("ch01-t03");
    const t04Before = readCanonical("ch01-t04");

    act(() => root.unmount());
    container.remove();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    renderAt("/topic/ch01-t01");

    expect(readCanonical("ch01-t01")).toEqual(t01Before);
    expect(readCanonical("ch01-t02")).toEqual(t02Before);
    expect(readCanonical("ch01-t03")).toEqual(t03Before);
    expect(readCanonical("ch01-t04")).toEqual(t04Before);
  });
});
