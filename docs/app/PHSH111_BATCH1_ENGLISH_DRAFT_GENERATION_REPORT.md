# PHSH111 Batch 1 — English Draft Generation Report

**Generated:** 2026-07-16. **These are English drafts only.** No baseline approval was granted. No Arabic text was generated. No visual was produced. No application expansion occurred. No student-facing authorization was granted.

## 1. Purpose and authorization basis

This report documents the generation of controlled English-language draft content for Batch 1 (`ch01-t01`, `ch01-t04`), under `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` v1.2.0's `batch1DraftingAuthorization` and `docs/content-design/chapter-01/PILOT_READINESS.json` v1.5.0's `batch1DraftingReadiness`, following the full approval chain: `PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` → `PHSH111_BATCH1_CORRECTION_CITATION_REPAIR.md` → `PHSH111_BATCH1_CORRECTION_APPROVAL_RECORD.md` → `PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md`. These are **controlled draft artifacts**, not approved canonical baselines, not application-facing content, and not authorized for student publication.

### Pre-drafting verification (performed before any content was written)

| Condition | Verified value |
|---|---|
| No existing `ch01-t01` draft or canonical content file | Confirmed absent (filesystem search, repo-wide) |
| No existing `ch01-t04` draft or canonical content file | Confirmed absent (filesystem search, repo-wide) |
| `PILOT_AUTHORIZATION.json` version | `1.2.0` — confirmed |
| `PILOT_READINESS.json` version | `1.5.0` — confirmed |
| English drafting authorized only for | `ch01-t01`, `ch01-t04` (`batch1DraftingAuthorization.applicableTopicIds`) — confirmed; original four-topic `scope.authorizedTopicIds` unchanged |
| `ch01-corr-001` status | `editoriallyApproved`, `approvals.scientificReviewer: null` — confirmed |
| `ch01-corr-002` status | `editoriallyApproved` with recorded qualification, `approvals.scientificReviewer: null` — confirmed |
| Arabic generation authorized | No — confirmed unauthorized |
| Visual production authorized | No — confirmed unauthorized |
| Application expansion authorized | No — confirmed unauthorized |
| English baseline approval granted | No — confirmed not granted |
| Publication authorized | No — confirmed unauthorized |

All conditions held. Drafting proceeded.

## 2. Files created

- `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` (7 records)
- `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` (8 records)
- `docs/app/PHSH111_BATCH1_ENGLISH_DRAFT_GENERATION_REPORT.md` (this document)

No file was created under `docs/content-design/chapter-01/pilot/` or `apps/chapter1-mvp/`. No other file was modified — re-confirmed via `git status --porcelain` before and after this task, showing only the new `batch1-drafts/` directory added under the pre-existing untracked `docs/` tree.

## 3. Topic scopes used

Reconstructed independently from `topic-mapping.json`, `IDENTIFIER_REGISTRY.json`, the source audits, and the approved correction records — not merely from the expansion plan's summary.

**`ch01-t01` (Fundamental Quantities):** in-scope — the concept of a fundamental vs. derived physical quantity; the three fundamentals this chapter's mechanics content uses (distance/L, time/T, mass/M); charge as a fourth fundamental property, explicitly deferred (not developed) to a later, non-Chapter-1 topic; one derived-quantity example (speed = distance/time), used because it is the audited sources' own chosen illustration. **Out of scope, deliberately excluded:** unit-conversion mechanics for length/area/volume (belongs to `ch01-t02`, already implemented); anything about time's own units, periods, or frequency (belongs to `ch01-t03`); anything about vectors, direction, or velocity vs. speed (belongs to `ch01-t06`, not yet drafted); anything about mass as inertia in depth (belongs to `ch01-t04`, this batch's other topic, kept separate).

**`ch01-t04` (Mass, Inertia and Weight):** in-scope — mass as a measure of inertia (not "amount of matter" as the primary definition); gravitational weight as the force of gravity, `W = mg`; apparent weight as the scale/support-force reading (the approved correction's qualified interpretive term); the mass-is-location-independent / weight-is-location-dependent distinction, stated qualitatively (no invented numeric off-Earth `g` value). **Out of scope, deliberately excluded:** signed/vector dynamics, Newton's second law in general, or accelerating-reference-frame apparent-weight scenarios (elevator problems etc.) — none of these are in the audited evidence for this topic and were flagged as out-of-scope rather than drafted; unit conversion depth beyond a passing mention (belongs to `ch01-t02`).

## 4. Evidence reviewed for ch01-t01

Read in full (not summary-only): `SEG009`, `SEG010` (the topic's own mapped segments, `docs/content-audits/chapter-01/raw-sources/source-001-segments.json`), `S2-SEG026` (primary supporting evidence per the repaired citation set, `sources/source-002/source-002-segments.json`), `S3-P002`, `S3-P003` (`sources/source-003/page-inventory.json`), `S3C-Q001` (`sources/source-conv-003/problem-solution-inventory.json`), `R1-Q001` (`sources/source-review-001/question-inventory.json`), scientific-audit records `SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`, and the topic's own `topic-mapping.json` coverage entries across all six per-source files. Independently re-confirmed `SEG004` remains excluded (it maps to `ch01-t14`, not `ch01-t01`) and was not reintroduced anywhere in this draft.

## 5. Evidence reviewed for ch01-t04

Read in full: `SEG021`, `SEG022` (the topic's own mapped segments, primary evidence per the repaired citation set), `S2-SEG056`, `S2-SEG058` (`sources/source-002/`), `S3-P013`, `S3-P014` (`sources/source-003/page-inventory.json`), `S3C-Q001`, `S3C-Q003`, `S3C-Q004` (`sources/source-conv-003/problem-solution-inventory.json`), `R1-Q001`, `R1-Q003`, `R1-Q004` (`sources/source-review-001/question-inventory.json`), scientific-audit records `SCA02`, `SCA03`, `S5-SCI-012`, `K1-SCI-010`, and the pending glossary records `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` (`BILINGUAL_GLOSSARY.json`, all `approvalStatus: "pending"`, read but not modified). `S3C-Q004`'s solution elements (which explicitly use `W = mg` and a qualitative Moon comparison) directly informed the equation and the problem's qualitative part (b) — without copying its wording, object, or numbers. Independently re-confirmed `SEG017`, `SEG018`, and `S5-P033` remain excluded (the first two map to `ch01-t03`; the third maps to `ch01-t08`) and were not reintroduced anywhere in this draft.

## 6. Record inventory for each topic

**`ch01-t01-content.json` — 7 records:**

| recordType | ID | blockType | visibility |
|---|---|---|---|
| instructorScript | `ch01-is-101` | — | (internal, no visibility field per schema — see §7) |
| contentBlock | `ch01-t01-block-mainidea` | `mainIdea` | `shared` |
| contentBlock | `ch01-t01-block-explanation` | `organizedExplanation` | `shared` |
| contentBlock | `ch01-t01-block-equations` | `equationSet` | `shared` |
| contentBlock | `ch01-t01-block-visual` | `visualReference` | `shared` |
| contentBlock | `ch01-t01-block-misconception` | `misconception` | `instructor` |
| contentBlock | `ch01-t01-block-review` | `reviewQuestion` | `student` |

No `problem` record was created for `ch01-t01` — see §13 for the explicit justification.

**`ch01-t04-content.json` — 8 records:**

| recordType | ID | blockType | visibility |
|---|---|---|---|
| instructorScript | `ch01-is-104` | — | (internal) |
| contentBlock | `ch01-t04-block-mainidea` | `mainIdea` | `shared` |
| contentBlock | `ch01-t04-block-explanation` | `organizedExplanation` | `shared` |
| contentBlock | `ch01-t04-block-equations` | `equationSet` | `shared` |
| contentBlock | `ch01-t04-block-visual` | `visualReference` | `shared` |
| contentBlock | `ch01-t04-block-misconception` | `misconception` | `instructor` |
| contentBlock | `ch01-t04-block-review` | `reviewQuestion` | `student` |
| problem | `ch01-prob-104` | — | (governed by `blocking`, not `visibility`) |

Both files use only the three authorized record types (`instructorScript`, `contentBlock`, `problem`) and only established `blockType` values already used by the four pilot topics (`mainIdea`, `organizedExplanation`, `equationSet`, `visualReference`, `misconception`, `reviewQuestion`). No new record type or `blockType` was invented. Record counts differ from the four pilot topics' typical 7–9-record shape only in that `ch01-t01` has no `problem`/`example` record — a deliberate, evidence-justified omission, not an oversight (§13).

## 7. Identifier inventory

All IDs were checked against `IDENTIFIER_REGISTRY.json`'s namespace patterns and against every existing ID already used in the four pilot topic files (`instructorScriptId`, `blockId`, `problemId` conventions were derived directly from those files — see §II below). **`IDENTIFIER_REGISTRY.json` was not modified.** The following are proposed new identifiers, recorded here for later controlled registration:

| New ID | Pattern followed | Matches existing convention |
|---|---|---|
| `ch01-is-101` | `^ch01-is-[0-9]{3}$` | Yes — mirrors `ch01-is-102`/`103`/`108`/`110` (topic-number-encoded) |
| `ch01-is-104` | `^ch01-is-[0-9]{3}$` | Yes |
| `ch01-t01-block-mainidea`, `-explanation`, `-equations`, `-visual`, `-misconception`, `-review` | `ch01-t0X-block-<name>` (informal `blockId` convention; schema has no fixed pattern for `blockId`) | Yes — exact naming convention used by all four pilot files |
| `ch01-t04-block-mainidea`, `-explanation`, `-equations`, `-visual`, `-misconception`, `-review` | same | Yes |
| `ch01-prob-104` | `^ch01-prob-[0-9]{3}$` | Yes — mirrors `ch01-prob-102`/`103`/`108`/`110` |
| `ch01-t01-visual-001`, `ch01-t04-visual-001` (used only inside `visualGovernance`/`visualReferenceIds`, `availabilityStatus: "missing"` — no asset exists) | `ch01-tXX-visual-NNN` (the pilot files' own asset-ID convention) | Matches the four pilot files' own `visualGovernance[].visualId` convention exactly; note this convention does not itself match any `IDENTIFIER_REGISTRY.json` namespace pattern (`^V[0-9]{2}$`, `^ch01-vis-[0-9]{3}$`, etc.) — this is a pre-existing gap in the four pilot files too, not newly introduced here. |
| `SRC-CH01-BATCH1-ORIGINAL` (used only as `sourceVariant.sourceId` for the wholly original problem, `sourceVariant.sourceId` has no pattern constraint in the schema) | Mirrors the pilot precedent's `SRC-CH01-PILOT-ORIGINAL` marker (used identically in `ch01-prob-103`'s `sourceVariants`), renamed to `BATCH1` rather than `PILOT` to avoid implying pilot status | New marker value, consistent in kind with existing precedent |

Every source, scientific-audit, correction, and conflict ID actually cited in either file (`SEG009`, `SEG010`, `S2-SEG026`, `S3-P002`, `S3-P003`, `SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`, `ch01-corr-001`, `CD-CONF-001`; `SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`, `SCA02`, `SCA03`, `S5-SCI-012`, `K1-SCI-010`, `ch01-corr-002`, `CD-CONF-002`) is a pre-existing, already-registered identifier — none was invented. No `S3C-Q001`/`R1-Q001`/`S3C-Q003`/`S3C-Q004`/`R1-Q003`/`R1-Q004` identifiers were cited as `provenanceLinks` (they informed scope understanding only, per rights-safety — see §19), so they do not appear as record-level citations, only in this report's evidence review (§4–§5).

## 8. `ch01-corr-001` application

Applied to `ch01-t01-block-mainidea` and `ch01-t01-block-explanation` (both tag `scientificCorrectionIds: ["ch01-corr-001"]`, `conflictRecordIds: ["CD-CONF-001"]`), and referenced chapter-wide across all six `ch01-t01` contentBlocks plus the instructorScript's `scientificCorrectionReferences`, matching the exact per-topic lineage-citation convention already used by the four pilot topics for their own approved corrections (e.g. `ch01-corr-006` cited on every `ch01-t03` block). The corrected scientific meaning — "distance, time, and mass are the fundamental quantities emphasized in this chapter's mechanics treatment; charge is another fundamental property used later" — is preserved and expanded, not altered. `S2-SEG026` is used as primary supporting evidence (cited first in `sourceTraceability`/`provenanceLinks`, and its scope-and-deferral framing is the direct basis for the mainIdea block's wording). `SEG004` was not restored anywhere. No independent scientific-review approval is claimed — every block's governance metadata states this is a project-owner editorial approval basis only.

## 9. `ch01-corr-002` application and qualification

Applied to `ch01-t04-block-mainidea`, `-explanation`, `-equations`, `-misconception`, `-review`, and `ch01-prob-104` (all tag `scientificCorrectionIds: ["ch01-corr-002"]`, `conflictRecordIds: ["CD-CONF-002"]`). `SEG021` and `SEG022` are used as primary evidence, listed first in `sourceTraceability`/`provenanceLinks` for the mainIdea and explanation blocks. The approved qualification — *"Apparent weight" is scientifically valid, project-authored interpretive terminology and must not be represented as verbatim wording from the cited source material* — is stated explicitly, in plain prose, inside `ch01-t04-block-explanation`'s own learner-visible text (not only in governance metadata), and reinforced in the instructorScript's `instructorOnlyCautions`. No source citation ever claims "apparent weight" is a quotation. `SEG017`, `SEG018`, and `S5-P033` were not restored anywhere. No independent scientific-review approval is claimed.

## 10. English-content summary

Both topics' learner-visible prose (`mainIdea`, `organizedExplanation`, `equationSet`, `reviewQuestion`) is newly authored, distinct in wording, sentence structure, and (for `ch01-t04`) example object from every audited source. `ch01-t01` establishes the fundamental/derived-quantity distinction and the corrected scope statement, using speed as the one derived-quantity example (matching the audited sources' own chosen illustration, reworded originally). `ch01-t04` establishes mass-as-inertia, gravitational weight, and apparent weight, using an original medical-equipment-cart scenario (not the audited sources' suitcase) for its worked contrast and problem. Each topic has one `instructor`-visibility `misconception` block and one `student`-visibility `reviewQuestion` block, keeping the definition/explanation/equation/misconception/review distinction clearly separated by record, matching the four pilot topics' own structure.

## 11. Equation and notation review

**`ch01-t01-block-equations`:** `v = d / t` (speed = distance ÷ time). Symbols defined: `v` = speed (scalar, magnitude only — explicitly distinguished from the later, vector "velocity" concept, which is out of this topic's scope). `d` = distance (scalar length, m). `t` = time (s). Units: m/s, built directly from `d`'s and `t`'s own units — no independent "speed unit." Condition of validity stated: this is the average-speed relationship over a distance/time interval. Latin symbols, upright SI units — consistent with `VISUAL_HOUSE_STYLE.md`'s established convention (italic variables, upright units) for whenever this equation is eventually isolated into an LTR span for Arabic rendering.

**`ch01-t04-block-equations`:** `W = mg`. Symbols defined: `W` = magnitude of gravitational weight (force, N). `m` = mass (kg, scalar, location-independent). `g` = magnitude of local gravitational acceleration (≈ 9.8 m/s² at Earth's surface — reusing, not re-deriving, the exact value already established by the approved `ch01-corr-007` for `ch01-t08`, for cross-topic numeric consistency). Scalar/vector and magnitude/signed distinctions stated explicitly: mass is scalar; weight is a force with a direction (toward the source of gravitational attraction) but only its magnitude is used in this topic's equation and problem — no sign convention is introduced, since that is `ch01-t08`'s established territory, not duplicated here. Dimensional consistency: kg × m/s² = N, stated implicitly through consistent unit use in the worked problem. No equation was added merely because it is commonly associated with the general subject — both equations are the minimum needed to support this topic's own worked example/problem, and both are directly supported by the audited evidence (`S3-P003`'s own `L/T` example for speed; `S3C-Q004`'s own use of `W = mg`).

## 12. Worked examples created and verified

No separate `example` blockType record was created for either topic — the illustrative worked material for `ch01-t01` (speed = distance/time) is folded into `equationSet`, and for `ch01-t04` the fuller worked illustration is the `problem` record (`ch01-prob-104`), consistent with "do not force a section when the evidence does not support a separate one." `ch01-prob-104`'s calculation was independently recomputed during validation: `45 kg × 9.8 m/s² = 441 N` (confirmed by an independent Python recomputation, not merely re-stated). The problem is solvable using only content already introduced in `ch01-t04-block-equations` (`W = mg`), states given values and the required quantity explicitly, shows a two-part logical sequence (numeric part (a), qualitative part (b)), includes units at every stage, and includes an interpretation. It does not adapt any source example — it uses a different object (medical equipment cart, not a suitcase), different numbers, and an original two-part structure not present in any single audited source item.

## 13. Original problems and solutions

**`ch01-t04`:** one original problem, `ch01-prob-104`, described in §12. `sourceAnswer` is honestly represented as `{textRef: null, value: null, unit: null, direction: null, status: "unknown"}` (no source answer exists to preserve, since this is wholly original) and `correctedAnswer.status` is `"proposed"` (matching the pilot precedent's own value for a freshly authored, not-yet-reviewed problem). `sourceVariants` uses the marker `sourceId: "SRC-CH01-BATCH1-ORIGINAL"` (§7), mirroring the exact precedent already established by `ch01-prob-103`'s `"SRC-CH01-PILOT-ORIGINAL"` marker for a wholly original pilot problem.

**`ch01-t01`:** **no problem record was created.** Justification: `docs/content-audits/chapter-01/sources/source-conv-005/topic-mapping.json` records zero problems mapped to `ch01-t01` (`"problemCount": 0, "coverage": "absent-as-primary-problem-topic"`), and `ch01-t01`'s subject matter (a conceptual/definitional distinction between fundamental and derived quantities) does not lend itself to a numeric problem without either duplicating `ch01-t02`'s unit-conversion territory or inventing an application the audited evidence does not support. Forcing a numeric problem here would risk exactly the "trivial number substitution without conceptual value" and "unsupported application beyond the audited scope" outcomes this task explicitly prohibits. This is a deliberate, evidence-grounded omission, not an incomplete draft.

## 14. Review Card and instructor-only records

Both topics use the existing canonical `blockType: "reviewQuestion"` — the schema field and blockType name were not renamed or altered (the "Review Card" application-facing label from the pilot's own precedent is an application-layer concern, not touched by this draft, which contains no application code). Each `reviewQuestion` record stores one self-contained authored item (question + answer + brief explanation together, in the same single-field structure already established by the four pilot topics — no heuristic question/answer split was introduced, and no hidden-answer behavior was created). `ch01-t01-block-review` is an original explanation-based item (distinct in form from the audited sources' multiple-choice items) testing the scope-qualifier misconception directly. `ch01-t04-block-review` is an original short-explanation item testing the mass/weight-unit distinction, ending with a small `W = mg` reinforcement calculation.

Both topics also carry one `visibility: "instructor"` `misconception` block, correctly excluded from any learner-visible field, each traceable to specific scientific-audit findings: `ch01-t01-block-misconception` to `SCA01`/`S3-SCI-001`/`S3C-SCI-001`/`R1-SCI-001`/`K1-SCI-004`; `ch01-t04-block-misconception` to `SCA02`/`SCA03`/`K1-SCI-010`. Neither misconception was fabricated to satisfy a template — both are exactly the misconceptions the approved corrections were written to resolve.

## 15. Instructor-only records

Both `instructorScript` records (`ch01-is-101`, `ch01-is-104`) are internal teaching-support records: instructional purpose, concept sequence, teaching emphasis, anticipated student difficulty, suggested explanation order, and a small number of learning objectives directly grounded in the topic's own source framing (e.g. `SEG006`'s "What can we measure?" outline framing for `ch01-t01`). Neither contains Arabic content (the field was omitted entirely — see §7 of `PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md`, and independently re-confirmed as absent from both JSON files during validation). Neither claims the content is approved — both carry `blocking.blockingStatus: "blocked"`, `studentFacingAllowed: false`. Neither broadens topic scope beyond what §3 establishes. **Confirmed per the task's explicit instruction:** `instructorScript` has no `visibility` field constraint that fits this record cleanly the way `contentBlock.visibility` does under schemaVersion 2.3.0's `$defs.instructorScript` — the schema defines `"visibility": {"const": "instructor"}` as an *optional* property (not in the `required` array), and neither pilot-file precedent nor this draft populates it; internal/instructor-only status for `instructorScript` records is instead conveyed entirely through `blocking.instructorFacingAllowed: true` / `blocking.studentFacingAllowed: false`. This established schema behavior is preserved unchanged, not altered, by this draft.

## 16. Arabic missing-state inventory

Every `contentBlock` and the one `problem` record in both files (13 records total: 6 `ch01-t01` contentBlocks, 6 `ch01-t04` contentBlocks, 1 `ch01-t04` problem) carries the authorized missing-state representation: `arabic.translationStatus: "missing"`, `arabic.originalArabicText.text: null`, `arabic.originalArabicText.status: "missing"`, `arabic.canonicalArabicTranslation.text: null`, `arabic.canonicalArabicTranslation.status: "missing"`, `arabic.translationReviewer: null`, `arabic.terminologyApprovalStatus: "notStarted"`. Independently re-verified by script immediately after generation — every one of these 13 records passed. The two `instructorScript` records (`ch01-is-101`, `ch01-is-104`) omit the optional `arabic` field entirely, per the authorization record's determination that this field is not required for `instructorScript` under the schema. No `localizedContent.ar` key exists anywhere in either file (English-only by construction, not by silent omission — the top-level `arabic` field is the single, explicit source of truth for each record's untranslated status). No Arabic placeholder, machine translation, or English-copied-into-Arabic value exists anywhere in either file.

## 17. Visual requirements identified

Two visual-planning records were created, one per topic, both `blockType: "visualReference"` with `visualGovernance[].availabilityStatus: "missing"` (the schema's own defined term for "no asset exists") — no SVG, PNG, JPG, diagram, traced figure, or visual-validation file was created anywhere. Each record's `localizedContent.en.text` explicitly states, in plain prose: the visual has **not been produced**, has **not been reviewed**, is **not student-facing**, and that **separate visual-production authorization is required**. `ch01-t01-block-visual` specifies a four-quantity (L/T/M + charge) diagram with one derived-quantity (speed) example, extending `V02`'s recorded purpose to reflect the approved correction's charge-deferral point. `ch01-t04-block-visual` specifies a push-vs-lift-vs-scale three-panel contrast, deliberately using a different example object (equipment cart) than `V09`'s suitcase, plus an apparent-weight scale panel not present in the audited sources. No publisher-derived composition was invented — both specifications explicitly require any eventually-produced asset to be entirely original artwork. Both records' `visualGovernance` blocks were kept strictly to the schema's declared `$defs.visualGovernance` properties (`visualId`, `availabilityStatus`, `linkageConfidence`, `linkageType`, `rightsStatus`, `visualResolutionId`) — the extra, undeclared fields (`assetPath`, `assetFormat`, `assetStatus`, `reviewRequired`) informally used in the four pilot files' own `visualGovernance` blocks were deliberately **not** replicated here, since they violate that `$def`'s `additionalProperties: false` constraint (a pre-existing schema-conformance gap already noted in `PHSH111_CHAPTER1_EXPANSION_PLAN.md` §7, not introduced by this task).

## 18. Source-lineage validation

Every `provenanceLinks`/`sourceTraceability` entry in both files was checked against the independently re-verified evidence sets from `PHSH111_BATCH1_CORRECTION_CITATION_REPAIR.md`: only `SEG009`, `SEG010`, `S2-SEG026`, `S3-P002`, `S3-P003` (for `ch01-t01`) and `SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058` (for `ch01-t04`) appear as cited locators — every one independently confirmed to map to its stated topic in `topic-mapping.json`/`raw-sources/source-001-segments.json`. No removed-during-repair ID (`SEG004`, `SEG017`, `SEG018`, `S5-P033`) was reintroduced. No source was cited merely because its content is generally related — e.g. `S3C-Q001`/`R1-Q001`/`S3C-Q003`/`S3C-Q004`/`R1-Q003`/`R1-Q004` all informed scope understanding (§4–§5) but were deliberately **not** cited as `provenanceLinks`, since reproducing or closely echoing their specific wording was avoided by design (§19) and their role was scope-informing, not wording-source. `sourceId` values all match the `^SRC-CH01-[A-Z0-9-]+$` pattern; `locatorType`/`confidence`/`rightsStatus` values all validated against the schema's declared enums (script-checked, §20).

## 19. Rights-safety review

Every substantive learner-visible or instructor-facing text block was checked, after drafting, against the specific audited source passages that informed it, using a targeted phrase-overlap search across both generated files for distinctive multi-word source phrases (e.g. *"the more difficult it is to speed up or slow down"*, *"We are not talking about gravity"*, *"postpone our treatment of charge until Chapter 7"*, *"when you try to lift a heavy suitcase"*, *"note the unfamiliar unit, the slug"*, and the exact stems of `S3C-Q001`/`R1-Q001`/`S3C-Q004`/`R1-Q004`/`S3C-Q003`/`R1-Q003`). One incidental match was found and corrected during this process (a governance-metadata field, not learner-visible content, briefly quoted a six-word source phrase for internal identification purposes — reworded to remove the quotation). A second, final pass after the fix found zero remaining matches.

**Classification of every record: newly authored and clear.** No record required rewording for source similarity beyond the one correction above, and no record is classified as blocked pending rights review. `ch01-t04-block-visual` and `ch01-prob-104` were given specific attention as the two highest-similarity-risk records (both closely parallel an audited source scenario in concept) and were deliberately built around a different example object, different numbers, and — for the visual — an additional panel (apparent weight/scale) the audited sources do not depict, to ensure genuine originality rather than superficial variation. This rights-safety review is Claude's own self-review under project-owner authorization, consistent with every other review in this project's history — it is not, and is not represented as, independent human legal or editorial review.

## 20. JSON/schema validation

Both files: parsed successfully as JSON. `schemaVersion: "2.3.0"` confirmed on both. A full structural validator (independently written for this task, checking every `required` field, enum value, and pattern declared in `CANONICAL_DESIGN_SCHEMA.json`'s `$defs` for `instructorScript`, `contentBlock`, `problem`, `localizedText`, `arabicSeparation`, `duplicateHandling`, `blockingWorkflow`, `provenanceLink`, and `visualGovernance`) was run against both files. Checked: required top-level fields; allowed `recordType` values (only `instructorScript`/`contentBlock`/`problem` used); allowed `blockType` values (only the six already-established types listed in §6); `visibility` enum values; every governance field (`blocking.studentFacingAllowed: false` on all 13 relevant records; `resolutionStatus` valid); topic-ID pattern and topic-ID-matches-file consistency; record-ID uniqueness (within each file and across both files — confirmed unique); every cited source/audit/correction/conflict ID resolved against the independently re-verified evidence sets (§18); every internal reference (`figureCues.visualIds`, `visualReferenceIds`) points to an ID actually declared in the same record's own `visualGovernance`; English localization fields fully populated; Arabic missing-state representation validated on all 13 applicable records (§16); `problem` structure fully validated including `sourceVariants` (≥1 item, confirmed); solution steps validated; equation consistency checked; **no `visualGovernance.availabilityStatus` anywhere claims `"available"`** — both are explicitly `"missing"`, so no visual asset path points to a nonexistent produced asset. **Result: zero errors.** The independent recomputation of `ch01-prob-104`'s calculation (`45 × 9.8`) matched the stated result exactly (`441.000...`, matching the recorded `441.0 N`). No validation error was silently repaired — none was found requiring repair; the one drafting-level issue found (§19's incidental phrase overlap) was a rights-safety fix, not a schema-validation fix, and was made directly since it was a pure drafting defect within these two new files, not a governance/schema/correction/glossary/source-audit decision.

## 21. New conflicts or diagnostics

**None.** No new scientific ambiguity or conflict was discovered during drafting for either topic. Both approved corrections (`ch01-corr-001`, `ch01-corr-002`) fully covered the scope drafted here; no record was stopped mid-draft, and no new correction record was created.

## 22. Deferred work

- Arabic translation for all 13 applicable records (gated on a separate Arabic-generation authorization, and — for `ch01-t04` specifically — on `ch01-term-mass`/`ch01-term-weight`/`ch01-term-apparent-weight` completing terminology review from their current `pending` status).
- Visual production for `ch01-t01-visual-001` and `ch01-t04-visual-001` (gated on a separate visual-production authorization).
- A `ch01-t01` problem record, if a future evidence-gathering pass (beyond what was audited for this batch) ever establishes a legitimate numeric application for this conceptual topic — not created here, and not recommended to be forced.
- Registration of the proposed identifiers in §7 into `IDENTIFIER_REGISTRY.json`, which this task deliberately left unmodified.
- `contentLeakTestStatus: "notRun"` on every contentBlock — the actual automated content-leak test (part of the application's adapter/test suite) was not run against these files, since they are outside `apps/chapter1-mvp/`'s read path; running it would require either a temporary test harness or extending the application's own test suite, neither of which was authorized or performed here.

## 23. English baseline status

**Not approved, unchanged.** These two files are drafts only. A future baseline-approval action, mirroring `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s existing pattern (a `baselineVersion`, `status: "approved"`, per-topic `perTopicDecision`, `revisionControlPolicy.revisionLog`), is required before either draft could be treated as approved source text for anything downstream. `ENGLISH_PILOT_BASELINE_APPROVAL.json` itself was not read as part of this task's modification scope and was not touched.

## 24. Arabic status

**Not generated, unauthorized.** See §16 for the full missing-state inventory. `ch01-corr-001.correctedWording.ar` and `ch01-corr-002.correctedWording.ar` remain `null` in `SCIENTIFIC_CORRECTIONS.json` (not modified by this task).

## 25. Visual status

**Not produced, unauthorized.** See §17. Two textual visual-requirement specifications exist as planning metadata only; zero image assets of any kind were created.

## 26. Application-expansion status

**Not authorized, not performed.** No file was created or modified under `apps/chapter1-mvp/`. No route, registry entry, or import references either topic. `PILOT_AUTHORIZATION.json`'s `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics, unchanged and unread-for-modification by this task.

## 27. Independent-review status

No independent human subject-matter (physics) review has occurred on either draft, and none is claimed. Both files' governance metadata (via the applied corrections' own `approvals.scientificReviewer: null`, referenced throughout) and this report both state plainly that this is Claude's own drafting and self-review work under project-owner authorization — consistent with every prior stage of this Batch 1 process.

## 28. Publication status

**Unauthorized, unaffected.** `studentFacingAllowed: false` is set on every `blocking` object in both files (13 of 13 applicable records, script-verified). Nothing in this task changes, sets, or proposes changing `studentFacingAllowed` or `studentPublicationAuthorized` anywhere in the repository's governance records.

## 29. Exact recommended next controlled task

Per this task's own scope boundary (§23 of the parent request: *"A later review task will decide whether current-state documentation should be synchronized"*), the immediate next step is a **documentation-synchronization review** — deciding whether `PHSH111_APP_HANDOFF.md`, `PHSH111_INTERNAL_PILOT_CHECKPOINT.md`, and `PHSH111_CHAPTER1_EXPANSION_PLAN.md` should be updated to reflect that Batch 1 drafts now exist (this generation task deliberately did not touch any of them, per its own explicit constraint). Following that, in sequence: an English-content **review pass** (checking scientific accuracy, pedagogical quality, and rights-safety independently of this generation task) → English **baseline approval** (§23) → a separate **Arabic-generation authorization** and the associated glossary-terminology-review pass for `ch01-t04`'s three pending terms → a separate **visual-production authorization** for `ch01-t01-visual-001`/`ch01-t04-visual-001`. None of these was performed here.
