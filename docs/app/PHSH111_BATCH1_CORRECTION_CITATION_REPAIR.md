# PHSH111 Batch 1 — Correction Citation & Traceability Repair

**Prepared:** 2026-07-16. **Type:** Controlled, narrowly scoped citation-repair task, executed in direct response to a project-owner decision. Applies to exactly two correction records — `ch01-corr-001` (`ch01-t01`) and `ch01-corr-002` (`ch01-t04`) — and their linked conflict records `CD-CONF-001`/`CD-CONF-002`. No scientific wording, classification, severity, rationale, or approval status was changed.

## 1. Scope

This task repairs the evidence-citation defects identified in `docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` (§3.2, §5, §7.2, §9) — specifically, source-record IDs in `ch01-corr-001` and `ch01-corr-002` that independent verification found to be attributed to the wrong topic. The repair is limited strictly to `originalWording.sourceRecordIds`, `scientificAuditRecordIds`, and the corresponding fields in the two linked conflict records. Neither correction's `correctedWording`, `correctionRationale`, `classification`, `severity`, `studentFacingSuppression`, or `approvals` was touched. No canonical topic content was created for `ch01-t01` or `ch01-t04` (none exists).

## 2. Project-owner decisions

| Item | Decision |
|---|---|
| `ch01-corr-001` | **Revise** — scope: evidence citation and traceability repair only. Proposed scientific wording retained unchanged. |
| `ch01-corr-002` | **Revise** — scope: evidence citation and traceability repair only. Proposed scientific wording retained unchanged. |
| Batch 1 | Remains `ch01-t01` + `ch01-t04` |
| Decision date | 2026-07-16 |
| Decision basis | `docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` |

**On decision-history placement:** `SCIENTIFIC_CORRECTIONS.json` has no existing structured decision-history/revision-log array at the per-record level (unlike `ENGLISH_PILOT_BASELINE_APPROVAL.json`/`ARABIC_PILOT_BASELINE_APPROVAL.json`, which use a `baselineVersion` + `revisionControlPolicy.revisionLog` pattern). Inventing that structure inside `SCIENTIFIC_CORRECTIONS.json` would be a schema addition not grounded in this file's own precedent. Instead, following this task's own fallback instruction, each affected record and conflict record received one short, precedent-consistent descriptive field — `citationRepairNote` — mirroring the single-field, plain-language documentation pattern `ch01-corr-009` already established for non-standard situations (`provenanceNote`, `englishImpact`, `arabicImpact`, etc.). The **full, structured** decision-history record required by this task lives in this document (this section) rather than inside the correction schema.

## 3. `ch01-corr-001` citations before

| Field | Value |
|---|---|
| `originalWording.sourceRecordIds` | `["SEG004", "S2-SEG026", "S3-P003", "S3C-Q001", "R1-Q001"]` |
| `scientificAuditRecordIds` | `["SCA01", "S3-SCI-001", "S3C-SCI-001", "R1-SCI-001"]` |

## 4. `ch01-corr-001` citations after

| Field | Value |
|---|---|
| `originalWording.sourceRecordIds` | `["S2-SEG026", "SEG009", "SEG010", "S3-P003", "S3C-Q001", "R1-Q001"]` |
| `scientificAuditRecordIds` | `["SCA01", "S3-SCI-001", "S3C-SCI-001", "R1-SCI-001", "K1-SCI-004"]` |

## 5. Reason for every `ch01-corr-001` citation — retained / added / removed

| Citation ID | Classification | Reason |
|---|---|---|
| `SEG004` | **Removed** | Independently re-verified against `docs/content-audits/chapter-01/raw-sources/source-001-segments.json` and `docs/content-audits/chapter-01/topic-mapping.json`: `SEG004`'s `linkedTopicIds` is `["ch01-t14"]`, not `ch01-t01`. It does not belong to this correction's topic. |
| `S2-SEG026` | **Retained, reordered to lead the list** | Confirmed `topicIds: ["ch01-t01"]`. This textbook paragraph already states the corrected wording's substance almost verbatim, including the charge-deferral clause — the single strongest piece of evidence identified in the decision brief. Moved to the first position per the project-owner instruction to include it as primary supporting evidence. |
| `SEG009` | **Added** | Confirmed via `docs/content-audits/chapter-01/topic-mapping.json` (`ch01-t01.segmentIds`) and directly via `source-001-segments.json` (`linkedTopicIds: ["ch01-t01"]`) to be one of `ch01-t01`'s own two mapped source segments — the actual teaching-script content this topic is built from, previously uncited. |
| `SEG010` | **Added** | Same verification as `SEG009`; the second of `ch01-t01`'s two mapped segments. Its closing line ("these three quantities are so important that physics builds almost everything from them") is the specific phrase within `ch01-t01`'s own source content that most resembles the overreach pattern the correction addresses. |
| `S3-P003` | **Retained** | Confirmed `topicIds: ["ch01-t01"]` and `scientificIssueIds: ["S3-SCI-001"]` in `docs/content-audits/chapter-01/sources/source-003/page-inventory.json`. The clearest single-source instance of the flagged pattern (a bullet slide that omits charge, immediately following a page that states it). |
| `S3C-Q001` | **Retained** | Confirmed `topicIds` includes `ch01-t01` in `docs/content-audits/chapter-01/sources/source-conv-003/problem-solution-inventory.json`. Correctly topic-tagged; not merely cited because it mentions motion or physics generally — it is the actual "three of the fundamental physical quantities" review item this topic's source material produced. |
| `R1-Q001` | **Retained** | Confirmed `topicIds` includes `ch01-t01` in `docs/content-audits/chapter-01/sources/source-review-001/question-inventory.json`. Same reasoning as `S3C-Q001`. |
| `SCA01` | **Retained** | The originating top-level audit finding (`docs/content-audits/chapter-01/scientific-audit.json`), `topicId: "ch01-t01"` — direct basis for the correction. |
| `S3-SCI-001` | **Retained** | Confirmed as the audit item tied to `S3-P003` (`docs/content-audits/chapter-01/sources/source-003/scientific-audit.json`); directly supports. |
| `S3C-SCI-001` | **Retained** | Confirmed as the audit item tied to `S3C-Q001` (`docs/content-audits/chapter-01/sources/source-conv-003/scientific-audit.json`); directly supports. |
| `R1-SCI-001` | **Retained** | Confirmed as the audit item tied to `R1-Q001` (`docs/content-audits/chapter-01/sources/source-review-001/scientific-audit.json`); directly supports. |
| `K1-SCI-004` | **Added** | Independently verified in `docs/content-audits/chapter-01/sources/source-kahoot-001/scientific-audit.json`: `topicId: "ch01-t01"`, `relatedExistingRecords: ["SCA01", "S3-SCI-001"]`. Directly supports — it is the single clearest documented instance of the overreach pattern ("physics describes three fundamental aspects of the universe"), not added merely because it is Kahoot-sourced or mentions motion. |

No citation was removed or added on the basis of merely mentioning motion, physics, or measurement in general terms; every retained or added ID was independently confirmed to carry `ch01-t01` topic tagging (for source/problem/question records) or `topicId`/`relatedExistingRecords` linkage to `ch01-t01`'s own audit findings (for scientific-audit records).

## 6. `ch01-corr-002` citations before

| Field | Value |
|---|---|
| `originalWording.sourceRecordIds` | `["SEG017", "SEG018", "S2-SEG056", "S2-SEG058", "S5-P033"]` |
| `scientificAuditRecordIds` | `["SCA02", "SCA03", "S5-SCI-012"]` |

## 7. `ch01-corr-002` citations after

| Field | Value |
|---|---|
| `originalWording.sourceRecordIds` | `["SEG021", "SEG022", "S2-SEG056", "S2-SEG058", "R1-Q004"]` |
| `scientificAuditRecordIds` | `["SCA02", "SCA03", "S5-SCI-012", "K1-SCI-010"]` |

## 8. Reason for every `ch01-corr-002` citation — retained / added / removed / retained with qualification

| Citation ID | Classification | Reason |
|---|---|---|
| `SEG017` | **Removed** | Independently re-verified against `docs/content-audits/chapter-01/raw-sources/source-001-segments.json`: `linkedTopicIds: ["ch01-t03"]` (Time), not `ch01-t04`. Content is a "Time" lecture script, unrelated to mass/weight. |
| `SEG018` | **Removed** | Same file, same verification: `linkedTopicIds: ["ch01-t03"]`. Also a Time/period-frequency lecture script. |
| `S5-P033` | **Removed** | Its own record in `docs/content-audits/chapter-01/sources/source-conv-005/problem-inventory.json` carries `topicIds: ["ch01-t08"]`, not `ch01-t04`; independently confirmed absent from `ch01-t04`'s own problem list in that source's `topic-mapping.json` (`"problemIds": [], "problemCount": 0`). It is a drag-car acceleration problem belonging to `ch01-t08`, only tangentially touching weight phrasing. |
| `SEG021` | **Added, listed first as primary evidence** | Confirmed via `docs/content-audits/chapter-01/topic-mapping.json` (`ch01-t04.segmentIds`) and `source-001-segments.json` (`linkedTopicIds: ["ch01-t04"]`) as one of `ch01-t04`'s own two mapped source segments. States "mass is a measure of inertia... we are not talking about gravity, we are not talking about weight" — closely matches the corrected wording. |
| `SEG022` | **Added, listed as primary evidence** | Same verification; the second of `ch01-t04`'s two mapped segments. States "mass measures inertia... weight measures the force of gravity" — the clearest single-source statement of the corrected framing. |
| `S2-SEG056` | **Retained** | Confirmed `topicIds: ["ch01-t04"]`. Textbook paragraph connecting mass to inertia; supports the correction's first sentence. |
| `S2-SEG058` | **Retained** | Confirmed `topicIds: ["ch01-t04"]`. Textbook paragraph distinguishing weight-felt-when-lifting from mass-felt-when-accelerating; supports the gravitational-weight half of the correction, though it does not itself use the term "apparent weight" (see §10). |
| `R1-Q004` | **Added** | Confirmed `topicIds: ["ch01-t04"]` in `docs/content-audits/chapter-01/sources/source-review-001/question-inventory.json` — a true/false item ("In mechanics, weight and mass measure the same property of matter," answer False) that directly reinforces the mass≠weight distinction. This citation was already present in the linked conflict record `CD-CONF-002` but absent from the correction record itself; now aligned between the two. |
| `SCA02` | **Retained** | `topicId: "ch01-t04"` in `docs/content-audits/chapter-01/scientific-audit.json`; direct basis for the correction's first sentence (mass-as-inertia). |
| `SCA03` | **Retained** | `topicId: "ch01-t04"`, same file; direct basis for the correction's second sentence (gravitational vs. apparent weight). |
| `S5-SCI-012` | **Retained with qualification** | Exists and is a genuine audit finding (`docs/content-audits/chapter-01/sources/source-conv-005/scientific-audit.json`), but its parent problem (`S5-P033`) belongs to `ch01-t08`, and its content (not describing a horizontal seat-contact force as "body weight pushing backward") is tangential to, not directly evidence for, the gravitational-weight/apparent-weight distinction this correction defines. Retained because it was not one of the three IDs the project owner named for removal, but flagged here as secondary, cross-topic corroboration rather than primary evidence. |
| `K1-SCI-010` | **Added** | Confirmed `topicId: "ch01-t04"`, `relatedExistingRecords: ["SCA02", "SCA03"]` in `docs/content-audits/chapter-01/sources/source-kahoot-001/scientific-audit.json`. A positive-contrast finding (this source's own mass/weight wording is already clean) — added as corroboration that the corrected framing is the field-standard answer, using the identical evidentiary pattern already established for the approved `ch01-corr-008` (`evidenceStatus: "...corroboratedByKahootPositiveContrastFinding"`), not as evidence of an original defect. |

No citation was removed or added on the basis of merely mentioning motion, physics, or measurement in general terms; every retained or added ID was independently confirmed to carry `ch01-t04` topic tagging or direct `relatedExistingRecords` linkage to `SCA02`/`SCA03`.

## 9. Conflict-record updates

Both `CD-CONF-001` and `CD-CONF-002` (`docs/content-design/chapter-01/DUPLICATE_AND_CONFLICT_DECISIONS.json`) had their `sourceRecordIds` and `scientificAuditRecordIds` fields updated to exactly match the corrected sets above (§4, §7), so the correction record and its linked conflict record stay in sync. Each received one new `citationRepairNote` field documenting:

- the specific citation defect identified,
- the corrected evidence set,
- an explicit statement that the underlying scientific/interpretive issue remains substantively resolved by the correction's unchanged proposed wording,
- the project-owner decision ("Revise, scope: evidence citation and traceability repair only"),
- and an explicit statement that the correction is not yet approved.

`resolutionStatus` on both conflict records remains **`"proposed"`** — unchanged, not advanced to `"resolved"`, since neither underlying correction has been approved.

**Notable finding preserved in both notes:** `CD-CONF-002` already cited `R1-Q004` (not `S5-P033`) in its own `sourceRecordIds` before this repair — `ch01-corr-002` itself was the record with the miscitation in that slot. This repair aligns `ch01-corr-002` to the more accurate citation `CD-CONF-002` already had.

## 10. Scientific wording integrity check

Confirmed unchanged, by direct field-by-field comparison of the file before and after editing:

- `ch01-corr-001.correctedWording.en`: *"Distance, time, and mass are the fundamental quantities emphasized in this chapter's treatment of mechanics. Charge is another fundamental property used later in the course."* — **byte-identical to the pre-repair value.**
- `ch01-corr-001.correctionRationale`, `.classification`, `.severity`: unchanged.
- `ch01-corr-002.correctedWording.en`: *"Mass measures an object's inertia. Gravitational weight is the gravitational force on the object, while apparent weight is the support force indicated by a scale or felt by the body."* — **byte-identical to the pre-repair value.**
- `ch01-corr-002.correctionRationale`, `.classification`, `.severity`: unchanged.
- **"Apparent weight" terminology clarification (per this task's explicit instruction):** "apparent weight" is a scientifically standard, correct interpretive term, directly consistent with `SCA03`'s own recommended correction ("define gravitational weight and separately note apparent weight when relevant"). It is **not** claimed to be verbatim wording lifted from any audited source — none of `SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`, or `R1-Q004` uses this exact phrase; each states the underlying lift-vs-accelerate / gravitational-force distinction without naming the "apparent weight" concept explicitly. This distinction is stated in `ch01-corr-002`'s new `citationRepairNote` field and is not, and was not, folded into `correctedWording` or `correctionRationale`.
- Neither `ch01-corr-001` nor `ch01-corr-002`'s `correctedWording.ar` or `arabicStatus` was touched — both remain `null` / `"notGenerated"`.

## 11. Remaining uncertainties

- **`ch01-corr-001`:** none of a scientific nature. The citation set is now fully traceable to `ch01-t01`-tagged evidence, led by `S2-SEG026`'s strong textbook support.
- **`ch01-corr-002`:** the "apparent weight" half of the corrected wording remains the one part without a verbatim source precedent (§10) — this is a legitimate, standard physics distinction, not a scientific defect, but it is the most source-novel component of either correction and is worth the project owner's continued awareness heading into any future approval decision. `S5-SCI-012`'s retained-with-qualification status (§8) is a minor, disclosed asymmetry: it stays cited despite its parent problem belonging to a different topic, because it was not named for removal and does offer secondary, tangential corroboration on weight-phrasing precision.
- No new scientific, evidentiary, or Arabic-terminology question was introduced by this repair task itself.

## 12. Readiness for final approval decision

Both `ch01-corr-001` and `ch01-corr-002` now have citation sets that are fully traceable to their own topic's audited evidence, with primary evidence explicitly identified (`S2-SEG026` for `ch01-corr-001`; `SEG021`/`SEG022` for `ch01-corr-002`) and every retained or added ID independently re-verified against its source file in this task. The citation-traceability gap that was the sole basis for the "Medium" confidence rating in `docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` §6/§10 has been closed. **Both records are now ready for a final project-owner approval decision** (Approve / further Revise / Reject), following the same review pattern already used for `ch01-corr-006`–`009`. This repair task does not itself constitute or recommend that approval — it only removes the evidentiary obstacle to making it.

## 13. Governance and publication state

- Both `ch01-corr-001` and `ch01-corr-002` remain `approvalStatus: "proposed"`. `approvals.scientificReviewer`, `approvals.editorialReviewer`, and `approvals.approvedAt` remain `null` on both.
- `studentFacingSuppression` remains `true` on both records, unchanged.
- No Arabic canonical wording exists for either correction; `correctedWording.ar` remains `null` and `arabicStatus` remains `"notGenerated"` on both.
- No canonical topic content file exists for `ch01-t01` or `ch01-t04`, and none was created by this task.
- Batch 1 remains `ch01-t01` + `ch01-t04`, unchanged.
- `PILOT_AUTHORIZATION.json` (v1.1.0) and `PILOT_READINESS.json` (v1.4.0) were read for this task but not modified; `canonicalGenerationAuthorized` remains `false` chapter-wide, and neither `ch01-t01` nor `ch01-t04` appears in either file's authorized-topic scope.
- `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere this task touched or read. This citation repair has no bearing on, and does not move the project any closer to, student-facing publication.
- No handoff or checkpoint document (`docs/app/PHSH111_APP_HANDOFF.md`, `docs/app/PHSH111_INTERNAL_PILOT_CHECKPOINT.md`) was found to contain any statement that this repair task made inaccurate — both already correctly describe `ch01-corr-001`/`ch01-corr-002` as `proposed`, which remains true after this task — so neither was modified.
