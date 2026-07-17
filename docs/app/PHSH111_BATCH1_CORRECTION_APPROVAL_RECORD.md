# PHSH111 Batch 1 — Correction Approval Record

**Decision date:** 2026-07-16

## 1. Purpose

This document records the project owner's final approval decision on the two Batch 1 scientific corrections — `ch01-corr-001` (`ch01-t01`) and `ch01-corr-002` (`ch01-t04`) — following `docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md` (independent scientific-reconciliation review) and `docs/app/PHSH111_BATCH1_CORRECTION_CITATION_REPAIR.md` (citation/traceability repair). This approval covers the **correction records only**. It does not authorize canonical topic generation, Arabic translation, visual production, application expansion, student-facing use, or publication of any kind.

## 2. Decision date

2026-07-16.

## 3. Project-owner decisions

| Item | Decision |
|---|---|
| `ch01-corr-001` | **Approve** |
| `ch01-corr-002` | **Approve with qualification** |
| Batch 1 | Remains `ch01-t01` + `ch01-t04` |

Both records now carry `approvalStatus: "editoriallyApproved"` — the same enum value already used by `ch01-corr-006`, `ch01-corr-007`, `ch01-corr-008`, and `ch01-corr-009`. No new approval-status value was invented.

**Approval level (deliberate, explicit divergence from the exact field values of the `ch01-corr-006`–`009` precedent, while reusing their schema and enum):** those four prior approvals populated `approvals.scientificReviewer` with the project owner's name, with `approvalBasis` text clarifying that this "records the project owner's approval decision, not an independently derived physics re-verification." For this approval, at the project owner's explicit instruction, `approvals.scientificReviewer` is left **`null`** on both records, and only `approvals.editorialReviewer` is populated. The intent is the same in substance as the earlier approvals (project-owner review of Claude's completed analysis, not independent third-party physics review) but is now made structurally explicit rather than relying on `approvalBasis` prose alone to carry that distinction.

## 4. `ch01-corr-001` approval basis

- The corrected scientific statement is strongly supported by `S2-SEG026` (the richest textbook source, which already states the corrected framing — including the charge-deferral clause — almost verbatim).
- The repaired citation set (`S2-SEG026`, `SEG009`, `SEG010`, `S3-P003`, `S3C-Q001`, `R1-Q001`; `SCA01`, `S3-SCI-001`, `S3C-SCI-001`, `R1-SCI-001`, `K1-SCI-004`) now maps correctly to `ch01-t01` — independently re-verified as intact and unchanged immediately before this approval was applied.
- The prior `SEG004` traceability defect (a citation that actually belonged to `ch01-t14`) has been removed and replaced with `ch01-t01`'s own verified segments.
- No unresolved scientific-substance issue remains — the correction is a scope/completeness clarification (`needsClarification`, `medium`), not a factual-accuracy correction, consistent with the classification already assigned before this approval and left unchanged by it.

## 5. `ch01-corr-002` approval basis

- `SEG021` and `SEG022` (`ch01-t04`'s own verified source segments) provide primary, topic-correct evidence for the mass-as-inertia and gravitational-weight framing.
- The repaired citation set (`SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`, `R1-Q004`; `SCA02`, `SCA03`, `S5-SCI-012`, `K1-SCI-010`) now maps correctly to `ch01-t04` — independently re-verified as intact and unchanged immediately before this approval was applied.
- The prior `SEG017`, `SEG018` (both actually `ch01-t03` segments), and `S5-P033` (actually a `ch01-t08` problem) miscitation defects are resolved.
- "Apparent weight" is consistent with established introductory physics (the standard distinction between gravitational force and a scale/support-force reading) and does not conflict with any source.

## 6. `ch01-corr-002` qualification

Recorded verbatim, per the project owner's explicit instruction, in `ch01-corr-002.approvals.approvalBasis` (the repository's existing free-text approval-rationale field, already used by prior approved corrections — e.g. `ch01-corr-008`'s `approvalBasis` — to carry qualifying detail; no new or incompatible field was added to the correction schema):

> "Apparent weight" is accepted as scientifically valid, project-authored interpretive terminology. It is not represented as verbatim wording from the cited source material.

This qualification does not alter `ch01-corr-002.correctedWording.en`, which remains byte-identical to its pre-approval value (§7). It exists specifically so that the approved wording's use of "apparent weight" — a term that is scientifically sound and consistent with `SCA03`'s own recommended correction, but is not verbatim-present in any of the five cited source records (`SEG021`, `SEG022`, `S2-SEG056`, `S2-SEG058`, `R1-Q004`) — is never mistaken for a direct source quotation.

## 7. Final verified citation sets

Both re-confirmed unchanged from the citation-repair task, immediately before this approval was applied (`python3 -m json.tool` validity check plus a direct field read):

| Correction | `sourceRecordIds` | `scientificAuditRecordIds` |
|---|---|---|
| `ch01-corr-001` | `["S2-SEG026", "SEG009", "SEG010", "S3-P003", "S3C-Q001", "R1-Q001"]` | `["SCA01", "S3-SCI-001", "S3C-SCI-001", "R1-SCI-001", "K1-SCI-004"]` |
| `ch01-corr-002` | `["SEG021", "SEG022", "S2-SEG056", "S2-SEG058", "R1-Q004"]` | `["SCA02", "SCA03", "S5-SCI-012", "K1-SCI-010"]` |

**Corrected English wording — confirmed byte-identical to every prior stage of this brief/repair/approval sequence:**

- `ch01-corr-001`: *"Distance, time, and mass are the fundamental quantities emphasized in this chapter's treatment of mechanics. Charge is another fundamental property used later in the course."*
- `ch01-corr-002`: *"Mass measures an object's inertia. Gravitational weight is the gravitational force on the object, while apparent weight is the support force indicated by a scale or felt by the body."*

## 8. Conflict-record dispositions

`CD-CONF-001` and `CD-CONF-002` (`docs/content-design/chapter-01/DUPLICATE_AND_CONFLICT_DECISIONS.json`) each received a new `approvalUpdateNote` field recording:

- citation repair completed and confirmed intact at the time of this approval,
- the linked correction's approval outcome (`ch01-corr-001`: approved; `ch01-corr-002`: approved with qualification, with the qualification text restated),
- that independent human subject-matter (physics) review has not occurred,
- that no `ch01-t01` or `ch01-t04` canonical topic record exists yet.

`resolutionStatus` on both conflict records **remains `"proposed"`**, `canonicalPreferenceStatus` remains `"candidate"`, and `preferredSourceRecordId` remains `null` — unchanged by this approval. This exactly matches the established precedent already visible in `CD-CONF-006`, `CD-CONF-007`, and `CD-CONF-008` (linked to the three previously approved pilot corrections), all of which likewise remain `resolutionStatus: "proposed"` despite their corrections being `editoriallyApproved` — a design-layer preference is applied only once actual canonical content exists to apply it to, which is not yet the case for any topic including the three approved pilot ones' own conflict records. Student-facing publication is not marked approved anywhere in either record.

## 9. Arabic status

Unchanged by this approval. `correctedWording.ar` remains `null` and `arabicStatus` remains `"notGenerated"` on both `ch01-corr-001` and `ch01-corr-002`. No Arabic canonical wording was generated, drafted, or implied by this approval. The three pending glossary terms relevant to `ch01-corr-002` (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`) remain `approvalStatus: "pending"` in `BILINGUAL_GLOSSARY.json`, which was not modified by this task.

## 10. Visual impact

None. `V02` (`ch01-t01`) and `V09` (`ch01-t04`) remain undrawn (`imageAvailable: false` in `docs/content-audits/chapter-01/visual-inventory.json`), and that file was not modified by this task. Approving the correction records has no visual consequence, since neither visual exists yet to be affected.

## 11. Canonical-generation status

**Unchanged and still not authorized.** `PILOT_READINESS.json.canonicalGenerationAuthorized` remains `false` chapter-wide; neither `ch01-t01` nor `ch01-t04` appears in `PILOT_AUTHORIZATION.json`'s `scope.authorizedTopicIds` or `applicationBuildAuthorization.applicableTopicIds` (both still exactly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]`). Neither file was modified by this task. No `ch01-t01-content.json` or `ch01-t04-content.json` file exists anywhere in the repository — confirmed by direct filesystem search immediately before writing this record. Approving a correction record is a prerequisite for future canonical generation, not the authorization itself, exactly as `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md` §12 (gate 2) and §15 already state.

## 12. Batch 1 readiness

Both of Batch 1's blocking scientific corrections (`ch01-corr-001`, `ch01-corr-002`) are now `approvalStatus: "editoriallyApproved"`, with fully repaired, independently-verified citation sets. **Batch 1's scientific-reconciliation prerequisite is now complete.** This does **not** make Batch 1 "ready for controlled drafting" in the sense used by `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md` §5 — that status still requires a separate, explicit canonical-generation-authorization decision (§11 above), which this task neither performs nor implies.

## 13. Independent-review status

No independent human subject-matter (physics) review has occurred on either correction. `approvals.scientificReviewer` is explicitly `null` on both `ch01-corr-001` and `ch01-corr-002`, by the project owner's own instruction, specifically so this approval is never read as independent scientific-review approval. This is consistent with every other governance record in this project: all four visuals remain `reviewer: null`, and every prior correction/baseline approval has been recorded as a project-owner decision made on the basis of Claude's completed review, never as independently-derived expert verification.

## 14. Governance and publication status

- `studentFacingSuppression` remains `true` on both records.
- `blocking.studentFacingAllowed` remains `false` on both records' new `blocking` objects (added to match the established `ch01-corr-006`–`008` pattern).
- `MVP_IMPLEMENTATION_DECISIONS.json`'s `publicationState` (`studentFacingAllowed: false`, `studentPublicationAuthorized: false`) was not read as part of the allowed-modification scope for this task and was not touched; nothing in this approval changes it.
- **Approval of these correction records does not authorize drafting, translation, illustration, application expansion, or any student-facing use.** Publication remains unauthorized in every respect this project has ever defined it.

## 15. Exact next controlled task

The next controlled task, if the project owner chooses to proceed, is a **separate, explicit canonical-generation-authorization decision** for `ch01-t01` and/or `ch01-t04` — amending `PILOT_AUTHORIZATION.json`'s `scope.authorizedTopicIds` and `PILOT_READINESS.json`'s chapter-wide/per-topic `canonicalGenerationAuthorized` flags, following the exact same pattern already used to authorize the original four pilot topics. That decision is outside this task's scope and was not performed here. Only after that authorization exists would English canonical drafting for Batch 1 become possible, followed — per the established pilot sequence — by baseline approval, then Arabic translation planning (gated on the three pending glossary terms for `ch01-t04` completing their own terminology-review pass), then visual specification for `V02`/`V09`.

---

### Governance statement (explicit, per task requirement)

- Both `ch01-corr-001` and `ch01-corr-002` are approved at the **project-owner editorial level** (`approvalStatus: "editoriallyApproved"`).
- **Neither correction has received independent human scientific-review approval.** `approvals.scientificReviewer` is `null` on both.
- **No Arabic canonical wording was generated.** Both records' `correctedWording.ar` remain `null`; `arabicStatus` remains `"notGenerated"`.
- **No `ch01-t01` or `ch01-t04` canonical content was created.** No such file exists anywhere in the repository.
- **Approval of these corrections does not authorize drafting or application expansion.** A separate canonical-generation-authorization decision is required first (§15).
- **Publication remains unauthorized.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere this task touched or read.
