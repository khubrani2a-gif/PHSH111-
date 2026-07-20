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
    // Baseline v1.2.0 — see ENGLISH_BATCH1_BASELINE_APPROVAL.json's
    // revisionLog: rev-003 adds ch01-t01-block-opening; rev-004 corrects
    // its explanatory prose (SI base-quantity accuracy, speed's derived
    // unit, qualitative-vs-quantitative wording).
    sha256: "084a584721e35033c062a52ff4e43146522dca33c66ff48e7c71069b8be156b6",
  },
  englishT04: {
    path: resolve(CHAPTER01_DIR, "batch1-drafts/ch01-t04-content.json"),
    sha256: "c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b",
  },
  arabicT01: {
    path: resolve(CHAPTER01_DIR, "batch1-arabic-drafts/ch01-t01-content.json"),
    // Baseline v1.0.2 — see ARABIC_BATCH1_BASELINE_APPROVAL.json's
    // revisionLog: rev-001 adds the Arabic side of ch01-t01-block-opening;
    // rev-002 corrects its translation to match the English rev-004 fixes.
    sha256: "81023df61605a919796ac2183e4d6d87cdbfbd7ce6a42842f60a6c879c0d27e2",
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
