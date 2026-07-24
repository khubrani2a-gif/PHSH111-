import { useState } from "react";
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
 */
export function SlidesExperience({ topic, anchorId }: { topic: NormalizedTopic; anchorId?: string }) {
  const { language } = useLanguage();
  const viewModeKey = `${topic.topicId}.slides.viewMode`;
  const openRecordIdKey = `${topic.topicId}.slides.openRecordId`;

  const [viewMode, setViewMode] = useState<SlidesViewMode>(() => {
    const stored = readPersistedString(viewModeKey, "reader");
    return stored === "all" ? "all" : "reader";
  });

  if (topic.slides.length === 0) return null;

  const proseTokens = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC[topic.topicId] ?? [];

  if (viewMode === "all") {
    return (
      <div className="slides-experience slides-experience--all">
        <button
          type="button"
          className="slides-experience__return-to-reader"
          onClick={() => {
            writePersistedString(viewModeKey, "reader");
            setViewMode("reader");
          }}
        >
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
