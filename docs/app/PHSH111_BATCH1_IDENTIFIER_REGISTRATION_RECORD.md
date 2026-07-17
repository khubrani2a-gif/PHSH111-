# PHSH111 Batch 1 — Identifier Registration Record

**Decision date:** 2026-07-17. **Type:** Identifier-registration and governance-synchronization only.

## 1. Purpose

This document records the registration, in `docs/content-design/chapter-01/IDENTIFIER_REGISTRY.json`, of the exact Batch 1 (`ch01-t01`, `ch01-t04`) content, problem, source-marker, and approved-visual identifiers required before any future application-integration step. **This task does not integrate either topic into the application, does not modify any approved content or visual asset, and does not authorize publication.**

## 2. Registration decision

Register exactly 18 identifiers, derived directly from the approved Batch 1 files: 2 `instructorScript` IDs, 12 `contentBlock` IDs, 1 `problem` ID, 1 shared authorship marker, and 2 approved visual IDs. No glossary-local ID was registered.

## 3. Approval dependencies

| Dependency | Version | Status |
|---|---|---|
| English Batch 1 baseline | 1.0.0 | approved |
| Arabic Batch 1 baseline | 1.0.0 | approved |
| Visual Batch 1 baseline | 1.0.0 | approved |
| `BILINGUAL_GLOSSARY.json` | 1.3.0 | unchanged |
| `PILOT_READINESS.json` (pre-registration) | 1.11.0 | — |
| `IDENTIFIER_REGISTRY.json` (pre-registration) | 1.2.0 | — |

## 4. Files inspected

`IDENTIFIER_REGISTRY.json`, `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `ARABIC_BATCH1_BASELINE_APPROVAL.json`, `VISUAL_BATCH1_APPROVAL.json`, `PILOT_READINESS.json`, `PILOT_AUTHORIZATION.json`, both approved English topic files, both approved Arabic candidate files, both approved SVGs, `PHSH111_BATCH1_ENGLISH_BASELINE_APPROVAL_RECORD.md`, `PHSH111_BATCH1_ARABIC_BASELINE_APPROVAL_RECORD.md`, `PHSH111_BATCH1_VISUAL_APPROVAL_RECORD.md`, and the existing registry namespace/pattern/history precedent (notably the registryVersion 1.1.0 conflict-namespace fix, used as the precedent for this task's own namespace additions).

Independently verified before registration:

- All three Batch 1 baselines (English, Arabic, Visual) are approved at version 1.0.0.
- English and Arabic topic files contain identical instructorScript/contentBlock/problem IDs (programmatically diffed — identical).
- Both approved SVG checksums match `VISUAL_BATCH1_APPROVAL.json` exactly.
- No Batch 1 identifier was already registered under another namespace (see §13).
- Application integration remains unauthorized; publication remains unauthorized.

No approved file differed from its baseline checksum, so registration proceeded.

## 5. Complete identifier inventory

18 unique identifiers, exactly matching the expected count:

| # | Identifier | Type | Topic |
|---|---|---|---|
| 1 | `ch01-is-101` | instructorScript | `ch01-t01` |
| 2 | `ch01-t01-block-mainidea` | contentBlock | `ch01-t01` |
| 3 | `ch01-t01-block-explanation` | contentBlock | `ch01-t01` |
| 4 | `ch01-t01-block-equations` | contentBlock | `ch01-t01` |
| 5 | `ch01-t01-block-visual` | contentBlock | `ch01-t01` |
| 6 | `ch01-t01-block-misconception` | contentBlock | `ch01-t01` |
| 7 | `ch01-t01-block-review` | contentBlock | `ch01-t01` |
| 8 | `ch01-is-104` | instructorScript | `ch01-t04` |
| 9 | `ch01-t04-block-mainidea` | contentBlock | `ch01-t04` |
| 10 | `ch01-t04-block-explanation` | contentBlock | `ch01-t04` |
| 11 | `ch01-t04-block-equations` | contentBlock | `ch01-t04` |
| 12 | `ch01-t04-block-visual` | contentBlock | `ch01-t04` |
| 13 | `ch01-t04-block-misconception` | contentBlock | `ch01-t04` |
| 14 | `ch01-t04-block-review` | contentBlock | `ch01-t04` |
| 15 | `ch01-prob-104` | problem | `ch01-t04` |
| 16 | `SRC-CH01-BATCH1-ORIGINAL` | source marker | `ch01-t01`, `ch01-t04` |
| 17 | `ch01-t01-visual-001` | visual | `ch01-t01` |
| 18 | `ch01-t04-visual-001` | visual | `ch01-t04` |

## 6. `ch01-t01` identifiers

`ch01-is-101` (instructorScript) and its six contentBlock IDs: `ch01-t01-block-mainidea` (mainIdea), `ch01-t01-block-explanation` (organizedExplanation), `ch01-t01-block-equations` (equationSet), `ch01-t01-block-visual` (visualReference), `ch01-t01-block-misconception` (misconception), `ch01-t01-block-review` (reviewQuestion). All seven confirmed identical across the approved English and Arabic files and registered once each.

## 7. `ch01-t04` identifiers

`ch01-is-104` (instructorScript) and its six contentBlock IDs: `ch01-t04-block-mainidea` (mainIdea), `ch01-t04-block-explanation` (organizedExplanation), `ch01-t04-block-equations` (equationSet), `ch01-t04-block-visual` (visualReference), `ch01-t04-block-misconception` (misconception), `ch01-t04-block-review` (reviewQuestion). All seven confirmed identical across the approved English and Arabic files and registered once each.

## 8. Problem identifier

`ch01-prob-104`, registered once under the existing `problem` namespace (`^ch01-prob-[0-9]{3}$`), which already covered this pattern. Its `sourceVariants[0].sourceId` references `SRC-CH01-BATCH1-ORIGINAL` (§9).

## 9. Source-marker identifier

`SRC-CH01-BATCH1-ORIGINAL` is registered strictly as a **project-authorship/source-lineage marker**:

- It represents newly authored Batch 1 project content.
- It is **not** an external audited source.
- It is **not** a textbook, slide, review-card, or publisher source.
- It **must not** be treated as independent evidence for any scientific claim.
- Substantive scientific records retain their own audited source and correction lineage (e.g. `SRC-CH01-CONV-001`, `SRC-CH01-PDF-003` as audited sources; `SCA01`, `S3-SCI-004` as scientific-audit records; `ch01-corr-001`, `ch01-corr-002` as correction records) — entirely independent of this marker.

## 10. Visual identifiers and checksums

| Visual ID | Asset path | Checksum |
|---|---|---|
| `ch01-t01-visual-001` | `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001.svg` | `48c73a36fef43644ab810e500045c83777e57ba5bb25d1c1d64f5f887fc67a98` |
| `ch01-t04-visual-001` | `docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001.svg` | `163b5eaa0269ca96943bf136c913bba0b961247da7ab0b68bbbd22b5a475cec6` |

Both checksums taken directly from `VISUAL_BATCH1_APPROVAL.json`. Both entries record: visual baseline version 1.0.0, project-owner approval, independent human visual review incomplete, application integration unauthorized, student-facing use unauthorized, publication unauthorized. Neither SVG nor either validation record was modified.

## 11. English/Arabic identity equivalence

Programmatically compared: the ordered list of `(recordType, id, blockType)` tuples for `ch01-t01` and for `ch01-t04` is identical between the approved English (`batch1-drafts/`) and Arabic (`batch1-arabic-drafts/`) files. English and Arabic candidate files represent the same canonical record identities — each identifier was registered **once**, not once per language.

## 12. Glossary-local identifier exclusion

None of the nine Batch 1 glossary term IDs (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`, `ch01-term-distance`, `ch01-term-acceleration`) was registered in `IDENTIFIER_REGISTRY.json`. Programmatically confirmed zero overlap between the 18 registered identifiers and this exclusion list. These remain governed exclusively inside `BILINGUAL_GLOSSARY.json`, glossaryVersion 1.3.0, unchanged, preserving the established decision that glossary identifiers are glossary-local.

## 13. Collision and uniqueness checks

- All 18 identifiers are globally unique (programmatically confirmed: 18 entries, 18 unique values).
- Prior to this task, `IDENTIFIER_REGISTRY.json` had **no** namespace type for `instructorScript` or `contentBlock` IDs at all, and its `visual` namespace had no pattern matching the produced-asset convention `ch01-tNN-visual-NNN` (distinct from `ch01-vis-NNN`, which names a `visualResolutionId` planning/audit record, not a produced asset). Two new namespace types (`instructorScript`: `^ch01-is-[0-9]{3}$`; `contentBlock`: `^ch01-t[0-9]{2}-block-[a-z]+$`) and one new pattern within the existing `visual` type (`^ch01-t[0-9]{2}-visual-[0-9]{3}$`) were added, mirroring the exact precedent set by registryVersion 1.1.0's conflict-namespace fix (`^C[0-9]{2}$` added to the existing `conflict` type).
- Collision check performed: every new pattern was checked against every ID actually present in the approved Batch 1 files and against every other registered namespace pattern. `ch01-prob-104` continues to match only the existing `problem` pattern; `SRC-CH01-BATCH1-ORIGINAL` continues to match only the existing `source` pattern; every `instructorScript`/`contentBlock`/visual-asset ID now matches exactly one pattern (its own new one) and matched none previously. No existing registered pattern or ID collides with any of the three additions.
- **No collision with the original four pilot topics.** The four pilot topics' own identifiers (`ch01-is-102`/`103`/`108`/`110`, `ch01-t02`/`t03`/`t08`/`t10-block-*`, `ch01-prob-102`/`103`/`108`/`110`, `ch01-t02`/`t03`/`t08`/`t10-visual-001`) were independently enumerated and confirmed disjoint from every Batch 1 identifier registered here. The four pilot topics' own identifiers remain unregistered as individual entries in this registry (this task registers Batch 1 identifiers only, not a retroactive registration of the pilot topics).
- **No duplicate source-marker entry, no duplicate visual entry.** `SRC-CH01-BATCH1-ORIGINAL` and each visual ID appear exactly once in `batch1IdentifierRegistration.entries`.

## 14. Registry-version change

`IDENTIFIER_REGISTRY.json`: `registryVersion` **1.2.0 → 1.3.0** (minor bump — new registration scope and two new namespace patterns/types, following this registry's own patch-vs-minor convention). All previous registry content (`sourceIds`, `topicIds`, existing `namespaces`, `validationRules`, `validationResult`) preserved unchanged and unreordered; the only in-place edits were: adding one new pattern to the existing `visual` namespace entry, and appending two new namespace-type entries and one `batch1NamespaceAdditions` object to `validationResult`. A new `registrationHistory` entry records this version bump, its scope, identifier count, applicable topics, approval-record dependencies, and restrictions.

## 15. Readiness update

`PILOT_READINESS.json`: `pilotReadinessVersion` **1.11.0 → 1.12.0**. Only the scoped `batch1DraftingReadiness` section was updated: `identifierRegistrationComplete: true`, `identifierRegistrationCompletedAt`, `identifierRegistryVersion: "1.3.0"`, `identifierRegistrationRecordPath`, `totalIdentifiersRegistered: 18`, a breakdown by identifier type, and `glossaryIdsRemainGlossaryLocal: true`. Each topic's own `identifierRegistrationStatus` field was updated from "pending" to "registered," naming its specific registered IDs. Preserved unchanged: `englishBaselineVersion: "1.0.0"`, `arabicBaselineVersion: "1.0.0"`, `visualBaselineVersion: "1.0.0"`, chapter-wide `canonicalGenerationAuthorized: false`, `studentPublicationAuthorized: false`, the original four-topic `pilotTopicOrder`/application scope, and all prior readiness history (including every historical note, none of which was rewritten — a new `identifierRegistrationNote` was appended instead). `applicationIntegrationAuthorized` was **not** set to `true` and remains `false`.

## 16. Independent-review status

**Unchanged, incomplete.** `independentHumanReviewComplete` remains `false`. No independent human visual or scientific review has occurred for either topic or either visual at any point in this project. Registration is a governance bookkeeping action and does not constitute or imply such review.

## 17. Application-integration status

**Unauthorized, unaffected.** `applicationIntegrationAuthorized` remains `false` in both `IDENTIFIER_REGISTRY.json`'s entries and `PILOT_READINESS.json`. No route, import, or registry entry was added anywhere in `apps/chapter1-mvp/`. No application file was read for modification or changed.

## 18. Publication status

**Unauthorized, unaffected.** `publicationState: "unauthorized"` on every registered entry; `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere, chapter-wide and per-record.

## 19. Exact next controlled task

**Create the controlled Batch 1 application-integration authorization** for `ch01-t01` and `ch01-t04`. Integration itself was **not** performed as part of this identifier-registration task.

---

### Explicit statements

- **The identifiers are registered for controlled project use.**
- **Registration does not authorize application integration.**
- **Registration does not authorize student-facing use.**
- **Registration does not constitute independent scientific or visual approval.**
- **Publication remains unauthorized.**
