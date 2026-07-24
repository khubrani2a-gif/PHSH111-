import type { RefObject } from "react";
import type { Language } from "../../../types/language";
import { SlideProgressBar } from "./SlideProgressBar";
import { SlideViewModeToggle, type SlideDisplayMode } from "./SlideViewModeToggle";

const SLIDE_OF_TOTAL_LABEL = {
  en: (n: number, total: number) => `Slide ${n} of ${total}`,
  ar: (n: number, total: number) => `الشريحة ${n} من ${total}`,
} as const;

const VIEW_ALL_SLIDES_LABEL = { en: "View All Slides", ar: "عرض كل الشرائح" } as const;
const READER_HEADING_LABEL = { en: "Slide reader", ar: "قارئ الشرائح" } as const;

export interface SlideReaderHeaderProps {
  topicTitle: string;
  currentSlideNumber: number;
  totalSlides: number;
  percent: number;
  mode: SlideDisplayMode;
  onModeChange: (mode: SlideDisplayMode) => void;
  onViewAllSlides: () => void;
  language: Language;
  /** Focus target after a slide change — see SlideReader's header comment on focus management. */
  headingRef?: RefObject<HTMLHeadingElement>;
}

export function SlideReaderHeader({
  topicTitle,
  currentSlideNumber,
  totalSlides,
  percent,
  mode,
  onModeChange,
  onViewAllSlides,
  language,
  headingRef,
}: SlideReaderHeaderProps) {
  return (
    <header className="slide-reader__header">
      <div className="slide-reader__header-row">
        <h2 className="slide-reader__topic-title" tabIndex={-1} ref={headingRef}>
          {topicTitle}
        </h2>
        <span className="slide-reader__slide-of-total">
          {SLIDE_OF_TOTAL_LABEL[language](currentSlideNumber, totalSlides)}
        </span>
      </div>
      <div className="slide-reader__header-row slide-reader__header-row--controls">
        <SlideProgressBar percent={percent} language={language} />
        <div className="slide-reader__header-actions">
          {/* Language control already exists globally (AppShell's app-header, every route) — not duplicated here, per the "avoid duplicating navigation controls" guidance. */}
          <SlideViewModeToggle mode={mode} onChange={onModeChange} language={language} />
          <button type="button" className="slide-reader__view-all-btn" onClick={onViewAllSlides}>
            {VIEW_ALL_SLIDES_LABEL[language]}
          </button>
        </div>
      </div>
      <span className="visually-hidden">{READER_HEADING_LABEL[language]}</span>
    </header>
  );
}
