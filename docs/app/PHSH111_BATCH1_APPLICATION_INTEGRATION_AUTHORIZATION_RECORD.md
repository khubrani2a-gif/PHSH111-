# PHSH111 Batch 1 — Application Integration Authorization Record

**Decision date:** 2026-07-17. **Type:** Authorization and architecture-decision only. No integration was performed to produce this record.

## 1. Purpose

This document records a controlled, narrowly scoped authorization for a **future** implementation task to integrate Batch 1 (`ch01-t01`, `ch01-t04`) into `apps/chapter1-mvp/`, now that the English (v1.0.0), Arabic (v1.0.0), and Visual (v1.0.0) Batch 1 baselines are all approved and all 18 required identifiers are registered (`IDENTIFIER_REGISTRY.json` v1.3.0). **This document authorizes internal application integration and QA. It does not perform integration, and it does not authorize student-facing release, public deployment, or publication.**

## 2. Project-owner decision

Authorize internal application integration for `ch01-t01` and `ch01-t04`, under the exact scope, permitted actions, and prohibitions recorded in `PILOT_AUTHORIZATION.json` v1.5.0's `batch1ApplicationIntegrationAuthorization`.

## 3. Authorized topics

Exactly two: `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight). No other topic or visual ID is authorized by this record. `scope.authorizedTopicIds` and `applicationBuildAuthorization.applicableTopicIds` (the original four-topic, application-build-authorized set) are unchanged.

## 4. Baseline dependencies

Independently re-verified immediately before authorization:

| Dependency | Version | Status |
|---|---|---|
| English Batch 1 baseline | 1.0.0 | approved |
| Arabic Batch 1 baseline | 1.0.0 | approved |
| Visual Batch 1 baseline | 1.0.0 | approved |
| `BILINGUAL_GLOSSARY.json` | 1.3.0 | unchanged |

All six approved files (2 English, 2 Arabic, 2 SVG) were re-checksummed and confirmed byte-identical to their respective approval records:

- `ch01-t01-content.json` (English): `a445f55de091ed0a2f7b3093ba0a186e01f94b1f46f0a9fcdbc7833e52ec87d9`
- `ch01-t04-content.json` (English): `c876a6fe0a041e6c892e5919435b4f2a2ea35fffe52148dc51a138b73a93628b`
- `ch01-t01-content.json` (Arabic): `3955df7510ec86ef33379b4086792e1fc6fbcdddfe7b10fb4ab5535ced6c23c0`
- `ch01-t04-content.json` (Arabic): `d1f5bfbdc5332c4c9295887d5d2c4d4e19f8e36da7a8e3822ca551fed4f11371`
- `ch01-t01-visual-001.svg`: `48c73a36fef43644ab810e500045c83777e57ba5bb25d1c1d64f5f887fc67a98`
- `ch01-t04-visual-001.svg`: `163b5eaa0269ca96943bf136c913bba0b961247da7ab0b68bbbd22b5a475cec6`

English and Arabic files were independently confirmed to use identical `instructorScript`/`contentBlock`/`problem` IDs and record ordering.

## 5. Identifier dependency

`IDENTIFIER_REGISTRY.json`, `registryVersion 1.3.0`, `batch1IdentifierRegistration.totalIdentifiersRegistered: 18` — all 18 Batch 1 identifiers confirmed registered (2 `instructorScript`, 12 `contentBlock`, 1 `problem`, 1 source marker, 2 visual). Confirmed: no existing application route or registry entry already uses `ch01-t01` or `ch01-t04` (searched `apps/chapter1-mvp/src/` — zero matches).

## 6. Existing application architecture

Inspected in full: `src/config/topics.ts`, `src/content/rawImports.ts`, `src/content/adapter.ts`, `src/content/validate.ts`, `src/content/governance.ts`, `src/types/pilotSchema.ts`, `src/types/normalized.ts`, `vite.config.ts`, `src/app/App.tsx`, `src/pages/ChapterOnePage.tsx`, and the four existing pilot topics' own integration as precedent. `apps/chapter1-mvp/README.md` does not exist.

Key findings:

- **Single dynamic route.** `chapter/1/topic/:topicId` already handles every topic generically via `getTopic(topicId)` — no new route pattern is required for the two new topics.
- **Centralized import boundary.** `src/content/rawImports.ts` is the sole place that imports canonical files from outside `src/`; every other file reads through `src/content/adapter.ts`. This pattern must be extended, not bypassed.
- **`vite.config.ts`'s `server.fs.allow`** already resolves to the parent `docs/content-design/chapter-01/` directory, not narrowly to `pilot/` — it therefore **already covers** `batch1-drafts/`, `batch1-arabic-drafts/`, and `batch1-visuals/` without requiring any change.
- **`PilotTopicId`** (`src/types/pilotSchema.ts`) is currently a hardcoded four-literal union (`"ch01-t02"|"ch01-t03"|"ch01-t08"|"ch01-t10"`), and `PILOT_TOPIC_ORDER` mirrors `PILOT_READINESS.json`'s chapter-wide four-topic `pilotTopicOrder` — a different, narrower governance concept than Batch 1's own separate authorization.
- **Architectural asymmetry:** the four pilot topics each have **one** canonical file per topic with English and Arabic already merged inline (`localizedContent.en`/`.ar` plus a parallel `arabic.canonicalArabicTranslation`). Batch 1's approved baseline is **split across two separate, immutable files** per topic (English-only baseline; separately-approved Arabic candidate copy) — this is the single most significant integration-architecture difference and is addressed in §7.
- **Schema/adapter compatibility is otherwise high:** `KNOWN_BLOCK_TYPES` in `validate.ts` already includes every blockType Batch 1 uses (`mainIdea`, `organizedExplanation`, `equationSet`, `visualReference`, `misconception`, `reviewQuestion`); the adapter already treats `example` blocks, `problem` records, and visuals as optional, so `ch01-t01`'s missing problem record and Batch 1's missing `example` blocks require no adapter change.

## 7. Selected integration-source model

**Direct import from the approved source paths** (Option 1), mirroring the exact live-ES-module-import pattern already proven by `rawImports.ts` for the four pilot topics.

**Why this is safest:**

- No new copy of already-approved content is ever created — approved files remain the single, immutable source of truth.
- `vite.config.ts`'s existing `server.fs.allow` already covers all three Batch 1 directories; **zero configuration change is required** for path access.
- Production builds bundle these via Rollup at build time (same as the four pilot topics), requiring no `fs.allow` involvement at all.
- Checksum verification remains straightforward: the imported bytes are the approved file's bytes, so a load-time or test-time hash check is directly meaningful (see §11).

**Rejected alternatives:**

- **App-local immutable integration copies** — rejected: creates a second, physically separate copy of already-approved content, reintroducing exactly the duplicate-source-of-truth risk this project's governance has consistently avoided (English/Arabic baseline separation, visual asset immutability).
- **A generated manifest/adapter layer that pre-serializes a merged file to disk** — rejected for the same reason: any generated artifact becomes a second source that could silently drift from the approved originals.

**The one required addition:** because Batch 1's baseline is split across two files per topic (unlike the four pilot topics' single merged file each), the future integration task must add a **read-only, in-memory merge step** in the content-loading layer — never writing a merged file to disk — that combines each approved English record with its corresponding approved Arabic record's translated text, producing the same single-file-shaped structure the existing adapter already expects.

## 8. Authorized source paths

| Language/asset | Path |
|---|---|
| English | `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`, `ch01-t04-content.json` |
| Arabic | `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json`, `ch01-t04-content.json` |
| Visuals | `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001.svg`, `ch01-t04-visual-001.svg` |
| Visual validation records | `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001-validation.json`, `ch01-t04-visual-001-validation.json` |

No other path is authorized as an integration source.

## 9. Authorized application areas

- `src/types/pilotSchema.ts` — extend `PilotTopicId` union; add/extend a chapter-wide topic-order constant.
- `src/config/topics.ts` — re-export the extended order (no logic change needed beyond what `pilotSchema.ts` already provides).
- `src/content/rawImports.ts` — add import statements for the six new source files plus the in-memory merge step.
- `src/content/adapter.ts` / `src/content/validate.ts` — narrowly extended per §11.
- `ChapterOnePage.tsx` — update hardcoded "four pilot topics" introductory text to reflect six topics.
- Existing generic route (`chapter/1/topic/:topicId`) — no new route pattern.
- Test files under `src/tests/` — new/updated coverage per §13.

No other application file, route, or configuration is authorized for modification.

## 10. Topic ordering

The correct chapter-wide numerical sequence, derived from each topic's own numeric suffix: **`ch01-t01`, `ch01-t02`, `ch01-t03`, `ch01-t04`, `ch01-t08`, `ch01-t10`**. The integration task must place `ch01-t01` and `ch01-t04` in this exact sequence without changing the established order or identities of the four existing pilot topics, and without inventing any placeholder route for any topic outside this six-topic set (`ch01-t05`–`ch01-t07`, `ch01-t09`, `ch01-t11`–`ch01-t14` remain entirely out of scope).

## 11. Adapter and schema assessment

Verified directly against both approved topic files and both visual-validation records:

| Requirement | Finding |
|---|---|
| `ch01-t01` has no problem record | Confirmed. The adapter's `problem: problem ? normalizeProblem(problem) : undefined` already renders no problem section when absent — **no adapter change needed**. |
| `ch01-t04` contains `ch01-prob-104` | Confirmed present, structurally valid against `ProblemRecord`. |
| Arabic localization status remains `draft` | Confirmed in the Arabic candidate file — `arabic.translationStatus: "draft"` on every record, never `"approved"`. |
| External baseline approval records establish approval without rewriting record statuses | Confirmed — exactly mirrors the existing pilot pattern; no in-file status field is changed by any baseline approval. |
| `visualReference` records resolve to approved SVGs | Confirmed both blocks (`ch01-t01-block-visual`, `ch01-t04-block-visual`) carry `visualReferenceIds`/`visualGovernance` referencing `ch01-t01-visual-001`/`ch01-t04-visual-001`, matching the approved SVG paths exactly. |
| No unsupported field remains | Confirmed — every field Batch 1 uses already has a corresponding type in `pilotSchema.ts`/`normalized.ts`; no new field or enum value is introduced. |

**Required adapter changes** (documented, not performed):

1. Extend `PilotTopicId` (four literals → six).
2. Extend/add a chapter-wide topic-order constant, while preserving `PILOT_TOPIC_ORDER`'s existing four-topic meaning for pilot-scoped logic (e.g. `validateTopicSet`'s exact-count assertion).
3. Add the six new import statements plus the in-memory English/Arabic merge step to `rawImports.ts` (§7).
4. Update `validateTopicSet`'s topic-count/order assertions for the new six-topic set, without weakening its existing per-record duplicate-ID, schema-version, or governance checks.
5. Update `ChapterOnePage.tsx`'s hardcoded topic-count text.
6. **No change required** to `ContentBlockType`, `VisibilityState`, `BlockingState`, or `VisualValidationRecord` — all already structurally compatible.

## 12. Visual-delivery requirements

- Resolve each `visualReference` to its approved SVG via the authorized source paths.
- Provide enlarge/zoom/pan access via the existing `VisualViewer` dialog — no new component required.
- Preserve each SVG's accessibility `<title>`/`<desc>` exactly as approved.
- Avoid clipping at mobile/tablet sizes; test cross-browser rendering (previously verified only in one Chromium-based preview browser).
- Preserve mixed Arabic/Latin text exactly as approved.
- **Do not alter SVG content** in any way.
- Verify both SVG checksums during integration QA.
- The brick-red force color (`#b91c1c`) is approved only within the two approved Batch 1 SVGs and must **not** be added globally to `VISUAL_HOUSE_STYLE.md` or to any other visual during integration.

## 13. Testing and QA authorization

Authorized test scope: topic registry, routes, topic ordering across all six topics, approved-file loading, checksum/manifest validation, schema validation, record rendering for every Batch 1 record type, missing-problem behavior for `ch01-t01`, problem/solution behavior for `ch01-t04`, English/Arabic switching, RTL/LTR correctness, Review Card rendering, instructor-only visibility, SVG resolution, enlarge/zoom/pan interaction, and regression protection for the four existing pilot topics.

Authorized commands: TypeScript typecheck, unit/integration tests (vitest), production build, local internal browser-based QA. **Deployment of any kind is not authorized.**

## 14. Existing-topic regression requirements

The integration task must preserve, for the four existing pilot topics and the application as a whole: PHSH111 app identity; the internal pilot/Draft-Review-Required banner on every route; the English/Arabic toggle and correct RTL/LTR switching; current accessibility behavior; current dialog focus-trap/inertness/Escape/scroll-lock behavior; current visual enlarge/pan behavior; the current "Review Card" label; instructor-only visibility boundaries; and blocked/non-student-facing state. The four pilot topics' own identities, content, and behavior must remain unchanged — verified by regression tests, not assumed.

## 15. Governance restrictions

Both `ch01-t01` and `ch01-t04`, and every one of their records and visuals, must remain, throughout integration:

- `studentFacingAllowed: false`
- `studentPublicationAuthorized: false`
- `independentHumanReviewComplete: false`

**Application-integration approval must never be represented as scientific, visual, Arabic, or publication approval** — those remain separate, already-recorded governance facts (`ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `ARABIC_BATCH1_BASELINE_APPROVAL.json`, `VISUAL_BATCH1_APPROVAL.json`), none of which this authorization changes. The two new topics must not appear as publicly released content.

## 16. Independent-review status

**Incomplete, unclaimed.** No independent human visual, scientific, or expert review has occurred for either topic or either visual at any point in this project. This authorization does not constitute or imply such review.

## 17. Student-facing status

**Unauthorized.** `studentFacingAllowed` remains `false` for both topics, chapter-wide and per-record.

## 18. Publication status

**Unauthorized.** `studentPublicationAuthorized` remains `false` chapter-wide and per-record. Public deployment, student release, and publication all remain unauthorized and require their own separate, future, explicit project-owner decisions.

## 19. Exact next controlled task

**Implement the authorized application integration for `ch01-t01` and `ch01-t04`, including tests and internal QA.** Not performed as part of this authorization task.

---

### Governance statement (explicit, per task requirement)

- **This authorizes application integration, not application integration having occurred.** `applicationIntegrationImplemented` remains `false`.
- **This does not authorize student-facing release, public deployment, or publication.**
- **This does not authorize independent human review claims.**
- **No approved content or visual baseline was modified.**
- **No new topic content, Arabic translation, or visual was produced.**
- **No application file was modified, no route/import/registry entry was added, no build/test/install/deploy command was run, and no Git write operation occurred, to produce this record.**
