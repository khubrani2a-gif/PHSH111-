// @vitest-environment jsdom
//
// Cross-topic progress-isolation tests for PR C's remount-boundary
// correction (src/features/topics/SlidesExperience.tsx's keyed
// TopicSlidesExperience wrapper). React Router reuses the same TopicPage
// component instance across topic navigation (only useParams()'s topicId
// changes — TopicPage itself is never remounted), so without an explicit
// key on the topic-scoped subtree, SlideReader's/SlidesSection's own
// `useState(() => readTopicLearningState(topicId, ...))` initializers
// would not re-run when the topic prop changes, leaving the PREVIOUS
// topic's state mounted under the NEW topic's props and persisted under
// the new topic's storage keys by the very next write effect.
//
// The render harness below mirrors TopicPage.tsx's own real pattern as
// closely as practical: a single dynamic route ("/topic/:topicId") whose
// element reads useParams() and looks up which synthetic topic to render
// — the same "one route, changing param" shape that reproduces the real
// bug, driven via real router.navigate() calls (never a bare re-render
// with a different prop on an unmounted/reconstructed router) so the
// simulated navigation also behaves like a real route change: the
// destination path carries no leftover query string unless the test
// explicitly navigates to one, exactly like TopicNavigation's real links.
//
// Since only ch01-t01 currently carries real slide content, this file
// builds two entirely synthetic, in-memory NormalizedTopic fixtures
// (reusing two of the six real, valid PilotTopicId string values as
// synthetic-fixture-only topic IDs — mirroring src/tests/slideGroups.test.ts's
// own precedent — never touching real content JSON). Both topics are
// rendered through the exact same public SlidesExperience component used
// in production; the fix under test is the keyed remount boundary itself,
// not a special test-only code path.
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createMemoryRouter, RouterProvider, useParams } from "react-router-dom";
import { LanguageProvider } from "../app/LanguageContext";
import { SlidesExperience } from "../features/topics/SlidesExperience";
import type { NormalizedGovernance, NormalizedSlide, NormalizedTopic } from "../types/normalized";
import type { PilotTopicId } from "../types/pilotSchema";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

beforeAll(() => {
  // jsdom does not implement scrollIntoView — see slideReader.test.tsx's
  // identical polyfill rationale. A no-op is sufficient here too.
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

function makeGovernance(topicId: PilotTopicId): NormalizedGovernance {
  return {
    topicId,
    schemaVersion: "test",
    recordCount: 0,
    blockedRecordCount: 0,
    studentFacingAllowed: false,
    studentPublicationAuthorized: false,
    visualReviewStatus: "unavailable",
    visualReviewer: null,
  };
}

function makeSlide(recordId: string, slideNumber: number, label: string): NormalizedSlide {
  return {
    recordId,
    slideNumber,
    title: { en: `${label} (EN)`, ar: `${label} (AR)` },
    visibility: "shared",
    text: { en: `${label} synthetic body text.`, ar: `${label} نص تجريبي.` },
    blocking: {
      blockingStatus: "notBlocked",
      blockingReason: [],
      blockingRecordIds: [],
      studentFacingAllowed: true,
      instructorFacingAllowed: true,
      resolutionRequired: false,
      resolutionOwner: "",
      resolutionStatus: "",
    },
  };
}

function makeSyntheticTopic(topicId: PilotTopicId, slides: NormalizedSlide[]): NormalizedTopic {
  return {
    topicId,
    title: { en: `Synthetic ${topicId}`, ar: `موضوع تجريبي ${topicId}` },
    slides,
    instructorNotes: [],
    governance: makeGovernance(topicId),
  };
}

// Reuses two real, valid PilotTopicId values purely as synthetic-fixture
// labels — deliberately distinct record IDs from real ch01-t01 content,
// never touching any real content JSON. Slide numbers deliberately
// overlap (both topics use 1 and 2) — isolation must hold by record ID +
// topicId scoping, never by coincidentally-distinct slide numbers.
const TOPIC_A = makeSyntheticTopic("ch01-t02" as PilotTopicId, [
  makeSlide("synthetic-topicA-slide-1", 1, "Topic A Slide One"),
  makeSlide("synthetic-topicA-slide-2", 2, "Topic A Slide Two"),
]);
const TOPIC_B = makeSyntheticTopic("ch01-t03" as PilotTopicId, [
  makeSlide("synthetic-topicB-slide-1", 1, "Topic B Slide One"),
  makeSlide("synthetic-topicB-slide-2", 2, "Topic B Slide Two"),
]);
const TOPICS_BY_ID: Record<string, NormalizedTopic> = {
  [TOPIC_A.topicId]: TOPIC_A,
  [TOPIC_B.topicId]: TOPIC_B,
};

/** Mirrors TopicPage.tsx's own real useParams()-driven topic lookup, at the same single dynamic route shape — reproduces the exact "same component instance, changing param" scenario the fix addresses. */
function SyntheticTopicRoute() {
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
            <SyntheticTopicRoute />
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

/** Real route navigation to a different topic's path — the destination carries no leftover query string unless explicitly included, exactly like TopicNavigation's real links. */
function navigateTo(router: ReturnType<typeof createMemoryRouter>, path: string) {
  act(() => {
    router.navigate(path);
  });
}

function readCanonical(
  topicId: string,
): { version: number; records: Record<string, { viewedAt?: string; completedAt?: string; masteredAt?: string }> } | null {
  const raw = window.localStorage.getItem(`phsh111:${topicId}.slides.learningState`);
  return raw ? JSON.parse(raw) : null;
}

function markComplete() {
  act(() => {
    container.querySelector<HTMLButtonElement>(".slide-reader-footer__btn--complete")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function clickNext() {
  act(() => {
    container.querySelector<HTMLButtonElement>(".slide-reader-footer__btn--next")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function clickViewAllSlides() {
  act(() => {
    container.querySelector<HTMLButtonElement>(".slide-reader__view-all-btn")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function clickReturnToReader() {
  act(() => {
    container.querySelector<HTMLButtonElement>(".slides-experience__return-to-reader")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

function clickAccordionHeader(slideNumber: number) {
  act(() => {
    container.querySelector<HTMLButtonElement>(`#slide-${slideNumber}-header`)?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

describe("Cross-topic progress isolation (PR C correction) — Reader mode transition", () => {
  it("1-2. Render Topic A, mark Slide 1 Viewed (by mounting) and Slide 2 Completed", () => {
    renderAt("/topic/ch01-t02");
    clickNext(); // -> Topic A Slide 2, marks it Viewed
    markComplete(); // marks Topic A Slide 2 Completed
    const stateA = readCanonical("ch01-t02");
    expect(stateA?.records["synthetic-topicA-slide-1"].viewedAt).toBeTypeOf("string");
    expect(stateA?.records["synthetic-topicA-slide-2"].completedAt).toBeTypeOf("string");
  });

  it("3-4. Navigating the same route tree to Topic B shows none of Topic A's progress", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    markComplete();

    navigateTo(router, "/topic/ch01-t03"); // same route/component tree — only the :topicId param changes

    expect(container.querySelector(".slide-navigator__status--completed")).toBeNull();
    const entries = container.querySelectorAll(".slide-navigator__entry");
    expect(entries.length).toBe(2);
    // Topic B's own Slide 1 legitimately becomes Viewed by mounting on it —
    // that is Topic B's OWN fresh state, not a Topic A carryover. Slide 2,
    // never opened in Topic B, must remain not-started.
    expect(entries[0].querySelector(".slide-navigator__status")?.textContent).toBe("●");
    expect(entries[1].querySelector(".slide-navigator__status")?.textContent).toBe("○");
  });

  it("5-6. Topic B's first actual opened slide is the only new Viewed entry, written only to <topicB>.slides.learningState", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    markComplete();

    navigateTo(router, "/topic/ch01-t03");

    const stateB = readCanonical("ch01-t03");
    expect(Object.keys(stateB?.records ?? {})).toEqual(["synthetic-topicB-slide-1"]);
    expect(stateB?.records["synthetic-topicB-slide-1"].viewedAt).toBeTypeOf("string");
    expect(stateB?.records["synthetic-topicB-slide-1"].completedAt).toBeUndefined();
  });

  it("7. Topic A's canonical storage remains unchanged after switching to Topic B", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    markComplete();
    const beforeSwitch = readCanonical("ch01-t02");

    navigateTo(router, "/topic/ch01-t03");
    clickNext();
    markComplete();

    expect(readCanonical("ch01-t02")).toEqual(beforeSwitch);
  });

  it("8-11. Mark a Topic B slide Completed, navigate back to Topic A, Topic A restores its original state, Topic B stays isolated", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    markComplete();
    const topicAStateBefore = readCanonical("ch01-t02");

    navigateTo(router, "/topic/ch01-t03");
    clickNext();
    markComplete(); // Topic B Slide 2 Completed
    const topicBState = readCanonical("ch01-t03");

    navigateTo(router, "/topic/ch01-t02"); // navigate back

    expect(readCanonical("ch01-t02")).toEqual(topicAStateBefore);
    const entry1 = container.querySelector(".slide-navigator__entry");
    expect(entry1?.querySelector(".slide-navigator__status")?.textContent).toBe("●"); // Slide 1 was Viewed
    expect(readCanonical("ch01-t03")).toEqual(topicBState); // Topic B untouched by the trip back
  });

  it("12. masteredAt values remain isolated and preserved across topic switches", () => {
    window.localStorage.setItem(
      "phsh111:ch01-t02.slides.learningState",
      JSON.stringify({
        version: 1,
        records: { "synthetic-topicA-slide-1": { viewedAt: "2026-01-01T00:00:00.000Z", masteredAt: "2026-01-01T00:05:00.000Z" } },
      }),
    );
    const router = renderAt("/topic/ch01-t02");
    navigateTo(router, "/topic/ch01-t03");
    clickNext();
    navigateTo(router, "/topic/ch01-t02");
    expect(readCanonical("ch01-t02")?.records["synthetic-topicA-slide-1"].masteredAt).toBe("2026-01-01T00:05:00.000Z");
  });

  it("13. Topic A and Topic B restore their own separate viewMode preference", () => {
    const router = renderAt("/topic/ch01-t02");
    clickViewAllSlides();
    expect(window.localStorage.getItem("phsh111:ch01-t02.slides.viewMode")).toBe("all");

    navigateTo(router, "/topic/ch01-t03");
    // A brand-new topic with no stored preference defaults to "reader".
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    expect(container.querySelector(".slides-section")).toBeNull();

    navigateTo(router, "/topic/ch01-t02");
    // Topic A's own "all" preference is restored, independent of Topic B.
    expect(container.querySelector(".slides-section")).not.toBeNull();
  });

  it("14. Topic A and Topic B restore separate accordion open-slide IDs", () => {
    const router = renderAt("/topic/ch01-t02");
    clickViewAllSlides();
    clickAccordionHeader(2);
    expect(JSON.parse(window.localStorage.getItem("phsh111:ch01-t02.slides.openRecordId")!).openSlideId).toBe(
      "synthetic-topicA-slide-2",
    );

    navigateTo(router, "/topic/ch01-t03");
    clickViewAllSlides();
    // Topic B has no stored openRecordId yet — defaults to its own first slide, not Topic A's.
    const header1 = container.querySelector<HTMLButtonElement>("#slide-1-header");
    expect(header1?.getAttribute("aria-expanded")).toBe("true");
  });

  it("15. no write occurs pairing the new topic ID with the previous topic's state (Topic B's canonical envelope never contains a Topic-A-only record ID)", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    markComplete();

    navigateTo(router, "/topic/ch01-t03");
    clickNext();

    const stateB = readCanonical("ch01-t03");
    expect(stateB?.records["synthetic-topicA-slide-1"]).toBeUndefined();
    expect(stateB?.records["synthetic-topicA-slide-2"]).toBeUndefined();
  });
});

describe("Cross-topic progress isolation (PR C correction) — View All Slides mode transition", () => {
  it("isolation holds when the topic switch happens while View All Slides is the active mode", () => {
    const router = renderAt("/topic/ch01-t02");
    clickViewAllSlides();
    clickAccordionHeader(1);
    const topicAState = readCanonical("ch01-t02");
    expect(topicAState?.records["synthetic-topicA-slide-1"].viewedAt).toBeTypeOf("string");

    navigateTo(router, "/topic/ch01-t03"); // route change while accordion mode was active

    expect(container.querySelector(".slide-navigator__status--completed, .slide-accordion__completed-badge")).toBeNull();
    expect(readCanonical("ch01-t03")?.records["synthetic-topicA-slide-1"]).toBeUndefined();
    expect(readCanonical("ch01-t02")).toEqual(topicAState); // Topic A untouched
  });

  it("reader<->accordion handoff continues to work correctly for the new topic after a topic switch", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    navigateTo(router, "/topic/ch01-t03");
    clickViewAllSlides();
    clickAccordionHeader(2);
    clickReturnToReader();
    expect(container.querySelector(".slide-reader")).not.toBeNull();
    const stateB = readCanonical("ch01-t03");
    expect(stateB?.records["synthetic-topicB-slide-2"].viewedAt).toBeTypeOf("string");
    expect(stateB?.records["synthetic-topicA-slide-1"]).toBeUndefined();
  });
});

describe("Cross-topic progress isolation — storage-key assertions", () => {
  it("canonical learning-state keys remain independently scoped per topic", () => {
    const router = renderAt("/topic/ch01-t02");
    clickNext();
    markComplete();
    navigateTo(router, "/topic/ch01-t03");
    clickNext();

    expect(window.localStorage.getItem("phsh111:ch01-t02.slides.learningState")).not.toBeNull();
    expect(window.localStorage.getItem("phsh111:ch01-t03.slides.learningState")).not.toBeNull();
    const a = JSON.parse(window.localStorage.getItem("phsh111:ch01-t02.slides.learningState")!);
    const b = JSON.parse(window.localStorage.getItem("phsh111:ch01-t03.slides.learningState")!);
    expect(Object.keys(a.records)).not.toEqual(Object.keys(b.records));
  });

  it("viewMode, openRecordId, reader.lastSlideNumber, and reader.mode are all independently scoped per topic", () => {
    const router = renderAt("/topic/ch01-t02?slide=2");
    clickViewAllSlides();
    clickAccordionHeader(2);

    navigateTo(router, "/topic/ch01-t03?slide=1");

    for (const key of ["slides.viewMode", "slides.openRecordId", "reader.lastSlideNumber", "reader.mode"]) {
      const aVal = window.localStorage.getItem(`phsh111:ch01-t02.${key}`);
      const bVal = window.localStorage.getItem(`phsh111:ch01-t03.${key}`);
      // Topic A has a value written (it was interacted with); isolation
      // means "each topic owns its own storage key" — for a key whose
      // value legitimately differs between the two interactions
      // (viewMode/openRecordId) the values must differ too; for a key
      // that may legitimately coincide in value (reader.lastSlideNumber/
      // reader.mode, e.g. both default to "study") only key-scoping is
      // asserted, not value inequality.
      expect(aVal).not.toBeNull();
      if (key === "slides.viewMode" || key === "slides.openRecordId") {
        expect(bVal).not.toBe(aVal);
      }
    }
  });
});
