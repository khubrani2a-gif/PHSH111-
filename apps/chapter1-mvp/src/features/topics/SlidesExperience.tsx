import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../app/LanguageContext";
import {
  readPersistedNullableString,
  readPersistedString,
  writePersistedNullableString,
  writePersistedString,
} from "../../app/persistedState";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../../content/equationRenderer";
import type { NormalizedTopic } from "../../types/normalized";
import { SlideReader } from "./SlideReader/SlideReader";
import { SlidesSection } from "./Slides";
import { StructuredSlideContent } from "./StructuredSlideContent";

const RETURN_TO_READER_LABEL = { en: "← Slide Reader", ar: "→ قارئ الشرائح" } as const;
const SLIDE_QUERY_PARAM = "slide";

type SlidesViewMode = "reader" | "all";

/**
 * Swaps between the focused single-slide reader (SlideReader, the new
 * default) and the pre-existing fully-collapsible accordion (SlidesSection,
 * left byte-for-byte unchanged) — see SlideReaderHeader's "View All
 * Slides" action and this component's own "← Slide Reader" return link.
 * The preferred mode is persisted per topic; a brand-new visitor (no
 * stored preference yet) always starts in the reader, per the reader
 * being the new default experience. Switching modes hands off the active
 * slide by writing the destination view's own persisted "which slide is
 * open" key before switching — SlidesSection's accordion-open state and
 * SlideReader's own ?slide= URL param are read fresh by whichever view
 * mounts next.
 *
 * Returning from the accordion to the reader additionally corrects the
 * `?slide=` URL param itself (not just SlideReader's `initialSlideNumber`
 * prop) at this view-switch boundary, before SlideReader mounts — see
 * handleReturnToReader below. SlideReader gives a *valid* `?slide=` param
 * precedence over `initialSlideNumber` (by design, for real in-reader
 * navigation/reload), so a stale-but-still-valid param left over from
 * before switching to the accordion would otherwise silently win over the
 * accordion-selected slide.
 */
export function SlidesExperience({ topic, anchorId }: { topic: NormalizedTopic; anchorId?: string }) {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewModeKey = `${topic.topicId}.slides.viewMode`;
  const openRecordIdKey = `${topic.topicId}.slides.openRecordId`;

  const [viewMode, setViewMode] = useState<SlidesViewMode>(() => {
    const stored = readPersistedString(viewModeKey, "reader");
    return stored === "all" ? "all" : "reader";
  });

  if (topic.slides.length === 0) return null;

  const proseTokens = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC[topic.topicId] ?? [];

  // Reads the accordion's *current* persisted open slide at click time
  // (never the render-time snapshot below, which is only used to seed
  // SlideReader's initialSlideNumber fallback) and resolves it to a slide
  // number, updating the `?slide=` URL param to match before switching
  // back to the reader — see this component's header comment for why the
  // URL param itself, not just initialSlideNumber, must be corrected
  // here. Absent/null/invalid/not-found resolves to undefined, in which
  // case the stale `slide` param is removed entirely (never set to
  // "undefined"/"NaN") so SlideReader falls back safely through its own
  // existing persisted-last-slide/first-slide logic.
  function handleReturnToReader() {
    const openRecordId = readPersistedNullableString(openRecordIdKey, "openSlideId");
    const resolvedSlideNumber =
      openRecordId.present && openRecordId.value
        ? topic.slides.find((s) => s.recordId === openRecordId.value)?.slideNumber
        : undefined;

    const nextParams = new URLSearchParams(searchParams);
    if (resolvedSlideNumber !== undefined) {
      nextParams.set(SLIDE_QUERY_PARAM, String(resolvedSlideNumber));
    } else {
      nextParams.delete(SLIDE_QUERY_PARAM);
    }
    // One coherent history operation, replacing the accordion-view URL
    // state rather than pushing a new entry — this is a navigation-state
    // correction, not a new user-facing navigation the way an in-reader
    // Next/Previous/navigator click is.
    setSearchParams(nextParams, { replace: true });

    writePersistedString(viewModeKey, "reader");
    setViewMode("reader");
  }

  if (viewMode === "all") {
    return (
      <div className="slides-experience slides-experience--all">
        <button type="button" className="slides-experience__return-to-reader" onClick={handleReturnToReader}>
          {RETURN_TO_READER_LABEL[language]}
        </button>
        <SlidesSection
          topicId={topic.topicId}
          anchorId={anchorId}
          slides={topic.slides.map((slide) => ({
            recordId: slide.recordId,
            slideNumber: slide.slideNumber,
            title: { en: slide.title.en ?? "", ar: slide.title.ar ?? "" },
            content: (
              <StructuredSlideContent
                blockId={slide.recordId}
                text={slide.text}
                table={slide.table}
                figure={slide.figure}
                definitions={slide.definitions}
                italicTokens={proseTokens}
              />
            ),
          }))}
        />
      </div>
    );
  }

  // The accordion may already have an "open" slide from a previous visit
  // (or from a hand-off performed just below) — carry it over as the
  // reader's initial slide so switching views never loses the learner's
  // place.
  const openRecordId = readPersistedNullableString(openRecordIdKey, "openSlideId");
  const initialSlideNumber =
    openRecordId.present && openRecordId.value
      ? topic.slides.find((s) => s.recordId === openRecordId.value)?.slideNumber
      : undefined;

  return (
    <div className="slides-experience slides-experience--reader" id={anchorId}>
      <SlideReader
        topicId={topic.topicId}
        topicTitle={topic.title[language] ?? ""}
        slides={topic.slides}
        proseTokens={proseTokens}
        initialSlideNumber={initialSlideNumber}
        onViewAllSlides={(activeRecordId) => {
          writePersistedNullableString(openRecordIdKey, "openSlideId", activeRecordId);
          writePersistedString(viewModeKey, "all");
          setViewMode("all");
        }}
      />
    </div>
  );
}
