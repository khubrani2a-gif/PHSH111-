import { useEffect, useRef } from "react";
import { SlideNavigator, type SlideNavigatorProps } from "./SlideNavigator";

const OPEN_BUTTON_LABEL = { en: "☰ Slides", ar: "☰ الشرائح" } as const;
const CLOSE_LABEL = { en: "Close slide list", ar: "إغلاق قائمة الشرائح" } as const;
const DRAWER_LABEL = { en: "All slides", ar: "كل الشرائح" } as const;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface SlideNavigatorDrawerProps extends Omit<SlideNavigatorProps, "className"> {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Mobile replacement for the desktop sidebar — a "☰ Slides" button opens
 * a focus-trapping drawer containing the exact same grouped
 * <SlideNavigator/> the desktop sidebar renders (see that component's own
 * header comment). Escape closes it; closing returns focus to the
 * trigger button.
 */
export function SlideNavigatorDrawer({ open, onOpen, onClose, ...navigatorProps }: SlideNavigatorDrawerProps) {
  const { language } = navigatorProps;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    firstFocusable?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) triggerRef.current?.focus();
  }, [open]);

  return (
    <div className="slide-navigator-drawer">
      <button
        type="button"
        ref={triggerRef}
        className="slide-navigator-drawer__trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={onOpen}
      >
        {OPEN_BUTTON_LABEL[language]}
      </button>

      {open ? (
        <div className="slide-navigator-drawer__overlay" onClick={onClose}>
          <div
            className="slide-navigator-drawer__panel"
            role="dialog"
            aria-modal="true"
            aria-label={DRAWER_LABEL[language]}
            ref={panelRef}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="slide-navigator-drawer__close" onClick={onClose}>
              <span aria-hidden="true">×</span>
              <span className="visually-hidden">{CLOSE_LABEL[language]}</span>
            </button>
            <SlideNavigator
              {...navigatorProps}
              onSelect={(slideNumber) => {
                navigatorProps.onSelect(slideNumber);
                onClose();
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
