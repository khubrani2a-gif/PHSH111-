# PHSH111 Batch 1 — Arabic Candidate-Draft Review and Revision Report

**Review date:** 2026-07-17. **Type:** Consolidated scientific, linguistic, pedagogical, glossary, bidi, and schema review, with only clearly justified draft-level corrections applied. **This task does not approve an Arabic baseline.**

## 1. Purpose and limits

This document records a single consolidated review pass over the two Batch 1 Arabic candidate drafts (`ch01-t01`, `ch01-t04`), covering scientific fidelity, linguistic/pedagogical quality, glossary compliance, equation/bidi correctness, and schema conformance. Only clearly justified, narrowly scoped draft-level corrections were applied — no scientific content, English text, record structure, numbers, equations, governance field, glossary entry, or authorization/readiness record was modified. **This review does not approve an Arabic baseline for either topic.**

## 2. Files reviewed

`docs/app/PHSH111_BATCH1_ARABIC_DRAFT_GENERATION_REPORT.md`, `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_RATIFICATION_RECORD.md`, `docs/content-design/chapter-01/ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json`, both approved English source files (`docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`, `ch01-t04-content.json`), both Arabic candidate files (read and reviewed in full, record by record), and the four approved bilingual pilot topic files under `docs/content-design/chapter-01/pilot/` (used as the Arabic style, schema-usage, and bidi precedent — in particular `ch01-t08-content.json`).

## 3. Checksums and structural verification

Independently re-verified before any edit:

| Check | Result |
|---|---|
| `ch01-t01-content.json` (English) checksum | `a445f55d...` — matches approved baseline |
| `ch01-t04-content.json` (English) checksum | `c876a6fe...` — matches approved baseline |
| `ch01-t01` candidate record count | 7 (matches expected) |
| `ch01-t04` candidate record count | 8 (matches expected) |
| Deep-equality of all English/non-Arabic fields against approved sources | Zero mismatches on both files |
| Arabic baseline approval status | `false` |
| Publication authorization | `false` |

All dependencies were consistent; review proceeded.

## 4. `ch01-t01` scientific review

Every mandatory scientific element was independently checked against the candidate text:

| Requirement | Status |
|---|---|
| السرعة as a scalar quantity | Preserved — explicit "(كمية قياسية — أي مقدار فقط دون اتجاه)" in the equations block |
| Distinction السرعة / السرعة المتجهة | Preserved — السرعة المتجهة used exactly once, correctly, for the English source's own velocity forward-reference; never substituted for speed |
| Distinction المسافة / الإزاحة | Preserved — الإزاحة does not appear anywhere in the file, matching the English baseline's own deliberate omission |
| v = d/t as average speed over the interval | Preserved — "وتُعطي هذه العلاقة السرعة المتوسطة خلال فترة المسافة والزمن المحددة" |
| d as measured distance | Preserved — "d هي المسافة المقيسة خلال الفترة الزمنية" |
| t as elapsed time | Preserved — "t هو الزمن المنقضي خلال الفترة نفسها" |
| L as dimension of length, T as dimension of time | Preserved — "للمسافة بُعدٌ L، وللزمن بُعدٌ T" |
| Speed dimension L/T | Preserved — "فإن بُعدها هو L/T" |
| Distinction between dimensional symbols L/T and measured variables d/t | Preserved — explicit sentence: "d وt هما الرمزان المستخدَمان تحديدًا للمتغيرات المقيسة… ويقابلان الرمزين البعديين L وT، لكنهما يختلفان عنهما" |
| الكمية الأساسية / الكمية المشتقة | Preserved and consistently used throughout |
| `ch01-corr-001` meaning (mechanics-scope qualifier; charge deferred, not excluded) | Preserved throughout the instructor script and every content block referencing it |

**البُعد-versus-المسافة confusion check:** the equations block already carries an explicit disambiguating parenthetical, present since generation: *"(يُقصد بـ'البُعد' هنا نوع الكمية، لا مقدارها المقيس؛ فالبُعد L لا يعني المسافة المقيسة فعليًا، بل يسمّي فئة الكمية التي تنتمي إليها المسافة)"* — this directly and explicitly warns against the exact confusion flagged by this review's own mandate. **No wording anywhere in the file risks conflating البُعد الفيزيائي with المسافة**; no correction was required on this point.

## 5. `ch01-t01` linguistic and pedagogical review

The Arabic throughout is natural, grammatical Modern Standard Arabic appropriate for introductory PHSH111 students: sentence order, pronoun reference, and connective structure all read fluently rather than as a literal English calque. Instructor-only content (misconception block, instructor-script cautions) remains clearly instructor-facing; the single student-visible review-question block reads as a complete, self-contained explanation-based question, matching the established pilot convention. Terminology is used consistently across all seven records. One genuine defect was found and is detailed in §6. One broader stylistic pattern — a glossary term is often echoed in parentheses immediately after its own first use in a sentence (e.g. "الكميات الأساسية (الكمية الأساسية)") — is not a grammatical error and does not affect scientific meaning, but reads as more repetitive than natural authored prose would be; it is recorded as an optional future improvement (§18) rather than corrected here, per this review's own proportionality principle (see §6 for why the scope of correction was kept narrow).

## 6. `ch01-t01` corrections applied

**One defect found and corrected**, in `ch01-t01-block-equations` (both `localizedContent.ar.text` and the mirrored `arabic.canonicalArabicTranslation.text`):

- **Defect:** a mechanical duplication produced a malformed nested parenthetical — *"حيث v هي السرعة (كمية قياسية (كمية قياسية) — أي مقدار فقط دون اتجاه)"* — where "كمية قياسية" (scalar quantity) was accidentally repeated inside its own parenthetical.
- **Correction:** removed the redundant inner repetition, restoring the intended single parenthetical — *"حيث v هي السرعة (كمية قياسية — أي مقدار فقط دون اتجاه)"* — exactly matching the English source's own structure ("v is speed (a scalar quantity — magnitude only, with no direction attached)"). Both mirrored occurrences (the `localizedContent.ar` and `arabic.canonicalArabicTranslation` copies of the same sentence) were corrected identically; re-verified afterward that the two fields still mirror each other exactly.
- **Scope of the fix:** text-only, inside the Arabic field. No English text, record ID, glossary term ID, source reference, correction reference, or governance field was touched.

A systematic regex sweep across both entire files for this same duplicate-nested-parenthetical pattern found **no other occurrences** anywhere else in either file.

## 7. `ch01-t04` scientific review

| Requirement | Status |
|---|---|
| الكتلة and الوزن as different quantities | Preserved and repeatedly, explicitly distinguished throughout |
| الوزن as gravitational force | Preserved — "الوزن الجذبي فهو قوة الجاذبية المؤثرة في الجسم" |
| W = mg | Preserved verbatim, in the equations block and the problem |
| Magnitude/direction treatment | Preserved — "تُعطي هذه المعادلة مقدار قوة الوزن الجذبي فقط… ولا يلزم تناول إشاري كامل للاتجاه" |
| \|g\| ≈ 9.8 m/s^2 | Preserved verbatim |
| الوزن الظاهري as the approved canonical term | Used consistently as the primary term throughout |
| قراءة الميزان only as supporting explanation | Confirmed — used only descriptively ("قوة الدعم التي يقرأها الميزان"), never presented as a competing official label |
| No preferred contrast using الوزن الحقيقي | Confirmed absent — zero occurrences anywhere in the file |
| Distinction among gravitational weight, apparent weight, support/normal force, scale reading | Preserved; "normal force" is not introduced anywhere, matching the English baseline's own deliberate omission of that term |
| 441 N as the unrounded intermediate result | Preserved verbatim, explicitly labeled "(غير مقرَّبة)" |
| 4.4 x 10^2 N as the final two-significant-figure result | Preserved verbatim |
| `significantFigures: 2` | Untouched (confirmed by the zero-mismatch deep-equality check — this field was never part of any Arabic edit) |
| `ch01-corr-002` and its qualification | Preserved — the explanation block and instructor script both explicitly state that "apparent weight" is project-authored interpretive terminology, not verbatim source wording |

**Independent recalculation:** 45 × 9.8 = 441 (confirmed exactly); rounded to two significant figures, 441 → 4.4 × 10², i.e. 440 N, matching the candidate text's own "4.4 x 10^2 N" exactly. No numerical discrepancy found.

## 8. `ch01-t04` linguistic and pedagogical review

The Arabic throughout `ch01-t04` is natural, fluent Modern Standard Arabic, suitable for introductory PHSH111 students, with clear instructor-versus-learner visibility preserved on every record. Terminology (الكتلة / الوزن / الوزن الظاهري / التسارع) is used with complete internal consistency across all eight records, including the problem. One defect was found and is detailed in §9; the same broader stylistic term-echo pattern noted in §5 is present here too and is likewise deferred to §18.

## 9. `ch01-t04` corrections applied

**One defect found and corrected**, in the `problem` record's `numberedSolution[0].explanation.ar.text`:

- **Defect:** an isolated, inconsistent diacritic — "وَ9.8" (the conjunction و carrying a fatha mark) — appeared once, while every other instance of و immediately preceding a Latin symbol or number in both candidate files (وT, وM, وd, وt, وm, وg) is correctly undiacritized, matching this project's consistent plain-MSA orthographic style throughout every prior pilot and Batch 1 document.
- **Correction:** removed the stray diacritic — "و9.8" — restoring consistency with the rest of the document and with established project style.
- **Scope of the fix:** a single diacritic mark, inside one Arabic field. No number, unit, equation, or English text was touched.

A systematic search confirmed this was the only diacritic-inconsistency instance of its kind in either file; the many other diacritics present throughout both files (tanwīn on adverbial endings such as لاحقًا/دائمًا, shadda in standard passive-voice spellings such as تُقدَّم/تُعرَّف) are normal, correctly used Modern Standard Arabic spelling marks, not defects, and were left untouched.

## 10. Glossary validation

Both files were checked against `BILINGUAL_GLOSSARY.json` v1.3.0 (unchanged, re-confirmed still v1.3.0 after this review). Every mandatory term's `approvedArabicTerm.text` is used exactly:

| Term | Required Arabic | Found verbatim |
|---|---|---|
| fundamental quantity (`ch01-t01`) | الكمية الأساسية | Yes |
| derived quantity (`ch01-t01`) | الكمية المشتقة | Yes |
| speed (`ch01-t01`) | السرعة | Yes |
| scalar quantity (`ch01-t01`) | كمية قياسية (glossary's exact approved form — note: this review's own task brief paraphrased it as "الكمية القياسية," a close but not identical variant; the candidate text correctly follows the actual glossary-recorded form, "كمية قياسية," not the paraphrase) | Yes |
| distance (`ch01-t01`) | المسافة | Yes |
| mass (`ch01-t04`) | الكتلة | Yes |
| weight (`ch01-t04`) | الوزن | Yes |
| apparent weight (`ch01-t04`) | الوزن الظاهري | Yes |
| acceleration (`ch01-t04`) | التسارع | Yes |

No `discouragedTranslations` entry is used as a substitute for any of the nine mandatory terms anywhere in either file (independently re-confirmed after the corrections). No new controlled scientific term was introduced. `ch01-term-velocity`'s own approved term (السرعة المتجهة) is used once, correctly, for its own concept — not a glossary violation. **No glossary decision is required; no blocker was identified on glossary grounds.**

## 11. Apparent-weight review

الوزن الظاهري remains the sole primary rendering for apparent weight throughout `ch01-t04`. قراءة الميزان appears only as a supporting explanatory phrase describing what a scale does, never as a competing formal label. الوزن الحقيقي does not appear anywhere in the file. The English source's explicit qualification — that "apparent weight" is project-authored interpretive terminology, not verbatim source wording — is preserved as an explicit Arabic sentence in the explanation block and reinforced in the instructor script's emphasis notes and instructor-only cautions. **No correction was required on this point.**

## 12. Equation and bidi review

Every required expression was verified present, verbatim, after the corrections: `v = d / t`, `L`, `T`, `L/T` (`ch01-t01`); `W = mg`, `|g| ≈ 9.8 m/s^2`, `45 kg x 9.8 m/s^2 = 441 N`, `4.4 x 10^2 N` (`ch01-t04`). Manual and structural inspection confirms: all Latin variables and SI units remain Latin and upright; no Arabic letter is substituted for a physics symbol; numbers, operators, absolute-value bars, and units appear in unreversed left-to-right order inside the right-to-left Arabic prose, matching the pilot's own established convention (plain Unicode embedding, no in-JSON markup — bidi isolation is a rendering-layer concern, not a stored-text concern, confirmed against `ch01-t08-content.json`'s own precedent); punctuation adjacent to equations is plain ASCII, not reordered or Arabic-mirrored; the caret exponent notation (`10^2`) is preserved exactly, compatible with the existing renderer. Zero Arabic-Indic digits were found in either file (confirmed programmatically) — all numerals remain Latin. **No application code was read for modification or touched.**

## 13. Problem recalculation

Independently recalculated: 45 × 9.8 = 441 (exact). Both given values (45 kg, 9.8 m/s²) carry two significant figures, so the reported result is correctly 4.4 × 10² N. Every Arabic occurrence of this calculation and its interpretation (`numberedSolution[0]`, `numberedSolution[1]`, `finalAnswer.interpretation`, `intuition`) states the same values consistently, with no internal contradiction, both before and after the diacritic correction in §9 (which did not touch any numeral).

## 14. English-content immutability

A full deep-equality check (excluding only the `arabic` subtree) was run both before this review's corrections and again after them, comparing every field of every record in both candidate files against their approved English source counterparts. **Result: zero mismatches, both times.** Both English source files' checksums were re-verified unchanged after this review's edits (`a445f55d...`, `c876a6fe...`). No English word, record ID, record order, source/audit/correction reference, or governance/blocking field was altered at any point during this review.

## 15. Schema validation

After the corrections: both files remain valid JSON; both retain `schemaVersion: "2.3.0"`; record counts remain exactly 7 (`ch01-t01`) and 8 (`ch01-t04`); every record ID and record-type order is identical to the approved English source; every `arabicSeparation` and `localizedText` object contains only schema-declared keys (explicitly checked against `CANONICAL_DESIGN_SCHEMA.json`'s `additionalProperties: false` constraint — no unsupported field was introduced by this review); `translationStatus` reads `"draft"` on every populated record; `translationReviewer` is `null` everywhere; `studentFacingAllowed` remains `false` on every record (part of the untouched `blocking` object); every `glossaryTermIds` entry resolves to an approved `BILINGUAL_GLOSSARY.json` term.

## 16. Rights-safety review

No new rights concern was identified. This review did not introduce any new Arabic text beyond the two narrow corrections in §6 and §9, both of which are corrections to already-original, project-authored prose (removing a mechanical duplication and a stray diacritic), not new translated content. The generation task's own rights-safety assessment (§19 of `PHSH111_BATCH1_ARABIC_DRAFT_GENERATION_REPORT.md`) — that no Arabic source material exists anywhere in this project's audited corpus to compare against — remains accurate and unchanged.

## 17. Remaining blockers

**None.** No scientific correction, glossary decision, schema change, or governance decision is required for either topic. Every mandatory scientific, glossary, equation, and structural check passed for both `ch01-t01` and `ch01-t04`.

## 18. Optional future improvements

- **Glossary term-echo repetition** (§5, §8): many sentences repeat a glossary term in parentheses immediately after its own use (e.g. "الكمية الأساسية (الكمية الأساسية)", "السرعة (السرعة)"). This is not a grammatical error, does not affect scientific meaning, and does not violate glossary enforcement (the correct term is still used in every case) — but a future, more polished revision pass could remove this repetition in favor of more naturally flowing prose, now that glossary-term-usage is separately, machine-readably tracked in each record's `arabic.glossaryTermIds` array and no longer needs to be echoed inline in the prose itself for traceability. This was deliberately not corrected in this pass, both because it is not a "clear defect" in the sense this review's own mandate requires, and because a full rewrite of this scale (touching nearly every populated Arabic field across two ~70–80 KB files) carries meaningfully higher risk of introducing new errors than the two narrowly-scoped, mechanical corrections actually applied.
- **`sourceVariants[0].answerVariant`** on `ch01-prob-104` remains untranslated (plain English string) — already documented as a deliberate, schema-consistent deferral in the generation report (§22), since the schema provides no Arabic slot for this internal governance field.
- Independent human linguistic and scientific review has not occurred and remains a prerequisite for any future Arabic baseline-approval decision.

## 19. Topic-level readiness recommendation

**`ch01-t01`: Ready for Arabic baseline-approval decision.** All mandatory scientific safeguards verified intact; the one identified defect (duplicated parenthetical) has been corrected; glossary, equation, and schema checks all pass; no blocker remains.

**`ch01-t04`: Ready for Arabic baseline-approval decision.** All mandatory scientific safeguards verified intact, including an independently recalculated numerical result; the one identified defect (stray diacritic) has been corrected; glossary, equation, and schema checks all pass; no blocker remains.

## 20. Batch-level readiness recommendation

**Both Batch 1 topics are ready for an Arabic baseline-approval decision**, should the project owner choose to proceed. This recommendation is Claude's own review-quality assessment under the existing ratified authorization — it is not, and does not substitute for, independent human scientific or linguistic review, which remains outstanding for both topics and is a stated prerequisite the project owner should weigh before any baseline-approval decision.

## 21. Exact next controlled task

A project-owner decision on **Arabic baseline approval** for `ch01-t01` and `ch01-t04` — a new, separate governance record (e.g. `ARABIC_BATCH1_BASELINE_APPROVAL.json`), mirroring `ARABIC_PILOT_BASELINE_APPROVAL.json`'s and `ENGLISH_BATCH1_BASELINE_APPROVAL.json`'s existing pattern (a `baselineVersion`, `status: "approved"`, per-topic `perTopicDecision`, and a `revisionControlPolicy.revisionLog`). **This review does not perform that approval.** Per this task's own documentation boundary, no governance or current-state document was updated in this review — a baseline-approval task, if the project owner chooses to proceed, would perform that synchronization itself.

## 22. Governance and publication statement

- **This task does not approve the Arabic baseline.** `arabicBaselineApproved` remains `false`.
- **No English content was modified.** Both approved English source files remain byte-identical to their recorded checksums.
- **No visual or application work occurred.**
- **No independent human expert approval occurred.** Every finding in this report is Claude's own review under the project owner's existing ratified authorization.
- **Publication remains unauthorized.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere.
- No governance or current-state document (`PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, the expansion plan, checkpoint, app handoff, or any baseline record) was modified by this review.
- No build, install, deploy, `git add`, `git commit`, `git push`, or pull-request action was performed.
