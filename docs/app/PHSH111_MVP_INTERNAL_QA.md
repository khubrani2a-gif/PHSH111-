# PHSH111 Chapter 1 Internal MVP — Phase 3 Internal QA Report

## 1. Scope and date

Phase 3 (Internal QA and accessibility hardening) of the PHSH111 Chapter 1 internal pilot MVP, performed 2026-07-16, under `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` v1.1.0's `applicationBuildAuthorization`. Scope: canonical `reviewQuestion` rendering, `VisualViewer` modal accessibility hardening, a keyboard-accessibility review, a measured contrast audit of application chrome, a responsive/bilingual QA pass, automated-test additions, and this report. All work was confined to `apps/chapter1-mvp/`, with this document as the one permitted file outside that directory.

## 2. Repository and authorization state

Re-verified against the live repository at the start of this phase and unchanged since:

- Authorized app path: `apps/chapter1-mvp/`. Authorization version: 1.1.0 (`PILOT_AUTHORIZATION.json`), status `granted`.
- Authorized topics, unchanged: `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`.
- `studentFacingAllowed`, `studentPublicationAuthorized`: `false` everywhere — not touched by this phase.
- Canonical content JSON, SVGs, visual-validation records, baseline approvals, `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, `MVP_IMPLEMENTATION_DECISIONS.json`, and everything under `docs/content-audits/` were not modified — confirmed by keeping every edit this phase scoped to `apps/chapter1-mvp/` plus this one document.
- Repository trees remain untracked (`git status`: `?? apps/`, `?? docs/`, `?? tmp/`, unchanged). No Git operation (init/add/commit/push) was performed.

## 3. Verified application features

All four topics (`ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`) were inspected end-to-end in both English and Arabic via a real running dev server in the Browser pane: title, main idea, explanation, equation panel, scientific-visual preview and enlarge dialog, worked example, original problem with given values/setup, revealable solution, the new review-question section, the collapsed instructor-review panel, the collapsed internal-status panel, and previous/next navigation. The persistent Draft/Review-Required banner was visible on every page and language throughout.

## 4. Canonical-content integrity

- `rawImports.ts` still imports the four canonical JSON files and four SVGs directly from `docs/content-design/chapter-01/pilot/`; no duplication was introduced (no `.svg` or `ch01-t*-content.json` files exist inside `apps/chapter1-mvp/src` or `public/`).
- No canonical content JSON, SVG, or visual-validation file was modified this phase (verified: only files under `apps/chapter1-mvp/` and this document were touched).
- `governance.ts`'s `PUBLICATION_STATE` constants and `isLearnerVisible` gate are unchanged.
- The adapter test "never places a visibility:instructor record in the learner-facing fields" (`adapter.test.ts`) still passes for `mainIdea`/`explanation`/`equations`/`workedExample`, and a new equivalent guarantee now covers `reviewQuestion` (§5).

## 5. reviewQuestion implementation

**Inspection of the canonical records** (all four topics, `docs/content-design/chapter-01/pilot/ch01-t*-content.json`): each topic has exactly one `reviewQuestion` contentBlock (`ch01-t*-block-review`), `visibility: "student"` in all four (no topic currently has an instructor-only reviewQuestion), `blocking.studentFacingAllowed: false` in all four. Each record's `localizedContent` is a single authored prose string per language that already contains the question, the correct answer, and its explanation together — there is no separate question-only/answer-only field, unlike the `problem` record's genuinely separate `problemStatement` vs. `numberedSolution`/`finalAnswer`.

**Implementation** (`src/features/topics/ReviewQuestion.tsx`, new):
- Renders only the section's own `text[language]`, through the same `renderEquationText` LTR-isolation/superscript pipeline used elsewhere (these strings contain embedded notation, e.g. t08's `m/s²`, t10's `a_c`).
- Preserves the record ID as a `data-record-id` attribute on the rendered section.
- Does not invent, split, or hide-and-reveal an answer/explanation/hint/grading rule — since the source has no structural boundary between question and answer, inventing a reveal split would mean guessing that boundary from prose wording, which differs per topic and per language ("Correct answer:" vs. "Correct answers:" vs. "الإجابة الصحيحة:" vs. "الإجابتان الصحيحتان:"). This reasoning is documented in the component's own header comment.
- Does not reuse `ProblemCard`/`SolutionReveal` (which are built on the `problem` record's genuinely separate fields).
- Visually distinct: its own fuchsia accent (`--color-review-*`, new tokens, distinct from the equation panel's teal, the instructor panel's indigo, and the danger/missing-state red), its own "Review Question" heading and "Self-check" badge.

**Wiring** (`src/content/adapter.ts`, `src/types/normalized.ts`): `NormalizedTopic.reviewQuestion` is populated only when the block's own visibility is `isLearnerVisible` (`"shared"`/`"student"`); an instructor-only reviewQuestion is never duplicated there — it already flows into `instructorNotes` via the same generic visibility filter every other instructor-only contentBlock uses (confirmed with a synthetic fixture, since no real topic currently has this case — see §12). `TopicPage.tsx` renders `<ReviewQuestion>` only inside `{topic.reviewQuestion ? ... : null}`, so a topic without an eligible reviewQuestion produces no heading at all (also confirmed with a synthetic no-block fixture). `InstructorReviewPanel.tsx` now labels each instructor-only note by its `blockType` (`Misconception` / `Review Question (instructor-only)`), so a future instructor-only reviewQuestion would be visually distinguishable from a misconception note inside that panel. Unsupported/missing visibility on any contentBlock (reviewQuestion included) already produces an `invalid-visibility` error diagnostic via the existing, unmodified `validate.ts` — generic across all block types, not reviewQuestion-specific code.

## 6. Bilingual and bidi results

Verified live in the Browser pane, both languages, all four topics:
- Language toggle updates `dir`/`lang` at the document root and all UI chrome/content atomically (`document.documentElement.lang`/`.dir` checked programmatically after toggling: `ar`/`rtl`).
- RTL layout mirrors correctly: header (brand right, nav+toggle left under RTL), paragraph alignment, list/nav flex order (previous/next visually swap sides under RTL flex-reversal) — **but the semantic destination stays correct**: on `ch01-t10` in Arabic, "الموضوع السابق" (Previous) correctly links to `ch01-t08`'s title and "الموضوع التالي" (Next) is correctly the disabled end-of-sequence state, confirmed via DOM-order text extraction, not just visual position.
- Equations remain LTR-isolated inside Arabic prose in every case inspected (e.g. t10's `aC = v² / r، حيث...`), with no visible bidi character reordering.
- `border-inline-start` accent borders (equation panel, review-question panel) correctly flip to the visual right edge under RTL — confirmed on `ch01-t10`'s Arabic page.
- The persistent Draft banner and its Arabic translation are present and correctly styled in RTL.

## 7. Equation-rendering results

Unchanged from Phase 2 and re-confirmed live: true `<sup>`/`<sub>`, italic variables, upright units, in both languages, across all four topics' equation panels, worked examples, given-value lists, and solution steps (e.g. t10's `a_c = v²/r`, t08's `m/s²`, t02's `cm²`/`cm³`). The 41 pre-existing equation/adapter tests plus the new reviewQuestion-specific tests (§12) all pass.

## 8. Visual-dialog accessibility

**Chosen approach**: the enlarge dialog now uses the native `<dialog>` element with `.showModal()`, in place of the prior hand-rolled overlay `<div>`. Rationale and tradeoffs are documented in `VisualViewer.tsx`'s header comment; summary:

- `.showModal()` natively traps Tab/Shift+Tab focus inside the dialog and makes the rest of the document inert (unfocusable, hidden from assistive tech) for as long as it's open — **confirmed live** in this session: repeated real Tab and Shift+Tab key presses kept focus on the dialog's only focusable control (the close button); a programmatic `.focus()` call targeting a background control (the language toggle) while the dialog was open was refused by the browser (focus stayed on the close button).
- **State sync is deliberately not wired through the dialog's own native `close`/`cancel` events.** Testing in this session's actual browser (Chromium via Electron) found that neither event fires after `dialog.close()` — reproduced with a bare, app-independent `<dialog>` element created via `document.createElement`, so this is an environment characteristic, not a bug in this component. Every close path (close button, backdrop click, Escape) instead calls one local `close()` function directly, which updates React state and calls the native `.close()` for hygiene, but depends on none of its events.
- Escape is handled by an explicit `keydown` listener (attached only while open), not the dialog's native light-dismiss behavior, for the same reason.
- Background scroll is locked (`document.body.style.overflow = "hidden"`) on open and restored to its exact prior inline value on close **and on unmount** (verified: a distinctive prior value of `"scroll"` was correctly restored, and restoration also fires if the component unmounts while the dialog is still open, e.g. navigating away).
- Initial focus lands on the close button; focus returns to the exact opener button after close, via an effect that runs only after the trigger button has been re-rendered back into the DOM (see the defect fix in §16).
- Backdrop click closes; a click anywhere inside the dialog's rendered content does not (checked via a `e.target === dialogRef.current` guard plus a redundant `stopPropagation` on the inner content wrapper).
- Only one copy of the SVG (with its internal `id`-referenced `<title>`/`<desc>`) is ever mounted at a time — the preview and the dialog are mutually exclusive on `isOpen`, preserved from the original design.
- No permanent modification is made to the canonical SVG markup at any point — same `dangerouslySetInnerHTML={{ __html: visual.svgMarkup }}` pattern as before, unchanged string.
- The dialog has an accessible name via `aria-labelledby`; the close button's accessible text is localized (`"Close enlarged visual"` / `"إغلاق العنصر البصري المكبّر"`).

**All of the above focus-trap/inertness/scroll-lock/close-path behavior was verified live** in a real Chromium-based browser this session (not simulated). Automated unit coverage (§12) additionally exercises the parts of this logic that are the component's own responsibility (state, refs, effect ordering, scroll-lock save/restore) using a jsdom polyfill for `showModal`/`close`, since jsdom itself does not implement those two methods (confirmed empirically) and cannot simulate real browser focus-containment.

## 9. Keyboard-accessibility findings

Tested with real Tab/Shift+Tab/Escape/click key and mouse events dispatched into the actual running application in the Browser pane (not solely static inspection), after establishing genuine page-level input focus with a prior click — this distinction mattered in practice (see below).

**Verified live, with real browser behavior:**
- Tab order is logical and complete: skip-link → header brand link → Chapter-1 nav link → language toggle → (per topic page) internal-status toggle → visual-enlarge button → solution-reveal toggle → instructor-review toggle → previous/next links — confirmed both by stepping real Tab presses and by a full programmatic enumeration of every focusable element in DOM order.
- The skip link is the first focusable element, is visually hidden until focused, and becomes visible with a clear focus outline when it receives focus (confirmed by screenshot).
- Visible focus indicators (teal `outline`) appear on every interactive element exercised.
- `aria-expanded` correctly toggles `false`↔`true` on every disclosure control (internal-status panel, instructor-review panel, solution reveal), confirmed programmatically before/after real clicks.
- `aria-controls` correctly resolves to a real element ID once its panel is expanded (checked via `document.getElementById`). While collapsed, the referenced ID does not yet exist in the DOM (the panel body is conditionally rendered) — a common, low-severity disclosure-widget pattern, not unique to this phase's changes, not fixed here as it was out of this phase's defect scope and does not meaningfully impair the disclosure semantics once expanded.
- The visual-enlarge dialog's focus trap, background inertness, Escape-to-close, scroll lock, and focus-return-to-opener were all independently confirmed live (§8).
- Unknown-topic recovery (`/chapter/1/topic/ch01-t99`): renders a clean "Not found" state naming the invalid ID, with a working "Return to Chapter 1" link — no crash, no blank page, Draft banner still visible.
- No accidental keyboard trap exists anywhere outside the intentionally-trapped open dialog.

**Could not be positively demonstrated live in this tool session (environment limitation, not an app defect):** native Enter/Space activation of ordinary `<button>` elements (e.g. the internal-status toggle). Direct investigation traced the cause precisely: a `keydown` listener attached to `document` recorded the dispatched event's `e.key` as an **empty string** for both `"Return"` and `"space"` key-press requests sent through this Browser-pane tool, instead of `"Enter"`/`" "` — reproduced twice, with focus independently confirmed to be on the target element both times. Because every toggle button in this application is a plain, unmodified native `<button type="button">` with no custom `keydown` handling anywhere in the codebase (confirmed by source inspection — `grep` for keydown handlers in `src/features/topics/*.tsx` finds none on any disclosure button), Enter/Space activation is guaranteed by standard HTML button semantics in any real browser and is not something this application's code could get wrong independently of that guarantee. This is flagged as **still requiring a physical hardware-keyboard confirmation**, not claimed as verified.

## 10. Contrast measurements

Calculated (WCAG relative-luminance formula) against the actual hex values in `src/styles/global.css`, for application chrome only — the canonical SVGs' own internal contrast is governed separately by `VISUAL_HOUSE_STYLE.md` and untouched here.

| Element / pair | Foreground | Background | Ratio | Target | Result |
|---|---|---|---|---|---|
| Primary body text on page | `#0f172a` | `#f8fafc` | 17.06:1 | 4.5:1 | Pass |
| Primary body text on white surface (cards) | `#0f172a` | `#ffffff` | 17.85:1 | 4.5:1 | Pass |
| Secondary/muted text | `#334155` | `#ffffff` / `#f8fafc` | 10.35:1 / 9.90:1 | 4.5:1 | Pass |
| Links / focus color | `#1f6f8b` | `#ffffff` / `#f8fafc` | 5.67:1 / 5.42:1 | 4.5:1 | Pass |
| Solution-reveal button (white text on teal) | `#ffffff` | `#1f6f8b` | 5.67:1 | 4.5:1 | Pass |
| Keyboard-focus outline (graphical) | `#1f6f8b` | `#ffffff` / `#f8fafc` | 5.67:1 / 5.42:1 | 3:1 | Pass |
| Draft banner text | `#b45309` | `#fff7ed` | 4.73:1 | 4.5:1 | Pass |
| **Draft banner/badge border (graphical)** | `#f59e0b` | `#fff7ed` | **2.02:1** | 3:1 | **Fail → fixed** |
| Equation-panel accent border (graphical) | `#1f6f8b` | `#ffffff` | 5.67:1 | 3:1 | Pass |
| Review-question text | `#86198f` | `#fdf4ff` | 7.67:1 | 4.5:1 | Pass |
| Review-question badge (white on fuchsia) | `#ffffff` | `#a21caf` | 6.32:1 | 4.5:1 | Pass |
| Review-question accent border (graphical) | `#a21caf` | `#fdf4ff` | 5.89:1 | 3:1 | Pass |
| Instructor/internal-status panel text | `#3730a3` | `#eef2ff` | 8.88:1 | 4.5:1 | Pass |
| **Instructor/internal-status badge (white on indigo)** | `#ffffff` | `#818cf8` | **2.98:1** | 4.5:1 | **Fail → fixed** |
| **Instructor/internal-status panel border (graphical)** | `#818cf8` | `#eef2ff` | **2.67:1** | 3:1 | **Fail → fixed** |
| Diagnostics-panel error/warning text | `#b91c1c` / `#b45309` | `#f8fafc` | 6.18:1 / 4.73:1 | 4.5:1 | Pass |
| Disabled prev/next nav text | `#cbd5e1` | `#f8fafc` | 1.42:1 | — | Exempt (inactive UI component, WCAG 1.4.3 exception — it is a non-interactive `<span aria-disabled="true">`, not a real link) |

**Corrections applied** (smallest change that clears the target with margin, in `global.css`):
1. `--color-draft-border`: `#f59e0b` → `#c2660a` (2.02:1 → 3.80:1).
2. `--color-reviewer-border`: `#818cf8` → `#4f46e5` (badge text 2.98:1 → 6.29:1; border-vs-bg 2.67:1 → 5.62:1).

No canonical SVG color was touched.

## 11. Responsive findings

Inspected at 375px, 768px, 1280px, and 1600px, both languages, using the actual running app:

- No horizontal page overflow observed at any breakpoint (the visual-enlarge dialog's own internal pan/scroll is a deliberate, contained exception, per design).
- 375px: single-column, readable body/equation/problem text in both languages; the SVG preview is shown inline (unchanged Phase 2 behavior) — for `ch01-t10` specifically (the widest, most detail-dense diagram), the finest legend/caption text is small at this width, consistent with the risk `VISUAL_HOUSE_STYLE.md` already documented and left open in Phase 2 (not a Phase 3 regression). The "Enlarge visual" affordance was confirmed working correctly as the mitigation: opening it shows the SVG at full native size in a pannable/scrollable container (visible scrollbar), with all labels clearly legible.
- 768px: the same `ch01-t10` diagram's inline legend text is comfortably legible without opening the dialog.
- 1280px/1600px: content stays capped at a comfortable max-width (no stretched illegible lines); the Draft banner remains visible and prominent at every width.
- Review-question sections never leave an empty heading or irregular gap (confirmed across all four topics, both languages) — they simply don't render when absent, and currently render on every topic since all four have an eligible record.
- Instructor-review and internal-status panels remain visually secondary (indigo, collapsed-by-default) at every breakpoint checked.
- Long problem/solution text wraps correctly with no overflow, in both languages, at every breakpoint checked.
- Previous/next navigation remains semantically correct in RTL at every breakpoint checked (§6).

No responsive defect was found or fixed this phase; the one known limitation (fine SVG legend text at 375px for `ch01-t10`) is a carried-over, previously-documented characteristic with a working, verified fallback, not a new issue.

## 12. Automated-test results

**61 of 61 tests passing**, 6 test files (up from 41/41 across 3 files at the start of this phase), executed live via `npm test` (Vitest 2.1.9) with the user-scoped Node.js toolchain (§ report item 2 below):

- `validate.test.ts` (12), `adapter.test.ts` (11), `equationRenderer.test.tsx` (18) — pre-existing, unchanged, still passing.
- `reviewQuestion.test.ts` (7, new) — synthetic-fixture tests (mirroring `validate.test.ts`'s pattern) proving: a learner-visible (`student`) reviewQuestion is placed into `topic.reviewQuestion` with its record ID and bilingual text preserved; a learner-visible (`shared`) one is too; an **instructor-only** reviewQuestion is never placed into the learner flow and is routed to `instructorNotes` instead; a topic with no reviewQuestion block at all leaves the field `undefined` (never an invented empty section); blocking/governance metadata is preserved; plus two real-data checks that all four live topics currently have a learner-visible reviewQuestion with `studentFacingAllowed: false` and are not duplicated into `instructorNotes`. (`normalizeTopic` was exported from `adapter.ts` for this, alongside the already-exported `validateTopicFile`/`validateTopicSet`, for the same reason.)
- `reviewQuestionRender.test.tsx` (4, new) — `renderToStaticMarkup` tests proving the component renders its heading/badge/text, preserves the record ID as a `data-record-id` attribute, shows the controlled missing-text fallback (never a blank section) when a language is absent, and never emits text beyond the section's own canonical content.
- `visualViewerDialog.test.tsx` (9, new, jsdom) — dialog opens on click; closes via the close button; closes on Escape; closes on a backdrop click but not a click inside the dialog content; moves focus to the close button on open; returns focus to the exact opener on close; locks body scroll and restores the exact prior value on close; restores body scroll on unmount even if left open; never mounts two copies of the SVG at once. **One new dev dependency was added, `jsdom@29.1.1`**, justified because these assertions need a real `document.activeElement`/element lifecycle that the suite's default Node environment doesn't provide; it is scoped to this one file via a per-file `// @vitest-environment jsdom` pragma, not the whole suite. jsdom does not implement `HTMLDialogElement.showModal()`/`.close()` (confirmed empirically), so the test file includes a minimal same-file polyfill for those two methods sufficient to exercise this component's own state/effect logic — it does not and cannot simulate real focus-trap/inertness, which is why that specific behavior was verified live in a real browser instead (§8, §9). No Playwright/Cypress or other E2E framework was added.

Existing coverage already satisfied "equation strings remain unchanged" and "canonical records are not mutated" (`equationRenderer.test.tsx`'s character-preservation assertions; `adapter.test.ts`'s "does not mutate the raw imported JSON" test) — not duplicated.

## 13. TypeScript and build results

- `npm run typecheck` (`tsc -b --noEmit`): clean, zero errors, run live after every code change this phase.
- `npm run build` (`tsc -b && vite build`): succeeded. **72 modules transformed** (was 71 before this phase — the one addition is `ReviewQuestion.tsx`).

## 14. Browser-console results

Checked in a freshly opened tab (not the tab accumulating this session's testing) at `http://127.0.0.1:5173/chapter/1/topic/ch01-t02`: only the expected Vite HMR connection messages and the React DevTools suggestion — **zero errors, zero warnings**, including no React Router `v7_startTransition`/`v7_relativeSplatPath` warnings. Cross-referencing `App.tsx` confirms `<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>` is already correctly configured (carried over from Phase 1) — this is why the warnings don't appear; nothing needed to change. The main testing tab, after this session's extensive interaction (dozens of navigations, language toggles, dialog opens/closes, resizes), also showed zero console errors when checked.

## 15. Dependency advisories

`npm audit`: **5 vulnerabilities (3 moderate, 1 high, 1 critical by npm's count), all tracing to one root cause**: `esbuild` ≤0.24.2's dev-server CORS issue (GHSA-67mh-4wv8-2f99), fanned out through Vite's and Vitest's dependency chains (`vite` ≤6.4.2, `vite-node` ≤2.2.0-beta.2, `@vitest/mocker` ≤3.0.0-beta.4 all listed as depending on the vulnerable esbuild). This affects only the local dev-server/test-tooling's own HTTP layer, never the production `dist/` bundle. The only fix path npm offers is `npm audit fix --force`, which would install `vite@8.1.5` — an unrequested major-version upgrade explicitly out of scope for this phase. **Not run.** Unchanged from the state reported at the end of Phase 2.

## 16. Defects found and fixed

1. **Focus-return timing bug in the visual-enlarge dialog** (found during live keyboard testing, not present in any prior written report as a known issue): the original Phase 2 implementation called `triggerRef.current?.focus()` synchronously inside the same handler that closed the dialog — at that point in React's render cycle, the preview (and its trigger button) had not yet been re-rendered back into the DOM after the preview/dialog's mutually-exclusive conditional rendering, so `triggerRef.current` was `null` and focus silently failed to return anywhere useful. **Fixed** by moving focus-return into its own `useEffect` keyed on `isOpen` transitioning to `false`, which runs after the DOM has already been updated to show the trigger button again. Verified live: focus now correctly lands back on the exact "Enlarge visual" button after every close path.
2. **Two real WCAG contrast failures** in application chrome (§10): the draft banner/badge border (2.02:1) and the instructor/internal-status panel's badge text and border (2.98:1 / 2.67:1). **Fixed** with the smallest color adjustments that clear their respective targets with margin (§10).
3. (Design decision, not a defect, but worth recording): the enlarge dialog's close-path architecture was changed to not depend on the native `<dialog>` `close`/`cancel` events, after live testing showed those events did not reliably fire in this session's browser environment even though the dialog's own `open`/focus/inertness behavior worked correctly. All three close paths now funnel through one local function that doesn't depend on that event firing (§8).

## 17. Remaining limitations

- Native Enter/Space activation of toggle buttons relies on standard, unmodified `<button>` semantics and could not be independently demonstrated live in this tool session due to a synthetic-key-event limitation in the testing tool itself (§9) — recommend a manual hardware-keyboard pass to formally close this out.
- Focus-trap/background-inertness for the native `<dialog>` was verified in one browser engine (Chromium, via Electron) this session; not cross-checked in Firefox/Safari.
- `ch01-t10`'s finest inline-preview legend text remains small at ~375px (pre-existing, documented, working fallback via the enlarge dialog) — unchanged from Phase 2, not a new defect, not addressed as a redesign since it was out of this phase's defined scope.
- `aria-controls` on collapsed disclosure panels references an element ID that doesn't exist in the DOM until expanded — a common, low-severity, tolerated pattern across all three disclosure widgets (internal-status, instructor-review, solution-reveal); not changed this phase.
- `npm audit`'s 5 advisories remain, all one root cause in dev-tooling only, deliberately not force-fixed (§15).
- Cross-browser Arabic glyph-shaping verification remains limited to the browsers actually used during authoring/testing sessions, consistent with the same caveat already recorded in `VISUAL_HOUSE_STYLE.md` for the canonical visuals.

## 18. Items requiring independent human review

Unchanged by this phase, and not addressed by it:
- All four visuals' validation records still show `reviewer: null`, `reviewedAt: null` — no human review has occurred on any of them.
- All canonical content records remain `draft`/`blocked` and have not been independently reviewed by a human scientific or editorial reviewer since the prior phases' project-owner-authorized reviews.
- The new `reviewQuestion` UI surface (this phase's own new code and the CSS contrast corrections) has been verified by the tests, static inspection, and live browser interaction described in this report — that is Claude's own review under project-owner direction, not an independent human review, and is not represented as one anywhere in this document.

## 19. Conditions required before student-facing authorization

Unchanged from `MVP_PRODUCT_SPEC.md` §22, none met by this phase:
1. An explicit project-owner authorization to build/run the application exists (already true, v1.1.0) — but publication is a separate, still-absent authorization.
2. Every one of the four visuals has an actual recorded human review (`reviewer`/`reviewedAt` populated) — still `null` for all four.
3. The relevant content records' `studentFacingAllowed` and chapter-level `studentPublicationAuthorized` are explicitly set `true` by the project owner through the existing governance process — still `false` everywhere.
4. The `visibility: "instructor"` misconception-block question is explicitly resolved for any genuinely public/student audience — unresolved, still internal-only by design.
5. This MVP's full acceptance criteria (`MVP_PRODUCT_SPEC.md` §17) pass in full, including the manual/physical items this report could not close out live (§9, §17).

## 20. Publication authorization statement

**Student-facing publication and public/external deployment remain unauthorized.** Nothing in this phase changed, set, or proposed changing `studentFacingAllowed`, `studentPublicationAuthorized`, `PILOT_AUTHORIZATION.json`, or `PILOT_READINESS.json`. The Draft/Review-Required banner remains mandatory and was not removed or weakened. No Git operation, public deployment, or external hosting occurred as part of this phase — the local dev server used for verification was bound to `127.0.0.1` only and was stopped at the end of this session.

## 21. Addendum — post-Phase-4 owner-approved correction (2026-07-16)

**Current-state summary (supersedes any earlier baseline-version or reviewQuestion-label statement in this document):**
- English and Arabic pilot baselines are now **`1.0.2`** (both) — not `1.0.1`.
- **PH4-001 is resolved**, by correction `ch01-corr-009`.
- **PH4-003 is resolved** — the `reviewQuestion` UI is labeled **"Review Card" / "بطاقة مراجعة"**.
- The correction did not alter any problem answer, any visual's geometry, or the already-approved `ch01-corr-007` sign-convention rules.
- Publication remains unauthorized: `studentFacingAllowed` and `studentPublicationAuthorized` remain `false`.

Following the Phase 4 project-owner review (`docs/app/PHSH111_OWNER_REVIEW_PACKET.md`), the project owner approved exactly two narrowly scoped corrections, applied in a dedicated correction task after this report was originally filed:

1. **`ch01-t08-block-equations` wording clarity** (correction `ch01-corr-009`, `docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json`): the `v0 = 0` clause attached to the `v = v0 + at` and `dy = v0*t + (1/2)*a*t²` equations was reworded from a bare descriptive clause into an explicit if/otherwise conditional, in both English and Arabic, resolving finding PH4-001. `ENGLISH_PILOT_BASELINE_APPROVAL.json` and `ARABIC_PILOT_BASELINE_APPROVAL.json` were both bumped to `baselineVersion 1.0.2` with a corresponding `revisionLog` entry each (`ch01-english-baseline-rev-002`, `ch01-arabic-baseline-rev-002`). No equation, worked example, problem value, visual, or the already-approved `ch01-corr-007` sign-convention correction was altered.
2. **`reviewQuestion` UI label**: the displayed label was changed from "Review Question" / "سؤال مراجعة" to "Review Card" / "بطاقة مراجعة" throughout the application (`ReviewQuestion.tsx`, `InstructorReviewPanel.tsx`'s instructor-only routing label, and the affected test). The canonical `reviewQuestion` blockType/schema field name, the canonical text content, record IDs, and visibility/instructor-routing behavior were all left unchanged — this was a display-label change only.

Full detail (exact wording before/after, files touched, test/build re-verification) is in the correction task's own final report to the project owner; this addendum exists so this QA document's own change history stays traceable from a single place. All 61 automated tests, the TypeScript check, and the production build were re-run after these changes and passed. `studentFacingAllowed`, `studentPublicationAuthorized`, and the Draft/Review-Required banner remain unchanged by this correction.
