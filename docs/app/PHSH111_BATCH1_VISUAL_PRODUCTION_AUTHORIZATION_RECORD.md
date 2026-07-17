# PHSH111 Batch 1 — Visual Production Authorization Record

**Decision date:** 2026-07-17. **Type:** Governance and authorization only. No visual asset was created to produce this record.

## 1. Purpose

This document records a controlled, narrowly scoped authorization for a **future** implementation task to produce original, rights-safe visual assets for Batch 1 (`ch01-t01`, `ch01-t04`), now that both the English Batch 1 baseline (v1.0.0) and the Arabic Batch 1 baseline (v1.0.0) are approved. **This document authorizes visual production. It does not perform visual production, and it does not authorize application integration, student-facing use, independent human review, deployment, or publication.**

## 2. Decision date

2026-07-17.

## 3. Authorized visual IDs and topics

Exactly two: `ch01-t01-visual-001` (topic `ch01-t01`, Fundamental Quantities) and `ch01-t04-visual-001` (topic `ch01-t04`, Mass, Inertia and Weight). No other visual ID or topic is authorized by this record. `PILOT_AUTHORIZATION.json`'s `scope.authorizedTopicIds` and `applicationBuildAuthorization.applicableTopicIds` (the original four-topic, application-build-authorized set) are unchanged — these two visuals are authorized under a new, separate section (`batch1VisualProductionAuthorization`), not by expanding either existing section.

## 4. Prerequisites independently re-confirmed

Immediately before writing this record:

- `ENGLISH_BATCH1_BASELINE_APPROVAL.json`: `baselineVersion: "1.0.0"`, `status: "approved"`, unchanged since approval.
- `ARABIC_BATCH1_BASELINE_APPROVAL.json`: `baselineVersion: "1.0.0"`, `status: "approved"`, unchanged since approval.
- Both topics' `visualReference` content blocks (`ch01-t01-block-visual`, `ch01-t04-block-visual`) in both the English and Arabic baselines still show `visualGovernance[0].availabilityStatus: "missing"` and `linkageType: "none"` for `ch01-t01-visual-001` / `ch01-t04-visual-001` respectively — confirming no visual currently exists for either topic.
- `VISUAL_HOUSE_STYLE.md` was read in full as the design-style precedent, derived from the four completed pilot visuals (`ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`) and their validation records.
- `docs/content-design/chapter-01/batch1-visuals/` does not exist — confirmed by direct filesystem check immediately before this authorization. This authorization does not create it.

## 5. Authorized visual-production actions

A future implementation task, once separately initiated, may:

- Create exactly one original SVG for `ch01-t01` (`ch01-t01-visual-001`) and exactly one original SVG for `ch01-t04` (`ch01-t04-visual-001`).
- Use only the approved English Batch 1 baseline and the approved Arabic Batch 1 baseline as scientific and textual inputs — specifically each topic's own `visualReference` content block and its associated scientific correction (`ch01-corr-001` for `ch01-t01`; `ch01-corr-002` for `ch01-t04`, including its qualification).
- Follow the established visual house style (`VISUAL_HOUSE_STYLE.md`) for color semantics, typography, bilingual rendering, diagram structure, vector conventions, accessibility, and layout, adapted to each topic's own content rather than forcing an unrelated pilot layout onto it.
- Create a visual validation record for each asset, following the exact structure and rigor already established by the four pilot topics' own validation records.
- Provide English and Arabic labels on each asset where scientifically required, per the bilingual-per-element convention proven across all four pilot visuals (separate text elements, explicit `direction` attributes, formula isolated from prose).
- Validate each asset's scientific accuracy, geometric/mathematical correctness where a spatial or vector relationship is drawn, accessibility (`role="img"`, title/desc, contrast targets), zoom/enlarge and mobile-size-risk behavior, and rights-safety.
- Run local, read-only visual inspection as part of validation.

**This authorization does not itself perform any of the above.** No visual asset was created during this task.

## 6. Prohibited actions

- Tracing, copying, redrawing, or adapting any publisher slide, textbook page, review-card, Kahoot, or other cataloged source visual.
- Any modification of the approved English or Arabic Batch 1 baseline files, or of `ENGLISH_BATCH1_BASELINE_APPROVAL.json` / `ARABIC_BATCH1_BASELINE_APPROVAL.json`.
- Application-route or topic-registry expansion; rendering `ch01-t01`, `ch01-t04`, or either visual inside `apps/chapter1-mvp/`.
- Authorizing or claiming student-facing use.
- Claiming or recording independent human visual or scientific review as having occurred.
- Public deployment, student release, or any student-facing publication.
- Producing a visual for any topic or visual ID other than the two named in §3.
- Chapter-wide visual production.
- Any change to `CANONICAL_DESIGN_SCHEMA.json`'s `schemaVersion` or to `VISUAL_HOUSE_STYLE.md`'s governance statements.
- Modification of `docs/content-audits/` or any audited source evidence.
- Modification of the four existing pilot visual assets or their validation records.
- Git staging, commit, or push.

## 7. Required governance state for both visuals

Both `ch01-t01-visual-001` and `ch01-t04-visual-001` must remain, at all times under this authorization, in the exact state already established by the four pilot visuals:

| Field | Required value |
|---|---|
| Asset status | `draft` |
| Blocking status | `blocked` |
| `studentFacingAllowed` | `false` |
| `reviewer` | `null` |
| `reviewedAt` | `null` |

## 8. Authorized output paths

**`docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001.svg`** and **`docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001.svg`** — a new, separate directory, not created by this authorization task itself.

**Why a new, separate directory:** distinct from `docs/content-design/chapter-01/pilot/visuals/` (already scoped exactly to the four build-authorized pilot topics) and from `apps/chapter1-mvp/` (no application integration is authorized), mirroring the same separate-directory pattern already used for `docs/content-design/chapter-01/batch1-drafts/` and `docs/content-design/chapter-01/batch1-arabic-drafts/`.

Validation records follow the existing pilot visual-validation naming convention, co-located in the same new directory.

## 9. Rights and originality requirements

Restated directly for Batch 1, consistent with `PILOT_RIGHTS_POLICY.json`'s originality commitment already applied to the four pilot visuals:

- Each SVG must be **fully original artwork** — not traced, cropped, or adapted from any slide, textbook page, review card, Kahoot item, or other cataloged source visual.
- Complete source/audit lineage may inform scientific scope but must never determine visual geometry copied from a source image.
- A future production task must independently check each asset against every cataloged source visual referenced by its topic's audit records to confirm no tracing or adaptation occurred, exactly as the four pilot visuals' own validation records document.

## 10. Validation requirements

For any future visual-production task performed under this authorization:

- Each SVG's scientific content must be independently verified against its topic's approved English and Arabic baseline text and applicable scientific correction.
- Each SVG must carry `role="img"` with a full `title`/`desc` pair sufficient for a screen-reader user to reconstruct its teaching content.
- Each SVG's bilingual text must follow the established separate-element, explicit-direction, formula-isolated convention (`VISUAL_HOUSE_STYLE.md` §3–4).
- Any new scientific ambiguity or conflict discovered during production must stop work on the affected asset and be documented for a separate review — never silently resolved as an implicit new correction.

## 11. Publication and review status

**Unauthorized, unaffected by this record.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` chapter-wide and per-record for all fourteen Chapter 1 topics. No independent human visual or scientific review is claimed or implied — both future validation records' `reviewer`/`reviewedAt` fields must remain `null`, consistent with all four pilot visuals' own current state.

## 12. Application-integration status

**Not authorized.** `apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` remains exactly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]`, unchanged by this task. No route, registry entry, or import was added or is authorized for `ch01-t01`/`ch01-t04` or either visual.

## 13. Governance-version cross-reference

This authorization is formalized as `PILOT_AUTHORIZATION.json` **v1.4.0** (`batch1VisualProductionAuthorization`, `authorizationHistory` entry `1.4.0` `"action": "amended"`) and `PILOT_READINESS.json` **v1.10.0**.

## 14. Exact next controlled task

The next controlled task, if the project owner chooses to proceed, is the **actual visual-production task itself** — creating `ch01-t01-visual-001.svg` and/or `ch01-t04-visual-001.svg` at `docs/content-design/chapter-01/batch1-visuals/`, under the scope, actions, and constraints authorized in this record. That task is separate from this one and was not performed here.

---

### Governance statement (explicit, per task requirement)

- **This authorizes visual production, not visual approval.** Neither asset is treated as reviewed, approved, or ready for anything beyond internal draft status by virtue of this authorization existing.
- **This does not authorize application integration.** `apps/chapter1-mvp/`'s authorized topic scope is unchanged.
- **This does not authorize independent human visual or scientific review** — none is claimed, and none is a precondition satisfied by this authorization.
- **This does not authorize student-facing publication.** `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere.
- **No visual asset was created to produce this record.**
