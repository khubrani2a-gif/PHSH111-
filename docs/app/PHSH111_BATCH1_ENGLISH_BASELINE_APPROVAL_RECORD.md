# PHSH111 Batch 1 — English Baseline Approval Record

**Approved:** 2026-07-16. **Both `ch01-t01` and `ch01-t04` are approved as Batch 1 English baseline version 1.0.0.** No independent human expert approval has occurred. No Arabic content was generated. No visual was produced. No application expansion occurred. No student-facing authorization was granted.

## 1. Purpose

This document records the project owner's final decision on `docs/app/PHSH111_BATCH1_ENGLISH_BASELINE_DECISION_BRIEF.md` — approving the English-language draft content for `ch01-t01` and `ch01-t04` as a formal Batch 1 English baseline, and documents exactly what that approval does and does not authorize.

## 2. Project-owner decisions

| Item | Decision |
|---|---|
| `ch01-t01` | Approve English baseline with documented non-blocking conditions |
| `ch01-t04` | Approve English baseline with documented non-blocking conditions |
| Batch 1 | Approve both topics together |
| English Batch 1 baseline version | `1.0.0` |

## 3. Approval date

2026-07-16.

## 4. Topics approved

Exactly two: `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight). No other Chapter 1 topic is approved by this record. This baseline is entirely separate from `ENGLISH_PILOT_BASELINE_APPROVAL.json` (scope: `ch01-t02`/`ch01-t03`/`ch01-t08`/`ch01-t10`), which was not modified.

## 5. Approved file paths and checksums

| Topic | Path | SHA-256 |
|---|---|---|
| `ch01-t01` | `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` | `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9` |
| `ch01-t04` | `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` | `c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b` |

Both independently re-verified at the start of this task to match the exact versions reviewed and recommended in the decision brief — confirming the drafts had not drifted since that review. **Neither file was moved, renamed, copied, promoted into `pilot/`, or content-modified by this approval.** Governance fields (`blocking`, `arabic`, `visibility`) on every record remain exactly as they were.

## 6. Record inventories

- `ch01-t01-content.json`: **7 records** — 1 `instructorScript` (`ch01-is-101`) + 6 `contentBlock` (`mainIdea`, `organizedExplanation`, `equationSet`, `visualReference`, `misconception`, `reviewQuestion`).
- `ch01-t04-content.json`: **8 records** — 1 `instructorScript` (`ch01-is-104`) + 6 `contentBlock` (same six types) + 1 `problem` (`ch01-prob-104`).

Both counts independently re-confirmed against the live files before this approval was recorded.

## 7. Baseline version

`1.0.0` — a fresh, independent version sequence for this new, Batch-1-scoped baseline record (`docs/content-design/chapter-01/ENGLISH_BATCH1_BASELINE_APPROVAL.json`), not a continuation of the pilot's own `1.0.2` sequence. `revisionControlPolicy.revisionLog` is initialized empty, ready to receive future controlled-revision entries following the exact pattern already proven twice in `ENGLISH_PILOT_BASELINE_APPROVAL.json`.

## 8. Scientific-review basis

`ch01-corr-001` and `ch01-corr-002` are both `approvalStatus: "editoriallyApproved"` in `SCIENTIFIC_CORRECTIONS.json` (`ch01-corr-002` carrying its recorded "apparent weight" qualification), both with `approvals.scientificReviewer: null` by explicit project-owner instruction. Every substantive scientific claim in both drafts was independently re-reviewed across the full sequence (`PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md`, `PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md`, `PHSH111_BATCH1_ENGLISH_BASELINE_DECISION_BRIEF.md`) with no scientific defect remaining open at any point in this final pass.

## 9. Editorial-review basis

No open editorial defect. Two required revisions (a notation-consistency bridge in `ch01-t01`, a significant-figure/rounding reconciliation and an unmodeled-field removal in `ch01-t04`) were identified, applied, and independently re-verified closed across `PHSH111_BATCH1_ENGLISH_DRAFT_REVISION_REPORT.md` and `PHSH111_BATCH1_T04_SCHEMA_CLOSURE_REPORT.md`. Only optional, non-blocking notes remain (§12).

## 10. Rights-safety basis

Every record in both files was independently classified "clearly newly authored" across two separate rights-safety passes (`PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` §20, `PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md` §8). No record was ever classified "revise before approval" or "blocked pending rights review."

## 11. Closed prior findings

| Finding | Status at approval |
|---|---|
| `L`/`T`/`M` dimensional symbols not reconciled with `d`/`t` equation variables (`ch01-t01-block-equations`) | Closed |
| `ch01-prob-104` significant-figure inconsistency | Closed |
| `calculation[0].roundedResult` unmodeled schema field | Closed (removed; content folded into `roundingRule`) |

No required finding remains open for either topic.

## 12. Non-blocking conditions

Recorded in `ENGLISH_BATCH1_BASELINE_APPROVAL.json`'s `perTopicDecision`, **not applied as edits** and **not represented as unresolved scientific defects**:

**`ch01-t01`:**
- Consider refining the distance wording in `ch01-t01-block-equations` to emphasize distance traveled where pedagogically useful.
- Consider adding a simple numeric illustration of `v = d/t` in a future revision, if the audited evidence and topic scope come to support one.

**`ch01-t04`:**
- Consider refining `ch01-t04-block-explanation`'s "ordinary situation" phrasing to specify equilibrium or zero net force where context requires more precision.
- Add the `ch01-term-mass` glossary linkage to `ch01-t04-block-equations`' `glossaryTermIds` after glossary approval and identifier registration.

These may be considered in a future, separate, controlled baseline revision.

## 13. Correction dependencies

Both topics' baseline content is built directly on their respective approved correction:

- `ch01-t01` ← `ch01-corr-001` (`editoriallyApproved`).
- `ch01-t04` ← `ch01-corr-002` (`editoriallyApproved`, with its "apparent weight" qualification, independently re-confirmed present in the draft's own learner-visible prose, not only in governance metadata).

## 14. Identifier-registration status

**Not a prerequisite for this baseline approval, and not performed.** `IDENTIFIER_REGISTRY.json` was read but not modified. The following IDs are recorded as requiring registration **before any future application-integration step**: `ch01-is-101`, `ch01-is-104`, all 12 Batch 1 `contentBlock` IDs, `ch01-prob-104`, and `SRC-CH01-BATCH1-ORIGINAL`. `ch01-t01-visual-001` and `ch01-t04-visual-001` remain explicitly **provisional and unregistered** pending a separate, still-absent visual-production authorization.

## 15. Arabic status

**Not generated, not approved.** Every applicable record in both approved files retains `arabic.translationStatus: "missing"` with null text — independently re-confirmed unchanged by this approval. This baseline approval does not authorize Arabic drafting or translation.

## 16. Glossary dependencies

`ch01-t01` has zero existing glossary coverage — a full glossary-approval pass has not begun. `ch01-t04`'s three relevant terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`) remain `approvalStatus: "pending"` in `BILINGUAL_GLOSSARY.json` (read, not modified) — terminology review must complete before Arabic translation can be finalized for that topic.

## 17. Visual status

**Not produced, not authorized.** Both `visualReference` records (`ch01-t01-block-visual`, `ch01-t04-block-visual`) retain `visualGovernance[0].availabilityStatus: "missing"`. `ch01-t01-visual-001` and `ch01-t04-visual-001` remain provisional identifiers only.

## 18. Application-integration status

**Not authorized, and not currently mechanically possible.** `PILOT_AUTHORIZATION.json`'s `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics, unchanged. `apps/chapter1-mvp/`'s `vite.config.ts` `server.fs.allow` and `src/content/rawImports.ts` remain scoped to `docs/content-design/chapter-01/pilot/` only — `batch1-drafts/` is outside that scope today, independent of any authorization question.

## 19. Independent-review status

No independent human subject-matter (physics) expert has reviewed either topic, at any point in this project's history. This baseline approval is a project-owner content-readiness decision based on Claude's completed work, exactly as every other approval in this project has been — it is not, and is not represented as, independent expert review, and does not reduce or satisfy the separate requirement for one before any student-facing use.

## 20. Governance and publication status

`studentFacingAllowed` remains `false` on every record in both approved files (re-confirmed, 15/15 applicable records). `studentPublicationAuthorized` and `canonicalGenerationAuthorized` remain chapter-wide `false` in `PILOT_READINESS.json` (now v1.6.0). Nothing in this approval changes, sets, or proposes changing any of these flags for any topic. **Publication remains unauthorized.**

## 21. Exact next controlled task

**A Batch 1 Arabic-readiness and glossary decision task**, assessing: the glossary entries `ch01-t01` would need from zero existing coverage; the approval status of `ch01-t04`'s three pending terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`); a translation strategy for the "apparent weight" qualified term specifically; equation- and bidi-isolation requirements (expected to follow the already-proven pilot pattern for both `v = d/t` and `W = mg`); and whether Arabic generation can then be authorized. That task should not generate Arabic itself, and should not recommend application integration.

---

### Explicit statements

- **Both English topic drafts are approved as Batch 1 baseline version 1.0.0.**
- **No independent human expert approval has occurred.**
- **No Arabic content was generated.**
- **No visual was produced.**
- **No application expansion occurred.**
- **No student-facing authorization was granted.**
