// Integrity/checksum validation for the approved Batch 1 inputs — Node-side
// filesystem + crypto hashing (no production runtime cryptography is added;
// this runs only in the test environment, matching the authorization
// record's instruction not to duplicate a build/test integrity check with
// unnecessary production-side cryptography).
//
// Expected checksums below are copied verbatim from the external governance
// records that established them (ENGLISH_BATCH1_BASELINE_APPROVAL.json,
// ARABIC_BATCH1_BASELINE_APPROVAL.json, VISUAL_BATCH1_APPROVAL.json) — this
// file does not compute "what the checksum currently is" and assert against
// itself (which would trivially always pass); it asserts against the
// independently-recorded approved values, so any future drift in the
// source files is caught here.
import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { APP_TOPIC_ORDER } from "../types/pilotSchema";
import { RAW_CONTENT_BY_TOPIC, RAW_SVG_MARKUP_BY_TOPIC } from "../content/rawImports";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CHAPTER01_DIR = resolve(__dirname, "../../../../docs/content-design/chapter-01");

function sha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

const APPROVED = {
  englishT01: {
    path: resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t01-content.json"),
    // Baseline v1.9.0 — see ENGLISH_BATCH1_BASELINE_APPROVAL.json's
    // revisionLog: rev-003 adds ch01-t01-block-opening; rev-004 corrects
    // its explanatory prose (SI base-quantity accuracy, speed's derived
    // unit, qualitative-vs-quantitative wording); rev-005 restructures it
    // into a compact instructional format and removes a duplicated
    // explanation; rev-006 removes the electric-charge-derivation
    // sentence (Q = I t) and replaces the Scientific Note paragraph;
    // rev-007 adds ch01-t01-block-opening-2 (Slide 2); rev-008 corrects
    // Slide 2's length-vs-distance wording, removes the missingVisual
    // blocking reason, and migrates both slides to the generic "slide"
    // blockType with slideNumber/slideTitleEn metadata; rev-009 adds
    // ch01-t01-block-opening-3 (Slide 3, distance units table) via the
    // same generic slide architecture plus new generic tableEn/tableAr
    // fields; rev-010 applies pedagogical wording corrections to Slide 3
    // (Simple Example clarity, a labeled "Dimensions:" block replacing an
    // unlabeled multiplication, and a refined Scientific Note); rev-011
    // adds ch01-t01-block-opening-4 (Slide 4, different measurement
    // scales) with a new generic embedded raster figure (figureAssetPath/
    // figureAltEn/figureAltAr).
    sha256: "51df4d808ebffcded263929ec1e678e74c6276d1a942f180e04d0b06f67c99f1",
  },
  englishT04: {
    path: resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t04-content.json"),
    sha256: "c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b",
  },
  arabicT01: {
    path: resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t01-content.json"),
    // Baseline v1.0.10 — see ARABIC_BATCH1_BASELINE_APPROVAL.json's
    // revisionLog: rev-001 adds the Arabic side of ch01-t01-block-opening;
    // rev-002 corrects its translation to match the English rev-004 fixes;
    // rev-003 restructures it to match the English rev-005 compact format
    // and updates arabic.translationStatus from
    // "draft-ai-generated-unreviewed" to "draft"; rev-004 removes the
    // electric-charge-derivation sentence (Q = I t) and replaces the
    // Scientific Note paragraph, matching English rev-006; rev-005 adds
    // ch01-t01-block-opening-2 (Slide 2), matching English rev-007;
    // rev-006 corrects Slide 2's Arabic wording, removes the missingVisual
    // blocking reason, and migrates both slides to the generic "slide"
    // blockType, matching English rev-008; rev-007 adds the Arabic side of
    // ch01-t01-block-opening-3 (Slide 3), matching English rev-009;
    // rev-008 applies the same Slide 3 pedagogical wording corrections,
    // matching English rev-010; rev-009 adds the Arabic side of
    // ch01-t01-block-opening-4 (Slide 4), matching English rev-011;
    // rev-010 refines Slide 4's slideTitleAr and figureAltAr wording
    // (project-owner Arabic language review, no English-side change).
    sha256: "81e24964d29f9ee9ea80fe8b9475093f0f975de758d11de8ed4fcc52516e05b3",
  },
  arabicT04: {
    path: resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t04-content.json"),
    sha256: "d1f5bfbdc5332c4c9295887d5d2c4d4e19f8e36da7a8e3822ca551fed4f11371",
  },
  svgT01: {
    path: resolve(CHAPTER01_DIR, "batch1-visuals/ch01-t01-visual-001.svg"),
    sha256: "48c73a36fef43644ab810e500045c83777e57ba5bb25d1c1d64f5f887fc67a98",
  },
  svgT04: {
    path: resolve(CHAPTER01_DIR, "batch1-visuals/ch01-t04-visual-001.svg"),
    sha256: "163b5eaa0269ca96943bf136c913bba0b961247da7ab0b68bbbd22b5a475cec6",
  },
} as const;

describe("Batch 1 integrity — approved source files exist on disk", () => {
  for (const [label, { path }] of Object.entries(APPROVED)) {
    it(`${label} exists at its authorized path`, () => {
      expect(existsSync(path)).toBe(true);
    });
  }
});

describe("Batch 1 integrity — approved checksums match governance records", () => {
  for (const [label, { path, sha256: expected }] of Object.entries(APPROVED)) {
    it(`${label} checksum matches ENGLISH_BATCH1_BASELINE_APPROVAL.json / ARABIC_BATCH1_BASELINE_APPROVAL.json / VISUAL_BATCH1_APPROVAL.json`, () => {
      expect(sha256(path)).toBe(expected);
    });
  }
});

describe("Batch 1 integrity — SVG markup bundled by the app matches the approved checksum", () => {
  it("ch01-t01's bundled SVG markup, re-hashed, matches VISUAL_BATCH1_APPROVAL.json", () => {
    const bundled = RAW_SVG_MARKUP_BY_TOPIC["ch01-t01"];
    const hash = createHash("sha256").update(bundled, "utf8").digest("hex");
    expect(hash).toBe(APPROVED.svgT01.sha256);
  });

  it("ch01-t04's bundled SVG markup, re-hashed, matches VISUAL_BATCH1_APPROVAL.json", () => {
    const bundled = RAW_SVG_MARKUP_BY_TOPIC["ch01-t04"];
    const hash = createHash("sha256").update(bundled, "utf8").digest("hex");
    expect(hash).toBe(APPROVED.svgT04.sha256);
  });
});

describe("ch01-t01-block-opening — governance-status transition (ARABIC_BATCH1_BASELINE_APPROVAL.json revisionLog rev-003)", () => {
  it("arabic.translationStatus is 'draft' (not 'draft-ai-generated-unreviewed', not 'approved')", () => {
    const ar = JSON.parse(readFileSync(APPROVED.arabicT01.path, "utf8"));
    const opening = ar.records.find((r: any) => r.record.blockId === "ch01-t01-block-opening");
    expect(opening).toBeDefined();
    expect(opening.record.arabic.translationStatus).toBe("draft");
  });

  it("terminologyApprovalStatus remains 'pending' — this revision did not claim glossary-level approval", () => {
    const ar = JSON.parse(readFileSync(APPROVED.arabicT01.path, "utf8"));
    const opening = ar.records.find((r: any) => r.record.blockId === "ch01-t01-block-opening");
    expect(opening.record.arabic.terminologyApprovalStatus).toBe("pending");
  });

  it("blocking.blockingStatus remains 'blocked' — the translationStatus wording change does not lift the block", () => {
    const en = JSON.parse(readFileSync(APPROVED.englishT01.path, "utf8"));
    const opening = en.records.find((r: any) => r.record.blockId === "ch01-t01-block-opening");
    expect(opening.record.blocking.blockingStatus).toBe("blocked");
    expect(opening.record.blocking.studentFacingAllowed).toBe(false);
  });
});

describe("Batch 1 integrity — English/Arabic non-localized fields agree (raw files, before merge)", () => {
  it("ch01-t01: English and Arabic files carry identical topicId, schemaVersion, and record IDs/order", () => {
    const en = JSON.parse(readFileSync(APPROVED.englishT01.path, "utf8"));
    const ar = JSON.parse(readFileSync(APPROVED.arabicT01.path, "utf8"));
    expect(ar.schemaVersion).toBe(en.schemaVersion);
    expect(ar.topicId).toBe(en.topicId);
    expect(ar.records.length).toBe(en.records.length);
    const idOf = (r: any) => r.record.blockId ?? r.record.instructorScriptId ?? r.record.problemId;
    expect(ar.records.map(idOf)).toEqual(en.records.map(idOf));
  });

  it("ch01-t04: English and Arabic files carry identical topicId, schemaVersion, and record IDs/order", () => {
    const en = JSON.parse(readFileSync(APPROVED.englishT04.path, "utf8"));
    const ar = JSON.parse(readFileSync(APPROVED.arabicT04.path, "utf8"));
    expect(ar.schemaVersion).toBe(en.schemaVersion);
    expect(ar.topicId).toBe(en.topicId);
    expect(ar.records.length).toBe(en.records.length);
    const idOf = (r: any) => r.record.blockId ?? r.record.instructorScriptId ?? r.record.problemId;
    expect(ar.records.map(idOf)).toEqual(en.records.map(idOf));
  });
});

describe("Batch 1 integrity — no unapproved topic or asset is loaded", () => {
  it("RAW_CONTENT_BY_TOPIC contains exactly the six authorized topics, no more, no fewer", () => {
    const keys = Object.keys(RAW_CONTENT_BY_TOPIC).sort();
    expect(keys).toEqual([...APP_TOPIC_ORDER].sort());
  });

  it("no placeholder or out-of-scope topic ID (e.g. ch01-t05, ch01-t09) is present anywhere in the loaded set", () => {
    const outOfScope = ["ch01-t05", "ch01-t06", "ch01-t07", "ch01-t09", "ch01-t11", "ch01-t12", "ch01-t13", "ch01-t14"];
    for (const id of outOfScope) {
      expect(Object.prototype.hasOwnProperty.call(RAW_CONTENT_BY_TOPIC, id)).toBe(false);
    }
  });
});
