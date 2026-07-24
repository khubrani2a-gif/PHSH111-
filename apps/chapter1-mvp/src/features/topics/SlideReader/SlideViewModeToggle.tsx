import type { Language } from "../../../types/language";

export type SlideDisplayMode = "study" | "review";

const STUDY_LABEL = { en: "Study", ar: "دراسة" } as const;
const REVIEW_LABEL = { en: "Review", ar: "مراجعة" } as const;
const GROUP_LABEL = { en: "Display mode", ar: "وضع العرض" } as const;

export function SlideViewModeToggle({
  mode,
  onChange,
  language,
}: {
  mode: SlideDisplayMode;
  onChange: (mode: SlideDisplayMode) => void;
  language: Language;
}) {
  return (
    <div className="slide-view-mode-toggle" role="group" aria-label={GROUP_LABEL[language]}>
      <button
        type="button"
        className={`slide-view-mode-toggle__btn${mode === "study" ? " slide-view-mode-toggle__btn--active" : ""}`}
        aria-pressed={mode === "study"}
        onClick={() => onChange("study")}
      >
        {STUDY_LABEL[language]}
      </button>
      <button
        type="button"
        className={`slide-view-mode-toggle__btn${mode === "review" ? " slide-view-mode-toggle__btn--active" : ""}`}
        aria-pressed={mode === "review"}
        onClick={() => onChange("review")}
      >
        {REVIEW_LABEL[language]}
      </button>
    </div>
  );
}
