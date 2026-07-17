# PHSH111 Batch 1 — Visual Approval Record

**Decision date:** 2026-07-17. **Type:** Project-owner internal visual approval only.

## 1. Purpose

This document records the project owner's explicit internal approval of the two Batch 1 visual assets — `ch01-t01-visual-001` and `ch01-t04-visual-001` — as **Visual Batch 1 baseline version 1.0.0**. The full machine-readable record is `docs/content-design/chapter-01/VISUAL_BATCH1_APPROVAL.json`.

**This is project-owner internal visual approval only. It is not:**
- independent human visual or scientific approval
- application-integration authorization
- student-facing authorization
- deployment or publication authorization

## 2. Decision

- **Approve** `ch01-t01-visual-001` as the internal Batch 1 visual baseline.
- **Approve** `ch01-t04-visual-001` as the internal Batch 1 visual baseline.
- **Approve** both together as **Visual Batch 1 version 1.0.0**.

## 3. Approval ID and metadata

| Field | Value |
|---|---|
| Approval ID | `ch01-visual-batch1-approval-001` |
| Visual baseline version | `1.0.0` |
| Status | `approved` |
| Approved by | khubrani2a-gif (project owner) |
| Approved at | 2026-07-17 |
| Applicable topics | `ch01-t01`, `ch01-t04` |
| Approved visual IDs | `ch01-t01-visual-001`, `ch01-t04-visual-001` |

## 4. Pre-approval verification performed

Immediately before this approval, the following were independently re-verified:

| Check | Result |
|---|---|
| `PILOT_AUTHORIZATION.json` version | `1.4.0` — confirmed |
| `PILOT_READINESS.json` version (pre-update) | `1.10.0` — confirmed |
| `ch01-t01-visual-001.svg` valid XML | Confirmed (single root `<svg>`, well-formed) |
| `ch01-t04-visual-001.svg` valid XML | Confirmed (single root `<svg>`, well-formed) |
| Both validation JSON files valid | Confirmed (parse cleanly, `fileChecksumSha256` matches each SVG) |
| `ch01-t01-visual-001.svg` checksum | `48c73a36fef43644ab810e500045c83777e57ba5bb25d1c1d64f5f887fc67a98` — **matches the reviewed checksum exactly** |
| `ch01-t04-visual-001.svg` checksum | `163b5eaa0269ca96943bf136c913bba0b961247da7ab0b68bbbd22b5a475cec6` — **matches the reviewed checksum exactly** |
| All review findings closed | Confirmed — `PHSH111_BATCH1_VISUAL_REVIEW_AND_REVISION_REPORT.md` §9 records "None" |
| No blockers remain | Confirmed |
| English Batch 1 baseline files unchanged | Confirmed (`a445f55d...`, `c876a6fe...`) |
| Arabic Batch 1 baseline files unchanged | Confirmed (`3955df75...`, `d1f5bfbd...`) |
| Application integration | Confirmed unauthorized |
| Publication | Confirmed unauthorized |

Since both SVG checksums matched the reviewed values exactly, approval proceeded. Had either differed, this approval would have stopped without granting approval.

## 5. Dependencies

- **English Batch 1 baseline:** `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion 1.0.0`, `status: approved`.
- **Arabic Batch 1 baseline:** `ARABIC_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion 1.0.0`, `status: approved`.
- **Visual-production authorization:** `PILOT_AUTHORIZATION.json` v1.4.0, `batch1VisualProductionAuthorization`.
- **Production and review reports:** `PHSH111_BATCH1_VISUAL_PRODUCTION_AUTHORIZATION_RECORD.md`, `PHSH111_BATCH1_VISUAL_PRODUCTION_REPORT.md`, `PHSH111_BATCH1_VISUAL_REVIEW_AND_REVISION_REPORT.md`.

## 6. Assessment results

| Category | Result |
|---|---|
| Rights safety | Pass — both assets fully original, independently checked against every cataloged source visual |
| Accessibility | Pass — `role="img"`, full title/desc, contrast thresholds cleared, zero missing `direction` attributes |
| Scientific accuracy | Pass — independently re-verified against approved English/Arabic baselines and applicable corrections |

## 7. Non-blocking conditions (deferred QA, not approval blockers)

- Mobile text at small viewport widths relies on the future application's enlarge/zoom interaction — not a defect in either SVG.
- Cross-browser rendering has only been checked in a single Chromium-based preview browser; must be checked during application-integration QA.
- The brick-red force color (`#b91c1c`) is approved for these two assets only — this approval does not amend `VISUAL_HOUSE_STYLE.md` or establish a chapter-wide palette extension.
- `VISUAL_HOUSE_STYLE.md` itself was not modified and is not amended by this approval.

## 8. Explicit statements

- **This approves the exact reviewed SVG checksums as the internal visual baseline** — `48c73a36fef43644ab810e500045c83777e57ba5bb25d1c1d64f5f887fc67a98` (`ch01-t01-visual-001`) and `163b5eaa0269ca96943bf136c913bba0b961247da7ab0b68bbbd22b5a475cec6` (`ch01-t04-visual-001`).
- **This is not independent human expert approval.**
- **Application integration remains unauthorized.**
- **`studentFacingAllowed` remains `false`.**
- **`studentPublicationAuthorized` remains `false`.**

## 9. Asset preservation

Neither SVG, nor either visual-validation record, was modified, moved, renamed, or rewritten to produce this approval. Both remain exactly as they were after the consolidated review-and-revision pass. Approval is recorded entirely externally, in `VISUAL_BATCH1_APPROVAL.json` and this document, mirroring the same pattern already established by `ENGLISH_BATCH1_BASELINE_APPROVAL.json` and `ARABIC_BATCH1_BASELINE_APPROVAL.json`. No independent-reviewer field (`reviewer`, `reviewedAt`) on either validation record was changed to imply expert review — both remain `null`.

## 10. `PILOT_READINESS.json` update

Updated to `pilotReadinessVersion` **1.11.0**. Only the scoped Batch 1 state (`batch1DraftingReadiness`) was updated to record: both visuals approved by project owner, visual baseline version 1.0.0, this approval record's path, the exact SVG checksums, independent human visual review still incomplete, identifier registration still pending, application integration still unauthorized, student-facing use still unauthorized, publication still unauthorized. `canonicalGenerationAuthorized: false`, `studentPublicationAuthorized: false` (chapter-wide), the original four-topic application scope, and all prior readiness history were preserved unchanged.

## 11. Exact next controlled task

**Register the Batch 1 content, problem, source-marker, and approved visual identifiers required before application integration.** Identifier registration was **not** performed as part of this approval task.

---

### Final confirmations

- Both SVG checksums remain unchanged by this task.
- Both validation records remain unchanged by this task.
- No identifier was registered in `IDENTIFIER_REGISTRY.json`.
- No Git write operation (`add`/`commit`/`push`/merge/PR) occurred.
- No application file, route, test, or package file was changed.
- Publication and application integration remain unauthorized.
