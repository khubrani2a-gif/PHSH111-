# PHSH111 Chapter 1 Internal Pilot — Current Checkpoint

**As of:** 2026-07-16. **This is an internal checkpoint, not a release authorization.** It exists to give any future session (human or Claude) a single, current, cross-referenced snapshot of where the PHSH111 Chapter 1 internal pilot stands, after Phases 1–4 and one controlled correction task. It does not itself authorize anything — every fact below traces back to an existing governance record, and none of those records changed as a side effect of writing this checkpoint.

## 1. Checkpoint purpose

To consolidate, in one place, the current verified state of the PHSH111 Chapter 1 internal MVP after: Phase 1 (scaffold), Phase 2 (real content rendering), Phase 3 (internal QA and accessibility hardening), Phase 4 (project-owner visual/academic review), and one narrowly scoped, project-owner-approved correction task. It supersedes no governance record — `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`, the baseline approvals, and `SCIENTIFIC_CORRECTIONS.json` remain the authoritative sources; this document only summarizes and cross-references them.

## 2. Four-topic scope

Exactly four Chapter 1 topics are authorized and implemented — unchanged since `PILOT_AUTHORIZATION.json` v1.1.0 and never expanded:

1. `ch01-t02` — Distance, Units, Area and Volume
2. `ch01-t03` — Time, Period and Frequency
3. `ch01-t08` — Acceleration, Signs and g
4. `ch01-t10` — Centripetal Acceleration

No other Chapter 1 topic (of fourteen total) has generated content, authorization, or application support.

## 3. Current application identity

- App display name: `PHSH111`. English subtitle: `Physics for Health Sciences`. Arabic subtitle: `الفيزياء لعلوم الصحة`.
- Package name: `phsh111` (`apps/chapter1-mvp/package.json`).
- Application directory: `apps/chapter1-mvp/` — unchanged, not renamed, not relocated.
- Internal release label: `Chapter 1 Internal Pilot` / `الفصل الأول — نسخة داخلية تجريبية`, shown in the browser tab title and on the home page.

## 4. Current baseline versions

- English pilot baseline (`ENGLISH_PILOT_BASELINE_APPROVAL.json`): **`1.0.2`**.
- Arabic pilot baseline (`ARABIC_PILOT_BASELINE_APPROVAL.json`): **`1.0.2`**.
- Both are `status: "approved"`. Revision history for both is intact and unerased: rev-001 (the `ch01-t02` visual-scope resolution, 2026-07-16) and rev-002 (the `ch01-t08` `v0 = 0` wording clarification, 2026-07-16, correction `ch01-corr-009`) are both present in each file's `revisionControlPolicy.revisionLog`.

## 5. Approved correction IDs

`docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json` contains 9 correction records. Those actually reflected in the live canonical content for the four pilot topics, all `approvalStatus: "editoriallyApproved"`:

- `ch01-corr-006` → `ch01-t03` (period/frequency, one-complete-cycle definition)
- `ch01-corr-007` → `ch01-t08` (signed acceleration / axis-convention correction)
- `ch01-corr-008` → `ch01-t10` (tangent velocity / centripetal acceleration correction)
- `ch01-corr-009` → `ch01-t08` (conceptual-clarity fix: the `v0 = 0` equation-panel clause now reads as an explicit if/otherwise conditional instead of a bare, potentially misleading descriptive clause; does not alter `ch01-corr-007`'s sign-convention correction, any equation, any worked example, any problem value, or any visual)

`ch01-corr-003`–`005` remain `proposed`/`needsEvidence` and are outside the four-topic pilot scope (other Chapter 1 topics), unchanged.

**Update (2026-07-16):** `ch01-corr-001` (→ `ch01-t01`) and `ch01-corr-002` (→ `ch01-t04`) also now carry `approvalStatus: "editoriallyApproved"` — `ch01-corr-001` approved as-proposed, `ch01-corr-002` approved with a recorded qualification that "apparent weight" is project-authored interpretive terminology, not verbatim source wording. This followed a scientific-reconciliation decision brief and a citation/traceability repair (both corrections originally cited at least one source segment or problem that independent verification traced to a different topic); see `docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md`, `docs/app/PHSH111_BATCH1_CORRECTION_CITATION_REPAIR.md`, and `docs/app/PHSH111_BATCH1_CORRECTION_APPROVAL_RECORD.md`. Unlike `ch01-corr-006`–`009`, both new approvals leave `approvals.scientificReviewer` explicitly `null` (project-owner editorial approval, not independent physics review). **Neither correction is reflected in any canonical content** — `ch01-t01` and `ch01-t04` remain outside the four-topic pilot scope, and no canonical content file exists for either topic. Approval of these two correction records does not authorize canonical generation, translation, illustration, or application expansion for either topic — that remains a separate, still-absent authorization (§14 below, unchanged by this update).

**Further update (2026-07-16):** a separate, narrowly scoped **English-language canonical drafting authorization** for `ch01-t01` and `ch01-t04` has since been granted — `PILOT_AUTHORIZATION.json` v1.2.0's `batch1DraftingAuthorization` and `PILOT_READINESS.json` v1.5.0's `batch1DraftingReadiness` — see `docs/app/PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md`. This authorizes a **future** drafting task to create English-only draft records at `docs/content-design/chapter-01/batch1-drafts/` (a new location, deliberately separate from `pilot/`). **No draft file has been created.** `PILOT_READINESS.json`'s chapter-wide `canonicalGenerationAuthorized` flag remains `false` — this is a topic-scoped exception, not a chapter-wide change. Arabic generation, visual production, application expansion, English baseline approval, and student-facing publication all remain unauthorized for both topics.

**Further update (2026-07-16, later same day):** `ch01-t01-content.json` and `ch01-t04-content.json` were drafted, reviewed, revised, and closure-verified (full report chain: `PHSH111_BATCH1_ENGLISH_DRAFT_GENERATION_REPORT.md` → `_REVIEW.md` → `_REVISION_REPORT.md` → `_CLOSURE_REVIEW.md` → `PHSH111_BATCH1_T04_SCHEMA_CLOSURE_REPORT.md`), then approved by the project owner as **Batch 1 English baseline version 1.0.0** — `docs/content-design/chapter-01/ENGLISH_BATCH1_BASELINE_APPROVAL.json` (new, separate from `ENGLISH_PILOT_BASELINE_APPROVAL.json`), `PILOT_READINESS.json` now **v1.6.0**. Both draft files remain unmoved at `docs/content-design/chapter-01/batch1-drafts/`; baseline approval is a governance record referencing them by checksum, not a file promotion. **Still unauthorized:** Arabic generation, visual production, identifier registration (deferred until before application integration, not required for baseline approval), application integration, independent expert review, and student-facing publication.

**Further update (2026-07-17):** the Batch 1 glossary terminology was reconciled (`PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` → `PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md`, definitive count: 9 unique records / 9 actions) and then approved by the project owner in full — `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json` now **v1.3.0** (2 new terms created and approved: `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`; 5 pending terms approved: `ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`; 2 approved terms' scope extended: `ch01-term-distance` → `+ch01-t01`, `ch01-term-acceleration` → `+ch01-t04`), `docs/app/PHSH111_BATCH1_GLOSSARY_APPROVAL_RECORD.md`. No separate "dimension" term was created (folded into `ch01-term-fundamental-quantity`'s usage notes). Apparent weight approved as الوزن الظاهري (supporting phrase قراءة الميزان; الوزن الحقيقي not used as the preferred contrast). `PILOT_READINESS.json` now **v1.7.0**. **All Batch 1 blocking glossary terms are now approved — Arabic generation itself remains unauthorized** (`arabicGenerationAuthorized`/`arabicBaselineApproved` both explicitly `false`); no Arabic topic content exists. Visual production, identifier registration, application integration, independent expert review, and student-facing publication all remain unauthorized/pending.

**Further update (2026-07-17, later same day):** a scoped Batch 1 Arabic-generation authorization was granted (`PILOT_AUTHORIZATION.json` v1.3.0, `batch1ArabicGenerationAuthorization`; `PILOT_READINESS.json` v1.8.0) and then **corrected** the same day, before any Arabic content had been generated under it. Three defects were fixed — see `docs/app/PHSH111_BATCH1_ARABIC_AUTHORIZATION_CORRECTION_RECORD.md`: (1) the packaging model changed from in-place editing of the approved English baseline files to a separate, immutable-original/candidate-copy model; (2) "Arabic canonical generation" wording was replaced with "controlled Arabic candidate-draft generation" throughout, with an explicit statement that Arabic candidate generation is authorized while Arabic canonical or baseline approval is not; (3) an absolute prohibition on terminology outside the nine Batch 1 glossary records was replaced with a rule making those nine mandatory where applicable while permitting other already-approved glossary terms and ordinary, unregistered Arabic language. `PILOT_AUTHORIZATION.json` is now **v1.3.1**; `PILOT_READINESS.json` is now **v1.8.1** — both patch increments, since this was a correction, not a new grant of scope. **The only authorized Arabic candidate-draft output paths are now `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json` — a new, separate directory that does not yet exist.** The two approved English baseline files (`docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`/`ch01-t04-content.json`) remain immutable and unchanged, checksums re-verified identical throughout. **No Arabic candidate file, and no Arabic content, exists.** Arabic baseline approval, visual production, identifier registration, application integration, independent expert review, and student-facing publication all remain unauthorized/pending.

**Further update (2026-07-17, ratification):** the corrected Arabic candidate-draft generation authorization has now been **explicitly ratified by the project owner** — `PILOT_AUTHORIZATION.json` v1.3.2 (`batch1ArabicGenerationAuthorization.projectOwnerRatification`, `authorizationHistory` `1.3.2` `"action": "ratified"`), `PILOT_READINESS.json` v1.8.2. See `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_RATIFICATION_RECORD.md`. Governance history preserved transparently: v1.3.0 was created before the project owner had issued the intended explicit authorization decision; v1.3.1 technically corrected it but was a correction task, not the ratification; v1.3.2 supplies the explicit project-owner ratification. This ratification changes no technical scope — **controlled Arabic candidate-draft generation** for `ch01-t01`/`ch01-t04` only, candidate output at `docs/content-design/chapter-01/batch1-arabic-drafts/` (still no directory or file), approved English baseline files at `batch1-drafts/` immutable (checksums re-verified unchanged), glossary still v1.3.0. **No Arabic content was generated, and no candidate directory existed, before ratification.** Arabic baseline approval, canonical promotion, visual production, application integration, deployment, independent human review, and student-facing publication all remain unauthorized/incomplete.

**Exact next task, if the project owner chooses to proceed:** generate the two controlled Arabic candidate drafts at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json`, under the corrected and ratified authorization (v1.3.2). Not performed by this update.

**Further update (2026-07-17, generation/review/baseline approval):** the ratified generation task above has since been completed, followed by review and approval. **Generation:** both Arabic candidate drafts were created at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` (7 records) and `ch01-t04-content.json` (8 records), as structural copies of the approved English baseline with only Arabic localization structures populated — see `docs/app/PHSH111_BATCH1_ARABIC_DRAFT_GENERATION_REPORT.md`; a zero-mismatch deep-equality check confirmed no English-content drift, and both English source checksums (`a445f55d...`, `c876a6fe...`) remained unchanged. **Review and revision:** a consolidated review found and corrected exactly two narrow draft-level defects (a duplicated parenthetical in `ch01-t01-block-equations`; a stray diacritic in `ch01-t04`'s problem solution), concluding "Remaining blockers: None" for both topics — see `docs/app/PHSH111_BATCH1_ARABIC_DRAFT_REVIEW_AND_REVISION_REPORT.md`. **Arabic baseline approval:** the project owner then approved both reviewed candidates as **Arabic Batch 1 baseline version 1.0.0** — `docs/content-design/chapter-01/ARABIC_BATCH1_BASELINE_APPROVAL.json` (a new, separate record, not merged into `ARABIC_PILOT_BASELINE_APPROVAL.json`) and `docs/app/PHSH111_BATCH1_ARABIC_BASELINE_APPROVAL_RECORD.md`. `PILOT_READINESS.json` is now **v1.9.0**. **Both English and Arabic Batch 1 baselines are now approved at version 1.0.0.** Both candidate files remain unmoved at `docs/content-design/chapter-01/batch1-arabic-drafts/`; `arabic.translationStatus` remains `"draft"` on every record, not changed to `"approved"`. This is a **project-owner internal approval only** — not independent human scientific approval, not visual approval, not application-integration authorization, not student-facing or publication authorization. Visual production, identifier registration, application integration, independent human review, and student-facing publication all remain unauthorized/pending.

**Exact next task, if the project owner chooses to proceed:** a Batch 1 visual-production authorization decision for `ch01-t01` and `ch01-t04`. Not performed by this update.

**Further update (2026-07-17, visual-production authorization):** the project owner has granted a narrowly scoped **visual-production authorization** for exactly `ch01-t01-visual-001` and `ch01-t04-visual-001`, following completion of both Batch 1 baselines (English v1.0.0, Arabic v1.0.0). `PILOT_AUTHORIZATION.json` is now **v1.4.0** (`batch1VisualProductionAuthorization`); `PILOT_READINESS.json` is now **v1.10.0**. See `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_AUTHORIZATION_RECORD.md`. **No visual asset was created** — `docs/content-design/chapter-01/batch1-visuals/` does not yet exist. A future task may create exactly one original SVG per topic (never traced/adapted from a publisher source), following `VISUAL_HOUSE_STYLE.md` and using only the approved baselines as input; both assets must remain `draft`, `blocked`, `studentFacingAllowed: false`, `reviewer: null`, `reviewedAt: null`. Application integration, independent human review, and student-facing publication remain unauthorized/pending.

**Exact next task, if the project owner chooses to proceed:** the actual visual-production task — creating `ch01-t01-visual-001.svg` and/or `ch01-t04-visual-001.svg`. Not performed by this update.

**Further update (2026-07-17, visual production, review, and internal approval):** the visual-production task above has since been completed, followed by a consolidated review and an explicit project-owner approval. **Production:** both SVGs and their validation records were created at `docs/content-design/chapter-01/batch1-visuals/` — see `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_REPORT.md`. **Review and revision:** a consolidated review corrected two narrow scientific-completeness gaps and a house-style bug in `ch01-t01` (restating already-approved baseline wording, introducing no new content) and found `ch01-t04` fully satisfactory with no correction needed — see `docs/app/PHSH111_BATCH1_VISUAL_REVIEW_AND_REVISION_REPORT.md`, "Remaining blockers: None" for both. **Visual approval:** the project owner then approved both reviewed visuals, at their exact reviewed checksums, as **Visual Batch 1 baseline version 1.0.0** — `docs/content-design/chapter-01/VISUAL_BATCH1_APPROVAL.json` and `docs/app/PHSH111_BATCH1_VISUAL_APPROVAL_RECORD.md`. `PILOT_READINESS.json` is now **v1.11.0**. **English baseline approved at v1.0.0. Arabic baseline approved at v1.0.0. Visual Batch 1 approved at v1.0.0.** Both visual assets remain outside the application. This is a **project-owner internal visual approval only** — not independent human visual or scientific approval, not application-integration authorization, not student-facing authorization, not deployment or publication authorization. Neither SVG nor either validation record was modified to produce this approval; `reviewer`/`reviewedAt` remain `null` on both. Independent human visual review, identifier registration, application integration, and student-facing publication all remain pending/unauthorized.

**Exact next controlled task, if the project owner chooses to proceed:** register the Batch 1 content, problem, source-marker, and approved visual identifiers required before application integration. Not performed by this update.

**Further update (2026-07-17, identifier registration):** the registration task above has since been completed. Exactly 18 identifiers (2 `instructorScript`, 12 `contentBlock`, 1 `problem`, 1 authorship marker, 2 approved visuals) were registered in `docs/content-design/chapter-01/IDENTIFIER_REGISTRY.json`, now **registryVersion 1.3.0** — see `docs/app/PHSH111_BATCH1_IDENTIFIER_REGISTRATION_RECORD.md`. Two previously-missing namespace types were added (`instructorScript`, `contentBlock`) plus one new pattern in the existing `visual` namespace, following the same additive-pattern precedent already used at registryVersion 1.1.0; no collision with the four pilot topics' own identifiers. `PILOT_READINESS.json` is now **v1.12.0**. `SRC-CH01-BATCH1-ORIGINAL` was registered as a project-authorship marker only, not an audited source. The nine Batch 1 glossary term IDs remain glossary-local and were not registered here. Neither approved topic file, SVG, nor validation record was modified. **English baseline v1.0.0, Arabic baseline v1.0.0, Visual Batch 1 v1.0.0 all remain approved; required identifiers are now registered.** Both topics remain outside the application. Application-integration authorization is the next required decision; independent human review, student-facing approval, and publication all remain pending.

**Exact next controlled task, if the project owner chooses to proceed:** create the controlled Batch 1 application-integration authorization for `ch01-t01` and `ch01-t04`. Not performed by this update.

**Further update (2026-07-17, application-integration authorization):** the task above has since been completed. `PILOT_AUTHORIZATION.json` is now **v1.5.0** (`batch1ApplicationIntegrationAuthorization`); `PILOT_READINESS.json` is now **v1.13.0** — see `docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md`. Selected integration-source model: **direct import** from the six approved source paths, mirroring `rawImports.ts`'s existing pattern; `vite.config.ts` requires no change (its `server.fs.allow` already covers the Batch 1 directories). Because Batch 1's baseline is split across two files per topic, an in-memory English/Arabic merge step is required at load time — no file duplication. Required adapter changes (extending `PilotTopicId`, the topic-order constant, `rawImports.ts`, `validateTopicSet`) were identified but **not performed** — authorization only, no integration occurred. **All three Batch 1 baselines remain approved at v1.0.0; identifiers remain registered; integration is authorized but not implemented.** QA, independent review, student-facing approval, and publication all remain pending.

**Exact next controlled task, if the project owner chooses to proceed:** implement the authorized application integration for `ch01-t01` and `ch01-t04`, including tests and internal QA. Not performed by this update.

**Further update (2026-07-17, integration implemented and verified):** the task above has since been completed and verified using a user-scoped Node v20.20.2/npm 10.8.2 runtime (checksum-verified against nodejs.org, installed under the home directory, no `sudo`, no system-wide change). `PILOT_READINESS.json` is now **v1.14.0** — see `docs/app/PHSH111_BATCH1_APPLICATION_VERIFICATION_AND_QA_REPORT.md`. **TypeScript clean; 131/131 tests passing (9 files); production build succeeds (81 modules); browser QA passed** — six-topic order correct, both new topics render correctly in English/Arabic, `ch01-t01` shows no empty problem UI, `ch01-t04` shows `ch01-prob-104` with 441 N as the unrounded intermediate and 4.4 x 10^2 N as the final result, Review Cards and instructor-only visibility correct, visual dialogs (enlarge/Escape/close/focus-trap/scroll-lock) work, mobile/desktop layouts usable, and the four original pilot topics show no regression. One real merge-validation bug and two test-only defects were found and fixed inside `apps/chapter1-mvp/` only — no approved content or SVG file was touched. Independent human review, student-facing authorization, deployment, and publication all remain unauthorized/incomplete.

**Exact next controlled task, if the project owner chooses to proceed:** a project-owner decision on independent human visual/scientific review and/or a future student-facing authorization track. Not performed by this update.

## 6. Current application capabilities

- Bilingual (English/Arabic) rendering with a session-local language toggle; `dir`/`lang` synced atomically at the document root.
- All four topics render: title, main idea, explanation, key equation (semantic HTML, true `<sup>`/`<sub>`, LTR-isolated inside Arabic prose — no KaTeX/MathJax), SVG scientific visual (inline preview + native-`<dialog>` enlarge dialog with a verified focus trap, background inertness, Escape-to-close, and background-scroll lock/restore), worked example, original problem with a hidden-by-default revealable step-by-step solution, a **Review Card** section (the renamed `reviewQuestion` UI — canonical schema/blockType name unchanged), a collapsed instructor-review panel, and a collapsed internal-status/governance panel.
- Previous/next topic navigation follows the fixed four-topic governance order and stays semantically correct under RTL visual mirroring.
- Persistent, non-dismissible Draft/Review-Required banner on every route, both languages.
- No backend, no database, no authentication, no analytics, no student-progress persistence — content is read directly from the canonical JSON/SVG files under `docs/content-design/chapter-01/pilot/` at build/dev time, never duplicated into application source.

## 7. Current automated-test status

**61/61 tests passing**, across 6 files: `validate.test.ts`, `adapter.test.ts`, `equationRenderer.test.tsx`, `reviewQuestion.test.ts`, `reviewQuestionRender.test.tsx`, `visualViewerDialog.test.tsx`. Last executed live 2026-07-16, immediately after the correction task in §5, using a checksum-verified, user-scoped Node.js v20.20.2 / npm 10.8.2 toolchain (Node/npm are not present in the default shell — see `docs/app/PHSH111_APP_HANDOFF.md` §7 for toolchain-acquisition detail if a future session needs it again).

## 8. Latest verified TypeScript/build status

Same verification pass as §7: `npm run typecheck` clean (zero errors); `npm run build` succeeded — 72 modules, JS bundle ~482.72 kB (gzip ~136.78 kB), CSS bundle ~11.41 kB (gzip ~2.58 kB). Bundle filenames are content-hashed by Vite and change on every build — do not treat a specific hash as a stable identifier in future documentation. `npm audit` still reports 5 advisories, one root cause (`esbuild` ≤0.24.2 dev-server CORS, GHSA-67mh-4wv8-2f99), affecting only local dev/test tooling, not the production bundle — unresolved, deferred pending a deliberate Vite/Vitest major-version upgrade decision.

## 9. Current governance and publication state

- `PILOT_AUTHORIZATION.json`: `authorizationVersion: "1.2.0"` (was `1.1.0` through the correction-approval task; bumped 2026-07-16 to add the narrowly scoped Batch 1 English-drafting authorization — see §5's update above), `status: "granted"`. The four-topic `scope.authorizedTopicIds` and `applicationBuildAuthorization.applicableTopicIds` are unchanged by this bump.
- `MVP_IMPLEMENTATION_DECISIONS.json.publicationState`: `internalMvpBuildAuthorized: true`, `localTestingAuthorized: true`, `publicDeploymentAuthorized: false`, **`studentFacingAllowed: false`**, **`studentPublicationAuthorized: false`** — unchanged since Phase 1, unchanged by every phase and the correction task since.
- All four visual-validation records: `studentFacingAllowed: false`, `reviewer: null`, `reviewedAt: null` — no human review has occurred on any visual, at any point through the present.
- All canonical content records remain `draft` / `blocked` / review-required.
- No Git operation (init, add, commit, push) has been authorized or performed at any point across every phase and the correction/documentation-sync tasks. The repository trees remain untracked (`?? apps/`, `?? docs/`, `?? tmp/`).
- No public deployment or external hosting has occurred; every local dev server used for verification across every phase was bound to `127.0.0.1` only and was stopped at the end of its session.

## 10. Resolved Phase 4 findings

- **PH4-001** (t08 equation-panel `v0 = 0` caveat inconsistency) — **Resolved** by correction `ch01-corr-009` (§5). Full resolution detail: `docs/app/PHSH111_OWNER_REVIEW_PACKET.md` §16.
- **PH4-003** (`reviewQuestion` label imprecision) — **Resolved** by relabeling to "Review Card" / "بطاقة مراجعة" (§6). Full resolution detail: `docs/app/PHSH111_OWNER_REVIEW_PACKET.md` §16.

The original Phase 4 findings, including their originally observed severity and behavior, remain preserved unedited in `docs/app/PHSH111_OWNER_REVIEW_PACKET.md` §9's issue table — only resolution status was appended, nothing was retroactively rewritten.

## 11. Deferred findings

Genuinely open, not addressed by any phase or the correction task:

- **PH4-002** — `ch01-t02`'s multi-part original problem has a single flat given-values list not broken out per sub-part (a/b/c); canonical-content/schema decision needed.
- **PH4-004** — `aria-controls` on a collapsed disclosure toggle (internal-status, instructor-review, solution-reveal panels) references an element ID that doesn't exist in the DOM until expanded; common, low-severity, widely-tolerated pattern.
- **PH4-005** — `ch01-t10`'s inline mobile SVG preview has small legend/caption text at ~375px; the enlarge-dialog fallback is confirmed working. Needs a project-owner decision: accept the fallback as sufficient, or invest in a dedicated mobile SVG variant.
- **PH4-006** — `npm audit`'s 5 advisories (§8), deferred pending a deliberate Vite/Vitest major-version upgrade.
- Physical hardware-keyboard confirmation of native Enter/Space button activation on toggle controls (the automated testing tool could not reliably dispatch these two specific keys; every toggle is a plain, unmodified `<button>`, so this is a verification gap, not a known defect).
- Cross-browser (beyond Chromium/Electron) verification of the visual dialog's native focus-trap/inertness behavior, and of Arabic glyph shaping generally.
- Persisted screenshot-evidence files for visual review (no working screenshot-to-file mechanism was available in the Phase 4 session; `docs/app/review-evidence/phase-4/README.md` explains why).
- `reviewQuestion` schema restructuring, or building an answer-hiding/reveal interaction via heuristic text parsing — explicitly not recommended (see `docs/app/PHSH111_OWNER_REVIEW_PACKET.md` §8): the canonical schema has no question/answer field split to safely hide behind, and heuristic parsing of marker phrases would be fragile and would invent a structural boundary the schema doesn't define.

## 12. Independent-review requirements

Unaddressed by any phase or the correction task, and not claimed as satisfied anywhere in this documentation set:

- No independent human visual review has occurred on any of the four SVGs (`reviewer: null` on every visual-validation record).
- No independent human scientific/editorial review has occurred on the canonical content beyond the project-owner-authorized, Claude-assisted review-and-approval process already on record (baseline approvals, `SCIENTIFIC_CORRECTIONS.json` approvals, the Phase 4 owner review, and the correction task itself were all conducted this way, consistently, and are documented as such — never represented as independent third-party expert review).
- Any future claim of independent human expert approval must be recorded as a new, explicit governance decision by the actual reviewer, following the same pattern already used for every other approval in this repository — it cannot be inferred from this checkpoint or any other document in this set.

## 13. Exact files a future session must read

In this order, before making any change:

1. This document (`docs/app/PHSH111_INTERNAL_PILOT_CHECKPOINT.md`) — for the current-state summary.
2. `docs/app/PHSH111_APP_HANDOFF.md` — for full application development history and current constraints.
3. `docs/app/PHSH111_MVP_INTERNAL_QA.md` — for Phase 3's full QA detail plus its correction addendum.
4. `docs/app/PHSH111_OWNER_REVIEW_PACKET.md` — for Phase 4's full findings plus its resolution log.
5. `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` and `docs/content-design/chapter-01/PILOT_HANDOFF.md` — for content/visual-pipeline governance.
6. `docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json`, `ENGLISH_PILOT_BASELINE_APPROVAL.json`, `ARABIC_PILOT_BASELINE_APPROVAL.json` — for the correction/baseline-revision precedent and current versions.
7. The four canonical content JSON files and four SVGs (plus their validation records) under `docs/content-design/chapter-01/pilot/`.
8. The application source under `apps/chapter1-mvp/src/`, especially `src/features/topics/ReviewQuestion.tsx` and `VisualViewer.tsx`, and the full `src/tests/` suite.

## 14. Conditions required before chapter expansion

None of the following have occurred; all would need an explicit, separate project-owner authorization, following the same pattern used for the existing four-topic scope:

1. A project-owner decision to expand `PILOT_AUTHORIZATION.json`'s `scope.authorizedTopicIds` beyond the current four topics.
2. Canonical content generation, translation, and original visual production for any additional topic, following the same rigor already applied to `ch01-t02`/`t03`/`t08`/`t10` (newly authored content only, per `PILOT_RIGHTS_POLICY.json`; scientific review and correction where needed; bilingual baseline approval).
3. Confirmation that this MVP's outcome (validating the content/rendering/bilingual/accessibility pipeline end-to-end) is judged sufficient to justify scaling — an explicit decision `MVP_PRODUCT_SPEC.md` §20 flags as "decision needed from the project owner," not something this checkpoint can make.
4. Application-side extension of the topic-agnostic adapter/registry pattern (already designed to make this mechanical — new JSON file + registry entry — but not yet exercised beyond the original four).

## 15. Conditions required before student-facing authorization

Unchanged from `MVP_PRODUCT_SPEC.md` §22, none met as of this checkpoint:

1. An explicit project-owner authorization to build/run the application exists (already true, `PILOT_AUTHORIZATION.json` v1.1.0) — publication is a separate, still-absent authorization.
2. Every one of the four visuals has an actual recorded human review (`reviewer`/`reviewedAt` populated, not `null`) — still `null` for all four (§9, §12).
3. The relevant content records' `studentFacingAllowed` and the chapter-level `studentPublicationAuthorized` flags are explicitly set `true` by the project owner through the existing governance process — never inferred, defaulted, or set by application code. Still `false` everywhere.
4. The `visibility: "instructor"` misconception-block question (whether such content should ever reach a genuinely public/student audience) is explicitly resolved — unresolved; currently internal-only by design.
5. The MVP's full acceptance criteria (`MVP_PRODUCT_SPEC.md` §17) pass in full, including the manual/physical items no phase has yet closed out live (§11 above: hardware-keyboard confirmation, cross-browser dialog/Arabic verification).

**Restated for clarity: application availability, internal completeness, or this checkpoint's existence do not imply, authorize, or move the project any closer to student-facing publication.** Publication remains unauthorized, and all canonical content and visuals remain governed exclusively by their own existing records (baseline approvals, visual-validation records, `PILOT_AUTHORIZATION.json`, `PILOT_READINESS.json`) — none of which this checkpoint, or any phase to date, has modified in that direction.
