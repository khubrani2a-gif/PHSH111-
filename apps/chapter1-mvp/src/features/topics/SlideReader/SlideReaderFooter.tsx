import type { Language } from "../../../types/language";

const PREVIOUS_LABEL = { en: "Previous", ar: "السابقة" } as const;
const NEXT_LABEL = { en: "Next", ar: "التالية" } as const;
const MARK_COMPLETE_LABEL = { en: "Mark as Completed", ar: "تحديد كمكتملة" } as const;
const MARK_INCOMPLETE_LABEL = { en: "Mark as Incomplete", ar: "تحديد كغير مكتملة" } as const;
const COMPLETED_LABEL = { en: "✓ Completed", ar: "✓ مكتملة" } as const;
const FOOTER_NAV_LABEL = { en: "Slide reader navigation", ar: "التنقل في قارئ الشرائح" } as const;

export interface SlideReaderFooterProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  completed: boolean;
  onToggleCompleted: () => void;
  language: Language;
}

/**
 * Sticky bottom navigation. Bottom padding for the space this occupies is
 * applied by SlideReader to the actual scrolling content container (see
 * that component's own comment), never just to an outer wrapper, so the
 * final slide's content is never hidden behind this footer.
 */
export function SlideReaderFooter({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  completed,
  onToggleCompleted,
  language,
}: SlideReaderFooterProps) {
  return (
    <nav className="slide-reader-footer" aria-label={FOOTER_NAV_LABEL[language]}>
      <button type="button" className="slide-reader-footer__btn slide-reader-footer__btn--prev" disabled={!hasPrevious} onClick={onPrevious}>
        {PREVIOUS_LABEL[language]}
      </button>
      <button
        type="button"
        className={`slide-reader-footer__btn slide-reader-footer__btn--complete${completed ? " slide-reader-footer__btn--completed" : ""}`}
        aria-pressed={completed}
        onClick={onToggleCompleted}
      >
        {completed ? COMPLETED_LABEL[language] : MARK_COMPLETE_LABEL[language]}
        <span className="visually-hidden">{completed ? ` (${MARK_INCOMPLETE_LABEL[language]})` : ""}</span>
      </button>
      <button type="button" className="slide-reader-footer__btn slide-reader-footer__btn--next" disabled={!hasNext} onClick={onNext}>
        {NEXT_LABEL[language]}
      </button>
    </nav>
  );
}
