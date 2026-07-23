import { describe, expect, it } from "vitest";
import { getTopic, getTopicOrder, loadAllTopics } from "../content/adapter";
import { APP_TOPIC_ORDER, PILOT_TOPIC_ORDER } from "../types/pilotSchema";
import { RAW_CONTENT_BY_TOPIC } from "../content/rawImports";

describe("content adapter — real canonical data (four pilot topics + Batch 1)", () => {
  it("loads all six authorized topics (four pilot + Batch 1's ch01-t01/ch01-t04)", () => {
    const { topics } = loadAllTopics();
    expect(topics).toHaveLength(6);
    expect(topics.map((t) => t.topicId).sort()).toEqual([...APP_TOPIC_ORDER].sort());
  });

  it("preserves the correct chapter-wide topic order (ch01-t01, t02, t03, t04, t08, t10)", () => {
    expect(getTopicOrder()).toEqual(["ch01-t01", "ch01-t02", "ch01-t03", "ch01-t04", "ch01-t08", "ch01-t10"]);
  });

  it("keeps the original four-topic PILOT_TOPIC_ORDER constant unchanged and a subset of the six in the same relative order (regression guard)", () => {
    expect(PILOT_TOPIC_ORDER).toEqual(["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]);
    const order = getTopicOrder();
    const pilotPositions = PILOT_TOPIC_ORDER.map((id) => order.indexOf(id));
    expect(pilotPositions).toEqual([...pilotPositions].sort((a, b) => a - b));
  });

  it("produces no error-severity diagnostics for the real canonical data", () => {
    const { diagnostics } = loadAllTopics();
    const errors = diagnostics.filter((d) => d.severity === "error");
    expect(errors).toEqual([]);
  });

  it("returns correct localized topic titles for both languages, sourced from canonical topicTitle/topicTitleAr", () => {
    const t02 = getTopic("ch01-t02");
    expect(t02?.title.en).toBe("Distance, Units, Area and Volume");
    expect(t02?.title.ar).toBe("المسافة والوحدات والمساحة والحجم");

    const t10 = getTopic("ch01-t10");
    expect(t10?.title.en).toBe("Centripetal Acceleration");
    expect(t10?.title.ar).toBe("التسارع المركزي");
  });

  it("never places a visibility:instructor record in the learner-facing fields (mainIdea/explanation/equations/workedExample)", () => {
    const { topics } = loadAllTopics();
    for (const topic of topics) {
      for (const section of [topic.mainIdea, topic.explanation, topic.equations, topic.workedExample]) {
        if (section) {
          expect(section.visibility).not.toBe("instructor");
        }
      }
      // Every instructor-only record for this topic is a misconception
      // block (the only blockType with visibility:"instructor" in the
      // current schema) and is never one of the above four fields.
      for (const note of topic.instructorNotes) {
        expect(note.blockType).toBe("misconception");
      }
    }
  });

  it("keeps governance.studentFacingAllowed false for every topic (matches source blocking.studentFacingAllowed everywhere false)", () => {
    const { topics } = loadAllTopics();
    for (const topic of topics) {
      expect(topic.governance.studentFacingAllowed).toBe(false);
      expect(topic.governance.studentPublicationAuthorized).toBe(false);
    }
  });

  it("counts exactly 9 records per original pilot topic (1 instructorScript + 7 contentBlock + 1 problem), matching the source file", () => {
    for (const topicId of PILOT_TOPIC_ORDER) {
      expect(getTopic(topicId)?.governance.recordCount).toBe(9);
    }
  });

  it("counts the correct, different record totals for Batch 1's two topics (ch01-t01: 20, includes ch01-t01-block-opening through ch01-t01-block-opening-13, no problem; ch01-t04: 8, includes ch01-prob-104)", () => {
    expect(getTopic("ch01-t01")?.governance.recordCount).toBe(20);
    expect(getTopic("ch01-t04")?.governance.recordCount).toBe(8);
  });

  it("preserves the original source record ID on every normalized section", () => {
    const t10 = getTopic("ch01-t10");
    expect(t10?.mainIdea?.recordId).toBe("ch01-t10-block-mainidea");
    expect(t10?.explanation?.recordId).toBe("ch01-t10-block-explanation");
    expect(t10?.equations?.recordId).toBe("ch01-t10-block-equations");
    expect(t10?.workedExample?.recordId).toBe("ch01-t10-block-example");
    expect(t10?.visual?.recordId).toBe("ch01-t10-block-visual");
    expect(t10?.problem?.recordId).toBe("ch01-prob-110");
    expect(t10?.instructorNotes[0]?.recordId).toBe("ch01-t10-block-misconception");
  });

  it("resolves the visual asset and marks it not-yet-human-reviewed, matching the real validation record", () => {
    const t10 = getTopic("ch01-t10");
    expect(t10?.visual?.svgMarkup).toBeTruthy();
    expect(t10?.visual?.studentFacingAllowed).toBe(false);
    expect(t10?.visual?.reviewer).toBeNull();
    expect(t10?.governance.visualReviewStatus).toBe("readyForHumanReview");
  });

  it("supports previous/next lookups following the fixed six-topic order", () => {
    const order = getTopicOrder();
    expect(order[0]).toBe("ch01-t01");
    expect(order[order.length - 1]).toBe("ch01-t10");
    expect(order[1]).toBe("ch01-t02");
    expect(order[2]).toBe("ch01-t03");
    expect(order[3]).toBe("ch01-t04");
    expect(order[4]).toBe("ch01-t08");
    expect(order[5]).toBe("ch01-t10");
  });

  it("does not mutate the raw imported JSON (adapter is read-only)", () => {
    const before = JSON.stringify(RAW_CONTENT_BY_TOPIC["ch01-t10"]);
    loadAllTopics();
    const after = JSON.stringify(RAW_CONTENT_BY_TOPIC["ch01-t10"]);
    expect(after).toBe(before);
  });
});
