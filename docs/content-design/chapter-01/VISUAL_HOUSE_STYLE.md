# Chapter 1 Pilot — Visual House Style

**Status:** Internal design standard, draft.
**Basis:** Derived only from the four completed Chapter 1 pilot visuals and their validation records:

| Asset | Topic | Canvas |
|---|---|---|
| `pilot/visuals/ch01-t02-visual-001.svg` | Length/area/volume conversion factors | 1100×850 |
| `pilot/visuals/ch01-t03-visual-001.svg` | Period and frequency (one complete cycle) | 900×680 |
| `pilot/visuals/ch01-t08-visual-001.svg` | Signed acceleration / sign convention | 1000×1000 |
| `pilot/visuals/ch01-t10-visual-001.svg` | Tangential velocity and centripetal acceleration | 1000×1000 |

Every rule below is stated only where it was actually demonstrated in at least one of these four files. Where a rule is a target that not all four assets have fully met yet (e.g. measured contrast), that gap is stated explicitly rather than implied as already satisfied everywhere.

---

## 1. Purpose and scope

- This document governs the **visual design of Chapter 1 pilot diagrams only** — the four assets listed above. It does not extend to any other chapter or topic without a separate, explicit decision, consistent with `PILOT_RIGHTS_POLICY.json` and `PILOT_AUTHORIZATION.json`'s own scoping.
- This is an **internal design standard** for whoever authors or reviews the next pilot visual. It is descriptive (it records what was actually built and why) and prescriptive (it says what the next asset should do to stay consistent) — it is not a public style guide and not a claim of finished, approved design language.
- **This document does not authorize student publication of any visual.** All four source assets remain `draft`, `blockingStatus: "blocked"`, and `studentFacingAllowed: false` in their respective validation records and in `PILOT_READINESS.json` / `PILOT_AUTHORIZATION.json`. Formalizing a style guide is a design-consistency exercise, not a governance or approval action, and changes nothing about any asset's review or publication status.

## 2. Color semantics

A fixed, small palette was used consistently across all four assets. Colors carry meaning — they are not decorative choices made per-asset.

| Role | Color | Hex |
|---|---|---|
| Structure, path, geometry, neutral scientific scaffolding | Teal | `#1f6f8b` (fills often lightened, e.g. `#eef7fa`) |
| Motion / tangential velocity | Rust-orange | `#d9480f` (a slightly darkened `#d2450e` was used once, for a specific contrast fix — see §7) |
| Acceleration | Violet | `#6d28d9` |
| Labels, axes, legends, secondary structure | Slate/navy | `#334155` (secondary text), `#0f172a` (primary text/titles) |
| Draft/review-required footer | Amber | background `#fff7ed`, border `#f59e0b`, text `#b45309` |

Rules proven by usage:
- **Teal is reserved for structure**, never for a moving or changing physical quantity: circle paths, radii, object fills, panel container outlines (`t02`, `t03`, `t08`, `t10`).
- **Rust-orange is reserved for velocity/motion**, and only that. It first appears in `t03` as the "direction of motion" arrow on a circle, is reused for the growing velocity arrows in `t08`, and again for the tangent velocity arrow in `t10`. It is never used for acceleration or for structure.
- **Violet is reserved for acceleration**, and only that. It does not appear in `t02` or `t03` (neither has an acceleration vector to draw) — it is introduced in `t08` specifically because that topic needed a second vector color distinct from velocity, and reused identically in `t10`. This confirms the rule is semantic (violet = acceleration) rather than positional (violet = "the second arrow").
- **Slate/navy is the default for all label and structural text**, and for neutral connector/reference lines that are not themselves a physical vector (e.g. `t02`'s panel-progression arrows, `t03`'s timeline axis, `t10`'s right-angle indicator).
- **Amber is used exclusively for the draft-status footer band** — it never appears anywhere else in any of the four assets. Do not use amber for any in-diagram warning, highlight, or emphasis; its sole meaning is "this whole asset is a draft."
- One color fell outside this five-color system: `t03` used green (`#15803d`) for a "confirmed match" checkmark badge marking that `t = 0` and `t = T` are the same state. This was a one-off, topic-specific device (confirming a returned/matched condition), not a reusable semantic color — it has not been reused in `t08` or `t10`, which instead used plain numbered slate badges for a related but distinct purpose (cross-referencing an instant between a main panel and an inset — see §6, §10). **Do not assign a new semantic color arbitrarily**; if a future topic needs a "confirmed/matched" indicator, either reuse `t03`'s green-checkmark pattern deliberately or make the case for a new addition to this table.

## 3. Typography and scientific notation

Proven consistently across all four assets:

- **Single-letter variables are italic**: `A`, `V`, `k` (`t02`); `t`, `T`, `f` (`t03`); `a`, `g` (`t08`); `v`, `a`, `r` (`t10`). Verified in `t10`'s revision process by direct DOM/attribute inspection, not just visual impression.
- **Unit symbols stay upright**: `m`, `cm`, `m/s²`, `Hz`, etc. are never italicized, even adjacent to an italic variable in the same equation.
- **True superscripts and subscripts**, not caret notation (`^2`) or a literal underscore (`_c`) in rendered text:
  - Superscripts: `m²`, `cm³` (`t02`), `m/s²` (`t08`), `v²` (`t10`) — all built with a nested `<tspan>` at a reduced `font-size` and a negative `dy` shift.
  - True subscript: `a`<sub>`c`</sub> (`t10`'s `a_c`) — a nested `<tspan>` with a positive `dy` shift and reduced `font-size`; the subscript letter itself is upright (it names "centripetal," it is not a variable), while the base letter stays italic.
  - **One documented exception**: `t10`'s combined Arabic legend line renders `a_c` as plain text with a literal underscore rather than a true subscript. This was a deliberate, documented decision (see §4) to avoid bidi/layout risk from nesting a nested-`dy`-shifted subscript inside a right-to-left text run — not an oversight. Do not silently "fix" this without re-evaluating the same bidi risk.
- **Formula-only content is isolated into its own LTR text element**, never interleaved character-by-character with Arabic prose. Every equation panel (`t02`'s summary box, `t03`'s `f = 1/T, T = 1/f`, `t08`'s `|g| ≈ 9.8 m/s²`, `t10`'s `a_c = v²/r`) is a dedicated `direction="ltr"` element with no Arabic characters inside it.
- **No text element mixes Arabic prose and an equation.** Where Arabic text needs to *reference* a symbol (e.g. `t08`'s and `t10`'s Arabic legend lines naming `a`, `v`, `a_c`), the reference is a single bare Latin symbol embedded in an otherwise-Arabic sentence — never a multi-term formula, and never Arabic words interleaved inside the formula itself. A single named symbol inside Arabic prose is an accepted, reused pattern; a rendered equation is not.

## 4. Bilingual rendering

Proven identically across all four assets, on every single text element without exception:

- **English and Arabic are always separate `<text>` elements.** No element's `textContent` mixes both scripts as prose (the only Latin content ever found inside an RTL element is a single bare symbol — see §3).
- **Every text element carries an explicit `direction` attribute** — `"ltr"` or `"rtl"` — never left to inherit or default. This was verified programmatically for `t10` (0 of the file's text elements were missing the attribute) and is structurally true by construction in `t02`, `t03`, and `t08`.
- English is always `direction="ltr"`; Arabic is always `direction="rtl"`.
- Arabic text elements use a font stack with an Arabic-capable fallback (`'Segoe UI', 'Noto Sans Arabic', Tahoma, Arial, sans-serif`); English/formula elements use `'Segoe UI', Arial, sans-serif`.
- **Bilingual stacking pattern**: an English line immediately followed by its Arabic counterpart, English first, at a slightly larger font size than the Arabic line beneath it (e.g. title 24px/20px, subtitle 17px/15px, captions 14px/14px, legend 13px/13px). This pairing is used for every title, subtitle, caption, legend line, and label pair in all four assets — a reader always finds the Arabic translation directly beneath its English source, never elsewhere on the canvas.
- **Arabic glyph shaping (cursive joining, correct RTL order) has only been checked by visual inspection in a single browser environment during authoring.** No asset's validation record claims cross-renderer or cross-platform Arabic shaping verification. Before any asset is treated as ready for anything beyond internal draft review, **Arabic shaping must be verified in the actual delivery pipeline** (the renderer/viewer students or instructors will actually use), not assumed from the authoring browser.

## 5. Diagram structure

Every one of the four assets follows the same top-to-bottom skeleton, adapted to its own content:

1. **Clear bilingual title** at the top (and, in three of four assets, a bilingual subtitle beneath it framing the specific instant/panel being shown).
2. **A primary teaching visual** occupying the largest area of the canvas — the three-panel length/area/volume comparison (`t02`), the three-instant circular-motion strip (`t03`), the two-panel sign-convention comparison (`t08`), or the single annotated circle plus inset (`t10`). This is always original artwork, never a reproduced slide or textbook figure (confirmed against `PILOT_RIGHTS_POLICY.json` in every validation record).
3. **Concise bilingual supporting captions** below the main visual — never a paragraph; one or two sentences per language, matching the bilingual stacking pattern in §4.
4. **An equation or summary panel where relevant** — a rounded rectangle with a teal border, light teal fill (`#eaf6f8`), and a soft offset "shadow" rectangle behind it in reduced-opacity teal. This exact container style is reused in all four assets (`t02`'s "General rule" box, `t03`'s and `t08`'s and `t10`'s equation boxes) — it is the house style's one deliberately reused container component.
5. **An explicit misconception-correction caption where the topic has a known misconception**, stated in prose rather than left implicit: `t02`'s "the conversion factor is not the same for length, area, and volume," `t03`'s "one complete cycle means returning to both position and direction," `t08`'s "a negative sign does not mean slowing down," `t10`'s "the object itself does not move toward the center."
6. **An internal draft footer band** — identical amber styling and near-identical wording in all four (`DRAFT — REVIEW REQUIRED — ORIGINAL SCHEMATIC (<asset-id>) — Not authorized for student-facing use`), always the last element, always full-width, always ~40px tall.
7. **No decorative elements that do not support instruction.** Every visual element across all four assets maps to something the caption, equation, or misconception note explicitly discusses — there are no ornamental icons, backgrounds, or flourishes with no teaching function.

## 6. Vector conventions

Proven in `t03`, `t08`, and `t10` (the three assets with a physical vector to draw):

- **Velocity arrows are solid rust-orange**, always with a filled triangular arrowhead marker (`markerUnits="strokeWidth"`, so the arrowhead scales with the line's own stroke width rather than needing separate tuning).
- **Acceleration arrows are violet**, and are **dashed where useful for a second, non-color channel of distinction** — `t10` introduced this explicitly (its approved content spec called for "solid" velocity vs. "dashed" acceleration), and it was reused for both the main panel and inset. `t08`'s acceleration arrows are solid violet (distinguished from velocity by color and consistent left/right position relative to the object, not by dashing) — dashing is a house-style option for acceleration, not a strict requirement, to be applied when it adds a genuinely distinguishing channel.
- **Structural or reference lines are visually distinct from physical vectors.** Non-vector helper lines (a radius, a vertical drop-line to a timeline, an axis) are drawn thin, gray, and dashed with a *different* dash cadence than any nearby vector, and never carry an arrowhead marker that implies direction-of-motion. `t10`'s revision specifically increased this distinction (finer dash cadence, darker gray) after a review found the radius line and the acceleration arrow's dash pattern too easily confused when they run near-collinear.
- **Arrow lengths across different physical quantities must not imply direct comparability unless explicitly intended.** `t08`'s validation record states this explicitly and adds a bilingual caption ("velocity and acceleration arrows use independent scales") specifically because its velocity and acceleration arrows are not drawn to the same scale and could otherwise be misread as comparable magnitudes.
- **Tangent, radial, and perpendicular relationships must be mathematically verified, not eyeballed.** `t10` is the proof case: every vector's direction was checked by extracting the live-rendered coordinates and computing dot products — tangency (velocity ⊥ radius, verified as exactly 0.0 in the main panel and within ~0.01° in the inset after a rounding correction) and radial alignment (acceleration vector · true center-direction = exactly 1.0 in every drawn instant). A visible right-angle indicator plus a "90°" label was added as the sighted-viewer-facing confirmation of the same relationship, constructed from the same unit vectors as the arrows themselves rather than drawn independently. Any future asset with a tangent, radial, or perpendicular claim should be checked the same way before being marked ready for review.

## 7. Accessibility

Proven consistently:

- **`role="img"` plus a `<title>` and `<desc>`** are present on every one of the four assets, wired via `aria-labelledby`. Each `<desc>` gives a full prose description of every panel, vector, and caption — sufficient for a screen-reader user to reconstruct the diagram's teaching content without seeing it.
- **No reliance on color alone.** Every asset distinguishes its meaningful elements by at least one channel beyond hue: `t02`'s three panels by position, digit-labeled headers, and divider lines; `t03`'s matched instants by a badge, connector line, and text label; `t08`'s velocity/acceleration by color *and* consistent left/right position *and* a written legend; `t10`'s velocity/acceleration by color *and* line style (solid/dashed) *and* a written legend.
- **Text contrast of at least 4.5:1** (WCAG AA, normal text) and **graphical contrast of at least 3:1** (WCAG 1.4.11, non-text elements) are the house-style targets. This was only actually *measured* (rather than assessed by eye) for `t10`, during its post-review revision: the standalone "v" label was found at 4.300:1 (below 4.5:1) and corrected to 4.567:1; the radius reference line was found at 2.359:1 against its background (below 3:1) and corrected to 3.186:1. **No full pairwise contrast audit has been performed on `t02`, `t03`, or `t08`** — their validation records explicitly carry this forward as an open item, assessed only "visually" as high-contrast. Treat the 4.5:1 / 3:1 thresholds as the standard to check against, not as already-confirmed for every color pair in every asset.
- **Labels are sized for classroom-projector and desktop-student viewing** at each asset's native canvas size (smallest text 10–13px across all four, largest titles 23–24px), not for small-screen delivery.
- **Current assets are wide, fixed-size SVGs (900–1100px) with no mobile-specific variant.** Every validation record documents this as an open, undeferred risk rather than a solved problem — `t10`'s review went further and directly simulated a 375px-wide viewport, confirming that the radius label, angle label, inset captions, legend, and equation sub-caption all fall below legible size at phone width. **Any real delivery to a small screen requires responsive or zoomable presentation of these SVGs (pinch-zoom, pan, or a purpose-built responsive layout) — shrinking the existing desktop canvas to fit a phone viewport is not acceptable and has been confirmed to produce illegible text.**

## 8. Layout and spacing

- **No overlaps.** `t10`'s revision process included a programmatic bounding-box overlap check across every text element in the file (0 overlaps found, both before and after edits) — this is the standard the other three assets were built to by visual inspection and should be checked the same way going forward.
- **No bilingual text crowding.** The English/Arabic stacking pattern (§4) always reserves a consistent vertical gap (roughly 20–28px between a paired English/Arabic line, 22–35px between distinct section blocks) — this spacing rhythm repeats across all four assets' captions, legends, and titles.
- **Consistent visual hierarchy**: title > subtitle/panel headers > equation panel content > body captions > legend > micro-labels (badges, angle labels, axis ticks), expressed through a descending font-size scale (24px → 17px → 26px(equation) → 14–15px → 13px → 10–13px) that repeats across all four assets rather than being invented per-asset.
- **Equation panels support, not dominate, the main concept.** In every asset the equation/summary box is a compact, secondary element beneath or beside the primary teaching visual — it is never the largest element on the canvas, and its container styling (§5) deliberately echoes the same restrained teal-and-white treatment rather than competing for attention with the main diagram's color-coded vectors.
- **Mobile use requires responsive handling, not blind shrinking of the desktop SVG** — restated from §7 because it is a layout property, not only an accessibility one: at reduced scale, elements that do not overlap at 900–1100px (labels, badges, legend items) will begin to collide well before text becomes merely small, since spacing (not just font size) shrinks proportionally.

## 9. Governance

These rules are enforced by the pilot's own record-keeping, not by this document, and this document changes none of them:

- **Visuals remain `draft` until an actual human review occurs.** All four assets' validation records set `readyForHumanReview: true` but `reviewer: null` and `reviewedAt: null` — "ready to be reviewed" is not "reviewed."
- **Availability does not equal approval.** `availabilityStatus: "available"` (present on all four once drawn) records only that the asset exists and was internally checked; it is a distinct field from any approval or sign-off, and none of the four have been marked approved.
- **Use `unverifiedVisual` as the blocking reason until a human review has actually happened** — this is the exact wording used to replace the earlier `missingVisual` / `redrawRequired` placeholders once an asset moved from "does not exist yet" to "exists, drafted, awaiting review" (done for `t02`, `t08`, and `t10` as each was completed).
- **`studentFacingAllowed` stays `false` until explicit authorization** — true for every one of the four assets, every content record referencing them, and the chapter-wide `PILOT_READINESS.json` / `PILOT_AUTHORIZATION.json` flags. Nothing in this style guide changes this for any asset.
- **Any later visual change requires a validation revision entry** — not a silent edit. Every substantive change made to any of the four assets after its first render is recorded as a numbered `revisionHistory` entry in that asset's validation JSON, stating what changed, why, and what was re-verified afterward (`t02` rev-001 added object captions and a summary-box header after a content-scope review; `t08` rev-001 added two clarifying legend notes; `t10` rev-001 corrected a precision issue, rev-002 applied a rendered-visual-review's required fixes). A future edit to any pilot visual — including one motivated by this style guide — should follow the same pattern.

## 10. Proven examples

| Rule | `t02` | `t03` | `t08` | `t10` |
|---|---|---|---|---|
| Teal = structure/path | ✅ panels, table/pad/cube icons | ✅ circle path, object dots | ✅ falling-object fill | ✅ circle path, radius, object |
| Rust-orange = velocity/motion | — (no vector) | ✅ first use — "direction of motion" arrow | ✅ growing velocity arrows | ✅ tangent velocity arrow |
| Violet = acceleration | — (no vector) | — (no vector) | ✅ first use — introduced because a second vector color was needed | ✅ reused, now also dashed |
| Slate/navy = labels & structure | ✅ dimension lines, headers | ✅ timeline axis | ✅ axis line, legend | ✅ radius line, badges, angle label |
| Amber = draft footer only | ✅ | ✅ | ✅ | ✅ |
| Variables italic / units upright | ✅ `A`, `V`, `k` italic; `m`, `cm` upright | ✅ `t`, `T`, `f` italic | ✅ `a`, `g` italic; `m/s²` upright | ✅ `v`, `a`, `r` italic; true subscript `a`₍c₎ |
| True super/subscripts | ✅ `m²`, `cm³` | — (no exponents needed) | ✅ `m/s²` | ✅ `v²` and `a`₍c₎ combined in one equation |
| Formula isolated LTR / no mixed equation+prose | ✅ | ✅ | ✅ | ✅ (one documented, deliberate exception in the Arabic legend — see §3) |
| Bilingual separate elements + explicit direction | ✅ | ✅ | ✅ | ✅ (0 missing attributes, verified programmatically) |
| Equation/summary panel container style | ✅ "General rule" box | ✅ `f=1/T` box | ✅ `\|g\|` magnitude box | ✅ `a_c=v²/r` box |
| Explicit misconception caption | ✅ | ✅ | ✅ | ✅ (plus a dedicated `misconception` content block) |
| Draft footer band | ✅ | ✅ | ✅ | ✅ |
| Distinguish without color alone | ✅ position/headers/dividers | ✅ badge+line+text | ✅ color+position+legend | ✅ color+line-style+legend |
| Cross-reference badge device | — | ✅ green checkmark, "confirmed match" | — | ✅ numbered slate badge, "same instant" |
| Vector length ≠ implied comparability caveat | — | — | ✅ explicit caption added | (not applicable — no cross-scale vectors drawn) |
| Right-angle / perpendicularity indicator | — | — | — | ✅ first use, mathematically constructed |
| Programmatic geometry verification (dot product) | — | — | — | ✅ tangency and radial alignment checked directly against rendered coordinates |
| Measured WCAG contrast fix | — | — | — | ✅ two color pairs measured and corrected |
| `role="img"` + `title` + `desc` | ✅ | ✅ | ✅ | ✅ |
| Mobile risk documented, not fixed | ✅ | ✅ | ✅ | ✅ (plus a direct 375px simulation) |
| Revision recorded as validation `revisionHistory` entry | ✅ 1 revision | ✅ 1 revision | ✅ 1 revision | ✅ 2 revisions |
