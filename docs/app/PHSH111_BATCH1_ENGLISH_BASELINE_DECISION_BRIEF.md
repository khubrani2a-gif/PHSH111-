# PHSH111 Batch 1 — English Baseline-Approval Decision Brief

**Prepared:** 2026-07-16. **This is a read-only advisory decision brief.** No draft was modified. No baseline approval was granted. No identifier was registered. No Arabic or visual content was generated. No application expansion occurred. No independent human expert approval occurred. Publication remains unauthorized.

## 1. Purpose and limits

This document gives the project owner everything needed to decide whether to grant an **English baseline approval** for Batch 1 (`ch01-t01`, `ch01-t04`), following the drafting, review, revision, and closure sequence already completed for these two topics. It independently re-verifies the final current state of both draft files — not merely restating prior reports — and recommends, but does not perform, an approval, a packaging approach, and an identifier-registration timing decision. Nothing in this brief authorizes Arabic content, visual production, application integration, or student-facing publication.

## 2. Current authorization and governance state

Independently re-confirmed at the start of this task:

- `PILOT_AUTHORIZATION.json`: `authorizationVersion: "1.2.0"`. `batch1DraftingAuthorization.applicableTopicIds`: exactly `["ch01-t01","ch01-t04"]`. The original four-topic `scope.authorizedTopicIds` and `applicationBuildAuthorization.applicableTopicIds` remain exactly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]`, unchanged.
- `PILOT_READINESS.json`: `pilotReadinessVersion: "1.5.0"`. Chapter-wide `canonicalGenerationAuthorized: false` (unchanged). `batch1DraftingReadiness`: both topics `englishDraftingAuthorized: true`; `arabicGenerationAuthorized`, `visualProductionAuthorized`, `applicationExpansionAuthorized`, `englishBaselineApproved`, `canonicalStudentPublicationAuthorized`, `independentExpertReviewCompleted` all still `false`.
- `SCIENTIFIC_CORRECTIONS.json`: `ch01-corr-001.approvalStatus: "editoriallyApproved"`; `ch01-corr-002.approvalStatus: "editoriallyApproved"` (with its qualification recorded in `approvals.approvalBasis`). Both `approvals.scientificReviewer: null`.
- **No English baseline approval currently exists for either topic.** `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s `scope.approvedTopicIds` remains exactly the four pilot topics; it makes no mention of `ch01-t01`/`ch01-t04` anywhere, confirmed by direct re-inspection (file `mtime` predates every Batch 1 task in this sequence, confirming it was never touched).
- `BILINGUAL_GLOSSARY.json`'s three `ch01-t04`-relevant terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`) remain `approvalStatus: "pending"`.
- `apps/chapter1-mvp/vite.config.ts`'s `server.fs.allow` and `src/content/rawImports.ts`'s hardcoded import list remain scoped to `docs/content-design/chapter-01/pilot/` only — `docs/content-design/chapter-01/batch1-drafts/` is not currently reachable by the running application at all, confirmed by direct inspection of both files.

## 3. Files and checksums reviewed

| File | SHA-256 |
|---|---|
| `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` | `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9` |
| `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` | `c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b` |

(The `ch01-t04` checksum reflects the `roundedResult` removal applied in `PHSH111_BATCH1_T04_SCHEMA_CLOSURE_REPORT.md` — the current, final state.) Both re-verified identical at the end of this task (§ final validation).

## 4. Schema and file-integrity results

Independently re-derived for this task (not copied from prior reports):

| Check | ch01-t01 | ch01-t04 |
|---|---|---|
| Valid JSON | Pass | Pass |
| `schemaVersion: "2.3.0"` | Pass | Pass |
| `topicId` correct | `ch01-t01` | `ch01-t04` |
| Record count | 7 | 8 |
| Record IDs unique | Pass | Pass |
| Record types/blockTypes permitted | Pass — `instructorScript` + `contentBlock` (`mainIdea`, `organizedExplanation`, `equationSet`, `visualReference`, `misconception`, `reviewQuestion`) | Pass — same six blockTypes + one `problem` |
| Record order | `instructorScript` → `mainIdea` → `organizedExplanation` → `equationSet` → `visualReference` → `misconception` → `reviewQuestion` (matches pilot order, minus the pilot's `example` slot, deliberately) | Same, + `problem` last (matches pilot order exactly) |
| Visibility values valid | Pass (`shared` ×4, `instructor` ×1, `student` ×1) | Pass (`shared` ×4, `instructor` ×1, `student` ×1, problem governed by `blocking` not `visibility`) |
| Governance/`blocking` fields complete | Pass, 7/7 | Pass, 8/8 |
| All records `draft`/`blocked` | Pass — `blockingStatus: "blocked"` on 7/7 | Pass — 8/8 |
| `studentFacingAllowed: false` | Pass, 7/7 | Pass, 8/8 |
| Arabic remains `"missing"` | Pass, 6/6 applicable | Pass, 7/7 applicable (6 contentBlocks + 1 problem) |
| No visual asset represented as produced | Pass — `visualGovernance[0].availabilityStatus: "missing"` | Pass, same |
| No unsupported additional field remains | Pass — full-file search confirms `roundedResult` does not appear anywhere in either file | Pass |
| No baseline approval currently exists | Confirmed (§2) | Confirmed |

No defect was found in this pass. Nothing was repaired (nothing required repair).

## 5. Prior-finding closure table

| Prior finding | Affected record | Current status | Evidence of closure | Remaining concern |
|---|---|---|---|---|
| `L`/`T`/`M` dimensional symbols not reconciled with `d`/`t` equation variables | `ch01-t01-block-equations` | **Closed** | Current text states "distance has dimension L and time has dimension T... so speed... has dimension L/T" and "d and t are the specific measured-variable symbols... distinct from the dimensional symbols L and T" | None |
| `ch01-prob-104` significant-figure inconsistency (`441` displayed as final answer despite `significantFigures: 2`) | `ch01-prob-104` (multiple fields) | **Closed** | Every final-answer field now reads "4.4 x 10^2 N"; `441 N` retained only as an explicitly labeled unrounded intermediate in three places | None |
| `calculation[0].roundedResult` — unmodeled schema extension | `ch01-prob-104` | **Closed** | Field removed; its content folded into the existing `roundingRule` string, which now explicitly states both the unrounded (`441 N`) and rounded (`4.4 x 10^2 N`) values and the reason | None |
| (Optional, never required) "distance" vs. "distance traveled" precision nit | `ch01-t01-block-equations` | **Open, non-blocking** | Not addressed — was explicitly optional in the original review (§24), never escalated to required | Carries forward as a non-blocking editorial note (§9) |
| (Optional, never required) "ordinary situation" vs. explicit "no acceleration" phrasing | `ch01-t04-block-explanation` | **Open, non-blocking** | Not addressed — optional in the original review (§24); the precise condition is already stated correctly in `ch01-prob-104`'s own `equationSelection.conditionsSatisfied` | Carries forward as a non-blocking editorial note (§13) |
| (Optional, never required) `ch01-term-mass` missing from `ch01-t04-block-equations`'s `glossaryTermIds` | `ch01-t04-block-equations` | **Open, non-blocking** | Not addressed — explicitly optional | Carries forward as a non-blocking note (§13) |
| `SRC-CH01-PILOT-ORIGINAL`/`SRC-CH01-BATCH1-ORIGINAL` registry gap | Governance-level, not a specific record | **Open, flagged for a timing decision** | Confirmed still unregistered in `IDENTIFIER_REGISTRY.json` | See §14 |

All three **required** revisions identified across the review sequence are closed. All remaining items are pre-existing, explicitly optional, non-blocking notes, carried forward transparently rather than silently dropped.

## 6. `ch01-t01` final scientific review

| Area | Classification | Note |
|---|---|---|
| Definitions (fundamental vs. derived quantity) | No issue | Accurate, scoped correctly to this chapter's mechanics content |
| Dimensional analysis (`L`, `T`, speed = `L/T`) | No issue | Now explicit and correctly reconciled with the equation's working variables |
| Average-speed equation (`v = d/t`) | No issue | Explicitly and correctly identified as average speed over the specified interval |
| Symbol definitions | No issue | `v`, `d`, `t`, `L`, `T`, `M` all defined once, consistently, no redefinition conflict |
| Scalar/vector distinction | No issue | `v` explicitly scalar; velocity/vectors explicitly and correctly deferred to a later topic |
| Distance/displacement distinction | No issue | Displacement is never introduced or conflated — correct restraint for this topic's scope |
| Units | No issue | `m`, `s`, `m/s` correct and consistently built as a combined unit |
| Review-card reasoning | No issue | Original, self-contained, correctly targets the scope-qualifier point |
| Misconception correction | No issue | Accurately stated, directly evidence-supported (`SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`) |
| Consistency with `ch01-corr-001` | No issue | Approved corrected meaning preserved in `mainIdea`/`explanation`, unaltered by any later revision |

**No "revision required" or "scientific decision required" item remains for `ch01-t01`.**

## 7. `ch01-t01` pedagogical/editorial review

- **Conceptual sequence:** logical (main idea → explanation → equation → misconception → review).
- **Learner readability:** high; short-to-medium sentences, no unexplained jump.
- **Introductory PHSH111 suitability:** appropriate; no content beyond a first-topic scope.
- **Terminology consistency:** consistent, including the now-resolved `L`/`T` vs. `d`/`t` relationship.
- **Sentence density:** the equation block is now the longest single paragraph in the file (as a direct, intended consequence of the notation-bridge revision) but remains readable as one coherent paragraph, not fragmented.
- **Grammar/punctuation:** no defect found.
- **Section purpose:** every blockType is used consistent with its established meaning.
- **Instructor-script usefulness:** clear purpose, appropriately paced (8-minute estimate), evidence-supported objectives, no copied source phrasing (independently re-checked against `SEG009`/`SEG010`).
- **Review Card quality:** original, self-contained, coherent as one authored record, no hidden dependency.
- **Misconception treatment:** accurate, clearly correctable, correctly `instructor`-only.
- **Alignment between explanation/equation/assessment:** all three blocks test and reinforce the same scope-qualifier concept without contradiction.
- **Redundancy/incompleteness:** `mainIdea`/`organizedExplanation` overlap substantially — an accepted, already-precedented pattern (the pilot topics carry the identical characteristic, e.g. `ch01-t02`'s own recorded non-blocking note), not a defect requiring a fix.

**Omission of a `problem` record for `ch01-t01` remains justified.** Re-confirmed: `docs/content-audits/chapter-01/sources/source-conv-005/topic-mapping.json` still shows zero problems mapped to `ch01-t01`; the topic's conceptual/definitional character does not lend itself to a numeric problem without either duplicating `ch01-t02`'s territory or inventing unsupported scope. This omission is evidence-grounded, not a gap.

## 8. `ch01-t01` source-lineage and rights review

- Every cited `locatorId` (`SEG009`, `SEG010`, `S2-SEG026`, `S3-P002`, `S3-P003`) independently re-confirmed to exist and map to `ch01-t01` in `topic-mapping.json`/`raw-sources/source-001-segments.json`.
- Every cited scientific-audit ID (`SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`) independently re-confirmed to exist.
- `scientificCorrectionIds`/`conflictRecordIds` are `["ch01-corr-001"]`/`["CD-CONF-001"]` on every content record — consistent, not over- or under-attached, matching the exact per-topic lineage-citation convention already established by the four pilot topics for their own approved corrections.
- `SEG004` (the citation-repair task's removed miscitation) remains absent — confirmed by full-file search, zero occurrences.
- `ch01-corr-001`'s repaired evidence set (`S2-SEG026` primary, plus `SEG009`, `SEG010`, `S3-P003`, `S3C-Q001`, `R1-Q001`, `K1-SCI-004`) remains intact in `SCIENTIFIC_CORRECTIONS.json`, unchanged by this or any later task.
- **`ch01-corr-001` is applied accurately** — the corrected scope-and-deferral meaning is preserved in full.

**Rights-safety, record by record:**

| Record | Classification |
|---|---|
| `ch01-is-101` | Clear — newly authored, independently re-checked against `SEG009`/`SEG010` |
| `ch01-t01-block-mainidea` | Clear |
| `ch01-t01-block-explanation` | Clear — including the newly added notation-bridge sentences |
| `ch01-t01-block-equations` | Clear |
| `ch01-t01-block-visual` | Clear — explicitly non-derivative planning metadata only |
| `ch01-t01-block-misconception` | Clear |
| `ch01-t01-block-review` | Clear — original, structurally distinct from the audited sources' multiple-choice items |

No record for `ch01-t01` is classified "revise before approval" or "blocked pending rights review."

## 9. `ch01-t01` recommendation

**Approve English baseline with documented (non-blocking) conditions.**

- **Confidence:** High.
- **Scientific basis:** no open scientific issue (§6).
- **Editorial basis:** no open editorial defect; one non-blocking optional note carried forward (below).
- **Source-lineage basis:** fully intact and independently re-verified (§8).
- **Rights-safety basis:** every record clear (§8).
- **Conditions (non-blocking, informational, do not gate approval):** (1) "distance" could optionally be tightened to "distance traveled" in `ch01-t01-block-equations` for maximal precision — carried forward from the original review, never required; (2) an optional bare numeric illustration of `v = d/t` was suggested but never required.
- **Records affected by any remaining issue:** `ch01-t01-block-equations` (optional note only).
- **Is project-owner approval sufficient for this internal baseline stage?** Yes — consistent with the exact precedent already used for `ch01-corr-006`–`009` and the pilot's own English/Arabic baseline approvals, all approved via project-owner review of Claude's completed work, not independent third-party review.
- **Is independent expert review still required before student publication?** Yes, unchanged — nothing about baseline approval satisfies or substitutes for that separate, still-outstanding requirement.

## 10. `ch01-t04` final scientific review

| Area | Classification | Note |
|---|---|---|
| Mass (definition) | No issue | Correctly operationalized as inertia; "amount of matter" correctly demoted to introductory-only intuition |
| Gravitational weight | No issue | Correctly presented as a force, correctly distinguished from mass throughout |
| `W = mg` | No issue | Mathematically correct, consistently applied |
| Value/role of `g` | No issue | `|g| ≈ 9.8 m/s²`, explicitly reused from the already-approved `ch01-corr-007` value for cross-topic consistency |
| Magnitude vs. direction | No issue | Magnitude-only equation, direction stated in words only, no sign-convention content duplicated from `ch01-t08` |
| Apparent-weight terminology | No issue | Consistently and correctly used as the scale/support-force reading |
| Scale-reading interpretation | No issue | Correctly stated to equal gravitational weight only in an unaccelerated/resting situation |
| Problem calculation and assumptions | No issue | `45 kg × 9.8 m/s² = 441 N` independently reconfirmed; "at rest, no acceleration beyond gravity" condition explicit in `equationSelection.conditionsSatisfied` |
| Significant figures | No issue (previously "revision required," now closed) | Final answer `4.4 x 10^2 N` correctly reflects 2 significant figures; independently reconfirmed `440` is the correct rounding of `441` |
| Consistency with `ch01-corr-002` and its qualification | No issue | Both the corrected meaning and the "apparent weight is project-authored, not verbatim" qualification are stated explicitly in learner-visible prose, not only in governance metadata |

**No "revision required" or "scientific decision required" item remains for `ch01-t04`.**

## 11. `ch01-t04` pedagogical/editorial review

- **Conceptual sequence:** logical (mass → weight → apparent weight → review/problem), gradual introduction of three related-but-distinct ideas.
- **Learner readability:** high; the explanation block is the longest single block in either file but remains readable as one coherent unit.
- **Introductory PHSH111 suitability:** appropriate; accelerating-frame/elevator-style apparent-weight extensions are explicitly and correctly kept out of scope.
- **Terminology consistency:** "gravitational weight" and "apparent weight" used as fixed, distinguishing terms throughout, never collapsed to ambiguous "weight" alone where the distinction matters.
- **Sentence density:** appropriate; the significant-figure revision added one additional explanatory sentence to the problem's first solution step without overloading it.
- **Grammar/punctuation:** no defect found.
- **Section purpose:** every blockType used consistent with its established meaning.
- **Instructor-script usefulness:** clear purpose; the gurney opening hook effectively sets up both the mass (push) and weight (lift) halves of the lesson in one question; no copied lecture-script phrasing (independently re-checked against `SEG021`/`SEG022`).
- **Review Card quality:** original ("equipment case weighs 10 kilograms" scenario), correctly and consistently 2-significant-figure in its own worked check (`10 kg × 9.8 m/s² = 98 N`, independently reconfirmed), self-contained.
- **Misconception treatment:** accurate, clearly correctable, correctly `instructor`-only.
- **Alignment between explanation/equations/assessment:** the review card and the problem both draw directly on vocabulary and the `W = mg` relationship already established in the equation block; no unexplained jump.
- **Redundancy/incompleteness:** `mainIdea`/`explanation` overlap substantially — same accepted pattern as `ch01-t01` and the pilot precedent.

**The existing problem provides sufficient applied practice for this topic.** `ch01-prob-104` functions as both the topic's only worked numeric illustration and its assessment problem — a defensible, non-template-symmetric structure (the pilot precedent does not mandate a separate `example` block distinct from `problem`, and richer source coverage for `ch01-t04` than `ch01-t01` does not itself require a second numeric record). The two-part structure (numeric part (a), qualitative part (b)) gives graduated coverage within the one record. This is adequate for baseline-approval purposes; whether a future revision would benefit from a simpler, separate scaffolding example remains an optional, non-blocking idea already noted in the original review, not a completeness gap.

## 12. `ch01-t04` source-lineage and rights review

- Every cited `locatorId` (`SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`) independently re-confirmed to exist and map to `ch01-t04`.
- Every cited scientific-audit ID (`SCA02`, `SCA03`, `S5-SCI-012`, `K1-SCI-010`) independently re-confirmed to exist.
- `scientificCorrectionIds`/`conflictRecordIds` are `["ch01-corr-002"]`/`["CD-CONF-002"]` on every content record — consistent, matching established convention.
- `SEG017`, `SEG018`, `S5-P033` (the citation-repair task's removed miscitations) remain absent — confirmed by full-file search, zero occurrences.
- `ch01-corr-002`'s repaired evidence set (`SEG021`/`SEG022` primary, `S2-SEG056`, `S2-SEG058`, `R1-Q004`, plus `K1-SCI-010`) remains intact, unchanged.
- **`ch01-corr-002` is applied accurately**, including its qualification.
- **"Apparent weight" is not represented as verbatim source wording anywhere** — `ch01-t04-block-explanation`'s own learner-visible prose explicitly states: *"The term 'apparent weight' is this chapter's own clarifying label for that support-force reading; it is not a direct quotation from any source material..."* — independently re-confirmed present, word-for-word, in the current file.
- **`SRC-CH01-BATCH1-ORIGINAL` is used only as `ch01-prob-104`'s `sourceVariant.sourceId`** — never appears in any `provenanceLinks`/`sourceTraceability` array (which require audited-source-namespace IDs), never presented as an audited source record. Registration timing is addressed in §14.

**Rights-safety, record by record:**

| Record | Classification |
|---|---|
| `ch01-is-104` | Clear — independently re-checked against `SEG021`/`SEG022` |
| `ch01-t04-block-mainidea` | Clear |
| `ch01-t04-block-explanation` | Clear |
| `ch01-t04-block-equations` | Clear |
| `ch01-t04-block-visual` | Clear — explicitly non-derivative, deliberately uses a different example object than the audited sources |
| `ch01-t04-block-misconception` | Clear |
| `ch01-t04-block-review` | Clear — original scenario and numbers |
| `ch01-prob-104` | Clear — original object, numbers, and two-part structure; sig-fig revision language is newly authored |

No record for `ch01-t04` is classified "revise before approval" or "blocked pending rights review."

## 13. `ch01-t04` recommendation

**Approve English baseline with documented (non-blocking) conditions.**

- **Confidence:** High.
- **Scientific basis:** no open scientific issue (§10); the two prior "revision required" items (sig-figs, unmodeled field) are both closed.
- **Editorial basis:** no open editorial defect; two non-blocking optional notes carried forward (below).
- **Source-lineage basis:** fully intact and independently re-verified (§12).
- **Rights-safety basis:** every record clear (§12).
- **Conditions (non-blocking, informational, do not gate approval):** (1) `ch01-t04-block-explanation`'s "an ordinary situation... resting still on a scale" phrasing could optionally be tightened to explicitly say "no acceleration," matching the more precise condition already stated in `ch01-prob-104`'s own metadata — never required; (2) `ch01-t04-block-equations`'s `glossaryTermIds` could optionally include `ch01-term-mass` alongside `ch01-term-weight` — never required.
- **Records affected by any remaining issue:** `ch01-t04-block-explanation`, `ch01-t04-block-equations` (both optional notes only).
- **Is project-owner approval sufficient for this internal baseline stage?** Yes, same basis as §9.
- **Is independent expert review still required before student publication?** Yes, unchanged.

## 14. Identifier assessment

| Identifier | Assessment | Registration timing |
|---|---|---|
| `ch01-is-101`, `ch01-is-104` | Correctly patterned, globally unique, correctly topic-aligned | **After baseline approval, before application integration** |
| All 12 new `ch01-tXX-block-*` IDs | Same | Same |
| `ch01-prob-104` | Same | Same |
| `SRC-CH01-BATCH1-ORIGINAL` | Correctly used only as an authorship marker (§12); matches the `^SRC-CH01-[A-Z0-9-]+$` pattern; mirrors the pilot's own unregistered `SRC-CH01-PILOT-ORIGINAL` precedent exactly | **After baseline approval, before application integration** — see rationale below |
| `ch01-t01-visual-001`, `ch01-t04-visual-001` | Correctly patterned to match the pilot files' own asset-ID convention | **Must remain provisional** — do not register until visual production is separately authorized and an asset actually exists, consistent with `availabilityStatus: "missing"` |

**Rationale for "after baseline approval, before application integration":** `IDENTIFIER_REGISTRY.json`'s own stated `purpose` is *"Validate identifiers before canonical records are linked"* — a linking-time concern, not a drafting- or baseline-approval-time one. English baseline approval is a content-correctness/completeness gate; it does not itself link these records into the application's own governance graph the way build-authorization eventually would. Registering now (before approval) would be premature, since the IDs are not yet final approved content; registering only "during" approval conflates two different governance actions into one; deferring registration until after approval but explicitly before any future application-integration step keeps the registry accurate to what has actually been through content review, without blocking baseline approval on a purely mechanical bookkeeping step. This is a **deliberate improvement over** the pilot's own precedent (`SRC-CH01-PILOT-ORIGINAL` has remained unregistered indefinitely, with no explicit timing decision ever made) — not a requirement to replicate that gap.

`IDENTIFIER_REGISTRY.json` was read for this assessment and **not modified**.

## 15. Arabic and visual dependencies

**English baseline approval, if granted, would not itself authorize:** Arabic drafting, Arabic approval, visual production, visual review, or application integration. Each remains a separate, still-absent authorization, unaffected by this brief or by any approval decision made on its basis.

**`ch01-t01` — pending before Arabic generation:**
- Glossary work: a full glossary-approval pass from zero existing coverage (no term for "fundamental quantities," "distance" (scoped elsewhere), "time," or "charge" exists yet).
- Conceptual adaptation: none identified beyond standard translation — the topic's content is definitional, no interpretive-term qualification like `ch01-t04`'s "apparent weight" exists here.
- Bidi/equation isolation: standard pattern only (`v = d/t` isolable as one LTR span, matching the proven pilot pattern); no unusual risk identified.
- Visual requirement still pending: `ch01-t01-visual-001` (four-quantity diagram with one derived-quantity example) — not produced, not reviewed.

**`ch01-t04` — pending before Arabic generation:**
- Glossary work: three terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`) already exist but remain `approvalStatus: "pending"` — terminology review must complete before Arabic translation can be finalized.
- Conceptual adaptation: the "apparent weight" qualification (project-authored, not verbatim) must carry through to the Arabic rendering of `ch01-term-apparent-weight` (currently pending, proposed Arabic: الوزن الظاهري) with the same interpretive framing, not a literal-only translation.
- Bidi/equation isolation: standard pattern only (`W = mg` isolable as one LTR span); no unusual risk identified.
- Visual requirement still pending: `ch01-t04-visual-001` (push/lift/scale three-panel contrast) — not produced, not reviewed.

## 16. Governance assessment

Re-confirmed for this task:

- **English drafting was authorized** — `PILOT_AUTHORIZATION.json` v1.2.0's `batch1DraftingAuthorization`, unchanged.
- **English baseline approval has not yet occurred** for either topic — confirmed (§2).
- **Arabic generation remains unauthorized.**
- **Visual production remains unauthorized.**
- **Application expansion remains unauthorized** — and, independent of authorization, is not even mechanically possible today without a `vite.config.ts`/`rawImports.ts` change, since `batch1-drafts/` is outside the current `server.fs.allow` scope (§2).
- **No independent scientific reviewer has approved either topic** — `approvals.scientificReviewer: null` on both `ch01-corr-001` and `ch01-corr-002`, by the project owner's own deliberate instruction.
- **Publication remains unauthorized** everywhere.

**Distinction between four governance concepts, stated explicitly per this task's requirement:**

1. **Project-owner English baseline approval** — a project-owner decision that a topic's English content is complete, internally consistent, and ready to serve as the fixed source text for downstream work (translation, visual production, eventual application rendering). It is a *content-readiness* judgment, made by the project owner based on Claude's completed review work (this brief and its predecessors) — exactly the same basis already used for the pilot's own English/Arabic baselines and for `ch01-corr-006`–`009`.
2. **Editorial approval** (as already used for `ch01-corr-001`/`ch01-corr-002` themselves, at `approvalStatus: "editoriallyApproved"`) — a narrower, correction-record-specific approval that a proposed scientific-wording fix is accepted, distinct from baseline approval of the full topic content built around it.
3. **Independent human scientific review** — a review by an actual, credentialed subject-matter expert, external to this Claude-assisted process. This has **never occurred** at any point in this project's history, for any topic, pilot or Batch 1. Baseline approval does not claim, substitute for, or move the project closer to satisfying this requirement.
4. **Student-publication authorization** — the final, separate gate (`studentFacingAllowed`/`studentPublicationAuthorized`) governing whether content may ever reach an actual student. Entirely unaffected by baseline approval, translation, or visual production individually or together.

## 17. Baseline-packaging recommendation

**Precedent check performed, not assumed:** `ENGLISH_PILOT_BASELINE_APPROVAL.json` was re-read in full for this task. Its own structure shows that baseline approval for the four pilot topics was recorded as a **separate governance JSON file** (`baselineApprovalId`, `baselineVersion`, `status`, `approvedBy`, `approvedAt`, `scope.approvedTopicIds`, `reviewBasis`, `statementOfApproval`, `perTopicDecision`, `downstreamAuthorization`, `revisionControlPolicy.revisionLog`, `unchangedByThisApproval`) that **references** the pilot content files by path and designates their *existing, unmoved* text as the approved baseline — it does **not** duplicate, copy, rename, or relocate the content files themselves. The same physical file (e.g. `pilot/ch01-t02-content.json`) is simultaneously the draft record and the approved baseline; approval is a governance-record fact laid on top of it, not a file operation.

**Recommendation, applying that same precedent — not the pilot file's specific scope:**

- **Should the draft remain in `batch1-drafts/`?** Yes. No file move, copy, or rename is required or recommended as part of baseline approval itself, mirroring the pilot precedent exactly.
- **Should it later be copied or promoted to a canonical baseline path?** No promotion/copy is required by the baseline-approval act itself. A future, entirely separate **application-build-authorization** decision (parallel to how `applicationBuildAuthorization` was added on top of the original four-topic content authorization) would be the point at which a decision about the application-facing path (`pilot/` vs. a new directory) becomes relevant — not before, and not automatically.
- **Recommended approved-baseline file path:** the existing paths, unchanged — `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json`. **Open question for the project owner, not resolved by this brief:** whether the `batch1-drafts/` directory name should eventually be reconsidered once content is approved (since "-drafts" specifically signals pre-approval status) — this is a naming-hygiene judgment call, not a requirement; the pilot's own `pilot/` directory name never changed across its own approval history, so there is no precedent requiring a rename either.
- **Required baseline version:** a fresh, independent `baselineVersion: "1.0.0"` for a **new**, Batch-1-scoped approval record — not a continuation of the pilot's own `1.0.2` sequence, since these are a different scope with no shared version history, exactly as the pilot's English and Arabic baselines each independently maintain their own version sequence despite covering the same four topics.
- **Required approval record:** a **new, separate** file — recommended name `ENGLISH_BATCH1_BASELINE_APPROVAL.json` — structured with the same field set as `ENGLISH_PILOT_BASELINE_APPROVAL.json`, with `scope.approvedTopicIds: ["ch01-t01","ch01-t04"]`. **Not** an extension of `ENGLISH_PILOT_BASELINE_APPROVAL.json` itself, whose own `baselineApprovalId` ("ch01-english-pilot-baseline-001") and `scope` are explicitly and literally pilot-scoped — extending it would blur the same pilot/Batch-1 boundary this entire task sequence has deliberately kept distinct (mirroring the earlier decision to keep `batch1-drafts/` physically separate from `pilot/`).
- **Required revision-history structure:** the same `revisionControlPolicy.revisionLog` array pattern, initialized empty (no revision yet) at the point of first approval, ready to receive future controlled-revision entries following the exact `revisionId`/`fromVersion`/`toVersion`/`revisedAt`/`authorizedBy`/`scope`/`whatChanged`/`whatWasNotChanged`/`rationale` shape already proven twice in the pilot's own baseline files.
- **Required identifier registration:** per §14 — after approval, before any future application-integration step; not a precondition of baseline approval itself.
- **Governance fields that must remain blocked:** every record's `blocking.blockingStatus` should remain `"blocked"` and `studentFacingAllowed: false` **even after baseline approval** — independently confirmed this is exactly the pilot precedent's own behavior (every currently-approved-baseline pilot content record still carries `blockingStatus: "blocked"`, `blockingReason` including `"translationPending"`; baseline approval and per-record blocking status are tracked independently, by design).
- **Should the source draft files be preserved unchanged as historical artifacts?** Yes — any future revision to either file, post-approval, should follow the pilot's own controlled-revision pattern (bump a version, append a `revisionLog` entry describing what/why/who, never a silent edit), exactly as every prior task in this sequence has already done for every governance file it touched.

**No packaging or promotion action was performed by this brief.**

## 18. Batch-level recommendation

**Approve both with conditions.**

Both topics are independently ready, both carry only optional, non-blocking notes (not required revisions), and nothing found in this final pass distinguishes their readiness levels. The topics should **remain paired** for this approval decision — consistent with every prior batch-pairing assessment in this sequence, and reinforced by the fact that both topics' remaining conditions are structurally identical in kind (minor phrasing precision, minor glossary-reference completeness), not indicative of divergent risk profiles.

## 19. Project-owner decision sheet

### ch01-t01

- Advisory recommendation: Approve with documented (non-blocking) conditions
- Confidence: High
- Conditions: (1) optional — tighten "distance" to "distance traveled" in `ch01-t01-block-equations`; (2) optional — consider a bare numeric illustration of `v = d/t`. Neither is required for approval.
- Project-owner decision: [Approve / Approve with conditions / Revise / Reject — leave blank]
- Project-owner notes: [leave blank]
- Decision date: [leave blank]

### ch01-t04

- Advisory recommendation: Approve with documented (non-blocking) conditions
- Confidence: High
- Conditions: (1) optional — tighten `ch01-t04-block-explanation`'s "ordinary situation" phrasing to explicitly say "no acceleration"; (2) optional — add `ch01-term-mass` to `ch01-t04-block-equations`' `glossaryTermIds`. Neither is required for approval.
- Project-owner decision: [Approve / Approve with conditions / Revise / Reject — leave blank]
- Project-owner notes: [leave blank]
- Decision date: [leave blank]

### Batch 1 English baseline

- Advisory recommendation: Approve both with conditions
- Proposed baseline version: 1.0.0 (new, independent Batch-1-scoped sequence)
- Identifier-registration requirement: after baseline approval, before any future application-integration step (visual IDs remain provisional until visual production is separately authorized)
- Project-owner decision: [Approve / Approve with conditions / Revise / Reject — leave blank]
- Project-owner notes: [leave blank]

## 20. Publication statement

This is a read-only advisory decision brief. No draft was modified — both files are confirmed unchanged (checksums, §3) before and after this task. No baseline approval was granted. No identifier was registered. No Arabic or visual content was generated. No application expansion occurred. No independent human expert approval occurred — every finding above is Claude's own review under project-owner authorization. **Publication remains unauthorized**: `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere this task touched or read, and nothing in this brief changes, sets, or proposes changing either flag for any topic.
