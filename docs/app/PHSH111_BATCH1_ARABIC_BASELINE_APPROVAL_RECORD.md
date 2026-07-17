# PHSH111 Batch 1 — Arabic Baseline Approval Record

**Approval date:** 2026-07-17. **Type:** Internal project-owner Arabic baseline approval only. This is not independent human scientific approval, not visual approval, not application-integration authorization, not student-facing authorization, and not deployment or publication authorization.

## 1. Purpose

This document records the explicit project-owner decision approving the two Batch 1 Arabic candidate drafts (`ch01-t01`, `ch01-t04`) as **Arabic Batch 1 baseline version 1.0.0** — see `docs/content-design/chapter-01/ARABIC_BATCH1_BASELINE_APPROVAL.json` for the full governance record this document supports.

## 2. Project-owner decision

Approve `ch01-t01`'s Arabic candidate as an Arabic baseline. Approve `ch01-t04`'s Arabic candidate as an Arabic baseline. Approve both topics together as **Arabic Batch 1 baselineVersion "1.0.0"**.

## 3. Approval date

2026-07-17.

## 4. Dependency verification, independently re-confirmed before approval

| Check | Result |
|---|---|
| Both Arabic candidates valid `schemaVersion: "2.3.0"` | Confirmed |
| Record counts | `ch01-t01`: 7; `ch01-t04`: 8 — both correct |
| `translationStatus` on every populated record | `"draft"` everywhere — never `"approved"` |
| English fields still match English baseline v1.0.0 | Confirmed — English source checksums unchanged (`a445f55d...`, `c876a6fe...`) |
| Glossary version | `BILINGUAL_GLOSSARY.json`, `glossaryVersion: "1.3.0"`, unchanged |
| Previous Arabic review findings | All closed — see §5 |
| Remaining blockers | None |
| `studentFacingAllowed` | `false` on every record |
| Publication authorization | `false` |

## 5. Review-chain basis

This approval rests on the completed sequence: (1) `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_RATIFICATION_RECORD.md` — explicit project-owner ratification of the corrected Arabic candidate-draft generation authorization; (2) `docs/app/PHSH111_BATCH1_ARABIC_DRAFT_GENERATION_REPORT.md` — the two candidate files were generated as structural copies of the approved English baseline, with a zero-mismatch deep-equality check confirming no English content drift; (3) `docs/app/PHSH111_BATCH1_ARABIC_DRAFT_REVIEW_AND_REVISION_REPORT.md` — a consolidated scientific, linguistic, glossary, equation/bidi, and schema review, which found and corrected exactly two narrow draft-level defects (a duplicated parenthetical in `ch01-t01-block-equations`; a stray diacritic in `ch01-t04`'s problem solution) and concluded **"Remaining blockers: None"** and **"Ready for Arabic baseline-approval decision"** for both topics. This is a project-owner approval decision made on the basis of those completed Claude reviews, not an independently re-derived linguistic or scientific verification beyond them — the same framing already used for every prior baseline approval in this project's history.

## 6. Approved candidate files and checksums

| Topic | Path | sha256 | schemaVersion | Records |
|---|---|---|---|---|
| `ch01-t01` | `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` | `3955df7510ec86ef33379b4086792e1fc6fbcdddfe7b10fb4ab5535ced6c23c0` | 2.3.0 | 7 |
| `ch01-t04` | `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json` | `d1f5bfbdc5332c4c9295887d5d2c4d4e19f8e36da7a8e3822ca551fed4f11371` | 2.3.0 | 8 |

Both files remain exactly where they were generated and reviewed, at `docs/content-design/chapter-01/batch1-arabic-drafts/` — **not moved, not renamed, not copied, not promoted** into `batch1-drafts/` (English) or `pilot/`. This approval is a separate governance record referencing them by path and checksum, mirroring the exact pattern `ENGLISH_BATCH1_BASELINE_APPROVAL.json` and `ARABIC_PILOT_BASELINE_APPROVAL.json` already established.

## 7. English baseline dependency

`ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`, `status: "approved"`. Both English source files' checksums (`a445f55d...` for `ch01-t01`; `c876a6fe...` for `ch01-t04`) were re-computed immediately before this approval and confirmed byte-identical to the recorded values. Neither English file was modified at any point during Arabic candidate-draft generation, correction, review, or this approval.

## 8. Glossary dependency

`BILINGUAL_GLOSSARY.json`, `glossaryVersion: "1.3.0"`. All nine Batch 1 glossary actions (per `PHSH111_BATCH1_GLOSSARY_APPROVAL_RECORD.md`) were used and independently re-verified (in the review-and-revision pass) as terminology authority for both candidates. This approval relies on, and does not modify, that already-approved glossary.

## 9. Correction dependencies

- **`ch01-corr-001`** (→ `ch01-t01`): `editoriallyApproved`. Applied exactly as approved; its scientific meaning is preserved throughout the Arabic candidate.
- **`ch01-corr-002`** (→ `ch01-t04`): `editoriallyApproved`, with a recorded qualification — "apparent weight" is scientifically valid, project-authored interpretive terminology, not verbatim source wording. Applied exactly as approved, including the qualification, which is preserved as an explicit Arabic sentence in the candidate.

## 10. What this approval is

**A project-owner internal Arabic baseline approval only.** The Arabic content at the checksums recorded in `ARABIC_BATCH1_BASELINE_APPROVAL.json` is now the approved Arabic Batch 1 baseline, version 1.0.0.

## 11. What this approval is not

- **Not independent human scientific approval.** No independent human subject-matter expert (physics, linguistic, or otherwise) has reviewed this content, at any point in this project.
- **Not visual approval.** No visual exists for either topic; none is approved by this record.
- **Not application-integration authorization.** `apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics, unchanged.
- **Not student-facing authorization.** `studentFacingAllowed` remains `false` on every record.
- **Not deployment or publication authorization.** `studentPublicationAuthorized` remains `false`, chapter-wide.

## 12. Governance-version cross-reference

This approval is formalized as `docs/content-design/chapter-01/ARABIC_BATCH1_BASELINE_APPROVAL.json` (`baselineVersion: "1.0.0"`, a new, separate record — not merged into `ARABIC_PILOT_BASELINE_APPROVAL.json`) and `PILOT_READINESS.json` (version bump recorded there; see that file for the exact new version number and the scoped `batch1DraftingReadiness` fields updated by this approval).

## 13. Preservation statement

The two Arabic candidate files were **not** moved, copied, renamed, or internally rewritten by this approval. No record's `arabic.translationStatus` was changed to `"approved"` — every populated record still reads `"draft"`, exactly as it did before this approval; the external `ARABIC_BATCH1_BASELINE_APPROVAL.json` record is what establishes approval status, following the exact same pattern already used for every prior baseline approval in this project (English pilot, Arabic pilot, English Batch 1).

## 14. Exact next controlled task

**Batch 1 visual-production authorization for `ch01-t01` and `ch01-t04`** — a scoped authorization decision (mirroring how visual production was separately authorized and executed for the four pilot topics) that would need to precede any actual diagram design work for either topic. **This record does not perform that authorization or any visual work.**

---

### Explicit statements

- **This is an internal project-owner Arabic baseline approval only.**
- **No independent human scientific approval occurred.**
- **No visual was approved or produced.**
- **No application-integration authorization was granted.**
- **No student-facing authorization was granted.**
- **Publication remains unauthorized.**
