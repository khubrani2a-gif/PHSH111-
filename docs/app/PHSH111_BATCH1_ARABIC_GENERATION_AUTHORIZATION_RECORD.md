# PHSH111 Batch 1 — Arabic Canonical Generation Authorization Record

**Decision date:** 2026-07-17. **Type:** Governance and authorization only. No Arabic content, translation, or visual was generated to produce this record.

> **⚠ CORRECTED 2026-07-17 — see "Correction (2026-07-17)" at the end of this document.** Sections 5, 6, 7, and 8 below, as originally written, contained three material scope defects (an in-place-editing packaging model; "Arabic canonical generation" terminology; a blanket prohibition on any terminology outside the nine Batch 1 glossary terms). They are preserved below unedited, as the historical record of what was originally authorized, but they are **superseded** by the correction section and by `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` v1.3.1's `batch1ArabicGenerationAuthorization`. Do not act on §5/§6/§7/§8 below without reading the correction section first. No Arabic content had been generated under the original, defective version of this authorization.

## 1. Purpose

This document records a controlled, narrowly scoped authorization for a **future** implementation task to generate Arabic canonical text for Batch 1 (`ch01-t01`, `ch01-t04`), now that both topics' prerequisites are complete: the English baseline is approved (`ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`) and all nine Batch 1 glossary actions are project-owner approved (`BILINGUAL_GLOSSARY.json`, `glossaryVersion: "1.3.0"`; see `docs/app/PHSH111_BATCH1_GLOSSARY_APPROVAL_RECORD.md`). **This document authorizes Arabic generation. It does not perform Arabic generation, and it does not authorize Arabic baseline approval, visual production, application expansion, or student-facing publication.**

## 2. Decision date

2026-07-17.

## 3. Authorized topics

Exactly two: `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight). No other Chapter 1 topic is authorized for Arabic generation by this record. `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` v1.2.0's `scope.authorizedTopicIds` (the original four-topic, application-build-authorized set) and `batch1DraftingAuthorization.applicableTopicIds` are unchanged — `ch01-t01`/`ch01-t04` are authorized for Arabic generation under a **new, separate, narrower** section (`batch1ArabicGenerationAuthorization`), not by expanding either existing section.

## 4. Prerequisites independently re-confirmed

Immediately before writing this record:

- `ENGLISH_BATCH1_BASELINE_APPROVAL.json`: `baselineVersion: "1.0.0"`, `status: "approved"`, `scope.applicableTopicIds: ["ch01-t01","ch01-t04"]`, unchanged since its own approval. Both approved draft files' checksums (`ch01-t01`: `a445f55d...`; `ch01-t04`: `c876a6fe...`) re-computed and confirmed identical to the values recorded in that file's `approvedDraftFiles`.
- `BILINGUAL_GLOSSARY.json`: `glossaryVersion: "1.3.0"`. All nine Batch 1 glossary actions confirmed complete: `ch01-term-fundamental-quantity` and `ch01-term-derived-quantity` created and `approved`; `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight` approved from `pending`; `ch01-term-apparent-weight` approved with revision; `ch01-term-distance` and `ch01-term-acceleration` topic-extended. Every one of these nine terms carries `approvalStatus: "approved"` and the relevant Batch 1 `topicId` in `topicIds`, independently re-verified against the live file immediately before this task.
- `PILOT_READINESS.json` (prior to this record, `pilotReadinessVersion: "1.7.0"`): `batch1DraftingReadiness.arabicGenerationAuthorized` was `false`, chapter-wide and per-topic, and `arabicTerminologyPrerequisitesComplete` was `true` — confirming the terminology gate was clear but the generation authorization itself had not yet been granted.
- `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json`: independently re-opened and confirmed every `contentBlock` record's `arabic.translationStatus` still reads `"missing"`, with `text: null` on both `originalArabicText` and `canonicalArabicTranslation`, and that `instructorScript`/`problem` records still omit the `arabic` field entirely — exactly the schema-valid "not generated" state established by `PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md` §7. **No Arabic text exists in either file as of this record.**
- `ARABIC_PILOT_BASELINE_APPROVAL.json`: unchanged, scoped exclusively to the four pilot topics; makes no mention of `ch01-t01`/`ch01-t04`.

## 5. Authorized generation actions ⚠ SUPERSEDED — see Correction section

A future implementation task, once separately initiated, may:

- Inspect the approved English baseline text and the nine approved glossary terms as authoring authority.
- Generate Arabic text for every applicable record in both files, following the per-record-type strategy already documented in `docs/app/PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` §9/§15 (direct translation with glossary enforcement for `instructorScript`, `mainIdea`, `organizedExplanation`, `misconception`, and `reviewQuestion` content; conceptual adaptation of prose combined with exact preservation of mathematical notation for `equationSet` and `numberedSolution` content; a natural Arabic instructional rewrite, not a literal translation, for `problem.problemStatement`, matching the process already used for the four pilot topics' own problems).
- Populate each `contentBlock` record's existing `arabic.originalArabicText.text` and `arabic.canonicalArabicTranslation.text` fields, moving `arabic.translationStatus` from `"missing"` to `"draft"`.
- Add an equivalent `arabic` field to `instructorScript` and `problem` records (schema-optional, intentionally omitted at English-drafting time per `PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md` §7), using the same `originalArabicText`/`canonicalArabicTranslation`/`translationStatus: "draft"`/`translationReviewer: null` shape.
- Populate each record's `arabic.glossaryTermIds` with the exact approved `termId` values actually used in that record's Arabic text.
- Apply the equation-isolation and bidi handling already confirmed sufficient in the decision brief's §13/§14 (LTR-isolated spans, italic Latin variables, upright SI units, true superscript exponents, plain-ASCII `x` multiplication) without inventing any new rendering mechanism.
- Preserve `ch01-t04`'s explicit English qualification that "apparent weight" is project-authored interpretive terminology, not verbatim source wording, as an explicit Arabic sentence.
- Create or update validation records for the two edited files, following the existing pilot visual-validation naming convention.
- Run JSON/schema validation against `CANONICAL_DESIGN_SCHEMA.json` `schemaVersion: "2.3.0"` after every edit.
- Create Arabic-generation draft-review documentation.

**This authorization does not itself perform any of the above.** No Arabic text was generated during this task.

## 6. Glossary-enforcement requirement ⚠ SUPERSEDED — see Correction section (the "must match... exactly" / "any concept... not authorized for generation" wording below was too absolute; corrected rule permits ordinary language and other approved terms)

Every Arabic term used by a future generation task must match one of the nine now-approved Batch 1 glossary entries' `approvedArabicTerm.text` exactly:

| termId | Approved Arabic |
|---|---|
| `ch01-term-fundamental-quantity` | الكمية الأساسية |
| `ch01-term-derived-quantity` | الكمية المشتقة |
| `ch01-term-speed` | السرعة |
| `ch01-term-distance` | المسافة |
| `ch01-term-scalar` | كمية قياسية |
| `ch01-term-mass` | الكتلة |
| `ch01-term-weight` | الوزن |
| `ch01-term-apparent-weight` | الوزن الظاهري |
| `ch01-term-acceleration` | التسارع |

`ch01-term-apparent-weight`'s Arabic text must carry the project-authored-terminology framing and misconception warning already recorded in its `usageNotes` (apparent weight is a real, measurable force, not "fake" weight); `discouragedTranslations` on any of the nine terms (e.g., الوزن الحقيقي for apparent weight, الوزن for mass) must not be used. Any concept requiring Arabic vocabulary outside these nine approved terms is not authorized for generation — the affected record must stop and be documented for a separate glossary decision, not resolved ad hoc.

## 7. Schema/localization mechanism ⚠ PARTIALLY SUPERSEDED — see Correction section (the translationStatus "missing"→"draft" mechanism below is still correct; it now applies only to the separate Arabic candidate copy, never to the original English baseline file)

**No schema change was made, needed, or is recommended.** The mechanism a future task must use is the same one `CANONICAL_DESIGN_SCHEMA.json` `schemaVersion: "2.3.0"` already defines and that `PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md` §7 already established for the "not generated" state — this record authorizes moving that same mechanism from `"missing"` to `"draft"`, never directly to `"approved"`:

| Record type | Arabic field | Required? | State this authorization permits |
|---|---|---|---|
| `contentBlock` | `arabic` | Yes | Populate `originalArabicText`/`canonicalArabicTranslation` text; set `translationStatus: "draft"` |
| `instructorScript` | `arabic` | No | May add the field in the same shape, set `translationStatus: "draft"` |
| `problem` | `arabic` | No | May add the field in the same shape, set `translationStatus: "draft"` |

`translationReviewer` must remain `null` and `terminologyApprovalStatus` must not be set to `"approved"` by this generation work — those are review-stage fields, not generation-stage fields.

## 8. Authorized output paths ⚠ SUPERSEDED — see Correction section (in-place editing of the approved English baseline files is no longer authorized; see the corrected authorizedCandidateFiles paths)

**`docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`** and **`docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json`** — the same two existing English-baseline-approved files, edited in place to add Arabic text. No new content file is created by this authorization task itself.

**Why in place, not a separate Arabic-only file:** the Arabic layer belongs in the same bilingual record as its English counterpart, exactly as the four pilot topics already do in `docs/content-design/chapter-01/pilot/` — there is no separate Arabic-only file convention anywhere else in this project, and inventing one here would break that established pattern.

Validation records for the two edited files follow the existing pilot visual-validation naming convention, co-located in the same directory.

## 9. Frozen English text

The approved English text in both files (`localizedContent.en` and all English `instructorScript`/`contentBlock`/`problem` fields) is **read-only source text** for any future Arabic-generation task. It must remain byte-for-byte identical to `ENGLISH_BATCH1_BASELINE_APPROVAL.json`'s `approvedDraftChecksumSha256`-verified content. Any apparent need to change the English text discovered while generating Arabic must stop work and be raised as a separate, controlled English-baseline revision, following `ENGLISH_BATCH1_BASELINE_APPROVAL.json`'s own revision-control pattern — never a silent edit made in passing during Arabic generation.

## 10. Visual-planning boundary

Unchanged from `PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md` §10. A future task may not create SVG or raster files, trace or adapt source visuals, approve visual geometry, or translate `visualReference` specification text beyond its existing internal planning-metadata role. **Visual production requires a separate authorization.**

## 11. Arabic baseline status

**Not approved, and not authorized by this record.** This authorization covers **generation** only. Arabic text produced under it is not a baseline — it would require its own dedicated review-and-approval action, mirroring `ARABIC_PILOT_BASELINE_APPROVAL.json`'s existing pattern (a `baselineVersion`, `status: "approved"`, per-topic `perTopicDecision`, and a `revisionControlPolicy.revisionLog`), before it could be treated as approved source text for anything downstream (visual production or application rendering).

## 12. Application-expansion status

**Not authorized.** `apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` in `PILOT_AUTHORIZATION.json` remains exactly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]`, unchanged by this task. No route, registry entry, or import was added or is authorized for `ch01-t01`/`ch01-t04`.

## 13. Independent-review status

No independent human linguistic or scientific expert has reviewed any of the nine glossary terms, the English baseline, or any future Arabic text generated under this authorization, and none is claimed here. This authorization does not require or imply independent expert review as a precondition for generation, consistent with the same project-owner-editorial-review basis already used throughout this project.

## 14. Publication status

**Unauthorized, unaffected by this record.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` chapter-wide in `PILOT_READINESS.json`, and per-record for all fourteen Chapter 1 topics. Nothing in this authorization changes, sets, or proposes changing either flag for `ch01-t01`, `ch01-t04`, or any other topic.

## 15. Validation requirements

For any future generation task performed under this authorization:

- Every edited record must remain valid against `CANONICAL_DESIGN_SCHEMA.json` `schemaVersion: "2.3.0"` after Arabic fields are populated.
- Every Arabic term used must match an approved glossary entry exactly (§6); no unapproved synonym or discouraged translation may be used.
- `arabic.translationStatus` must read `"draft"` (never `"approved"`) on every newly populated record.
- The frozen English text (§9) must be re-checksummed and confirmed unchanged before and after the work.
- Any new scientific or terminological ambiguity discovered during generation must stop work on the affected record and be documented for a separate review — never silently resolved as an implicit new glossary term.

## 16. Exact next controlled task

The next controlled task, if the project owner chooses to proceed, is the **actual Arabic-generation task itself** — populating the Arabic fields in `ch01-t01-content.json` and/or `ch01-t04-content.json`, under the scope, actions, and constraints authorized in this record. That task is separate from this one and was not performed here. Following the established project sequence, Arabic generation would in turn be followed by: Arabic baseline approval (§11) → visual specification and production (§10, gated on its own separate authorization) → any eventual, further-separate application-expansion authorization (§12).

---

### Governance statement (explicit, per task requirement)

- **This authorizes Arabic generation, not Arabic baseline approval.** No Arabic text produced under this authorization is itself a baseline or is treated as approved by virtue of this authorization existing.
- **This does not authorize visual production.** Only textual visual-specification planning metadata, already existing, remains permitted.
- **This does not authorize application expansion.** `apps/chapter1-mvp/`'s authorized topic scope is unchanged.
- **This does not authorize student-facing publication.** `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere.
- **No independent human scientific review has occurred**, at this stage or any prior stage of this project.

---

## Correction (2026-07-17)

**Type:** Governance-repair correction, applied additively. Nothing above this section was deleted or rewritten — it is preserved as the historical record of what was originally authorized. This correction was applied **before any Arabic content had been generated** under the original version — independently re-verified: both `ch01-t01-content.json` and `ch01-t04-content.json` still showed every `contentBlock.arabic.translationStatus: "missing"` with null text, and no `docs/content-design/chapter-01/batch1-arabic-drafts/` directory existed, at the time this correction was written.

### What was wrong

Three material scope defects in §5–§8 above:

1. **§8's authorized output paths named the two approved English baseline files themselves** (`docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json`) as the location to **edit in place** to add Arabic text. This risked silently mutating an approved, checksum-referenced baseline file (`ENGLISH_BATCH1_BASELINE_APPROVAL.json`'s `approvedDraftFiles[].sha256`) during Arabic-generation work, with no separate, immutable original preserved.
2. **The document's own title and §5/§6/§15 repeatedly described the authorized work as "Arabic canonical generation" / "Arabic canonical text."** This blurred the distinction this project has otherwise carefully maintained everywhere else (English baseline vs. draft, Arabic baseline vs. draft) between draft/candidate status and canonical/approved status.
3. **§6 stated "Every Arabic term used... must match one of the nine now-approved Batch 1 glossary entries... exactly"** and **§6's closing sentence stated "Any concept requiring Arabic vocabulary outside these nine approved terms is not authorized for generation."** Read literally, this prohibited using any of the seven already-approved pilot-topic glossary terms (e.g. `ch01-term-velocity`, `ch01-term-period`) if they happened to be relevant, and — far more consequentially — prohibited writing any ordinary Arabic sentence containing a word not itself one of the nine terms, which is not achievable for continuous prose and was never the intended rule.

### Corrected packaging model

The approved English baseline files (`docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`, sha256 `a445f55d...`; `ch01-t04-content.json`, sha256 `c876a6fe...`) are **immutable** and must never be edited by any future Arabic-generation task, in place or otherwise.

The only authorized Arabic candidate output paths are now:

- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json`
- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json`

A future generation task must: (1) verify both approved English files' checksums before starting; (2) create the new `batch1-arabic-drafts/` directory; (3) create each candidate file as a structural copy of its English counterpart, preserving every English field byte-for-byte, every record ID, record order, and every source/audit/correction/visibility/governance field, populating only the Arabic localization structures; (4) after generation, re-verify the two original `batch1-drafts/` files are still byte-identical to their recorded checksums, and verify the English portions inside the new candidate copies match the approved baseline exactly; (5) fail the task if English content changed anywhere.

**Overlay model considered and not used:** `CANONICAL_DESIGN_SCHEMA.json` schemaVersion 2.3.0 stores English and Arabic fields co-located on the same record (`contentBlock.localizedContent.en` beside `contentBlock.arabic`), exactly as already proven in the four pilot topics' single bilingual files. Nothing in the schema demonstrably prevents a full structural copy with only the `arabic` sub-object populated — so the separate-full-copy model is used, per this correction's own instruction to prefer it unless an overlay is demonstrably required.

### Corrected canonical-versus-draft terminology

Every use of "Arabic canonical generation" / "Arabic canonical content generation" in the superseded sections above is replaced by **"controlled Arabic candidate-draft generation"** / **"Arabic draft generation."**

**Arabic candidate generation is authorized; Arabic canonical or baseline approval is not.** No content produced under this authorization — corrected or original — is ever canonical, approved, or promoted by virtue of this authorization existing. A separate, future `ARABIC_BATCH1_BASELINE_APPROVAL.json`-style record, mirroring `ARABIC_PILOT_BASELINE_APPROVAL.json`'s existing pattern, remains required before any Arabic text produced here could be treated as approved.

### Corrected glossary-enforcement rule

Replacing §6's absolute rule:

- The nine Batch 1 glossary decisions (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`, `ch01-term-distance`, `ch01-term-acceleration`) are **mandatory wherever their specific concept appears** — their `approvedArabicTerm.text` must be used exactly, and their `discouragedTranslations` must not be substituted.
- **Any other glossary term already approved in `BILINGUAL_GLOSSARY.json`** (e.g. `ch01-term-velocity`, `ch01-term-free-fall`, `ch01-term-centripetal-acceleration`, `ch01-term-period`, `ch01-term-frequency`) **may also be used** wherever its concept is genuinely relevant.
- **Ordinary Arabic language does not require glossary registration** — e.g. "time"/الوقت أو الزمن, already resolved as needing no glossary entry in `PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md` §4/§7.
- **Mathematical symbols and SI units remain untranslated**, per §13/§14 above, unchanged by this correction.
- **A new controlled scientific term may not be introduced as canonical terminology without a separate glossary decision** — a future task may not coin a novel Arabic phrase and present it as the project's official rendering of a physics concept without going through the same create/approve process already used for the nine Batch 1 terms.
- **An unregistered ordinary explanatory phrase is permitted when it does not function as a new canonical scientific term** — the distinction is between coining official vocabulary (prohibited without a glossary decision) and writing ordinary explanatory prose (permitted).

**Preserved unchanged by this correction:** apparent weight's primary term remains **الوزن الظاهري**; **قراءة الميزان** remains usable as a supporting explanatory phrase; **الوزن الحقيقي** remains discouraged and must not be used as the preferred contrast term.

### Translation-status mechanism — unaffected

§7's `translationStatus: "missing" → "draft"` mechanism (never directly to `"approved"`) remains correct and is independently re-confirmed as both schema-valid (`CANONICAL_DESIGN_SCHEMA.json`'s `translationStatus` enum: `["notRequired", "missing", "sourceSuppliedOnly", "draft", "reviewed", "approved"]`) and the exact precedent already used in all four pilot topics' own Arabic content (`translationStatus: "draft"` appears on every applicable record in `ch01-t02-content.json`/`ch01-t03-content.json`/`ch01-t08-content.json`/`ch01-t10-content.json`). This correction changes only **where** that transition may occur: exclusively inside the new `batch1-arabic-drafts/` candidate copies, never inside the original `batch1-drafts/` English baseline files, which must retain their existing `"missing"` representation untouched.

### Governance-version cross-reference

This correction is formalized as `PILOT_AUTHORIZATION.json` **v1.3.1** (`authorizationHistory` entry `"action": "corrected"`) and `PILOT_READINESS.json` **v1.8.1**. Both are patch-version increments, not minor bumps, following this project's own precedent of using patch versions for corrections to an already-approved record (`ENGLISH_PILOT_BASELINE_APPROVAL.json` / `ARABIC_PILOT_BASELINE_APPROVAL.json`'s `1.0.0 → 1.0.1 → 1.0.2` revision pattern) — this is a correction of the 1.3.0/1.8.0 grant, not a new grant of scope. See `docs/app/PHSH111_BATCH1_ARABIC_AUTHORIZATION_CORRECTION_RECORD.md` for the complete, dedicated correction record.

### What remains unchanged

`applicableTopicIds` (`ch01-t01`, `ch01-t04` only), the prerequisite gates (English baseline approved, glossary complete), the equation/bidi rendering rules (§13/§14 of the decision brief), the visual-production/application-expansion/publication prohibitions, and the requirement that no independent human expert review is claimed — none of these were defective and none is changed by this correction.

---

## Ratification (2026-07-17)

**Type:** Explicit project-owner ratification, applied additively. Nothing above this section was deleted or rewritten — both the original authorization text (§1–§16) and the earlier Correction section are preserved as the historical record. This ratification was applied **before any Arabic content had been generated** and **before any `docs/content-design/chapter-01/batch1-arabic-drafts/` directory existed** — both independently re-verified immediately beforehand (every `contentBlock.arabic.translationStatus` in the two approved English files still `"missing"`; the candidate directory absent).

### Governance history, recorded transparently

- **The initial authorization (PILOT_AUTHORIZATION.json v1.3.0, and §1–§16 of this record) was created before the project owner had issued the intended explicit authorization decision.** It was drafted as a controlled amendment, but the explicit project-owner "I authorize this" decision had not yet been supplied at that point.
- **Version 1.3.1 corrected that authorization's three technical defects** (in-place editing of the immutable English baseline; "Arabic canonical generation" terminology; the blanket non-glossary-terminology prohibition) — see the Correction section above. That was a *correction* task; it repaired the text but was still not, itself, the explicit project-owner ratification.
- **This ratification supplies the explicit project-owner decision.** The project owner explicitly authorizes controlled Arabic candidate-draft generation for `ch01-t01` and `ch01-t04` under the corrected v1.3.1 model. Formalized as PILOT_AUTHORIZATION.json **v1.3.2** and PILOT_READINESS.json **v1.8.2**.
- **The corrected packaging and restrictions remain unchanged.** Ratification changes no technical scope, output path, glossary-enforcement rule, or restriction established at v1.3.1 — it changes only the governance status from "technically corrected but not yet explicitly ratified" to "explicitly ratified by the project owner."
- **No Arabic content was generated before ratification**, and no Arabic candidate directory existed before ratification.

### What is now ratified

Controlled Arabic candidate-draft generation for `ch01-t01` and `ch01-t04`, producing separate candidate files at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json`, leaving the approved English baseline files at `docs/content-design/chapter-01/batch1-drafts/` immutable, under the corrected glossary-enforcement rule (nine Batch 1 terms mandatory where applicable; other approved glossary terms and ordinary Arabic language permitted; no new canonical term without a separate glossary decision) and the `translationStatus: "missing" → "draft"` mechanism, in the candidate copies only.

### What ratification still does not authorize

Arabic baseline approval, canonical promotion of any candidate content, modification of the approved English baseline files, visual production, application integration, deployment, student-facing use, and publication all remain **unauthorized**. No independent human scientific or linguistic review is claimed or implied — it remains **incomplete**. See the dedicated `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_RATIFICATION_RECORD.md` for the complete ratification record.
