# PHSH111 Batch 1 — Arabic Candidate-Draft Generation Ratification Record

**Ratification date:** 2026-07-17. **Type:** Explicit project-owner ratification only. No Arabic content was generated to produce this record, and none had been generated before it.

## 1. Purpose

This document records the **explicit project-owner ratification** of the corrected Batch 1 Arabic candidate-draft generation authorization for `ch01-t01` and `ch01-t04`. It supplies the explicit authorization decision that was missing when the authorization was first drafted (v1.3.0) and that the subsequent technical correction (v1.3.1) did not itself constitute. **This is a governance-ratification decision only. It does not generate any Arabic content, does not create any candidate file or directory, and does not change the corrected technical scope in any way.**

## 2. Background

The Batch 1 Arabic-generation authorization moved through three prior stages before this ratification:

1. **v1.3.0 (drafted authorization).** A controlled amendment to `PILOT_AUTHORIZATION.json` added `batch1ArabicGenerationAuthorization` for `ch01-t01`/`ch01-t04`, following the approved English baseline (v1.0.0) and the completed glossary reconciliation (v1.3.0). This was created **before the project owner had issued the intended explicit authorization decision.**
2. **v1.3.1 (technical correction).** A governance-repair task corrected three material defects in the v1.3.0 text — an in-place-editing packaging model, "Arabic canonical generation" terminology, and a blanket prohibition on non-glossary terminology. See `docs/app/PHSH111_BATCH1_ARABIC_AUTHORIZATION_CORRECTION_RECORD.md`. This repaired the authorization but was a *correction* task, **not the explicit project-owner ratification itself.**
3. **v1.3.2 (this ratification).** The explicit project-owner decision authorizing the corrected scope.

## 3. Original unconfirmed authorization state (v1.3.0)

At v1.3.0, `batch1ArabicGenerationAuthorization` existed and named `ch01-t01`/`ch01-t04`, but: (a) it had been created without a confirmed explicit project-owner authorization prompt; and (b) it carried three technical defects (§4 of the correction record). No Arabic content was generated under it. The v1.3.0 text is preserved unedited in `PILOT_AUTHORIZATION.json`'s `authorizationHistory` (the `1.3.0` entry) and in `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_AUTHORIZATION_RECORD.md` (§1–§16, flagged as superseded).

## 4. Technical correction state (v1.3.1)

v1.3.1 corrected the three defects, before any Arabic content had been generated:

1. **Packaging:** in-place editing of the approved English baseline files → separate immutable-original / candidate-copy model, with candidate output at `docs/content-design/chapter-01/batch1-arabic-drafts/`.
2. **Terminology:** "Arabic canonical generation" → "controlled Arabic candidate-draft generation," with the explicit statement that Arabic candidate generation is authorized while Arabic canonical or baseline approval is not.
3. **Glossary enforcement:** blanket prohibition on any terminology outside the nine Batch 1 records → the nine mandatory where applicable, other already-approved glossary terms permitted, ordinary Arabic language permitted without registration, no new canonical term without a separate glossary decision.

v1.3.1 was a correction task and did not itself supply the explicit project-owner ratification.

## 5. Explicit project-owner decision

**The project owner (khubrani2a-gif) explicitly authorizes controlled Arabic candidate-draft generation for `ch01-t01` and `ch01-t04`, under the corrected authorization model recorded at `PILOT_AUTHORIZATION.json` v1.3.1 (`batch1ArabicGenerationAuthorization`), `PILOT_READINESS.json` v1.8.1, and `docs/app/PHSH111_BATCH1_ARABIC_AUTHORIZATION_CORRECTION_RECORD.md`.**

**Decision date:** 2026-07-17. **Decision type:** explicit project-owner governance ratification (not an independent human scientific or linguistic review, which remains incomplete). This ratification is formalized as `PILOT_AUTHORIZATION.json` v1.3.2 (`batch1ArabicGenerationAuthorization.projectOwnerRatification`, `authorizationHistory` entry `1.3.2` `"action": "ratified"`) and `PILOT_READINESS.json` v1.8.2.

## 6. Ratified topics

Exactly two: `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight). No other Chapter 1 topic is ratified for Arabic candidate-draft generation by this record. `scope.authorizedTopicIds`, `applicationBuildAuthorization.applicableTopicIds`, and `batch1DraftingAuthorization.applicableTopicIds` in `PILOT_AUTHORIZATION.json` are all unchanged.

## 7. Ratified authorization scope

**Controlled Arabic candidate-draft generation only.** A future generation task, under this ratified authorization, may create separate Arabic candidate copies of the two approved English baseline files, populate only the Arabic localization structures in those copies (moving `arabic.translationStatus` from `"missing"` to `"draft"`), enforce the nine Batch 1 glossary terms where their concepts appear while using other already-approved glossary terms and ordinary Arabic language as appropriate, and apply the established equation/bidi rendering rules. **Arabic candidate generation is authorized; Arabic canonical or baseline approval is not.** The full allowed/prohibited action lists are those of the corrected v1.3.1 `batch1ArabicGenerationAuthorization` section, unchanged by this ratification.

## 8. English-baseline dependency and checksums

Dependency: `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`, `status: "approved"`. Both approved draft files' checksums were re-computed immediately before this ratification and confirmed identical to the recorded values — **no drift**:

| File | sha256 |
|---|---|
| `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` | `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9` |
| `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` | `c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b` |

## 9. Glossary dependency

`BILINGUAL_GLOSSARY.json`, `glossaryVersion: "1.3.0"`, all nine Batch 1 glossary actions approved (two created: `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`; four pending approved: `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`; one approved with revision: `ch01-term-apparent-weight`; two topic-extended: `ch01-term-distance`, `ch01-term-acceleration`). Re-confirmed unchanged at ratification. This ratification does not modify the glossary.

## 10. Authorized candidate output paths

- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json`
- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json`

Co-located validation records follow the existing pilot visual-validation naming convention in the same new directory. Neither the directory nor its files exist yet — confirmed by direct filesystem check immediately before this ratification. This ratification does not create them.

## 11. Immutable English-baseline restriction

The two approved English baseline files at `docs/content-design/chapter-01/batch1-drafts/` (`ch01-t01-content.json`, `ch01-t04-content.json`) are **immutable** and must never be edited by the Arabic candidate-draft generation task, in place or otherwise. A future task must verify their checksums before generation, and re-verify them byte-identical after generation, failing if either changed. This restriction is unchanged from v1.3.1 and is reaffirmed by this ratification.

## 12. Arabic translation-status requirements

In the candidate copies only, each `contentBlock.arabic.translationStatus` moves from `"missing"` to `"draft"` (never directly to `"approved"`); `instructorScript` and `problem` records may gain an equivalent `arabic` field in the same `"draft"` shape. `translationReviewer` remains `null` and `terminologyApprovalStatus` is not set to `"approved"` by generation work. `"draft"` is an established, schema-valid `translationStatus` enum value (`CANONICAL_DESIGN_SCHEMA.json`) and the exact status already used across all four pilot topics' Arabic content. The original English baseline files retain their existing `"missing"` representation, untouched.

## 13. Prohibited actions

Unchanged from the corrected v1.3.1 authorization and reaffirmed here: no modification of the approved English baseline files; no Arabic baseline approval; no canonical promotion of candidate content; no setting of `translationStatus`/`terminologyApprovalStatus` to `"approved"`; no glossary modification; no coining of a new canonical scientific term without a separate glossary decision; no visual production; no application-route/topic-registry expansion or rendering inside `apps/chapter1-mvp/`; no deployment, student release, or publication; no claim of independent expert review; no generation for any topic outside `ch01-t01`/`ch01-t04`; no schema-version change; no modification of `docs/content-audits/`; no machine translation in place of authored text; and no Git staging/commit/push.

## 14. Arabic-baseline status

**Unapproved.** No `ARABIC_BATCH1_BASELINE_APPROVAL.json`-style record exists or is created by this ratification. Arabic candidate-draft text, once generated under this authorization, would still require a separate, future Arabic baseline-approval action (mirroring `ARABIC_PILOT_BASELINE_APPROVAL.json`'s pattern) before it could be treated as approved. `PILOT_READINESS.json`'s `arabicBaselineApproved` remains `false`.

## 15. Visual and application status

**Both unauthorized, unchanged by this ratification.** `visualProductionAuthorized` and `applicationExpansionAuthorized` remain `false` for both topics. `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics. No SVG/raster asset, no route, no registry entry, and no import is authorized for `ch01-t01`/`ch01-t04`.

## 16. Independent-review status

**Incomplete.** No independent human subject-matter (physics) or linguistic expert has reviewed the English baseline, the nine glossary terms, or any future Arabic candidate text, and none is claimed here. This ratification is an explicit project-owner governance decision, consistent with the same project-owner-decision basis used throughout this project's history — it does not constitute, imply, or substitute for independent expert review.

## 17. Publication status

**Unauthorized, unaffected by this ratification.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` chapter-wide and per-record for all fourteen Chapter 1 topics. Chapter-wide `canonicalGenerationAuthorized` remains `false`. Nothing in this ratification changes, sets, or proposes changing any of these flags.

## 18. Validation results

- Both modified JSON files (`PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`) parse as valid JSON after editing.
- `PILOT_AUTHORIZATION.json` `authorizationVersion` is `1.3.2`; `PILOT_READINESS.json` `pilotReadinessVersion` is `1.8.2`.
- `batch1ArabicGenerationAuthorization.applicableTopicIds` and `batch1DraftingReadiness.topics[].topicId` confirm the ratified authorization applies only to `ch01-t01` and `ch01-t04`.
- The project-owner ratification is explicit: `batch1ArabicGenerationAuthorization.projectOwnerRatification.status: "granted"`, `ratifiedBy: "khubrani2a-gif (project owner)"`, plus an `authorizationHistory` `1.3.2` entry with `"action": "ratified"`.
- The corrected packaging model is unchanged: `authorizedOutputPaths.primary`, `packagingModel`, `glossaryEnforcement`, and the prohibition on editing `batch1-drafts/` are all as established at v1.3.1.
- Output paths point only to `docs/content-design/chapter-01/batch1-arabic-drafts/`.
- Both English baseline checksums re-verified unchanged (`a445f55d...`, `c876a6fe...`).
- `BILINGUAL_GLOSSARY.json` re-confirmed unchanged, still `glossaryVersion: "1.3.0"`.
- No `docs/content-design/chapter-01/batch1-arabic-drafts/` directory or file exists — confirmed after editing.
- No Arabic content was generated at any point during this ratification (both approved English files still show every `arabic.translationStatus: "missing"`).
- `arabicBaselineApproved`, `arabicContentGenerated`, `arabicCandidateFilesExist`, and `arabicCandidateDirectoryExists` all remain `false`; `canonicalGenerationAuthorized` and `studentPublicationAuthorized` remain `false`.
- The three current-state documents (`PHSH111_CHAPTER1_EXPANSION_PLAN.md`, `PHSH111_INTERNAL_PILOT_CHECKPOINT.md`, `PHSH111_APP_HANDOFF.md`) were each updated with an additive, dated ratification entry.
- No Git write operation (add, commit, push, or any other) was run during this ratification.

## 19. Exact next controlled task

**Generate the two controlled Arabic candidate drafts** at:

- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json`
- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json`

using English Batch 1 baseline v1.0.0 as immutable source, glossary v1.3.0, the corrected and now-ratified authorization (`PILOT_AUTHORIZATION.json` v1.3.2's `batch1ArabicGenerationAuthorization`), and the established equation/bidi rules (`PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` §13/§14). **This ratification does not perform that generation.**

---

### Explicit statements

- **Arabic candidate-draft generation is now explicitly authorized by the project owner** for `ch01-t01` and `ch01-t04`.
- **No Arabic baseline approval is granted** by this ratification.
- **No Arabic candidate content was generated during ratification**, and none existed before it.
- **The approved English baseline files remain immutable** and byte-identical to their recorded checksums.
- **Publication remains unauthorized.**
