// Focused content-integrity tests for PR G1 (content/ch01-t05-english-draft) —
// the first controlled English canonical draft for ch01-t05 (Average and
// Instantaneous Speed). This content is NOT wired into the application (no
// rawImports.ts entry, not part of PilotTopicId/APP_TOPIC_ORDER), so these
// tests read the raw draft JSON file directly (Node fs), mirroring
// src/tests/batch1Integrity.test.ts's and
// src/tests/ch01t05GovernanceCorrections.test.ts's raw-file-read pattern,
// rather than going through src/content/adapter.ts.
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTER01_DIR = resolve(__dirname, "../../../../docs/content-design/chapter-01");

const EN_PATH = resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t05-content.json");
const AR_PATH = resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t05-content.json");
const PILOT_PATH = resolve(CHAPTER01_DIR, "pilot/ch01-t05-content.json");

const doc = JSON.parse(readFileSync(EN_PATH, "utf8"));
const records: any[] = doc.records;

function recordId(rec: any): string | undefined {
  return rec.blockId ?? rec.instructorScriptId ?? rec.problemId;
}

function findByBlockId(blockId: string): any {
  const r = records.find((r) => recordId(r.record) === blockId);
  expect(r, `record ${blockId} should exist`).toBeDefined();
  return r.record;
}

const instructorScript = findByBlockId("ch01-is-105");
const mainIdea = findByBlockId("ch01-t05-block-mainidea");
const explanation = findByBlockId("ch01-t05-block-explanation");
const equations = findByBlockId("ch01-t05-block-equations");
const example = findByBlockId("ch01-t05-block-example");
const misconception = findByBlockId("ch01-t05-block-misconception");
const reviewQuestion = findByBlockId("ch01-t05-block-review");
const problem = findByBlockId("ch01-prob-105");

// "Teaching" text fields only — where Bolt/displacement/velocity/etc. content
// would actually be taught to a reader, as opposed to governance/provenance/
// exclusion-disclosure fields where mentioning the excluded topic is expected
// and required.
const TEACHING_TEXT = [
  instructorScript.openingHook.text,
  instructorScript.meaningfulQuestion.text,
  instructorScript.mainIdea.text,
  ...instructorScript.learningObjectives.map((o: any) => o.text),
  instructorScript.wordForWordTeachingScript.text,
  instructorScript.intuition.text,
  ...instructorScript.questionsToAskStudents.map((o: any) => o.text),
  ...instructorScript.expectedStudentResponses.map((o: any) => o.text),
  mainIdea.localizedContent.en.text,
  explanation.localizedContent.en.text,
  equations.localizedContent.en.text,
  example.localizedContent.en.text,
  misconception.localizedContent.en.text,
  reviewQuestion.localizedContent.en.text,
  problem.problemStatement.text,
  problem.conceptualInterpretation.text,
  ...problem.numberedSolution.map((s: any) => s.explanation.text),
  problem.finalAnswer.interpretation.text,
  problem.intuition.text,
].join("\n\n");

describe("PR G1 — file location and topic metadata", () => {
  it("1. ch01-t05-content.json exists only in batch1-drafts", () => {
    expect(existsSync(EN_PATH)).toBe(true);
  });

  it("1b. no ch01-t05-content.json exists under pilot/", () => {
    expect(existsSync(PILOT_PATH)).toBe(false);
  });

  it("2. the authorized Arabic output is a candidate draft, not an approved baseline", () => {
    expect(existsSync(AR_PATH)).toBe(true);
    const candidate = JSON.parse(readFileSync(AR_PATH, "utf8"));
    expect(candidate.topicId).toBe("ch01-t05");
    expect(candidate.generationStatus).toBe("draft-batch1-arabic-candidate-generation");
    for (const { record } of candidate.records) {
      expect(record.arabic.translationStatus).toBe("draft");
      expect(record.blocking.studentFacingAllowed).toBe(false);
      expect(record.blocking.blockingStatus).toBe("blocked");
    }
  });

  it("3. topic ID is ch01-t05", () => {
    expect(doc.topicId).toBe("ch01-t05");
  });

  it("4. topic title is correct (English) and Arabic title is explicitly null", () => {
    expect(doc.topicTitle).toBe("Average and Instantaneous Speed");
    expect(doc.topicTitleAr).toBeNull();
  });

  it("schemaVersion and generationStatus match the established Batch 1 English-only convention", () => {
    expect(doc.schemaVersion).toBe("2.3.0");
    expect(doc.generationStatus).toBe("draft-batch1-english-only-generation");
  });
});

describe("PR G1 — required foundational records", () => {
  it("5. all 8 required foundational record types exist", () => {
    const types = records.map((r) => r.record.blockType ?? r.recordType);
    expect(records).toHaveLength(8);
    expect(records[0].recordType).toBe("instructorScript");
    expect(types).toContain("mainIdea");
    expect(types).toContain("organizedExplanation");
    expect(types).toContain("equationSet");
    expect(types).toContain("example");
    expect(types).toContain("misconception");
    expect(types).toContain("reviewQuestion");
    expect(records[records.length - 1].recordType).toBe("problem");
  });

  it("6. no slide records exist", () => {
    const slideRecords = records.filter((r) => r.record.blockType === "slide");
    expect(slideRecords).toHaveLength(0);
  });

  it("no visualReference (figure) record exists — visual production is not authorized", () => {
    const visualRecords = records.filter((r) => r.record.blockType === "visualReference");
    expect(visualRecords).toHaveLength(0);
  });

  it("7. every record ID is unique", () => {
    const ids = records.map((r) => recordId(r.record));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("8a. contentBlock IDs follow the ^ch01-t[0-9]{2}-block-[a-z]+$ namespace pattern", () => {
    const pattern = /^ch01-t[0-9]{2}-block-[a-z]+$/;
    for (const r of records) {
      if (r.recordType === "contentBlock") {
        expect(r.record.blockId, r.record.blockId).toMatch(pattern);
      }
    }
  });

  it("8b. instructorScriptId and problemId follow their registered namespace patterns", () => {
    expect(instructorScript.instructorScriptId).toMatch(/^ch01-is-[0-9]{3}$/);
    expect(problem.problemId).toMatch(/^ch01-prob-[0-9]{3}$/);
  });

  it("8c. no record ID collides with ch01-t01 through ch01-t04's own IDs", () => {
    for (const r of records) {
      const id = recordId(r.record);
      expect(id, id).not.toMatch(/^ch01-t0[1-4]-/);
    }
    expect(instructorScript.instructorScriptId).not.toBe("ch01-is-101");
    expect(instructorScript.instructorScriptId).not.toBe("ch01-is-104");
    expect(problem.problemId).not.toBe("ch01-prob-104");
  });
});

describe("PR G1 — Arabic explicitly represented as missing", () => {
  it("9. every contentBlock and the problem record has arabic.translationStatus 'missing'", () => {
    // instructorScript has no top-level "arabic" governance object in this schema — each of
    // its own EN text fields already carries its own {text, status, language, direction}
    // shape, matching the ch01-t01/ch01-t04 instructorScript precedent — so it is excluded here.
    for (const r of records) {
      if (r.recordType === "instructorScript") continue;
      const rec = r.record;
      expect(rec.arabic, recordId(rec)).toBeDefined();
      expect(rec.arabic.translationStatus, recordId(rec)).toBe("missing");
      expect(rec.arabic.originalArabicText.text, recordId(rec)).toBeNull();
      expect(rec.arabic.originalArabicText.status, recordId(rec)).toBe("missing");
      expect(rec.arabic.canonicalArabicTranslation.text, recordId(rec)).toBeNull();
      expect(rec.arabic.canonicalArabicTranslation.status, recordId(rec)).toBe("missing");
      expect(rec.arabic.terminologyApprovalStatus, recordId(rec)).toBe("notStarted");
    }
  });

  it("9b. instructorScript's own EN text fields are all explicitly language: 'en', with no Arabic content invented", () => {
    expect(instructorScript.openingHook.language).toBe("en");
    expect(instructorScript.mainIdea.language).toBe("en");
    expect(instructorScript.wordForWordTeachingScript.language).toBe("en");
  });

  it("no localizedContent.ar key exists anywhere in this file", () => {
    for (const r of records) {
      const lc = r.record.localizedContent;
      if (lc) {
        expect(Object.prototype.hasOwnProperty.call(lc, "ar"), recordId(r.record)).toBe(false);
      }
    }
  });
});

describe("PR G1 — scientific spine: average speed, distance, stops", () => {
  it("10. average speed is defined as total distance traveled / total elapsed time", () => {
    expect(equations.localizedContent.en.text).toContain(
      "average speed = total distance traveled / total elapsed time",
    );
  });

  it("10b. symbolic form v_avg = d_total / Δt_total is used without velocity notation", () => {
    expect(equations.localizedContent.en.text).toContain("v_avg = d_total / Δt_total");
    expect(equations.localizedContent.en.text).toContain("a scalar, with no direction");
  });

  it("11. distance (total path length), not displacement, is used", () => {
    expect(equations.localizedContent.en.text).toContain(
      "the total path length covered, not displacement",
    );
  });

  it("12. total elapsed time is stated to include stops unless moving-time-only is requested", () => {
    expect(explanation.localizedContent.en.text).toContain(
      "Total elapsed time includes moving time, waiting time, and any stops",
    );
    expect(explanation.localizedContent.en.text).toContain(
      "unless a problem explicitly asks for the average speed while moving only",
    );
    expect(misconception.localizedContent.en.text).toContain(
      "total elapsed time includes all moving time, waiting time, and stops",
    );
  });
});

describe("PR G1 — instantaneous speed and speedometer", () => {
  it("13. instantaneous speed is explicitly distinguished from average speed", () => {
    expect(mainIdea.localizedContent.en.text).toContain("Instantaneous speed is the speed of an object at one");
    expect(mainIdea.localizedContent.en.text).toContain(
      "average speed and its instantaneous speed at any given moment are generally different",
    );
  });

  it("14. a speedometer is classified as an approximate instantaneous display, never the trip average", () => {
    expect(instructorScript.wordForWordTeachingScript.text).toContain(
      "shows an approximate reading of how fast the car is going right then, not the average speed for the whole trip",
    );
    expect(misconception.localizedContent.en.text).toContain(
      "a speedometer displays the average speed for the entire trip",
    );
    expect(misconception.localizedContent.en.text).toContain(
      "a speedometer displays an approximate instantaneous speed at that moment only",
    );
  });
});

describe("PR G1 correction — pace/speed conflation removed from the review question", () => {
  it("correction-1. the review question uses 'current speed', not 'current pace'", () => {
    const text = reviewQuestion.localizedContent.en.text;
    expect(text).toContain("current speed");
    expect(text.toLowerCase()).not.toContain("current pace");
  });

  it("correction-2. the review question uses 'average speed', not 'average pace'", () => {
    const text = reviewQuestion.localizedContent.en.text;
    expect(text).toContain("average speed");
    expect(text.toLowerCase()).not.toContain("average pace");
  });

  it("correction-3. no teaching field contains 'pace', 'min/km', or 'session average pace'", () => {
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("pace");
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("min/km");
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("session average pace");
    // Whole-file check too, since pace must not appear even outside the teaching-text fields.
    expect(JSON.stringify(doc).toLowerCase()).not.toContain("pace");
  });

  it("correction-4. the review question still defines average speed as total distance / total elapsed time", () => {
    const text = reviewQuestion.localizedContent.en.text;
    expect(text).toContain(
      "it equals the total distance covered during the ride divided by the total elapsed time for the ride",
    );
  });

  it("correction-5. the review question still identifies the continuously updating reading as a momentary instantaneous-speed reading", () => {
    const text = reviewQuestion.localizedContent.en.text;
    expect(text).toContain("the continuously updating 'current speed' reading is an instantaneous speed");
    expect(text).toContain("it describes the cyclist's speed at one particular moment, updated moment by moment");
  });
});

describe("PR G1 — arithmetic-mean caveat", () => {
  it("15. arithmetic averaging of speeds is not presented as the general rule", () => {
    expect(explanation.localizedContent.en.text).toContain(
      "It is tempting to simply average the listed speed values",
    );
    expect(explanation.localizedContent.en.text).toContain(
      "That shortcut gives the correct average speed only in the special case",
    );
  });

  it("16. the equal-time caveat is stated correctly (valid only when each speed applies to an equal time interval)", () => {
    expect(explanation.localizedContent.en.text).toContain(
      "where each listed speed was maintained for an equal time interval",
    );
    expect(explanation.localizedContent.en.text).toContain(
      "When each listed speed instead applies to an equal distance",
    );
    expect(explanation.localizedContent.en.text).toContain("averaging the speeds directly gives the wrong answer");
  });
});

describe("PR G1 — concept boundaries (distance vs. displacement, scalar speed, no premature topics)", () => {
  it("17. returning to the starting point does not make average speed zero", () => {
    expect(misconception.localizedContent.en.text).toContain(
      "if an object returns to its starting point, its average speed for the trip is zero",
    );
    expect(misconception.localizedContent.en.text).toContain(
      "average speed depends on total distance traveled",
    );
    expect(misconception.localizedContent.en.text).toContain("not on how far the object ends up from where it started");
  });

  it("18. speed is explicitly treated as a scalar (no direction)", () => {
    expect(misconception.localizedContent.en.text).toContain("speed is a scalar quantity");
    expect(misconception.localizedContent.en.text).toContain("it has a magnitude only, with no direction");
  });

  it("19. no velocity formula, average velocity, or displacement-based teaching content is taught", () => {
    expect(TEACHING_TEXT).not.toMatch(/v\s*=\s*Δ?x\s*\/\s*Δ?t/);
    expect(TEACHING_TEXT).not.toContain("average velocity");
    expect(TEACHING_TEXT).not.toContain("vector addition");
    // "velocity" is only ever named, never developed: it appears (a) identifying the concept
    // that adds direction to speed (misconception record's scalar-vs-vector clarification) and
    // (b) in the brief topic-transition sentence — permitted per instruction ("a brief
    // transition ... may say that velocity adds direction, but do not develop it"). No formula,
    // symbol, or worked example ever accompanies either mention.
    const velocityOccurrences = (TEACHING_TEXT.match(/velocity/gi) ?? []).length;
    expect(velocityOccurrences).toBeLessThanOrEqual(3);
    expect(misconception.localizedContent.en.text).toContain(
      "the physical quantity that adds direction to speed is velocity, a different topic",
    );
    expect(instructorScript.transitions[0].script.text).toContain("velocity");
  });

  it("20. no acceleration formula is taught", () => {
    expect(TEACHING_TEXT).not.toMatch(/a\s*=\s*Δ?v\s*\/\s*Δ?t/);
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("acceleration");
  });

  it("21. no calculus or limit notation appears anywhere, including governance text", () => {
    const fullText = JSON.stringify(doc);
    expect(fullText.toLowerCase()).not.toContain("derivative");
    expect(fullText).not.toMatch(/\blim\b/);
    expect(fullText).not.toMatch(/d[a-z]\/dt/);
  });

  it("21b. levelAdaptations does not describe the interval-shrinks-to-zero limit definition", () => {
    const fullText = JSON.stringify(doc).toLowerCase();
    expect(fullText).not.toContain("shrinks toward zero");
    expect(fullText).not.toContain("shrink toward zero");
    expect(fullText).not.toContain("interval shrinks");
    expect(instructorScript.levelAdaptations.join(" ")).toContain(
      "keeping the distinction conceptual and non-calculus-based",
    );
  });

  it("no position-time graph slope content is taught", () => {
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("slope");
    expect(TEACHING_TEXT.toLowerCase()).not.toContain("position-time graph");
  });
});

describe("PR G1 — Bolt exclusion (ch01-corr-005)", () => {
  it("22. no Bolt/Berlin-2009/Beijing-2008/9.58/9.69 content appears in any teaching field", () => {
    for (const term of ["Bolt", "Berlin 2009", "Beijing 2008", "9.58", "9.69"]) {
      expect(TEACHING_TEXT, term).not.toContain(term);
    }
  });

  it("the Bolt exclusion IS disclosed in governance-only fields (instructorOnlyCautions, generationNote, provenance)", () => {
    expect(doc.generationNote).toContain("Usain Bolt");
    expect(doc.generationNote).toContain("Berlin 2009, Beijing 2008, 9.58 s, 9.69 s");
    expect(instructorScript.instructorOnlyCautions.join(" ")).toContain("Usain Bolt");
  });

  it("27. no record cites ch01-corr-005 as supporting content (scientificCorrectionIds/provenance)", () => {
    for (const r of records) {
      const rec = r.record;
      if (rec.scientificCorrectionIds) {
        expect(rec.scientificCorrectionIds, recordId(rec)).not.toContain("ch01-corr-005");
      }
      if (rec.scientificCorrectionReferences) {
        expect(rec.scientificCorrectionReferences).not.toContain("ch01-corr-005");
      }
    }
    // ch01-corr-005 may appear only inside prose disclosing its exclusion, never as a cited ID array entry.
  });
});

describe("PR G1 — numerical correctness", () => {
  it("23. the general example's numbers are correct and physically plausible", () => {
    const text = example.localizedContent.en.text;
    expect(text).toContain("4000 m + 3000 m = 7000 m");
    expect(text).toContain("200 s + 100 s + 300 s = 600 s");
    expect(7000 / 600).toBeCloseTo(11.666666666666666, 10);
    expect(text).toContain("7000 m / 600 s ≈ 11.7 m/s");
    // naive arithmetic mean of the two segment speeds must be shown as WRONG, not as the answer
    expect((20 + 10) / 2).toBe(15);
    expect(text).toContain("(20 m/s + 10 m/s) / 2 = 15 m/s, which is not the trip's actual average speed");
  });

  it("25a. the example's units remain consistent (all meters and seconds, no unit mixing)", () => {
    const text = example.localizedContent.en.text;
    expect(text).not.toMatch(/\d+\s*km/);
    expect(text).not.toMatch(/\d+\s*h\b/);
  });

  it("24. the problem's solution is numerically correct", () => {
    expect(problem.givenValues.find((v: any) => v.symbol === "d_1").value).toBe(1200);
    expect(problem.givenValues.find((v: any) => v.symbol === "t_1").value).toBe(150);
    expect(problem.givenValues.find((v: any) => v.symbol === "t_stop").value).toBe(60);
    expect(problem.givenValues.find((v: any) => v.symbol === "d_2").value).toBe(1800);
    expect(problem.givenValues.find((v: any) => v.symbol === "t_2").value).toBe(200);

    const calc1 = problem.calculation.find((c: any) => c.calculationId === "ch01-prob-105-calc-1");
    const calc2 = problem.calculation.find((c: any) => c.calculationId === "ch01-prob-105-calc-2");
    const calc3 = problem.calculation.find((c: any) => c.calculationId === "ch01-prob-105-calc-3");

    expect(calc1.result).toBe(1200 + 1800);
    expect(calc1.unit).toBe("m");
    expect(calc2.result).toBe(150 + 60 + 200);
    expect(calc2.unit).toBe("s");
    expect(calc3.result).toBeCloseTo(3000 / 410, 10);
    expect(calc3.unit).toBe("m/s");
    expect(problem.finalAnswer.value).toContain("≈ 7.3 m/s");

    // Step 4 correctly classifies the phone reading as instantaneous, not average
    const step4 = problem.numberedSolution.find((s: any) => s.stepNumber === 4);
    expect(step4.explanation.text).toContain("it is an instantaneous speed, not the trip's average speed");
  });

  it("25b. the problem's units array and stated values remain consistent (m, s, m/s only)", () => {
    expect(problem.units).toEqual(["m", "s", "m/s"]);
    for (const v of problem.givenValues) {
      expect(["m", "s"]).toContain(v.unit);
    }
  });

  it("directionSign.applicable is false for the problem, since speed carries no direction", () => {
    expect(problem.directionSign.applicable).toBe(false);
  });
});

describe("PR G1 — correction links and blocking/publication restrictions", () => {
  it("26. every contentBlock/instructorScript record links to ch01-corr-010 and/or ch01-corr-011", () => {
    for (const r of records) {
      if (r.recordType === "problem") continue; // problem records link via sourceVariants[].correctionRecordIds instead
      const rec = r.record;
      const ids = rec.scientificCorrectionIds ?? rec.scientificCorrectionReferences;
      expect(ids, recordId(rec)).toBeDefined();
      expect(ids.length, recordId(rec)).toBeGreaterThan(0);
      expect(
        ids.some((id: string) => id === "ch01-corr-010" || id === "ch01-corr-011"),
        recordId(rec),
      ).toBe(true);
    }
  });

  it("26b. the problem record links to ch01-corr-010/ch01-corr-011 via its selected source variant", () => {
    const variant = problem.sourceVariants.find(
      (v: any) => v.variantId === problem.selectedVariantIds[0],
    );
    expect(variant.correctionRecordIds).toEqual(
      expect.arrayContaining(["ch01-corr-010", "ch01-corr-011"]),
    );
    expect(variant.correctionRecordIds).not.toContain("ch01-corr-005");
  });

  it("every contentBlock's conflictRecordIds reference CD-CONF-009 and/or CD-CONF-010", () => {
    for (const r of records) {
      if (r.recordType === "contentBlock") {
        const ids = r.record.conflictRecordIds;
        expect(ids.length, r.record.blockId).toBeGreaterThan(0);
        expect(
          ids.every((id: string) => id === "CD-CONF-009" || id === "CD-CONF-010"),
          r.record.blockId,
        ).toBe(true);
      }
    }
  });

  it("28. every record remains blocked from student-facing use", () => {
    for (const r of records) {
      const blocking = r.record.blocking;
      expect(blocking.blockingStatus, recordId(r.record)).toBe("blocked");
      expect(blocking.studentFacingAllowed, recordId(r.record)).toBe(false);
      expect(blocking.instructorFacingAllowed, recordId(r.record)).toBe(true);
    }
  });

  it("no record claims editorial, scientific, Arabic, baseline, or application-integration approval", () => {
    const fullText = JSON.stringify(doc);
    expect(fullText).not.toContain('"approvalStatus":"approved"');
    expect(fullText).not.toContain('"approvalStatus":"editoriallyApproved"');
    expect(fullText).not.toContain('"baselineApproved":true');
  });
});

describe("PR G5 — authorized internal application registration", () => {
  it("29a. PilotTopicId and APP_TOPIC_ORDER include ch01-t05 in numerical order", () => {
    const schemaText = readFileSync(resolve(__dirname, "../types/pilotSchema.ts"), "utf8");
    const unionMatch = schemaText.match(/export type PilotTopicId =[\s\S]*?;/);
    expect(unionMatch![0]).toContain("ch01-t05");
    const orderMatch = schemaText.match(/export const APP_TOPIC_ORDER:[\s\S]*?\];/);
    expect(orderMatch![0]).toContain("ch01-t05");
  });

  it("29b. raw imports use the approved source pair, while slide files remain untouched", () => {
    expect(readFileSync(resolve(__dirname, "../content/rawImports.ts"), "utf8")).toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/slideGroups.ts"), "utf8")).not.toContain("ch01-t05");
    expect(readFileSync(resolve(__dirname, "../content/slideShortTitles.ts"), "utf8")).not.toContain("ch01-t05");
  });

  it("29c. StructuredSlideContent.tsx has no ch01-t05 config entries", () => {
    const text = readFileSync(
      resolve(__dirname, "../features/topics/StructuredSlideContent.tsx"),
      "utf8",
    );
    expect(text).not.toContain("ch01-t05");
  });
});
