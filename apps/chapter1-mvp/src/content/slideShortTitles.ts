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
  "ch01-t01-block-opening-11": { en: "Stopwatch Frequency", ar: "تردد ساعة الإيقاف" },
  "ch01-t01-block-opening-12": { en: "Mass and Inertia", ar: "الكتلة والقصور الذاتي" },
  "ch01-t01-block-opening-13": { en: "Mass versus Weight", ar: "الكتلة مقابل الوزن" },

  // ch01-t02 (Distance, SI Units, Unit Conversion, Area, and Volume — PR D).
  "ch01-t02-block-slide-1": { en: "Why Standard Units?", ar: "لماذا الوحدات المعيارية؟" },
  "ch01-t02-block-slide-2": { en: "Defining Distance", ar: "تعريف المسافة" },
  "ch01-t02-block-slide-3": { en: "The Meter", ar: "المتر" },
  "ch01-t02-block-slide-4": { en: "Metric Prefixes", ar: "البادئات المترية" },
  "ch01-t02-block-slide-5": { en: "Conversion Factors", ar: "عوامل التحويل" },
  "ch01-t02-block-slide-6": { en: "Converting Length Units", ar: "تحويل وحدات الطول" },
  "ch01-t02-block-slide-7": { en: "Why Area Is Squared", ar: "لماذا المساحة تربيعية" },
  "ch01-t02-block-slide-8": { en: "Converting Area", ar: "تحويل المساحة" },
  "ch01-t02-block-slide-9": { en: "Why Volume Is Cubed", ar: "لماذا الحجم تكعيبي" },
  "ch01-t02-block-slide-10": { en: "Converting Volume", ar: "تحويل الحجم" },
  "ch01-t02-block-slide-11": { en: "Avoiding Common Mistakes", ar: "تجنّب الأخطاء الشائعة" },

  // ch01-t03 (Time, Period, and Frequency — PR E).
  "ch01-t03-block-slide-1": { en: "Repeating Process", ar: "العملية المتكررة" },
  "ch01-t03-block-slide-2": { en: "Complete Cycle", ar: "الدورة الكاملة" },
  "ch01-t03-block-slide-3": { en: "Period", ar: "الدور" },
  "ch01-t03-block-slide-4": { en: "Frequency", ar: "التردد" },
  "ch01-t03-block-slide-5": { en: "Reciprocal Relationship", ar: "العلاقة العكسية" },
  "ch01-t03-block-slide-6": { en: "Find Frequency", ar: "إيجاد التردد" },
  "ch01-t03-block-slide-7": { en: "Find Period", ar: "إيجاد الدور" },
  "ch01-t03-block-slide-8": { en: "Short Period, High Frequency", ar: "دور قصير، تردد مرتفع" },
  "ch01-t03-block-slide-9": { en: "Half-Cycle Error", ar: "خطأ نصف الدورة" },
  "ch01-t03-block-slide-10": { en: "Checking Answers", ar: "التحقّق من الإجابات" },

  // ch01-t04 (Mass, Inertia, and Weight — PR F).
  "ch01-t04-block-slide-1": { en: "Push versus Lift", ar: "الدفع مقابل الرفع" },
  "ch01-t04-block-slide-2": { en: "What Is Mass?", ar: "ما هي الكتلة؟" },
  "ch01-t04-block-slide-3": { en: "What Is Weight?", ar: "ما هو الوزن؟" },
  "ch01-t04-block-slide-4": { en: "Calculating Weight", ar: "حساب الوزن" },
  "ch01-t04-block-slide-5": { en: "Mass versus Weight", ar: "الكتلة مقابل الوزن" },
  "ch01-t04-block-slide-6": { en: "Why Weight Changes", ar: "لماذا يتغيّر الوزن" },
  "ch01-t04-block-slide-7": { en: "Mass and Weight on the Moon", ar: "الكتلة والوزن على القمر" },
  "ch01-t04-block-slide-8": { en: "What a Scale Measures", ar: "ما يقيسه الميزان" },
  "ch01-t04-block-slide-9": { en: "Checking Answers", ar: "التحقّق من الإجابات" },
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
