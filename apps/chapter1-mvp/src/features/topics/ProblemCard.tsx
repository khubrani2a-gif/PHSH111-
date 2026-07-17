import { useLanguage } from "../../app/LanguageContext";
import { renderEquationText } from "../../content/equationRenderer";
import { SolutionReveal } from "./SolutionReveal";
import type { NormalizedProblem } from "../../types/normalized";

const LABELS = {
  en: {
    heading: "Original Problem",
    given: "Given",
    interpretation: "Setup",
    missing: "No English text is available for this problem.",
  },
  ar: {
    heading: "مسألة أصلية",
    given: "المعطيات",
    interpretation: "الإعداد",
    missing: "لا يتوفر نص عربي لهذه المسألة.",
  },
} as const;

interface ProblemCardProps {
  problem: NormalizedProblem | undefined;
  /** For natural-language fields (statement, interpretation) — excludes ambiguous English words like "a". */
  proseTokens: readonly string[];
  /** For bare symbol/value fields (given values) — the full per-topic variable whitelist. */
  symbolTokens: readonly string[];
}

export function ProblemCard({ problem, proseTokens, symbolTokens }: ProblemCardProps) {
  const { language, direction } = useLanguage();
  const text = LABELS[language];

  if (!problem) return null;

  const statementValue = problem.statement[language];
  const interpretationValue = problem.conceptualInterpretation?.[language];

  return (
    <section className="problem-card">
      <h2>{text.heading}</h2>

      {statementValue ? (
        <p className="problem-card__statement" dir={direction}>
          {renderEquationText(statementValue, proseTokens)}
        </p>
      ) : (
        <p className="problem-card__missing" role="status">
          {text.missing}
        </p>
      )}

      {problem.givenValues.length > 0 && (
        <dl className="problem-card__given" dir="ltr">
          <dt className="problem-card__given-label">{text.given}</dt>
          {problem.givenValues.map((g) => (
            <dd key={g.symbol}>
              {renderEquationText(`${g.symbol} = ${g.value} ${g.unit}`, symbolTokens)}
            </dd>
          ))}
        </dl>
      )}

      {interpretationValue ? (
        <div className="problem-card__interpretation" dir={direction}>
          <h3>{text.interpretation}</h3>
          <p>{renderEquationText(interpretationValue, proseTokens)}</p>
        </div>
      ) : null}

      <SolutionReveal problem={problem} proseTokens={proseTokens} symbolTokens={symbolTokens} />
    </section>
  );
}
