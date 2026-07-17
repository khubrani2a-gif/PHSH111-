# PHSH111 Batch 1 — Glossary Approval Record

**Approved:** 2026-07-17. **All nine Batch 1 glossary actions are now project-owner approved.** This is not independent human scientific approval. No Arabic topic content was generated. Arabic generation remains unauthorized until a separate authorization task. Publication remains unauthorized.

## 1. Purpose

This document records the project owner's application of exactly the nine record-level glossary actions defined in `docs/app/PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md`, closing out the terminology-approval prerequisite identified in `docs/app/PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` for `ch01-t01` and `ch01-t04`.

## 2. Project-owner decision

Approve the reconciled Batch 1 glossary inventory exactly as specified: create and approve `ch01-term-fundamental-quantity` and `ch01-term-derived-quantity`; approve `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`, and `ch01-term-apparent-weight`; extend the topic scope of `ch01-term-distance` (→ `ch01-t01`) and `ch01-term-acceleration` (→ `ch01-t04`); do not create a separate dimension-family term; approve الوزن الظاهري as the apparent-weight canonical term with قراءة الميزان as a supporting phrase and without treating الوزن الحقيقي as the preferred contrast.

## 3. Approval date

2026-07-17.

## 4. English baseline dependency

Independently re-confirmed before any edit: `ENGLISH_BATCH1_BASELINE_APPROVAL.json` remains `baselineVersion: "1.0.0"`, `status: "approved"`; both approved draft files' checksums (`ch01-t01`: `a445f55d...`; `ch01-t04`: `c876a6fe...`) matched their recorded baseline values exactly, confirming no drift since approval. Neither file was touched by this task.

## 5. Reconciliation basis

`docs/app/PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md` §4/§6/§10/§13 — the definitive, re-verified inventory of 9 unique records / 9 actions, itself correcting a counting inconsistency in the earlier `PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md`.

## 6. Complete nine-record action table

| # | Record | Action | Topic | Blocking? |
|---|---|---|---|---|
| 1 | `ch01-term-fundamental-quantity` | Create + approve | `ch01-t01` | Yes |
| 2 | `ch01-term-derived-quantity` | Create + approve | `ch01-t01` | Yes |
| 3 | `ch01-term-speed` | Approve (pending → approved, first-time `topicIds`) | `ch01-t01` | Yes |
| 4 | `ch01-term-scalar` | Approve (pending → approved, first-time `topicIds`) | `ch01-t01` | No |
| 5 | `ch01-term-mass` | Approve (pending → approved, first-time `topicIds`) | `ch01-t04` | Yes |
| 6 | `ch01-term-weight` | Approve (pending → approved, first-time `topicIds`) | `ch01-t04` | Yes |
| 7 | `ch01-term-apparent-weight` | Approve with revision | `ch01-t04` | Yes |
| 8 | `ch01-term-distance` | Extend topic scope (`ch01-t02` → `+ch01-t01`) | `ch01-t01` | No |
| 9 | `ch01-term-acceleration` | Extend topic scope (`ch01-t08` → `+ch01-t04`) | `ch01-t04` | No |

**All 9 actions applied exactly as specified — no additional record was created, approved, or modified.**

## 7. New records created

**`ch01-term-fundamental-quantity`** — English: "fundamental quantity"; Arabic: الكمية الأساسية (approved); scoped to `ch01-t01`; definition: "A physical quantity defined independently rather than expressed as a combination of other physical quantities. In this chapter's mechanics content, distance, time, and mass are the relevant examples."; `usageNotes` carries the reconciled dimensional-symbol guidance (§10); source lineage: `SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`, `ch01-corr-001`.

**`ch01-term-derived-quantity`** — English: "derived quantity"; Arabic: الكمية المشتقة (approved); scoped to `ch01-t01`; definition: "A physical quantity expressed using one or more fundamental quantities... Speed is a derived quantity because it combines distance and time; speed has dimension L/T."; source lineage: `S3-P003`, `SCA01`, `ch01-corr-001`.

Both new `termId`s were checked for uniqueness against all 18 pre-existing terms and against `IDENTIFIER_REGISTRY.json`'s `^ch01-term-[a-z0-9-]+$` pattern before creation — confirmed unique and pattern-conformant.

## 8. Pending records approved

- **`ch01-term-speed`**: `approvedArabicTerm.status` `proposedPendingReviewerApproval` → `approved` (Arabic السرعة unchanged); `approvalStatus` `pending` → `approved`; `topicIds` added: `["ch01-t01"]`; `usageNotes` extended to state the average-speed/scalar/derived-quantity relationships explicitly; `S3-P003` appended to `sourceReferences` as the `ch01-t01`-specific evidentiary basis, with the pre-existing `S2-SEG102`/`SCA06`/`SCA07` references (relevant to the separate, not-yet-authorized `ch01-t05`) preserved unchanged.
- **`ch01-term-scalar`**: same pattern; Arabic كمية قياسية unchanged; `topicIds` added: `["ch01-t01"]`.
- **`ch01-term-mass`**: same pattern; Arabic الكتلة unchanged; `topicIds` added: `["ch01-t04"]`; `usageNotes` extended with an explicit mass/weight distinction sentence.
- **`ch01-term-weight`**: same pattern; Arabic الوزن unchanged; `topicIds` added: `["ch01-t04"]`; `usageNotes` extended with an explicit weight/apparent-weight/mass distinction and a `W = mg`/newtons note.
- **`ch01-term-apparent-weight`**: approved **with revision** (§11).

## 9. Existing records extended

- **`ch01-term-distance`**: `topicIds` `["ch01-t02"]` → `["ch01-t02", "ch01-t01"]`. `approvalStatus`, `approvedArabicTerm`, `definition`, `discouragedTranslations`, `sourceReferences`, and the original 2026-07-15 `reviewBasis` text all preserved byte-for-byte; a dated append sentence documents the extension without overwriting the original approval record.
- **`ch01-term-acceleration`**: `topicIds` `["ch01-t08"]` → `["ch01-t08", "ch01-t04"]`. Same preservation pattern; the append sentence states the exact reason (`ch01-t04`'s `W = mg` reuses the `|g| ≈ 9.8 m/s²` value `ch01-corr-007` already established).

## 10. Dimension-family resolution

**No separate glossary term was created** for "dimension," "physical dimension," "dimensional notation," or "L/T dimensional notation." Per the reconciliation addendum's own resolution, the narrow `L`/`T`-dimensional-symbol guidance — including the explicit translation-risk note (البُعد vs. المسافة) — is folded entirely into `ch01-term-fundamental-quantity`'s `usageNotes` field. Independently re-verified after editing: no `termId` in the glossary contains "dimension" in any form.

## 11. Apparent-weight terminology decision

**Approved exactly as specified:**
- English canonical term: apparent weight.
- Arabic canonical term: **الوزن الظاهري** (now `approved`, was `proposedPendingReviewerApproval`).
- Supporting explanatory phrase retained: **قراءة الميزان** (unchanged in `alternateArabicTerms`).
- **الوزن الحقيقي is not used as the preferred contrast anywhere** — it remains solely in `discouragedTranslations`, now with an explicit note explaining why ("wrongly implies apparent weight is not a real or true force").
- The revised `usageNotes` now explicitly: (1) distinguishes apparent weight from gravitational weight (equal only in an ordinary, static/resting situation); (2) states the term is project-authored interpretive terminology per `ch01-corr-002`'s own qualification, not a verbatim source quotation; (3) carries a misconception warning that apparent weight is not "fake" weight — it is a real, measurable support force, distinct from — not less real than — gravitational weight (`W = mg`). This directly preserves the distinction between gravitational weight, a scale reading, and apparent weight that the task required. (`ch01-term-weight`'s own `usageNotes` was also extended to reference apparent weight, mass, and `W = mg`, reinforcing the same set of distinctions from that entry's side.) No separate "normal force" glossary record was created — the concept is not used in either approved draft (independently re-confirmed by this task).

## 12. Cross-reference changes

Every cross-reference required by the reconciliation addendum was applied as prose within `usageNotes`/`discouragedTranslations` — the established mechanism this glossary already uses (no `crossReferenceTermIds`-style field exists anywhere in the schema, and none was invented):

- `ch01-term-fundamental-quantity` ↔ `ch01-term-derived-quantity` (each references the other's English/Arabic name in `usageNotes`).
- `ch01-term-mass` ↔ `ch01-term-weight` (each references the other; `discouragedTranslations` cross-warns against substituting one for the other, unchanged from the pre-existing pattern).
- `ch01-term-weight` ↔ `ch01-term-apparent-weight` (each references the other in `usageNotes`).

Verified after editing: every referenced `termId` exists in the file; no circular-definition defect was introduced (each definition is independently understandable without requiring the reader to follow a reference chain); no new field name was added to the schema.

## 13. Source and audit lineage

Every `sourceReferences` entry used in this task (`SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`, `ch01-corr-001`, `S3-P003`, `SCA02`, `ch01-corr-002`, `SCA03`, `S5-SCI-012`, `S2-SEG056`, `S2-SEG058`) is a pre-existing, already-verified identifier from the Batch 1 correction/decision-brief chain — none was invented. `S2-SEG102`/`SCA06`/`SCA07` on `ch01-term-speed` were preserved unchanged as pre-existing lineage for the separate, not-yet-authorized `ch01-t05`.

## 14. Identifier handling

**`IDENTIFIER_REGISTRY.json` was not modified.** Inspection confirmed glossary term IDs are governed only inside `BILINGUAL_GLOSSARY.json`: the registry's own `glossaryTerm` namespace entry names `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json` — not `IDENTIFIER_REGISTRY.json` itself — as the `authorityFiles` entry for individual term IDs; it only declares the shared pattern `^ch01-term-[a-z0-9-]+$`. None of the 7 previously-approved terms (`ch01-term-distance`, `ch01-term-velocity`, `ch01-term-acceleration`, `ch01-term-free-fall`, `ch01-term-centripetal-acceleration`, `ch01-term-period`, `ch01-term-frequency`) was ever separately registered in `IDENTIFIER_REGISTRY.json` either (confirmed by that file's stable modification history across this entire project). The two new IDs (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`) are therefore correctly treated the same way — as glossary-local identifiers, validated for uniqueness and pattern-conformance against the live glossary at creation time (§7), not separately registered.

## 15. Blocking terms closed

All 6 blocking records identified in the reconciliation addendum are now approved: `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-speed`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`.

## 16. Non-blocking terms completed

All 3 non-blocking records were also completed in this same pass, at the project owner's discretion, rather than deferred: `ch01-term-distance` (extended), `ch01-term-scalar` (approved), `ch01-term-acceleration` (extended).

## 17. Independent-review status

No independent human subject-matter (linguistic or scientific) expert has reviewed any of these 9 records. Every `reviewBasis` field added or extended by this task explicitly states this is "the project owner's approval decision, not an independently derived linguistic re-verification beyond that review" — the exact same framing already used for all 7 previously-approved glossary terms and for every other approval in this project's history. `terminologyReviewer` is recorded as "khubrani2a-gif (project owner)" throughout, consistent with existing convention; no field claims or implies independent expert review.

## 18. Arabic-generation status

**Remains unauthorized.** `PILOT_READINESS.json`'s `batch1DraftingReadiness.arabicGenerationAuthorized` remains explicitly `false`, both at the section level and on each topic. Completing glossary approval removes a prerequisite for a future Arabic-generation authorization decision; it does not itself grant that authorization.

## 19. Arabic-baseline status

**Remains unapproved.** No `ARABIC_BATCH1_BASELINE_APPROVAL.json`-style record exists or was created. `arabicBaselineApproved: false` is now explicitly recorded in `PILOT_READINESS.json`'s `batch1DraftingReadiness` section.

## 20. Visual and application status

**Both remain unauthorized**, unaffected by this task. `visualProductionAuthorized` and `applicationExpansionAuthorized` remain `false` on both topics in `PILOT_READINESS.json`. No visual asset was created. No file under `apps/chapter1-mvp/` was read for modification or touched.

## 21. Publication status

**Unauthorized, unaffected.** `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere. Nothing in this task changes, sets, or proposes changing either flag for any topic.

## 22. Exact next controlled task

A **scoped Batch 1 Arabic-generation authorization task** for `ch01-t01` and `ch01-t04`, which must decide: permitted Arabic output paths; use of the now-approved glossary (all 6 blocking terms, plus the 3 non-blocking completions); record-by-record translation requirements (per `PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` §9's already-established per-record-type strategy); conceptual adaptation of "apparent weight" specifically (per §11 above); equation and bidi requirements (per that same brief's §13/§14, already confirmed sufficient using existing pilot conventions); and continued blocking/publication restrictions. **Arabic content is not generated by this task.**

---

### Explicit statements

- **All Batch 1 blocking glossary terms are now project-owner approved.**
- **This is not independent human scientific approval.**
- **No Arabic topic content was generated.**
- **Arabic generation remains unauthorized until a separate authorization task.**
- **Publication remains unauthorized.**
