// Tests for the generic slide-group validator (src/content/slideGroups.ts's
// validateSlideGroupList/validateSlideGroups), added as part of PR A's
// generic cross-topic hardening. Two sections: synthetic fixtures against
// the pure validateSlideGroupList core (never touching real content), and
// a regression suite running validateSlideGroups against every currently
// registered topic's real, already-approved configuration.
import { describe, expect, it } from "vitest";
import {
  resolveSlideGroups,
  validateSlideGroupList,
  validateSlideGroups,
  SLIDE_GROUPS_BY_TOPIC_ID,
  type SlideGroup,
} from "../content/slideGroups";
import { SLIDE_SHORT_TITLE_BY_BLOCK_ID } from "../content/slideShortTitles";
import { getTopic, getTopicOrder } from "../content/adapter";
import type { PilotTopicId } from "../types/pilotSchema";

const TOPIC = "ch01-t02" as PilotTopicId; // synthetic-fixture topic; never a real content topic

function group(overrides: Partial<SlideGroup> = {}): SlideGroup {
  return {
    id: "group-a",
    title: { en: "Group A", ar: "المجموعة أ" },
    slideNumbers: [1, 2],
    ...overrides,
  };
}

describe("validateSlideGroupList — synthetic fixtures (PR A, requirement 4)", () => {
  it("16. a valid, complete grouping passes with no diagnostics", () => {
    const groups = [group({ id: "g1", slideNumbers: [1, 2] }), group({ id: "g2", slideNumbers: [3, 4] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2, 3, 4]);
    expect(diagnostics).toEqual([]);
  });

  it("17. an omitted slide (present in the topic, absent from every group) fails", () => {
    const groups = [group({ id: "g1", slideNumbers: [1, 2] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2, 3]);
    expect(diagnostics.some((d) => d.code === "slide-omitted-from-groups")).toBe(true);
  });

  it("18. a slide duplicated across two different groups fails", () => {
    const groups = [
      group({ id: "g1", slideNumbers: [1, 2] }),
      group({ id: "g2", slideNumbers: [2, 3] }),
    ];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2, 3]);
    expect(diagnostics.some((d) => d.code === "duplicate-slide-group-membership")).toBe(true);
  });

  it("19. a group referencing a nonexistent slide number fails", () => {
    const groups = [group({ id: "g1", slideNumbers: [1, 2, 99] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "nonexistent-slide-in-group")).toBe(true);
  });

  it("20. a duplicate group ID fails", () => {
    const groups = [group({ id: "same", slideNumbers: [1] }), group({ id: "same", slideNumbers: [2] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "duplicate-slide-group-id")).toBe(true);
  });

  it("21. an empty English group title fails", () => {
    const groups = [group({ title: { en: "", ar: "المجموعة أ" } })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "empty-slide-group-title-en")).toBe(true);
  });

  it("22. an empty Arabic group title fails", () => {
    const groups = [group({ title: { en: "Group A", ar: "   " } })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "empty-slide-group-title-ar")).toBe(true);
  });

  it("23. an empty slideNumbers array fails", () => {
    const groups = [group({ slideNumbers: [] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "empty-slide-group-numbers")).toBe(true);
  });

  it("24. a duplicate number inside one group fails", () => {
    const groups = [group({ slideNumbers: [1, 1, 2] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "duplicate-slide-number-in-group")).toBe(true);
  });

  it("25. unordered numbers within a group fail", () => {
    const groups = [group({ slideNumbers: [2, 1] })];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2]);
    expect(diagnostics.some((d) => d.code === "unordered-slide-group-numbers")).toBe(true);
  });

  it("26. group ordering inconsistent with slide order fails (second group's numbers precede the first group's)", () => {
    const groups = [
      group({ id: "g1", slideNumbers: [3, 4] }),
      group({ id: "g2", slideNumbers: [1, 2] }),
    ];
    const diagnostics = validateSlideGroupList(TOPIC, groups, [1, 2, 3, 4]);
    expect(diagnostics.some((d) => d.code === "slide-group-order-mismatch")).toBe(true);
  });

  it("27. no explicit groups configured uses the fallback group successfully (resolveSlideGroups)", () => {
    const resolved = resolveSlideGroups(TOPIC, [1, 2, 3]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].slideNumbers).toEqual([1, 2, 3]);
    // And the wrapper validator has nothing configured to check for this topic.
    expect(validateSlideGroups(TOPIC, [1, 2, 3])).toEqual([]);
  });

  it("28. a topic with zero slides does not require groups (empty actualSlideNumbers, no groups configured, passes)", () => {
    const diagnostics = validateSlideGroups(TOPIC, []);
    expect(diagnostics).toEqual([]);
    const resolved = resolveSlideGroups(TOPIC, []);
    expect(resolved[0].slideNumbers).toEqual([]);
  });
});

describe("Current-content regression — all registered topics (PR A, requirements 29-33)", () => {
  it("29. ch01-t01 passes validateSlideGroups with zero diagnostics", () => {
    const topic = getTopic("ch01-t01");
    expect(topic).toBeDefined();
    const slideNumbers = topic!.slides.map((s) => s.slideNumber);
    const diagnostics = validateSlideGroups("ch01-t01" as PilotTopicId, slideNumbers);
    expect(diagnostics).toEqual([]);
  });

  it("30. every currently registered topic passes validateSlideGroups with zero diagnostics", () => {
    for (const topicId of getTopicOrder()) {
      const topic = getTopic(topicId);
      expect(topic).toBeDefined();
      const slideNumbers = topic!.slides.map((s) => s.slideNumber);
      const diagnostics = validateSlideGroups(topicId, slideNumbers);
      expect(diagnostics, `topic "${topicId}" should have zero slide-group diagnostics`).toEqual([]);
    }
  });

  it("31. ch01-t01's configured groups cover Slides 1-13 exactly once, in order", () => {
    const topic = getTopic("ch01-t01");
    const slideNumbers = topic!.slides.map((s) => s.slideNumber);
    const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t01"]!;
    const covered = groups.flatMap((g) => g.slideNumbers);
    expect(covered.sort((a, b) => a - b)).toEqual(slideNumbers.slice().sort((a, b) => a - b));
    expect(new Set(covered).size).toBe(covered.length); // no duplicate membership
  });

  it("32. ch01-t01's current English and Arabic group titles are unchanged from PR #28", () => {
    const groups = SLIDE_GROUPS_BY_TOPIC_ID["ch01-t01"]!;
    expect(groups.map((g) => g.title.en)).toEqual([
      "Measurement and Length",
      "Time and Periodic Motion",
      "Mass, Inertia, and Weight",
    ]);
    expect(groups.map((g) => g.title.ar)).toEqual([
      "القياس والطول",
      "الزمن والحركة الدورية",
      "الكتلة والقصور الذاتي والوزن",
    ]);
  });

  it("33. current short-title behavior remains unchanged: every ch01-t01 slide still has an explicit short-title entry", () => {
    const topic = getTopic("ch01-t01");
    for (const slide of topic!.slides) {
      expect(SLIDE_SHORT_TITLE_BY_BLOCK_ID[slide.recordId]).toBeDefined();
    }
    expect(Object.keys(SLIDE_SHORT_TITLE_BY_BLOCK_ID)).toHaveLength(13);
  });
});
