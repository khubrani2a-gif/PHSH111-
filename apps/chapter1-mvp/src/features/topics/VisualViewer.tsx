import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useLanguage } from "../../app/LanguageContext";
import type { NormalizedVisual } from "../../types/normalized";

const LABELS = {
  en: {
    heading: "Scientific Visual",
    enlarge: "Enlarge visual",
    close: "Close enlarged visual",
    unavailable: "This topic's visual is not available in this build.",
    draftNote: "Draft visual, not finally approved — see the diagram's own footer.",
  },
  ar: {
    heading: "العنصر البصري العلمي",
    enlarge: "تكبير العنصر البصري",
    close: "إغلاق العنصر البصري المكبّر",
    unavailable: "العنصر البصري لهذا الموضوع غير متوفر في هذا الإصدار.",
    draftNote: "عنصر بصري في صورة مسودة، لم تتم الموافقة النهائية عليه — راجع تذييل الرسم نفسه.",
  },
} as const;

interface VisualViewerProps {
  visual: NormalizedVisual | undefined;
}

/**
 * Renders the topic's canonical SVG inline (raw markup, unmodified — see
 * src/content/rawImports.ts) via a small contained preview plus an enlarge
 * control that opens the SVG at native size in a native <dialog>.
 *
 * CHOSEN APPROACH (Phase 3 accessibility hardening — see
 * docs/app/PHSH111_MVP_INTERNAL_QA.md §8 for the full writeup): the
 * enlarge dialog uses the platform's own <dialog> element with
 * `.showModal()` rather than a hand-rolled overlay <div> + fully manual
 * focus trap, and rather than a third-party dialog library. `.showModal()`
 * was verified in this session (real Tab/Shift+Tab key dispatch in an
 * actual browser, plus a direct programmatic focus() attempt on a
 * background element) to natively:
 *  - trap Tab/Shift+Tab focus inside the dialog,
 *  - make the rest of the document inert — a `.focus()` call targeting a
 *    background control while the dialog is open is refused by the
 *    browser.
 *
 * State sync is deliberately NOT wired through the dialog's own native
 * "close"/"cancel" events. Testing in this session's actual browser
 * environment (Chromium via Electron) found that neither event fires
 * after `dialog.close()` — reproduced with a bare, app-independent
 * `<dialog>` element, so this is not specific to this component's code.
 * Every close path (close button, backdrop click, Escape) therefore calls
 * the same local `close()` function directly, which is the single source
 * of truth for both the React state update and the native element's own
 * `.close()` call — the native call is kept for hygiene (so the element's
 * own `open` state stays consistent) but nothing here depends on an event
 * it does fire. Escape is additionally handled by an explicit `keydown`
 * listener (attached only while open) rather than relying solely on the
 * dialog's native light-dismiss behavior, for the same reason.
 */
export function VisualViewer({ visual }: VisualViewerProps) {
  const { language } = useLanguage();
  const text = LABELS[language];
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);
  const titleId = useId();

  function close() {
    dialogRef.current?.close();
    setIsOpen(false);
  }

  // Runs only while the dialog is open: opens it natively, locks
  // background scroll (saving whatever inline overflow value was already
  // there so it can be restored exactly, not just cleared), moves focus to
  // the close button, and listens for Escape directly (see header comment
  // on why this doesn't rely on the dialog's native cancel/close events).
  // The cleanup function restores scroll and removes the listener — it
  // runs both when `isOpen` flips back to false and on unmount (e.g.
  // navigating to a different topic while the dialog is open), so no
  // stale "overflow: hidden" can survive this component going away.
  useEffect(() => {
    if (!isOpen) return;
    const dialogEl = dialogRef.current;
    if (!dialogEl) return;

    hasOpenedRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialogEl.open) dialogEl.showModal();
    closeButtonRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (dialogEl.open) dialogEl.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Returns focus to the exact opener button, but only *after* the
  // preview (and its trigger button) has been re-rendered back into the
  // DOM by the isOpen=false render — calling this synchronously inside a
  // click/keydown handler would run before that re-render, when
  // triggerRef.current is still null. Skipped on first mount (isOpen
  // starts false and has never been opened yet), since there is no prior
  // opener to return to.
  useEffect(() => {
    if (isOpen || !hasOpenedRef.current) return;
    triggerRef.current?.focus();
  }, [isOpen]);

  if (!visual || !visual.svgMarkup) {
    return (
      <section className="visual-viewer">
        <h2>{text.heading}</h2>
        <p className="visual-viewer__unavailable" role="status">
          {text.unavailable}
        </p>
      </section>
    );
  }

  function onDialogClick(e: ReactMouseEvent<HTMLDialogElement>) {
    // A click that lands on the ::backdrop (rendered by the browser
    // outside the dialog's own content box) reports the dialog element
    // itself as the event target; a click on anything actually inside the
    // dialog's rendered content reports that descendant instead. The
    // inner content wrapper's own stopPropagation below is a second,
    // redundant guard against relying on that target semantics alone.
    if (e.target === dialogRef.current) {
      close();
    }
  }

  return (
    <section className="visual-viewer">
      <h2>{text.heading}</h2>
      <p className="visual-viewer__draft-note">{text.draftNote}</p>

      {!isOpen && (
        <div className="visual-viewer__preview">
          <div
            className="visual-viewer__svg-frame"
            // Raw, unmodified SVG markup from the canonical source file —
            // preserves the SVG's own role/title/desc/direction metadata
            // and its internal draft footer exactly as authored.
            dangerouslySetInnerHTML={{ __html: visual.svgMarkup }}
          />
          <button
            type="button"
            ref={triggerRef}
            className="visual-viewer__enlarge"
            onClick={() => setIsOpen(true)}
          >
            {text.enlarge}
          </button>
        </div>
      )}

      {isOpen && (
        <dialog
          ref={dialogRef}
          className="visual-viewer__dialog"
          aria-labelledby={titleId}
          onClick={onDialogClick}
        >
          <div className="visual-viewer__dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="visual-viewer__dialog-header">
              <span id={titleId} className="visual-viewer__dialog-title">
                {text.heading}
              </span>
              <button
                type="button"
                ref={closeButtonRef}
                className="visual-viewer__close"
                onClick={close}
              >
                {text.close}
              </button>
            </div>
            <div
              className="visual-viewer__dialog-body"
              dangerouslySetInnerHTML={{ __html: visual.svgMarkup }}
            />
          </div>
        </dialog>
      )}
    </section>
  );
}
