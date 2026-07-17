# Instructor-Script Field Validation (Blocker 1)

## Scope and boundary

This document verifies all 59 records in `docs/content-audits/chapter-01/teaching-script-inventory.json` (source-level, unmodified) against `instructorScript` in `CANONICAL_DESIGN_SCHEMA.json` (schemaVersion 2.1.0). It resolves only the instructorScript blocker named in the Claude amended-design re-review. It does not generate canonical content, does not modify the source-level inventory, and does not authorize pilot generation.

## Source field shape

Every one of the 59 records (`TS001`–`TS059`) uses the same 22 fields: `scriptId`, `segmentId`, `topicId`, `slideReference`, `openingHook`, `mainIdea`, `narrationSequence`, `teacherQuestions`, `expectedResponses`, `plannedPauses`, `intuition`, `analogies`, `misconceptions`, `visualGuidance`, `graphGuidance`, `tableGuidance`, `levelAdaptations`, `transition`, `language`, `scientificReviewStatus`, `rightsStatus`, `preservationStatus`. This was confirmed by reading the full file, not a sample.

## Schema change made

Added to `$defs.instructorScript` in `CANONICAL_DESIGN_SCHEMA.json` (now required, alongside the existing fields):

- `mainIdea` (`localizedText`)
- `intuition` (`localizedText`)
- `graphGuidance` (array of strings)
- `tableGuidance` (array of strings)
- `levelAdaptations` (array of strings)

`schemaVersion` bumped `2.0.0` → `2.1.0`. `additionalProperties: false` is unchanged, so these five fields are now the only way to carry this content — no fallback to unschematized properties.

## Validation table — all 22 source fields

| # | Source field | Canonical field | Mapping status | Loss risk | Resolution |
|---|---|---|---|---|---|
| 1 | `scriptId` | `instructorScriptId` | Direct (reformat `TS0NN` → `ch01-is-0NN`) | None | No schema change needed; renumbering happens at instantiation time |
| 2 | `segmentId` | `sourceTraceability[].locatorId` (provenance link, `sourceId: SRC-CH01-CONV-001`) | Direct | None | No schema change needed |
| 3 | `topicId` | `topicIds` (singular → array) | Direct | None | No schema change needed |
| 4 | `slideReference` | `slidePageCues[].instruction` | Partial | Medium — source values are informal (e.g. `"inferred: chapter opening"`), not confirmed PDF-003 page IDs | **Not part of this blocker.** Store as free-text `instruction`; leave `pageIds` empty until cross-checked against `sources/source-003/page-inventory.json`. Flagging for a future pass, not fixing now. |
| 5 | `openingHook` | `openingHook` | Direct | None | Existing field, exact match |
| 6 | `mainIdea` | `mainIdea` **(new)** | Resolved this session | Was high, now none | Field added |
| 7 | `narrationSequence` | `wordForWordTeachingScript` | Partial | Medium — `narrationSequence` is an ordered list of short narrative beats (e.g. `["apparent rest","Earth and solar motion","chapter question sequence"]`), not literal word-for-word prose; collapsing into one `localizedText` blob loses the beat boundaries | **Not part of this blocker.** Future canonical authoring must expand each beat in order inside the single text field, not skip any; the ordering itself is not separately preserved by the current schema. Flagging for a future pass. |
| 8 | `teacherQuestions` | `questionsToAskStudents` | Direct | None | Existing field |
| 9 | `expectedResponses` | `expectedStudentResponses` | Direct | None | Existing field |
| 10 | `plannedPauses` | `timing.pauseCues` | Direct | None | Existing field |
| 11 | `intuition` | `intuition` **(new)** | Resolved this session | Was high, now none | Field added |
| 12 | `analogies` | `analogies` | Direct | None | Existing field |
| 13 | `misconceptions` | `misconceptionsToAnticipate` | Direct | None | Existing field |
| 14 | `visualGuidance` | `figureCues[].instruction` | Partial | Medium — guidance is often free text (e.g. `"Point to the opening image"`) with no resolvable `visualId` | **Not part of this blocker.** Store as `instruction` text; `visualIds` stays empty until `VISUAL_RESOLUTION_PLAN.json` confirms an asset. Never fabricate a `visualId`. Flagging for a future pass. |
| 15 | `graphGuidance` | `graphGuidance` **(new)** | Resolved this session | Was high, now none | Field added |
| 16 | `tableGuidance` | `tableGuidance` **(new)** | Resolved this session | Was high, now none | Field added |
| 17 | `levelAdaptations` | `levelAdaptations` **(new)** | Resolved this session | Was high, now none | Field added |
| 18 | `transition` | `transitions[].script` | Partial | Low — source `transition` is one string with no explicit `targetTopicId` | **Not part of this blocker.** `targetTopicId` must be filled in by a canonical editor from the topic order, not auto-inferred. Flagging for a future pass. |
| 19 | `language` | Each `localizedText`'s own `language` attribute | Direct | None | Existing field shape already carries this |
| 20 | `scientificReviewStatus` | `scientificCorrectionReferences` | Direct, parseable | Low | Parse `"open:SCA01"` → `["SCA01"]`; `"open:SCA12,SCA13"` → `["SCA12","SCA13"]`; `"notFlagged"` → `[]` |
| 21 | `rightsStatus` | `blocking.blockingReason` (must include `"rightsPending"`) | Indirect | None (value is uniformly `"reviewRequired"` across all 59 records) | Every instantiated instructorScript record's `blocking.blockingReason` must include `"rightsPending"` until source-layer rights review completes |
| 22 | `preservationStatus` | No direct equivalent; closest is `duplicateHandling.canonicalPreferenceStatus`, which is not the same concept | Partial | Medium — values (`preserveMetadataThenRewrite`, `rewriteExample`, `mergeAndRewrite`, `canonicalEnglishExplanation`, `canonicalGeneralDerivation`, `preserveAfterCorrection`, `mergeWithTS0NN`) are an authoring-workflow directive, not a duplicate-resolution decision | **Not part of this blocker.** Content is not lost — it stays intact, unmodified, in the source-level inventory, which any canonical author must consult directly. Flagging for a future pass rather than adding a field now, since only the five named fields were authorized for this fix. |

## Result

The five fields explicitly named in the blocker (`mainIdea`, `intuition`, `graphGuidance`, `tableGuidance`, `levelAdaptations`) are now present in the schema, required, and typed to match the source shape exactly (localized text for the two prose fields, string arrays for the three list fields). All 59 records' content in those five fields can now be carried into a canonical `instructorScript` record without loss.

Five other fields (`slideReference`, `narrationSequence`, `visualGuidance`, `transition`, `preservationStatus`) have only **partial** mappings with medium-or-lower loss risk. These were not named in the re-review's blocker list and are out of scope for this fix — they're documented here for future authorization, not resolved now, per the instruction to apply only the three identified blockers.
