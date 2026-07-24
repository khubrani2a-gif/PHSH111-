import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../../app/LanguageContext";
import { readPersistedString, writePersistedString } from "../../../app/persistedState";
import {
  completionProgress,
  isCompleted,
  readTopicLearningState,
  withCompleted,
  withIncomplete,
  withViewed,
  writeTopicLearningState,
  type TopicLearningState,
} from "../../../app/slideProgress";
import { resolveSlideGroups } from "../../../content/slideGroups";
import type { NormalizedSlide } from "../../../types/normalized";
import type { PilotTopicId } from "../../../types/pilotSchema";
import { StructuredSlideContent } from "../StructuredSlideContent";
import { buildSlideNavigatorEntries, SlideNavigator } from "./SlideNavigator";
import { SlideNavigatorDrawer } from "./SlideNavigatorDrawer";
import { SlideReaderFooter } from "./SlideReaderFooter";
import { SlideReaderHeader } from "./SlideReaderHeader";
import { SlideSectionNav, type SlideSectionNavEntry } from "./SlideSectionNav";
import type { SlideDisplayMode } from "./SlideViewModeToggle";

const SLIDE_QUERY_PARAM = "slide";

export interface SlideReaderProps {
  topicId: PilotTopicId;
  topicTitle: string;
  slides: NormalizedSlide[];
  proseTokens: readonly string[];
  /** Receives the active slide's recordId, so the caller can hand it off to the accordion's own persisted "open slide" key before switching views — see SlidesExperience. */
  onViewAllSlides: (activeRecordId: string) => void;
  /** Slide number to open on mount — used when returning from "View All Slides" so the active slide carries over. Falls back to the reader's own persisted last-viewed slide, then slide 1. */
  initialSlideNumber?: number;
}

/**
 * Focused, single-slide learning reader — the default Slides experience
 * (see src/features/topics/SlidesExperience.tsx). Renders exactly one
 * slide's StructuredSlideContent at a time, with previous/next navigation,
 * a grouped slide navigator (sidebar on desktop, drawer on mobile),
 * Study/Review display modes, and a persisted per-slide learning-progress
 * model (src/app/slideProgress.ts) distinguishing "viewed" from
 * explicitly "completed". The pre-existing accordion (Slides.tsx) is left
 * completely unmodified and remains reachable via "View All Slides".
 */
export function SlideReader({ topicId, topicTitle, slides, proseTokens, onViewAllSlides, initialSlideNumber }: SlideReaderProps) {
  const { language, direction } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const slideNumbers = slides.map((s) => s.slideNumber);
  const lastSlideKey = `${topicId}.reader.lastSlideNumber`;

  const rawParam = searchParams.get(SLIDE_QUERY_PARAM);
  const parsedParam = rawParam !== null ? Number(rawParam) : NaN;
  const paramIsValid = Number.isInteger(parsedParam) && slideNumbers.includes(parsedParam);

  const fallbackSlideNumber = (() => {
    if (initialSlideNumber !== undefined && slideNumbers.includes(initialSlideNumber)) return initialSlideNumber;
    const persisted = Number(readPersistedString(lastSlideKey, ""));
    if (Number.isInteger(persisted) && slideNumbers.includes(persisted)) return persisted;
    return slideNumbers[0] ?? 1;
  })();

  const activeSlideNumber = paramIsValid ? parsedParam : fallbackSlideNumber;
  const activeIndex = slideNumbers.indexOf(activeSlideNumber);
  const activeSlide = slides[activeIndex] ?? slides[0];

  const [mode, setMode] = useState<SlideDisplayMode>(() => {
    const stored = readPersistedString(`${topicId}.reader.mode`, "study");
    return stored === "review" ? "review" : "study";
  });

  const [learningState, setLearningState] = useState<TopicLearningState>(() => readTopicLearningState(topicId));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sectionEntries, setSectionEntries] = useState<SlideSectionNavEntry[]>([]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasMountedRef = useRef(false);

  // Correct a missing/invalid ?slide= param without adding a history
  // entry — this is the "fall back safely" behavior, distinct from the
  // pushed history entries real navigation creates below.
  useEffect(() => {
    if (!paramIsValid) {
      const next = new URLSearchParams(searchParams);
      next.set(SLIDE_QUERY_PARAM, String(fallbackSlideNumber));
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramIsValid, fallbackSlideNumber]);

  useEffect(() => {
    if (paramIsValid) writePersistedString(lastSlideKey, String(activeSlideNumber));
  }, [activeSlideNumber, paramIsValid, lastSlideKey]);

  useEffect(() => {
    writePersistedString(`${topicId}.reader.mode`, mode);
  }, [mode, topicId]);

  // Opening a slide marks it viewed only — never completed (see
  // src/app/slideProgress.ts's header comment). Persisted immediately so
  // a reload never loses progress.
  useEffect(() => {
    if (!activeSlide) return;
    setLearningState((prev) => withViewed(prev, activeSlide.recordId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide?.recordId]);

  useEffect(() => {
    writeTopicLearningState(topicId, learningState);
  }, [learningState, topicId]);

  // Focus the slide heading after a real navigation (never on first
  // mount, which would steal focus from wherever the page already was) —
  // preventScroll avoids a disruptive extra scroll jump on top of the
  // already-smooth in-page section behavior.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [activeSlideNumber]);

  // Builds the in-slide section bar from the actual rendered
  // StructuredSlideContent DOM (its own per-section `id`/heading markup —
  // see that component's header comment), never a hardcoded per-slide
  // list. A section that always renders its wrapper even when empty
  // (Common Misconception / Scientific Note when a slide's own text has
  // no content for it) is excluded by checking for a rendered child
  // beyond the heading itself.
  useLayoutEffect(() => {
    const container = contentRef.current;
    if (!container) {
      setSectionEntries([]);
      return;
    }
    const sectionEls = Array.from(container.querySelectorAll<HTMLElement>(".structured-slide__section[id]"));
    const entries = sectionEls
      .filter((el) => el.children.length > 1)
      .map((el) => {
        const heading = el.querySelector(".structured-slide__heading");
        const label = heading?.textContent?.trim();
        return label ? { id: el.id, label } : null;
      })
      .filter((entry): entry is SlideSectionNavEntry => entry !== null);
    setSectionEntries(entries);
  }, [activeSlideNumber, mode, language]);

  function goToSlide(slideNumber: number) {
    const next = new URLSearchParams(searchParams);
    next.set(SLIDE_QUERY_PARAM, String(slideNumber));
    setSearchParams(next, { replace: false });
  }

  function goPrevious() {
    if (activeIndex > 0) goToSlide(slideNumbers[activeIndex - 1]);
  }

  function goNext() {
    if (activeIndex < slideNumbers.length - 1) goToSlide(slideNumbers[activeIndex + 1]);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isFormField =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        target?.getAttribute?.("contenteditable") === "true";
      if (isFormField) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, slideNumbers]);

  function toggleCompleted() {
    if (!activeSlide) return;
    setLearningState((prev) =>
      isCompleted(prev, activeSlide.recordId) ? withIncomplete(prev, activeSlide.recordId) : withCompleted(prev, activeSlide.recordId),
    );
  }

  if (!activeSlide) return null;

  const groups = resolveSlideGroups(topicId, slideNumbers);
  const entriesBySlideNumber = buildSlideNavigatorEntries(slides, language);
  const { percent } = completionProgress(
    learningState,
    slides.map((s) => s.recordId),
  );

  return (
    <div className="slide-reader" dir={direction}>
      <SlideReaderHeader
        topicTitle={topicTitle}
        currentSlideNumber={activeSlideNumber}
        totalSlides={slides.length}
        percent={percent}
        mode={mode}
        onModeChange={setMode}
        onViewAllSlides={() => {
          writePersistedString(lastSlideKey, String(activeSlideNumber));
          onViewAllSlides(activeSlide.recordId);
        }}
        language={language}
        headingRef={headingRef}
      />

      <div className="slide-reader__mobile-navigator">
        <SlideNavigatorDrawer
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
          groups={groups}
          entriesBySlideNumber={entriesBySlideNumber}
          currentSlideNumber={activeSlideNumber}
          learningState={learningState}
          language={language}
          onSelect={goToSlide}
        />
      </div>

      <div className="slide-reader__body">
        <div className="slide-reader__sidebar">
          <SlideNavigator
            groups={groups}
            entriesBySlideNumber={entriesBySlideNumber}
            currentSlideNumber={activeSlideNumber}
            learningState={learningState}
            language={language}
            onSelect={goToSlide}
          />
        </div>

        <div className="slide-reader__content" ref={contentRef}>
          <SlideSectionNav entries={sectionEntries} language={language} />
          <div className="slide-reader__slide-title">
            {activeSlide.title[language] ?? ""}
          </div>
          <StructuredSlideContent
            blockId={activeSlide.recordId}
            text={activeSlide.text}
            table={activeSlide.table}
            figure={activeSlide.figure}
            definitions={activeSlide.definitions}
            italicTokens={proseTokens}
            compact={mode === "review"}
          />
        </div>
      </div>

      <SlideReaderFooter
        onPrevious={goPrevious}
        onNext={goNext}
        hasPrevious={activeIndex > 0}
        hasNext={activeIndex < slideNumbers.length - 1}
        completed={isCompleted(learningState, activeSlide.recordId)}
        onToggleCompleted={toggleCompleted}
        language={language}
      />
    </div>
  );
}
