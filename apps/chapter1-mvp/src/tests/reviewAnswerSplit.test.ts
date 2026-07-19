import { describe, expect, it } from "vitest";
import { splitReviewAnswer, REVIEW_ANSWER_MARKER_BY_TOPIC } from "../features/topics/ReviewQuestion";
import { getTopic } from "../content/adapter";

describe("splitReviewAnswer — safety conditions", () => {
  it("returns null (no split) when the marker does not occur at all", () => {
    expect(splitReviewAnswer("A question with no marker present.", "Correct answer:")).toBeNull();
  });

  it("returns null (no split) when the marker occurs more than once — ambiguous, never guesses 'the first one'", () => {
    const text = "Correct answer: first. Later, Correct answer: second.";
    expect(splitReviewAnswer(text, "Correct answer:")).toBeNull();
  });

  it("returns null (no split) when the marker is at the very start — there is no real question part", () => {
    expect(splitReviewAnswer("Correct answer: only this.", "Correct answer:")).toBeNull();
  });

  it("returns null (no split) when nothing meaningful follows the marker — there is no real answer part", () => {
    expect(splitReviewAnswer("A question. Correct answer:", "Correct answer:")).toBeNull();
    expect(splitReviewAnswer("A question. Correct answer:   ", "Correct answer:")).toBeNull();
  });

  it("returns null when the marker string itself is empty", () => {
    expect(splitReviewAnswer("Some text.", "")).toBeNull();
  });

  it("splits correctly on a single, well-formed occurrence, and question + answer reconstructs the original exactly", () => {
    const text = "Is X true? Correct answer: Yes, because Y.";
    const result = splitReviewAnswer(text, "Correct answer:");
    expect(result).not.toBeNull();
    expect(result!.question).toBe("Is X true? ");
    expect(result!.answer).toBe("Correct answer: Yes, because Y.");
    expect(result!.question + result!.answer).toBe(text);
  });

  it("splits correctly on the Arabic marker too, with exact reconstruction", () => {
    const text = "هل هذا صحيح؟ الإجابة الصحيحة: نعم، لأن كذا.";
    const marker = "الإجابة الصحيحة:";
    const result = splitReviewAnswer(text, marker);
    expect(result).not.toBeNull();
    expect(result!.question + result!.answer).toBe(text);
    expect(result!.answer.startsWith(marker)).toBe(true);
  });
});

describe("splitReviewAnswer — against ch01-t01's real, approved reviewQuestion text", () => {
  const marker = REVIEW_ANSWER_MARKER_BY_TOPIC["ch01-t01"]!;

  it("splits the real English text with exact reconstruction and no content loss", () => {
    const topic = getTopic("ch01-t01");
    const original = topic?.reviewQuestion?.text.en ?? "";
    const result = splitReviewAnswer(original, marker.en);
    expect(result).not.toBeNull();
    expect(result!.question + result!.answer).toBe(original);
    expect(result!.answer).toContain("Correct answer:");
  });

  it("splits the real Arabic text with exact reconstruction and no content loss", () => {
    const topic = getTopic("ch01-t01");
    const original = topic?.reviewQuestion?.text.ar ?? "";
    const result = splitReviewAnswer(original, marker.ar);
    expect(result).not.toBeNull();
    expect(result!.question + result!.answer).toBe(original);
    expect(result!.answer).toContain("الإجابة الصحيحة:");
  });
});
