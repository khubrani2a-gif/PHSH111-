import { useId, useState } from "react";
import { useLanguage } from "../../app/LanguageContext";
import type { NormalizedGovernance } from "../../types/normalized";

const LABEL = { en: "Internal Status", ar: "الحالة الداخلية" } as const;
const TOGGLE = {
  en: { show: "Show internal status details", hide: "Hide internal status details" },
  ar: { show: "إظهار تفاصيل الحالة الداخلية", hide: "إخفاء تفاصيل الحالة الداخلية" },
} as const;

const FIELD_LABELS = {
  en: {
    topicId: "Topic ID",
    schemaVersion: "Source schema version",
    blockedStatus: "Blocked/draft records",
    studentFacing: "Student-facing authorized",
    visualReview: "Visual review status",
    recordCount: "Source record count",
  },
  ar: {
    topicId: "معرف الموضوع",
    schemaVersion: "إصدار مخطط المصدر",
    blockedStatus: "السجلات المحجوبة (مسودة)",
    studentFacing: "مصرح به لعرضه على الطلاب",
    visualReview: "حالة مراجعة العنصر البصري",
    recordCount: "عدد سجلات المصدر",
  },
} as const;

const VISUAL_REVIEW_LABEL = {
  readyForHumanReview: {
    en: "Ready for human review (not yet reviewed)",
    ar: "جاهز للمراجعة البشرية (لم تتم المراجعة بعد)",
  },
  reviewed: { en: "Reviewed", ar: "تمت المراجعة" },
  unavailable: { en: "Unavailable", ar: "غير متوفر" },
} as const;

const YES_NO = {
  en: { yes: "Yes", no: "No" },
  ar: { yes: "نعم", no: "لا" },
} as const;

interface InternalStatusPanelProps {
  governance: NormalizedGovernance;
}

/**
 * Per-topic governance status panel (§9): topic ID, source schema
 * version, blocked/draft record count, student-facing authorization
 * status, visual review status, and source record count. Collapsed by
 * default and placed as a secondary reviewer area — deliberately not part
 * of the main learning flow. Availability of content is never presented
 * as equivalent to approval.
 */
export function InternalStatusPanel({ governance }: InternalStatusPanelProps) {
  const { language, direction } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const fields = FIELD_LABELS[language];

  return (
    <section className="internal-status-panel" dir={direction}>
      <button
        type="button"
        className="internal-status-panel__toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
      >
        {LABEL[language]}
        <span className="internal-status-panel__toggle-hint">
          {expanded ? TOGGLE[language].hide : TOGGLE[language].show}
        </span>
      </button>
      {expanded && (
        <dl id={panelId} className="internal-status-panel__body">
          <dt>{fields.topicId}</dt>
          <dd>
            <code>{governance.topicId}</code>
          </dd>

          <dt>{fields.schemaVersion}</dt>
          <dd>
            <code>{governance.schemaVersion}</code>
          </dd>

          <dt>{fields.blockedStatus}</dt>
          <dd>
            {governance.blockedRecordCount} / {governance.recordCount}
          </dd>

          <dt>{fields.studentFacing}</dt>
          <dd>{governance.studentFacingAllowed ? YES_NO[language].yes : YES_NO[language].no}</dd>

          <dt>{fields.visualReview}</dt>
          <dd>{VISUAL_REVIEW_LABEL[governance.visualReviewStatus][language]}</dd>

          <dt>{fields.recordCount}</dt>
          <dd>{governance.recordCount}</dd>
        </dl>
      )}
    </section>
  );
}
