# PHSH111 Batch 1 — English Draft Closure Verification

**Reviewed:** 2026-07-16. **This is a read-only advisory verification.** No draft file was modified. No baseline approval was granted. No Arabic or visual content was generated. No application expansion occurred. Publication remains unauthorized.

## 1. Purpose and limits

This document verifies whether the two draft-only revisions recorded in `docs/app/PHSH111_BATCH1_ENGLISH_DRAFT_REVISION_REPORT.md` actually and fully close the two findings raised in `docs/app/PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §23, independently re-derived from the current draft files rather than taken on the revision report's own word. It additionally performs a schema/adapter compatibility check on the one new field (`roundedResult`) the revision introduced, using the application's actual TypeScript models and rendering code — not only the custom structural validator used in prior tasks. It is advisory only and settles nothing by itself.

## 2. Files and checksums reviewed

| File | SHA-256 |
|---|---|
| `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` | `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9` |
| `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` | `d223d5e8a8a2e99b40bdcca853cdef7dfcb0f1da327eb538a40f9f700e2b7f3b` |

Both re-computed at the start and end of this task — **identical throughout**, confirming no modification occurred during this review.

**File-integrity checklist, independently re-verified:**

| Check | ch01-t01 | ch01-t04 |
|---|---|---|
| Valid JSON | Pass | Pass |
| `schemaVersion: "2.3.0"` | Pass | Pass |
| Record count | 7 (confirmed) | 8 (confirmed) |
| Record IDs unchanged | `ch01-is-101`, `ch01-t01-block-mainidea`, `-explanation`, `-equations`, `-visual`, `-misconception`, `-review` — identical to the pre-revision set | `ch01-is-104`, `ch01-t04-block-mainidea`, `-explanation`, `-equations`, `-visual`, `-misconception`, `-review`, `ch01-prob-104` — identical to the pre-revision set |
| All records `blocked`, `studentFacingAllowed: false` | Pass (7/7) | Pass (8/8) |
| Arabic remains `"missing"` | Pass (6/6 contentBlocks) | Pass (6/6 contentBlocks + 1/1 problem) |
| No visual asset exists | Pass — `visualGovernance[0].availabilityStatus: "missing"` on both `visualReference` records | Pass |
| No baseline approval exists | Confirmed — `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s `scope.approvedTopicIds` remains the four pilot topics only; neither draft file nor any governance file was found to claim baseline status |

## 3. ch01-t01 closure verification

Full current text of `ch01-t01-block-equations.localizedContent.en.text`, re-read directly from the file:

> "A derived quantity is formed by combining fundamental quantities through multiplication and/or division, without introducing a new independent unit. In dimensional notation, distance has dimension L and time has dimension T — the same symbols introduced above for the fundamental quantities themselves — so speed, being distance divided by time, has dimension L/T. The simplest example in this chapter is speed: speed = distance / time, or v = d / t, where v is speed (a scalar quantity — magnitude only, with no direction attached), d is the measured distance for the interval (a scalar length, measured in meters, m), and t is the elapsed time for that same interval (measured in seconds, s). Here, d and t are the specific measured-variable symbols used in this equation; they correspond to, but are distinct from, the dimensional symbols L and T, which name the type of quantity rather than a particular measured value. This gives speed the combined unit meters per second (m/s), built directly from distance's and time's own units, with no separate 'speed unit' ever defined. This relationship gives the average speed over the specified distance and time interval; a signed, directional version of this idea (velocity) is developed in a later topic once direction and vectors are introduced."

| Required element | Present? | Where |
|---|---|---|
| `L` represents the dimension of length | Yes | "distance has dimension L" |
| `T` represents the dimension of time | Yes | "time has dimension T" |
| Speed has dimension `L/T` | Yes | "speed, being distance divided by time, has dimension L/T" |
| `d` represents measured distance | Yes | "d is the measured distance for the interval" |
| `t` represents elapsed time | Yes | "t is the elapsed time for that same interval" |
| `v = d/t` is average speed over the specified interval | Yes | "This relationship gives the average speed over the specified distance and time interval" |
| `L`/`T` distinct from `d`/`t` | Yes | "d and t are the specific measured-variable symbols used in this equation; they correspond to, but are distinct from, the dimensional symbols L and T, which name the type of quantity rather than a particular measured value" |
| Distance not confused with displacement | Yes, by correct omission | Displacement is not introduced anywhere in this block or the rest of the file |
| Speed treated as scalar | Yes, unchanged from the pre-revision text | "v is speed (a scalar quantity — magnitude only, with no direction attached)" |
| No instantaneous-speed or adjacent-topic content introduced | Confirmed | No new equation, no vector treatment, no `ch01-t02`/`ch01-t06` content added; the velocity forward-reference is preserved verbatim in substance |

**Cross-checks:**
- **Against the original review finding:** every specific element the review asked to see (§2 of the review-request, mirrored in the table above) is now present in the actual text, not merely implied.
- **Against `ch01-corr-001`:** the correction's approved wording lives, unmodified, in `ch01-t01-block-mainidea` and `ch01-t01-block-explanation` — neither was touched by the revision, so the approved scientific meaning is unaffected.
- **Against the rest of `ch01-t01`:** `ch01-t01-block-explanation`'s own `L`/`T`/`M` introduction ("distance (symbol L)... time (symbol T)... mass (symbol M)") is now correctly picked up and reconciled by the equation block's added sentences — no contradiction, no duplicate re-definition, one consistent symbol story across the file.
- **Against existing pilot notation conventions:** the addition uses the same caret-free, plain-English symbol-naming style already used throughout the pilot files (e.g. `ch01-t08`'s "the magnitude of gravitational acceleration"), introduces no new notation device, and does not conflict with `VISUAL_HOUSE_STYLE.md`'s documented convention that dimensional/variable symbols stay upright-vs-italic per that guide's own rules once rendered.

**Classification: fully resolved.**

## 4. ch01-t04 closure verification

Every affected field in `ch01-prob-104`, independently re-read:

| Field | Current value |
|---|---|
| `givenValues` | `m = 45 kg (exact)`, `g = 9.8 m/s^2 (approximate)` — **unchanged** |
| `numberedSolution[0].explanation` | "W = mg = 45 kg x 9.8 m/s^2 = 441 N (unrounded). Both given values (45 kg and 9.8 m/s^2) have two significant figures, so the result is reported to two significant figures: W = 4.4 x 10^2 N." |
| `numberedSolution[1].explanation` | "...smaller than 4.4 x 10^2 N..." |
| `calculation[0]` | `result: 441.0`, `unit: "N"`, `significantFigures: 2`, `roundingRule`: explains `result` is unrounded and states the 2-sig-fig reporting rule, `roundedResult: "4.4 x 10^2 N"` (new field — see §6) |
| `finalAnswer.value` | "4.4 x 10^2 N at Earth's surface; mass remains 45 kg everywhere" |
| `finalAnswer.interpretation` | "...is 4.4 x 10^2 N (441 N unrounded, reported to two significant figures...). ...smaller than that..." |
| `intuition` | "4.4 x 10^2 N is a reasonable size..." |
| `correctedAnswer.value` | "4.4 x 10^2 N at Earth's surface; mass 45 kg, unchanged everywhere" |
| `sourceVariants[0].answerVariant` | "4.4 x 10^2 N; mass unchanged" |
| `units` | `["kg", "m/s^2", "N"]` — unchanged |
| Equation, scenario, `problemId`, source lineage, governance | All unchanged |

**Checklist:**

- Inputs remain `45 kg` and `9.8 m/s²` — confirmed unchanged.
- Unrounded calculation is `441 N` — confirmed, retained in exactly three places (`numberedSolution[0]`, `calculation[0].result`/`roundingRule`, and a parenthetical in `finalAnswer.interpretation`), each explicitly labeled "unrounded."
- Both inputs contain two significant figures — confirmed (`45` and `9.8` each have 2 significant figures).
- Final result is rounded to two significant figures — confirmed (`440`, expressed unambiguously as `4.4 x 10^2 N`).
- Final result is scientifically equivalent to `4.4 × 10² N` — confirmed; `4.4 x 10^2` and `4.4 × 10²` denote the identical numeric value (440), differing only in typographic character choice (see §7).
- `significantFigures` remains `2` — confirmed, and now internally consistent with the displayed final value (it was inconsistent before the revision).
- All final-answer fields agree — confirmed: `finalAnswer.value`, `correctedAnswer.value`, `sourceVariants[0].answerVariant`, and the forward-reference in `numberedSolution[1]` all read "4.4 x 10^2 N" identically.
- All solution steps agree — confirmed, steps 1 and 2 are mutually consistent and both consistent with the final answer.
- Interpretation and intuition agree — confirmed, both use "4.4 x 10^2 N" as the primary reported figure.
- No occurrence of `441 N` is presented ambiguously as the final reported answer — confirmed by direct grep of every remaining `441` occurrence (three total, all in explicitly-labeled unrounded/intermediate contexts — see §5).
- Units remain correct — confirmed (`N` for weight, `kg` for mass, `m/s²` for `g`, throughout).
- No physical assumption or scenario was changed — confirmed (still a 45 kg cart, at rest, `W = mg`, Earth's-surface-vs-weaker-gravity-module comparison, unchanged).

**Classification: fully resolved**, with one implementation-layer follow-up item identified during this closure pass and not part of the original finding — see §6.

## 5. Independent significant-figure calculation

Recomputed independently for this closure review, without reference to any prior report's stated values:

```
45 * 9.8 = 441.00000000000006   (floating-point representation of the exact product 441)
```

Both factors (`45`, `9.8`) carry 2 significant figures. Standard significant-figure convention for multiplication limits the result to the fewest significant figures among the factors — here, 2. The correctly 2-significant-figure result is `440`, unambiguously written as `4.4 × 10²` (or, in this project's own established plain-text convention, `4.4 x 10^2`) rather than the bare digits `440`, which would leave the number of significant figures ambiguous (a reader cannot tell from "440" alone whether the trailing zero is significant). **This matches the value now recorded in every final-answer field in `ch01-prob-104`.**

Every remaining literal occurrence of `441` in the file was located and its role checked:

| Location | Role | Ambiguous as final answer? |
|---|---|---|
| `numberedSolution[0].explanation` | Raw calculation step, explicitly followed by the rounding explanation and the rounded value in the same sentence | No |
| `calculation[0].result` / `.roundingRule` | Raw computed value plus an explanatory note stating it is unrounded | No |
| `finalAnswer.interpretation` (parenthetical) | Explicitly labeled "441 N unrounded," immediately after the primary "4.4 x 10^2 N" statement | No |

No occurrence of `441` stands alone as an unqualified final answer anywhere in the file.

## 6. `roundedResult` schema assessment

**Independently checked against four sources**, not only the custom structural validator used in prior tasks:

1. **The four pilot problem records** (`ch01-prob-102`, `-103`, `-108`, `-110`): every `calculation` array entry across all four uses exactly the same 7 fields — `calculationId`, `expression`, `substitution`, `result`, `unit`, `roundingRule`, `significantFigures` — confirmed by direct inspection of every entry in all four files. **No pilot precedent includes an 8th field of any kind, and none includes anything named `roundedResult`.**
2. **`apps/chapter1-mvp/src/types/pilotSchema.ts`'s `CalculationEntry` interface:** declares exactly those same 7 fields, with **no index signature** (`[key: string]: unknown`). This is a closed TypeScript interface — contrast with the same file's `SourceVariant` interface, which *does* carry an explicit `[key: string]: unknown` index signature, and `VisualGovernanceEntry`, which explicitly declares several fields as optional (`assetPath?`, `assetFormat?`, `assetStatus?`, `reviewRequired?`) to recognize a known, intentional extension pattern. `CalculationEntry` has neither mechanism — `roundedResult` is not declared, optional or otherwise.
3. **`apps/chapter1-mvp/src/content/validate.ts`'s `validateProblem` function:** checks only that `calculation` is an array (`Array.isArray(raw.calculation)`); it does **not** validate the internal shape of individual calculation entries at all. An extra field on a calculation entry would not cause validation to reject the record — it would pass through untouched, since the raw object is returned via `raw as unknown as ProblemRecord` with no field-stripping.
4. **`apps/chapter1-mvp/src/content/adapter.ts`'s `normalizeProblem` function:** explicitly constructs each step's `normalized.expression` from only `{expression, substitution, result, unit}` (see `apps/chapter1-mvp/src/types/normalized.ts`'s `NormalizedSolutionStep.expression`) — it does **not** read `roundingRule`, `significantFigures`, or (were it integrated) `roundedResult` from the raw calculation entry into anything the UI displays. **`apps/chapter1-mvp/src/features/topics/SolutionReveal.tsx` (line ~75–82) renders `step.expression.result` and `step.expression.unit` directly** — meaning if this topic were integrated into the application exactly as currently drafted, a student would see the **unrounded** `441` (with unit `N`) in the per-step display, since `roundedResult` is never read by any adapter or component code, while the separate `finalAnswer` block (rendered elsewhere, and populated by direct pass-through of `problem.finalAnswer.value`, which in this draft is the full string `"4.4 x 10^2 N at Earth's surface..."`) would correctly show the rounded figure. This is a genuine, concrete display inconsistency that would exist **only if the topic were integrated without any adapter changes** — not a defect in the JSON content itself, and not something baseline approval (an English-content correctness gate) is responsible for resolving, but relevant to the classification below.

**Classification: tolerated but not modeled.** The field does not cause a validation failure and would not be rejected or stripped by any current code path, but no schema definition, TypeScript interface, or adapter/rendering logic recognizes, expects, or surfaces it — it is inert data today, and would remain inert (silently unused, not causing an error) if this topic were integrated into the application without further adapter work.

**Recommendation (not applied in this task):** represent the rounded result using only the fields the schema and the four pilot problems already establish, rather than a new field — the sentence already present in `numberedSolution[0].explanation` (which states the rounded value in full, readable prose) and the explanatory text already present in `calculation[0].roundingRule` are sufficient to carry the same information without an unmodeled field. Removing `roundedResult` and folding its content entirely into the existing `roundingRule` string (e.g., "...results in 441 N, unrounded; rounded to two significant figures for reporting: 4.4 x 10^2 N") would close this gap using only already-recognized fields. This is flagged here as a candidate for a future, separate, narrowly scoped draft-only revision — **not performed in this task**, per this task's own read-only constraint.

**Adapter behavior if integrated today, stated explicitly:** the current application adapter would **preserve** the `roundedResult` field in the raw parsed object (nothing strips it), would **ignore** it during normalization (nothing reads it into `NormalizedSolutionStep` or any other UI-facing structure), and would **not reject** the record because of it (validation does not inspect individual calculation-entry fields). Net effect: harmless but functionally inert, with the display-inconsistency risk noted above.

## 7. Scientific-notation presentation assessment

The draft consistently uses `4.4 x 10^2 N` (a plain ASCII `x` for multiplication, a caret `^` for the exponent) in every final-answer field, rather than `4.4 × 10² N` (Unicode multiplication sign and true superscript character).

- **Multiplication symbol:** `x` matches the exact convention already used everywhere else in both draft files (e.g. "45 kg x 9.8 m/s^2") and in the pilot precedent (`equationRenderer.tsx`'s own header comment explicitly discusses `ch01-t02`'s "length x width" as an already-established, intentional use of plain `x` for multiplication in authored equation/prose text).
- **Superscript rendering:** `apps/chapter1-mvp/src/content/equationRenderer.tsx` explicitly converts caret-delimited (`^`) suffixes into true semantic `<sup>` HTML elements at render time — this is the documented, load-bearing mechanism the entire pilot content set relies on for every exponent (`m/s^2`, `m²`, `cm³`, etc.). A literal Unicode superscript character (`²`) would **bypass this mechanism entirely**, rendering as a plain (non-semantic, non-accessible-markup) glyph inconsistent with how every other exponent in either file is authored and rendered.
- **Compatibility with semantic equation rendering:** `4.4 x 10^2 N` is directly compatible with the existing renderer without any code change; `4.4 × 10² N` is not, and would require either a renderer change or manual rewriting to caret notation before it could render consistently with the rest of the content.
- **Compatibility with future Arabic LTR isolation:** both forms are equally isolable as a single LTR-direction span once translated (per `VISUAL_HOUSE_STYLE.md`'s established equation-isolation pattern); this is not a distinguishing factor.
- **Consistency with existing pilot equations:** `4.4 x 10^2 N` matches; `4.4 × 10² N` would introduce the first Unicode multiplication/superscript characters anywhere in the pilot or Batch 1 content, breaking an otherwise 100%-consistent plain-ASCII-plus-caret authoring convention.
- **Accessibility as plain text:** a screen reader or plain-text consumer reads `x` and `^2` unambiguously; Unicode `×` and `²` are also generally accessible but depend on the reading software's own glyph-to-speech handling, which is one more variable than the already-proven caret convention introduces.

**Classification: acceptable as written.** `4.4 x 10^2 N` is not merely tolerable but is the technically correct choice for this codebase's actual rendering pipeline — adopting `4.4 × 10² N` instead would be a regression against the established, proven convention, not an improvement.

## 8. Regression findings

Checked explicitly, each independently re-verified against the current file state:

| Regression category | Found? |
|---|---|
| New scientific ambiguity | None found |
| Notation inconsistency | None found — `4.4 x 10^2` matches the file's own established `^`/`x` convention throughout |
| Schema incompatibility | None causing validation failure; `roundedResult` is unmodeled (§6), not incompatible |
| Mismatched repeated answer fields | None — all five final-answer-role fields agree exactly (§4) |
| Source-lineage changes | None — `scientificCorrectionIds` (`{"ch01-corr-001"}` / `{"ch01-corr-002"}`) and every `locatorId` set (`SEG009`, `SEG010`, `S2-SEG026`, `S3-P002`, `S3-P003` / `SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`) independently re-confirmed identical to the pre-revision set |
| Record-ID changes | None — both files' record-ID lists confirmed identical to the pre-revision set (§2) |
| Arabic-content leakage | None — all 13 applicable records still `translationStatus: "missing"`, null text, no English copied into any Arabic field |
| Visual-status changes | None — both `visualReference` records still `availabilityStatus: "missing"`, disclosures intact |
| Governance changes | None — `blockingStatus: "blocked"`, `studentFacingAllowed: false` unchanged on all 15 applicable records across both files |
| Rights-safety concerns | None found — both new passages re-checked against the same distinctive-source-phrase list used in prior reviews; zero matches |

## 9. Topic-level recommendations

### ch01-t01

**Ready for controlled English baseline-approval review.**

- **Confidence:** High.
- No remaining defect, gap, or inconsistency was found in this closure pass.

### ch01-t04

**Requires one more draft-only revision.**

- **Confidence:** High.
- **Exact remaining item:** `ch01-prob-104`'s `calculation[0].roundedResult` field is an unmodeled schema extension (§6) — not a scientific error, not a rights issue, and not something that currently causes any validation failure, but a genuine gap between the drafted JSON and both the TypeScript schema model and the adapter's actual field-reading behavior. Recommended resolution (not applied here): remove the `roundedResult` field and fold its content into the existing, already-recognized `roundingRule` string, which can carry the same information in prose form without introducing an unmodeled field.

## 10. Batch-level recommendation

**ch01-t01 is ready; ch01-t04 requires revision.**

The topics should **remain paired** for the purpose of tracking through the remaining Batch 1 steps — nothing found in this closure review changes the batch-pairing rationale already established (`PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` §12, reaffirmed in `PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §22) — but `ch01-t01` could, at the project owner's discretion, proceed to baseline-approval review independently of `ch01-t04` if a sequential rather than simultaneous approval path is preferred, since the one remaining `ch01-t04` item does not depend on or affect `ch01-t01` in any way.

## 11. Exact remaining revision required

One item, scoped to a single file and a single field: in `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json`, remove `ch01-prob-104.calculation[0].roundedResult` and ensure its content ("4.4 x 10^2 N") remains fully expressed in `calculation[0].roundingRule` (already largely the case) so that no information is lost, using only field names already established by the four pilot problem records. This task does not perform that edit.

## 12. Exact next controlled task

A narrowly scoped **draft-only revision task**, applying exactly the one item in §11 to `ch01-prob-104`. Once applied (or once the project owner decides the unmodeled field is acceptable to carry forward as-is, which is also a legitimate outcome this review does not preclude), both topics would have no outstanding closure-review finding, and the next task after that would be the separately authorized **English baseline-approval task** already identified in the prior revision report.

## 13. Governance and publication statement

This is a read-only advisory verification. No draft file was modified — both files are confirmed byte-identical (checksums, §2) before and after this task. No baseline approval was granted. No Arabic or visual content was generated. No application expansion occurred — `apps/chapter1-mvp/`'s source files were read for this review's schema/adapter analysis (§6, §7) but not modified in any way. No independent human expert approval is claimed — every finding above is Claude's own verification under project-owner authorization. **Publication remains unauthorized**: `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere this task touched or read, and nothing in this review changes, sets, or proposes changing either flag for any topic.
