import { useEffect, useRef } from "react";
import type { Language } from "../../../types/language";
import type { SlideGroup } from "../../../content/slideGroups";
import { resolveSlideShortTitle } from "../../../content/slideShortTitles";
import type { TopicLearningState } from "../../../app/slideProgress";
import { isCompleted, isMastered, isViewed } from "../../../app/slideProgress";

const NAVIGATOR_LABEL = { en: "Slide navigator", ar: "متصفح الشرائح" } as const;
const VIEWED_LABEL = { en: "Viewed", ar: "تمت مشاهدتها" } as const;
const COMPLETED_LABEL = { en: "Completed", ar: "مكتملة" } as const;
const MASTERED_LABEL = { en: "Mastered", ar: "متقنة" } as const;
const NOT_STARTED_LABEL = { en: "Not started", ar: "لم تبدأ بعد" } as const;

export interface SlideNavigatorEntry {
  recordId: string;
  slideNumber: number;
  shortTitle: string;
}

export interface SlideNavigatorProps {
  groups: SlideGroup[];
  entriesBySlideNumber: Map<number, SlideNavigatorEntry>;
  currentSlideNumber: number;
  learningState: TopicLearningState;
  language: Language;
  onSelect: (slideNumber: number) => void;
  /** Called once the current-slide row is registered, used to auto-scroll it into view. */
  className?: string;
}

function statusLabel(recordId: string, state: TopicLearningState, language: Language): string {
  if (isMastered(state, recordId)) return MASTERED_LABEL[language];
  if (isCompleted(state, recordId)) return COMPLETED_LABEL[language];
  if (isViewed(state, recordId)) return VIEWED_LABEL[language];
  return NOT_STARTED_LABEL[language];
}

/**
 * Shared slide list used by both the desktop sidebar and the mobile
 * drawer (SlideNavigatorDrawer wraps this same component) — one place
 * renders the grouped, state-annotated slide list, so the two surfaces
 * can never drift out of sync. Groups come from
 * src/content/slideGroups.ts's resolveSlideGroups — this component never
 * hardcodes a topic's slide ranges.
 */
export function SlideNavigator({
  groups,
  entriesBySlideNumber,
  currentSlideNumber,
  learningState,
  language,
  onSelect,
  className,
}: SlideNavigatorProps) {
  const currentRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "nearest" });
  }, [currentSlideNumber]);

  return (
    <nav className={`slide-navigator${className ? ` ${className}` : ""}`} aria-label={NAVIGATOR_LABEL[language]}>
      {groups.map((group) => (
        <div className="slide-navigator__group" key={group.id}>
          <h3 className="slide-navigator__group-title">{group.title[language]}</h3>
          <ol className="slide-navigator__list">
            {group.slideNumbers.map((slideNumber) => {
              const entry = entriesBySlideNumber.get(slideNumber);
              if (!entry) return null;
              const isCurrent = slideNumber === currentSlideNumber;
              const status = statusLabel(entry.recordId, learningState, language);
              const completed = isCompleted(learningState, entry.recordId);
              const mastered = isMastered(learningState, entry.recordId);
              const viewed = isViewed(learningState, entry.recordId);
              return (
                <li key={entry.recordId} className="slide-navigator__item">
                  <button
                    type="button"
                    ref={isCurrent ? currentRef : undefined}
                    className={`slide-navigator__entry${isCurrent ? " slide-navigator__entry--current" : ""}`}
                    aria-current={isCurrent ? "true" : undefined}
                    onClick={() => onSelect(slideNumber)}
                  >
                    <span className="slide-navigator__number" aria-hidden="true">
                      {slideNumber}
                    </span>
                    <span className="slide-navigator__title">{entry.shortTitle}</span>
                    <span
                      className={`slide-navigator__status slide-navigator__status--${
                        mastered ? "mastered" : completed ? "completed" : viewed ? "viewed" : "not-started"
                      }`}
                      aria-hidden="true"
                    >
                      {mastered ? "★" : completed ? "✓" : viewed ? "●" : "○"}
                    </span>
                    <span className="visually-hidden">{status}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </nav>
  );
}

export function buildSlideNavigatorEntries(
  slides: { recordId: string; slideNumber: number; title: { en: string | null; ar: string | null } }[],
  language: Language,
): Map<number, SlideNavigatorEntry> {
  const map = new Map<number, SlideNavigatorEntry>();
  for (const slide of slides) {
    map.set(slide.slideNumber, {
      recordId: slide.recordId,
      slideNumber: slide.slideNumber,
      shortTitle: resolveSlideShortTitle(slide.recordId, language, slide.title[language] || `Slide ${slide.slideNumber}`),
    });
  }
  return map;
}
