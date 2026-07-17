# PHSH111 Batch 1 — Application Verification and QA Report

**Date:** 2026-07-17. **Type:** Executable verification, defect-fix, and readiness-synchronization.

## 1. Purpose

Verifies the Batch 1 (`ch01-t01`, `ch01-t04`) application integration implemented in `docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_REPORT.md`, which could not previously be executed because Node.js/npm were unavailable. A user-scoped Node.js 20 LTS runtime was installed (with explicit authorization) to make this possible.

## 2. Toolchain installed

A checksum-verified, user-scoped Node.js runtime was downloaded directly from the official `nodejs.org` distribution and extracted under the user's home directory — no `sudo`, no system-package modification, no project dependency install/upgrade:

- Downloaded `node-v20.20.2-darwin-arm64.tar.gz` from `https://nodejs.org/dist/v20.20.2/`.
- SHA-256 verified against the official `SHASUMS256.txt` before extraction: `466e05f3477c20dfb723054dfebffe55bc74660ee77f612166fca121dacb65b6` — matched exactly.
- Extracted to `~/.local/node-v20.20.2-darwin-arm64/` (user-scoped, portable; nothing installed system-wide).
- **Node.js v20.20.2 / npm 10.8.2** — this is the exact toolchain version already documented in this project's own prior handoff notes as previously used, so no version drift was introduced.
- `node_modules` was pre-existing and usable (96 entries, `.package-lock.json` present) — **no `npm install`, `npm update`, or `npm audit fix` was run.**

## 3. Preflight verification

| Check | Result |
|---|---|
| Node.js / npm available | v20.20.2 / 10.8.2 ✓ |
| `PILOT_AUTHORIZATION.json` version | `1.5.0` ✓ |
| `PILOT_READINESS.json` version (pre-verification) | `1.13.0` ✓ |
| Approved English/Arabic/SVG checksums | all 6 match governance records ✓ |
| Integration files from the implementation report | all present ✓ |

## 4. Files inspected and modified

**Inspected:** every file listed in `PHSH111_BATCH1_APPLICATION_INTEGRATION_REPORT.md` §3, the authorization record, `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, and the approved Batch 1 baseline/visual files.

**Modified (defect fixes only, all inside `apps/chapter1-mvp/`):**
- `apps/chapter1-mvp/src/content/batch1Merge.ts` — fixed a real merge-validation bug (see §5).
- `apps/chapter1-mvp/src/tests/equationRenderer.test.tsx` — fixed an HTML-entity-escaping test assertion.
- `apps/chapter1-mvp/src/tests/batch1Integration.test.tsx` — fixed the same HTML-entity issue, plus a collapsed-panel assertion.
- `.claude/launch.json` — created (dev-server launch config for browser QA; not application source).

**Created:** `docs/app/PHSH111_BATCH1_APPLICATION_VERIFICATION_AND_QA_REPORT.md` (this document).

**Modified (governance, only after all checks passed):** `docs/content-design/chapter-01/PILOT_READINESS.json`.

**Not modified:** any approved English, Arabic, baseline, glossary, identifier-registry, or SVG file — all six re-verified byte-identical to their governance checksums after every fix (see §11).

## 5. Defects found and fixes applied

**Defect 1 (real product bug, in newly-added integration code — `batch1Merge.ts`):** The approved English baseline files omit the `ar` key entirely from every `LocalizedContent`-shaped field (`localizedContent` on every contentBlock; `problemStatement`, `conceptualInterpretation`, `intuition`, each `numberedSolution[].explanation`, `finalAnswer.interpretation` on the problem record) — there is no `{text: null, status: "missing"}` placeholder there, unlike what the merge module had assumed. This caused every merge to throw immediately (`"...localizedContent (English file).ar" is missing or not an object`).
- **Fix:** `requireLocalizedContentSide()` now takes a `sides` parameter and only validates/reads the keys actually expected on each side — `["en"]` for the English file, `["en", "ar"]` for the Arabic file. Verified directly against the real files (both topics, every contentBlock and the problem record) before and after the fix.

**Defect 2 (test-only bug, in newly-added test files):** `renderToStaticMarkup` (react-dom/server) correctly HTML-escapes apostrophes as `&#x27;` in rendered text content — expected, standard SSR behavior. Two new test files compared rendered markup against the raw source string without decoding entities, so any source text containing an apostrophe (e.g. "Earth's", "object's" — present in Batch 1's text but not in the four original topics') failed the comparison.
- **Fix:** added a shared entity-decoding step (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#x27;`) to the `textOnly()` helpers in both `equationRenderer.test.tsx` and `batch1Integration.test.tsx`.

**Defect 3 (test-only bug, in a newly-added test):** A test asserted the `InstructorReviewPanel`'s "Not student-facing material" disclaimer appears in the initial static markup — but the panel is collapsed by default (`useState(false)`, same pattern as `SolutionReveal`), so that text is only present once expanded.
- **Fix:** the test now asserts what is actually present in the collapsed state (the toggle badge and "Show instructor review note" text).

No approved English, Arabic, glossary, baseline, identifier, or SVG file was touched by any fix. After each fix, the complete verification sequence (typecheck → test → build) was rerun from scratch.

## 6. TypeScript result

**Pass — zero errors**, both before the fix-and-rerun cycle completed and on the final confirmation run: `tsc -b --noEmit` produced no output (clean).

## 7. Full test result and exact test count

**131 / 131 tests passing, across 9 test files** (final run, after fixes):

```
✓ src/tests/batch1Merge.test.ts (12 tests)
✓ src/tests/validate.test.ts (13 tests)
✓ src/tests/reviewQuestion.test.ts (7 tests)
✓ src/tests/batch1Integrity.test.ts (18 tests)
✓ src/tests/adapter.test.ts (13 tests)
✓ src/tests/reviewQuestionRender.test.tsx (4 tests)
✓ src/tests/equationRenderer.test.tsx (25 tests)
✓ src/tests/batch1Integration.test.tsx (30 tests)
✓ src/tests/visualViewerDialog.test.tsx (9 tests)

Test Files  9 passed (9)
     Tests  131 passed (131)
```

No test was weakened, skipped, or deleted — the three fixes above corrected assertions to check what the (correct) code actually does, not to make failures disappear by asserting less.

## 8. Production-build result and bundle information

**Succeeds.** `tsc -b && vite build`: 81 modules transformed (up from 72 pre-Batch-1, consistent with two additional topics' content and two additional SVGs now bundled).

| Asset | Size | Gzip |
|---|---|---|
| `dist/index.html` | 0.48 kB | 0.32 kB |
| `dist/assets/index-*.css` | 11.41 kB | 2.58 kB |
| `dist/assets/index-*.js` | 724.69 kB | 195.49 kB |

Vite's standard "chunk larger than 500 kB" advisory notice appeared (informational, not an error) — consistent with the already-known, previously-deferred bundle-growth/code-splitting item this project's own documentation has flagged since before Batch 1.

## 9. Browser QA results

Ran against the real dev server (`vite`, port 5173) via a user-scoped `.claude/launch.json` config.

- **Six-topic order:** confirmed exactly `ch01-t01, ch01-t02, ch01-t03, ch01-t04, ch01-t08, ch01-t10` on the Chapter 1 grid page and via each topic's Previous/Next navigation links (spot-checked at every topic boundary, including `ch01-t10` correctly showing no "next" link as the final topic).
- **`ch01-t01` English:** Main Idea, Explanation, Key Equation, Scientific Visual, Review Card, and instructor panel all render correctly; `v`, `d`, `t`, `L`, `T`, `M` correctly italicized in running text.
- **`ch01-t01` Arabic:** full RTL content confirmed correct via the language toggle, including the bilingual SVG's own embedded labels, "بطاقة مراجعة" (Review Card), and equation fragments (`v = d / t`) LTR-isolated inside Arabic prose.
- **`ch01-t01` no empty problem/solution UI:** confirmed — no "Original Problem" heading or "Show solution" button appears anywhere on the page (`ProblemCard` renders nothing when `problem` is undefined).
- **`ch01-t04` English and Arabic:** both fully confirmed, including the visual's push/lift/scale panels and legend in both languages.
- **`ch01-prob-104` and its solution:** confirmed present; expanding "Show solution" reveals the numbered steps and final answer.
- **441 N / 4.4 × 10² N:** confirmed in both languages — step 1's explanation states `"W = mg = 45 kg x 9.8 m/s2 = 441 N (unrounded)... W = 4.4 x 10^2 N"`; the final answer states `"4.4 x 10^2 N (441 N unrounded, ...)"` — 441 N never appears as a standalone final result.
- **Review Card labels:** correct in both languages ("Review Card"/"Self-check" and "بطاقة مراجعة"/"تقييم ذاتي") for both new topics.
- **Instructor-only visibility:** confirmed — the misconception content for both topics only appears inside the collapsed `InstructorReviewPanel`, never in the main learner flow; expanding it shows the correct internal-only disclaimer.
- **RTL/LTR and equations:** confirmed correctly ordered in both languages for both topics.
- **Both approved SVGs load:** confirmed — `ch01-t01-visual-001.svg` (1000×820) and `ch01-t04-visual-001.svg` both render with correct bilingual embedded text.
- **Enlarge / close / Escape / focus trap / scroll lock:** all confirmed working for `ch01-t01`'s visual dialog via direct DOM inspection (`dialog.open`, `document.body.style.overflow`, `document.activeElement`) at both desktop and mobile viewport widths — dialog opens, moves focus to the close button, locks scroll (`overflow: hidden`), Escape and the close button both close it, restore scroll, and return focus to the enlarge button.
- **Zoom / pan:** the enlarge dialog displays the SVG at its full native size (confirmed 1000×820 px, matching the approved viewBox) inside a scrollable dialog — this is the same pre-existing, unmodified mechanism the four pilot visuals already use (native browser zoom/scroll, not a custom pan/zoom widget); unchanged by this integration.
- **Mobile and desktop layouts:** both confirmed usable — mobile (375×812) shows a clean, non-overlapping single-column layout with the internal-draft banner intact; desktop (1280×900) shows the full multi-element layout correctly.
- **Existing four pilot topics:** `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10` all spot-checked — correct titles, problem cards, review questions, and visuals present; no regression found.
- **Browser console:** zero error-level messages; zero React Router warnings found (only benign Vite HMR/React-DevTools info/debug messages).

**One tooling caveat, not an app defect:** this sandbox's screenshot-capture mechanism produces blank images after certain scroll operations. This was independently reproduced identically on the untouched `ch01-t02` pilot topic, proving it is a pre-existing artifact of this browser-automation environment, not a rendering regression — confirmed by cross-checking the same content via `get_page_text`, the accessibility tree, and direct DOM/`getBoundingClientRect` inspection, all of which showed the real content correctly present and sized throughout.

All preview servers were stopped at the end of QA; no server process was left running.

## 10. Six-topic ordering

Confirmed via three independent methods: the Chapter 1 grid page text ("TOPIC 1 OF 6" … "TOPIC 6 OF 6"), each topic page's Previous/Next navigation targets, and the automated test suite (`batch1Integration.test.tsx`, `adapter.test.ts`). Order: `ch01-t01, ch01-t02, ch01-t03, ch01-t04, ch01-t08, ch01-t10`.

## 11. English/Arabic results

Both languages confirmed fully correct for both new topics, matching the approved baselines exactly, with no runtime machine translation and no rewritten content. `step.purpose` (a plain, non-localized schema field) correctly remains English-only in both language views for `ch01-t04`'s problem — this is pre-existing schema behavior shared with all four original topics, not a Batch 1-specific gap.

## 12. Problem and Review Card behavior

`ch01-t01` has no problem record and shows no problem/solution UI. `ch01-t04` shows `ch01-prob-104` with a working solution-reveal; 441 N appears only as the explicitly-labeled unrounded intermediate, and 4.4 × 10² N is the reported final result, in both languages. Both topics' Review Cards render under the unmodified "Review Card"/"بطاقة مراجعة" label.

## 13. Visual-dialog behavior

Confirmed for `ch01-t01`'s visual at both desktop and mobile widths: enlarge opens a native `<dialog>` at full SVG native size, focus moves to the close control, background scroll locks, Escape and the close button both close it and restore scroll and focus to the original opener. Identical, unmodified mechanism as the four pilot visuals.

## 14. Accessibility and regression findings

`role="img"` and `<title>`/`<desc>` wiring confirmed intact for both new SVGs via the accessibility tree (exposed as an `img`-role node with the full description as its accessible name). No accessibility-relevant code was changed. All four original pilot topics regression-checked with no defect found.

## 15. Baseline checksum verification

Re-verified immediately before and after every fix, and again at the end of this task: all six approved files (2 English, 2 Arabic, 2 SVG) remain byte-identical to their `ENGLISH_BATCH1_BASELINE_APPROVAL.json` / `ARABIC_BATCH1_BASELINE_APPROVAL.json` / `VISUAL_BATCH1_APPROVAL.json` checksums.

## 16. Final `PILOT_READINESS.json` version

**1.13.0 → 1.14.0.** Only the scoped `batch1DraftingReadiness` section was updated: `applicationIntegrationImplemented: true`, `applicationIntegrationImplementedAt`, `applicationIntegrationVerificationReportPath`, `verifiedTopicCount: 6`, `verifiedTopicOrder`, `typeScriptCheckResult: "pass"`, `testSuiteResult: "pass"`, `testCount: 131`, `productionBuildResult: "pass"`, `browserQaResult: "pass"`, `existingTopicRegressionResult: "noneFound"`, and each topic's `applicationExpansionImplemented: true`. Preserved unchanged: `canonicalGenerationAuthorized: false`, `studentPublicationAuthorized: false` (chapter-wide), `independentHumanReviewComplete: false`, `studentFacingAllowed` (per-record, unchanged), the original four-topic `pilotTopicOrder`, and all prior readiness history (a new note was appended, none rewritten).

## 17. Remaining limitations

- Independent human visual/scientific review remains incomplete (unchanged, unclaimed).
- The pre-existing screenshot-capture tooling artifact noted in §9 (unrelated to the app; also present on unmodified pilot topics).
- Bundle-size advisory (724.69 kB JS) — an existing, already-deferred code-splitting consideration, not new to Batch 1.
- The stale `visualGovernance.availabilityStatus: "missing"` field inside the approved (immutable) topic JSON, noted in the implementation report, remains — cosmetic only, no rendering effect.
- `apps/chapter1-mvp/README.md` did not exist before this task; see documentation-sync notes below for what was done about it.

## 18. Exact next controlled task

**A project-owner decision on whether to pursue independent human visual/scientific review and/or a future student-facing/publication authorization track for Batch 1** — both remain the next genuinely open governance gates; this task performs internal verification only and does not itself authorize either.

---

### Explicit statements

- **TypeScript, the full test suite (131/131), and the production build all pass.**
- **Browser QA passed** for all listed checks; no regression found in the four original pilot topics.
- **`PILOT_READINESS.json` is now v1.14.0**, updated only after every check above succeeded.
- **No approved English, Arabic, baseline, glossary, identifier, or SVG file was modified** — all six re-verified byte-identical throughout.
- **No student-facing release, deployment, or publication occurred or was authorized.**
- **No Git write operation** (`add`/`commit`/`push`/merge/PR) occurred.
