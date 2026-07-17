# PHSH111 Batch 1 — Application Integration Report

**Date:** 2026-07-17. **Type:** Application-integration implementation and static review.

**IMPORTANT — scope of this report:** Node.js/npm are not installed or reachable in this working environment (confirmed: no `node`, `npm`, `brew`, `nvm`, `volta`, `fnm`, `asdf`, or any bundled runtime found anywhere on the machine). Per explicit project-owner direction given during this task, **this report does not claim that TypeScript checking, the test suite, the production build, or browser QA passed** — none of them were executed. All code below was implemented and statically reviewed by hand, verified against the exact real approved data (via Python, not Node), but **not compiled or run**. A separate verification task, in an environment where Node.js is available, must run the commands listed in §16–18 before this integration can be considered verified, and before `PILOT_READINESS.json` or any current-state document is updated to claim completion — neither was updated in this task, per that same instruction.

## 1. Purpose and authorization basis

Implements the internal application integration authorized in `PILOT_AUTHORIZATION.json` v1.5.0's `batch1ApplicationIntegrationAuthorization` and detailed in `docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md`: integrating `ch01-t01` and `ch01-t04` into `apps/chapter1-mvp/` using the authorized direct-import model. **This is internal integration and static review only — not student-facing release, not deployment, not publication, and not independent human review.**

## 2. Preflight verification

Independently re-verified before any code change (via Python, since Node was already known to be unavailable):

| Check | Result |
|---|---|
| `PILOT_AUTHORIZATION.json` version | `1.5.0` ✓ |
| `PILOT_READINESS.json` version | `1.13.0` ✓ |
| `IDENTIFIER_REGISTRY.json` version | `1.3.0`, 18 identifiers registered ✓ |
| English Batch 1 baseline | `1.0.0`, approved ✓ |
| Arabic Batch 1 baseline | `1.0.0`, approved ✓ |
| Visual Batch 1 baseline | `1.0.0`, approved ✓ |
| All 6 approved file checksums (2 English, 2 Arabic, 2 SVG) | match their governance records exactly ✓ |
| `ch01-t01`/`ch01-t04` not already integrated | confirmed — zero prior references anywhere in `apps/chapter1-mvp/src/` ✓ |
| Application topic count before integration | 4 (`ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`) ✓ |
| Publication authorization | unauthorized (unchanged) ✓ |

**TypeScript/test commands before editing:** **not run** — Node.js/npm unavailable. Per project-owner direction, static code review substituted for execution; this is recorded as an open item, not silently skipped.

## 3. Files modified and created

**Created:**
- `apps/chapter1-mvp/src/content/batch1Merge.ts` — the English/Arabic in-memory merge module
- `apps/chapter1-mvp/src/tests/batch1Merge.test.ts` — merge unit tests
- `apps/chapter1-mvp/src/tests/batch1Integrity.test.ts` — checksum/integrity tests
- `apps/chapter1-mvp/src/tests/batch1Integration.test.tsx` — rendering/behavior tests for both new topics
- `docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_REPORT.md` (this document)

**Modified:**
- `apps/chapter1-mvp/src/types/pilotSchema.ts` — extended `PilotTopicId`; added `BATCH1_TOPIC_ORDER`, `APP_TOPIC_ORDER`
- `apps/chapter1-mvp/src/content/rawImports.ts` — added the 6 new source imports; wired the merge
- `apps/chapter1-mvp/src/content/adapter.ts` — `loadAllTopics()` now iterates `APP_TOPIC_ORDER`
- `apps/chapter1-mvp/src/content/validate.ts` — `validateTopicSet()` now checks against `APP_TOPIC_ORDER`
- `apps/chapter1-mvp/src/config/topics.ts` — re-exports `APP_TOPIC_ORDER`
- `apps/chapter1-mvp/src/content/equationRenderer.tsx` — added `ch01-t01`/`ch01-t04` token whitelists
- `apps/chapter1-mvp/src/pages/TopicPage.tsx` — updated "four" → "six" in the unknown-topic message
- `apps/chapter1-mvp/src/pages/ChapterOnePage.tsx` — updated "Four pilot topics" → "Six topics" (EN+AR)
- `apps/chapter1-mvp/src/pages/HomePage.tsx` — updated "four pilot topics" → "six topics" (EN+AR)
- `apps/chapter1-mvp/src/tests/adapter.test.ts` — six-topic counts/order; per-topic record-count split
- `apps/chapter1-mvp/src/tests/validate.test.ts` — six-topic count/order assertions
- `apps/chapter1-mvp/src/tests/equationRenderer.test.tsx` — added t01/t04 to the per-topic loop; added token-exclusion regression tests
- `apps/chapter1-mvp/src/tests/reviewQuestion.test.ts` — extended real-data topic list to all six

**Not modified:** `apps/chapter1-mvp/README.md` does not exist and was not created (per explicit instruction not to update documentation/readiness in this task). `vite.config.ts` was **not** modified — its existing `server.fs.allow` already resolves to the parent `docs/content-design/chapter-01/` directory, covering the two new Batch 1 source directories with no change. No approved English/Arabic/SVG file, baseline approval record, glossary, or identifier registry was modified.

## 4. Integration architecture

Direct import from the six approved source paths, exactly as authorized — no app-local copies, no generated manifest file. `rawImports.ts` now imports:

- English: `batch1-drafts/ch01-t01-content.json`, `ch01-t04-content.json`
- Arabic: `batch1-arabic-drafts/ch01-t01-content.json`, `ch01-t04-content.json`
- Visuals: `batch1-visuals/ch01-t01-visual-001.svg`, `ch01-t04-visual-001.svg` (via `?raw`)
- Visual validation: the corresponding two `-validation.json` files

No Vite configuration change was needed or made.

## 5. English/Arabic merge implementation

`src/content/batch1Merge.ts` exports `mergeEnglishAndArabicTopicFile(englishRaw, arabicRaw, expectedTopicId)`, invoked once per Batch 1 topic at module load time in `rawImports.ts`. It:

- Verifies `schemaVersion`, `topicId`, `topicTitle`, record count, and record order/IDs match between the two files.
- For every record type (`contentBlock`, `instructorScript`, `problem`), verifies every non-Arabic field is deep-equal between the English and Arabic files (including every nested `LocalizedContent.en` side — e.g. `problemStatement.en`, `conceptualInterpretation.en`, `intuition.en`, each `numberedSolution[i].explanation.en`, `finalAnswer.interpretation.en`).
- Takes only the `.ar` side of each `LocalizedContent` field, and the whole `arabic` governance sub-object, from the Arabic file.
- Takes `topicTitleAr` from the Arabic file (the English file deliberately carries `null` there).
- **Throws `Batch1MergeError`** with a precise field path on any mismatch — never returns partial content. This was verified by direct field-by-field diffing of the real approved files (documented in the module's own header comment) before writing the merge logic, confirming the *only* fields that legitimately differ are the ones listed above.
- **Never writes to disk.** The merged object exists only in memory for the lifetime of the module.

Unit-tested in `batch1Merge.test.ts` against synthetic fixtures covering: a valid merge, non-mutation of inputs, and a throw for each of: schemaVersion mismatch, topicId mismatch, record-count mismatch, blockId mismatch, non-Arabic field drift, English-text drift, recordType-order mismatch, and partial-content prevention (a two-record file where only the second record is drifted still throws for the whole file, not a one-record partial result).

## 6. Topic registry and ordering

`PilotTopicId` extended from 4 to 6 literals. Three ordering constants now coexist by design:
- `PILOT_TOPIC_ORDER` (unchanged, 4 topics) — preserved for logic specifically scoped to the original pilot-build authorization.
- `BATCH1_TOPIC_ORDER` (new, 2 topics: `ch01-t01`, `ch01-t04`) — documents Batch 1's own governance ordering.
- `APP_TOPIC_ORDER` (new, 6 topics: `ch01-t01, ch01-t02, ch01-t03, ch01-t04, ch01-t08, ch01-t10`) — the actual chapter-wide sequence the running application now loads and displays, used by `loadAllTopics()`, `validateTopicSet()`, and `config/topics.ts`'s `TOPIC_ORDER`.

No placeholder topic was created for any of the remaining eight Chapter 1 topics. The existing generic route (`chapter/1/topic/:topicId`) required no change — `TopicNavigation`, `TopicCard`, and `TopicPage` are already fully topic-agnostic, consuming only `NormalizedTopic` and `getTopicOrder()`.

## 7. `ch01-t01` rendering

Renders `instructorScript`, `mainIdea`, `organizedExplanation`, `equationSet`, `visualReference` (resolved to `ch01-t01-visual-001.svg`), `misconception` (instructor-only), and `reviewQuestion` (learner-visible). **Has no problem record** — `topic.problem` is `undefined`, and `ProblemCard` already renders `null` when its `problem` prop is `undefined` (pre-existing, unmodified behavior) — confirmed by test to produce empty markup, i.e. no empty problem section and no empty "Show solution" button. Misconception content is confined to `instructorNotes`, never a learner-visible field.

## 8. `ch01-t04` rendering

Renders every content-block type plus `ch01-prob-104` with its full numbered solution and final answer, through the unmodified `ProblemCard`/`SolutionReveal` components.

## 9. Problem and Review Card behavior

- **441 N** appears only inside the solution step's own explanation text as the explicitly-labeled unrounded intermediate ("`W = mg = 45 kg x 9.8 m/s^2 = 441 N (unrounded)`").
- **4.4 x 10^2 N** is the reported final two-significant-figure result, appearing in the same step's explanation and in `finalAnswer.interpretation`.
- The raw `CalculationEntry.result` field is the numeric `441` (unrounded) — confirmed there is no `roundedResult` field anywhere in the schema or the real data; the rounded value exists only as authored text in `explanation`/`interpretation`, never as a separate structured field.
- Both topics' `reviewQuestion` render under the existing **"Review Card"** / **"بطاقة مراجعة"** label — `ReviewQuestion.tsx` was not modified; the label is already generic.

## 10. Visual integration

Both `ch01-t01-visual-001` and `ch01-t04-visual-001` resolve correctly: `topic.visual.recordId` matches each topic's own `*-block-visual` ID, and `topic.visual.svgMarkup` is the real, unmodified SVG content (confirmed to start with `<svg`, confirmed byte-identical to the approved checksums — see §12). `VisualViewer.tsx` was not modified — its enlarge/zoom/pan, dialog focus-trap, scroll-lock, Escape, and close-button behavior are all pre-existing and topic-agnostic (it takes a `NormalizedVisual` prop, never a hardcoded topic ID). The brick-red force color remains embedded only inside `ch01-t04-visual-001.svg`'s own markup — nothing in this integration adds it to any CSS, house-style file, or other visual.

**Known, pre-existing cosmetic discrepancy (not introduced by this integration, and out of scope to fix):** each topic's own `contentBlock.visualGovernance[0].availabilityStatus` field (inside the *approved, immutable* topic JSON) still reads `"missing"` — it was authored before the visual was produced/approved and this integration was explicitly instructed not to alter the topic JSON files. This field is read into `NormalizedVisual.availabilityStatus` but is **not** what determines whether the visual actually renders (that is `svgMarkup`, resolved independently via `RAW_SVG_MARKUP_BY_TOPIC`, which is correctly populated). No component currently branches on `availabilityStatus`, so this has no rendering effect — flagged for awareness only.

## 11. RTL/LTR and equation verification

`equationRenderer.tsx`'s per-topic italic-token whitelists were extended, with a documented per-token ambiguity check against every rendered field of the real approved text (not a blanket rule):

- **`ch01-t01`: `v, d, t, L, T, M`** — verified to appear only as their intended dimensional/measured-variable symbols in every rendered field; no unit-abbreviation or English-word collision found.
- **`ch01-t04`: `g, W`** — verified clean. **`m` is deliberately excluded** from both the equation and prose-safe maps: it is demonstrably ambiguous in this topic's own text, appearing both as the mass variable (`"m is its mass"`, the given-value `"m = 45 kg"`) and as the meters unit abbreviation (`"9.8 m/s^2"`, appearing in the equationSet block, the problem statement, both solution steps, and the `g` given-value string `"g = 9.8 m/s^2"`). Whitelisting `m` would have incorrectly italicized the unit wherever it appears standalone — this mirrors the exact precedent of `ch01-t02`'s excluded `"x"` and `ch01-t08`'s prose-only-excluded `"a"`.

All six required expressions were traced to their real source locations and confirmed to render with every non-`^`/`_` character preserved, LTR-isolated for embedded Latin/notation runs inside Arabic prose: `v = d / t`, `L/T`, `W = mg`, `|g| ≈ 9.8 m/s^2`, `45 kg x 9.8 m/s^2 = 441 N`, `4.4 x 10^2 N`. No approved English or Arabic text was rewritten.

## 12. Integrity and checksum validation

`batch1Integrity.test.ts` hardcodes the approved checksums exactly as recorded in `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `ARABIC_BATCH1_BASELINE_APPROVAL.json`, and `VISUAL_BATCH1_APPROVAL.json` (not self-referentially computed), and checks: file existence, SHA-256 match for all 6 approved files, that the bundled (imported) SVG markup re-hashes to the same approved checksum, that the raw English/Arabic files agree on `topicId`/`schemaVersion`/record IDs/order, and that `RAW_CONTENT_BY_TOPIC` contains exactly the six authorized topic keys — no placeholder or out-of-scope topic ID. Independently re-verified (via Python, outside the test framework) immediately before writing this report: all six checksums still match.

## 13. Tests added or updated

4 new test files (`batch1Merge.test.ts`, `batch1Integrity.test.ts`, `batch1Integration.test.tsx`, plus the merge module itself) and 4 updated existing files (`adapter.test.ts`, `validate.test.ts`, `equationRenderer.test.tsx`, `reviewQuestion.test.ts`). No existing test assertion was weakened or deleted — assertions whose *expected values* changed because the underlying reality genuinely changed (topic count 4→6, specific array indices) were updated to the new correct values; all per-topic behavioral assertions for the original four topics were preserved unchanged.

## 14. Pre-integration test results

**Not run** — Node.js/npm unavailable in this environment (confirmed absent: no `node`, `npm`, `brew`, `nvm`, or equivalent found anywhere on the machine). The prior handoff documentation's last live-verified figure (61/61 passing, 6 files, 2026-07-16) is the most recent known-good baseline; it was not re-confirmed live before this task's edits.

## 15. Post-integration test results

**Not run**, for the same reason. All logic above was verified by static code reading and by independent Python-based re-computation of the real data (checksums, record IDs/order, field-by-field English/Arabic diffing, exact substring verification of the six required expressions) rather than by executing the actual TypeScript/Vitest toolchain.

## 16. TypeScript result

**Not run.** Exact command to run later: `cd apps/chapter1-mvp && npm run typecheck` (i.e. `tsc -b --noEmit`).

## 17. Production-build result

**Not run.** Exact command to run later: `cd apps/chapter1-mvp && npm run build` (i.e. `tsc -b && vite build`).

Test command for the same future session: `cd apps/chapter1-mvp && npm test` (i.e. `vitest run`).

## 18. Browser QA

**Not run.** A meaningful browser QA pass requires a working dev server, which itself requires the same unavailable Node.js/npm toolchain — running one without first confirming `npm run typecheck`/`npm test` pass would risk QA-ing against a broken build. Deferred in full to the future verification task, which should inspect: six-topic home/navigation display and order; `ch01-t01`/`ch01-t04` in both languages; both Review Cards; the instructor panel for both topics; absence of any empty problem UI on `ch01-t01`; the problem/solution flow on `ch01-t04`; both visual dialogs (enlarge/zoom/pan, focus, Escape, scroll-lock); mobile and desktop widths; RTL/LTR; keyboard/focus behavior; and the browser console for errors or React Router warnings. No temporary preview server was started, so none needed to be stopped.

## 19. Existing-topic regression results

**Not run against the real toolchain**, but statically reviewed: no line inside `TopicNavigation.tsx`, `TopicCard.tsx`, `TopicPage.tsx`, `ContentSection.tsx`, `ProblemCard.tsx`, `SolutionReveal.tsx`, `ReviewQuestion.tsx`, `InstructorReviewPanel.tsx`, `VisualViewer.tsx`, `EquationBlock.tsx`, `DiagnosticsPanel.tsx`, `InternalStatusPanel.tsx`, or `InternalStatusBanner.tsx` was modified — all are already fully topic-agnostic. The four original pilot topics' own token whitelists, record data, and governance state are untouched. `adapter.test.ts`'s existing per-topic assertions for `ch01-t02`/`ch01-t10` (titles, record IDs, visual resolution) were preserved verbatim.

## 20. Accessibility findings

No accessibility-relevant code was changed (dialog focus-trap, scroll-lock, Escape handling, `role="img"`/title/desc wiring are all pre-existing and topic-agnostic in `VisualViewer.tsx`). Both new SVGs' own `role="img"` and `<title>`/`<desc>` elements are preserved unmodified (confirmed via checksum match). Not independently re-verified in a live browser in this task (see §18).

## 21. Remaining limitations

- TypeScript/tests/build/browser QA genuinely not executed (see §14–18) — this is the primary open item before this integration can be considered verified.
- The stale `visualGovernance.availabilityStatus: "missing"` cosmetic field noted in §10 (no functional effect, out of scope to fix here since it lives in an immutable approved topic file).
- Cross-browser rendering of the two new visuals remains unverified beyond the checksum/structural checks here (same open item already carried by the four pilot visuals).
- `apps/chapter1-mvp/README.md` does not exist; not created in this task.

## 22. Independent-review status

**Incomplete, unclaimed.** No independent human visual, scientific, or code review has occurred. This report's own verification is Claude's static self-review, explicitly not represented as independent third-party review anywhere in this document.

## 23. Student-facing and publication status

**Unauthorized, unaffected.** No record's `studentFacingAllowed` or `studentPublicationAuthorized` was changed — both remain `false` everywhere in the approved content and validation records (unmodified). No `applicationIntegrationAuthorized`/readiness governance field was changed by this task (see the explicit note at the top of this report — `PILOT_READINESS.json` was deliberately not updated here).

## 24. Exact next controlled task

**Run the actual verification**, in an environment where Node.js/npm are available: `npm run typecheck`, `npm test`, and `npm run build` inside `apps/chapter1-mvp/`, followed by local browser QA per §18's checklist. Only once all of those genuinely pass should `PILOT_READINESS.json` and the three current-state documents be updated to record integration/QA as complete — not before, and not as part of this task.

---

### Explicit statements

- **Node.js/npm were unavailable in this sandbox; TypeScript, tests, production build, and browser QA were NOT executed and are NOT claimed to have passed.**
- **`PILOT_READINESS.json` and the current-state documents were deliberately NOT updated in this task**, per explicit project-owner direction — that remains for the future verification task.
- No approved English, Arabic, or SVG baseline file was modified (all six re-verified byte-identical to their governance checksums after this task's edits).
- No student-facing release, deployment, or publication occurred or was authorized.
- No Git write operation (`add`/`commit`/`push`/merge/PR) occurred.
