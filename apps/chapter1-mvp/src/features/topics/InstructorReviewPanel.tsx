import { useId, useState } from "react";
import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import type { NormalizedInstructorNote, NormalizedText } from "../../types/normalized";

const LABEL = { en: "Instructor Review Note", ar: "ملاحظة لمراجعة المدرّس" } as const;
const TOGGLE = {
  en: { show: "Show instructor review note", hide: "Hide instructor review note" },
  ar: { show: "إظهار ملاحظة مراجعة المدرّس", hide: "إخفاء ملاحظة مراجعة المدرّس" },
} as const;
const LEARNING_OBJECTIVES_HEADING = {
  en: "Learning objectives (internal)",
  ar: "أهداف التعلّم (داخلي)",
} as const;
const RECORD_ID_LABEL = { en: "Source record ID", ar: "معرف السجل المصدر" } as const;
// Keyed by the canonical `blockType` value (unchanged: "reviewQuestion") —
// only the displayed en/ar strings use the "Review Card" label; see
// ReviewQuestion.tsx's header comment for the label-vs-schema-name distinction.
const BLOCK_TYPE_LABEL: Record<string, { en: string; ar: string }> = {
  misconception: { en: "Misconception", ar: "مفهوم خاطئ" },
  reviewQuestion: { en: "Review Card (instructor-only)", ar: "بطاقة مراجعة (للمدرّس فقط)" },
};
const NOT_STUDENT_FACING_NOTE = {
  en: "Internal reviewer content only. Not student-facing material, and its presence here does not imply publication is approved.",
  ar: "محتوى داخلي للمراجعين فقط. ليس مادة موجهة للطلاب، ووجوده هنا لا يعني الموافقة على النشر.",
} as const;

interface InstructorReviewPanelProps {
  notes: NormalizedInstructorNote[];
  learningObjectives?: { recordId: string; items: NormalizedText[] };
  italicTokens?: readonly string[];
}

/**
 * Collapsed-by-default panel for visibility:"instructor" records (in
 * practice, the misconception content block in every topic) plus
 * instructorScript.learningObjectives (per
 * docs/app/MVP_IMPLEMENTATION_DECISIONS.json decisions B and C — neither
 * is ever promoted into the main learner-style flow). Visually distinct
 * from learner sections (own container styling, own badge label) and
 * always labeled as internal-reviewer-only, never presented as
 * student-facing material.
 */
export function InstructorReviewPanel({
  notes,
  learningObjectives,
  italicTokens = [],
}: InstructorReviewPanelProps) {
  const { language, direction } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  if (notes.length === 0 && !learningObjectives) return null;

  return (
    <section className="instructor-review-panel" dir={direction}>
      <button
        type="button"
        className="instructor-review-panel__toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="instructor-review-panel__badge">{LABEL[language]}</span>
        <span>{expanded ? TOGGLE[language].hide : TOGGLE[language].show}</span>
      </button>

      {expanded && (
        <div id={panelId} className="instructor-review-panel__body">
          <p className="instructor-review-panel__disclaimer">{NOT_STUDENT_FACING_NOTE[language]}</p>

          {notes.map((note) => {
            const value = note.text[language];
            const typeLabel = BLOCK_TYPE_LABEL[note.blockType];
            return (
              <div className="instructor-review-panel__note" key={note.recordId}>
                {typeLabel ? (
                  <p className="instructor-review-panel__type-label">{typeLabel[language]}</p>
                ) : null}
                {value ? <p>{renderEquationText(value, italicTokens)}</p> : null}
                <p className="instructor-review-panel__record-id">
                  {RECORD_ID_LABEL[language]}: <code>{note.recordId}</code>
                </p>
              </div>
            );
          })}

          {learningObjectives ? (
            <div className="instructor-review-panel__note">
              <h3>{LEARNING_OBJECTIVES_HEADING[language]}</h3>
              <ul>
                {learningObjectives.items.map((item, i) => {
                  const value = item[language];
                  return value ? <li key={i}>{renderEquationText(value, italicTokens)}</li> : null;
                })}
              </ul>
              <p className="instructor-review-panel__record-id">
                {RECORD_ID_LABEL[language]}: <code>{learningObjectives.recordId}</code>
              </p>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
