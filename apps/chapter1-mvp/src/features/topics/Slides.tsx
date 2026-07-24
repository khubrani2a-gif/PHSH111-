import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLanguage } from "../../app/LanguageContext";
import {
  readPersistedStringArray,
  writePersistedStringArray,
  readPersistedNullableString,
  writePersistedNullableString,
} from "../../app/persistedState";
import { resolveSlideShortTitle } from "../../content/slideShortTitles";

const SLIDES_LABEL = { en: "Slides", ar: "الشرائح" } as const;

const SLIDE_LABEL = {
  en: (n: number, title: string) => `Slide ${n} — ${title}`,
  ar: (n: number, title: string) => `الشريحة ${n} — ${title}`,
} as const;

const EXPAND_INDICATOR_LABEL = {
  en: (open: boolean) => (open ? "Collapse" : "Expand"),
  ar: (open: boolean) => (open ? "طيّ" : "توسيع"),
} as const;

const VIEWED_BADGE_LABEL = { en: "Viewed", ar: "تمت مشاهدتها" } as const;

const JUMP_LABEL = { en: "Jump to slide", ar: "الانتقال إلى شريحة" } as const;

const JUMP_OPTION_LABEL = {
  en: (n: number, shortTitle: string) => `Slide ${n}: ${shortTitle}`,
  ar: (n: number, shortTitle: string) => `الشريحة ${n}: ${shortTitle}`,
} as const;

const VIEWED_PROGRESS_LABEL = {
  en: (viewed: number, total: number) => `Slides viewed: ${viewed} of ${total}`,
  ar: (viewed: number, total: number) => `الشرائح المشاهدة: ${viewed} من ${total}`,
} as const;

const PREVIOUS_LABEL = { en: "Previous Slide", ar: "الشريحة السابقة" } as const;
const NEXT_LABEL = { en: "Next Slide", ar: "الشريحة التالية" } as const;
const PAGER_LABEL = { en: "Slide navigation", ar: "التنقل بين الشرائح" } as const;

const SLIDE_OF_TOTAL_LABEL = {
  en: (n: number, total: number) => `Slide ${n} of ${total}`,
  ar: (n: number, total: number) => `الشريحة ${n} من ${total}`,
} as const;

export interface SlideDescriptor {
  /** Stable record ID, used as the React key and every persistence/ARIA id. */
  recordId: string;
  /** 1-based slide number, used for "Slide N — title" and pager text. */
  slideNumber: number;
  /** Existing full bilingual title (topic.slides[].title) — shown verbatim inside the expanded panel, unmodified. */
  title: { en: string; ar: string };
  /** The slide's instructional body (e.g. <StructuredSlideContent>). */
  content: ReactNode;
}

interface SlidesSectionProps {
  /** Used to namespace this topic's persisted accordion state (e.g. "ch01-t01"), so a future topic with its own slides never collides with another topic's saved state. */
  topicId: string;
  /** Every slide in display order — the accordion is built entirely by mapping over this collection; adding a slide here requires no change to this component. */
  slides: SlideDescriptor[];
  /** Optional anchor id for the reading guide / scroll-to-section navigation, placed on the section itself (not tied to any one slide's open/closed state). */
  anchorId?: string;
}

function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

/**
 * A single-open accordion for a topic's ordered slide collection. Built
 * entirely by mapping over `slides` — no per-slide-number branch, no
 * hardcoded slide count — so a future Slide 6, 7, ... is automatically
 * supported by adding another entry to topic.slides, with no change here.
 *
 * State (which slide is open, and which slides have ever been opened) is
 * local React state, persisted to localStorage per
 * MVP_IMPLEMENTATION_DECISIONS.json amendments[0]/[1] — a UI display
 * preference only, never treated as assessment or completion tracking.
 */
export function SlidesSection({ topicId, slides, anchorId }: SlidesSectionProps) {
  const { language } = useLanguage();
  const slideIds = useMemo(() => slides.map((s) => s.recordId), [slides]);
  const persistKeyOpen = `${topicId}.slides.openRecordId`;
  const persistKeyViewed = `${topicId}.slides.viewedRecordIds`;

  const [openId, setOpenId] = useState<string | null>(() => {
    const stored = readPersistedNullableString(persistKeyOpen, "openSlideId");
    // Never stored (first-ever visit to this topic): default to the first
    // slide open, matching this accordion's long-standing default-open
    // behavior for a brand-new visitor.
    if (!stored.present) return slideIds[0] ?? null;
    // Explicitly stored as closed (the user collapsed the open slide and
    // left): stay collapsed — this is the whole point of the nullable
    // model, distinct from "never stored" above.
    if (stored.value === null) return null;
    // A valid, still-existing slide id: restore it. An invalid/obsolete id
    // (e.g. topic content was regenerated) falls back to the same default
    // as "never stored", rather than crashing or opening nothing.
    return slideIds.includes(stored.value) ? stored.value : (slideIds[0] ?? null);
  });

  const [viewedIds, setViewedIds] = useState<Set<string>>(() => {
    const persisted = new Set(readPersistedStringArray(persistKeyViewed, []));
    if (openId) persisted.add(openId);
    return persisted;
  });

  useEffect(() => {
    writePersistedNullableString(persistKeyOpen, "openSlideId", openId);
  }, [openId, persistKeyOpen]);

  useEffect(() => {
    writePersistedStringArray(persistKeyViewed, Array.from(viewedIds));
  }, [viewedIds, persistKeyViewed]);

  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  function registerHeaderRef(id: string, el: HTMLButtonElement | null) {
    if (el) headerRefs.current.set(id, el);
    else headerRefs.current.delete(id);
  }

  function markViewed(id: string) {
    setViewedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  /** Always opens the given slide, regardless of what's currently open (or nothing). Used by Previous/Next and the jump selector — never a toggle, so it works correctly even when every slide is currently collapsed. */
  function openSlide(id: string, options?: { moveFocus?: boolean }) {
    setOpenId(id);
    markViewed(id);
    if (options?.moveFocus) {
      const header = headerRefs.current.get(id);
      if (header) {
        try {
          if (typeof header.scrollIntoView === "function") {
            header.scrollIntoView({
              behavior: prefersReducedMotion() ? "auto" : "smooth",
              block: "start",
            });
          }
        } catch {
          // Best-effort only — never block focus movement on a scroll failure.
        }
        header.focus();
      }
    }
  }

  /**
   * Header-click behavior only: opens a closed slide, switches to a
   * different slide (closing whichever was open), or — the fix this
   * function exists for — closes the given slide if it's the one
   * currently open, leaving zero slides open. `wasOpen` is the caller's
   * already-computed `isOpen` for this slide at render time, so viewed
   * status is only marked when this click is actually opening it, never
   * when it's closing it.
   */
  function toggleSlide(id: string, wasOpen: boolean) {
    setOpenId((current) => (current === id ? null : id));
    if (!wasOpen) markViewed(id);
  }

  return (
    <section className="slides-section" aria-labelledby="slides-heading" id={anchorId}>
      <h2 id="slides-heading">{SLIDES_LABEL[language]}</h2>

      <div className="slides-section__toolbar">
        <div className="slides-section__jump">
          <label htmlFor="slides-jump-select">{JUMP_LABEL[language]}</label>
          <select
            id="slides-jump-select"
            value={openId ?? ""}
            onChange={(e) => {
              if (e.target.value) openSlide(e.target.value, { moveFocus: true });
            }}
          >
            {slides.map((slide) => (
              <option key={slide.recordId} value={slide.recordId}>
                {JUMP_OPTION_LABEL[language](
                  slide.slideNumber,
                  resolveSlideShortTitle(slide.recordId, language, slide.title[language] || `Slide ${slide.slideNumber}`),
                )}
              </option>
            ))}
          </select>
        </div>
        <p className="slides-section__progress" role="status" aria-live="polite">
          {VIEWED_PROGRESS_LABEL[language](viewedIds.size, slides.length)}
        </p>
      </div>

      <div className="slides-section__list">
        {slides.map((slide, index) => {
          const isOpen = slide.recordId === openId;
          const isViewed = viewedIds.has(slide.recordId);
          const headerId = `slide-${slide.slideNumber}-header`;
          const panelId = `slide-${slide.slideNumber}-panel`;
          const shortTitle = resolveSlideShortTitle(
            slide.recordId,
            language,
            slide.title[language] || `Slide ${slide.slideNumber}`,
          );
          const previousSlide = index > 0 ? slides[index - 1] : undefined;
          const nextSlide = index < slides.length - 1 ? slides[index + 1] : undefined;

          return (
            <section key={slide.recordId} className="slide" aria-labelledby={headerId}>
              <h3 className="slide-accordion__card-heading">
                <button
                  type="button"
                  id={headerId}
                  className="slide-accordion__header"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  ref={(el) => registerHeaderRef(slide.recordId, el)}
                  onClick={() => toggleSlide(slide.recordId, isOpen)}
                >
                  <span className="slide-accordion__number" aria-hidden="true">
                    {slide.slideNumber}
                  </span>
                  <span className="slide-accordion__short-title">{shortTitle}</span>
                  {isViewed ? (
                    <span className="slide-accordion__viewed-badge">
                      <span aria-hidden="true">✓</span>
                      <span className="visually-hidden">{VIEWED_BADGE_LABEL[language]}</span>
                    </span>
                  ) : null}
                  <span className="slide-accordion__indicator" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                    <span className="visually-hidden">{EXPAND_INDICATOR_LABEL[language](isOpen)}</span>
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="slide-accordion__panel"
                hidden={!isOpen}
              >
                {isOpen ? (
                  <>
                    <p className="slide-accordion__full-title">
                      {SLIDE_LABEL[language](slide.slideNumber, slide.title[language] ?? "")}
                    </p>
                    <div className="slide__content">{slide.content}</div>
                    <nav className="slide-accordion__pager" aria-label={PAGER_LABEL[language]}>
                      <button
                        type="button"
                        className="slide-accordion__pager-btn"
                        disabled={!previousSlide}
                        onClick={() => previousSlide && openSlide(previousSlide.recordId, { moveFocus: true })}
                      >
                        {PREVIOUS_LABEL[language]}
                      </button>
                      <span className="slide-accordion__pager-progress">
                        {SLIDE_OF_TOTAL_LABEL[language](index + 1, slides.length)}
                      </span>
                      <button
                        type="button"
                        className="slide-accordion__pager-btn"
                        disabled={!nextSlide}
                        onClick={() => nextSlide && openSlide(nextSlide.recordId, { moveFocus: true })}
                      >
                        {NEXT_LABEL[language]}
                      </button>
                    </nav>
                  </>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
