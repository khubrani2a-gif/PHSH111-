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
import type { AdapterDiagnostic } from "../types/normalized";
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

/**
 * Pure, reusable validator for a topic's EXPLICITLY configured slide
 * groups (SLIDE_GROUPS_BY_TOPIC_ID) — never for the generic single-bucket
 * fallback resolveSlideGroups() falls back to when a topic has no
 * configuration at all, which is always valid by construction (it always
 * lists every one of the topic's own actual slide numbers, in order,
 * since resolveSlideGroups builds it directly from them).
 *
 * Returns AdapterDiagnostic[] (the same shape src/content/validate.ts
 * uses) rather than a competing error type, reusing this codebase's one
 * existing validation-diagnostic convention. Deliberately NOT wired into
 * the render path or into loadAllTopics()/validateTopicFile — an invalid
 * explicit group configuration is an application-code defect (a mistake
 * in this very file), not a content-authoring defect, so it belongs in a
 * unit test asserting every registered topic's configuration is correct
 * (see src/tests/slideGroups.test.ts), not in a runtime check against
 * user-facing content. Never silently repairs, reorders, or deduplicates
 * a malformed configuration — every problem found is reported, nothing is
 * corrected.
 *
 * Split into two functions: validateSlideGroupList is the pure core (no
 * dependency on the SLIDE_GROUPS_BY_TOPIC_ID module constant, so tests
 * can exercise it directly against synthetic group configurations, valid
 * or deliberately invalid, without mutating real content);
 * validateSlideGroups is the convenience wrapper used for checking a
 * real registered topic's actual configured groups.
 */
export function validateSlideGroups(
  topicId: PilotTopicId,
  actualSlideNumbers: readonly number[],
): AdapterDiagnostic[] {
  const groups = SLIDE_GROUPS_BY_TOPIC_ID[topicId];
  if (!groups || groups.length === 0) {
    // No explicit configuration — resolveSlideGroups's generic fallback
    // bucket is used instead, and is always valid. Nothing to check.
    return [];
  }
  return validateSlideGroupList(topicId, groups, actualSlideNumbers);
}

export function validateSlideGroupList(
  topicId: PilotTopicId,
  groups: readonly SlideGroup[],
  actualSlideNumbers: readonly number[],
): AdapterDiagnostic[] {
  const diagnostics: AdapterDiagnostic[] = [];
  if (groups.length === 0) return diagnostics;

  const seenGroupIds = new Set<string>();
  const firstGroupIdForSlideNumber = new Map<number, string>();
  let previousGroupMax = 0;

  for (const group of groups) {
    if (seenGroupIds.has(group.id)) {
      diagnostics.push({
        severity: "error",
        code: "duplicate-slide-group-id",
        message: `Duplicate slide-group id "${group.id}" in topic "${topicId}"`,
        topicId,
      });
    }
    seenGroupIds.add(group.id);

    if (!group.title.en || group.title.en.trim().length === 0) {
      diagnostics.push({
        severity: "error",
        code: "empty-slide-group-title-en",
        message: `Slide group "${group.id}" in topic "${topicId}" has an empty English title`,
        topicId,
      });
    }
    if (!group.title.ar || group.title.ar.trim().length === 0) {
      diagnostics.push({
        severity: "error",
        code: "empty-slide-group-title-ar",
        message: `Slide group "${group.id}" in topic "${topicId}" has an empty Arabic title`,
        topicId,
      });
    }

    if (!Array.isArray(group.slideNumbers) || group.slideNumbers.length === 0) {
      diagnostics.push({
        severity: "error",
        code: "empty-slide-group-numbers",
        message: `Slide group "${group.id}" in topic "${topicId}" has no slide numbers`,
        topicId,
      });
      continue;
    }

    const seenWithinGroup = new Set<number>();
    for (const slideNumber of group.slideNumbers) {
      if (seenWithinGroup.has(slideNumber)) {
        diagnostics.push({
          severity: "error",
          code: "duplicate-slide-number-in-group",
          message: `Slide group "${group.id}" in topic "${topicId}" lists slide number ${slideNumber} more than once`,
          topicId,
        });
      }
      seenWithinGroup.add(slideNumber);
    }

    const isAscending = group.slideNumbers.every(
      (n, i) => i === 0 || n > group.slideNumbers[i - 1],
    );
    if (!isAscending) {
      diagnostics.push({
        severity: "error",
        code: "unordered-slide-group-numbers",
        message: `Slide group "${group.id}" in topic "${topicId}" lists its slide numbers out of ascending order`,
        topicId,
      });
    }

    const groupMin = Math.min(...group.slideNumbers);
    const groupMax = Math.max(...group.slideNumbers);
    if (groupMin <= previousGroupMax) {
      diagnostics.push({
        severity: "error",
        code: "slide-group-order-mismatch",
        message: `Slide group "${group.id}" in topic "${topicId}" is out of order relative to the preceding group (its slide numbers must all come after the preceding group's)`,
        topicId,
      });
    }
    previousGroupMax = Math.max(previousGroupMax, groupMax);

    for (const slideNumber of group.slideNumbers) {
      const firstGroupId = firstGroupIdForSlideNumber.get(slideNumber);
      if (firstGroupId !== undefined && firstGroupId !== group.id) {
        diagnostics.push({
          severity: "error",
          code: "duplicate-slide-group-membership",
          message: `Slide ${slideNumber} in topic "${topicId}" appears in more than one group ("${firstGroupId}" and "${group.id}")`,
          topicId,
        });
      } else if (firstGroupId === undefined) {
        firstGroupIdForSlideNumber.set(slideNumber, group.id);
      }

      if (!actualSlideNumbers.includes(slideNumber)) {
        diagnostics.push({
          severity: "error",
          code: "nonexistent-slide-in-group",
          message: `Slide group "${group.id}" in topic "${topicId}" references slide number ${slideNumber}, which does not exist in this topic`,
          topicId,
        });
      }
    }
  }

  for (const slideNumber of actualSlideNumbers) {
    if (!firstGroupIdForSlideNumber.has(slideNumber)) {
      diagnostics.push({
        severity: "error",
        code: "slide-omitted-from-groups",
        message: `Slide ${slideNumber} in topic "${topicId}" is not included in any configured slide group`,
        topicId,
      });
    }
  }

  return diagnostics;
}
