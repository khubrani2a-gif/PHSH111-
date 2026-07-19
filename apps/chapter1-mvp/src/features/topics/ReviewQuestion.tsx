import { useState } from "react";
import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import { readPersistedBoolean, writePersistedBoolean } from "../../app/persistedState";
import type { NormalizedSection } from "../../types/normalized";
import type { PilotTopicId } from "../../types/pilotSchema";

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

/**
 * Single, central source of truth for every topic's answer-reveal marker
 * — never inline/scattered as a magic string at any call site. Each entry
 * is one exact, per-language, per-topic string directly verified (by
 * inspection, not inferred) to occur in that topic's actual authored
 * reviewQuestion text. Adding a topic here is itself the review step: do
 * not add one without first confirming the marker's exact wording and
 * single occurrence in that topic's real source JSON, in both languages —
 * see splitReviewAnswer below for the runtime safety net if that
 * verification was ever wrong or the source text changes later.
 *
 * TEMPORARY, ch01-t01-specific implementation choice: this is not a
 * generalized "every topic's answer looks like this" rule. A future topic
 * needs its own verified entry (or may not be able to use this feature at
 * all, if its answer isn't introduced by a single, unambiguous marker).
 */
export const REVIEW_ANSWER_MARKER_BY_TOPIC: Partial<Record<PilotTopicId, { en: string; ar: string }>> = {
  "ch01-t01": { en: "Correct answer:", ar: "الإجابة الصحيحة:" },
};

interface ReviewAnswerSplit {
  question: string;
  answer: string;
}

/**
 * Attempts to split `text` at the exact `marker` substring into a
 * question part (shown first) and an answer part (hidden behind the
 * show/hide toggle). Returns null — meaning "render the full text,
 * always visible, no toggle", the pre-existing default behavior — unless
 * ALL of the following hold, so a missing, duplicated, or malformed
 * marker can never cause content to be lost, hidden incorrectly,
 * rewritten, or reordered:
 *
 *  - the marker occurs in the text, and occurs EXACTLY ONCE (a duplicated
 *    marker is ambiguous — this never guesses "use the first one"),
 *  - there is at least one non-whitespace character before the marker
 *    (a marker at/near the very start would mean an empty "question"),
 *  - there is at least one non-whitespace character after the marker (a
 *    marker with nothing following it would mean an empty "answer").
 *
 * When it does split, `question + answer === text` exactly, character
 * for character — nothing is ever summarized, reworded, or dropped.
 */
export function splitReviewAnswer(text: string, marker: string): ReviewAnswerSplit | null {
  if (!marker) return null;
  const firstIndex = text.indexOf(marker);
  if (firstIndex < 0) return null;

  const secondIndex = text.indexOf(marker, firstIndex + marker.length);
  if (secondIndex >= 0) return null; // duplicated marker — ambiguous, don't split

  const question = text.slice(0, firstIndex);
  const answer = text.slice(firstIndex);
  if (question.trim().length === 0) return null; // marker at/near the start — no real question part
  if (answer.trim().length <= marker.trim().length) return null; // nothing follows the marker

  return { question, answer };
}

interface ReviewQuestionProps {
  section: NormalizedSection;
  /** Prose-safe italic-variable whitelist (see src/content/equationRenderer.tsx) — review-question text is natural-language prose, not bare symbolic notation. */
  italicTokens?: readonly string[];
  /**
   * A marker pair from REVIEW_ANSWER_MARKER_BY_TOPIC above (e.g.
   * REVIEW_ANSWER_MARKER_BY_TOPIC["ch01-t01"]). Omit to keep the default
   * behavior below (full text always shown, no toggle) — this is NOT a
   * generic split rule; see this component's header comment for why a
   * shared, un-verified split would be unsafe, and splitReviewAnswer's
   * own header comment for the exact safety conditions that must hold
   * before any split is actually applied at render time.
   */
  revealMarker?: { en: string; ar: string };
  /** localStorage key for the answer-reveal state (see src/app/persistedState.ts and MVP_IMPLEMENTATION_DECISIONS.json amendments[0]); omit to keep it session-only. */
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
 * ch01-t01 only (see REVIEW_ANSWER_MARKER_BY_TOPIC), the literal marker
 * text "Correct answer:" / "الإجابة الصحيحة:" was directly verified (by
 * inspection, not inferred) to occur exactly once in that one topic's
 * actual authored text, in both languages. When supplied AND
 * splitReviewAnswer's runtime safety conditions hold, everything from
 * that exact substring onward is hidden behind a show/hide toggle;
 * nothing before or after it is summarized, reworded, or dropped — the
 * shown and hidden slices concatenate back to the original string
 * exactly. If those conditions do NOT hold (marker missing, duplicated,
 * or leaving an empty question/answer side), this transparently falls
 * back to the always-shown, no-toggle behavior described above — the
 * exact same rendering as when revealMarker is omitted entirely. This is
 * a TEMPORARY, ch01-t01-specific implementation choice, not a permanent
 * general mechanism; see REVIEW_ANSWER_MARKER_BY_TOPIC's own header
 * comment before extending it to another topic.
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
  const split = marker && value ? splitReviewAnswer(value, marker) : null;
  const hasAnswerToggle = split !== null;
  const questionPart = hasAnswerToggle ? split.question : value;
  const answerPart = hasAnswerToggle ? split.answer : null;

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
