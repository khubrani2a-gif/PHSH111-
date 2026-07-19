import { useState } from "react";
import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import { readPersistedBoolean, writePersistedBoolean } from "../../app/persistedState";
import type { NormalizedSection } from "../../types/normalized";

const LABELS = {
  en: {
    heading: "Review Card",
    badge: "Self-check",
    missing: "No English text is available for this review card.",
  },
  ar: {
    heading: "بطاقة مراجعة",
    badge: "تقييم ذاتي",
    missing: "لا يتوفر نص عربي لبطاقة المراجعة.",
  },
} as const;

const REVEAL_LABELS = {
  en: { show: "Show answer", hide: "Hide answer" },
  ar: { show: "إظهار الإجابة", hide: "إخفاء الإجابة" },
} as const;

interface ReviewQuestionProps {
  section: NormalizedSection;
  /** Prose-safe italic-variable whitelist (see src/content/equationRenderer.tsx) — review-question text is natural-language prose, not bare symbolic notation. */
  italicTokens?: readonly string[];
  /**
   * One exact, per-language, per-topic-verified marker string (e.g.
   * "Correct answer:" / "الإجابة الصحيحة:") already present verbatim in
   * the authored text, at which the answer is hidden behind a show/hide
   * toggle. Omit to keep the default behavior below (full text always
   * shown, no toggle) — this is NOT a generic split rule; see this
   * component's header comment for why a shared, un-verified split would
   * be unsafe, and src/pages/TopicPage.tsx for the one verified marker
   * pair currently supplied (ch01-t01 only).
   */
  revealMarker?: { en: string; ar: string };
  /** localStorage key for the answer-reveal state; omit to keep it session-only. */
  persistKey?: string;
}

/**
 * Renders a topic's canonical `reviewQuestion` content block. Displayed
 * under the label "Review Card" / "بطاقة مراجعة" (a Phase 4/5 project-owner
 * relabeling — see docs/app/PHSH111_OWNER_REVIEW_PACKET.md §8 and
 * docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json's decision
 * record) chosen because the component always shows the answer inline
 * rather than withholding it, so "Card" avoids implying an unanswered
 * question. This is a display-label change only — the canonical blockType
 * and schema field name remain `reviewQuestion` throughout the adapter and
 * normalized model; only `LABELS` below changed.
 *
 * Only ever called with a section whose source visibility already permits learner
 * presentation (src/content/adapter.ts only populates
 * NormalizedTopic.reviewQuestion in that case) — an instructor-only
 * reviewQuestion is never routed through this component; it surfaces
 * instead inside InstructorReviewPanel, same as any other instructor-only
 * contentBlock.
 *
 * The canonical reviewQuestion text is a single authored prose block that
 * already contains the question, the correct answer, AND its explanation
 * together (verified across all four topics' actual JSON — there is no
 * separate question-only / answer-only field in this blockType, unlike the
 * `problem` record's genuinely separate problemStatement vs.
 * numberedSolution/finalAnswer). Splitting this one string into a
 * hide/reveal pair would require guessing where "the answer" starts —
 * the wording differs per topic and per language ("Correct answer:",
 * "Correct answers:", "الإجابة الصحيحة:", "الإجابتان الصحيحتان:") — and
 * that guess would be an invented structural boundary, not something
 * explicitly present in the record. This component therefore renders the
 * full text exactly as authored, with no reveal interaction, and
 * deliberately does not reuse ProblemCard/SolutionReveal, whose reveal
 * behavior is built on the `problem` record's own genuinely separate
 * fields.
 *
 * `revealMarker` is a narrow, opt-in exception to the paragraph above: for
 * ch01-t01 only, the literal marker text "Correct answer:" / "الإجابة
 * الصحيحة:" was directly verified (by inspection, not inferred) to occur
 * exactly once in that one topic's actual authored text, in both
 * languages. When supplied, everything from that exact substring onward
 * is hidden behind a show/hide toggle; nothing before or after it is
 * summarized, reworded, or dropped — the shown and hidden slices
 * concatenate back to the original string exactly. Every other topic
 * (revealMarker omitted) keeps the always-shown, no-toggle behavior
 * described above, unchanged.
 */
export function ReviewQuestion({
  section,
  italicTokens = [],
  revealMarker,
  persistKey,
}: ReviewQuestionProps) {
  const { language, direction } = useLanguage();
  const text = LABELS[language];
  const revealText = REVEAL_LABELS[language];
  const value = section.text[language];

  const marker = revealMarker?.[language];
  const markerIndex = marker && value ? value.indexOf(marker) : -1;
  const hasAnswerToggle = markerIndex >= 0;
  const questionPart = hasAnswerToggle ? value!.slice(0, markerIndex) : value;
  const answerPart = hasAnswerToggle ? value!.slice(markerIndex) : null;

  const [revealed, setRevealed] = useState<boolean>(() =>
    persistKey ? readPersistedBoolean(persistKey, false) : false,
  );

  function toggleRevealed() {
    setRevealed((current) => {
      const next = !current;
      if (persistKey) writePersistedBoolean(persistKey, next);
      return next;
    });
  }

  return (
    <section
      className="review-question"
      aria-labelledby="review-card-heading"
      data-record-id={section.recordId}
    >
      <div className="review-question__header">
        <h2 id="review-card-heading">{text.heading}</h2>
        <span className="review-question__badge">{text.badge}</span>
      </div>
      {value ? (
        <>
          <p className="review-question__text" dir={direction}>
            {renderEquationText(questionPart!, italicTokens)}
          </p>
          {hasAnswerToggle && (
            <>
              <button
                type="button"
                className="review-question__reveal-toggle"
                aria-expanded={revealed}
                onClick={toggleRevealed}
              >
                {revealed ? revealText.hide : revealText.show}
              </button>
              {revealed && (
                <p className="review-question__text review-question__answer" dir={direction}>
                  {renderEquationText(answerPart!, italicTokens)}
                </p>
              )}
            </>
          )}
        </>
      ) : (
        <p className="review-question__missing" role="status">
          {text.missing}
        </p>
      )}
    </section>
  );
}
