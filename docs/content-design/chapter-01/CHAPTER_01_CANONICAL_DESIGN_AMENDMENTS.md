# Chapter 1 Canonical Design Amendments

## Status and boundary

This design amendment implements the accepted Claude architecture/readiness review. It changes only the canonical design layer. It does not generate canonical Chapter 1 content, translate missing Arabic, alter source-level audit records, resolve rights, or authorize student publication.

The amendment is normative together with `CHAPTER_01_CANONICAL_STRUCTURE_PROPOSAL.md`. If an older example in the proposal conflicts with a schema or registry introduced here, the newer design-layer file governs.

## Files introduced

| File | Design authority |
|---|---|
| `CANONICAL_DESIGN_SCHEMA.json` | Canonical content-block, instructor-script, problem, correction, blocking, localization, traceability, duplicate, and occurrence fields |
| `IDENTIFIER_REGISTRY.json` | Allowed identifier namespaces, patterns, authorities, and cross-namespace validation rules |
| `DUPLICATE_AND_CONFLICT_DECISIONS.json` | Design-layer duplicate/preference structure and the five correction conflicts added after Claude review |
| `SCIENTIFIC_CORRECTIONS.json` | Formal proposed corrections; every record links both audit and conflict layers |
| `BILINGUAL_GLOSSARY.json` | Chapter 1 terminology schema and starter terms; Arabic approvals remain pending |
| `VISUAL_RESOLUTION_PLAN.json` | Independent recovery/redraw workflow for missing and unresolved visuals |
| `PILOT_READINESS.json` | Design-only readiness for `ch01-t02`, `ch01-t03`, `ch01-t08`, and `ch01-t10` |
| `CLAUDE_REREVIEW_HANDOFF.md` | Minimal ordered package for verifying these amendments |
| `INSTRUCTOR_SCRIPT_FIELD_VALIDATION.md` | Field-by-field validation of all 59 teaching-script records against the `instructorScript` schema, added during the blocker-resolution pass |

## Accepted structural changes

### Instructor scripts

`instructorScript` is now a first-class record with narration, pacing, student interaction, visual cues, misconceptions, transitions, cautions, scientific corrections, and provenance. The complete definition is `$defs.instructorScript` in `CANONICAL_DESIGN_SCHEMA.json`.

### Duplicate, revision, and preference decisions

Canonical blocks and problems now support:

- `duplicateGroupIds`
- `revisionGroupId`
- `canonicalPreferenceStatus`
- `preferredSourceRecordId`
- `preferenceReason`
- `supersededBy`
- `retainedForHistoricalTrace`

Preference records never delete source occurrences. A preferred record is a design decision, not a rewrite of the evidence layer.

### Multi-source problems

A canonical problem may carry multiple source occurrences through `sourceVariants`. Each variant can reference source, problem, solution, card, question, page, segment, occurrence, answer variant, correction, conflict, and visual IDs. Selection is explicit through `selectedVariantIds` and `selectionRationale`.

### Arabic separation

Canonical localized records distinguish:

- `originalArabicText`: an exact source-supplied Arabic reference or copy governed by rights;
- `canonicalArabicTranslation`: a future canonical translation;
- `translationStatus`;
- `translationReviewer`;
- `terminologyApprovalStatus`.

No missing translation is inferred. Source Arabic and canonical Arabic are never stored as if they were the same editorial object.

### Blocking and publication

Every canonical block can state the precise blocker category and linked evidence. `studentFacingAllowed` defaults to `false` until science, rights, language, visual, and content-leak gates pass independently. Instructor visibility does not override rights restrictions.

### Correction linkage

Every correction must link to at least one scientific-audit record and at least one design or source conflict record. Original wording remains traceable; proposed wording is separately stored and suppressed from Student Mode until approved.

### Identifier validation

All source, segment, page, card, problem, occurrence, solution, question, visual, scientific-audit, conflict, topic, and canonical IDs must validate through `IDENTIFIER_REGISTRY.json`. Unknown prefixes are blockers, not best-effort links.

### Additional preservation guards

- Visual availability and cross-source linkage confidence are separate fields; `candidateMatch` is never treated as asset availability.
- Review cards carry parallel original-card and solved-review references.
- Existing review questions may be marked as quiz seeds without being mislabeled as Kahoot-ready.
- Canonical blocks can retain `formatPreferenceIds` and `bilingualRuleIds` so the reasoning behind the 38 formatting preferences and five bilingual rules is not lost.
- Audit classification and correction severity are separate fields with an explicit crosswalk in `SCIENTIFIC_CORRECTIONS.json`.

## Added correction families

The following are now formal design-layer correction records:

1. Fundamental quantities must be scoped to the mechanics treatment and must not erase charge from the broader physics context.
2. Mass is introduced primarily through inertia; gravitational weight and apparent weight are separate concepts.
3. A resultant can be perpendicular to one component only through the geometry of the complete vector sum; “right-angle addition” alone is not an explanation.
4. “Curves upward” must be replaced by explicit language about slope, concavity, axes, and sign convention.
5. The Usain Bolt record must not pair Berlin 2009 with `9.69 s`; the accepted proposed correction records Berlin 2009 as `9.58 s` and Beijing 2008 as `9.69 s`, pending final reviewer approval and citation selection.

## Visual workflow amendment

Visual recovery is a distinct prerequisite stream. Figure 1.13, the elevator graph, Figure 1.40, and the 31 Source 002 attachment placeholders remain blocked until the specific recovery decision in `VISUAL_RESOLUTION_PLAN.json` is resolved. A candidate PDF page is evidence for comparison only and does not establish visual identity or reuse rights.

## Pilot boundary

The design layer is prepared for later pilot generation of `ch01-t02`, `ch01-t03`, `ch01-t08`, and `ch01-t10`. This amendment does not authorize generation. Topic-specific blockers and required correction IDs are recorded in `PILOT_READINESS.json`.

## Blocker resolution pass (post Claude re-review)

The Claude amended-design re-review returned `requiresDesignRevision` with three named blockers. This pass resolves exactly those three and no others.

1. **`instructorScript` field gaps.** All 59 records in `docs/content-audits/chapter-01/teaching-script-inventory.json` were read and their field shape verified. Five fields had no schema counterpart and would have been lost under `additionalProperties: false`: `mainIdea`, `intuition`, `graphGuidance`, `tableGuidance`, `levelAdaptations`. All five are now present in `$defs.instructorScript` (`CANONICAL_DESIGN_SCHEMA.json`, `schemaVersion` `2.0.0` → `2.1.0`), matching the source shape (`localizedText` for the two prose fields, string arrays for the three list fields). Full field-by-field validation, including five other fields with partial-but-lower-risk mappings that are explicitly out of scope for this fix, is in `INSTRUCTOR_SCRIPT_FIELD_VALIDATION.md`.
2. **Identifier registry conflict namespace.** `C01`–`C04` (the `canonicalConflicts` series in `docs/content-audits/chapter-01/duplicates-and-conflicts.json`) matched no pattern in the `conflict` namespace. Added `^C[0-9]{2}$` to `IDENTIFIER_REGISTRY.json` (`registryVersion` `1.0.0` → `1.1.0`), checked for collisions against every other registered pattern, and confirmed programmatically that a sample of 61 real IDs across all 13 namespaces (including `C01`–`C04`) each match exactly one correct pattern.
3. **Bilingual glossary period/frequency gap.** `ch01-t03` (a pilot topic) has two open corrections (`SCA04`, `SCA05`) about period/frequency cycle-condition wording, but the glossary had no entries for either term. Added `ch01-term-period` and `ch01-term-frequency` to `BILINGUAL_GLOSSARY.json` (`glossaryVersion` `1.0.0` → `1.1.0`), each `approvalStatus: pending`, `studentFacingAllowed: false`, linked to `ch01-t03`, `SCA04`, and `SCA05`.

None of these three changes touches any file under `docs/content-audits/chapter-01/`, approves any scientific correction, resolves any rights or visual blocker, or changes `canonicalGenerationAuthorized`. `PILOT_READINESS.json` records the three fixes under `resolvedDesignBlockers` without altering any topic's `blockingStatus`.

## Second blocker-resolution pass — missing pilot-topic correction records

A prior Claude re-review noted (outside the three named blockers) that `ch01-t03`, `ch01-t08`, and `ch01-t10` each had a `requiredScientificAuditIds` entry in `PILOT_READINESS.json` but no corresponding formal `ch01-corr-XXX` record in `SCIENTIFIC_CORRECTIONS.json` — meaning their scientific blockers had no record to enter the approval workflow through. This pass adds the three missing records:

- **`ch01-corr-006`** (`ch01-t03`, `SCA04`/`SCA05`): defines period as the time for one complete cycle and frequency as cycles per unit time for a specified periodic process, with `f = 1/T` and `T = 1/f` (T in seconds, f in hertz). Linked to `ch01-term-period`, `ch01-term-frequency`, and the Kahoot source's corroborating source-wide finding `K1-SCI-007`.
- **`ch01-corr-007`** (`ch01-t08`, `SCA12`/`S3-SCI-004`): separates the magnitude `|g| ≈ 9.8 m/s²` from signed acceleration (`a = -g` upward-positive, `a = +g` downward-positive), requires the same sign convention across displacement/velocity/acceleration, and covers free-fall from rest.
- **`ch01-corr-008`** (`ch01-t10`, `SCA11`/`S3-SCI-005`): states velocity is tangent to the circular path and centripetal acceleration points toward the center; constant speed does not imply constant velocity. Linked to `K1-SCI-009`, a Kahoot positive-contrast finding: 36 centripetal occurrences in that source all correctly keep velocity tangent, corroborating this is the standard expected framing.

Each new correction links to a newly added design-layer conflict record (`CD-CONF-006`/`007`/`008` in `DUPLICATE_AND_CONFLICT_DECISIONS.json`, `decisionLayerVersion` `1.1.0`), since the correction schema requires non-empty `conflictRecordIds` and none of the existing five conflict records covered these topics.

**Schema extension required.** The requested field set for these records (equations, assumptions/sign conventions, affected content-block *types* as distinct from block IDs, glossary links, a full blocking-workflow object, an explicit evidence-status field) exceeded what `$defs.correction` declared, and `additionalProperties: false` would have silently rejected the extra fields. Added `equations`, `assumptionsAndSignConventions`, `affectedContentBlockTypes`, `glossaryTermIds`, `blocking` (reusing the existing `blockingWorkflow` $def), and `evidenceStatus` as optional properties on `correction` (`schemaVersion` `2.1.0` → `2.2.0`). These are additive only — not added to `required` — so the five pre-existing correction records remain valid without needing these fields retroactively.

**Identifier registry extension required.** Linking `K1-SCI-007`/`K1-SCI-009` (Kahoot scientific-audit findings) from a formal correction record for the first time exposed that `SRC-CH01-KAHOOT-001`'s `K1-*` ID namespace was never registered in `IDENTIFIER_REGISTRY.json`. Added `^K1-SCI-[0-9]{3}$` to the `scientificAudit` namespace and `SRC-CH01-KAHOOT-001` to `sourceIds` (`registryVersion` `1.1.0` → `1.2.0`).

`PILOT_READINESS.json`'s `requiredCorrectionIds` for `ch01-t03`/`ch01-t08`/`ch01-t10` now point to `ch01-corr-006`/`007`/`008` respectively. No topic's `blockingStatus`, `blockingReason`, or `canonicalGenerationAuthorized` changed — all three corrections are `approvalStatus: "proposed"`, not approved, so the `scientificCorrection` blocker remains open for all three topics until a human reviewer signs off.

## Validation rules

- JSON design files must parse successfully.
- Schema references and identifier-registry references must resolve to files in this directory.
- Every formal correction must have non-empty audit and conflict links.
- Every visual blocker must state student-facing status and a resolution owner/status.
- Pilot records must keep `canonicalGenerationAuthorized: false` until Claude re-review and user approval.
- No file below `docs/content-audits/chapter-01/` is modified by this amendment.
