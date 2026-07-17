// @vitest-environment jsdom
//
// DOM-interaction tests for VisualViewer's enlarge dialog. Requires a real
// DOM (document.activeElement, .focus(), element mount/unmount) that the
// rest of this suite's "node" environment doesn't provide — this is the
// one file in src/tests/ that opts into jsdom via the pragma above, kept
// scoped to this file only (see vitest.config.ts's header comment) so the
// rest of the suite stays on the lighter "node" environment.
//
// jsdom (as of the version installed here) implements the `open` IDL
// property and content-attribute reflection for <dialog>, but does NOT
// implement `showModal()`/`close()` — those are stubbed here with the
// smallest polyfill that reproduces the open/closed *state* transition,
// so VisualViewer's own React-level orchestration (state, refs, effects,
// focus() calls, scroll-lock) can be exercised without crashing. This
// polyfill does NOT reproduce the browser's native modal focus-trap or
// background-inertness — jsdom has no layout/rendering engine to do that
// with, and no polyfill here would make that check meaningful. Focus
// containment and background inertness were instead verified against a
// real Chromium-based browser in this session (real Tab/Shift+Tab key
// dispatch stayed on the dialog's only focusable control; a programmatic
// .focus() call targeting a background control was refused while the
// dialog was open) — see docs/app/PHSH111_MVP_INTERNAL_QA.md §9.
import { beforeAll, afterEach, beforeEach, describe, expect, it } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { LanguageProvider } from "../app/LanguageContext";
import { VisualViewer } from "../features/topics/VisualViewer";
import type { NormalizedVisual } from "../types/normalized";

// React 18's act() only suppresses its "not wrapped in act" warnings when
// this flag is set — jsdom-via-vitest doesn't set it automatically the way
// a framework like React Testing Library would.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SAMPLE_VISUAL: NormalizedVisual = {
  recordId: "ch01-t03-block-visual",
  visualId: "ch01-t03-visual-001",
  assetPath: "test/fixture.svg",
  svgMarkup: '<svg role="img" aria-labelledby="t"><title id="t">Test</title></svg>',
  assetStatus: "available",
  availabilityStatus: "available",
  studentFacingAllowed: false,
  reviewer: null,
  reviewedAt: null,
  readyForHumanReview: true,
};

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
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(
      <LanguageProvider>
        <VisualViewer visual={SAMPLE_VISUAL} />
      </LanguageProvider>,
    );
  });
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
  document.body.style.overflow = "";
});

function openDialog() {
  const trigger = container.querySelector<HTMLButtonElement>(".visual-viewer__enlarge")!;
  act(() => {
    trigger.click();
  });
}

describe("VisualViewer dialog", () => {
  it("opens on enlarge click", () => {
    openDialog();
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(dialog?.open).toBe(true);
  });

  it("closes via the close button, and removes the dialog from the DOM", () => {
    openDialog();
    const closeBtn = container.querySelector<HTMLButtonElement>(".visual-viewer__close")!;
    act(() => {
      closeBtn.click();
    });
    expect(container.querySelector("dialog")).toBeNull();
  });

  it("closes on Escape", () => {
    openDialog();
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(container.querySelector("dialog")).toBeNull();
  });

  it("closes on a backdrop click but not on a click inside the dialog content", () => {
    openDialog();
    const dialog = container.querySelector("dialog")!;
    const content = container.querySelector<HTMLElement>(".visual-viewer__dialog-content")!;

    // Click inside the content — must NOT close.
    act(() => {
      content.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector("dialog")).not.toBeNull();

    // Click the dialog element itself (the backdrop-equivalent target in
    // this component's click-target check) — must close.
    act(() => {
      dialog.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.querySelector("dialog")).toBeNull();
  });

  it("moves focus to the close button when opened", () => {
    openDialog();
    expect(document.activeElement?.className).toBe("visual-viewer__close");
  });

  it("returns focus to the exact opener (enlarge button) after closing", () => {
    openDialog();
    const closeBtn = container.querySelector<HTMLButtonElement>(".visual-viewer__close")!;
    act(() => {
      closeBtn.click();
    });
    expect(document.activeElement?.className).toBe("visual-viewer__enlarge");
  });

  it("locks body scroll while open and restores the exact prior inline value on close", () => {
    document.body.style.overflow = "scroll"; // a distinctive prior value, not just ""
    openDialog();
    expect(document.body.style.overflow).toBe("hidden");
    const closeBtn = container.querySelector<HTMLButtonElement>(".visual-viewer__close")!;
    act(() => {
      closeBtn.click();
    });
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("restores body scroll on unmount even if the dialog was left open", () => {
    document.body.style.overflow = "";
    openDialog();
    expect(document.body.style.overflow).toBe("hidden");
    act(() => {
      root.unmount();
    });
    expect(document.body.style.overflow).toBe("");
  });

  it("does not mount two copies of the SVG markup at once (preview and dialog are mutually exclusive)", () => {
    expect(container.querySelectorAll("svg")).toHaveLength(1);
    openDialog();
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});
