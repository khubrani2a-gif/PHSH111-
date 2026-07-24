// UI-only grouping metadata for the Slide Reader's slide navigator (see
// src/features/topics/SlideReader/SlideNavigator.tsx). Mirrors
// src/content/slideShortTitles.ts's own convention: presentation-layer
// data, never a new field on the approved content records under
// docs/content-design/chapter-01/ — grouping a topic's existing slides
// into learning sections has nothing to do with instructional content and
// does not warrant revising a checksum-pinned baseline.
//
// Keyed by topicId (not recordId) since a group spans several slides.
// Deliberately data-driven and reusable: a future topic's slides are
// grouped by adding an entry here, never by branching in JSX on a
// specific topicId or slide number.
import type { PilotTopicId } from "../types/pilotSchema";

export interface SlideGroup {
  id: string;
  title: { en: string; ar: string };
  /** 1-based slide numbers belonging to this group, in display order. */
  slideNumbers: number[];
}

/**
 * ch01-t01 (Fundamental Quantities) groups, verified against the topic's
 * actual current slide titles (see src/content/slideShortTitles.ts):
 * Slides 1-7 introduce and build up length-based measurement (fundamental
 * quantities through unit conversion); Slides 8-11 cover time and
 * periodic motion (time measurement through the stopwatch worked
 * problem); Slides 12-13 cover mass, inertia, and weight. A topic with no
 * entry here (every topic except ch01-t01 today) simply renders its
 * slides as one ungrouped list — see SlideNavigator's fallback.
 */
export const SLIDE_GROUPS_BY_TOPIC_ID: Partial<Record<PilotTopicId, SlideGroup[]>> = {
  "ch01-t01": [
    {
      id: "ch01-t01-group-measurement-and-length",
      title: { en: "Measurement and Length", ar: "القياس والطول" },
      slideNumbers: [1, 2, 3, 4, 5, 6, 7],
    },
    {
      id: "ch01-t01-group-time-and-periodic-motion",
      title: { en: "Time and Periodic Motion", ar: "الزمن والحركة الدورية" },
      slideNumbers: [8, 9, 10, 11],
    },
    {
      id: "ch01-t01-group-mass-inertia-and-weight",
      title: { en: "Mass, Inertia, and Weight", ar: "الكتلة والقصور الذاتي والوزن" },
      slideNumbers: [12, 13],
    },
  ],
};

/**
 * Resolves a topic's slide groups. Falls back to a single ungrouped
 * section (labeled "Slides"/"الشرائح") containing every slide number in
 * order when the topic has no SLIDE_GROUPS_BY_TOPIC_ID entry, so the
 * navigator always has something to render.
 */
export function resolveSlideGroups(topicId: PilotTopicId, slideNumbers: number[]): SlideGroup[] {
  const configured = SLIDE_GROUPS_BY_TOPIC_ID[topicId];
  if (configured && configured.length > 0) return configured;
  return [
    {
      id: `${topicId}-group-all-slides`,
      title: { en: "Slides", ar: "الشرائح" },
      slideNumbers,
    },
  ];
}
