// UI-only short-title metadata for the Slides accordion's collapsed
// headers (see src/features/topics/Slides.tsx). These are presentation
// labels only — compact stand-ins for a slide's existing full bilingual
// title (topic.slides[].title, sourced from the approved
// slideTitleEn/slideTitleAr content fields) — never a replacement for it.
// The full title is still shown verbatim inside each slide's expanded
// panel.
//
// Deliberately kept as application-layer data, not a new field on the
// approved content records under docs/content-design/chapter-01/: adding
// a short-title field there would require revising an approved,
// checksum-pinned baseline for a presentation-only concern that has
// nothing to do with instructional content. Lookup is by recordId (the
// same generic key every other slide-scoped mechanism in this codebase
// uses — e.g. RAW_FIGURE_URL_BY_BLOCK_ID, STRUCTURED_SLIDE_CONFIG_BY_BLOCK_ID),
// so a future slide with no entry here still renders correctly: see
// resolveSlideShortTitle's fallback.
import type { Language } from "../types/language";

export const SLIDE_SHORT_TITLE_BY_BLOCK_ID: Record<string, { en: string; ar: string }> = {
  "ch01-t01-block-opening": { en: "Fundamental Quantities", ar: "الكميات الأساسية" },
  "ch01-t01-block-opening-2": { en: "Length, Mass, and Time", ar: "الطول والكتلة والزمن" },
  "ch01-t01-block-opening-3": { en: "Distance Units", ar: "وحدات المسافة" },
  "ch01-t01-block-opening-4": { en: "Choosing Units", ar: "اختيار الوحدة المناسبة" },
  "ch01-t01-block-opening-5": { en: "Area and Volume", ar: "المساحة والحجم" },
  "ch01-t01-block-opening-6": { en: "Area and Volume Units", ar: "وحدات المساحة والحجم" },
  "ch01-t01-block-opening-7": { en: "Meters to Feet", ar: "التحويل من المتر إلى القدم" },
  "ch01-t01-block-opening-8": { en: "Time Measurement", ar: "قياس الزمن" },
  "ch01-t01-block-opening-9": { en: "Period and Frequency", ar: "الزمن الدوري والتردد" },
  "ch01-t01-block-opening-10": { en: "Period–Frequency Relationship", ar: "العلاقة بين الزمن الدوري والتردد" },
};

/**
 * Resolves a slide's compact accordion-header label. Falls back to the
 * caller-supplied full title when no short-title entry exists for this
 * recordId (e.g. a newly added Slide 6 with no metadata entry yet) — the
 * accordion header still renders correctly, just without a shortened
 * label, rather than breaking or omitting the slide.
 */
export function resolveSlideShortTitle(
  recordId: string,
  language: Language,
  fallback: string,
): string {
  const entry = SLIDE_SHORT_TITLE_BY_BLOCK_ID[recordId];
  return entry ? entry[language] : fallback;
}
