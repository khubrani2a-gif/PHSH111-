// The single, centralized module that imports canonical repository files
// from outside this application directory. Every other file in this
// application reads content through src/content/adapter.ts, never through
// a direct import of a source file — keeping all "reach outside src/"
// imports in one auditable place.
//
// Source of truth: docs/content-design/chapter-01/pilot/ (four content
// JSON files, four SVGs) and docs/content-design/chapter-01/pilot/visuals/
// (four visual-validation JSON records) for the original four pilot
// topics; docs/content-design/chapter-01/batch1-drafts/,
// batch1-arabic-drafts/, and batch1-visuals/ for Batch 1 (ch01-t01,
// ch01-t04), per PILOT_AUTHORIZATION.json v1.5.0's
// batch1ApplicationIntegrationAuthorization. Nothing here duplicates
// content — these are live imports of the canonical files themselves,
// resolved via Vite's module graph (see vite.config.ts's narrowly-scoped
// server.fs.allow for the dev-server case, which already covers the whole
// docs/content-design/chapter-01/ directory including the two Batch 1
// source directories — no config change was required; production builds
// bundle these at build time via Rollup, which needs no fs.allow).
//
// Batch 1's baseline is split across two separate immutable files per
// topic (English-only, Arabic candidate) rather than the single merged
// file each pilot topic has — src/content/batch1Merge.ts reconciles this
// with a deterministic, in-memory-only merge (never written to disk),
// invoked once below at module load time. A structural mismatch between
// the two approved files throws immediately (see batch1Merge.ts) rather
// than silently falling back to partial content.
//
// This file must never be edited to fix a content problem — content
// problems are fixed at the source path, or surfaced as an
// AdapterDiagnostic (see src/content/validate.ts). This file only wires
// already-authorized read paths together.

import ch01t02Content from "../../../../docs/content-design/chapter-01/pilot/ch01-t02-content.json";
import ch01t03Content from "../../../../docs/content-design/chapter-01/pilot/ch01-t03-content.json";
import ch01t08Content from "../../../../docs/content-design/chapter-01/pilot/ch01-t08-content.json";
import ch01t10Content from "../../../../docs/content-design/chapter-01/pilot/ch01-t10-content.json";

import ch01t02Validation from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t02-visual-001-validation.json";
import ch01t03Validation from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t03-visual-001-validation.json";
import ch01t08Validation from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t08-visual-001-validation.json";
import ch01t10Validation from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t10-visual-001-validation.json";

import ch01t02Svg from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t02-visual-001.svg?raw";
import ch01t03Svg from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t03-visual-001.svg?raw";
import ch01t08Svg from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t08-visual-001.svg?raw";
import ch01t10Svg from "../../../../docs/content-design/chapter-01/pilot/visuals/ch01-t10-visual-001.svg?raw";

// Batch 1 — approved English baseline (immutable; never edited by this application).
import ch01t01ContentEn from "../../../../docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json";
import ch01t04ContentEn from "../../../../docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json";

// Batch 1 — approved Arabic candidate baseline (immutable; never edited by this application).
import ch01t01ContentAr from "../../../../docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json";
import ch01t04ContentAr from "../../../../docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json";

// Batch 1 — approved visuals and their validation records.
import ch01t01Validation from "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001-validation.json";
import ch01t04Validation from "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001-validation.json";
import ch01t01Svg from "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001.svg?raw";
import ch01t04Svg from "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001.svg?raw";

// Batch 1 — per-slide embedded figures (not the topic-singular SVG above).
// Keyed by blockId (not topicId), since any number of slide records across
// any topic may carry their own embedded figure — generic, not specific to
// any one slide. A plain (non-`?raw`) import resolves to the
// build-time-hashed asset URL Vite emits, suitable for a real <img src> —
// this applies equally to a raster photo (ch01-t01-block-opening-4's JPEG)
// or a hand-authored SVG diagram (ch01-t01-block-opening-5's SVG,
// recreated cleanly from a source slide rather than kept as a raster crop
// containing an unrelated adjacent-slide remnant); the figure mechanism
// itself is agnostic to which.
import ch01t01BlockOpening4Figure from "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-block-opening-4-figure.jpg";
import ch01t01BlockOpening5Figure from "../../../../docs/content-design/chapter-01/batch1-visuals/ch01-t01-block-opening-5-figure.svg";

import type { PilotTopicId } from "../types/pilotSchema";
import { mergeEnglishAndArabicTopicFile } from "./batch1Merge";

// Computed once at module load — throws (failing the build/dev-server/test
// run immediately, never silently) if either approved Batch 1 topic's
// English and Arabic files have drifted out of structural agreement. See
// src/content/batch1Merge.ts for the exact equality/merge rules.
const ch01t01Content = mergeEnglishAndArabicTopicFile(ch01t01ContentEn, ch01t01ContentAr, "ch01-t01");
const ch01t04Content = mergeEnglishAndArabicTopicFile(ch01t04ContentEn, ch01t04ContentAr, "ch01-t04");

/** Raw (unvalidated `unknown`) content JSON, keyed by topic ID — narrowed only inside src/content/validate.ts. */
export const RAW_CONTENT_BY_TOPIC: Record<PilotTopicId, unknown> = {
  "ch01-t01": ch01t01Content,
  "ch01-t02": ch01t02Content,
  "ch01-t03": ch01t03Content,
  "ch01-t04": ch01t04Content,
  "ch01-t08": ch01t08Content,
  "ch01-t10": ch01t10Content,
};

/** Raw (unvalidated `unknown`) visual-validation JSON, keyed by topic ID. */
export const RAW_VISUAL_VALIDATION_BY_TOPIC: Record<PilotTopicId, unknown> = {
  "ch01-t01": ch01t01Validation,
  "ch01-t02": ch01t02Validation,
  "ch01-t03": ch01t03Validation,
  "ch01-t04": ch01t04Validation,
  "ch01-t08": ch01t08Validation,
  "ch01-t10": ch01t10Validation,
};

/** Raw SVG markup (string), unmodified from the source file, keyed by topic ID. */
export const RAW_SVG_MARKUP_BY_TOPIC: Record<PilotTopicId, string> = {
  "ch01-t01": ch01t01Svg,
  "ch01-t02": ch01t02Svg,
  "ch01-t03": ch01t03Svg,
  "ch01-t04": ch01t04Svg,
  "ch01-t08": ch01t08Svg,
  "ch01-t10": ch01t10Svg,
};

/**
 * Build-time asset URL for a slide's embedded raster figure, keyed by the
 * content-block record's own blockId — generic, not tied to any specific
 * slide number or topic. src/content/adapter.ts only attaches a
 * NormalizedSlide.figure when both this map has an entry for the record's
 * blockId AND the record itself supplies figureAltEn (see
 * src/types/pilotSchema.ts's figureAssetPath/figureAltEn/figureAltAr
 * header note) — adding a future slide's figure requires only a new
 * import line here plus the matching content-block fields, no adapter or
 * TopicPage wiring.
 */
export const RAW_FIGURE_URL_BY_BLOCK_ID: Record<string, string> = {
  "ch01-t01-block-opening-4": ch01t01BlockOpening4Figure,
  "ch01-t01-block-opening-5": ch01t01BlockOpening5Figure,
};
