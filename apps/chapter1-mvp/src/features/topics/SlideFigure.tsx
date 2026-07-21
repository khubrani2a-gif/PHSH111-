import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useLanguage } from "../../app/LanguageContext";
import type { NormalizedText } from "../../types/normalized";

const LABELS = {
  en: { enlarge: "Enlarge figure", close: "Close enlarged figure" },
  ar: { enlarge: "تكبير الشكل", close: "إغلاق الشكل المكبّر" },
} as const;

interface SlideFigureProps {
  assetUrl: string;
  alt: NormalizedText;
}

/**
 * Renders a slide's embedded raster figure (a photo, not an SVG diagram —
 * see NormalizedSlide.figure) as a responsive, enlargeable, accessible
 * image, generic to any slide that carries one. Reuses the exact
 * accessible-dialog approach already proven by VisualViewer.tsx (native
 * <dialog> + showModal(), explicit close()-driven state sync, Escape
 * handling, focus return to the opener) — see that component's header
 * comment for why those specific choices were made. This component only
 * differs in rendering a plain <img> instead of raw SVG markup, since a
 * photo has no internal markup to preserve.
 */
export function SlideFigure({ assetUrl, alt }: SlideFigureProps) {
  const { language, direction } = useLanguage();
  const text = LABELS[language];
  const altText = alt[language] ?? "";
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

  useEffect(() => {
    if (isOpen || !hasOpenedRef.current) return;
    triggerRef.current?.focus();
  }, [isOpen]);

  function onDialogClick(e: ReactMouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      close();
    }
  }

  return (
    <div className="slide-figure">
      {!isOpen && (
        <div className="slide-figure__preview">
          <img className="slide-figure__img" src={assetUrl} alt={altText} />
          <button
            type="button"
            ref={triggerRef}
            className="slide-figure__enlarge"
            onClick={() => setIsOpen(true)}
          >
            {text.enlarge}
          </button>
        </div>
      )}

      {isOpen && (
        <dialog
          ref={dialogRef}
          className="slide-figure__dialog"
          aria-labelledby={titleId}
          dir={direction}
          onClick={onDialogClick}
        >
          <div className="slide-figure__dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="slide-figure__dialog-header">
              <span id={titleId} className="slide-figure__dialog-title">
                {altText}
              </span>
              <button
                type="button"
                ref={closeButtonRef}
                className="slide-figure__close"
                onClick={close}
              >
                {text.close}
              </button>
            </div>
            <div className="slide-figure__dialog-body">
              <img className="slide-figure__dialog-img" src={assetUrl} alt={altText} />
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
