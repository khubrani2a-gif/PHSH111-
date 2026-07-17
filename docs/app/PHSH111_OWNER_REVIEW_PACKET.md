# PHSH111 Chapter 1 Internal MVP — Phase 4 Project-Owner Review Packet

**Prepared:** 2026-07-16. **Phase:** 4 — Project-owner visual and academic review package (read-only). No application code, canonical content, SVG visuals, governance files, validation records, baselines, or authorization files were modified to produce this packet.

> **Update (2026-07-16, post-Phase-4 correction task):** Findings **PH4-001** and **PH4-003** below have since been resolved by an explicit, narrowly scoped project-owner-approved correction (correction `ch01-corr-009`; English/Arabic baselines bumped to `1.0.2`; UI relabeled to "Review Card" / "بطاقة مراجعة"). The original findings, severities, and observed-behavior descriptions below are preserved unchanged as historical review evidence — see the added **§16 Resolution log** at the end of this document for full resolution detail, and the corresponding annotations in §8, §9, §12, and §13.

## Current-state summary (as of 2026-07-16, post-correction)

- English and Arabic pilot baselines: **`1.0.2`** (both; was `1.0.1` at the time this Phase 4 review was originally written).
- Correction `ch01-corr-009` (`docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json`) resolves PH4-001; it did not alter any problem answer, visual geometry, or the already-approved `ch01-corr-007` sign-convention rules.
- The `reviewQuestion` UI label is now **"Review Card" / "بطاقة مراجعة"** throughout the application, resolving PH4-003; the canonical `reviewQuestion` blockType/schema field name and content are unchanged.
- PH4-002, PH4-004, PH4-005, PH4-006, and the independent-expert-review items (§14) remain genuinely open/deferred — not addressed by this correction.
- Publication remains unauthorized: `studentFacingAllowed` and `studentPublicationAuthorized` remain `false`; the Draft/Review-Required banner remains mandatory and present.

## 1. Review scope

A read-only visual, bilingual, responsive, academic, and accessibility review of the PHSH111 Chapter 1 internal MVP (`apps/chapter1-mvp/`) as it stood at the end of Phase 3, covering: the home page, the Chapter 1 topic list, all four authorized topics (`ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`) in English and Arabic, the unknown-topic error state, the general not-found state, the visual-enlargement dialog, the problem/solution-reveal interaction, the `reviewQuestion` section, the instructor-review panel, and the internal-status/governance panel — inspected at approximately 375px, 768px, 1280px, and 1600px. This packet also independently re-verifies the automated test suite, TypeScript check, and production build, and separately assesses the `reviewQuestion` component's current design against the canonical schema for a project-owner labeling decision.

## 2. Current build and test status

Re-run live this phase, using the same checksum-verified, user-scoped Node.js v20.20.2 / npm 10.8.2 toolchain established in Phase 3 (outside the repository; no install or upgrade was needed or performed):

- **Tests:** 61/61 passing, 6 files — identical to the count reported at the end of Phase 3.
- **TypeScript:** `tsc -b --noEmit` — clean, zero errors.
- **Production build:** succeeded — 72 modules, `dist/assets/index-Pz-UnNtM.js` (482.26 kB, gzip 136.66 kB) and `dist/assets/index-CjYXSI8_.css` (11.41 kB, gzip 2.58 kB) — **byte-identical output hashes to the end of Phase 3**, confirming zero code drift between phases.

This confirms Phase 3 remains fully intact.

## 3. Screenshot index

**No screenshot image files were produced.** See `docs/app/review-evidence/phase-4/README.md` for the full explanation: the available browser-automation tooling renders screenshots inline for direct visual inspection only, with no mechanism to persist them as files. A DOM-to-canvas capture technique was attempted and failed on a browser-level security restriction (`SecurityError: Tainted canvases may not be exported`); raw OS-level screen capture was deliberately not pursued (risk of exposing unrelated desktop content, and it hung on a permission check). This was confirmed with the project owner mid-task, who directed a written-findings-only packet. Every screen, topic, language, and viewport listed in §1 was nonetheless **actually viewed live** in the running application — findings below are drawn from direct inspection, not inference.

## 4. Screen-by-screen findings

| Screen | English | Arabic | Notes |
|---|---|---|---|
| Home page | Correct: app name, subtitle, "Chapter 1 Internal Pilot" badge, scope statement, CTA | Correct: full translation, RTL layout, header mirrors (brand right, nav/toggle left) | No issues |
| Chapter 1 topic list | 4 cards, correct governance order (t02→t03→t08→t10), "Topic N of 4" | Same 4 cards, RTL-mirrored visual order (t10 leftmost, t02 rightmost) while "الموضوع 1 من 4" through "4 من 4" read correctly in document order | No issues; RTL mirroring confirmed cosmetic-only, not a reordering of the underlying governance sequence |
| Unknown-topic error (`/chapter/1/topic/ch01-t99`) | "Not found" — `"ch01-t99" is not one of the four authorized pilot topics.` — link back to Chapter 1 | Equivalent Arabic message and link, confirmed in Phase 3 | Draft banner remains visible; no crash |
| General not-found (`/some/random/path`) | "Not found — This page does not exist in the Chapter 1 pilot MVP." — link back to **home** (correctly distinct from the topic-specific state, which returns to the chapter list) | Not re-checked in Arabic this phase (Phase 3 confirmed the equivalent topic-specific state; this generic state uses the same `NotFoundState` component and translation table) | No issues |

## 5. Topic-by-topic findings

All four topics were inspected end-to-end (title, main idea, explanation, equation panel, visual + enlarge dialog, worked example, original problem with given values/setup, solution reveal, review question, instructor-review panel expanded, internal-status panel expanded, previous/next navigation) in both languages.

- **`ch01-t02` (Distance, Units, Area and Volume):** Complete and internally consistent. The three-panel SVG (length/area/volume) renders correctly at native size in the dialog with no caption/content mismatch. See **PH4-002** (§9) for a minor structural observation on the multi-part problem's given-values list.
- **`ch01-t03` (Time, Period and Frequency):** Complete and internally consistent (re-confirmed from Phase 3's thorough bilingual pass). Equation panel, circular-motion SVG, and review question all match their captions with no ambiguity found.
- **`ch01-t08` (Acceleration, Signs and g):** Complete and internally consistent, with one genuine academic clarity finding — see **PH4-001** (§9).
- **`ch01-t10` (Centripetal Acceleration):** Complete and internally consistent. The most visually dense of the four (dual-panel main+inset SVG); its known mobile-legibility limitation is carried forward from Phase 2/3, not new — see **PH4-005** (§9).

No topic is missing any of the required content-structure sections (title, main idea, explanation, equations, visual, worked example, review question, original problem, solution, instructor-only content, previous/next nav) except where the source schema itself has no field for a section (e.g. no dedicated "key concept/summary" block — an already-documented, deliberate Phase 2 scope decision, not a Phase 4 finding).

## 6. English/Arabic findings

Confirmed across all four topics, live, both languages:
- Arabic renders with correct glyph shaping (cursive joining) and right-to-left paragraph/heading alignment; no corrupted or mis-shaped Arabic text was found anywhere.
- No incorrect bidi ordering was found: equations (e.g. t10's `aC = v² / r، حيث...`) stay LTR-isolated and read correctly left-to-right even when they are the first "word" encountered in an RTL sentence.
- SI units and Latin single-letter variables remain upright/Latin throughout Arabic prose (`m`, `m²`, `m/s²`, `Hz`, `T`, `f`, `v`, `r`, `a_c`, etc.) — never transliterated.
- Previous/next navigation is visually mirrored under RTL (right/left swap) but **semantically correct**: independently confirmed via DOM-order text extraction on `ch01-t10`'s Arabic page that "Previous" still targets `ch01-t08` and "Next" is still correctly the disabled end-of-sequence state, regardless of which visual side each renders on.
- `border-inline-start` accent borders (equation panel, review-question panel) correctly flip to the visual right edge under RTL.
- The persistent Draft banner and its Arabic translation are present and correctly styled in both directions.

No bilingual or bidi defect was found this phase.

## 7. Mobile/tablet/desktop/projector findings

- **375px:** Single-column, readable in both languages. `ch01-t10`'s inline SVG preview has small legend/caption text at this width (carried-forward, previously documented limitation — §9 PH4-005); the "Enlarge visual" dialog was re-confirmed as a working, fully legible, pannable fallback.
- **768px:** All diagrams (including t10) are comfortably legible inline without opening the dialog.
- **1280px / 1600px:** Content stays capped at a comfortable reading width at both sizes — no stretched illegible lines, no horizontal overflow, Draft banner remains prominent. 1600px specifically was inspected as the projector/wide case and found suitable (ample surrounding whitespace, no loss of legibility).
- No horizontal page overflow was found at any breakpoint (the visual dialog's own internal pan/scroll for oversized diagrams is a deliberate, contained exception).
- Review-question sections never produced an empty heading or irregular gap at any breakpoint.
- Instructor-review and internal-status panels remained visually secondary (indigo, collapsed-by-default) at every breakpoint checked.
- Draft/Review-Required indicators were visible on every screen, every language, every breakpoint checked, with no exception found.

## 8. reviewQuestion behavior assessment

**Does the source store question, answer, and explanation separately?** No. Inspected directly in all four canonical topic JSON files: each `reviewQuestion` contentBlock's `localizedContent.en`/`.ar` is a single authored prose string that already contains the question, the stated correct answer, and its explanation concatenated together (e.g. `ch01-t03-block-review`: *"A metronome ticks once every 0.5 s. (a) What is its frequency?...Correct answers: (a) f = 1/T = 1/0.5 s = 2.0 Hz...."*). There is no separate `question`/`answer`/`explanation` field anywhere in this blockType's schema, unlike the `problem` record, which does have genuinely separate `problemStatement` vs. `numberedSolution`/`finalAnswer` fields.

**Can the UI safely hide the answer without modifying or heuristically parsing canonical content?** No, not safely. The only way to split the string into a "question part" and an "answer part" would be to pattern-match on marker phrases like `"Correct answer:"` / `"Correct answers:"` / `"الإجابة الصحيحة:"` / `"الإجابتان الصحيحتان:"` — these phrasings already differ across the four topics and between English and Arabic, so a heuristic splitter would be fragile, would silently break on a differently-worded future topic, and would in effect be *inventing* a structural boundary the canonical schema does not actually define. This is why the current component renders the full string as-is rather than attempting a reveal interaction, and why this document does not recommend building one without a schema change.

**Is the current label accurate?** "Review Question" (with a "Self-check" badge) is not incorrect, but it is arguably imprecise given the actual behavior: it displays as a fully-answered, worked reference item, not an interactive question a learner attempts before seeing the answer, the way "Show solution" on the original problem does. A reader unfamiliar with the schema could reasonably expect a "question" label to withhold the answer, then be mildly surprised to find it already shown.

**Recommendation for project-owner decision:** consider **"Review Card"** as a more literally accurate label than "Review Question," since it does not imply a withheld answer — while the current "Self-check" badge already communicates the self-study intent reasonably well and could be kept either way. This is a labeling preference, not a defect; either label is defensible, and no change was made in this read-only phase (see **PH4-003**, §9).

> **Resolution (2026-07-16):** The project owner accepted this recommendation. The UI label is now "Review Card" / "بطاقة مراجعة" throughout the application; the "Self-check" / "تقييم ذاتي" badge was kept unchanged, as anticipated above. The canonical `reviewQuestion` data, record IDs, visibility handling, and instructor-only routing were all left unchanged — this was a display-label change only. See §16 for full detail.

## 9. Academic-review observations and recommended corrections

Issue table — every entry states affected page/topic, language, viewport (if relevant), severity, observed vs. expected behavior, recommended action, and the layer that action would touch. **No correction was applied; this phase is read-only.**

| ID | Page/Topic | Language | Viewport | Severity | Observed | Expected | Recommended action | Action layer |
|---|---|---|---|---|---|---|---|---|
| PH4-001 | `ch01-t08` equation panel | EN & AR (equivalent) | All | **Important** | The equationSet block states `v = v0 + at, with v0 = 0 at start from rest` and `dy = v0*t + (1/2)*a*t², with v0 = 0 at start from rest` — but the worked example (ball thrown downward at 4 m/s) and the original problem (gurney initially moving at 1.5 m/s) both use a nonzero `v0`, directly contradicting the equation panel's stated simplifying assumption. | The equation panel's stated conditions should be consistent with (or clearly scoped apart from) the worked applications that immediately follow it, so a student reading top-to-bottom isn't told "v0 = 0" and then shown v0 ≠ 0 without comment. | Reword the equation panel's caveat (e.g. "v0 = 0 in the special case of starting from rest; the worked example and problem below use a nonzero v0") or remove the "at rest" qualifier from the general formula and note it only where it actually applies. | Canonical-content revision (`ch01-t08-content.json`'s `equationSet` block) |
| PH4-002 | `ch01-t02` original problem | EN & AR (equivalent) | All | Optional | The problem statement is explicitly three parts, (a) area, (b) unit conversion, (c) volume + conversion — but the rendered "Given" list (`length`, `width`, `depth`, `conversionFactor`) is a single flat list with no indication of which values belong to which sub-part. | A multi-part problem's given values would ideally be legible per-part, or at least the flat list isn't actively misleading (all four values are in fact used somewhere across the three parts). | Consider whether the canonical `problem` schema should support per-part given-value grouping for future multi-part problems, or leave as-is since the flat list is not incorrect, only slightly less scaffolded than the three-part statement. | Canonical-content/schema decision (`ch01-t02-content.json`'s `problem` record; would need a schema addition to fully resolve) |
| PH4-003 | `reviewQuestion` component, all four topics | Both | All | Optional | Component/section is labeled "Review Question" with a "Self-check" badge, but always displays the answer inline (no reveal interaction) — see §8 for full analysis. | Label should set an accurate expectation given the always-answered display. | Consider relabeling to "Review Card" (or confirm "Review Question" is acceptable as-is). | Application-code change (`ReviewQuestion.tsx`'s `LABELS` constant) — a governance/labeling decision, not a bug fix |
| PH4-004 | All disclosure panels (internal-status, instructor-review, solution-reveal) | Both | All | Optional | `aria-controls` on a collapsed toggle references an element ID that does not yet exist in the DOM (the panel body is conditionally rendered only when expanded) — carried forward from the Phase 3 QA report, unchanged. | `aria-controls` ideally resolves to a real element at all times, though this is a common, low-severity, widely-tolerated disclosure-widget pattern. | Consider always rendering the panel body (visually hidden when collapsed) instead of conditionally mounting it, if a stricter ARIA-conformance pass is ever prioritized. | Application-code change |
| PH4-005 | `ch01-t10` inline SVG preview | Both | 375px | Important (carried forward, unresolved) | Finest legend/caption text in the inline (non-enlarged) preview is small at 375px — already documented in `VISUAL_HOUSE_STYLE.md` and Phase 3's QA report as an open, undeferred risk; re-confirmed live this phase, with the enlarge/pan dialog re-confirmed as a working mitigation. | Either accept the enlarge-dialog fallback as sufficient (current de facto state) or invest in a dedicated mobile-simplified variant of this one diagram. | No change recommended without a project-owner decision on whether the existing fallback is sufficient. | SVG revision (if a mobile variant is ever authorized) or governance decision to accept current state |
| PH4-006 | `npm audit` | — | — | Optional | 5 advisories, one root cause (`esbuild` ≤0.24.2 dev-server CORS, GHSA-67mh-4wv8-2f99), affecting only local dev/test tooling, not the production bundle — unchanged since Phase 3. | Resolved eventually via a deliberate, coordinated Vite/Vitest major-version upgrade. | No action this phase (explicitly out of scope); revisit as a dedicated maintenance task. | Dependency-upgrade decision (governance/maintenance, not urgent) |

**No visual-caption mismatch was found** in any of the four SVGs — each diagram's bilingual captions, equation panel, and legend were independently cross-checked against their own validation records (§1 preflight) and against live rendering, and all matched. **No problem/solution flow was found difficult to follow** beyond PH4-002's minor structural note. **No concept was found unclear** beyond PH4-001's equation-caveat inconsistency.

> **Resolution status (2026-07-16):** **PH4-001: Resolved** — resolution: correction `ch01-corr-009`; affected baseline version: `1.0.2` (both English and Arabic). **PH4-003: Resolved** — resolution: UI label changed to "Review Card" / "بطاقة مراجعة"; canonical `reviewQuestion` data and schema unchanged. The table rows above are preserved exactly as originally observed; they are not retroactively edited. PH4-002, PH4-004, PH4-005, and PH4-006 remain open/deferred, unchanged by this correction. See §16 for full resolution detail.

## 10. Visual-design observations

- Hierarchy, spacing, and section differentiation are consistent across all four topics — each content type (main idea, explanation, equation, visual, worked example, problem, review question, instructor panel, governance panel) has a stable, repeated visual treatment, making the four topics feel like one coherent system rather than four independently designed pages.
- The review-question panel's fuchsia accent is clearly distinct from the equation panel's teal, the instructor/governance panels' indigo, and the danger/missing-state red — no color confusion was observed between these four meanings.
- Mobile readability is good throughout except for `ch01-t10`'s finest inline legend text (PH4-005, a pre-existing, already-documented limitation).
- Projector suitability (1600px) is good — generous whitespace, no stretched line lengths, Draft banner remains prominent at a glance from a distance.
- The Draft/Review-Required banner and per-topic governance panel together make the "not finally approved" status unmistakable on every screen; nothing in the UI implies or could be mistaken for final publication approval.

## 11. Accessibility observations

Carried forward from the Phase 3 QA report (`docs/app/PHSH111_MVP_INTERNAL_QA.md`), re-confirmed unchanged this phase since no code was modified:
- Tab order, focus indicators, `aria-expanded` state, and the visual-dialog's focus trap/background-inertness/Escape/scroll-lock/focus-return were all verified live in Phase 3 with real browser events.
- Native Enter/Space activation of toggle buttons could not be independently demonstrated live due to a synthetic-key-event limitation in the testing tool itself (not an app defect — every toggle is a plain, unmodified `<button>`); still flagged as needing a physical hardware-keyboard confirmation.
- `aria-controls`-before-expand pattern noted again as PH4-004 above.

## 12. Recommended corrections, categorized

**Critical:** none found. No defect in this review blocks continued internal use of the MVP as currently authorized.

**Important:**
- PH4-001 — t08 equation-panel `v0 = 0` caveat inconsistency (canonical-content revision). **RESOLVED 2026-07-16 — see §16.**
- PH4-005 — t10 mobile inline-legend legibility (carried forward; SVG revision or governance acceptance decision).

**Optional:**
- PH4-002 — t02 multi-part problem's flat given-values list (canonical-content/schema decision).
- PH4-003 — `reviewQuestion` label precision (application-code + governance decision). **RESOLVED 2026-07-16 — see §16.**
- PH4-004 — `aria-controls`-before-expand pattern (application-code).
- PH4-006 — `npm audit` advisories (dependency-upgrade decision, not urgent).

## 13. Items requiring project-owner decisions

- ~~Whether to revise `ch01-t08-block-equations`' wording per PH4-001.~~ **Decided and implemented 2026-07-16** — approved and applied as correction `ch01-corr-009`; see §16.
- Whether `ch01-t02-block-problem`'s given-values presentation needs a schema change per PH4-002, or is acceptable as-is.
- ~~Whether to relabel the reviewQuestion UI to "Review Card" (or another label) per §8/PH4-003.~~ **Decided and implemented 2026-07-16** — approved as "Review Card" / "بطاقة مراجعة"; see §16.
- Whether `ch01-t10`'s mobile inline-preview legibility (PH4-005) needs a dedicated mobile SVG variant, or whether the existing enlarge-dialog fallback is accepted as sufficient for the pilot's purposes.
- Whether/when to schedule the coordinated Vite/Vitest major-version upgrade that would clear the `npm audit` advisories (PH4-006).
- Whether the current absence of persisted screenshot evidence files (§3) is acceptable for this and future review cycles, or whether an alternative evidence-capture method should be arranged (e.g. a different tool, or a manual screenshot pass by a human reviewer).

## 14. Items requiring independent academic/expert review

Unchanged and not addressed by this or any prior phase:
- All four visuals' validation records still show `reviewer: null`, `reviewedAt: null` — no human review has occurred on any of them.
- All canonical content records remain `draft`/`blocked`, pending independent human scientific and editorial review beyond the project-owner-authorized, Claude-assisted review process already on record.
- This packet's own academic observations (§9) are Claude's read-only assessment under project-owner direction — they are not, and should not be represented as, an independent human subject-matter-expert review.

## 15. Publication status

**Student-facing publication and public/external deployment remain unauthorized.** Nothing in this phase changed, set, or proposed changing `studentFacingAllowed`, `studentPublicationAuthorized`, `PILOT_AUTHORIZATION.json`, or `PILOT_READINESS.json`. The Draft/Review-Required banner was confirmed present and unmodified on every screen reviewed. No application code, test, canonical content JSON, SVG file, visual-validation record, baseline approval, or authorization/readiness file was modified during this phase — this was a strictly read-only review. No Git operation, public deployment, or external hosting occurred; the local dev server used for this review was bound to `127.0.0.1` only and was stopped at the end of the session.

## 16. Resolution log (added 2026-07-16, post-Phase-4 correction task)

This section was appended after the original Phase 4 review above; nothing in §1–§15 was altered to write it, per the project owner's instruction to preserve original findings as historical review evidence.

**PH4-001 — RESOLVED**
- Resolution: correction `ch01-corr-009` (`docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json`).
- Affected baseline version: English and Arabic both bumped `1.0.1` → `1.0.2` (`ENGLISH_PILOT_BASELINE_APPROVAL.json` / `ARABIC_PILOT_BASELINE_APPROVAL.json`, revisionLog entries `ch01-english-baseline-rev-002` / `ch01-arabic-baseline-rev-002`).
- What changed: `ch01-t08-block-equations`' two occurrences of the ambiguous clause "with v0 = 0 for release from rest" were each reworded into an explicit if/otherwise conditional, in both English and Arabic — resolving the risk that a reader takes the equation panel's special-case note as a universal claim.
- What did not change: the equations themselves (`v = v0 + at`, `dy = v0*t + (1/2)*a*t²`), the already-approved `ch01-corr-007` sign-convention correction, the worked example's numbers (v0 = 4 m/s), the original problem's given values and final answer (v0 = 1.5 m/s, answer −0.5 m/s²), and `ch01-t08-visual-001.svg` were all left untouched.
- Verification: 61/61 automated tests passing, clean TypeScript check, successful production build, and live browser confirmation of the corrected English and Arabic wording on `ch01-t08`, all performed after this correction.

**PH4-003 — RESOLVED**
- Resolution: UI label changed from "Review Question" / "سؤال مراجعة" to "Review Card" / "بطاقة مراجعة" throughout the application (`ReviewQuestion.tsx`, and `InstructorReviewPanel.tsx`'s instructor-only-routing label for the same blockType).
- Canonical data and schema unchanged: the `reviewQuestion` blockType/schema field name, the canonical text content, record IDs, and visibility/instructor-only-routing behavior were all left exactly as before — this was a display-label change only, as recommended in §8.
- Verification: same test/typecheck/build re-run as PH4-001 above (both corrections were verified together), plus live browser confirmation that "Review Card" / "بطاقة مراجعة" now displays on all four topics in both languages, and that no "Review Question" / "سؤال مراجعة" label remains anywhere the component label is intended (a residual match in `reviewQuestion.test.ts` is unrelated canonical-text test-fixture content, not a label, and was correctly left unchanged).

**Findings deliberately left open by this correction task** (not addressed, not forgotten): PH4-002 (t02 given-values structure), PH4-004 (`aria-controls`-before-expand pattern), PH4-005 (t10 mobile inline-legend sizing), PH4-006 (`npm audit` advisories), and all §14 independent-expert-review items. None of these were in scope for the narrowly scoped correction the project owner approved.

**Publication status unchanged by this resolution log:** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false`; no independent human expert approval is claimed anywhere in this document or its resolutions.
