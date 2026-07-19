// @vitest-environment jsdom
//
// DOM-interaction tests for the ch01-t01 (Fundamental Quantities)
// interactive presentation: the review-card show/hide toggle, persisted
// collapsible-section state, the active-section progress indicator, and
// persisted language. Mirrors src/tests/visualViewerDialog.test.tsx's
// jsdom-pragma + createRoot/act pattern (the only other file in this suite
// needing a live DOM), kept in its own file so the rest of the suite stays
// on the lighter default "node" environment.
//
// jsdom does not implement IntersectionObserver at all, so it is stubbed
// here with the smallest mock that lets a test manually fire a
// "some section is now intersecting" callback and assert on the resulting
// render — this does not attempt to reproduce real scroll/viewport
// geometry, which jsdom has no layout engine for anyway.
import { beforeEach, afterEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider, useLanguage } from "../app/LanguageContext";
import { ReviewQuestion, REVIEW_ANSWER_MARKER_BY_TOPIC } from "../features/topics/ReviewQuestion";
import { ContentSection } from "../features/topics/ContentSection";
import { TopicReadingGuide } from "../features/topics/TopicReadingGuide";
import { VisualViewer } from "../features/topics/VisualViewer";
import type { NormalizedSection } from "../types/normalized";
import type { NormalizedVisual } from "../types/normalized";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  private callback: IOCallback;
  observed: Element[] = [];

  constructor(callback: IOCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) {
    this.observed.push(el);
  }
  unobserve(el: Element) {
    this.observed = this.observed.filter((e) => e !== el);
  }
  disconnect() {
    this.observed = [];
  }
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries);
  }
}

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  window.localStorage.clear();
  MockIntersectionObserver.instances = [];
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
    MockIntersectionObserver;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
});

const REVIEW_SECTION: NormalizedSection = {
  recordId: "ch01-t01-block-review",
  blockType: "reviewQuestion",
  visibility: "student",
  text: {
    en: "What is the fourth fundamental property? Correct answer: Charge.",
    ar: "ما هي الخاصية الأساسية الرابعة؟ الإجابة الصحيحة: الشحنة.",
  },
  blocking: {
    blockingStatus: "blocked",
    blockingReason: ["other"],
    blockingRecordIds: [],
    studentFacingAllowed: false,
    instructorFacingAllowed: true,
    resolutionRequired: true,
    resolutionOwner: "test",
    resolutionStatus: "open",
  },
};

const REVEAL_MARKER = REVIEW_ANSWER_MARKER_BY_TOPIC["ch01-t01"]!;

describe("ReviewQuestion — show/hide answer toggle (ch01-t01 only)", () => {
  it("hides the answer by default and reveals it on click, without altering the underlying text", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <ReviewQuestion section={REVIEW_SECTION} revealMarker={REVEAL_MARKER} />
        </LanguageProvider>,
      );
    });

    expect(container.textContent).toContain("What is the fourth fundamental property?");
    expect(container.textContent).not.toContain("Charge.");

    const button = container.querySelector(".review-question__reveal-toggle") as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.getAttribute("aria-expanded")).toBe("false");

    act(() => button.click());

    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(container.textContent).toContain("Correct answer: Charge.");
  });

  it("persists the revealed state across remounts when persistKey is given", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <ReviewQuestion
            section={REVIEW_SECTION}
            revealMarker={REVEAL_MARKER}
            persistKey="test.review.revealed"
          />
        </LanguageProvider>,
      );
    });
    const button = container.querySelector(".review-question__reveal-toggle") as HTMLButtonElement;
    act(() => button.click());
    expect(container.textContent).toContain("Charge.");

    // Remount fresh — a new component instance should read the persisted
    // reveal state and start already-revealed.
    act(() => root.unmount());
    root = createRoot(container);
    act(() => {
      root.render(
        <LanguageProvider>
          <ReviewQuestion
            section={REVIEW_SECTION}
            revealMarker={REVEAL_MARKER}
            persistKey="test.review.revealed"
          />
        </LanguageProvider>,
      );
    });
    expect(container.textContent).toContain("Charge.");
  });

  it("without revealMarker, keeps rendering the full text with no toggle (default behavior for every other topic)", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <ReviewQuestion section={REVIEW_SECTION} />
        </LanguageProvider>,
      );
    });
    expect(container.textContent).toContain("Correct answer: Charge.");
    expect(container.querySelector(".review-question__reveal-toggle")).toBeNull();
  });

  it("falls back to the always-visible full text (no toggle) when the marker is duplicated in the source text", () => {
    const duplicatedMarkerSection: NormalizedSection = {
      ...REVIEW_SECTION,
      text: {
        en: "Correct answer: first. Then, Correct answer: second.",
        ar: REVIEW_SECTION.text.ar,
      },
    };
    act(() => {
      root.render(
        <LanguageProvider>
          <ReviewQuestion section={duplicatedMarkerSection} revealMarker={REVEAL_MARKER} />
        </LanguageProvider>,
      );
    });
    expect(container.querySelector(".review-question__reveal-toggle")).toBeNull();
    expect(container.textContent).toContain(
      "Correct answer: first. Then, Correct answer: second.",
    );
  });

  it("works end-to-end in Arabic: hides the answer behind the Arabic-labeled toggle, reveals the exact Arabic answer text on click", () => {
    // Force the LanguageProvider to start in Arabic via the same persisted
    // language mechanism the real app uses (see LanguageContext.tsx).
    window.localStorage.setItem("phsh111:language", "ar");
    act(() => {
      root.render(
        <LanguageProvider>
          <ReviewQuestion section={REVIEW_SECTION} revealMarker={REVEAL_MARKER} />
        </LanguageProvider>,
      );
    });

    expect(container.textContent).toContain("ما هي الخاصية الأساسية الرابعة؟");
    expect(container.textContent).not.toContain("الشحنة.");

    const button = container.querySelector(".review-question__reveal-toggle") as HTMLButtonElement;
    expect(button.textContent).toBe("إظهار الإجابة");

    act(() => button.click());

    expect(button.textContent).toBe("إخفاء الإجابة");
    expect(container.textContent).toContain("الإجابة الصحيحة: الشحنة.");
  });
});

describe("ContentSection — persisted collapsible-section state (ch01-t01 only)", () => {
  const TEXT = { en: "Explanation text.", ar: "نص الشرح." };

  it("defaults open, closes on toggle, and persists the closed state across remounts", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <ContentSection
            blockType="organizedExplanation"
            text={TEXT}
            collapsible
            persistKey="test.section.open"
          />
        </LanguageProvider>,
      );
    });
    const details = container.querySelector("details") as HTMLDetailsElement;
    expect(details.open).toBe(true);

    act(() => {
      details.open = false;
      details.dispatchEvent(new Event("toggle", { bubbles: false }));
    });
    expect(details.open).toBe(false);

    act(() => root.unmount());
    root = createRoot(container);
    act(() => {
      root.render(
        <LanguageProvider>
          <ContentSection
            blockType="organizedExplanation"
            text={TEXT}
            collapsible
            persistKey="test.section.open"
          />
        </LanguageProvider>,
      );
    });
    const detailsAfterRemount = container.querySelector("details") as HTMLDetailsElement;
    expect(detailsAfterRemount.open).toBe(false);
  });

  it("without persistKey, stays open by default with no persistence attempted (unchanged default behavior)", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <ContentSection blockType="organizedExplanation" text={TEXT} collapsible />
        </LanguageProvider>,
      );
    });
    const details = container.querySelector("details") as HTMLDetailsElement;
    expect(details.open).toBe(true);
  });
});

describe("TopicReadingGuide — active-section highlight and progress indicator", () => {
  const SECTION_IDS = [
    "topic-opening",
    "topic-main-idea",
    "topic-explanation",
    "topic-equation",
    "topic-visual",
    "topic-review",
  ];

  function mountSectionStubs() {
    for (const id of SECTION_IDS) {
      const el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
  }

  afterEach(() => {
    for (const id of SECTION_IDS) {
      document.getElementById(id)?.remove();
    }
  });

  it("shows no active step and no progress text before any section has been observed as intersecting", () => {
    mountSectionStubs();
    act(() => {
      root.render(
        <LanguageProvider>
          <TopicReadingGuide />
        </LanguageProvider>,
      );
    });
    expect(container.querySelector('[aria-current="step"]')).toBeNull();
    expect(container.querySelector(".topic-reading-guide__progress-text")).toBeNull();
  });

  it("highlights the fourth step and shows 'Step 4 of 6' once the equation section is reported intersecting", () => {
    mountSectionStubs();
    act(() => {
      root.render(
        <LanguageProvider>
          <TopicReadingGuide />
        </LanguageProvider>,
      );
    });

    const observer = MockIntersectionObserver.instances[0];
    expect(observer.observed).toHaveLength(6);

    const equationEl = document.getElementById("topic-equation")!;
    act(() => {
      observer.trigger([
        { isIntersecting: true, target: equationEl, boundingClientRect: { top: 10 } as DOMRectReadOnly },
      ]);
    });

    const activeLink = container.querySelector('[aria-current="step"]') as HTMLAnchorElement;
    expect(activeLink).toBeTruthy();
    expect(activeLink.getAttribute("href")).toBe("#topic-equation");
    expect(container.querySelector(".topic-reading-guide__progress-text")?.textContent).toBe(
      "Step 4 of 6",
    );
  });
});

describe("LanguageContext — persisted language", () => {
  function Probe() {
    const { language, toggleLanguage } = useLanguage();
    return (
      <button className="probe-toggle" onClick={toggleLanguage}>
        {language}
      </button>
    );
  }

  it("persists the language across remounts after toggling", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <Probe />
        </LanguageProvider>,
      );
    });
    const button = container.querySelector(".probe-toggle") as HTMLButtonElement;
    expect(button.textContent).toBe("en");

    act(() => button.click());
    expect(button.textContent).toBe("ar");

    act(() => root.unmount());
    root = createRoot(container);
    act(() => {
      root.render(
        <LanguageProvider>
          <Probe />
        </LanguageProvider>,
      );
    });
    expect((container.querySelector(".probe-toggle") as HTMLButtonElement).textContent).toBe("ar");
  });
});

describe("VisualViewer — size=\"large\" modifier (ch01-t01 only)", () => {
  const SAMPLE_VISUAL: NormalizedVisual = {
    recordId: "ch01-t01-block-visual",
    visualId: "ch01-t01-visual-001",
    assetPath: "test/fixture.svg",
    svgMarkup: '<svg role="img" aria-labelledby="t"><title id="t">Test</title></svg>',
    assetStatus: "available",
    availabilityStatus: "available",
    studentFacingAllowed: false,
    reviewer: null,
    reviewedAt: null,
    readyForHumanReview: true,
  };

  it("adds the visual-viewer--large modifier class only when size=\"large\" is passed", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <VisualViewer visual={SAMPLE_VISUAL} size="large" />
        </LanguageProvider>,
      );
    });
    expect(container.querySelector(".visual-viewer.visual-viewer--large")).toBeTruthy();
  });

  it("renders the unmodified default class list when size is omitted", () => {
    act(() => {
      root.render(
        <LanguageProvider>
          <VisualViewer visual={SAMPLE_VISUAL} />
        </LanguageProvider>,
      );
    });
    expect(container.querySelector(".visual-viewer--large")).toBeNull();
  });
});
