# PHSH111 Batch 1 — English Draft Review

**Reviewed:** 2026-07-16. **This is an advisory review.** No draft content was modified. No baseline approval was granted. No independent human expert approval occurred. No Arabic or visual content was generated. No application expansion occurred. Publication remains unauthorized.

## 1. Purpose and review limits

This document is an independent, read-only scientific, editorial, pedagogical, and schema review of the two Batch 1 English draft files. It evaluates whether each topic is ready for a future, separately authorized English baseline-approval task. It does not itself approve, revise, or apply anything — it is advisory input for that future decision. Both draft files were re-read in full for this review (not summarized from `PHSH111_BATCH1_ENGLISH_DRAFT_GENERATION_REPORT.md` alone), and every scientific, source-lineage, and numerical claim below was independently re-derived from the underlying audited evidence and governance records, not taken on the generation report's word.

**Checksum verification (before and after this review):**
- `ch01-t01-content.json`: `sha256:a38c54255a35cb26e800bcaac3659d7bd9d4ceb88291d87c18a4608032aba87b` — identical before and after.
- `ch01-t04-content.json`: `sha256:0d205e2cb263a52fd9c95d5a6a0cfd545ec0cea8af4c0e9281b24a45bf2c6280` — identical before and after.

Both files are confirmed **byte-identical** to their state at the start of this task.

## 2. Authorization and governance state

Re-confirmed directly from the governance files (not modified by this review):

- `PILOT_AUTHORIZATION.json` v1.2.0's `batch1DraftingAuthorization.applicableTopicIds`: exactly `["ch01-t01","ch01-t04"]` — both files reviewed are within this scope; no unauthorized topic was drafted.
- `PILOT_READINESS.json` v1.5.0's `batch1DraftingReadiness`: both topics `englishDraftingAuthorized: true`; `arabicGenerationAuthorized`, `visualProductionAuthorized`, `applicationExpansionAuthorized`, `englishBaselineApproved`, `canonicalStudentPublicationAuthorized`, `independentExpertReviewCompleted` all `false` for both topics — unchanged.
- `SCIENTIFIC_CORRECTIONS.json`: `ch01-corr-001.approvalStatus: "editoriallyApproved"`, `approvals.scientificReviewer: null`; `ch01-corr-002.approvalStatus: "editoriallyApproved"`, `approvals.scientificReviewer: null`, `approvals.approvalBasis` carries the "apparent weight" qualification — both re-confirmed unchanged.
- No English baseline approval exists for either topic (`ENGLISH_PILOT_BASELINE_APPROVAL.json`'s `scope.approvedTopicIds` remains the four pilot topics only).
- No Arabic-generation, visual-production, or application-expansion authorization exists for either topic.
- No independent human expert (physics) review has occurred on either correction or either draft.
- `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere touched or read by this review.

This review itself changes none of the above.

## 3. Files reviewed

- `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` (7 records)
- `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` (8 records)

Both re-parsed and independently re-validated for this task using a purpose-built structural validator checking every `required` field, enum, and pattern declared in `CANONICAL_DESIGN_SCHEMA.json`'s relevant `$defs`.

## 4. Validation summary

| Check | ch01-t01 | ch01-t04 |
|---|---|---|
| Valid JSON | Pass | Pass |
| `schemaVersion: "2.3.0"` | Pass | Pass |
| Topic ID correct on every record | Pass | Pass |
| Record IDs unique (within file and across both files) | Pass | Pass |
| Record types/blockTypes valid and already-established | Pass | Pass |
| Record ordering | Matches established pattern minus one deliberate omission (no `example` slot — see §7) | Matches established pattern minus one deliberate omission |
| Visibility values valid | Pass | Pass |
| Governance fields complete (`duplicateHandling`, `blocking`, `contentLeakTestStatus`) | Pass | Pass |
| All records `blocked`, none approved | Pass | Pass |
| `studentFacingAllowed: false` everywhere | Pass (7/7 applicable) | Pass (8/8 applicable) |
| Arabic missing-state representation valid | Pass (6/6 contentBlocks) | Pass (6/6 contentBlocks + 1/1 problem) |
| No visual falsely represented as produced | Pass (`availabilityStatus: "missing"` on both `visualGovernance` entries) | Pass |
| All cited source/audit/correction/conflict IDs exist | Pass | Pass |
| No removed/miscited evidence reintroduced | Pass (`SEG004`, `SEG017`, `SEG018`, `S5-P033`: zero occurrences in either file, grep-confirmed) | Pass |
| No internal reference points to a missing record | Pass (`figureCues.visualIds` resolve to the file's own `visualReference` block) | Pass |

**No structural defect was found in either file.** Two substantive (non-structural) findings were identified during scientific/numerical review — see §6, §12, §17, §18.

## 5. `ch01-t01` scope review

Reconstructed independently from `docs/content-audits/chapter-01/topic-mapping.json` (`ch01-t01.segmentIds: ["SEG009","SEG010"]`, `coverageStatus: "adequate"`) and the citation-repair task's own evidence set.

**In-scope concepts present in the draft:** the fundamental-vs-derived-quantity distinction; the three fundamentals this chapter's mechanics content uses (distance, time, mass); charge as a fourth fundamental property, explicitly deferred; one derived-quantity example (speed = distance/time), matching `S3-P003`'s own chosen illustration.

**Content correctly left to adjacent topics:** unit-conversion mechanics for length/area/volume (`ch01-t02`) — the draft only forward-references this ("covered next, from distance alone") without developing it; time's own units, periods, or frequency (`ch01-t03`); vectors, direction, or velocity-vs-speed (`ch01-t06`) — the draft explicitly names this boundary ("a signed, directional version of this idea (velocity) is developed in a later topic"); mass-as-inertia depth (`ch01-t04`, kept separate).

**Audited concepts omitted:** none identified as missing — `SEG009`/`SEG010`'s full content (three basic aspects → L/T/M → charge deferred → "physics builds almost everything from them") is represented, in substance if not verbatim.

**Unsupported expansion:** none found. No concept beyond the audited evidence's own scope was introduced.

**Completeness for the intended topic scope:** the draft is conceptually complete for a definitional/introductory topic, but see §6's equation-notation finding and §9's pedagogical finding — the topic currently contains **zero worked numeric content anywhere**, which is a defensible but reviewable choice given the zero-problem source coverage.

## 6. `ch01-t01` scientific review

Independently re-read every learner-visible sentence in `ch01-t01-block-mainidea`, `-explanation`, `-equations`, `-misconception`, `-review`.

- **Meaning of speed:** correctly and consistently presented as a scalar (magnitude-only) quantity throughout. The equation block explicitly states "`v` is speed (a scalar quantity — magnitude only, with no direction attached)."
- **Speed vs. velocity distinction:** correctly handled. The equation block explicitly defers velocity to "a later topic once direction and vectors are introduced" and never conflates the two terms anywhere in either file.
- **`v = d/t` as average speed:** correctly and explicitly stated as an average-speed relationship ("This relationship holds for average speed over a distance and time interval"). One minor imprecision: "distance" is used without the qualifier "traveled" or "covered" — in strict usage, "distance" between two points and "distance traveled" over an interval are not automatically the same idea for a non-straight path, though for this introductory equation the intended meaning (path length covered) is clear from context. Not a scientific error; a clarity nit (§24).
- **Distance vs. displacement:** kept correctly distinct by omission — displacement (a signed/vector spatial quantity) is never introduced or conflated with distance anywhere in the file. This is correct restraint, not a gap, since displacement is out of this topic's audited scope.
- **Scalar/vector language:** accurate throughout, no defect found.
- **Equation conditions stated:** yes, for the average-speed relationship. See §16 for the one unstated-condition equation flag (a minor one).
- **Units:** correct and consistent — `m` for distance, `s` for time, `m/s` for speed, correctly built as a combined unit (not an independently defined unit).
- **`ch01-corr-001` applied exactly as approved:** confirmed. The mainIdea block's text preserves the approved corrected meaning in full — the mechanics-scope qualifier and the charge-deferral point are both present and are not altered from the correction's substance, though the wording is an elaborated paraphrase (a full paragraph) rather than the correction's own terser two-sentence form. This is an acceptable, intended elaboration for a `mainIdea` block, not a deviation from the approved meaning.
- **Cross-record agreement:** the mainIdea, organizedExplanation, equationSet, misconception, and reviewQuestion blocks are mutually consistent — no contradiction was found between any pair.

**One notation-consistency finding (Important — see §16 for full detail):** the organizedExplanation introduces `L`, `T`, `M` as the symbols for the fundamental quantities (matching the audited sources' own dimensional-symbol convention), while the equationSet then uses lowercase `d` and `t` as the working variables in `v = d/t`. The relationship between the dimensional symbols (`L`, `T`, `M` — naming the *quantity type*) and the equation's working variables (`d`, `t` — naming *specific measured values*) is never explicitly reconciled anywhere in the draft. This is a standard, correct physics convention (dimensional symbols and variable symbols are legitimately different things), but an introductory PHSH111 reader encountering both without a bridging sentence could plausibly wonder why "time" is `T` in one block and `t` in the next.

**Pedagogical acceptability of `v` for scalar speed:** acceptable. `v` is the conventional symbol for speed/velocity in essentially all physics instruction, including this same chapter's own already-approved `ch01-corr-007`/`ch01-corr-008`/`ch01-corr-009` (which use `v` for velocity in `ch01-t08`/`ch01-t10`). Using `v` for speed here, with an explicit scalar-vs-vector clarification already present, is consistent with that established chapter-wide convention and does not require further clarification beyond what is already stated.

## 7. `ch01-t01` pedagogical/editorial review

- **Clarity:** high. Each block states its point plainly, in short-to-medium sentences appropriate to an introductory course.
- **Conceptual sequence:** logical — main idea → full explanation → equation illustration → misconception guard → review check.
- **Cognitive load:** appropriately light for a first topic; no overloaded sentence or unexplained jump was found.
- **Terminology consistency:** consistent within the file (see §6's `L/T/M` vs. `d/t` finding as the one partial exception).
- **Redundancy:** the mainIdea and organizedExplanation overlap substantially in content (a known, acceptable pattern already present in the pilot precedent, e.g. `ch01-t02`'s own `remainingNonBlockingNotes` flags exactly this same overlap as non-blocking).
- **Missing conceptual bridge:** none found beyond §6's notation point.
- **Risk of student misconception:** low; the misconception block directly anticipates and addresses the one real risk (scope overreach) identified by four independent audit records.
- **Section-heading-to-function match:** all six blockTypes are used consistent with their established meaning (no misuse of `mainIdea` for explanation-length content, etc.).
- **Preparation for review card:** adequate — the review card tests exactly the scope-qualifier point the explanation and misconception blocks both build toward.

**`instructorScript` (`ch01-is-101`):** instructional purpose and teaching sequence are clear and appropriately paced (8-minute estimate, two pause cues). Anticipated student difficulty is well-matched to the two misconceptions already flagged for the learner-visible content. All three learning objectives are evidence-supported — objective 1 and 2 trace to the correction/audit findings directly; objective 3 (speed as the worked derived-quantity example) traces to `S3-P003`'s own chosen illustration. **No copied lecture-script phrasing was found** — independently re-checked against `SEG009`/`SEG010`'s actual wording (both distinctly worded, no shared multi-word phrases beyond common physics terms like "fundamental quantities" itself).

**Instructor-only misconception block:** genuinely evidence-supported (four independent audit records: `SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, plus `K1-SCI-004`); stated accurately; its correction is clear and actionable; `visibility: "instructor"` is the correct and appropriate value (this is guidance about a *pedagogical risk*, not itself a learner-facing statement).

## 8. `ch01-t01` record-level table

| Record ID | Type | blockType | Visibility | Scientific | Editorial | Source-lineage | Rights-safety | Recommendation | Reason |
|---|---|---|---|---|---|---|---|---|---|
| `ch01-is-101` | instructorScript | — | (internal) | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | No defect found |
| `ch01-t01-block-mainidea` | contentBlock | mainIdea | shared | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | Faithfully applies `ch01-corr-001` |
| `ch01-t01-block-explanation` | contentBlock | organizedExplanation | shared | Sound, with one notation-clarity gap (§6) | Clean | Confirmed | Clearly newly authored | **Revise (minor)** | Add one sentence reconciling `L/T/M` with `d/t` |
| `ch01-t01-block-equations` | contentBlock | equationSet | shared | Sound | Clean | Confirmed | Clearly newly authored | **Revise (minor, optional)** | Same notation point; optionally add one numeric instantiation (§9, §24) |
| `ch01-t01-block-visual` | contentBlock | visualReference | shared | N/A (planning only) | Clean | N/A (no provenanceLinks needed) | Clearly newly authored, explicitly non-derivative | **Retain** | See §18 |
| `ch01-t01-block-misconception` | contentBlock | misconception | instructor | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | Directly evidence-supported |
| `ch01-t01-block-review` | contentBlock | reviewQuestion | student | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | Original, self-contained, tests the correct concept |

All seven records remain governance-`blocked`, not student-facing, consistent with §4.

## 9. `ch01-t01` recommendation

**Revise before baseline-approval review.**

- **Confidence:** High.
- **Critical issues:** none.
- **Important issues:** (1) the `L/T/M` vs. `d/t` notation gap in `ch01-t01-block-explanation`/`ch01-t01-block-equations` (§6); (2) the topic contains zero numeric content anywhere (§5, §7) — defensible given the zero-problem source coverage, but worth a deliberate decision rather than silent omission.
- **Optional improvements:** add one bare numeric illustration inside `ch01-t01-block-equations` (e.g., "for example, walking 100 m in 20 s gives a speed of 5 m/s") — this does not require a new `problem` record and would not conflict with the justified absence of one; tighten "distance" to "distance traveled" in the equation block for precision (§6, §24).
- **Exact records affected:** `ch01-t01-block-explanation`, `ch01-t01-block-equations`.
- **Revision type required:** **draft-only editing.** No new correction record, glossary decision, schema decision, visual decision, or governance decision is required — both findings are wording-level clarity improvements within the existing approved scientific content, not substance changes.

## 10. `ch01-t04` scope review

Reconstructed independently from `topic-mapping.json` (`ch01-t04.segmentIds: ["SEG021","SEG022"]`, `coverageStatus: "adequate"`) and the citation-repair task's evidence set.

**In-scope concepts present:** mass as a measure of inertia (not "amount of matter" as the primary definition); gravitational weight as the force of gravity, `W = mg`; apparent weight as the scale/support-force reading (the approved correction's qualified interpretive term); the mass-is-location-independent / weight-is-location-dependent distinction, stated qualitatively.

**Content correctly left to adjacent/later topics:** signed/vector dynamics, Newton's second law in general, and accelerating-reference-frame apparent-weight scenarios (elevator problems) are explicitly and repeatedly flagged as out-of-scope (`instructorOnlyCautions`, `levelAdaptations`) rather than drafted — correct restraint, matching the audited evidence, which contains nothing on accelerating frames for this topic.

**Audited concepts omitted:** `S3C-Q003`/`R1-Q003`'s metric unit-conversion fact (1 kg = 1000 g) was reviewed but not included in the draft — a minor, defensible omission (it is a general metric-system fact more naturally scoped to `ch01-t02`'s unit-conversion territory than to this topic's mass/weight distinction), not flagged as a gap requiring revision.

**Unsupported expansion:** none found. The problem's off-Earth qualitative comparison stays strictly qualitative (no invented numeric `g` value for the "research-station module"), correctly avoiding the exact overreach this review was instructed to watch for.

**Completeness for the intended topic scope:** substantively complete; see §12 for the one numerical-methodology finding and §14 for the record-completeness assessment.

## 11. `ch01-t04` scientific review

- **Physical definition of weight:** correctly presented as a force (gravitational weight = the force of gravity on the object), not a mass, throughout every record.
- **`W = mg`:** mathematically correct standard relationship; consistently applied in the equation block, the review card (98 N check), and the problem (441 N).
- **Weight treated as a force:** yes, consistently, including correct units (newtons) every time weight is quantified.
- **Mass/weight distinction:** clearly and repeatedly drawn — in the mainIdea, the full explanation, the misconception block, the review card, and the problem's part (b). No record blurs the two.
- **Magnitude vs. vector direction:** handled correctly and conservatively — the equation block explicitly states it is magnitude-only, names the force's direction in words ("toward the source of gravitational attraction... downward") without introducing a sign convention, and the problem's `directionSign.applicable: false` field matches this (with an explanatory note). No vector/sign-convention content is introduced that would duplicate or conflict with `ch01-t08`'s already-approved sign-convention treatment (`ch01-corr-007`).
- **Value and units of `g`:** `|g| ≈ 9.8 m/s²`, explicitly noted as consistent with the value already established for `ch01-t08` — correct, and a good example of cross-topic numeric consistency rather than re-deriving the constant independently.
- **Equation conditions stated:** the equation block itself states the mass/location-independence and weight/location-dependence conditions in prose. The problem's `equationSelection.conditionsSatisfied` field explicitly states the more precise physical condition — "the cart is being considered at rest (no acceleration beyond gravity itself)." The equation block's own prose is slightly less precise on this specific point (see §16).
- **"Apparent weight" used correctly:** yes. It is consistently defined as the scale/support-force reading, distinguished by name from gravitational weight, and explicitly noted to normally *equal* gravitational weight only in an unaccelerated/resting situation.
- **Approved qualification respected:** confirmed, word-for-word in substance. `ch01-t04-block-explanation`'s own learner-visible text states: *"The term 'apparent weight' is this chapter's own clarifying label for that support-force reading; it is not a direct quotation from any source material..."* — this is the qualification stated in the actual instructional prose, not only in governance metadata, which exceeds what the approval required.
- **Normal force / scale reading / gravitational force distinguished:** handled correctly for the scope actually drafted (a static object on a scale). The draft does not attempt to distinguish normal force from apparent weight in a general (non-horizontal-surface) sense, which is appropriate — that level of generality is beyond this topic's audited scope and would risk exactly the accelerating-frame expansion the instructor script explicitly flags as out of bounds.
- **`ch01-corr-002` applied exactly as approved:** confirmed, including the qualification (above).

## 12. `ch01-t04` problem recalculation

Independent recalculation of `ch01-prob-104`, performed for this review without reference to the draft's own stated result:

- **Given:** `m = 45 kg` (exact, per the problem's own `givenValues`), `g = 9.8 m/s²` (approximate).
- **Equation:** `W = mg`.
- **Computation:** `45 kg × 9.8 m/s² = 441.00000000000006 N` (floating-point representation of the exact product `441 N`).
- **Draft's stated result:** `441 N` — **numerically correct**, confirmed by independent recomputation.
- **Significant-figure finding (Important):** both inputs (`45`, `9.8`) carry **2 significant figures**. Standard significant-figure convention for a multiplication limits the result to the *fewest* significant figures among the inputs — here, 2. The mathematically strict 2-significant-figure result is **440 N** (or `4.4 × 10² N`), not `441 N`. The draft's own `calculation` record is internally inconsistent on this exact point: it states `"significantFigures": 2` while simultaneously stating `"roundingRule": "no rounding required (exact product)"` and reporting the unrounded 3-digit value `441`. **By contrast, `ch01-t04-block-review`'s own worked check — `10 kg × 9.8 m/s² = 98 N` — is correctly 2 significant figures** (independently reconfirmed: `10 × 9.8 = 98.0` exactly), which makes the inconsistency in `ch01-prob-104` more conspicuous, since the same file handles the identical unit/sig-fig situation correctly in one record and inconsistently in another.
- **Everything else in the problem:** givens are unambiguous and clearly labeled; the required quantity is explicit; the equation choice is correct and justified; unit handling is correct and consistent throughout (kg → N conversion via `g`, never mixed up); solution-step order is logical (numeric part, then qualitative part); the final answer and interpretation are both scientifically accurate; no hidden assumption was found — the "at rest, no acceleration beyond gravity" condition is stated explicitly in `equationSelection.conditionsSatisfied`; the problem is fully consistent with `ch01-t04-block-equations`' own stated `W = mg` relationship and with the topic's main explanation.

**Verdict:** the problem is scientifically sound and the arithmetic is correct; the one finding is a significant-figure/rounding-methodology precision issue in the `calculation` metadata and the displayed final answer, not an error in the underlying physics or the numerical operation itself.

## 13. `ch01-t04` pedagogical/editorial review

- **Clarity:** high throughout; the mass/weight/apparent-weight three-way distinction is introduced gradually (mass → weight → apparent weight) rather than all at once.
- **Conceptual sequence:** logical, and notably stronger than `ch01-t01`'s in one respect — the qualification about "apparent weight" terminology is folded directly into the explanation's own reading flow (via a parenthetical), rather than left only in metadata, which is good editorial practice for a qualification the project owner specifically required to be visible.
- **Cognitive load:** appropriate; the explanation is the longest single block in either file (a natural consequence of introducing three related-but-distinct concepts) but remains readable, with each concept given its own sentence or two before moving to the next.
- **Terminology consistency:** consistent; "gravitational weight" and "apparent weight" are used as fixed, distinguishing terms throughout, never abbreviated to ambiguous "weight" alone in a context where the distinction matters.
- **Redundancy:** the mainIdea and explanation overlap substantially (same pattern as `ch01-t01`, and as the pilot precedent's own known, accepted overlap).
- **Missing conceptual bridge:** none found.
- **Risk of student misconception:** low; both flagged misconceptions (mass≡weight; mass changes with gravity) are directly and repeatedly addressed.
- **Section-heading-to-function match:** correct throughout.
- **Preparation for review card/problem:** strong — the review card's "10 kg equipment case" scenario and the problem's "45 kg cart" scenario both draw directly on vocabulary and the `W = mg` relationship already established in the equation block; no unexplained jump.

**`instructorScript` (`ch01-is-104`):** instructional purpose and sequence are clear; the gurney opening hook effectively sets up both the mass (push) and weight (lift) halves of the lesson in one question. Anticipated difficulty (the everyday "weigh in kilograms" habit) is well-matched to the misconception block. All three learning objectives are evidence-supported. **No copied lecture-script phrasing was found** — independently re-checked against `SEG021`/`SEG022`'s actual wording; both are distinctly worded (the draft's gurney/equipment-cart framing is a different device from `SEG022`'s suitcase framing, as intended).

**Instructor-only misconception block:** genuinely evidence-supported (`SCA02`, `SCA03`, corroborated by `K1-SCI-010`'s positive-contrast finding); accurately stated; correction is clear; `visibility: "instructor"` is appropriate.

## 14. `ch01-t04` record-level table

| Record ID | Type | blockType | Visibility | Scientific | Editorial | Source-lineage | Rights-safety | Recommendation | Reason |
|---|---|---|---|---|---|---|---|---|---|
| `ch01-is-104` | instructorScript | — | (internal) | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | No defect found |
| `ch01-t04-block-mainidea` | contentBlock | mainIdea | shared | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | Faithfully applies `ch01-corr-002` incl. qualification |
| `ch01-t04-block-explanation` | contentBlock | organizedExplanation | shared | Sound, minor condition-precision point (§16) | Clean | Confirmed | Clearly newly authored | **Retain** (optional polish) | "Ordinary situation" could be tightened to "no acceleration" |
| `ch01-t04-block-equations` | contentBlock | equationSet | shared | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | No defect found |
| `ch01-t04-block-visual` | contentBlock | visualReference | shared | N/A (planning only) | Clean | N/A | Clearly newly authored, explicitly non-derivative | **Retain** | See §18 |
| `ch01-t04-block-misconception` | contentBlock | misconception | instructor | Sound | Clean | Confirmed | Clearly newly authored | **Retain** | Directly evidence-supported |
| `ch01-t04-block-review` | contentBlock | reviewQuestion | student | Sound (98 N independently verified) | Clean | Confirmed | Clearly newly authored | **Retain** | Original, correctly rounded, self-contained |
| `ch01-prob-104` | problem | — | (governed by `blocking`) | Sound arithmetic; sig-fig methodology issue (§12) | Clean | Confirmed, `SRC-CH01-BATCH1-ORIGINAL` correctly used as a marker only | Clearly newly authored | **Revise (minor)** | Reconcile `significantFigures: 2` with the unrounded `441` value |

All eight records remain governance-`blocked`, not student-facing, consistent with §4.

## 15. `ch01-t04` recommendation

**Revise before baseline-approval review.**

- **Confidence:** High.
- **Critical issues:** none — the underlying physics and the core arithmetic are both correct.
- **Important issues:** (1) `ch01-prob-104`'s significant-figure inconsistency (§12) — either round the final answer to `440 N` (2 sig figs) and update `roundingRule` accordingly, or explicitly justify treating the given values as exact (in which case `significantFigures` should not read `2`); (2) whether one original problem is sufficient to serve as both the topic's worked example and its problem (§7 task requirement, addressed in §14/§17) — defensible but worth a deliberate reviewer decision rather than silent acceptance.
- **Optional improvements:** tighten `ch01-t04-block-explanation`'s "an ordinary situation... resting still on a scale" phrasing to explicitly say "no acceleration" for full rigor (the correct condition is already stated precisely in the problem's own `equationSelection.conditionsSatisfied`, just not in the main prose); consider adding `ch01-term-mass` to `ch01-t04-block-equations`' `glossaryTermIds` alongside `ch01-term-weight`, since the block does define `m` (very minor completeness point).
- **Exact records affected:** `ch01-prob-104` (required); `ch01-t04-block-explanation` (optional).
- **Revision type required:** **draft-only editing** for both the required and optional items. No new correction record, glossary decision, schema decision, visual decision, or governance decision is required.

## 16. Equation and notation findings

| Equation | Location | Mathematical correctness | Quantity represented | Symbols defined | Units | Dimensional consistency | Scalar/vector | Magnitude/signed | Condition stated | Notation consistency | Arabic-LTR-isolation compatible | Pilot-convention consistent |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `v = d/t` | `ch01-t01-block-equations` | Correct | Average speed | Yes (`v`,`d`,`t`) | m, s, m/s — correct | Correct | Scalar, explicit | Magnitude only, explicit | Yes (average, over an interval) | **Partial — see below** | Yes (isolable LTR span, matches `VISUAL_HOUSE_STYLE.md`'s italic-variable/upright-unit convention) | Yes (`v` for speed matches chapter-wide `v` usage) |
| `W = mg` | `ch01-t04-block-equations` | Correct | Gravitational weight magnitude | Yes (`W`,`m`,`g`) | N, kg, m/s² — correct | Correct (kg·m/s² = N, implicit) | `W` is a force with direction stated in words only; magnitude used in equation | Magnitude only, explicit | Yes, in prose; more precisely in the problem's own metadata (§11) | Consistent | Yes | Yes (reuses `ch01-corr-007`'s own `|g| ≈ 9.8 m/s²` value) |

**Flag (equation correct only under an unstated condition, as the task specifically asks to check for):** `ch01-t04-block-equations`' prose states apparent weight equals gravitational weight "in an ordinary situation" without naming the precise physical condition (zero acceleration) in that specific sentence — the correct condition *is* stated, but one level removed, in the problem record's `equationSelection.conditionsSatisfied` rather than in the equation block's own learner-visible text. This is the same finding already logged in §11/§15; listed here again because the task explicitly asks equation-by-equation.

**Notation-consistency flag:** the `L`/`T`/`M` (dimensional symbol) vs. `d`/`t` (equation variable) gap in `ch01-t01`, already detailed in §6/§8/§9.

## 17. Source-lineage and identifier findings

**Source-lineage:** every `sourceId`/`locatorId` pair cited in either file was independently re-verified against `topic-mapping.json` and the raw source files: `SEG009`, `SEG010` (`ch01-t01`, high confidence, primary for the instructor script and explanation), `S2-SEG026` (`ch01-t01`, high confidence, explicitly marked primary supporting evidence, cited first in every list it appears in), `S3-P002`, `S3-P003` (`ch01-t01`, medium confidence, correctly scoped to concept-only contribution); `SEG021`, `SEG022` (`ch01-t04`, high confidence, explicitly marked primary, cited first), `S2-SEG056`, `S2-SEG058` (`ch01-t04`, high confidence). All scientific-audit IDs (`SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`, `SCA02`, `SCA03`, `S5-SCI-012`, `K1-SCI-010` — the last cited only in the generation report's evidence review, not as a record-level citation) independently re-confirmed to exist and map to their stated topics. **No over-citation, under-citation, or irrelevant citation was found** — `ch01-t01-block-equations` citing only `S3-P003` (not `SEG009`/`SEG010`) is correctly scoped, since the equation's own derived-quantity illustration traces specifically to that page, not to the topic's general definitional segments (§6 discussion). **Removed miscited evidence (`SEG004`, `SEG017`, `SEG018`, `S5-P033`) is confirmed absent from both files** (grep-verified, zero occurrences). Correction IDs (`ch01-corr-001`/`CD-CONF-001`; `ch01-corr-002`/`CD-CONF-002`) are attached to every content record of their respective topic, matching the exact per-topic lineage-citation convention already established by the four pilot topics for their own approved corrections (e.g. `ch01-corr-006` cited on every `ch01-t03` block) — not over-citation by this project's own precedent, though a stricter reviewer could reasonably ask whether `ch01-t01-block-visual`'s citation of `ch01-corr-001` is fully necessary, since the visual specification's own content doesn't directly restate the correction's scope-qualifier point. This is a defensible, precedent-consistent choice, not flagged as a required revision.

**`SRC-CH01-BATCH1-ORIGINAL`:** confirmed used only as `sourceVariant.sourceId` for `ch01-prob-104`'s own single, wholly-original variant — never presented as, or confused with, an audited source record; never appears in any `provenanceLinks`/`sourceTraceability` array (which require the `^SRC-CH01-[A-Z0-9-]+$`-patterned audited-source-namespace IDs). **Registration finding:** `IDENTIFIER_REGISTRY.json`'s `sourceIds` array contains exactly the 7 audited sources; it does **not** contain `SRC-CH01-PILOT-ORIGINAL` (the exact precedent marker already used, unregistered, in the live pilot file `ch01-t03-content.json`, independently re-confirmed present there) or the new `SRC-CH01-BATCH1-ORIGINAL`. This is a **pre-existing registry gap this draft did not introduce** — `SRC-CH01-BATCH1-ORIGINAL` mirrors an already-unregistered convention exactly. **Recommendation:** before English baseline approval for either topic (and ideally before the existing pilot precedent is itself finalized), a governance decision should register both "-ORIGINAL" marker values in `IDENTIFIER_REGISTRY.json`'s source namespace, or explicitly document that "-ORIGINAL"-suffixed values are a recognized non-audited-source convention exempt from that namespace's audit-file-backing requirement. This is a **glossary/registry-type governance decision**, not a draft-content defect.

**Identifier review (`ch01-is-101`, `ch01-is-104`, all new `blockId`s, `ch01-prob-104`, `ch01-t01-visual-001`, `ch01-t04-visual-001`, `SRC-CH01-BATCH1-ORIGINAL`):**

| ID | Naming-pattern consistency | Global uniqueness | Topic alignment | Registration recommendation |
|---|---|---|---|---|
| `ch01-is-101` | Matches `^ch01-is-[0-9]{3}$`, follows the topic-number-encoded convention (`10X`) exactly | Confirmed unique (not used by any pilot file or by `ch01-is-104`) | Correct (`ch01-t01`) | Register once baseline-approved |
| `ch01-is-104` | Same pattern | Confirmed unique | Correct (`ch01-t04`) | Register once baseline-approved |
| `ch01-t01-block-*` (6 IDs) | Matches the informal `ch01-tXX-block-<name>` convention exactly | Confirmed unique | Correct | Register once baseline-approved |
| `ch01-t04-block-*` (6 IDs) | Same convention | Confirmed unique | Correct | Register once baseline-approved |
| `ch01-prob-104` | Matches `^ch01-prob-[0-9]{3}$` | Confirmed unique | Correct (`ch01-t04`) | Register once baseline-approved |
| `ch01-t01-visual-001` | Matches the pilot files' own asset-ID convention (which itself does not match any `IDENTIFIER_REGISTRY.json` visual-namespace pattern — a pre-existing gap, not introduced here) | Confirmed unique | Correct | **Should remain provisional** — do not register until visual production is separately authorized and an actual asset exists, consistent with `availabilityStatus: "missing"` |
| `ch01-t04-visual-001` | Same | Confirmed unique | Correct | Same — remain provisional |
| `SRC-CH01-BATCH1-ORIGINAL` | Matches `^SRC-CH01-[A-Z0-9-]+$` (the general source-namespace pattern) | Confirmed unique, distinct from the pilot's `SRC-CH01-PILOT-ORIGINAL` | Not topic-specific by design (a project-wide marker) | Requires the separate governance decision described above, ideally alongside `SRC-CH01-PILOT-ORIGINAL` |

`IDENTIFIER_REGISTRY.json` was read in full for this review and **was not modified.**

## 18. Visual-reference findings

Both `visualReference` records (`ch01-t01-block-visual`, `ch01-t04-block-visual`) independently re-verified:

- **Pedagogically justified:** yes, both — a fundamental/derived-quantity diagram and a mass/weight/apparent-weight contrast diagram are both natural, non-decorative teaching aids consistent with `VISUAL_HOUSE_STYLE.md`'s own stated principle that every visual element must map to something the caption/equation/misconception explicitly discusses.
- **No asset path falsely claims a produced visual exists:** confirmed — neither record contains an `assetPath`, `assetFormat`, or `assetStatus` field (the generation task deliberately omitted these undeclared `visualGovernance` fields, unlike the four pilot files' own informal practice — see §21).
- **`availabilityStatus` correctly `"missing"`:** confirmed on both.
- **Internal disclosures complete:** confirmed — both records' text explicitly states the visual has not been produced, not been reviewed, is not student-facing, and that separate visual-production authorization is required (case-insensitively verified present in both).
- **No imitation or derivation from publisher artwork:** confirmed by content — `ch01-t01-block-visual`'s four-box specification and `ch01-t04-block-visual`'s three-panel specification are both original compositions; the latter explicitly and correctly notes it uses a different example object (equipment cart) than the audited sources' suitcase illustration, and adds an apparent-weight scale panel the audited sources do not depict at all.
- **Sufficiently abstract:** yes — both specifications describe labeled boxes/panels and relationships rather than a fully rendered composition, appropriately leaving concrete visual-design decisions to the future, separately authorized visual-production task.
- **Does not imply visual approval:** confirmed — neither record's `blocking` object claims anything beyond `blocked`/`instructorFacingAllowed: true`/`studentFacingAllowed: false`.
- **Separate visual authorization clearly required:** stated explicitly in both records' own text.

**Recommendation for both:** **remain in the draft** — neither requires revision or removal. Both are well-formed planning metadata, correctly and conservatively represented, and provide genuine forward value for a future visual-production task without overstepping this task's authorization boundary.

## 19. Arabic missing-state findings

Independently re-verified on all 13 applicable records (6 `ch01-t01` contentBlocks; 6 `ch01-t04` contentBlocks; 1 `ch01-t04` problem): every one has `arabic.translationStatus: "missing"`, `arabic.originalArabicText.text: null`, `arabic.originalArabicText.status: "missing"`, `arabic.canonicalArabicTranslation.text: null`, `arabic.canonicalArabicTranslation.status: "missing"`, `arabic.translationReviewer: null`, `arabic.terminologyApprovalStatus: "notStarted"`. No Arabic prose exists anywhere in either file. No English text was copied into any Arabic field. No fake placeholder exists. Nothing implies Arabic drafting, review, or approval has occurred. Both `instructorScript` records correctly omit the (optional-for-that-type) `arabic` field entirely, per the drafting authorization's own determination — confirmed still the case. This representation is fully compatible with a later, separately authorized Arabic-generation task picking up exactly where this leaves off.

**Future Arabic-translation requirements identified, by record:**
- **`ch01-t04`'s six contentBlocks and one problem** will require the three pending glossary terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`) to complete terminology review (currently `approvalStatus: "pending"` in `BILINGUAL_GLOSSARY.json`, confirmed unchanged) before Arabic translation can be finalized — already correctly forward-referenced via `glossaryTermIds` on the relevant blocks.
- **`ch01-t04-block-equations`, `ch01-t04-block-explanation`, `ch01-t04-block-review`, `ch01-prob-104`** contain the qualified term "apparent weight," which will require **conceptual adaptation** (not literal translation) when Arabic wording is eventually drafted, since `ch01-term-apparent-weight`'s Arabic rendering (الوزن الظاهري, currently pending) must itself carry the same "interpretive, not verbatim" framing.
- **`ch01-t01-block-equations`, `ch01-t04-block-equations`** will require standard **equation-isolation** handling (a dedicated LTR-direction text run for `v = d/t` / `W = mg`, matching the exact pattern already proven in `VISUAL_HOUSE_STYLE.md` §3–4 for the four pilot topics) — no unusual bidi risk beyond that already-solved pattern was identified.
- **No special bidi handling beyond the standard equation-isolation pattern** was identified as newly required by either file.
- **`ch01-t01`'s six contentBlocks** have zero existing glossary-term coverage (confirmed: no term for "fundamental quantities," "distance," "time," or "charge" scoped to this topic) — a full glossary-approval pass, not yet started, will be needed before this topic's Arabic translation can proceed, independent of and in addition to the translation work itself.

## 20. Rights-safety findings

Independently compared both drafts against the audited source wording for this review, using both a targeted phrase-overlap check (re-run, confirming the generation-time fix holds — zero matches for the same distinctive-phrase list used during drafting, plus several additional phrases specific to this review: *"support force"*, *"resistance to a change in motion"*, *"amount of matter"* — all either not present verbatim in the drafts' exact combined form found in sources, or are standard physics phrasing not attributable to any single source) and close manual reading of every learner-visible sentence against its cited source segment's actual content (not reproduced at length here, per this task's own constraint).

| Category | Assessment |
|---|---|
| Definitions (mass, weight, speed, fundamental/derived) | Clearly newly authored |
| Correction-derived wording (both mainIdea blocks) | Clearly newly authored — elaborates the approved corrections' own already-approved wording, which is project-authored governance text, not source-copied text |
| Review cards | Clearly newly authored — both scenarios (scope-qualifier dialogue; "equipment case weighs 10 kg") are original, structurally distinct (explanation-based, not multiple-choice) from every audited review/solved-question item |
| Misconception text | Clearly newly authored |
| Problem wording (`ch01-prob-104`) | Clearly newly authored — different object, numbers, and two-part structure than any audited item |
| Visual descriptions | Clearly newly authored, explicitly non-derivative by design |
| Instructor scripts | Clearly newly authored — the gurney/equipment-cart framing devices are distinct from the audited sources' own framing devices (suitcase, etc.) |

**No record was found "potentially too close to a source," "requires revision before approval," or "blocked pending rights review."** This is Claude's own self-review under project-owner authorization, consistent with every other rights-safety review performed across this project — it is not, and is not represented as, independent human legal or editorial review.

## 21. Governance findings

- `PILOT_AUTHORIZATION.json` v1.2.0's `batch1DraftingAuthorization` covers both files reviewed — confirmed.
- No topic outside `ch01-t01`/`ch01-t04` was generated — confirmed (both files' `topicId` and every record's `topicId`/`topicIds` checked).
- No English baseline approval exists for either topic — confirmed.
- No Arabic authorization exists — confirmed.
- No visual-production authorization exists — confirmed.
- No application-expansion authorization exists — confirmed (no file under `apps/chapter1-mvp/` references either topic).
- No independent expert approval exists — confirmed (`approvals.scientificReviewer: null` on both corrections, unchanged).
- Student publication remains unauthorized — confirmed.
- **This review changed none of the above states** — no governance, authorization, readiness, correction, conflict, baseline, glossary, or identifier-registry file was modified during this task (verified: only the two draft files were read, and this new review document was the only file written).

## 22. Batch-level recommendation

**One topic may proceed; one requires revision — though in practice, given both required revisions are minor, draft-only wording fixes with high review confidence, a more precise characterization is: both topics require a small, well-scoped revision pass before proceeding to baseline-approval review; neither requires redrafting, a new correction, or any governance decision to fix.**

Selecting from the four required options: **"Both topics require revision"** is the most accurate of the four, since both `ch01-t01` (notation-bridging sentence) and `ch01-t04` (significant-figure reconciliation in `ch01-prob-104`) have at least one **Important**-severity finding requiring a fix before this reviewer would recommend proceeding to baseline-approval review — even though neither finding is scientifically critical and both are fixable within the existing files without new evidence, new corrections, or governance action.

**The topics should remain paired.** Nothing found in this review changes the batch-pairing assessment already made in `PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` §12 — both topics share the same risk profile (both now resolved to "revise draft wording," not "revise science"), the same readiness gate, and no dependency was found requiring one to be resolved before the other.

## 23. Required revisions

1. **`ch01-t01-block-explanation` and/or `ch01-t01-block-equations`:** add one bridging sentence reconciling the dimensional symbols `L`/`T`/`M` with the equation's working variables `d`/`t` (§6, §8, §9).
2. **`ch01-prob-104`'s `calculation` record and `finalAnswer`:** reconcile the stated `significantFigures: 2` with the displayed, unrounded `441` value — either round to `440 N` (2 sig figs) and update `roundingRule`, or change the `significantFigures` value and `roundingRule` to accurately reflect that the inputs are being treated as exact (§12, §14, §15).

Both are **draft-only editing** tasks. Neither requires a new correction record, a glossary decision, a schema decision, a visual decision, or a governance decision.

## 24. Optional improvements

- `ch01-t01-block-equations`: tighten "distance" to "distance traveled" for precision; consider adding one bare numeric instantiation of `v = d/t` as an illustrative aside (not a new record).
- `ch01-t04-block-explanation`: tighten "an ordinary situation... resting still on a scale" to explicitly state "no acceleration," matching the more precise condition already stated in `ch01-prob-104`'s own metadata.
- `ch01-t04-block-equations`: consider adding `ch01-term-mass` to `glossaryTermIds` alongside `ch01-term-weight`, since the block defines `m`.
- Governance-track item (not a draft edit): register `SRC-CH01-PILOT-ORIGINAL` and `SRC-CH01-BATCH1-ORIGINAL` in `IDENTIFIER_REGISTRY.json`'s source namespace, or explicitly document the "-ORIGINAL" marker convention as registry-exempt, before or alongside a future baseline-approval task (§17).
- Consider, as part of a future baseline-approval review rather than this one, whether `ch01-t04` would benefit from a distinct, simpler `example` block preceding `ch01-prob-104`, giving students a lower-stakes worked illustration before the full two-part problem — not required, since the pilot precedent does not mandate a separate `example` record and the problem itself functions adequately as both (§14).

## 25. Exact next controlled task

A **narrowly scoped draft-revision task**, applying exactly the two required revisions in §23 to the two existing draft files (no new record, no new correction, no scope change) — followed by a re-review or direct proceed to the English baseline-approval task, at the project owner's discretion. This review does not perform that revision task itself.

## 26. Publication statement

This is an advisory review only. No draft content was modified — both files are confirmed byte-identical to their pre-review state (§1). No baseline approval was granted. No independent human expert approval occurred — every finding above is Claude's own review under project-owner authorization. No Arabic or visual content was generated. No application expansion occurred. **Publication remains unauthorized**: `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere this task touched or read, and nothing in this review changes, sets, or proposes changing either flag for any topic.
