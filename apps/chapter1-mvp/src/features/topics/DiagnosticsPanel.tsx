import { useLanguage } from "../../app/LanguageContext";
import type { AdapterDiagnostic } from "../../types/normalized";

const LABEL = { en: "Developer Diagnostics", ar: "تشخيصات المطوّر" } as const;

interface DiagnosticsPanelProps {
  diagnostics: AdapterDiagnostic[];
}

/**
 * Development-time diagnostics surface (MVP_PRODUCT_SPEC.md §16, phase
 * §4/§14): shows the content adapter's validation errors/warnings as
 * actionable, structured messages — never a raw stack trace, never a
 * silently-swallowed failure. Renders nothing when there are no
 * diagnostics. Uses a native <details> disclosure so it needs no
 * component state and stays out of the way of the main learning flow.
 */
export function DiagnosticsPanel({ diagnostics }: DiagnosticsPanelProps) {
  const { language, direction } = useLanguage();
  if (diagnostics.length === 0) return null;

  const errorCount = diagnostics.filter((d) => d.severity === "error").length;

  return (
    <details className="diagnostics-panel" dir={direction}>
      <summary>
        {LABEL[language]} ({diagnostics.length}
        {errorCount > 0 ? `, ${errorCount} ${language === "en" ? "errors" : "أخطاء"}` : ""})
      </summary>
      <ul>
        {diagnostics.map((d, i) => (
          <li
            key={i}
            className={`diagnostics-panel__item diagnostics-panel__item--${d.severity}`}
          >
            <code>{d.code}</code> — {d.message}
            {d.topicId ? ` (${d.topicId}${d.recordId ? `, ${d.recordId}` : ""})` : ""}
          </li>
        ))}
      </ul>
    </details>
  );
}
