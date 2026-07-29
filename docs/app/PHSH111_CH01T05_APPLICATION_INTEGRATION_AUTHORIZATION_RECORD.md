# ch01-t05 internal application integration authorization

**Record ID:** `ch01-t05-application-integration-authorization-001`
**Date:** 2026-07-29
**Authorized by:** `khubrani2a-gif (project owner)`
**Status:** granted — internal integration and QA only

## Scope

This record authorizes the application to load the approved English and Arabic
`ch01-t05` baselines through direct immutable imports and one deterministic,
in-memory English/Arabic merge. It authorizes the topic type, numerical order,
generic navigation, raw-import wiring, optional visual-map handling, and tests.
It does not create a third editable content source.

The required inputs are the eight approved records in
`ENGLISH_CH01T05_BASELINE_APPROVAL.json` (SHA-256
`894e8c65d997dbf35aceed06ce30cdbc44077693b8aa0af395bcbe0350bb8374`) and
`ARABIC_CH01T05_BASELINE_APPROVAL.json` (SHA-256
`83d1d2cfd258c3c3c4ae9186f72c2412c5d507f885b4077a20e5719a485989fb`).

## No-visual decision

No educational visual is required for this internal integration. No
`ch01-t05-visual-001`, SVG, visual-validation record, or `visualReference`
record may be created. V10, Bolt material, and `ch01-corr-005` remain excluded:
the correction still requires evidence, and neither approved baseline uses that
material. The absence of a visual does not block internal integration.

## Restrictions

This does not authorize slides, `slideGroups.ts`, `slideShortTitles.ts`,
`StructuredSlideContent.tsx`, a new route pattern, student-facing use,
publication, or deployment. The Draft / Review Required indication remains
visible, and both `studentFacingAllowed` and `studentPublicationAuthorized`
remain `false`.
