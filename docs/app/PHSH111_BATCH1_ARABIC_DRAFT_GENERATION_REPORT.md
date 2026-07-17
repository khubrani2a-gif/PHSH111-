# PHSH111 Batch 1 — Arabic Candidate-Draft Generation Report

**Generation date:** 2026-07-17. **Type:** Controlled Arabic candidate-draft generation only. These are Arabic candidate drafts, not an approved Arabic baseline. No visual was produced. No application integration occurred. No student-facing authorization was granted. Publication remains unauthorized.

## 1. Purpose and ratified authorization basis

This report records the generation of the two ratified Batch 1 Arabic candidate drafts for `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight), under `PILOT_AUTHORIZATION.json` v1.3.2's `batch1ArabicGenerationAuthorization` (corrected at v1.3.1, explicitly project-owner ratified at v1.3.2 — `projectOwnerRatification.status: "granted"`), `PILOT_READINESS.json` v1.8.2, and `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_RATIFICATION_RECORD.md`. **This task performs controlled Arabic candidate-draft generation only.** It does not approve an Arabic baseline, does not produce a visual, does not integrate application routes, does not authorize student-facing use, and does not permit publication.

## 2. Dependency verification

Independently re-verified immediately before generation:

| Dependency | Verified value |
|---|---|
| `PILOT_AUTHORIZATION.json` version | `1.3.2` |
| Arabic candidate-draft authorization ratified | Yes — `batch1ArabicGenerationAuthorization.projectOwnerRatification.status: "granted"` |
| `PILOT_READINESS.json` version | `1.8.2` |
| English baseline version | `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`, `status: "approved"` |
| Glossary version | `BILINGUAL_GLOSSARY.json`, `glossaryVersion: "1.3.0"` |
| `ch01-t01` English checksum | Matches approved value exactly |
| `ch01-t04` English checksum | Matches approved value exactly |
| Both English source files' Arabic `translationStatus` | `"missing"` on every record (confirmed before generation) |
| `batch1-arabic-drafts/` conflicting files | None — directory did not exist before this task |
| Arabic baseline approval | `false` |
| Visual production authorization | `false` |
| Application integration authorization | `false` |
| Publication authorization | `false` |

All dependencies were consistent; generation proceeded.

## 3. Approved English source files and checksums

| File | sha256 |
|---|---|
| `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` | `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9` |
| `docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json` | `c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b` |

Both re-checksummed after generation and confirmed **byte-identical** to the values above. Neither file was modified.

## 4. Candidate files created

- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` (7 records)
- `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t04-content.json` (8 records)

Both created via a structural deep-copy script (not hand-authored JSON) to guarantee byte-for-byte fidelity of every English field, record ID, record order, and governance field; only the authorized Arabic localization structures were populated by the copy step.

## 5. Packaging model

Each candidate file begins from an exact deep copy of its approved English baseline counterpart. File-level `topicId`, `schemaVersion` (`"2.3.0"`), and the full `records` array (same order, same record IDs, same record types) are preserved unchanged. Two file-level fields were deliberately updated to describe the candidate file's own state accurately (not altering any English content field): `generationStatus` → `"draft-batch1-arabic-candidate-generation"`, and `generationNote` → a new note identifying this file as a controlled Arabic candidate draft under the ratified authorization, referencing the immutable English source checksum. `topicTitleAr` was populated (`"الكميات الأساسية"` for `ch01-t01`; `"الكتلة والقصور الذاتي والوزن"` for `ch01-t04`), mirroring the pilot's own `topicTitleAr` precedent. Only the `arabic` sub-object on each record, plus `localizedContent.ar` (contentBlock) and the `problemStatement`/`conceptualInterpretation`/`numberedSolution[].explanation`/`finalAnswer.interpretation`/`intuition` `.ar` siblings (problem), were newly populated — exactly the same field-level pattern already established across all four pilot topics' own Arabic content.

## 6. Record inventories

**`ch01-t01`** (7 records, order preserved): `instructorScript ch01-is-101`; `contentBlock ch01-t01-block-mainidea` (mainIdea, shared); `contentBlock ch01-t01-block-explanation` (organizedExplanation, shared); `contentBlock ch01-t01-block-equations` (equationSet, shared); `contentBlock ch01-t01-block-visual` (visualReference, shared); `contentBlock ch01-t01-block-misconception` (misconception, instructor); `contentBlock ch01-t01-block-review` (reviewQuestion, student).

**`ch01-t04`** (8 records, order preserved): `instructorScript ch01-is-104`; `contentBlock ch01-t04-block-mainidea`; `contentBlock ch01-t04-block-explanation`; `contentBlock ch01-t04-block-equations`; `contentBlock ch01-t04-block-visual`; `contentBlock ch01-t04-block-misconception` (instructor); `contentBlock ch01-t04-block-review` (student); `problem ch01-prob-104`.

Both counts match the required expected counts exactly (7, 8).

## 7. English-immutability verification

A programmatic deep-equality check compared every field of every record between each English source file and its Arabic candidate copy, **excluding only the `arabic` subtree itself** (which is authorized to be newly populated) and the newly added `ar` siblings inside `localizedContent`/`problemStatement`/etc. **Result: zero mismatches on both files** — every English text value, every record ID, every source/audit/correction reference, every governance/blocking field, every numeric value, unit, and significant-figures setting is identical between source and candidate. Both English source files' checksums were re-computed after generation and found byte-identical to their pre-generation values (§3). No English word, value, ID, source reference, or correction reference changed anywhere.

## 8. Arabic localization-state transition

Every populated record's `arabic.translationStatus` (and, for `contentBlock`, `localizedContent.ar.status`) reads `"draft"` — moved from the source's `"missing"`, never set directly to `"approved"`. `translationReviewer` remains `null` on every record. `terminologyApprovalStatus` was set to `"approved"` on records whose Arabic text uses one or more approved glossary terms (matching the exact precedent already established across the four pilot topics — e.g. `ch01-t08-block-mainidea`), and `"notStarted"` on the two `visualReference` blocks, which carry no mandatory glossary term (matching `ch01-t08-block-visual`'s own precedent of an empty `glossaryTermIds` array). The approved English baseline files retain their original `"missing"` representation, completely untouched.

## 9. `ch01-t01` translation summary

All seven records translated: the instructor script combines all fifteen instructionally-relevant sections (opening hook, meaningful question, main idea, three learning objectives, the full word-for-word teaching script, intuition, two questions/expected-responses pairs, both misconceptions, all three level adaptations, the analogy, both examples, the transition, both emphasis notes, both instructor-only cautions) into one section-labeled Arabic document inside `arabic.canonicalArabicTranslation.text`, exactly matching the schema's single-slot mechanism for `instructorScript.arabic` (no per-subfield Arabic slot exists in `CANONICAL_DESIGN_SCHEMA.json` for this record type — confirmed against the schema and against the pilot's own `ch01-is-108` precedent). The five `contentBlock` records were each translated as natural, structurally faithful Modern Standard Arabic, preserving every scientific distinction, definition, and forward/backward reference present in the English text.

## 10. `ch01-t01` glossary usage

| Record | Glossary term IDs used |
|---|---|
| `ch01-is-101` | `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-speed`, `ch01-term-distance` |
| `ch01-t01-block-mainidea` | `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-distance`, `ch01-term-speed` |
| `ch01-t01-block-explanation` | `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-distance`, `ch01-term-speed` |
| `ch01-t01-block-equations` | `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-distance` |
| `ch01-t01-block-visual` | none (planning/visual-spec text; matches the pilot's own visual-block precedent of an empty `glossaryTermIds` list) |
| `ch01-t01-block-misconception` | `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, `ch01-term-distance`, `ch01-term-speed` |
| `ch01-t01-block-review` | `ch01-term-fundamental-quantity`, `ch01-term-distance` |

Every occurrence of a mandatory term's controlled concept uses the exact `approvedArabicTerm.text` from `BILINGUAL_GLOSSARY.json` v1.3.0: fundamental quantity → الكمية الأساسية; derived quantity → الكمية المشتقة; speed → السرعة; scalar quantity → كمية قياسية; distance → المسافة. No `discouragedTranslations` entry was used as a substitute for any of these terms. Velocity's own term (`ch01-term-velocity`, السرعة المتجهة) is used exactly once, correctly, for the English source's own forward-reference to velocity ("a signed, directional version of this idea (velocity) is developed in a later topic") — this is not a misuse of the discouraged السرعة المتجهة-for-speed substitution; it is velocity's own correct term used to name velocity itself.

## 11. `ch01-t01` scientific verification

- **Speed is a scalar quantity**: explicitly stated in `ch01-t01-block-equations`' Arabic text ("كمية قياسية — أي مقدار فقط دون اتجاه").
- **Speed and velocity are not interchangeable**: preserved via the explicit forward-reference distinguishing "السرعة" (speed) from "السرعة المتجهة" (velocity), never conflated.
- **Distance and displacement are distinct**: "الإزاحة" (displacement) is never used anywhere in either candidate file; only "المسافة" (distance) appears, matching the approved English draft's own deliberate omission of displacement.
- **v = d/t is average speed over the interval**: preserved exactly ("السرعة المتوسطة خلال فترة المسافة والزمن المحددة").
- **d is measured distance, t is elapsed time**: preserved with explicit Arabic glosses ("المسافة المقيسة خلال الفترة الزمنية"، "الزمن المنقضي خلال الفترة نفسها").
- **L is the dimension of length, T is the dimension of time, speed has dimension L/T**: preserved exactly ("للمسافة بُعدٌ L، وللزمن بُعدٌ T… فإن بُعدها هو L/T").
- **Dimensional symbols L/T are distinct from measured-variable symbols d/t**: an explicit disambiguating sentence was added, following `ch01-term-fundamental-quantity`'s own approved usage-note guidance, clarifying that "البُعد" here names the type of quantity, not the measured value itself, and explicitly warning that the dimensional symbol L is not to be confused with المسافة (distance) itself.
- **`ch01-corr-001`'s approved scientific meaning** (mechanics-scope qualifier; charge as a deferred fourth fundamental property): preserved verbatim in meaning throughout the instructor script and every content block that references it.
- No instantaneous speed, advanced dimensional analysis, or adjacent-topic content was added.

## 12. `ch01-t04` translation summary

All eight records translated, following the same instructor-script single-slot combination convention (fourteen sections: opening hook, meaningful question, main idea, three learning objectives, the full teaching script, intuition, two questions/expected-responses pairs, both misconceptions, all three level adaptations, the analogy, both examples, the transition, both emphasis notes, both instructor-only cautions). The five `contentBlock` records and the one `problem` record were each translated preserving every scientific distinction between mass, gravitational weight, and apparent weight.

## 13. `ch01-t04` glossary usage

| Record | Glossary term IDs used |
|---|---|
| `ch01-is-104` | `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`, `ch01-term-acceleration` |
| `ch01-t04-block-mainidea` | `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` |
| `ch01-t04-block-explanation` | `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` |
| `ch01-t04-block-equations` | `ch01-term-weight`, `ch01-term-mass`, `ch01-term-scalar` |
| `ch01-t04-block-visual` | none (planning/visual-spec text; same precedent as `ch01-t01-block-visual`) |
| `ch01-t04-block-misconception` | `ch01-term-mass`, `ch01-term-weight` |
| `ch01-t04-block-review` | `ch01-term-mass`, `ch01-term-weight` |
| `ch01-prob-104` | `ch01-term-mass`, `ch01-term-weight` |

Exact approved forms used: mass → الكتلة; weight → الوزن; apparent weight → الوزن الظاهري; acceleration → التسارع; scalar → كمية قياسية. `discouragedTranslations` (الوزن as a substitute for mass; الكتلة as a substitute for weight; الوزن الحقيقي as the preferred contrast for apparent weight) were checked and are **not** used as substitutes anywhere — every apparent occurrence of الكتلة/الوزن in the other term's own context is that term's own correct, contrastive usage (both concepts are legitimately discussed throughout the same document), independently verified by inspecting each occurrence's surrounding sentence.

## 14. Apparent-weight adaptation

The Arabic term الوزن الظاهري is used as the primary rendering everywhere apparent weight is discussed, exactly as approved. قراءة الميزان is not introduced as a separate label in the candidate text beyond its role already recorded in the glossary's `alternateArabicTerms`; the Arabic prose instead explains the *concept* of a scale reading in ordinary language ("قوة الدعم التي يقرأها الميزان فعليًا"), consistent with the glossary's own usage note. الوزن الحقيقي is **not used anywhere** in either candidate file. The English source's explicit qualification — that "apparent weight" is project-authored interpretive terminology, not verbatim source wording — is preserved as an explicit Arabic sentence in both `ch01-t04-block-explanation` ("وهو ليس اقتباسًا حرفيًا من أي مادة مصدرية") and the instructor script's emphasis notes and instructor-only cautions sections, matching the English baseline's own repeated emphasis on this point.

## 15. `ch01-t04` problem verification

- `problemStatement`, `conceptualInterpretation`, both `numberedSolution[].explanation` steps, `finalAnswer.interpretation`, and `intuition` were all translated with `.ar` siblings added, matching the exact field-level pattern already established in the pilot's own `ch01-prob-108`.
- `givenValues`, `equationSelection`, `calculation`, `units`, `directionSign`, `commonMistake`, `sourceAnswer`, and `correctedAnswer` were **left entirely untouched** (no `.ar` field added) — this exactly matches the schema (none of these fields carries an Arabic localization slot) and the pilot's own precedent (`ch01-prob-108` has no `.ar` on any of these fields either).
- `sourceVariants[0].answerVariant` was left as the plain English string `"4.4 x 10^2 N; mass unchanged"`, unchanged — the schema's `sourceVariant.answerVariant` is a plain string field with no Arabic slot (confirmed against `CANONICAL_DESIGN_SCHEMA.json`'s `$defs.sourceVariant`), and this field is internal governance/reconciliation bookkeeping, not learner-facing text.
- Numeric preservation, independently re-verified: `45 kg x 9.8 m/s^2 = 441 N` (unrounded) appears verbatim; `4.4 x 10^2 N` (the two-significant-figure final value) appears verbatim; `significantFigures: 2` in the `calculation` array is untouched (confirmed by the zero-mismatch deep-equality check, §7); the physical object (medical equipment cart) and scenario were not changed.

## 16. Equation and bidi validation

Every equation fragment required by the task was verified present, verbatim, in the generated files by direct string search: `v = d / t`, `L`, `T`, `L/T` (ch01-t01); `W = mg`, `9.8 m/s^2`, `45 kg x 9.8 m/s^2 = 441 N`, `4.4 x 10^2 N` (ch01-t04). Following the exact established pilot convention (independently confirmed by inspecting `ch01-t08-content.json`'s own Arabic text), Latin variables, SI unit symbols, and numerals are embedded directly as plain Unicode characters within the Arabic prose strings — **no HTML/markup-based bidi isolation exists inside the canonical JSON text itself anywhere in this project's precedent**; LTR isolation is applied at the rendering layer (`equationRenderer.tsx`), not in the stored JSON string. No new rendering mechanism was invented or required. A programmatic check confirmed the presence of zero Arabic-Indic digits (٠–٩) anywhere in either candidate file — all numerals remain Latin, matching the established project-wide convention. Absolute-value bars (`|g|`), the caret exponent notation (`10^2`), and the plain-ASCII `x` multiplication symbol were all preserved exactly as they appear in the English source, with no Arabic letter substituted for any physics symbol. No application rendering code was read for modification or touched.

## 17. Record-by-record completeness

Every one of the 7 + 8 = 15 records across both files received the exact Arabic content required for its record type: `instructorScript` records gained a fully populated `arabic` field (with no per-subfield Arabic split, per the schema's own structural constraint); every `contentBlock` record gained both `localizedContent.ar` and a fully populated `arabic` field; the one `problem` record gained `.ar` on `problemStatement`, `conceptualInterpretation`, both `numberedSolution` steps' `explanation`, `finalAnswer.interpretation`, and `intuition`, plus a fully populated top-level `arabic` field. No record was left with an accidental `"missing"` Arabic state. No optional Arabic structure required by the ratified authorization was omitted. No unsupported/undeclared field was added anywhere — every added key already exists in `CANONICAL_DESIGN_SCHEMA.json`'s `$defs`.

## 18. Source-lineage integrity

`provenanceLinks`, `sourceTraceability`, `scientificCorrectionIds`/`scientificCorrectionReferences`, and `conflictRecordIds` are byte-identical to the English source on every record (confirmed by the zero-mismatch deep-equality check, §7) — no source ID, scientific-audit ID, or correction ID was added, removed, or altered anywhere in either candidate file.

## 19. Rights-safety review

Every Arabic sentence in both candidate files was newly authored as a translation and pedagogical adaptation of the approved, project-authored English Batch 1 baseline — never machine-translated, and never translated directly from any external source. No Arabic-language source material of any kind exists anywhere in this project's audited source corpus (`docs/content-audits/`) to translate from or inadvertently reproduce — the audited sources are English-language conversation transcripts, an English PDF slide deck, English review cards, and English Kahoot material; none contains Arabic text. Classification: **all records — newly translated/adapted and clear.** No sentence was found to be unnecessarily close to any existing wording (there being no Arabic publisher wording in this project against which "closeness" could even be assessed), and no revision or blocking was required on rights grounds. No claim of independent human rights review is made — this is Claude's own rights-safety assessment under the project owner's existing authorization, consistent with every other rights assessment performed in this project's history.

## 20. Schema and JSON validation

Both candidate files parse as valid JSON. Both retain `schemaVersion: "2.3.0"` and the correct `topicId`. Record counts match exactly (`ch01-t01`: 7; `ch01-t04`: 8). Record IDs and record-type order are identical to the English source, field for field, confirmed programmatically. Every `recordType` is one of the four schema-allowed values; every `visibility` value is schema-allowed; every `arabicSeparation` object contains all five required fields with schema-valid enum values; every `localizedText` object (English and Arabic) contains all four required fields with schema-valid enum values, and every Arabic-language `localizedText` object correctly carries `direction: "rtl"`. Every `glossaryTermIds` entry matches the `^ch01-term-[a-z0-9-]+$` pattern and resolves to an existing, `approved` entry in `BILINGUAL_GLOSSARY.json`. `translationStatus` is `"draft"` on every populated record — never `"approved"`. `translationReviewer` is `null` everywhere. `studentFacingAllowed` remains `false` on every record (unchanged, part of the untouched `blocking` object). No additional/unsupported field was introduced anywhere in either file.

## 21. New terminology diagnostics

**No new canonical scientific term was coined.** Every controlled scientific concept in both topics is covered by one of the nine mandatory Batch 1 glossary terms, already-approved sibling terms (`ch01-term-velocity`, used once, correctly, for its own concept), or ordinary Arabic language requiring no glossary registration (e.g., "time" — already explicitly resolved as needing no separate entry in `PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md` §4/§7; "support force"/"scale reading" as explanatory phrases around apparent weight, not a competing canonical label). **No blocking terminology gap was identified for either topic.** No record was left incomplete or blocked on terminology grounds.

## 22. Deferred work

- **Co-located validation records** (a `*-validation.json` file per candidate, following the pilot's own visual-validation naming convention) were **not created** in this task — the task's own allowed-modifications list restricts outputs to exactly the two candidate content files and this report, narrower than the standing authorization's general allowance for validation records. Deferred to a future task if the project owner wants them.
- **`sourceVariants[0].answerVariant`'s Arabic equivalent** was not added, since the schema provides no Arabic slot for this field and it is internal governance bookkeeping, not learner-facing text (§15). No action is required unless a future schema decision adds such a slot.
- Independent human linguistic/scientific review of the generated Arabic text has not occurred and is not claimed.

## 23. Arabic baseline status

**Unapproved and unaffected by this task.** No `ARABIC_BATCH1_BASELINE_APPROVAL.json`-style record was created. `PILOT_READINESS.json`'s `arabicBaselineApproved` remains `false`. The two candidate files produced here are drafts, not a baseline, and are not treated as approved by virtue of this task's completion.

## 24. Visual status

**Unproduced, unaffected.** No SVG, raster, or other visual asset was created. Both `visualReference` content blocks' Arabic text explicitly preserves the statements that the visual has not been produced, has not been reviewed, is not student-facing, and that a separate visual-production authorization is required before any asset is created.

## 25. Application-integration status

**Unauthorized, unaffected.** No route, registry entry, or import was added anywhere. `apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics, untouched by this task. No application file was read for modification or changed.

## 26. Independent-review status

**Incomplete, unclaimed.** No independent human linguistic or scientific expert has reviewed any Arabic text generated in this task. This report's own scientific and rights-safety assessments (§11, §15, §19) are Claude's own review under the project owner's existing ratified authorization — not independent third-party expert review, and not represented as such anywhere in this document.

## 27. Publication status

**Unauthorized, unaffected.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` on every record in both candidate files (part of the untouched `blocking` object) and chapter-wide in `PILOT_READINESS.json`. Nothing in this task changes, sets, or proposes changing either flag.

## 28. Exact next controlled task

A future **Arabic candidate-draft review task** — independent scientific and linguistic review of the two generated candidate files, following the same review-and-revision pattern already used for the English baseline (`PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md` → `_REVISION_REPORT.md` → `_CLOSURE_REVIEW.md`) — would be the appropriate next step if the project owner chooses to proceed, ultimately leading toward a possible future Arabic baseline-approval decision (a separate, still-absent gate, mirroring `ARABIC_PILOT_BASELINE_APPROVAL.json`'s pattern). Per this task's own documentation boundary, no governance file was updated to reflect this task's completion — a later Arabic-review task will determine whether current-state synchronization of `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, or the three current-state documents is needed.

---

### Explicit statements

- **These are Arabic candidate drafts only.**
- **The approved English source files were not modified** — checksums confirmed byte-identical before and after generation.
- **No Arabic baseline approval occurred.**
- **No visual was produced.**
- **No application integration occurred.**
- **No student-facing authorization was granted.**
- **Publication remains unauthorized.**
