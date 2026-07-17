# Chapter 1 Amended Canonical Design — Validation Report

## Result

**Pass for Claude amendment re-review.** The amended design layer is internally consistent at the structural and linkage level. It does not authorize canonical generation or student publication.

## Files created

1. `CHAPTER_01_CANONICAL_DESIGN_AMENDMENTS.md`
2. `CANONICAL_DESIGN_SCHEMA.json`
3. `IDENTIFIER_REGISTRY.json`
4. `DUPLICATE_AND_CONFLICT_DECISIONS.json`
5. `SCIENTIFIC_CORRECTIONS.json`
6. `BILINGUAL_GLOSSARY.json`
7. `VISUAL_RESOLUTION_PLAN.json`
8. `PILOT_READINESS.json`
9. `CLAUDE_REREVIEW_HANDOFF.md`
10. `AMENDED_DESIGN_VALIDATION_REPORT.md`

## File updated

- `CHAPTER_01_CANONICAL_STRUCTURE_PROPOSAL.md`

The proposal now recognizes the amendment authority, references the complete instructor-script schema, separates Arabic fields, adds duplicate and multi-source problem handling, links corrections to conflicts, adds the five missing correction families, corrects the `ch01-t08` readiness note, and replaces the completed 57-file audit handoff with the minimal 21-file re-review package.

## Validation checks

| Check | Result |
|---|---|
| All design-layer JSON files parse | Pass |
| Required `instructorScript` fields present | Pass: 17 required pedagogical/traceability groups plus governance fields |
| Duplicate/preference fields present | Pass: 7 required fields |
| Arabic separation fields present | Pass: 5 required fields plus glossary and preference links |
| Blocking workflow fields present | Pass: 8 required fields |
| Multi-source problem variant support | Pass |
| Unified identifier namespaces | Pass: 13 namespaces, 6 registered sources, 14 topics |
| Bilingual starter glossary | Pass: 16 requested terms |
| Formal added corrections | Pass: 5 records |
| Every formal correction has audit links | Pass: 0 empty audit-link arrays |
| Every formal correction has conflict links | Pass: 0 empty conflict-link arrays |
| Every formal correction suppresses unapproved student content | Pass |
| Design conflict decisions retain historical trace | Pass: 5 of 5 |
| Visual-remediation records | Pass: 4 records |
| Each visual record includes source-page possibility, recoverability, redraw decision, scientific dependency, and student block | Pass |
| Pilot topics | Pass: exactly `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10` |
| Pilot generation authorization | Pass: false globally and for every topic |
| Linked audit/source/conflict identifiers resolve in current audit/design files | Pass |
| Visual availability and linkage confidence separated | Pass |
| Original review-card and solved-review references supported in parallel | Pass |
| Quiz-seed status represented without claiming Kahoot readiness | Pass |
| Formatting-preference and bilingual-rule linkage supported | Pass |
| Audit-classification/severity crosswalk present | Pass |
| Claude re-review paths exist | Pass: 26 of 26 |

## Intentional pending states

- Glossary Arabic terms are proposed terminology candidates with `approvalStatus: pending`; they are not treated as approved translations.
- No missing Arabic paragraph or teaching script was generated.
- The Bolt correction records the accepted event/time pairs but remains `needsEvidence` until the final primary citation and reviewers are recorded.
- Figure 1.13 remains a candidate match only.
- The elevator graph and Figure 1.40 remain unavailable from current sources.
- The 31 Source 002 attachment placeholders remain unresolved; they occur across 14 preserved segments.
- JSON Schema was structurally checked and parsed, but no canonical content instance was validated because canonical generation is still prohibited.

## Source-layer protection

No file under `docs/content-audits/chapter-01/` was edited as part of this amendment. No raw source was merged, rewritten, translated, or replaced.

## Operational protection

- No application was built.
- No package was installed.
- No canonical or pilot content was generated.
- No files were staged.
- No commit or push was performed.

## Next allowed action

Provide the focused 26-file package in `CLAUDE_REREVIEW_HANDOFF.md` to Claude for a design amendment re-review. Pilot generation remains blocked until Claude returns `approvedForPilotGenerationRequest` and the user explicitly authorizes the pilot.

## Addendum: Claude re-review outcome and blocker resolution

Claude's actual re-review of the 26-file package returned `requiresDesignRevision`, not `approvedForPilotGenerationRequest`, citing three concrete blockers:

1. Five `instructorScript` fields (`mainIdea`, `intuition`, `graphGuidance`, `tableGuidance`, `levelAdaptations`) present across all 59 teaching-script records had no schema counterpart and would have been silently dropped under `additionalProperties: false`.
2. `IDENTIFIER_REGISTRY.json`'s `conflict` namespace had no pattern matching the existing audit-layer `C01`–`C04` IDs.
3. `BILINGUAL_GLOSSARY.json` omitted `period` and `frequency` terms despite `ch01-t03` (a pilot topic) carrying two open corrections (`SCA04`, `SCA05`) specifically about period/frequency wording.

All three are now resolved:

| Check | Result |
|---|---|
| All 59 teaching-script records' fields mapped against `instructorScript` schema | Pass: full 22-field validation table in `INSTRUCTOR_SCRIPT_FIELD_VALIDATION.md` |
| Five named fields added to schema, required, correctly typed | Pass: `mainIdea`/`intuition` as `localizedText`, `graphGuidance`/`tableGuidance`/`levelAdaptations` as string arrays |
| `schemaVersion` incremented to reflect the schema change | Pass: `2.0.0` → `2.1.0` |
| `C01`–`C04` match exactly one namespace pattern | Pass: `^C[0-9]{2}$` added; verified programmatically against 61 sampled real IDs across all 13 namespaces with no collisions |
| `registryVersion` incremented | Pass: `1.0.0` → `1.1.0` |
| `ch01-term-period` and `ch01-term-frequency` added with full required field set | Pass: both include English/Arabic-pending/alternates/definition/usage notes/discouraged translations/source references/approval status, linked to `ch01-t03`, `SCA04`, `SCA05` |
| `studentFacingAllowed: false` preserved | Pass: unchanged at the glossary root |
| `glossaryVersion` incremented | Pass: `1.0.0` → `1.1.0` |
| No file under `docs/content-audits/chapter-01/` modified | Pass |
| No scientific correction approved, no rights/visual blocker resolved, no topic `blockingStatus` changed | Pass: `PILOT_READINESS.json` records the fix under `resolvedDesignBlockers` only |
| `canonicalGenerationAuthorized` unchanged | Pass: remains `false` globally and per topic |
| No canonical or pilot content generated | Pass |
| No package installed, no application built, nothing staged/committed/pushed | Pass |

Five additional partial-mapping items surfaced during the full 22-field validation (`slideReference`, `narrationSequence`, `visualGuidance`, `transition`, `preservationStatus`) are documented in `INSTRUCTOR_SCRIPT_FIELD_VALIDATION.md` as medium-or-lower loss risk. They were not named in Claude's blocker list and are explicitly left unresolved pending separate authorization.

### Next allowed action (updated)

Provide the focused re-review package in the updated `CLAUDE_REREVIEW_HANDOFF.md` to Claude to verify these three specific fixes. Pilot generation remains blocked until Claude returns `approvedForPilotGenerationRequest` and the user explicitly authorizes the pilot.

## Addendum 2: missing pilot-topic correction records

`ch01-t03`, `ch01-t08`, and `ch01-t10` each had a `requiredScientificAuditIds` entry with no corresponding `ch01-corr-XXX` record — a gap noted during the focused verification pass but out of scope for it at the time. This pass adds the three missing records.

| Check | Result |
|---|---|
| `ch01-corr-006` covers period as time for one complete cycle, frequency as cycles per unit time, `f = 1/T`/`T = 1/f`, correct units (s, Hz) | Pass |
| `ch01-corr-007` covers axis sign convention, `\|g\|` vs. signed acceleration, `a = -g`/`a = +g` conventions, sign consistency across displacement/velocity/acceleration, free-fall from rest | Pass |
| `ch01-corr-008` covers tangent velocity, inward centripetal acceleration, constant speed vs. constant velocity | Pass |
| Every new correction has non-empty `scientificAuditRecordIds` | Pass: `["SCA04","SCA05","K1-SCI-007"]`, `["SCA12","S3-SCI-004"]`, `["SCA11","S3-SCI-005","K1-SCI-009"]` |
| Every new correction has non-empty `conflictRecordIds` | Pass: `CD-CONF-006`/`007`/`008`, newly added to `DUPLICATE_AND_CONFLICT_DECISIONS.json` |
| All required fields present (`correctionId`, `topicIds`, source/audit/conflict IDs, original/corrected wording, rationale, equations, assumptions/sign conventions, affected block types, glossary links, approval status, reviewer fields, `studentFacingSuppression`, blocking object, `evidenceStatus`) | Pass |
| Schema extended to formally support the new fields (`equations`, `assumptionsAndSignConventions`, `affectedContentBlockTypes`, `glossaryTermIds`, `blocking`, `evidenceStatus`) | Pass: `CANONICAL_DESIGN_SCHEMA.json` `2.1.0` → `2.2.0`; new fields are optional, not required, so the five pre-existing corrections remain valid |
| Identifier registry recognizes `K1-SCI-*` | Pass: `^K1-SCI-[0-9]{3}$` added; `IDENTIFIER_REGISTRY.json` `1.1.0` → `1.2.0` |
| Kahoot linkage present where evidence applies, absent where it doesn't | Pass: `K1-SCI-007` (period/frequency, corroborating gap note) linked to `ch01-corr-006`; `K1-SCI-009` (centripetal positive-contrast) linked to `ch01-corr-008`; no Kahoot finding exists for acceleration-sign-convention, so `ch01-corr-007` correctly has none |
| Kahoot source not reprocessed or modified | Pass: no file under `sources/source-kahoot-001/` or `raw-sources/source-kahoot-001-*` touched |
| `PILOT_READINESS.json` `requiredCorrectionIds` updated for all three topics | Pass |
| `canonicalGenerationAuthorized` unchanged (global and per-topic) | Pass: still `false` everywhere |
| Every topic's `blockingStatus`/`blockingReason` unchanged | Pass: all three remain `blocked` with `scientificCorrection` still listed, since `approvalStatus: "proposed"` on all three new corrections means none is actually approved yet |
| No source-level audit record modified | Pass |
| No canonical or pilot content generated, no application built, no package installed, nothing staged/committed/pushed | Pass |

### Next allowed action (updated again)

Provide the focused re-review package in the updated `CLAUDE_REREVIEW_HANDOFF.md` to Claude to verify these three new correction records specifically. Pilot generation remains blocked until Claude returns `approvedForPilotGenerationRequest` and the user explicitly authorizes the pilot — and, separately, until a human scientific/editorial reviewer actually approves `ch01-corr-006`/`007`/`008` (this pass only creates the records; it does not approve them).
