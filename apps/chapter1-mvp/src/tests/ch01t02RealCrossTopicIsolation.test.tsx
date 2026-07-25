// @vitest-environment jsdom
//
// Real-topic cross-topic progress isolation for PR D (required-validation
// items 51-60, and the task's explicit "Real cross-topic verification"
// requirement). slideProgressCrossTopicIsolation.test.tsx (PR C) proved
// the keyed-remount fix using two SYNTHETIC in-memory topic fixtures —
// this file proves the same isolation guarantee using the two REAL,
// canonical, slide-bearing topics (ch01-t01 and ch01-t02) now that both
// exist, exactly as the task requires. No new progress code, no per-topic
// branch — same SlidesExperience component, same canonical
// slideProgress.ts storage, reused verbatim.
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
const TOPICS_BY_ID: Record<string, NormalizedTopic> = { [T01.topicId]: T01, [T02.topicId]: T02 };

/** Mirrors TopicPage.tsx's real useParams()-driven lookup — same component instance, changing :topicId param, exactly like real in-app navigation between two real topics. */
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

describe("Real cross-topic isolation — ch01-t01 <-> ch01-t02 (PR D, requirements 51-60)", () => {
  it("51. opening ch01-t01's first slide marks it Viewed; ch01-t02 has no progress yet", () => {
    renderAt("/topic/ch01-t01");
    const state01 = readCanonical("ch01-t01");
    expect(state01?.records[T01.slides[0].recordId].viewedAt).toBeTypeOf("string");
    expect(readCanonical("ch01-t02")).toBeNull();
  });

  it("52. unopened ch01-t01 slides remain unseen after opening only Slide 1", () => {
    renderAt("/topic/ch01-t01");
    const state01 = readCanonical("ch01-t01");
    expect(state01?.records[T01.slides[1].recordId]).toBeUndefined();
  });

  it("53-54. mark a ch01-t01 slide Completed, switch to ch01-t02, confirm zero leakage into ch01-t02's storage", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    const t01StateBefore = readCanonical("ch01-t01");
    expect(t01StateBefore?.records[T01.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t02");

    expect(container.querySelector(".slide-navigator__status--completed")).toBeNull();
    const t02State = readCanonical("ch01-t02");
    for (const slide of T02.slides) {
      expect(t02State?.records[slide.recordId]?.completedAt).toBeUndefined();
    }
    // ch01-t01's own canonical storage is untouched by the switch.
    expect(readCanonical("ch01-t01")).toEqual(t01StateBefore);
  });

  it("55-56. mark a DIFFERENT ch01-t02 slide Completed, switch back to ch01-t01, both topics restore independent state", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete(); // ch01-t01 Slide 1 Completed
    const t01State = readCanonical("ch01-t01");

    navigateTo(router, "/topic/ch01-t02");
    markComplete(); // ch01-t02 Slide 1 Completed — a different slide, different topic
    const t02State = readCanonical("ch01-t02");
    expect(t02State?.records[T02.slides[0].recordId].completedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t01");

    expect(readCanonical("ch01-t01")).toEqual(t01State); // ch01-t01 restored exactly as it was
    expect(getSlideOfTotal()).toBe(`Slide 1 of ${T01.slides.length}`);
    const entry1 = container.querySelector(".slide-navigator__entry");
    expect(entry1?.querySelector(".slide-navigator__status")?.textContent).toBe("✓"); // Completed marker persists

    navigateTo(router, "/topic/ch01-t02");
    expect(readCanonical("ch01-t02")).toEqual(t02State); // ch01-t02 also restored exactly as it was
  });

  it("57. no write pairs ch01-t02's topicId with any ch01-t01 record ID, or vice versa", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    navigateTo(router, "/topic/ch01-t02");
    markComplete();

    const t01RecordIds = new Set(T01.slides.map((s) => s.recordId));
    const t02RecordIds = new Set(T02.slides.map((s) => s.recordId));
    const t01State = readCanonical("ch01-t01")!;
    const t02State = readCanonical("ch01-t02")!;
    for (const key of Object.keys(t01State.records)) expect(t02RecordIds.has(key)).toBe(false);
    for (const key of Object.keys(t02State.records)) expect(t01RecordIds.has(key)).toBe(false);
    for (const key of Object.keys(t01State.records)) expect(t01RecordIds.has(key)).toBe(true);
    for (const key of Object.keys(t02State.records)) expect(t02RecordIds.has(key)).toBe(true);
  });

  it("58. viewMode is restored independently per real topic (ch01-t02's View All Slides preference does not leak into ch01-t01)", () => {
    const router = renderAt("/topic/ch01-t02");
    clickViewAllSlides();
    expect(window.localStorage.getItem("phsh111:ch01-t02.slides.viewMode")).toBe("all");

    navigateTo(router, "/topic/ch01-t01");
    // ch01-t01 has no stored preference of its own in this test run — defaults to the reader.
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t02");
    expect(container.querySelector(".slides-section")).not.toBeNull(); // ch01-t02's own "all" preference restored
  });

  it("59. the last-opened slide number is restored independently per real topic", () => {
    const router = renderAt("/topic/ch01-t01?slide=3");
    navigateTo(router, "/topic/ch01-t02?slide=9");
    expect(getSlideOfTotal()).toBe(`Slide 9 of ${T02.slides.length}`);

    navigateTo(router, "/topic/ch01-t01");
    expect(window.localStorage.getItem("phsh111:ch01-t01.reader.lastSlideNumber")).toBe("3");
  });

  it("60. progress persists across a full unmount/remount (reload) for both real topics independently", () => {
    const router = renderAt("/topic/ch01-t01");
    markComplete();
    navigateTo(router, "/topic/ch01-t02");
    markComplete();
    const t01Before = readCanonical("ch01-t01");
    const t02Before = readCanonical("ch01-t02");

    act(() => root.unmount());
    container.remove();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    renderAt("/topic/ch01-t01");

    expect(readCanonical("ch01-t01")).toEqual(t01Before);
    expect(readCanonical("ch01-t02")).toEqual(t02Before);
  });
});
