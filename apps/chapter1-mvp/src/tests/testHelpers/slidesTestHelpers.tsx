// Shared test helper for exercising ch01-t01's Slides accordion
// (src/features/topics/Slides.tsx). Mirrors src/pages/TopicPage.tsx's
// actual generic rendering exactly — map topic.slides into SlideDescriptor
// objects, no per-slide-number conditional — so there is exactly one place
// reflecting TopicPage's real mapping, rather than one duplicated near-copy
// per slide-scoped test file. Not itself a test file (no ".test." in the
// name), so vitest's default test-file glob does not try to run it as a suite.
import { act } from "react";
import type { Root } from "react-dom/client";
import { LanguageProvider } from "../../app/LanguageContext";
import { EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC } from "../../content/equationRenderer";
import { SlidesSection } from "../../features/topics/Slides";
import { StructuredSlideContent } from "../../features/topics/StructuredSlideContent";
import type { NormalizedTopic } from "../../types/normalized";

export function renderGenericSlides(
  root: Root,
  topic: NormalizedTopic,
  arabic: boolean,
  options?: { anchorId?: string },
) {
  window.localStorage.setItem("phsh111:language", arabic ? "ar" : "en");
  const proseTokens = EQUATION_ITALIC_TOKENS_PROSE_SAFE_BY_TOPIC[topic.topicId] ?? [];
  act(() => {
    root.render(
      <LanguageProvider>
        <SlidesSection
          topicId={topic.topicId}
          anchorId={options?.anchorId ?? "topic-opening"}
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
                italicTokens={proseTokens}
              />
            ),
          }))}
        />
      </LanguageProvider>,
    );
  });
}

/** Clicks the header button for slide N, opening its panel (and closing whichever was open). */
export function openSlideByNumber(container: HTMLElement, slideNumber: number): void {
  const header = container.querySelector<HTMLButtonElement>(`#slide-${slideNumber}-header`);
  if (!header) throw new Error(`No accordion header button found for slide ${slideNumber}`);
  act(() => {
    header.click();
  });
}

export function getSlideHeader(container: HTMLElement, slideNumber: number): HTMLButtonElement | null {
  return container.querySelector<HTMLButtonElement>(`#slide-${slideNumber}-header`);
}

export function getSlidePanel(container: HTMLElement, slideNumber: number): HTMLElement | null {
  return container.querySelector<HTMLElement>(`#slide-${slideNumber}-panel`);
}
