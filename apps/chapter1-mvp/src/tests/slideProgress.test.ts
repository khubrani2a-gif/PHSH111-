// @vitest-environment jsdom
//
// Tests for the canonical per-slide learning-progress model
// (src/app/slideProgress.ts) — the single source of truth both the Slide
// Reader and the View All Slides accordion read/write through (PR C:
// Unified Slide Progress Synchronization). Covers the pure in-memory
// reducers (withViewed/withCompleted/withIncomplete), legacy-viewed-id
// reconciliation, malformed-storage tolerance, progress-count
// calculations, and existing-content regression. Deterministic injected
// timestamps are used throughout instead of real wall-clock delays.
import { beforeEach, describe, expect, it } from "vitest";
import { getTopic } from "../content/adapter";
import {
  completionProgress,
  isCompleted,
  isMastered,
  isViewed,
  progressCounts,
  readTopicLearningState,
  reconcileLegacyViewedState,
  withCompleted,
  withIncomplete,
  withViewed,
  writeTopicLearningState,
  type TopicLearningState,
} from "../app/slideProgress";

beforeEach(() => {
  window.localStorage.clear();
});

const T0 = "2026-01-01T00:00:00.000Z";
const T1 = "2026-01-01T00:01:00.000Z";
const T2 = "2026-01-01T00:02:00.000Z";

describe("Canonical state — pure reducers", () => {
  it("1. empty topic returns empty learning state", () => {
    expect(readTopicLearningState("ch01-t99")).toEqual({});
  });

  it("2. Viewed write creates only viewedAt", () => {
    const state = withViewed({}, "r1", T0);
    expect(state.r1).toEqual({ viewedAt: T0 });
  });

  it("3. first-view timestamp is preserved on repeated opens (idempotent, same reference)", () => {
    const first = withViewed({}, "r1", T0);
    const second = withViewed(first, "r1", T1);
    expect(second.r1.viewedAt).toBe(T0);
    expect(second).toBe(first);
  });

  it("4. Viewed write preserves completedAt", () => {
    const state: TopicLearningState = { r1: { completedAt: T0 } };
    const next = withViewed(state, "r1", T1);
    expect(next.r1.completedAt).toBe(T0);
    expect(next.r1.viewedAt).toBe(T1);
  });

  it("5. Viewed write preserves masteredAt", () => {
    const state: TopicLearningState = { r1: { masteredAt: T0 } };
    const next = withViewed(state, "r1", T1);
    expect(next.r1.masteredAt).toBe(T0);
  });

  it("6. Completed write creates completedAt", () => {
    const state = withCompleted({}, "r1", T0);
    expect(state.r1.completedAt).toBe(T0);
  });

  it("7. Completed write ensures viewedAt exists", () => {
    const state = withCompleted({}, "r1", T0);
    expect(state.r1.viewedAt).toBe(T0);
  });

  it("7b. Completed write does not overwrite an earlier existing viewedAt", () => {
    const viewed = withViewed({}, "r1", T0);
    const completed = withCompleted(viewed, "r1", T1);
    expect(completed.r1.viewedAt).toBe(T0);
    expect(completed.r1.completedAt).toBe(T1);
  });

  it("7c. repeated Mark Complete does not produce unnecessary state churn (idempotent, same reference)", () => {
    const first = withCompleted({}, "r1", T0);
    const second = withCompleted(first, "r1", T1);
    expect(second.r1.completedAt).toBe(T0);
    expect(second).toBe(first);
  });

  it("8. Mark Incomplete removes only completedAt", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0, completedAt: T1, masteredAt: T2 } };
    const next = withIncomplete(state, "r1");
    expect(next.r1.completedAt).toBeUndefined();
    expect(next.r1.viewedAt).toBe(T0);
    expect(next.r1.masteredAt).toBe(T2);
  });

  it("9. Mark Incomplete preserves Viewed", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0, completedAt: T1 } };
    expect(withIncomplete(state, "r1").r1.viewedAt).toBe(T0);
  });

  it("10. Mark Incomplete preserves Mastered (masteredAt is never touched by completion toggling — the confirmed contract)", () => {
    const state: TopicLearningState = { r1: { completedAt: T0, masteredAt: T1 } };
    expect(withIncomplete(state, "r1").r1.masteredAt).toBe(T1);
  });

  it("10b. Mark Incomplete on an already-incomplete/absent record is a no-op (same reference)", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0 } };
    expect(withIncomplete(state, "r1")).toBe(state);
    expect(withIncomplete({}, "r1")).toEqual({});
  });

  it("11. state updates preserve other slide records", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0 }, r2: { completedAt: T1 } };
    const next = withViewed(state, "r3", T2);
    expect(next.r1).toEqual({ viewedAt: T0 });
    expect(next.r2).toEqual({ completedAt: T1 });
    expect(next.r3).toEqual({ viewedAt: T2 });
  });

  it("12. state is isolated by topic", () => {
    writeTopicLearningState("ch01-tA", withViewed({}, "r1", T0));
    writeTopicLearningState("ch01-tB", withViewed({}, "r1", T1));
    expect(readTopicLearningState("ch01-tA").r1.viewedAt).toBe(T0);
    expect(readTopicLearningState("ch01-tB").r1.viewedAt).toBe(T1);
  });
});

describe("Legacy reconciliation", () => {
  const topicId = "ch01-t01";

  it("13. missing legacy key is safe", () => {
    expect(() => readTopicLearningState(topicId)).not.toThrow();
    expect(readTopicLearningState(topicId)).toEqual({});
  });

  it("14. malformed legacy JSON is safe", () => {
    window.localStorage.setItem(`phsh111:${topicId}.slides.viewedRecordIds`, "not valid json {{{");
    expect(() => readTopicLearningState(topicId)).not.toThrow();
    expect(readTopicLearningState(topicId)).toEqual({});
  });

  it("15. canonical key already existing does not block importing a newly added legacy Viewed id (fixes the one-time-only migration bug)", () => {
    writeTopicLearningState(topicId, { r1: { viewedAt: T0 } });
    window.localStorage.setItem(`phsh111:${topicId}.slides.viewedRecordIds`, JSON.stringify(["r1", "r2"]));
    const state = readTopicLearningState(topicId);
    expect(state.r1.viewedAt).toBe(T0); // untouched, already canonical
    expect(state.r2.viewedAt).toBeTypeOf("string"); // newly reconciled
  });

  it("16. reconcileLegacyViewedState returns the same object reference when every legacy id is already reconciled (pure idempotency)", () => {
    const canonical: TopicLearningState = { r1: { viewedAt: T0 } };
    const result = reconcileLegacyViewedState(canonical, ["r1"], undefined, T1);
    expect(result).toBe(canonical);
  });

  it("16b. readTopicLearningState is idempotent once its result is persisted back (matching real component usage: read -> write -> read)", () => {
    window.localStorage.setItem(`phsh111:${topicId}.slides.viewedRecordIds`, JSON.stringify(["r1"]));
    const first = readTopicLearningState(topicId);
    writeTopicLearningState(topicId, first);
    const second = readTopicLearningState(topicId);
    expect(second.r1.viewedAt).toBe(first.r1.viewedAt);
  });

  it("17. legacy Viewed does not overwrite canonical viewedAt", () => {
    const canonical: TopicLearningState = { r1: { viewedAt: T0 } };
    const result = reconcileLegacyViewedState(canonical, ["r1"], undefined, T1);
    expect(result.r1.viewedAt).toBe(T0);
  });

  it("18. legacy Viewed preserves Completed", () => {
    const canonical: TopicLearningState = { r1: { completedAt: T0 } };
    const result = reconcileLegacyViewedState(canonical, ["r1"], undefined, T1);
    expect(result.r1.completedAt).toBe(T0);
    expect(result.r1.viewedAt).toBe(T1);
  });

  it("19. legacy Viewed preserves Mastered", () => {
    const canonical: TopicLearningState = { r1: { masteredAt: T0 } };
    const result = reconcileLegacyViewedState(canonical, ["r1"], undefined, T1);
    expect(result.r1.masteredAt).toBe(T0);
  });

  it("20. unknown legacy IDs are ignored when validRecordIds is supplied", () => {
    const result = reconcileLegacyViewedState({}, ["real-id", "stale-id"], ["real-id"], T0);
    expect(result["real-id"].viewedAt).toBe(T0);
    expect(result["stale-id"]).toBeUndefined();
  });

  it("21. separate topics do not contaminate one another", () => {
    window.localStorage.setItem("phsh111:ch01-tA.slides.viewedRecordIds", JSON.stringify(["r1"]));
    const stateA = readTopicLearningState("ch01-tA");
    const stateB = readTopicLearningState("ch01-tB");
    expect(stateA.r1).toBeDefined();
    expect(stateB.r1).toBeUndefined();
  });
});

describe("Malformed canonical data", () => {
  const topicId = "ch01-t01";
  const key = `phsh111:${topicId}.slides.learningState`;

  it("22. malformed canonical JSON does not crash", () => {
    window.localStorage.setItem(key, "not valid json {{{");
    expect(() => readTopicLearningState(topicId)).not.toThrow();
    expect(readTopicLearningState(topicId)).toEqual({});
  });

  it("23. array payload does not become valid state", () => {
    window.localStorage.setItem(key, JSON.stringify([1, 2, 3]));
    expect(readTopicLearningState(topicId)).toEqual({});
  });

  it("24. null payload is ignored", () => {
    window.localStorage.setItem(key, JSON.stringify(null));
    expect(readTopicLearningState(topicId)).toEqual({});
  });

  it("25. invalid timestamp types are ignored (field dropped, not crashed or coerced)", () => {
    window.localStorage.setItem(
      key,
      JSON.stringify({ version: 1, records: { r1: { viewedAt: 12345, completedAt: T0 } } }),
    );
    const state = readTopicLearningState(topicId);
    expect(state.r1.viewedAt).toBeUndefined();
    expect(state.r1.completedAt).toBe(T0);
  });

  it("26. one malformed record does not discard valid sibling records", () => {
    window.localStorage.setItem(
      key,
      JSON.stringify({ version: 1, records: { r1: "not an object", r2: { viewedAt: T0 } } }),
    );
    const state = readTopicLearningState(topicId);
    expect(state.r1).toBeUndefined();
    expect(state.r2.viewedAt).toBe(T0);
  });

  it("27. extra unknown properties do not break valid fields", () => {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        records: { r1: { viewedAt: T0, someFutureField: "x", nested: { a: 1 } } },
        extraTopLevelField: "ignored",
      }),
    );
    const state = readTopicLearningState(topicId);
    expect(state.r1).toEqual({ viewedAt: T0 });
  });
});

describe("Progress calculations", () => {
  it("49. Viewed count uses only viewedAt", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0 }, r2: { completedAt: T0 } };
    expect(progressCounts(state, ["r1", "r2"]).viewed).toBe(1);
  });

  it("50. Completed count uses only completedAt", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0 }, r2: { completedAt: T0 } };
    expect(progressCounts(state, ["r1", "r2"]).completed).toBe(1);
  });

  it("51. Mastered count uses only masteredAt", () => {
    const state: TopicLearningState = { r1: { viewedAt: T0 }, r2: { masteredAt: T0 } };
    expect(progressCounts(state, ["r1", "r2"]).mastered).toBe(1);
  });

  it("52. stale record IDs are excluded", () => {
    const state: TopicLearningState = { stale: { viewedAt: T0 }, r1: { viewedAt: T0 } };
    expect(progressCounts(state, ["r1"]).viewed).toBe(1);
    expect(completionProgress(state, ["r1"]).total).toBe(1);
  });

  it("53. zero-slide total is safe (no NaN)", () => {
    expect(progressCounts({}, [])).toEqual({ viewed: 0, completed: 0, mastered: 0, total: 0 });
    expect(completionProgress({}, [])).toEqual({ completed: 0, total: 0, percent: 0 });
  });

  it("54. one-slide total is correct", () => {
    const state = withCompleted({}, "r1", T0);
    expect(completionProgress(state, ["r1"])).toEqual({ completed: 1, total: 1, percent: 100 });
  });

  it("55. current ch01-t01 progress is correct for 13 slides", () => {
    const topic = getTopic("ch01-t01")!;
    const recordIds = topic.slides.map((s) => s.recordId);
    expect(recordIds).toHaveLength(13);
    let state: TopicLearningState = {};
    for (const id of recordIds) state = withViewed(state, id, T0);
    state = withCompleted(state, recordIds[0], T1);
    expect(progressCounts(state, recordIds)).toEqual({ viewed: 13, completed: 1, mastered: 0, total: 13 });
    expect(completionProgress(state, recordIds).percent).toBe(8); // 1 of 13, rounded
  });
});

describe("Existing-content regression", () => {
  it("56. all current 13 record IDs remain unchanged", () => {
    const topic = getTopic("ch01-t01")!;
    expect(topic.slides.map((s) => s.recordId)).toEqual([
      "ch01-t01-block-opening",
      "ch01-t01-block-opening-2",
      "ch01-t01-block-opening-3",
      "ch01-t01-block-opening-4",
      "ch01-t01-block-opening-5",
      "ch01-t01-block-opening-6",
      "ch01-t01-block-opening-7",
      "ch01-t01-block-opening-8",
      "ch01-t01-block-opening-9",
      "ch01-t01-block-opening-10",
      "ch01-t01-block-opening-11",
      "ch01-t01-block-opening-12",
      "ch01-t01-block-opening-13",
    ]);
  });

  it("57. no progress is fabricated on unopened slides", () => {
    const topic = getTopic("ch01-t01")!;
    const recordIds = topic.slides.map((s) => s.recordId);
    const state = readTopicLearningState("ch01-t01", recordIds);
    for (const id of recordIds) expect(isViewed(state, id)).toBe(false);
  });

  it("58. completion remains explicit — never inferred from viewing", () => {
    const state = withViewed({}, "r1", T0);
    expect(isCompleted(state, "r1")).toBe(false);
  });

  it("59. mastery remains unmodified — never fabricated by viewing or completing", () => {
    let state: TopicLearningState = {};
    state = withViewed(state, "r1", T0);
    state = withCompleted(state, "r1", T1);
    expect(isMastered(state, "r1")).toBe(false);
  });

  it("60. existing legacy storage is still readable", () => {
    window.localStorage.setItem(
      "phsh111:ch01-t01.slides.viewedRecordIds",
      JSON.stringify(["ch01-t01-block-opening"]),
    );
    const state = readTopicLearningState("ch01-t01");
    expect(isViewed(state, "ch01-t01-block-opening")).toBe(true);
  });
});
