# PHSH111 Batch 1 — Canonical Drafting Authorization Record

**Decision date:** 2026-07-16. **Type:** Governance and authorization only. No topic content, Arabic translation, or visual was generated to produce this record.

## 1. Purpose

This document records a controlled, narrowly scoped authorization for a **future** implementation task to generate English-language canonical draft records for Batch 1 (`ch01-t01`, `ch01-t04`), now that both topics' scientific-reconciliation prerequisite is complete (`ch01-corr-001`: `editoriallyApproved`; `ch01-corr-002`: `editoriallyApproved` with a recorded qualification). **This document authorizes drafting. It does not perform drafting, and it does not authorize Arabic content, visual production, application expansion, or student-facing publication.**

## 2. Decision date

2026-07-16.

## 3. Authorized topics

Exactly two: `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight). No other Chapter 1 topic is authorized for canonical generation by this record. `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` v1.2.0's `scope.authorizedTopicIds` (the original four-topic, application-build-authorized set) is unchanged — `ch01-t01`/`ch01-t04` are authorized under a **new, separate, narrower** section (`batch1DraftingAuthorization`), not added to that array.

## 4. Scientific prerequisites

Independently re-confirmed immediately before writing this record:

- `ch01-corr-001` (→ `ch01-t01`): `approvalStatus: "editoriallyApproved"`. `approvals.scientificReviewer: null`. `originalWording.sourceRecordIds` and `scientificAuditRecordIds` match the citation-repair task's final, verified sets. `correctedWording.ar: null`, `arabicStatus: "notGenerated"`.
- `ch01-corr-002` (→ `ch01-t04`): `approvalStatus: "editoriallyApproved"`. `approvals.scientificReviewer: null`. Citation sets likewise confirmed intact. `correctedWording.ar: null`, `arabicStatus: "notGenerated"`. `approvals.approvalBasis` carries the recorded qualification (§5).
- `docs/content-design/chapter-01/pilot/` contains only `ch01-t02-content.json`, `ch01-t03-content.json`, `ch01-t08-content.json`, `ch01-t10-content.json` — confirmed by direct filesystem search immediately before this task. **No `ch01-t01` or `ch01-t04` canonical content file exists anywhere in the repository.**
- Prior to this record, `PILOT_AUTHORIZATION.json` (v1.1.0) and `PILOT_READINESS.json` (v1.4.0) did not permit Batch 1 canonical drafting in any form — `canonicalGenerationAuthorized` was chapter-wide `false`, and neither topic appeared in `scope.authorizedTopicIds`.

## 5. Approved correction requirements

Any future drafting task must apply:

- **`ch01-corr-001`** to `ch01-t01` exactly as approved: *"Distance, time, and mass are the fundamental quantities emphasized in this chapter's treatment of mechanics. Charge is another fundamental property used later in the course."*
- **`ch01-corr-002`** to `ch01-t04` exactly as approved, **including its qualification**: *"Mass measures an object's inertia. Gravitational weight is the gravitational force on the object, while apparent weight is the support force indicated by a scale or felt by the body."* — with the explicit qualification that **"Apparent weight" is scientifically valid, project-authored interpretive terminology and must not be represented as verbatim wording from the cited source material.**

Neither corrected wording may be altered during drafting without a separate, new correction record following the established `SCIENTIFIC_CORRECTIONS.json` pattern.

## 6. Authorized drafting actions

A future implementation task, once separately initiated, may:

- Inspect all audited source evidence for `ch01-t01` and `ch01-t04`.
- Create English `instructorScript` records, per `CANONICAL_DESIGN_SCHEMA.json` `schemaVersion: "2.3.0"`.
- Create English learner-visible `contentBlock` records.
- Create English instructor-only `contentBlock` records where justified.
- Create original, rights-safe worked examples.
- Create original, rights-safe `problem` records and solutions.
- Preserve complete source and scientific-audit lineage via `provenanceLinks`/`sourceReferenceIds`, without reproducing copyrighted source text (§9).
- Apply `ch01-corr-001` and `ch01-corr-002` exactly as approved (§5).
- Create validation records for the generated draft files.
- Create textual visual-specification/requirement records as planning metadata only (§10).
- Run JSON/schema/content validation.
- Create draft-review documentation.

**This authorization does not itself perform any of the above.** No drafting occurred during this task.

## 7. Schema/localization decision

**Finding: `CANONICAL_DESIGN_SCHEMA.json` `schemaVersion: "2.3.0"` safely supports an English-only draft, without inventing Arabic content, without fake placeholders, without copying English into Arabic fields, and without weakening localization validation — using a mechanism the schema already provides:**

- `localizedText` (the schema's shared text-record shape) explicitly allows `"text": null` and includes `"missing"` and `"notAuthored"` as valid `"status"` enum values — this is the schema's own, already-defined representation of "this text does not exist yet," not an invented convention.
- `arabicSeparation` (used by `contentBlock.arabic`, and optionally by `instructorScript.arabic`/`problem.arabic`) requires a `translationStatus` field whose enum explicitly includes `"missing"` — again, the schema's own defined value for "no translation exists."
- `contentBlock.arabic` is a **required** field (contentBlock's `required` array includes `"arabic"`), but the required object itself can legitimately take the form: `originalArabicText: {text: null, status: "missing", language: "ar", direction: "rtl"}`, `canonicalArabicTranslation: {text: null, status: "missing", language: "ar", direction: "rtl"}`, `translationStatus: "missing"`, `translationReviewer: null`, `terminologyApprovalStatus: "notStarted"`. This is a fully schema-valid, honest "Arabic not generated" state — the internal diagnostic this task requires.
- `instructorScript.arabic` and `problem.arabic` are **not** in either record type's `required` array — a future drafting task may omit the field entirely for these two record types rather than populate it with a "missing" state, which is simpler and equally honest.
- `contentBlock.localizedContent` is schema-unconstrained (`{"type": "object"}`) — an English-only object (e.g., containing only an `"en"` key) is permitted without a schema change.

**Exact allowed representation, authorized for use:**

| Record type | Arabic field | Required? | Allowed English-only representation |
|---|---|---|---|
| `contentBlock` | `arabic` | Yes | `arabicSeparation` object with `translationStatus: "missing"`, both nested `localizedText` objects at `text: null, status: "missing", language: "ar", direction: "rtl"`, `translationReviewer: null`, `terminologyApprovalStatus: "notStarted"` |
| `instructorScript` | `arabic` | No | Omit the field entirely |
| `problem` | `arabic` | No | Omit the field entirely |

**Required internal diagnostic:** every `contentBlock` record's `arabic.translationStatus` must read `"missing"` (never `"notRequired"` — Arabic is genuinely not yet generated, not exempt from ever being required) until a future, separate Arabic-generation task changes it through the normal translation pipeline. This status is queryable and machine-checkable, satisfying the requirement for an explicit status indicating Arabic is not generated.

**No schema change was made, needed, or is recommended.** No malformed canonical topic file is authorized.

## 8. Authorized output paths

**`docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json`** and **`docs/content-design/chapter-01/batch1-drafts/ch01-t04-content.json`** — a new directory, not created by this task (governance only).

**Why not `docs/content-design/chapter-01/pilot/`, given the schema finding above says English-only content can be schema-valid there too:** `pilot/` is already a governance-defined term in this project, scoped exactly to the four topics with `applicationBuildAuthorization` (i.e., topics the running `apps/chapter1-mvp/` application actually reads via `rawImports.ts`). Placing Batch 1's English-only, not-build-authorized, not-baseline-approved drafts in that same directory — even though each file would itself validate against the schema — would blur an already-established scope boundary and create a real risk that a future session or the application's own static-import list treats them as pilot-equivalent. Keeping them in a separate, clearly-named directory makes the distinction structurally obvious, not just documented in prose.

Validation records for the two draft files follow the existing pilot visual-validation naming convention, co-located in the same new directory.

## 9. Rights and originality requirements

Restated directly for Batch 1 (since `PILOT_RIGHTS_POLICY.json`'s own `scope.appliesToTopicIds` does not currently include `ch01-t01`/`ch01-t04`, and this task does not amend that file):

- All student-facing explanations, examples, questions, and solutions must be **newly authored**.
- Source evidence may determine scientific scope, topic order, required concepts, equations, terminology, misconceptions, and learning emphasis.
- **Prohibited:** close paraphrase of publisher wording; copying source examples with superficial number changes; copying review-card (R1) or Kahoot (K1) wording; reproducing publisher tables; tracing or reusing publisher figures; presenting source artwork as original project work.
- Complete source lineage (via `provenanceLinks`/`sourceReferenceIds`) is required without reproducing copyrighted text — internal traceability only, exactly as `PILOT_RIGHTS_POLICY.json` already establishes for the four pilot topics (`"Source IDs may remain as internal provenance and audit lineage only"`).

## 10. Visual-planning boundary

A future drafting task may **identify and document** visual requirements for `ch01-t01` (`V02`, per `docs/content-audits/chapter-01/visual-inventory.json`) and `ch01-t04` (`V09`) as **textual visual specifications only** — describing what a diagram should show, in the same structural style as the four pilot topics' `visualReference` content blocks before their SVGs were drawn.

It may **not**: create SVG files, create raster images, trace or adapt source visuals, approve visual geometry, or mark any visual `readyForHumanReview`/ready for student use. **Visual production requires a separate authorization**, exactly as it did for the four pilot topics (which each went through their own dedicated visual-creation-and-validation step after content drafting).

## 11. Arabic status

Unchanged and **not authorized**. `ch01-corr-001.correctedWording.ar` and `ch01-corr-002.correctedWording.ar` remain `null`; `arabicStatus` remains `"notGenerated"` on both. No Arabic content, translation, or machine translation of any kind is authorized by this record. Any future English draft's `contentBlock.arabic` fields must use the `"missing"` mechanism specified in §7 — never a fabricated or copied-from-English value.

## 12. English baseline status

**Not approved, and not authorized by this record.** This authorization covers **drafting** only. A future English draft is not a baseline — it would require its own dedicated review-and-approval action, mirroring `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s existing pattern (a `baselineVersion`, `status: "approved"`, per-topic `perTopicDecision`, and a `revisionControlPolicy.revisionLog`), before it could be treated as approved source text for anything downstream (Arabic translation, visual production, or application rendering).

## 13. Application-expansion status

**Not authorized.** `apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` in `PILOT_AUTHORIZATION.json` remains exactly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]`, unchanged by this task. No route, registry entry, or import was added or is authorized for `ch01-t01`/`ch01-t04`. Rendering either topic inside the running application requires a separate, future authorization amendment, following the same controlled pattern already used for `applicationBuildAuthorization` itself.

## 14. Independent-review status

No independent human subject-matter (physics) review has occurred on `ch01-corr-001` or `ch01-corr-002`, and none is claimed here. Both corrections' `approvals.scientificReviewer` remain `null`. This authorization does not require or imply independent expert review as a precondition for drafting — consistent with the same project-owner-editorial-review basis already used for the four pilot topics' own approved corrections (`ch01-corr-006`–`009`) before their drafting proceeded.

## 15. Publication status

**Unauthorized, unaffected by this record.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` chapter-wide in `PILOT_READINESS.json`, and per-record for all fourteen Chapter 1 topics. Nothing in this authorization changes, sets, or proposes changing either flag for `ch01-t01`, `ch01-t04`, or any other topic.

## 16. Validation requirements

For any future drafting task performed under this authorization:

- Every generated draft record must validate against `CANONICAL_DESIGN_SCHEMA.json` `schemaVersion: "2.3.0"`.
- Every source/audit citation must resolve against `IDENTIFIER_REGISTRY.json`'s namespace patterns and authority files (confirmed still `registryVersion: "1.2.0"`, unmodified by this task).
- `ch01-corr-001`'s and `ch01-corr-002`'s corrected wording, and `ch01-corr-002`'s qualification, must be applied exactly as they appear in `SCIENTIFIC_CORRECTIONS.json` (unmodified by this task).
- Every `contentBlock.arabic` field must use the `"missing"` representation specified in §7 — a JSON/schema validation pass should explicitly check for this rather than assume it.
- Any new scientific ambiguity or conflict discovered during drafting must **stop work on the affected topic** and be documented for a separate review — never silently resolved as an implicit new correction.

## 17. Exact next controlled task

The next controlled task, if the project owner chooses to proceed, is the **actual English-language drafting task itself** — creating `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and/or `ch01-t04-content.json`, under the scope, actions, and constraints authorized in this record. That task is separate from this one and was not performed here. Following the established pilot sequence, drafting would in turn be followed by: English baseline approval (§12) → Arabic translation planning (gated on `ch01-t04`'s three pending glossary terms completing terminology review, and on a fresh Arabic-generation authorization) → visual specification and production (§10, gated on its own separate authorization) → any eventual, further-separate application-expansion authorization (§13).

---

### Governance statement (explicit, per task requirement)

- **This authorizes drafting, not approval.** No draft record is itself a baseline or is treated as approved by virtue of this authorization existing.
- **This does not authorize Arabic content.** Arabic remains `"notGenerated"` for both corrections and would remain unauthorized for any resulting draft.
- **This does not authorize visual production.** Only textual visual-specification planning metadata is permitted.
- **This does not authorize application expansion.** `apps/chapter1-mvp/`'s authorized topic scope is unchanged.
- **This does not authorize student-facing publication.** `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere.
