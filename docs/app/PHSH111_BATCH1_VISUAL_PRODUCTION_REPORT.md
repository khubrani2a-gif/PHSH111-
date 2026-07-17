# PHSH111 Batch 1 — Visual Production Report

**Production date:** 2026-07-17. **Type:** Internal draft visual production only. These are internal draft visuals. This task does not authorize application integration, independent human approval, student-facing use, deployment, or publication.

## 1. Purpose and authorization basis

This report records the production of the two ratified Batch 1 visual assets — `ch01-t01-visual-001` (topic `ch01-t01`) and `ch01-t04-visual-001` (topic `ch01-t04`) — under `PILOT_AUTHORIZATION.json` v1.4.0's `batch1VisualProductionAuthorization` and `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_AUTHORIZATION_RECORD.md`. **This task produces internal draft visuals only.** It does not authorize application integration, independent human visual/scientific approval, student-facing use, deployment, or publication.

## 2. Dependencies verified

Independently re-verified immediately before production:

| Dependency | Verified value |
|---|---|
| `PILOT_AUTHORIZATION.json` version | `1.4.0` |
| Authorized visual IDs | Exactly `ch01-t01-visual-001`, `ch01-t04-visual-001` |
| `PILOT_READINESS.json` version | `1.10.0` |
| English Batch 1 baseline | `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`, `status: "approved"` |
| Arabic Batch 1 baseline | `ARABIC_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`, `status: "approved"` |
| English baseline file checksums | Both re-computed and confirmed identical to approved values |
| Arabic baseline file checksums | Both re-computed and confirmed identical to approved values |
| Visual production authorized | `true` (section-level and per-topic in `PILOT_READINESS.json`) |
| Independent human review | `false` — unauthorized |
| Student-facing use | `false` — unauthorized |
| Application integration | `false` — unauthorized |
| Publication | `false` — unauthorized |
| Conflicting existing Batch 1 visual asset | None — `docs/content-design/chapter-01/batch1-visuals/` did not exist before this task |

All dependencies were consistent; production proceeded.

## 3. Files created

- `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001.svg`
- `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001-validation.json`
- `docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001.svg`
- `docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001-validation.json`
- `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_REPORT.md` (this document)

No other file was created or modified.

## 4. `ch01-t01` visual concept and instructional purpose

An original schematic showing four labeled boxes for the fundamental quantities used in this chapter — Distance (L), Time (T), Mass (M), and Charge — with Charge drawn in a dashed border and visually set apart to show it is deferred, not excluded. Two arrows lead from Distance and Time into a "Speed (derived)" box showing `v = d / t`, illustrating that a derived quantity is built by combining fundamentals. A separate "Dimensional Notation" panel — added specifically to satisfy this task's own explicit requirement — distinguishes the dimensional symbols `L`/`T` (naming the type of quantity) from the measured-variable symbols `d`/`t` (the specific values in the equation), and states that speed's dimension is `L/T`. A legend clarifies the solid-versus-dashed border meaning without relying on color alone. Two bilingual captions restate `ch01-corr-001`'s scope statement and the derived-quantity definition. The composition (four boxes → two convergence arrows → a derived box + a side explanatory panel) is original and does not resemble any of the four pilot layouts.

## 5. `ch01-t01` scientific verification

Independently re-checked against the approved English/Arabic baseline and `ch01-corr-001`:

- Distance, time, and mass are labeled as fundamental **for this chapter's mechanics**, each tagged "this chapter," never implying they are the only fundamental quantities in all of physics — matches `ch01-corr-001` exactly.
- Charge is shown as a fourth fundamental property, tagged "later," visually deferred rather than excluded.
- Speed is shown built from Distance and Time via convergence arrows, never as an independent fundamental unit.
- `v = d / t` is shown with `d` as measured distance and `t` as elapsed time, matching the approved baseline's own variable definitions.
- `L`, `T` are explicitly distinguished from `d`, `t` as dimension names versus measured-variable symbols, with speed's dimension stated as `L/T` — satisfying this task's explicit scientific requirement.
- No instantaneous speed, no advanced dimensional analysis beyond naming `L`/`T`/`d`/`t`, and no adjacent-topic equation was introduced.

## 6. `ch01-t01` accessibility and readability checks

`role="img"` with a full `<title>`/`<desc>` pair is present. Measured WCAG contrast: primary text on white 17.85:1, secondary text on white 10.36:1, teal graphical elements on white 5.67:1 — all comfortably clear the 4.5:1 (text) / 3:1 (graphical) thresholds. Zero of 42 text elements fall outside the viewBox; zero are missing an explicit `direction` attribute. No color-alone dependency (border style + text tags carry the fundamental-vs-deferred distinction). Inspected at desktop, tablet, and mobile scale in a Chromium-based preview browser: no overlap or clipping found at any scale; mobile text becomes small at 375px width, an accepted, documented risk matching the four pilot visuals' own precedent, not attempted to be fixed here.

## 7. `ch01-t04` visual concept and instructional purpose

An original schematic with three side-by-side panels — Push, Lift, Scale — each showing the same original equipment-cart icon (an invented rectangle-plus-two-circles silhouette, not sourced from any icon library or photograph). Push reveals mass (inertia); Lift reveals gravitational weight, shown via a downward brick-red force arrow labeled `W = mg`; Scale reveals apparent weight via an original schematic scale icon, with an explicit caption that this equals gravitational weight only at rest. A legend distinguishes force (brick-red arrows) from structure (teal), and a central equation panel restates `W = mg` with its units. Two bilingual captions preserve `ch01-corr-002`'s recorded qualification about "apparent weight" and the mass/location-independence versus weight/location-dependence distinction. The three-panel push/lift/scale composition around one recurring original object is original and does not resemble any of the four pilot layouts.

## 8. `ch01-t04` scientific verification

Independently re-checked against the approved English/Arabic baseline and `ch01-corr-002`:

- Mass and gravitational weight are shown as distinct quantities via two separate panels and result tags.
- Gravitational weight is explicitly a force, shown via `W = mg` directly on the weight arrow.
- Apparent weight is shown as the scale's support-force reading, explicitly captioned as equal to gravitational weight **only at rest**, preserving the required non-automatic-equivalence distinction.
- "Normal force" is not introduced as a term anywhere — confirmed by direct text search, matching the approved baseline's own restraint (the term never appears in either baseline file).
- No elevator equation, non-inertial-frame derivation, or content absent from the baseline was introduced.

## 9. Apparent-weight representation review

الوزن الظاهري is used as the sole primary Arabic rendering, exactly matching `BILINGUAL_GLOSSARY.json` v1.3.0's approved term. قراءة الميزان is not used as a separate on-canvas label (conveyed instead through the panel action and caption, consistent with the glossary's own treatment of it as a supporting gloss, not a required alternate label). الوزن الحقيقي does not appear anywhere in the file — confirmed by direct text search. The clarifying caption directly preserves `ch01-corr-002`'s recorded qualification that "apparent weight" is project-authored interpretive terminology, not verbatim source wording, and states plainly that apparent weight is a real, measurable quantity.

## 10. `ch01-t04` accessibility and readability checks

`role="img"` with a full `<title>`/`<desc>` pair is present. Measured WCAG contrast: primary text on white 17.85:1, secondary text on white 10.36:1, teal on white 5.67:1, the new brick-red force color on white 6.47:1 — all clear the required thresholds. Zero of 36 text elements fall outside the viewBox; zero missing `direction`. Force-versus-structure is distinguished by legend shape/label in addition to color, not by color alone. Inspected at desktop, tablet, and mobile scale: one overlap defect was found (see §12) and corrected; after correction, no overlap or clipping remains at any scale; the same accepted mobile-legibility risk applies, undeferred, matching pilot precedent.

## 11. Originality and rights-safety review

Both assets are fully original artwork. No publisher slide, textbook page, review card, or Kahoot-derived image was traced, cropped, referenced, or used as a compositional basis for either asset — independently re-confirmed by direct comparison against every cataloged source visual referenced in each topic's audit records, and against all four existing pilot SVGs (neither composition resembles or reuses any pilot layout). The `ch01-t04` cart and scale icons are invented, simple geometric constructions, not sourced from any icon set or photograph, and deliberately depict a different object (an equipment cart) than any audited source's own illustration (a suitcase). All on-canvas text is either newly authored or a concise, faithful rendering of already rights-cleared Batch 1 baseline content — no publisher wording appears anywhere in either file.

## 12. SVG/XML validation

Both files independently re-parsed with Python's `xml.etree.ElementTree`: exactly one root `<svg>` element each, well-formed throughout. Zero duplicate element IDs in either file. All `url(#...)` marker references resolve (one each: `arrowSlateT01`, `arrowForceT04`); zero unresolved references. Zero `<image>`, base64, `<script>`, or external stylesheet/font references in either file. **One defect was found and corrected during production**: `ch01-t04-visual-001.svg`'s Lift panel initially included a small motion-indicator arrow and "(lifted)" label that overlapped the panel's own header text. Both were removed (the lifting action was already redundantly conveyed by the panel header and caption), and the resulting unreferenced `arrowSlateT04` marker definition was removed from `<defs>`. Full technical re-validation after the fix confirmed the defect was resolved with no new issue introduced; the checksums recorded in both files' validation records are the final, post-correction values.

## 13. Label, equation, and bidi validation

Every text element in both files carries an explicit `direction` attribute (`ltr` or `rtl`) — programmatically confirmed zero omissions across 42 (`ch01-t01`) and 36 (`ch01-t04`) text elements. English and Arabic are always separate `<text>` elements; no script-mixing within a single text run. Every equation/formula fragment (`v = d / t`, `L/T`, `W = mg`, unit symbols) is isolated in its own text element or `tspan`, never interleaved with Arabic prose. Single-letter variables (`v`, `d`, `t`, `L`, `T`, `M`, `W`, `m`, `g`) are italic; SI unit symbols (`N`, `kg`, `m/s²`) stay upright. Arrow directions were independently verified against their intended physical meaning: `ch01-t01`'s convergence arrows point from Distance/Time downward into the Speed box (correct "combines into" direction); `ch01-t04`'s push arrow points rightward into the cart (correct push direction), the weight arrow points downward from the cart (correct gravity direction), and the support arrow points upward from the scale into the cart (correct support-force direction) — no equation or arrow is reversed. Arabic glyph rendering (cursive joining, correct RTL order) was visually confirmed in a Chromium-based preview browser for both files, including every bilingual caption, legend, and panel label.

## 14. Mobile, desktop, and projector inspection

Both SVGs were rendered via a temporary local static-file server and inspected in the Browser pane's Chromium-based preview at desktop (1100×1000), tablet (768×1024), and mobile (375×812) viewport presets. At desktop scale, both diagrams render fully legibly with no overlap or clipping (confirmed by full-page screenshots). At mobile scale, both diagrams scale down proportionally with all content visible but with the smallest text (10.5–11px source elements) becoming the least legible — the same already-documented, accepted mobile-size risk recorded in every one of the four pilot visuals' own validation records; per this task's explicit instruction, no compressed mobile-specific variant was attempted. At the tablet-preset viewport, the standalone SVG document was displayed at native pixel size by the browser's default document-scaling behavior (rather than scaled to fit, unlike the mobile preset's viewport emulation) and appeared cropped at the right edge — this is a standalone-file-viewing artifact of the preview tool's per-preset viewport/scaling emulation, not a defect in either SVG's own canvas (independently confirmed: zero text elements fall outside either file's own viewBox, and the full canvas renders cleanly when the browser window is sized to accommodate the asset's native width, as demonstrated in the desktop-scale inspection). No temporary PNG files were retained; both SVGs were inspected as rendered HTML/SVG in the browser, not converted to raster for comparison.

## 15. Validation-record summary

Both `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001-validation.json` and `ch01-t04-visual-001-validation.json` were created following the exact top-level structure and field shape of the four pilot topics' own validation records (`visualResolutionId`, `visualId`, `topicIds`, `assetPath`, `assetFormat`, `assetStatus`, `createdBasis`, `sourceIndependenceStatement`, `houseStyleNote`, `validation` sub-object, `requirementsChecklist`, `revisionHistory`, `readyForHumanReview`/`readyForHumanReviewNote`, `studentFacingAllowed`, `studentPublicationAuthorized`, `reviewer`, `reviewedAt`), extended with the additional fields this task explicitly required (`fileChecksumSha256`, `xmlValidity`, `viewBoxAndDimensions`, `expectedLabels`, `equationAndSymbolIntegrity`, `englishLabelIntegrity`, `arabicLabelAndBidiIntegrity`, `contrastMeasurement`, `textSizeAndReadability`, `overlapAndClipping`, `zoomReadability`, `mobileReadability`, `projectorReadability`, `grayscaleNonColorDependency`, `accessibilityMetadata`, `externalDependencyAbsence`, `rasterContentAbsence`, `rightsSafeOriginality`, and — for `ch01-t04` specifically — `apparentWeightRepresentationReview`). No incompatible field was invented; every addition follows the same naming and status-value pattern (`"status": "pass"` / `"documentedNotAttemptedToFix"`, with a `findings` array) already established by the pilot precedent.

## 16. Baseline immutability verification

Independently re-checksummed after all production and correction work: both English Batch 1 baseline files (`a445f55d...`, `c876a6fe...`) and both Arabic Batch 1 baseline files (`3955df75...`, `d1f5bfbd...`) remain byte-identical to their approved values. `ENGLISH_BATCH1_BASELINE_APPROVAL.json` and `ARABIC_BATCH1_BASELINE_APPROVAL.json` both remain `baselineVersion: "1.0.0"`, `status: "approved"`, unmodified. `BILINGUAL_GLOSSARY.json` remains `glossaryVersion: "1.3.0"`. `IDENTIFIER_REGISTRY.json` remains `registryVersion: "1.2.0"` — no identifier was registered. `SCIENTIFIC_CORRECTIONS.json` remains at its existing version, unmodified. All four pilot SVG assets and their validation records were read only, never modified. `PILOT_AUTHORIZATION.json` (v1.4.0) and `PILOT_READINESS.json` (v1.10.0) were read only during this production task, not modified.

## 17. Remaining visual concerns

- **Mobile/small-screen legibility** remains an open, undeferred risk for both assets, identical in kind to the same risk already documented and left unresolved for all four pilot visuals — resolving it requires a future responsive/zoom delivery mechanism, not a change to either asset itself.
- **No cross-browser or cross-renderer verification** (beyond the single Chromium-based preview browser used during this task) has been performed for either asset's Arabic glyph shaping or general rendering fidelity — the same open item already carried forward by every pilot visual's own validation record.
- **The new brick-red "Force" color** (`#b91c1c`), introduced for `ch01-t04`, is offered as a candidate house-style extension (documented in that asset's `houseStyleNote`), consistent with how `ch01-t08` originally introduced violet — a human reviewer may wish to formally ratify or adjust this addition in `VISUAL_HOUSE_STYLE.md` as part of a future style-guide update, which this task does not perform.
- **`m/s²`'s true-Unicode-superscript rendering** in `ch01-t04`'s compact unit gloss (rather than a nested-`tspan` true superscript, as used in the pilot's own larger equation displays) is a minor, deliberate simplification for a short inline label; noted for a human reviewer's own judgment, not treated as a defect.

## 18. Independent-review status

**Incomplete, unclaimed.** No independent human visual or scientific expert has reviewed either asset. Both validation records explicitly carry `reviewer: null` and `reviewedAt: null`. This report's own scientific, accessibility, and rights-safety findings are Claude's own self-review under the project owner's existing visual-production authorization — not independent third-party expert review, and not represented as such anywhere in this document.

## 19. Application-integration status

**Unauthorized, unaffected.** No route, registry entry, or import was added anywhere. `apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` remains exactly the original four pilot topics, untouched. No application file was read for modification or changed. Both validation records explicitly carry `applicationIntegrationAuthorized: false`.

## 20. Publication status

**Unauthorized, unaffected.** `studentFacingAllowed` and `studentPublicationAuthorized` are explicitly `false` in both validation records and remain `false` chapter-wide in `PILOT_READINESS.json`. Both assets remain `draft`, `blockingStatus`-equivalent "blocked," and are not marked ready for students, independently approved, baseline approved, application approved, or publication approved anywhere.

## 21. Exact next controlled task

**A read-only, human-oriented visual review and decision brief for both SVGs** — summarizing this report's findings for the project owner's own review, surfacing the remaining concerns in §17, and recommending (without performing) a decision on whether either asset is ready for a future visual-baseline-approval action, mirroring the same review-then-approve pattern already used for the English and Arabic Batch 1 content baselines. **This task does not perform application integration, and no future task should treat this production report, by itself, as authorizing it.**

---

### Explicit statements

- **These are internal draft visuals only.**
- **The approved English and Arabic baseline files were not modified** — checksums confirmed byte-identical before and after production.
- **No application integration occurred.**
- **No independent human approval occurred.**
- **Publication remains unauthorized.**
