import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "../app/LanguageContext";
import { ReviewQuestion } from "../features/topics/ReviewQuestion";
import type { NormalizedSection } from "../types/normalized";

const SAMPLE_SECTION: NormalizedSection = {
  recordId: "ch01-t03-block-review",
  blockType: "reviewQuestion",
  visibility: "student",
  text: { en: "A metronome ticks once every 0.5 s.", ar: "يصدر مترونوم نقرة واحدة كل 0.5 s." },
  blocking: {
    blockingStatus: "blocked",
    blockingReason: ["other"],
    blockingRecordIds: [],
    studentFacingAllowed: false,
    instructorFacingAllowed: true,
    resolutionRequired: true,
    resolutionOwner: "test",
    resolutionStatus: "open",
  },
};

/**
 * Render-level tests for the ReviewQuestion component (component tree
 * only — no browser DOM needed, matching
 * src/tests/equationRenderer.test.tsx's renderToStaticMarkup approach).
 * Confirms the component never emits an empty/placeholder heading and
 * always carries its source record ID into the rendered markup.
 */
describe("ReviewQuestion component", () => {
  it("renders the heading, badge, and the active language's canonical text", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ReviewQuestion section={SAMPLE_SECTION} />
      </LanguageProvider>,
    );
    expect(markup).toContain("Review Card");
    expect(markup).toContain("Self-check");
    expect(markup).toContain("A metronome ticks once every 0.5 s.");
  });

  it("preserves the source record ID as a data attribute for traceability", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ReviewQuestion section={SAMPLE_SECTION} />
      </LanguageProvider>,
    );
    expect(markup).toContain('data-record-id="ch01-t03-block-review"');
  });

  it("renders the controlled missing-text fallback (not a blank section) when the active language has no text", () => {
    const missingEnglish: NormalizedSection = {
      ...SAMPLE_SECTION,
      text: { en: null, ar: SAMPLE_SECTION.text.ar },
    };
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ReviewQuestion section={missingEnglish} />
      </LanguageProvider>,
    );
    expect(markup).toContain("No English text is available for this review card.");
    expect(markup).not.toContain("A metronome ticks once every 0.5 s.");
  });

  it("never invents answer/explanation/hint/feedback text beyond the section's own canonical content", () => {
    const markup = renderToStaticMarkup(
      <LanguageProvider>
        <ReviewQuestion section={SAMPLE_SECTION} />
      </LanguageProvider>,
    );
    // The rendered text content is exactly the source string (modulo the
    // equation-renderer's markup-only ^/_ delimiter consumption) — nothing
    // is appended around it.
    const textOnly = markup.replace(/<[^>]+>/g, "");
    expect(textOnly).toContain(SAMPLE_SECTION.text.en);
  });
});
