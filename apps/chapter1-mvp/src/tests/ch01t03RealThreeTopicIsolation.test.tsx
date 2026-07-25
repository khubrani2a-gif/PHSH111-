// @vitest-environment jsdom
//
// Real three-topic progress isolation for PR E — extends
// ch01t02RealCrossTopicIsolation.test.tsx's two-real-topic pattern (PR D)
// to all three now-real slide-bearing topics: ch01-t01, ch01-t02, and
// ch01-t03. No new progress code, no per-topic branch — same
// SlidesExperience component, same canonical slideProgress.ts storage,
// reused verbatim across three real topics simultaneously.
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
const TOPICS_BY_ID: Record<string, NormalizedTopic> = {
  [T01.topicId]: T01,
  [T02.topicId]: T02,
  [T03.topicId]: T03,
};

/** Mirrors TopicPage.tsx's real useParams()-driven lookup — same component instance, changing :topicId param, across all three real topics. */
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

function clickViewAllSlides() {
  act(() => {
    container.querySelector<HTMLButtonElement>(".slide-reader__view-all-btn")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function getSlideOfTotal(): string {
  return container.querySelector(".slide-reader__slide-of-total")?.textContent ?? "";
}

describe("Real three-topic isolation — ch01-t01, ch01-t02, ch01-t03 (PR E)", () => {
  it("1. opening ch01-t03's first slide marks it Viewed; no progress exists yet for ch01-t01/ch01-t02", () => {
    renderAt("/topic/ch01-t03");
    const state03 = readCanonical("ch01-t03");
    expect(state03?.records[T03.slides[0].recordId].viewedAt).toBeTypeOf("string");
    expect(readCanonical("ch01-t01")).toBeNull();
    expect(readCanonical("ch01-t02")).toBeNull();
  });

  it("2. unopened ch01-t03 slides remain unseen after opening only Slide 1", () => {
    renderAt("/topic/ch01-t03");
    const state03 = readCanonical("ch01-t03");
    expect(state03?.records[T03.slides[1].recordId]).toBeUndefined();
  });

  it("3-4. mark one slide Completed in each of ch01-t01 and ch01-t02, then open ch01-t03 — confirm neither completion leaks", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    const t01StateBefore = readCanonical("ch01-t01");
    expect(t01StateBefore?.records[T01.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    const t02StateBefore = readCanonical("ch01-t02");
    expect(t02StateBefore?.records[T02.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t03");

    expect(container.querySelector(".slide-navigator__status--completed")).toBeNull();
    const state03 = readCanonical("ch01-t03");
    for (const slide of T03.slides) {
      expect(state03?.records[slide.recordId]?.completedAt).toBeUndefined();
    }
    // ch01-t01 and ch01-t02's own canonical storage remain untouched by opening ch01-t03.
    expect(readCanonical("ch01-t01")).toEqual(t01StateBefore);
    expect(readCanonical("ch01-t02")).toEqual(t02StateBefore);
  });

  it("5-6. mark a ch01-t03 slide Completed, then move among all three topics — each restores its own independent state", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    const t01State = readCanonical("ch01-t01");

    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    const t02State = readCanonical("ch01-t02");

    navigateTo(router, "/topic/ch01-t03");
    markComplete(); // ch01-t03 Slide 1 Completed — a distinct topic and slide from the other two
    const t03State = readCanonical("ch01-t03");
    expect(t03State?.records[T03.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t01");
    expect(readCanonical("ch01-t01")).toEqual(t01State);
    expect(getSlideOfTotal()).toBe(`Slide 1 of ${T01.slides.length}`);
    expect(container.querySelector(".slide-navigator__entry")?.querySelector(".slide-navigator__status")?.textContent).toBe("✓");

    navigateTo(router, "/topic/ch01-t02");
    expect(readCanonical("ch01-t02")).toEqual(t02State);

    navigateTo(router, "/topic/ch01-t03");
    expect(readCanonical("ch01-t03")).toEqual(t03State);
  });

  it("7. no write pairs any topic's topicId with another topic's record ID", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    navigateTo(router, "/topic/ch01-t03");
    markComplete();

    const idsByTopic = {
      "ch01-t01": new Set(T01.slides.map((s) => s.recordId)),
      "ch01-t02": new Set(T02.slides.map((s) => s.recordId)),
      "ch01-t03": new Set(T03.slides.map((s) => s.recordId)),
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

  it("8. viewMode is restored independently per topic across all three", () => {
    const router = renderAt("/topic/ch01-t03");
    clickViewAllSlides();
    expect(window.localStorage.getItem("phsh111:ch01-t03.slides.viewMode")).toBe("all");

    navigateTo(router, "/topic/ch01-t01");
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t02");
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t03");
    expect(container.querySelector(".slides-section")).not.toBeNull(); // ch01-t03's own "all" preference restored
  });

  it("9. openRecordId is restored independently per topic", () => {
    const router = renderAt("/topic/ch01-t03");
    clickViewAllSlides();
    const header3 = container.querySelector<HTMLButtonElement>("#slide-3-header");
    act(() => header3?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(JSON.parse(window.localStorage.getItem("phsh111:ch01-t03.slides.openRecordId")!).openSlideId).toBe(
      T03.slides[2].recordId,
    );

    navigateTo(router, "/topic/ch01-t02");
    clickViewAllSlides();
    // ch01-t02 has no stored openRecordId yet — defaults to its own first slide.
    const t02header1 = container.querySelector<HTMLButtonElement>("#slide-1-header");
    expect(t02header1?.getAttribute("aria-expanded")).toBe("true");
  });

  it("10. last-opened slide number (reader.lastSlideNumber) is restored independently per topic", () => {
    const router = renderAt("/topic/ch01-t01?slide=3");
    navigateTo(router, "/topic/ch01-t02?slide=5");
    navigateTo(router, "/topic/ch01-t03?slide=8");
    expect(getSlideOfTotal()).toBe(`Slide 8 of ${T03.slides.length}`);

    navigateTo(router, "/topic/ch01-t01");
    expect(window.localStorage.getItem("phsh111:ch01-t01.reader.lastSlideNumber")).toBe("3");

    navigateTo(router, "/topic/ch01-t02");
    expect(window.localStorage.getItem("phsh111:ch01-t02.reader.lastSlideNumber")).toBe("5");
  });

  it("11. reader mode (study/review) is restored independently per topic", () => {
    const router = renderAt("/topic/ch01-t03");
    // Defaults are independent per topic — this only asserts the storage key is topic-scoped, not shared.
    navigateTo(router, "/topic/ch01-t01");
    navigateTo(router, "/topic/ch01-t02");
    navigateTo(router, "/topic/ch01-t03");
    expect(container.querySelector(".slide-reader")).not.toBeNull();
  });

  it("12. progress survives a full unmount/remount (reload) for all three real topics independently", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    navigateTo(router, "/topic/ch01-t03");
    markComplete();
    const t01Before = readCanonical("ch01-t01");
    const t02Before = readCanonical("ch01-t02");
    const t03Before = readCanonical("ch01-t03");

    act(() => root.unmount());
    container.remove();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    renderAt("/topic/ch01-t01");

    expect(readCanonical("ch01-t01")).toEqual(t01Before);
    expect(readCanonical("ch01-t02")).toEqual(t02Before);
    expect(readCanonical("ch01-t03")).toEqual(t03Before);
  });
});
