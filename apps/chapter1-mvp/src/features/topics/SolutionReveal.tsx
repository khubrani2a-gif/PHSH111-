import { useId, useState } from "react";
import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import type { NormalizedProblem } from "../../types/normalized";

const LABELS = {
  en: {
    show: "Show solution",
    hide: "Hide solution",
    stepsHeading: "Step-by-step solution",
    finalAnswerHeading: "Final answer",
    missing: "No solution steps are present in the source record.",
  },
  ar: {
    show: "إظهار الحل",
    hide: "إخفاء الحل",
    stepsHeading: "الحل خطوة بخطوة",
    finalAnswerHeading: "الإجابة النهائية",
    missing: "لا توجد خطوات حل في السجل المصدر.",
  },
} as const;

interface SolutionRevealProps {
  problem: NormalizedProblem;
  /** For natural-language fields (step explanations, final-answer interpretation) — excludes ambiguous English words like "a". */
  proseTokens: readonly string[];
  /** For bare symbolic calculation fields (step expressions) — the full per-topic variable whitelist. */
  symbolTokens: readonly string[];
}

/**
 * Reveal/hide control for a problem's solution steps. Hidden by default,
 * keyboard-accessible (native <button>, aria-expanded/aria-controls), no
 * grading and no persistence of the expanded state across navigation —
 * see docs/app/MVP_IMPLEMENTATION_DECISIONS.json decision J.
 */
export function SolutionReveal({ problem, proseTokens, symbolTokens }: SolutionRevealProps) {
  const { language, direction } = useLanguage();
  const text = LABELS[language];
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const hasSteps = problem.steps.length > 0;

  return (
    <div className="solution-reveal">
      <button
        type="button"
        className="solution-reveal__toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? text.hide : text.show}
      </button>

      {expanded && (
        <div id={panelId} className="solution-reveal__panel" dir={direction}>
          {!hasSteps ? (
            <p role="status">{text.missing}</p>
          ) : (
            <>
              <h3>{text.stepsHeading}</h3>
              <ol className="solution-reveal__steps">
                {problem.steps.map((step) => {
                  const explanationValue = step.explanation[language];
                  return (
                    <li key={step.stepNumber}>
                      <p className="solution-reveal__step-purpose">{step.purpose}</p>
                      {explanationValue ? (
                        <p className="solution-reveal__step-explanation">
                          {renderEquationText(explanationValue, proseTokens)}
                        </p>
                      ) : null}
                      {step.expression ? (
                        <p className="solution-reveal__step-expression" dir="ltr">
                          {renderEquationText(step.expression.substitution, symbolTokens)}
                          {step.expression.result !== null ? (
                            <span>
                              {" = "}
                              {step.expression.result}
                              {step.expression.unit ? ` ${step.expression.unit}` : ""}
                            </span>
                          ) : null}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          {problem.finalAnswer ? (
            <div className="solution-reveal__final-answer">
              <h3>{text.finalAnswerHeading}</h3>
              <p>
                {problem.finalAnswer.interpretation[language] ? (
                  renderEquationText(problem.finalAnswer.interpretation[language]!, proseTokens)
                ) : null}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
