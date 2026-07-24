import type { Language } from "../../../types/language";

const PROGRESS_LABEL = {
  en: (percent: number) => `${percent}% complete`,
  ar: (percent: number) => `اكتمل ${percent}%`,
} as const;

export function SlideProgressBar({ percent, language }: { percent: number; language: Language }) {
  return (
    <div className="slide-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="slide-progress-bar__track">
        <div className="slide-progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="slide-progress-bar__label">{PROGRESS_LABEL[language](percent)}</span>
    </div>
  );
}
