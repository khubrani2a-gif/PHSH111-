# PHSH111 Batch 1 — English Draft Revision Report

**Revised:** 2026-07-16. **This task applies exactly two draft-only corrections**, both identified by `docs/app/PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §23 ("Required revisions"). It does not approve either draft, and does not authorize Arabic, visuals, application expansion, baseline approval, or publication.

## 1. Purpose and scope

This document records the exact, narrowly scoped edits made to the two Batch 1 English draft files to resolve the two **Important**-severity findings from the prior review — a notation-consistency gap in `ch01-t01` and a significant-figure inconsistency in `ch01-t04`'s problem. Both draft files were re-read in full before editing; both were confirmed still `draft`, `blocked`, non-student-facing, and not baseline-approved (unchanged since the review — checksums matched the review document's own recorded values exactly before any edit was made).

## 2. Review finding addressed in ch01-t01

`PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §6/§8/§9/§16/§23 item 1: the organizedExplanation block introduces the dimensional symbols `L` (length), `T` (time), `M` (mass), while the equationSet block separately uses lowercase `d` and `t` as the working variables in `v = d/t`, without ever explicitly reconciling the two symbol systems for the reader.

## 3. Exact record and field changed in ch01-t01

**Record:** `ch01-t01-block-equations` (blockType `equationSet`). **Field:** `localizedContent.en.text`. No other field on this record, and no other record in the file, was touched.

## 4. Original and revised ch01-t01 wording

**Original:**
> "A derived quantity is formed by combining fundamental quantities through multiplication and/or division, without introducing a new independent unit. The simplest example in this chapter is speed: speed = distance / time, or v = d / t, where v is speed (a scalar quantity — magnitude only, with no direction attached), d is distance (a scalar length, measured in meters, m), and t is time (measured in seconds, s). This gives speed the combined unit meters per second (m/s), built directly from distance's and time's own units, with no separate 'speed unit' ever defined. This relationship holds for average speed over a distance and time interval; a signed, directional version of this idea (velocity) is developed in a later topic once direction and vectors are introduced."

**Revised (new sentences bolded here for review only — the field itself contains plain text):**
> "A derived quantity is formed by combining fundamental quantities through multiplication and/or division, without introducing a new independent unit. **In dimensional notation, distance has dimension L and time has dimension T — the same symbols introduced above for the fundamental quantities themselves — so speed, being distance divided by time, has dimension L/T.** The simplest example in this chapter is speed: speed = distance / time, or v = d / t, where v is speed (a scalar quantity — magnitude only, with no direction attached), d is **the measured distance for the interval** (a scalar length, measured in meters, m), and t is **the elapsed time for that same interval** (measured in seconds, s). **Here, d and t are the specific measured-variable symbols used in this equation; they correspond to, but are distinct from, the dimensional symbols L and T, which name the type of quantity rather than a particular measured value.** This gives speed the combined unit meters per second (m/s), built directly from distance's and time's own units, with no separate 'speed unit' ever defined. This relationship gives the average speed over the specified distance and time interval; a signed, directional version of this idea (velocity) is developed in a later topic once direction and vectors are introduced."

This is newly authored wording, integrated into the existing paragraph rather than appended as a disconnected note. It follows the review's own illustrative direction in substance (L is the dimension of length, T is the dimension of time, speed has dimension L/T, and `d`/`t` are named as the measured-variable symbols) without reusing its exact sentence structure.

## 5. Scientific verification of the notation bridge

- **`L` = dimension of length, `T` = dimension of time, speed has dimension `L/T`:** stated explicitly and correctly.
- **`d`/`t` distinguished from `L`/`T`:** stated explicitly — `d` and `t` are named as "the specific measured-variable symbols," `L` and `T` as naming "the type of quantity rather than a particular measured value." This directly closes the gap the review identified.
- **`v = d/t` identified as average speed for the specified interval:** preserved and, if anything, strengthened — "This relationship gives the average speed over the specified distance and time interval" (changed from "holds for," a minor wording tightening with no change of meaning).
- **Distance vs. displacement:** still not conflated — displacement is not introduced anywhere in the revised text, exactly as before.
- **Scalar-vs-vector accuracy:** unchanged and still correct — `v` is still explicitly described as scalar; the velocity/vector forward-reference is preserved verbatim in substance.
- **Symbol definitions:** all four symbols (`v`, `d`, `t`, and now explicitly `L`/`T`) are defined consistently within this one block and consistently with the `L`/`T`/`M` definitions already present, unmodified, in `ch01-t01-block-explanation`.
- **No instantaneous speed, velocity equations, or adjacent-topic content introduced:** confirmed — the addition is limited to the dimensional-notation bridge; no new equation, no vector treatment, and no `ch01-t02`/`ch01-t06` content was added.
- **`ch01-corr-001`'s approved meaning:** unaltered — the correction's own approved wording is carried entirely in `ch01-t01-block-mainidea` and `ch01-t01-block-explanation`, neither of which was touched by this revision.
- **Record IDs, ordering, visibility, source lineage, governance fields:** all confirmed unchanged (§10–§11).

## 6. Review finding addressed in ch01-t04

`PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §12/§14/§15/§23 item 2: `ch01-prob-104`'s `calculation` record stated `"significantFigures": 2` while reporting the unrounded three-digit value `441` as the final answer, which is inconsistent with standard significant-figure convention for two 2-significant-figure inputs (45 kg, 9.8 m/s²).

## 7. Exact fields changed in ch01-prob-104

- `numberedSolution[0].explanation.en.text`
- `numberedSolution[1].explanation.en.text`
- `calculation[0].roundingRule`
- `calculation[0]` — added one new field, `roundedResult` (a sub-field of an existing array item within this one record; no new top-level record was created)
- `finalAnswer.value`
- `finalAnswer.interpretation.en.text`
- `intuition.en.text`
- `correctedAnswer.value`
- `sourceVariants[0].answerVariant`

`calculation[0].result` (`441.0`), `calculation[0].significantFigures` (`2`), the `45 kg` and `9.8 m/s²` given values, the selected equation (`W = mg`), the physical scenario, `problemId`, source lineage, and all governance/visibility fields were **not** changed.

## 8. Original and revised numerical presentation

| Field | Before | After |
|---|---|---|
| `numberedSolution[0].explanation` | "W = mg = 45 kg x 9.8 m/s^2 = 441 N." | "W = mg = 45 kg x 9.8 m/s^2 = 441 N (unrounded). Both given values (45 kg and 9.8 m/s^2) have two significant figures, so the result is reported to two significant figures: W = 4.4 x 10^2 N." |
| `numberedSolution[1].explanation` | "...smaller than 441 N..." | "...smaller than 4.4 x 10^2 N..." |
| `calculation[0].roundingRule` | "no rounding required (exact product)" | "result field is the unrounded product (441 N); both given values (45 kg, 9.8 m/s^2) carry two significant figures, so the reported/final value is rounded to two significant figures" |
| `calculation[0].roundedResult` | *(field did not exist)* | "4.4 x 10^2 N" |
| `finalAnswer.value` | "441 N at Earth's surface; mass remains 45 kg everywhere" | "4.4 x 10^2 N at Earth's surface; mass remains 45 kg everywhere" |
| `finalAnswer.interpretation` | "...is 441 N. ...smaller than 441 N because..." | "...is 4.4 x 10^2 N (441 N unrounded, reported to two significant figures to match the precision of the given values). ...smaller than that, because..." |
| `intuition` | "441 N is a reasonable size..." | "4.4 x 10^2 N is a reasonable size..." |
| `correctedAnswer.value` | "441 N at Earth's surface; mass 45 kg, unchanged everywhere" | "4.4 x 10^2 N at Earth's surface; mass 45 kg, unchanged everywhere" |
| `sourceVariants[0].answerVariant` | "441 N; mass unchanged" | "4.4 x 10^2 N; mass unchanged" |

**Typographic note:** the task's own illustrative wording used "4.4 × 10² N" (Unicode multiplication sign and superscript). This file consistently represents multiplication as a plain `x` and exponents with a caret (`^2`) throughout every other equation and unit in both draft files (e.g., "45 kg x 9.8 m/s^2", "m/s^2"). For internal typographic consistency — an explicit editorial-consistency point the prior review itself asked to be checked — this revision uses "4.4 x 10^2 N" (plain `x` and `^`) rather than introducing a new Unicode convention found nowhere else in either file. The physical meaning and the two-significant-figure precision are identical either way.

**441 N was deliberately retained** in exactly three places, each explicitly labeled as the unrounded intermediate value, matching the review's own explicit allowance ("441 N may appear as the unrounded calculator result or intermediate value"): `numberedSolution[0]`'s raw calculation step, `calculation[0].result`/`roundingRule`, and a parenthetical in `finalAnswer.interpretation` that explains the rounding relationship. Every field whose role is to state *the final reported answer* (`finalAnswer.value`, `correctedAnswer.value`, `sourceVariants[0].answerVariant`, the forward-reference in `numberedSolution[1]`, and `intuition`) now uses "4.4 x 10^2 N" consistently.

## 9. Independent recalculation and significant-figure check

Recomputed independently for this report, without reference to the draft's own values:

- `45 kg × 9.8 m/s² = 441.00000000000006` (floating-point representation of the exact product `441`) — **matches** the retained unrounded value.
- Both inputs (`45`, `9.8`) carry 2 significant figures → the result is limited to 2 significant figures → `441` rounds to `440`, correctly expressed unambiguously as `4.4 × 10²` (here written `4.4 x 10^2`) — **matches** the new `roundedResult`/`finalAnswer`/`correctedAnswer`/`sourceVariants` value.
- `calculation[0].significantFigures` remains `2`, and is now **consistent** with the displayed final answer (previously it was inconsistent with the unrounded `441`).
- Every field that repeats the final answer was checked for consistency (§8 table) — all now read "4.4 x 10^2 N" identically, with mass "45 kg" unchanged in every occurrence.
- `ch01-t04-block-review`'s own independent calculation (`10 kg × 9.8 m/s² = 98 N`) was re-checked and is untouched by this revision — it was already correctly 2 significant figures and required no change.

## 10. Record-count and identifier integrity

Verified by direct script after editing:

- `ch01-t01-content.json`: **7 records**, IDs unchanged: `ch01-is-101`, `ch01-t01-block-mainidea`, `ch01-t01-block-explanation`, `ch01-t01-block-equations`, `ch01-t01-block-visual`, `ch01-t01-block-misconception`, `ch01-t01-block-review`.
- `ch01-t04-content.json`: **8 records**, IDs unchanged: `ch01-is-104`, `ch01-t04-block-mainidea`, `ch01-t04-block-explanation`, `ch01-t04-block-equations`, `ch01-t04-block-visual`, `ch01-t04-block-misconception`, `ch01-t04-block-review`, `ch01-prob-104`.
- No record was added, removed, or renamed. No `recordType` or `blockType` was changed.

## 11. Source-lineage integrity

Verified by direct script after editing: every `scientificCorrectionIds` value in `ch01-t01-content.json` is exactly `{"ch01-corr-001"}`; in `ch01-t04-content.json`, exactly `{"ch01-corr-002"}` — unchanged. Every `locatorId` cited across both files is exactly the same set as before this revision: `SEG009`, `SEG010`, `S2-SEG026`, `S3-P002`, `S3-P003` (`ch01-t01`); `SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058` (`ch01-t04`). No source, audit, correction, or conflict ID was added, removed, or altered by either revision.

## 12. Arabic missing-state verification

Re-verified on all 13 applicable records (6 `ch01-t01` contentBlocks; 6 `ch01-t04` contentBlocks; 1 `ch01-t04` problem) after editing: `arabic.translationStatus: "missing"`, `arabic.originalArabicText.text: null`, `arabic.canonicalArabicTranslation.text: null` on every one — unchanged. Both `instructorScript` records still correctly omit the optional `arabic` field entirely. `localizedContent` still contains only an `"en"` key on every contentBlock — no `"ar"` key was introduced. **No revised English wording was copied into any Arabic field.** No Arabic prose was generated anywhere.

## 13. Rights-safety verification

Both new passages (the `ch01-t01` notation bridge and the `ch01-t04` significant-figure explanation) are newly authored. An independent phrase-overlap check was re-run against the same distinctive source-phrase list used during the original drafting and review passes (e.g. *"the more difficult it is to speed up or slow down"*, *"We are not talking about gravity"*, *"postpone our treatment of charge"*, *"when you try to lift a heavy suitcase"*, *"note the unfamiliar unit, the slug"*) — **zero matches** in either revised file. Neither revision expands either topic's scope, adds or removes a record, adds an example or problem, creates a visual asset, or alters a `visualReference` record's status.

## 14. JSON/schema validation

Both files re-parsed successfully as JSON after editing. `schemaVersion: "2.3.0"` confirmed unchanged on both. The same structural validator used for the original drafting task (checking every `required` field, enum, and pattern declared in `CANONICAL_DESIGN_SCHEMA.json`'s relevant `$defs`) was re-run against both files post-revision: **zero errors.** The independent recomputation of `ch01-prob-104`'s calculation (`45 × 9.8`) still matches the retained unrounded `calculation[0].result` value exactly. `calculation[0]`'s new `roundedResult` field is a plain string, added to an already schema-unconstrained array (`problem.calculation` has no `$def` restricting its internal shape, matching the same latitude already used by the pilot precedent's own `calculation` entries), so it introduces no schema violation.

## 15. Governance status

Unchanged by this task, re-confirmed after editing:

- Both files remain `blockingStatus: "blocked"` on every record (13/13 applicable records checked).
- `studentFacingAllowed: false` on every record (13/13 checked).
- No visual asset was created — both `visualReference` records' `visualGovernance[0].availabilityStatus` remain `"missing"`.
- `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, `SCIENTIFIC_CORRECTIONS.json`, `DUPLICATE_AND_CONFLICT_DECISIONS.json`, `BILINGUAL_GLOSSARY.json`, `IDENTIFIER_REGISTRY.json`, `topic-mapping.json`, the four pilot topic files, and all application code/tests/package files were **not modified** — confirmed by `git status --porcelain`, which shows no change to any file outside the two draft JSON files and this new report.
- No English baseline approval was granted. No Arabic, visual, or application-expansion authorization was created or used. No independent expert approval is claimed. Publication remains unauthorized.

## 16. Exact recommended next controlled task

A future, separately authorized **English baseline-approval task**, using `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s existing pattern (a `baselineVersion`, `status: "approved"`, per-topic `perTopicDecision`, `revisionControlPolicy.revisionLog`), now that both of `PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md`'s required revisions have been applied. That review's own optional-improvement items (§24) remain available for the project owner's discretion but were not applied here, since only the two required revisions were in scope for this task. This task does not perform the baseline-approval task itself.

---

### Explicit statements

- **Only the two approved draft corrections identified by `PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §23 were applied** — no other wording, record, or field was changed.
- **No baseline approval occurred.**
- **No Arabic or visual content was generated.**
- **No application expansion occurred.**
- **Publication remains unauthorized.**
