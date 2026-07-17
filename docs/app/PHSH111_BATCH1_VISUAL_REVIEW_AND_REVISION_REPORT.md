# PHSH111 Batch 1 — Visual Review and Revision Report

**Review date:** 2026-07-17. **Type:** Consolidated visual review, with only clearly necessary draft-level revisions applied. **This task does not approve either visual.**

## 1. Files reviewed and modified

**Read:** `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_REPORT.md`, `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_AUTHORIZATION_RECORD.md`, `docs/content-design/chapter-01/VISUAL_HOUSE_STYLE.md`, both approved English and Arabic Batch 1 topic files, both baseline approval records, and all four pilot SVGs and validation records as technical precedents.

**Modified:**
- `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001.svg` — revised (see §4)
- `docs/content-design/chapter-01/batch1-visuals/ch01-t01-visual-001-validation.json` — updated (new checksum, revision history, expanded findings)
- `docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001-validation.json` — updated (review-pass entry added; checksum unchanged)

**Not modified:** `docs/content-design/chapter-01/batch1-visuals/ch01-t04-visual-001.svg` — reviewed in full; no defect found requiring correction.

**Created:** `docs/app/PHSH111_BATCH1_VISUAL_REVIEW_AND_REVISION_REPORT.md` (this document).

## 2. `ch01-t01` findings

| Checklist item | Finding |
|---|---|
| "Length / L" vs. "Distance / L" | **"Distance" is correct; no change.** The approved English baseline itself pairs "distance (symbol L)" verbatim in `ch01-t01-block-explanation` — this is not a diagram-level choice but a direct mirror of the source's own naming. Changing to "Length" would introduce terminology absent from the approved baseline. |
| Distance as a measured quantity with dimension L | **Correctly represented; no change.** Box 1 shows `L` as the fundamental-quantity/dimension symbol; the separate Dimensional Notation panel explicitly clarifies that `d` (not `L`) is the measured-variable symbol used in `v = d/t`. This phased presentation (symbol first, measured-variable distinction later) mirrors the approved baseline's own structure. |
| "Charge — deferred" | **Fully supported; no change.** `ch01-corr-001`'s approved wording states "Charge is another fundamental property used later in the course" — this directly requires the deferred-not-excluded treatment already shown (dashed border, "later" tag). Removing it would be a regression against the approved correction's own purpose. |
| Mass/M in scope | **Confirmed in scope; no change.** The approved baseline's `mainIdea` explicitly lists "three fundamental quantities are used throughout: distance, time, and mass," and `ch01-corr-001` names all three together. |
| Speed shown as a derived **scalar** quantity | **Gap found and corrected.** "Derived" was already shown; "scalar" was not represented anywhere in the visual, despite the approved baseline explicitly stating "v is speed (a scalar quantity — magnitude only, with no direction attached)." See §4. |
| L/T vs. d/t distinction | **Already clearly shown; no change.** The Dimensional Notation panel explicitly states this distinction in both languages. |
| v = d/t identified as **average** speed | **Gap found and corrected.** The approved baseline explicitly states "this relationship gives the average speed over the specified distance and time interval"; the visual never stated "average" anywhere. See §4. |
| No advanced/adjacent-topic content | **Confirmed clean; no change.** No acceleration, vectors, or unit-conversion content appears anywhere. |

## 3. `ch01-t04` findings

| Checklist item | Finding |
|---|---|
| "Mass/Inertia" fully supported | **Confirmed; no change.** Matches the approved `mainIdea` ("Mass measures an object's inertia — its resistance to a change in motion") almost verbatim. |
| Mass / gravitational weight / support force / scale reading / apparent weight visually distinct | **Confirmed correct as three (not five) visually distinct concepts.** Mass and gravitational weight each get their own panel. Support force, scale reading, and apparent weight are correctly treated as **the same concept** shown once (not three separate ideas) — this matches the approved baseline's own definition of apparent weight as "the support force indicated by a scale," so conflating them into one labeled arrow is scientifically correct, not an omission. |
| W = mg connected only to gravitational weight | **Confirmed correct; no change.** `W = mg` appears only inline on the Lift panel's weight arrow and in the central equation panel, which is positioned directly under Panel 2's own centerline (x=500) — not equidistant under all three panels — reinforcing the connection to gravitational weight specifically. |
| Scale panel avoids implying automatic equivalence | **Confirmed correct; no change.** The explicit caption "= gravitational weight at rest only" / "= الوزن الجذبي عند السكون فقط" already states the required qualification. |
| Force-arrow directions and labels | **Confirmed correct; no change.** Push arrow points right into the cart; weight arrow points down from the cart; support arrow points up from the scale into the cart — all independently re-verified against their intended physical meaning. |
| No elevator/non-inertial-frame content | **Confirmed clean; no change.** |

**No revision was required for `ch01-t04-visual-001.svg`.** This finding, and the specific checks performed, are recorded in that asset's own validation record (rev-002 entry) for parity and auditability, without altering the file itself.

## 4. Exact revisions applied

**`ch01-t01-visual-001.svg` only**, via `ch01-t01-visual-001-rev-002`:

1. Added a bilingual scalar-quantity qualifier to the Speed (derived) box: *"(scalar — magnitude only)" / "(كمية قياسية — مقدار فقط)"* — restating the approved baseline's own wording, not introducing a new claim.
2. Added a bilingual average-speed qualifier: *"Average, over the stated interval" / "متوسطة، خلال الفترة المحددة"* — likewise restating already-approved content.
3. Enlarged the Speed box (220×200 → 220×260) and the overall canvas (1000×750 → 1000×820) to fit the two new lines without crowding; shifted the legend, both captions, and the footer band downward by a consistent margin, preserving the asset's existing spacing rhythm.
4. **House-style consistency fix:** corrected the Speed box's decorative "shadow" rectangle, which had an incorrect height (20px instead of matching the box) and was consequently entirely hidden behind the opaque main box, achieving no visible effect. It now matches the box's new dimensions, offset +4/+5, mirroring the already-correctly-implemented pattern used by this same asset's own Dimensional Notation panel and by `ch01-t04-visual-001`'s equation panel.
5. Updated the `<desc>` accessibility text to mention both new qualifiers, so screen-reader users receive the same information sighted viewers now get.
6. No other element — the four quantity boxes, convergence arrows, Dimensional Notation panel, captions, or footer wording — was changed.

Both additions restate content already explicit in the approved English/Arabic baseline text (`ch01-t01-block-equations`); **no new scientific content, concept, or claim was introduced.**

## 5. Equation and bidi findings

Both files re-inspected after all changes: every equation/formula fragment (`v = d / t`, `L/T`, `W = mg`, unit symbols) remains isolated in its own text element or `tspan`, never interleaved with Arabic prose. Single-letter variables remain italic; unit symbols remain upright. All force-arrow and connector-arrow directions were independently re-verified physically correct (none reversed). Every text element in both files carries an explicit `direction` attribute — programmatically re-confirmed: 0 of 46 (`ch01-t01`, post-revision) and 0 of 36 (`ch01-t04`, unchanged) text elements missing this attribute. Arabic glyph rendering (cursive joining, correct RTL order) was visually re-confirmed for the two new `ch01-t01` lines and for the unchanged `ch01-t04` content.

## 6. Accessibility and responsive-readability findings

Both files retain `role="img"` with a full `<title>`/`<desc>` pair; `ch01-t01`'s `<desc>` was updated to include the two new qualifiers, restoring full parity between on-canvas and accessible content. Both files were re-inspected at desktop (1100×1050) and mobile (375×812) viewports in a Chromium-based preview browser: `ch01-t01`'s revised layout renders cleanly at both scales with no overlap or clipping; `ch01-t04` is unchanged and remains as previously validated. The same already-documented, accepted mobile-legibility risk (small text at 375px width, matching all four pilot visuals' own precedent) applies to both and was not attempted to be fixed, consistent with this task's own instruction and established house-style practice.

## 7. Rights-safety findings

No change to either asset's rights-safety status. The two new lines added to `ch01-t01` are concise restatements of already rights-cleared, newly authored Batch 1 baseline content — not new claims, not sourced from any publisher material. Both assets remain fully original artwork; re-confirmed no publisher slide, textbook figure, or other cataloged source visual was referenced during this review.

## 8. Validation results and checksums

| File | Result |
|---|---|
| `ch01-t01-visual-001.svg` | Valid XML, single root, 0 duplicate IDs, 1 marker ref resolves, no raster/base64/script/external content, 0 of 46 text elements out of the (now 1000×820) viewBox, 0 missing `direction` attributes. **New checksum:** `48c73a36fef43644ab810e500045c83777e57ba5bb25d1c1d64f5f887fc67a98` |
| `ch01-t04-visual-001.svg` | Re-parsed and re-checksummed to confirm no accidental change occurred during this review; unchanged. **Checksum (unchanged):** `163b5eaa0269ca96943bf136c913bba0b961247da7ab0b68bbbd22b5a475cec6` |
| Both validation JSON records | Valid JSON; `fileChecksumSha256` fields confirmed to match their respective SVG files exactly. |
| English Batch 1 baseline files | Unchanged: `a445f55d...` (`ch01-t01`), `c876a6fe...` (`ch01-t04`). |
| Arabic Batch 1 baseline files | Unchanged: `3955df75...` (`ch01-t01`), `d1f5bfbd...` (`ch01-t04`). |
| `PILOT_AUTHORIZATION.json` / `PILOT_READINESS.json` / `BILINGUAL_GLOSSARY.json` | Unchanged: `1.4.0` / `1.10.0` / `1.3.0`. |

Both assets retain, unchanged: `assetStatus: "draft"`, blocked governance state, `reviewer: null`, `reviewedAt: null`, `studentFacingAllowed: false`.

## 9. Remaining blockers

**None.** No scientific, baseline, glossary, governance, or house-style decision is required for either topic. Every finding in this review was either already satisfactory or was a clear, narrowly-scoped draft-level correction resolvable by restating already-approved content or fixing a mechanical rendering bug — nothing required a new decision outside this review's own authority.

One item is noted for a future, separate decision, not blocking either visual: the new brick-red "Force" color (`#b91c1c`) introduced in `ch01-t04` remains a **provisional candidate** house-style addition (documented in that asset's own `houseStyleNote`) — this review finds no reason to reject or revise it (it passes all measured contrast checks and is applied with a single, consistent semantic meaning throughout), and recommends it be **accepted**, but formally ratifying it in `VISUAL_HOUSE_STYLE.md` itself is a separate documentation action outside this task's allowed modifications.

## 10. Recommendation for each visual

- **`ch01-t01-visual-001`: Ready for project-owner visual approval.** All identified gaps have been corrected and re-validated; no blocker remains.
- **`ch01-t04-visual-001`: Ready for project-owner visual approval.** No defect was found requiring correction; all checklist items were independently re-verified and confirmed satisfactory.

## 11. Batch 1 recommendation

**Both Batch 1 visuals are ready for a project-owner visual-approval decision**, should the project owner choose to proceed. This recommendation is Claude's own review-quality assessment under the existing visual-production authorization — it is not, and does not substitute for, independent human visual or scientific review, which remains outstanding for both assets and is a stated prerequisite the project owner should weigh before any approval decision.

## 12. Exact next controlled task

A project-owner decision on **visual approval** for `ch01-t01-visual-001` and `ch01-t04-visual-001` — an internal project-owner sign-off (not independent human review, not application integration, not student-facing authorization), mirroring the same review-then-approve pattern already used for the English and Arabic Batch 1 content baselines. **This report does not perform that approval.**

---

### Explicit statements

- **This task does not approve either visual.**
- **Application integration remains unauthorized.**
- **Publication remains unauthorized.** `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` everywhere.
- No governance, baseline, glossary, identifier, application code, route, test, or package file was modified.
- No build, install, deploy, `git add`, `git commit`, `git push`, or pull-request action was performed.
