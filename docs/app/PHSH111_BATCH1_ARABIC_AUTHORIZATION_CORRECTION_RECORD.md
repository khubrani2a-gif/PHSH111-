# PHSH111 Batch 1 — Arabic Authorization Correction Record

**Correction date:** 2026-07-17. **Type:** Governance-repair correction only. No Arabic content was generated to produce this record, and none had been generated before it.

## 1. Purpose

This document records a controlled correction to the Batch 1 Arabic-generation authorization (`docs/content-design/chapter-01/PILOT_AUTHORIZATION.json`'s `batch1ArabicGenerationAuthorization` section, originally added in v1.3.0, and its accompanying `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_AUTHORIZATION_RECORD.md`) before any Arabic content was generated under it. Three material scope defects were identified and fixed. **This is a correction of an existing authorization, not a new grant of scope, and it does not itself generate any Arabic content.**

## 2. Defects identified

1. **In-place editing of the approved English baseline files.** The original authorization named `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json` — the same two files approved as Batch 1 English baseline v1.0.0 — as the location to edit in place to add Arabic text. This risked silently mutating an approved, checksum-referenced file with no separate immutable original preserved.
2. **"Arabic canonical generation" terminology.** The original authorization's title, scope note, and action descriptions repeatedly used "Arabic canonical generation" / "Arabic canonical text," which blurs the draft-versus-canonical distinction this project otherwise carefully maintains (as with the English baseline, where drafting and baseline approval are always kept as two separate, explicit steps).
3. **Absolute prohibition on non-glossary terminology.** The original authorization stated Arabic terms "must match one of the nine now-approved Batch 1 glossary entries... exactly" and that "any concept requiring Arabic vocabulary outside these nine approved terms is not authorized for generation." Read literally, this prohibited both the seven already-approved pilot-topic glossary terms and all ordinary Arabic prose vocabulary not itself one of the nine terms — an unworkable and unintended rule.

## 3. Files inspected

Read completely before making any change: `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json`, `docs/content-design/chapter-01/PILOT_READINESS.json`, `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_AUTHORIZATION_RECORD.md`, `docs/content-design/chapter-01/ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`, `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json`, `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json`, `docs/app/PHSH111_BATCH1_GLOSSARY_APPROVAL_RECORD.md`, `docs/app/PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md`, `docs/app/PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md`, `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md`, `docs/app/PHSH111_INTERNAL_PILOT_CHECKPOINT.md`, `docs/app/PHSH111_APP_HANDOFF.md`, all four bilingual pilot topic files under `docs/content-design/chapter-01/pilot/`, and `CANONICAL_DESIGN_SCHEMA.json`'s `translationStatus` enum definition and localization `$defs`.

## 4. English-baseline immutability decision

**Decision: the two approved English baseline files are immutable and must never be edited by the Arabic-generation task, in place or otherwise.**

Independently re-verified checksums, both before this correction and matching the values recorded at original v1.3.0 authorization time:

| File | sha256 |
|---|---|
| `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` | `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9` |
| `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` | `c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b` |

Both match `ENGLISH_BATCH1_BASELINE_APPROVAL.json`'s `approvedDraftFiles[].sha256` exactly. **No drift was found.** Both files' `contentBlock.arabic.translationStatus` still reads `"missing"` on every record, with `text: null`, confirming no Arabic content exists in either file as of this correction.

## 5. Corrected packaging model

The approved English baseline files remain the read-only source of truth. A future Arabic-generation task creates **separate, new candidate files** — full structural copies of the approved English structure — and populates only the Arabic localization fields in those copies. The English baseline files are never touched.

**Copying mechanism:** a structural deep copy of the approved English JSON (file-level `topicId`/`topicTitle`/`records` array, in the same order), preserving every English field byte-for-byte, every record ID (`instructorScriptId`, `blockId`, `problemId`), and every source/audit/correction/visibility/governance field (`provenanceLinks`, `sourceTraceability`, `scientificCorrectionIds`, `conflictRecordIds`, `duplicateHandling`, `blocking`, `contentLeakTestStatus`, `visualReferenceIds`, `visualGovernance`) exactly as they appear in the approved file. Only each record's `arabic` sub-object is populated in the copy.

**Overlay model considered and rejected:** an overlay model (a separate Arabic-only file cross-referencing the English file by record ID, without duplicating English content) was considered, per this correction's own instruction not to authorize an overlay unless the schema demonstrably cannot support separate bilingual candidate copies. `CANONICAL_DESIGN_SCHEMA.json` schemaVersion 2.3.0 stores English and Arabic fields co-located on the same record object — the four pilot topics already prove a full bilingual record is schema-valid and renders correctly. Nothing in the schema prevents a full structural copy of that same record shape with only the `arabic` sub-object populated. No schema barrier to the separate-full-copy model was found, so the full-copy model is authorized instead of an overlay.

## 6. Corrected output paths

**Authorized Arabic candidate output paths (replacing the original in-place paths):**

- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json`
- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json`

**Explicitly not authorized as an edit target:** `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json` — these remain read-only source text.

**Why a new, separate directory** rather than `batch1-drafts/` (would risk conflating draft-English and candidate-Arabic governance states in one directory) or `pilot/` (already scoped exactly to the four build-authorized topics): a clearly separate directory makes the English-immutable / Arabic-candidate distinction structurally obvious, mirroring the same reasoning `batch1-drafts/` itself used relative to `pilot/` when it was first authorized.

Neither `docs/content-design/chapter-01/batch1-arabic-drafts/` nor its two files exist yet — independently confirmed by direct filesystem check immediately before this correction. This correction does not create them.

## 7. Canonical-versus-draft terminology correction

Every use of "Arabic canonical generation" / "Arabic canonical content generation" in the original authorization and its record is replaced with **"controlled Arabic candidate-draft generation"** / **"Arabic draft generation."**

**Stated explicitly, per this correction's own requirement: Arabic candidate generation is authorized; Arabic canonical or baseline approval is not.**

The authorization does not permit: canonical promotion of any Arabic candidate content; Arabic baseline approval; describing any Arabic candidate text as "approved Arabic content"; publication; or student-facing use. A separate, future `ARABIC_BATCH1_BASELINE_APPROVAL.json`-style record, mirroring `ARABIC_PILOT_BASELINE_APPROVAL.json`'s existing pattern, remains required before any Arabic candidate text could be treated as an approved baseline.

## 8. Glossary-enforcement correction

**Corrected rule, replacing the original absolute prohibition:**

- The nine Batch 1 glossary decisions (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`, `ch01-term-distance`, `ch01-term-acceleration`) are **mandatory wherever their specific concept appears** in a Batch 1 record's Arabic text.
- **All other glossary terms already approved in `BILINGUAL_GLOSSARY.json`** may also be used wherever their concept is genuinely relevant (none is currently expected to be needed given the two topics' approved English content, but none is prohibited).
- **Ordinary Arabic language does not require glossary registration** — e.g. "time," already independently resolved as needing no glossary entry (`PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md` §4/§7).
- **Mathematical symbols and SI units remain untranslated**, per the decision brief's own §13/§14 rules — unchanged by this correction.
- **A new controlled scientific term may not be introduced as canonical terminology without a separate glossary decision** — a future generation task may not coin a novel Arabic phrase and present it as the project's official rendering of a physics concept without a dedicated create/approve step, following the same pattern already used for the nine Batch 1 terms.
- **An unregistered ordinary explanatory phrase is permitted when it does not function as a new canonical scientific term** — the operative distinction is between coining official vocabulary (requires a glossary decision) and writing ordinary explanatory prose (does not).

**Preserved exactly, per this correction's explicit requirement:**
- Apparent weight's primary Arabic term remains **الوزن الظاهري**.
- **قراءة الميزان** remains usable as a supporting explanatory phrase.
- **الوزن الحقيقي** remains discouraged and must not be treated as the preferred contrast term for apparent weight.

## 9. Translation-status verification

Independently re-verified against `CANONICAL_DESIGN_SCHEMA.json`'s actual `arabicSeparation.$def`:

```
"translationStatus": { "enum": ["notRequired", "missing", "sourceSuppliedOnly", "draft", "reviewed", "approved"] }
```

`"draft"` is an established, schema-valid status. It is also the exact status already used, as a live precedent, on every applicable Arabic record across all four pilot topics (`ch01-t02-content.json`, `ch01-t03-content.json`, `ch01-t08-content.json`, `ch01-t10-content.json` — 9 occurrences of `"translationStatus": "draft"` in each). **Result: valid — the authorized `"missing" → "draft"` transition is retained, but now applies only inside the new Arabic candidate copies.** The original English baseline files must retain their existing `"missing"` representation, untouched, since they are never edited by this authorization.

## 10. Authorization-version correction

`docs/content-design/chapter-01/PILOT_AUTHORIZATION.json`: `authorizationVersion` **1.3.0 → 1.3.1** (patch increment). This follows the same patch-versus-minor distinction already established by this project's own baseline-approval records (`ENGLISH_PILOT_BASELINE_APPROVAL.json` / `ARABIC_PILOT_BASELINE_APPROVAL.json`'s `1.0.0 → 1.0.1 → 1.0.2` pattern, used there specifically for corrections to an already-approved record, as distinct from the minor-version bumps used for each new authorization grant, e.g. 1.0.0 → 1.1.0 → 1.2.0 → 1.3.0). A patch increment is correct here because this correction repairs defects within the existing 1.3.0 grant without authorizing anything beyond what 1.3.0 already intended to authorize — no new topic, no new action category, no expanded scope. The `1.3.0` `authorizationHistory` entry is preserved unmodified; a new `1.3.1` entry with `"action": "corrected"` was appended.

## 11. Readiness-version correction

`docs/content-design/chapter-01/PILOT_READINESS.json`: `pilotReadinessVersion` **1.8.0 → 1.8.1** (patch increment, same rationale as §10). `batch1DraftingReadiness` now records: `arabicGenerationModel: "controlledCandidateDraftGeneration"`, `arabicCandidateOutputDirectory: "docs/content-design/chapter-01/batch1-arabic-drafts/"`, `arabicCandidateFilesExist: false` (chapter-level and per-topic), `englishBaselineFilesImmutable: true`, `arabicGenerationCorrectedAt: "2026-07-17"`, and a reference to this correction record. `arabicContentGenerated` remains `false`. `arabicBaselineApproved` remains `false`.

## 12. Governance restrictions

Restated, unchanged by this correction:

- `canonicalGenerationAuthorized` remains chapter-wide `false` in `PILOT_READINESS.json`.
- `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere, chapter-wide and per-record.
- `applicableTopicIds` for Arabic candidate-draft generation remains exactly `ch01-t01` and `ch01-t04` — no topic was added or removed by this correction.
- `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics, unchanged.
- No independent human expert (linguistic or scientific) review is claimed anywhere in this correction or in the authorization it corrects.
- `BILINGUAL_GLOSSARY.json`, `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `IDENTIFIER_REGISTRY.json`, `docs/content-audits/`, and every other file outside this task's allowed-modification list were not modified by this correction.
- No Git operation (init, add, commit, push) was performed.

## 13. Validation results

- Both modified JSON files (`PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`) parse as valid JSON after editing.
- `batch1ArabicGenerationAuthorization.applicableTopicIds` and `batch1DraftingReadiness.topics[].topicId` confirm the authorization applies only to `ch01-t01` and `ch01-t04`.
- `authorizedOutputPaths.primary` in `PILOT_AUTHORIZATION.json` and `arabicCandidateOutputDirectory` in `PILOT_READINESS.json` both point only to `docs/content-design/chapter-01/batch1-arabic-drafts/`.
- `prohibitedActions` in `PILOT_AUTHORIZATION.json` now explicitly lists modification of `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`/`ch01-t04-content.json` as prohibited; `doesNotAuthorize` in `PILOT_READINESS.json` does likewise.
- Both English baseline files' checksums re-verified unchanged: `a445f55d...` (`ch01-t01`), `c876a6fe...` (`ch01-t04`) — identical before and after this correction.
- `BILINGUAL_GLOSSARY.json` re-confirmed unchanged, still `glossaryVersion: "1.3.0"`.
- No `docs/content-design/chapter-01/batch1-arabic-drafts/` directory or file exists — confirmed by direct filesystem check after editing.
- No Arabic content was generated at any point during this correction.
- `arabicBaselineApproved` remains `false` in `PILOT_READINESS.json`.
- `canonicalGenerationAuthorized` remains chapter-wide `false`.
- `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere.
- `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md`, `docs/app/PHSH111_INTERNAL_PILOT_CHECKPOINT.md`, and `docs/app/PHSH111_APP_HANDOFF.md` were each updated with an additive, dated current-state synchronization entry (§9 of this correction's governing task).
- No Git operation (status, diff, add, commit, push, or any other) was run during this correction.

## 14. Exact next controlled task

**Generate the two controlled Arabic candidate drafts** under:

- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json`
- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json`

following the corrected packaging model, terminology, and glossary-enforcement rule in `PILOT_AUTHORIZATION.json` v1.3.1's `batch1ArabicGenerationAuthorization` section. **This correction does not perform that generation.**

## 15. Publication statement

This is a governance-repair correction only. No Arabic content was generated, before or during this correction. No `batch1-arabic-drafts/` directory or file was created. The approved English baseline files (`ch01-t01-content.json`, `ch01-t04-content.json`) remain unchanged, byte-identical to their recorded checksums. `BILINGUAL_GLOSSARY.json`, `IDENTIFIER_REGISTRY.json`, `SCIENTIFIC_CORRECTIONS.json`/conflict records, source audits, topic mapping, the four pilot topic files, visual files, application code, tests, and package files were not modified. Arabic baseline approval remains unauthorized. Visual production, application integration, independent expert review, and student-facing publication all remain unauthorized. No Git operation occurred.
