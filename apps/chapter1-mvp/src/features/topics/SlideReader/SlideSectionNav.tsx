import type { Language } from "../../../types/language";

const SECTION_NAV_LABEL = { en: "Jump to section", ar: "الانتقال إلى قسم" } as const;

export interface SlideSectionNavEntry {
  id: string;
  label: string;
}

function prefersReducedMotion(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

/**
 * Compact, horizontally-scrollable (on mobile) in-slide section bar.
 * `entries` is built by SlideReader from the actual rendered
 * StructuredSlideContent DOM for the active slide (see
 * StructuredSlideContent's per-section `id` attributes) — never a
 * hardcoded list, so a slide missing a given subsection (e.g. no table,
 * no keyConcept) simply has no entry for it here.
 */
export function SlideSectionNav({ entries, language }: { entries: SlideSectionNavEntry[]; language: Language }) {
  if (entries.length === 0) return null;

  return (
    <nav className="slide-section-nav" aria-label={SECTION_NAV_LABEL[language]}>
      <ul className="slide-section-nav__list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              type="button"
              className="slide-section-nav__btn"
              onClick={() => {
                const target = document.getElementById(entry.id);
                target?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
              }}
            >
              {entry.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
