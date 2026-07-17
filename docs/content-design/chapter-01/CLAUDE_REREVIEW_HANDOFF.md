# Claude Re-review Handoff — Missing Pilot-Topic Correction Records

## Scope

This is a verification-only handoff, narrower than the prior two re-review packages. It covers only the three new formal correction records (`ch01-corr-006`, `ch01-corr-007`, `ch01-corr-008`) added to fill the gap where `ch01-t03`, `ch01-t08`, and `ch01-t10` each had a `requiredScientificAuditIds` entry but no corresponding correction record.

Claude must not:

- generate canonical Chapter 1 content;
- generate the pilot topics;
- build the application;
- install packages;
- edit source-level audits or raw sources;
- reprocess or modify the Kahoot source (`SRC-CH01-KAHOOT-001`);
- stage, commit, or push.

## Exact reading order

### A. The new correction records and what they depend on

1. `docs/content-design/chapter-01/CANONICAL_DESIGN_SCHEMA.json` (updated — `$defs.correction` gained `equations`, `assumptionsAndSignConventions`, `affectedContentBlockTypes`, `glossaryTermIds`, `blocking`, `evidenceStatus`; `schemaVersion 2.2.0`)
2. `docs/content-design/chapter-01/DUPLICATE_AND_CONFLICT_DECISIONS.json` (updated — new `CD-CONF-006`/`007`/`008`; `decisionLayerVersion 1.1.0`)
3. `docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json` (updated — new `ch01-corr-006`/`007`/`008`; `correctionLayerVersion 1.1.0`)
4. `docs/content-design/chapter-01/IDENTIFIER_REGISTRY.json` (updated — `^K1-SCI-[0-9]{3}$` pattern added, `SRC-CH01-KAHOOT-001` added to `sourceIds`; `registryVersion 1.2.0`)
5. `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json` (unmodified — read to confirm `ch01-term-period`/`ch01-term-frequency` still match what `ch01-corr-006` links to)

### B. Minimal audit evidence needed to verify the three corrections

6. `docs/content-audits/chapter-01/scientific-audit.json` (unmodified — contains `SCA04`, `SCA05`, `SCA11`, `SCA12`)
7. `docs/content-audits/chapter-01/sources/source-003/scientific-audit.json` (unmodified — contains `S3-SCI-004`, `S3-SCI-005`)
8. `docs/content-audits/chapter-01/teaching-script-inventory.json` (unmodified — confirm `SEG019`/`SEG020` are the segments flagged `open:SCA04`/`open:SCA05`, `SEG037` is flagged `open:SCA12`, `SEG041` is flagged `open:SCA11`)
9. `docs/content-audits/chapter-01/sources/source-kahoot-001/scientific-audit.json` (unmodified — contains `K1-SCI-007` and `K1-SCI-009`, the two Kahoot findings cross-referenced from the new corrections)

### C. Consolidated record of the fix

10. `docs/content-design/chapter-01/CHAPTER_01_CANONICAL_DESIGN_AMENDMENTS.md` (updated — "Second blocker-resolution pass" section)
11. `docs/content-design/chapter-01/AMENDED_DESIGN_VALIDATION_REPORT.md` (updated — "Addendum 2")
12. `docs/content-design/chapter-01/PILOT_READINESS.json` (updated — `requiredCorrectionIds` populated for `ch01-t03`/`ch01-t08`/`ch01-t10`; `resolvedDesignBlockers.missingCorrectionRecordsForPilotTopics` added; `canonicalGenerationAuthorized` and every topic's `blockingStatus`/`blockingReason` unchanged)

No raw verbatim source is required for this verification, and no file under `docs/content-audits/chapter-01/sources/source-kahoot-001/` or `raw-sources/source-kahoot-001-*` was modified — those are read-only cross-reference evidence here.

## Verification questions

Claude should answer only these questions:

1. Does `ch01-corr-006` correctly and completely cover: period as time for one complete cycle, frequency as cycles per unit time, the requirement that the process repeat, `f = 1/T` and `T = 1/f`, and correct units (T in seconds, f in hertz)? Is it correctly linked to `ch01-t03`, `ch01-term-period`, `ch01-term-frequency`, `SCA04`, `SCA05`, and `CD-CONF-006`?
2. Does `ch01-corr-007` correctly and completely cover: the selected vertical-axis sign convention, the distinction between signed acceleration and the magnitude `|g|`, both `a = -g` (upward-positive) and `a = +g` (downward-positive) conventions, sign consistency across displacement/velocity/acceleration, and free-fall motion from rest? Is it correctly linked to `ch01-t08`, `SCA12`, `S3-SCI-004`, and `CD-CONF-007`?
3. Does `ch01-corr-008` correctly and completely cover: velocity tangent to the circular path, centripetal acceleration toward the center, velocity not directed inward, constant speed coexisting with changing velocity, and acceleration existing because velocity direction changes? Is it correctly linked to `ch01-t10`, `SCA11`, `S3-SCI-005`, and `CD-CONF-008`?
4. Does every new correction record contain all required fields: `correctionId`, `topicIds`, `sourceRecordIds` (inside `originalWording`), `scientificAuditRecordIds`, `conflictRecordIds`, original wording summary, proposed canonical wording, scientific rationale, `equations`, `assumptionsAndSignConventions`, `affectedContentBlockTypes`, `glossaryTermIds`, `approvalStatus`, reviewer fields (`approvals`), `studentFacingSuppression`, a `blocking` object (with `blockingStatus`/`resolutionStatus` inside it), and `evidenceStatus`?
5. Is the Kahoot linkage (`K1-SCI-007` on `ch01-corr-006`, `K1-SCI-009` on `ch01-corr-008`) accurate and does it represent genuinely relevant additional evidence rather than a forced/spurious reference? Is the absence of any Kahoot linkage on `ch01-corr-007` correct (i.e., does no Kahoot finding actually address acceleration sign convention)?
6. Do the schema, registry, and conflict-decision extensions needed to support these three records (new optional `correction` fields, `^K1-SCI-[0-9]{3}$` pattern, `CD-CONF-006`/`007`/`008`) leave the five pre-existing correction records, and everything verified in the two prior re-review passes, still valid and unchanged?
7. Did this pass leave `canonicalGenerationAuthorized` at `false` everywhere, leave every topic's `blockingStatus`/`blockingReason` unchanged (all three should still show `scientificCorrection` as an open blocking reason, since these corrections are proposed, not approved), leave rights/visual blockers untouched, and leave the Kahoot source completely unmodified?

## Required output

Return a human-readable verification with:

- pass/fail for each of the three new correction records against its required coverage;
- pass/fail for the required-fields completeness check;
- pass/fail for the Kahoot-linkage accuracy check;
- confirmation that no out-of-scope change occurred;
- a final decision: `approvedForPilotGenerationRequest` or `requiresDesignRevision`.

Stop after the verification. Do not generate pilot content.
