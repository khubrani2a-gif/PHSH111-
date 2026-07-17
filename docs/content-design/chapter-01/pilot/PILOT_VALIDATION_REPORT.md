# Chapter 1 Four-Topic Pilot — Generation and Validation Report

## Scope

Draft canonical content generated for exactly four topics, per `PILOT_AUTHORIZATION.json` (granted 2026-07-15 by the project owner): `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`. No content was generated for any other Chapter 1 topic.

## Authorization state

- `PILOT_READINESS.json`: chapter-wide `canonicalGenerationAuthorized` remains **`false`** (authorization is scoped, not chapter-wide — see `canonicalGenerationAuthorizationNote`). Each of the four topics now has `canonicalGenerationAuthorized: true` individually, with `authorizationRecordId` pointing to `PILOT_AUTHORIZATION.json`.
- `studentFacingAllowed` (per topic) and `studentPublicationAuthorized` (global): still **`false`** everywhere — verified directly, not just asserted. Canonical generation authorization and student publication are separate gates; only the first was granted.
- New file `PILOT_AUTHORIZATION.json` records the grant, its scope, what it does and does not authorize, and explicitly restates that it does not authorize student-facing display, generation for other topics, application builds, or `docs/content-audits/` changes.

## What was generated

Four files under `docs/content-design/chapter-01/pilot/`, one per topic, totaling **36 records**: 4 `instructorScript`, 28 `contentBlock` (7 per topic: `mainIdea`, `organizedExplanation`, `equationSet`, `example`, `visualReference`, `misconception`, `reviewQuestion`), 4 `problem`.

| Topic | Built from | Diagram spec | Original problem |
|---|---|---|---|
| `ch01-t02` | No open correction (topic never needed one) | Three-panel scale comparison (coin/doorway/city block) | Garden-plot area, converted m² → ft² |
| `ch01-t03` | `ch01-corr-006`, `ch01-term-period`/`ch01-term-frequency` | Rotating-disk cycle diagram (3 snapshots) | Hummingbird wingbeat frequency/period |
| `ch01-t08` | `ch01-corr-007` (including its displacement-equation revision) | Dual-convention vertical-axis diagram | Skateboarder deceleration (sign interpretation) |
| `ch01-t10` | `ch01-corr-008`, corroborated by Kahoot's `K1-SCI-009` | Tangent-velocity / inward-acceleration diagram | Centrifuge safety speed (inverse `a_c=v²/r`) |

## Originality and rights compliance (verified, not just asserted)

- Ran `grep -rn "SRC-CH01-CONV-005\|SRC-CH01-REVIEW-001"` across every generated file: **zero matches**. The two publisher-derived sources (P5 problems, R1 review cards) excluded by `PILOT_RIGHTS_POLICY.json` are not referenced anywhere in the generated content, not even as provenance lineage.
- Every `provenanceLink` in the generated content uses `contribution: "concept"` and `allowedUse: "referenceOnly"` — never `"wording"` — and traces only to C1 (teaching conversation), P3 (slides), or, for `ch01-t10` only, the Kahoot source's `K1-SCI-009` finding (cited explicitly as corroborating scientific evidence, not as a wording source).
- All four diagrams are written as original visual specifications (text descriptions of a diagram to be newly drawn), explicitly stating "no slide or textbook imagery is to be used." No `visualGovernance` entry claims `availabilityStatus: "available"` from any existing slide/card image — all four are `"redrawRequired"`.
- All four problems use a new `sourceId`, `"SRC-CH01-PILOT-ORIGINAL"`, distinct from every real source ID, to make explicit that these are newly authored, not derived from any P5 problem — each `selectionRationale` states the specific source problems it deliberately differs from.
- Every generated explanation, example, and diagram was independently composed for this pilot (different scenarios, numbers, and framing from every corresponding source item — e.g., a garden plot rather than a yacht, a ceiling fan rather than a pendulum, a skateboarder rather than a sports car, a centrifuge rather than a merry-go-round).

## Scientific correctness

- `ch01-t03`, `ch01-t08`, `ch01-t10` content is built directly from the exact wording of the corresponding approved correction (`ch01-corr-006`/`007`/`008`) — the `organizedExplanation` and `equationSet` blocks paraphrase-match the correction's own `correctedWording`/`equations` fields deliberately, since the correction *is* the authoring source for these topics.
- Independently recomputed every numeric answer rather than trusting the drafted text:

| Problem | Computed | Matches drafted answer? |
|---|---|---|
| `ch01-prob-102` (garden area) | 14.4 m²; 155.0 ft² | Yes |
| `ch01-prob-103` (hummingbird) | 0.02 s; 150 wingbeats | Yes |
| `ch01-prob-108` (skateboarder) | -2.5 m/s² | Yes |
| `ch01-prob-110` (centrifuge) | 8.66 m/s | Yes |

- `ch01-corr-007`'s approved sign-convention framework (`a=-g`/`a=+g`, consistent `Δy`/`v0`/`v`/`a` signs) is applied correctly in `ch01-prob-108`'s solution, including the explicit statement that the negative acceleration does not imply the board moved backward — this is the exact misconception the correction targets.
- `ch01-corr-008`'s tangent-velocity/inward-acceleration distinction is applied correctly in both the `ch01-t10` example (satellite) and problem (centrifuge, an inverse application distinct from anything in the corrections' own worked example).

## Bilingual architecture preserved

Every localized field across all 36 records uses the full `{text, status, language, direction}` shape. English fields are populated with `status: "draft"`. Arabic fields are present but explicitly `status: "missing"` (original) / `"notAuthored"` (canonical translation) — no Arabic text was generated, consistent with the project's standing rule not to infer missing Arabic. `terminologyApprovalStatus` correctly reflects each topic's actual glossary state: `"approved"` for `ch01-t03` (using the approved `ch01-term-period`/`ch01-term-frequency`), `"pending"` for `ch01-t02`/`ch01-t08`/`ch01-t10` (their glossary terms — `ch01-term-distance`, `ch01-term-acceleration`, `ch01-term-free-fall`, `ch01-term-centripetal-acceleration`, `ch01-term-velocity` — are not yet approved).

## Draft / review-required status

Every one of the 36 records' `blocking` object has `blockingStatus: "blocked"`, `studentFacingAllowed: false` (verified directly — 9 occurrences of this field per file, one per record, all `false`), and `resolutionStatus: "open"`, pending human physics/pedagogy review. `blockingReason` includes `"translationPending"` (Arabic not yet authored) and `"other"` (shorthand for "newly generated draft pending human review" — the `blockingWorkflow` enum has no dedicated value for this state; flagging this as a minor future schema gap rather than inventing an unrequested new enum value now) on every record, plus `"answerValidation"` on examples/problems/review questions and `"missingVisual"`/`"terminologyPending"` where applicable.

## Schema validation (executed, not just claimed)

Wrote and ran a field-by-field Python validator against `CANONICAL_DESIGN_SCHEMA.json`'s actual `$defs` (required fields, `additionalProperties`, enum values, ID patterns, nested `localizedText`/`arabicSeparation`/`blockingWorkflow`/`provenanceLink` shapes) across all 36 records.

- **First pass**: found 2 real bugs — two `learningObjectives` entries (in `ch01-t03` and `ch01-t10` instructor scripts) were missing `status`/`language`/`direction`. Fixed both.
- **Second pass**: **0 errors** across all 36 records (4 `instructorScript`, 28 `contentBlock`, 4 `problem`).

## Confirmed

- No file under `docs/content-audits/` was modified (checked via `git status`).
- Nothing built, installed, staged, committed, or pushed.
- No content generated for any topic outside `ch01-t02`/`t03`/`t08`/`t10`.

## Addendum: revisions applied from the pilot quality review

A subsequent read-only quality review (see conversation record) found one systemic bug and several topic-specific gaps. This addendum records the fixes applied.

### Cross-topic fix (all four topics)

`correctedAnswer.status` on all four `problem` records was `"scientificallyApproved"` — premature, since these are draft/unreviewed records still showing `blocking.blockingStatus: "blocked"`. Changed to `"proposed"` on `ch01-prob-102`, `ch01-prob-103`, `ch01-prob-108`, `ch01-prob-110`. No numerical answer changed as part of this specific fix.

### Topic-specific revisions

- **`ch01-t02`**: extended `ch01-prob-102` with a new part (c) giving the learner meaningful practice with volume and cubic-unit conversion (a 0.2 m topsoil layer over the existing plot: 2.88 m³, converted using the *cubed* length factor to ≈101.7 ft³) — previously the equation set covered volume but neither the example nor the problem exercised it. Also relabeled the worked example's "lab bench" as a "clinic examination table" (same numbers, same physics) as the invited optional health-science touch.
- **`ch01-t03`**: revised `ch01-prob-103`'s problem statement to state explicitly, in text the student reads, that "one complete wingbeat cycle is defined as one full upward-and-downward wing motion that returns the wing to its starting position" — previously this definition existed only in internal `equationSelection` metadata, invisible to the student, which undercut the exact discipline `ch01-corr-006` is about. Also replaced the ceiling-fan worked example with a patient pulse-rate example (72 bpm → 1.2 Hz → 0.83 s), the invited optional health-science touch, which additionally reinforces "one complete cycle" by naming it as one full heartbeat.
- **`ch01-t08`**: applied only the shared fix as instructed. Separately, since the optional-improvements section explicitly named `ch01-t08` as a candidate for health-science reframing, replaced `ch01-prob-108`'s skateboarder scenario with a hospital-gurney scenario (same pedagogical structure — uniform deceleration from a positive velocity to rest, sign interpretation — new numbers: 1.5 m/s over 3 s, giving -0.5 m/s², independently recomputed).
- **`ch01-t10`**: applied the shared fix. Diversified `ch01-t10-block-review` away from the string-breaking scenario (already covered by the misconception block and instructor-script analogy) to a vertical-circle "bucket at the top" question, testing the same two ideas (acceleration always toward center; constant speed ≠ zero acceleration) through a distinct, non-redundant setup. Purely conceptual — no numeric answer to verify.

### Numerical verification (independently recomputed, not just re-read from the file)

| Value | Recomputed | Matches file? |
|---|---|---|
| `ch01-t02` area | 4.5 × 3.2 = 14.4 m² | Yes (unchanged) |
| `ch01-t02` area in ft² | 14.4 × 3.28084² ≈ 155.0 ft² | Yes (unchanged) |
| `ch01-t02` topsoil volume | 14.4 × 0.2 = 2.88 m³ | Yes (new) |
| `ch01-t02` volume in ft³ | 2.88 × 3.28084³ ≈ 101.7 ft³ | Yes (new) |
| `ch01-t03` pulse frequency | 72/60 = 1.2 Hz | Yes (new) |
| `ch01-t03` pulse period | 1/1.2 ≈ 0.83 s | Yes (new) |
| `ch01-t03` wingbeat period/count | 1/50 = 0.02 s; 50×3 = 150 | Yes (unchanged) |
| `ch01-t08` gurney acceleration | (0-1.5)/3 = -0.5 m/s² | Yes (new) |
| `ch01-t10` centrifuge speed | √(500×0.15) ≈ 8.66 m/s | Yes (unchanged) |

### Schema validation (re-run after edits)

Re-ran the field-by-field validator against `CANONICAL_DESIGN_SCHEMA.json`, extended this pass with two additional checks specifically motivated by the revisions: (a) no `blocking.studentFacingAllowed` is anything other than `false`, and (b) no `problem.correctedAnswer.status` is still `"scientificallyApproved"`. Also re-ran the publisher-source scan (`grep` for `SRC-CH01-CONV-005`/`SRC-CH01-REVIEW-001`, and a broader case-insensitive scan for "Cengage"/"Ostdiek"/"z-lib").

**Result: 0 schema errors across all 36 records (counts unchanged: 4 `instructorScript`, 28 `contentBlock`, 4 `problem`). 0 publisher-source or publisher-name references** — the only "Cengage" occurrences found are explanatory notes stating content is *not* derived from it, which is the correct, intended usage.

### Remaining optional improvements (not applied, noted for a future pass)

- `ch01-t02`: the area-conversion-factor misconception (distinct from the "size doesn't change" one) still has no dedicated misconception block of its own, unlike the other three topics.
- `ch01-t03`/`ch01-t08`/`ch01-t10`: each still has only one review question; more graduated-difficulty review questions would strengthen formative-assessment coverage.
- `ch01-t10`: the diagram specification's two-frame ("an instant later") structure should be flagged explicitly to whoever executes the artwork, since it's closer to a short animation than a single static image.
- Across all four topics: the `mainIdea` and `organizedExplanation` blocks still overlap substantially in phrasing; a human editor may want to differentiate them further so the explanation adds more than a straightforward expansion of the main idea.

## What remains before any of this can move forward

This is draft, instructor-facing-only content pending: (1) human scientific and pedagogical review of each record, (2) actual diagram artwork from the four visual specifications, (3) Arabic translation once English is reviewed and approved, (4) approval of the still-pending glossary terms (`ch01-term-distance`, `ch01-term-acceleration`, `ch01-term-free-fall`, `ch01-term-centripetal-acceleration`, `ch01-term-velocity`), and (5) separately, explicit user authorization for student-facing publication — none of which this generation pass performed.
