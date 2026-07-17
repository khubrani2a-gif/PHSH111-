# PHSH111 Batch 1 — ch01-t04 Schema Closure Report

**Revised:** 2026-07-16. **This is the final narrowly scoped draft-only revision for Batch 1**, resolving the single remaining item identified in `docs/app/PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md`. No scientific wording or scenario was changed. No baseline approval occurred. No Arabic or visual content was generated. No application expansion occurred. Publication remains unauthorized.

## 1. Purpose

To remove the one unmodeled field (`calculation[0].roundedResult`) that `PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md` §6 identified as "tolerated but not modeled" by schemaVersion 2.3.0's pilot precedent, the TypeScript `CalculationEntry` interface, the validator, and the adapter — while fully preserving the scientific and numerical content that field carried, entirely within already-established fields.

## 2. Closure-review finding

`PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md` §6/§9 (`ch01-t04` recommendation: "Requires one more draft-only revision"): `ch01-prob-104.calculation[0].roundedResult` is a field with no precedent in any of the four pilot problem records (all of which use exactly the same 7-field `calculation` entry shape), no declaration in `apps/chapter1-mvp/src/types/pilotSchema.ts`'s closed `CalculationEntry` interface, no validation logic in `validate.ts` that inspects it, and no read path in `adapter.ts`'s `normalizeProblem` or `SolutionReveal.tsx`'s rendering — meaning it would remain silently inert (present but never displayed) if this topic were later integrated into the application without further adapter work.

## 3. Exact record and field removed

**File:** `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json`. **Record:** `ch01-prob-104`. **Field removed:** `calculation[0].roundedResult` (the string `"4.4 x 10^2 N"`). No other field in this record, and no field in any other record in this file, was touched. `ch01-t01-content.json` was not opened for editing and is confirmed untouched (§9).

## 4. Why `roundedResult` was unsupported

Independently re-confirmed during this task, consistent with the closure review's own findings:

- **Pilot precedent:** all `calculation` entries across `ch01-prob-102`, `-103`, `-108`, `-110` use exactly the same 7 fields (`calculationId`, `expression`, `substitution`, `result`, `unit`, `roundingRule`, `significantFigures`) — none has an 8th field.
- **TypeScript model:** `pilotSchema.ts`'s `CalculationEntry` interface declares exactly those 7 fields, with no index signature (unlike `SourceVariant`, which does, or `VisualGovernanceEntry`, which declares its extensions as explicit optional properties).
- **Validator:** `validate.ts`'s `validateProblem` checks only that `calculation` is an array; it does not inspect individual entry fields, so the extra field would not have caused a validation error, but also received no recognition.
- **Adapter/renderer:** `adapter.ts`'s `normalizeProblem` builds each step's `expression` from only `{expression, substitution, result, unit}`; `SolutionReveal.tsx` renders `step.expression.result`/`.unit` directly. Nothing in either file reads `roundedResult`.

## 5. Supported fields used instead

The field's entire content is now expressed inside `calculation[0].roundingRule` — a field every pilot problem record already uses for exactly this kind of rounding/precision note:

**Before:** `"roundingRule": "result field is the unrounded product (441 N); both given values (45 kg, 9.8 m/s^2) carry two significant figures, so the reported/final value is rounded to two significant figures"` (paired with a separate `"roundedResult": "4.4 x 10^2 N"` field).

**After:** `"roundingRule": "result field (441 N) is the unrounded product; both given values (45 kg, 9.8 m/s^2) carry two significant figures, so 441 N is rounded to 4.4 x 10^2 N for the reported/final value"` (no `roundedResult` field; the rounded value now stated directly, in full, inside `roundingRule` itself). No information was lost — the rounded value `4.4 x 10^2 N` is still explicitly present in the record, exactly as the task required, now inside a field the pilot precedent and TypeScript model already recognize. No new field was introduced.

## 6. Unrounded calculation verification

`calculation[0].result` remains `441.0` (unchanged). `calculation[0].expression` remains `"45 * 9.8"` and `.substitution` remains `"45 kg x 9.8 m/s^2"` (unchanged). `numberedSolution[0].explanation` still states "W = mg = 45 kg x 9.8 m/s^2 = 441 N (unrounded)" (unchanged, not touched by this task). Independently recomputed for this report: `45 × 9.8 = 441.00000000000006`, matching the retained `441.0` value exactly.

## 7. Significant-figure verification

`calculation[0].significantFigures` remains `2` (unchanged). `roundingRule` now explicitly states, in one self-contained sentence, that `441 N` is rounded to `4.4 x 10^2 N` because both `45 kg` and `9.8 m/s²` carry two significant figures — satisfying the requirement that the field "clearly states that 441 N is rounded to 4.4 x 10^2 N because both numerical inputs have two significant figures." `440` (i.e., `4.4 × 10²`) is the correct two-significant-figure result of `45 × 9.8`, independently re-confirmed.

## 8. Final-answer consistency

All fields whose role is to state the final reported answer were re-checked after this edit and remain exactly as the prior revision task set them (none was touched by this task, since the task's scope was limited to `calculation[0]`):

| Field | Value |
|---|---|
| `finalAnswer.value` | "4.4 x 10^2 N at Earth's surface; mass remains 45 kg everywhere" |
| `finalAnswer.interpretation` | "...is 4.4 x 10^2 N (441 N unrounded, reported to two significant figures...)..." |
| `correctedAnswer.value` | "4.4 x 10^2 N at Earth's surface; mass 45 kg, unchanged everywhere" |
| `sourceVariants[0].answerVariant` | "4.4 x 10^2 N; mass unchanged" |
| `intuition` | "4.4 x 10^2 N is a reasonable size..." |
| `numberedSolution[0]`/`[1]` | Both reference "4.4 x 10^2 N" as the reported figure, "441 N" only as the labeled-unrounded intermediate |

All six agree exactly. `4.4 x 10^2 N` (plain `x` and caret `^2`) was retained throughout — no Unicode `×`/`²` was introduced, consistent with `equationRenderer.tsx`'s caret-to-`<sup>` rendering mechanism and the file's own established typographic convention.

## 9. Schema and identifier validation

- File parses as valid JSON — confirmed.
- `schemaVersion` remains `"2.3.0"` — confirmed.
- Record count remains **8** — confirmed (`ch01-is-104`, six `ch01-t04-block-*` contentBlocks, `ch01-prob-104`).
- All record IDs unchanged — confirmed, identical to the set recorded in every prior task's verification.
- `roundedResult` no longer appears anywhere in the file — confirmed by a full-file substring search (zero matches).
- No unsupported field was added — `calculation[0]` now has exactly the same 7 keys as every pilot problem's calculation entries (`calculationId`, `expression`, `substitution`, `result`, `unit`, `roundingRule`, `significantFigures`), script-verified.
- `441 N` appears only as an explicitly labeled unrounded intermediate value, in three places, never unqualified as a final answer (unchanged from the prior revision, re-verified).
- Every final reported answer reads `4.4 x 10^2 N` — confirmed (§8).
- `significantFigures` remains `2` — confirmed.
- `roundingRule` contains the complete rounding explanation, including both the unrounded and rounded values and the reason (two significant figures on both inputs) — confirmed.
- `scientificCorrectionIds` (`{"ch01-corr-002"}`) and every `locatorId` (`SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`) — confirmed unchanged.
- The independent structural validator used throughout this project's prior Batch 1 tasks (checking every `required` field, enum, and pattern declared in `CANONICAL_DESIGN_SCHEMA.json`'s relevant `$defs`) was re-run against both draft files after this edit: **zero errors.**

## 10. Arabic missing-state verification

All 13 applicable records across both files (6 `ch01-t01` contentBlocks, unaffected by this task; 6 `ch01-t04` contentBlocks; 1 `ch01-t04` problem) re-checked: `arabic.translationStatus: "missing"`, `arabic.originalArabicText.text: null`, `arabic.canonicalArabicTranslation.text: null` on every one. Nothing was copied into any Arabic field by this edit. No Arabic prose was generated.

## 11. Governance status

All 8 records in `ch01-t04-content.json` re-confirmed `blocking.blockingStatus: "blocked"` and `blocking.studentFacingAllowed: false` after this edit. No visual asset was created or altered (`ch01-t04-block-visual`'s `visualGovernance[0].availabilityStatus` remains `"missing"`, untouched by this task). `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, `SCIENTIFIC_CORRECTIONS.json`, `DUPLICATE_AND_CONFLICT_DECISIONS.json`, `BILINGUAL_GLOSSARY.json`, `IDENTIFIER_REGISTRY.json`, the four pilot topic files, and all application code/tests/package files were **not modified** — confirmed via `git status --porcelain`, which shows no change to any file outside `ch01-t04-content.json` and this new report. No English baseline approval was granted. No independent expert approval is claimed. Publication remains unauthorized.

## 12. Batch 1 readiness recommendation

With this edit applied, the one item `PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md` identified as outstanding for `ch01-t04` is now resolved using only already-recognized fields, and no other open finding remains from any prior review or closure pass for either topic. **Advisory recommendation (not a decision): both `ch01-t01` and `ch01-t04` now appear ready for a controlled English baseline-approval review**, at the project owner's discretion. This report does not perform or grant that approval.

## 13. Exact next controlled task

A separately authorized **English baseline-approval task** for `ch01-t01` and/or `ch01-t04`, using `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s existing pattern (a `baselineVersion`, `status: "approved"`, per-topic `perTopicDecision`, `revisionControlPolicy.revisionLog`) — not performed by this task.

---

### Explicit statements

- **No scientific wording or scenario changed** — the physical scenario (45 kg cart, `W = mg`, Earth's-surface-vs-weaker-gravity comparison), the equation, the given values, the units, the record ID, and all source lineage are exactly as before this edit.
- **No baseline approval occurred.**
- **No Arabic or visual content was generated.**
- **No application expansion occurred.**
- **Publication remains unauthorized.**
