# Chapter 1 Pilot — Handoff

Written for a fresh Claude session with no prior context. All paths below are relative to the repo root (note the literal `$` in the folder name — quote it in shell commands). All facts here were verified against the repository at the time of writing (2026-07-16).

## 1. Current scope

- **Pilot topics only:** `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`. No other Chapter 1 topic has generated content or authorization.
- **Chapter-wide canonical generation remains unauthorized** (`PILOT_READINESS.json.canonicalGenerationAuthorized = false`). Only the four topics above are individually authorized, via `PILOT_AUTHORIZATION.json`.
- **Student publication remains unauthorized everywhere** — `studentPublicationAuthorized: false` globally, `studentFacingAllowed: false` on every one of the 36 content records and all three completed visuals. No action in this pilot has changed this.

## 2. Governing records

| File | Path | Current role |
|---|---|---|
| Rights policy | `docs/content-design/chapter-01/PILOT_RIGHTS_POLICY.json` (v1.0.0, approved) | Requires all pilot content/visuals be newly authored; excludes `SRC-CH01-CONV-005` and `SRC-CH01-REVIEW-001` entirely from pilot authoring. |
| Pilot authorization | `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json` (v1.0.0, granted) | Authorizes draft-form canonical generation for the four topics only; explicitly does not authorize student publication, builds, or `docs/content-audits/` changes. |
| Pilot readiness | `docs/content-design/chapter-01/PILOT_READINESS.json` (v1.4.0) | Chapter-wide `canonicalGenerationAuthorized: false`; `studentPublicationAuthorized: false`. Tracks per-topic readiness state. |
| English baseline approval | `docs/content-design/chapter-01/ENGLISH_PILOT_BASELINE_APPROVAL.json` | **v1.0.2** as of 2026-07-16 (was v1.0.1 at the time §3 below was originally written; see §3's final bullet for the update). Source-of-truth for the four topics' approved English content and visual specs. |
| Arabic baseline approval | `docs/content-design/chapter-01/ARABIC_PILOT_BASELINE_APPROVAL.json` | **v1.0.2** as of 2026-07-16 (was v1.0.1 at the time §3 below was originally written; see §3's final bullet for the update). Source-of-truth for the four topics' approved Arabic translation layer. |
| Corrections used | `docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json` | `ch01-corr-006` (→`ch01-t03`, period/frequency), `ch01-corr-007` (→`ch01-t08`, signed acceleration), `ch01-corr-008` (→`ch01-t10`, tangent velocity/centripetal acceleration). All three `editoriallyApproved`. As of 2026-07-16, `ch01-corr-009` (→`ch01-t08`, conceptual-clarity wording fix to the `v0 = 0` equation-panel clause; also `editoriallyApproved`) was added by the internal-application project — see §3's final bullet. |
| Pilot content (4 files) | `docs/content-design/chapter-01/pilot/ch01-t02-content.json`, `ch01-t03-content.json`, `ch01-t08-content.json`, `ch01-t10-content.json` | 36 records total (4 `instructorScript`, 28 `contentBlock`, 4 `problem`), all `draft`/review-required. |

Reviewer/approver identity used throughout this pilot: **`khubrani2a-gif (project owner)`**.

## 3. Baseline state

- Both `ENGLISH_PILOT_BASELINE_APPROVAL.json` and `ARABIC_PILOT_BASELINE_APPROVAL.json` are currently at **`baselineVersion 1.0.1`** (bumped from 1.0.0).
- **Why:** `ch01-t02`'s visual (see §4) was produced to teach the length/area/volume squared-cubed conversion-factor relationship, which diverged from `ch01-t02-block-visual`'s originally recorded spec text (a coin/doorway/city-block scale-comparison scene). A read-only review weighed both concepts against the approved content and recommended keeping the produced visual, since it directly supports `ch01-t02-block-equations`, `ch01-t02-block-example`, the instructor script's core narrative, and the graded problem `ch01-prob-102` — while the scale-comparison scene supports only the topic's opening hook. The project owner authorized decision **A**: keep the visual, formally revise the recorded spec to match it, and retain the scale-comparison concept only as an explicitly optional future supplementary visual. Both baseline files' `revisionLog` (under `revisionControlPolicy`) carry one entry each (`ch01-english-baseline-rev-001`, `ch01-arabic-baseline-rev-001`), scoped strictly to `ch01-t02-block-visual`. No other record, and no other topic, was touched by this revision.
- **Going forward:** any future edit to the approved English or Arabic content of these four topics must be recorded as a controlled revision — bump the relevant `baselineVersion` and append a `revisionLog` entry (what changed, why, who authorized it, when) — not made silently.
- **Update (2026-07-16):** both baseline files were subsequently bumped again, to **`baselineVersion 1.0.2`**, via `ch01-english-baseline-rev-002` / `ch01-arabic-baseline-rev-002`, following the same controlled-revision pattern described above. This second revision was scoped strictly to `ch01-t08-block-equations`' `v0 = 0` wording (correction `ch01-corr-009`, `SCIENTIFIC_CORRECTIONS.json`), authorized by the project owner as part of the internal PHSH111 application project (see `docs/app/PHSH111_APP_HANDOFF.md`). No other record in `ch01-t08`, and no record in `ch01-t02`, `ch01-t03`, or `ch01-t10`, was touched by this second revision either.

## 4. Completed visuals

Three of four pilot visuals exist, all original SVG artwork, all still draft/unreviewed by a human.

| | `ch01-t02` | `ch01-t03` | `ch01-t08` |
|---|---|---|---|
| SVG | `docs/content-design/chapter-01/pilot/visuals/ch01-t02-visual-001.svg` | `.../ch01-t03-visual-001.svg` | `.../ch01-t08-visual-001.svg` |
| Validation record | `.../ch01-t02-visual-001-validation.json` | `.../ch01-t03-visual-001-validation.json` | `.../ch01-t08-visual-001-validation.json` |
| Status | `availabilityStatus: available`, `blockingReason: ["unverifiedVisual","translationPending","other"]`, `blockingStatus: "blocked"`, `studentFacingAllowed: false` | same pattern | same pattern |
| Scientific purpose | Length vs. area vs. volume; why the unit-conversion factor is squared for area and cubed for volume | One complete cycle (period/frequency) returns to the same position **and** direction; `f = 1/T`, `T = 1/f` (per `ch01-corr-006`) | Acceleration's sign depends on the chosen positive-axis convention, not on gravity changing; `a = -g` vs. `a = +g`; negative sign ≠ slowing down (per `ch01-corr-007`) |
| Revisions completed | Rev 1: added visible bilingual object captions (exam table / dressing pad / sample container) + "General rule" box header; fixed a broken summary-box superscript found on render | Rev 1: added "Direction of motion" label + connector; added match-indicator (shared highlight + checkmark) for t=0/t=T; italicized t/T/f; strengthened equation-panel weight | Rev 1: added "Constant at all three instants" and "independent scales" legend notes; fixed a colliding micro-label found on render |
| Remaining caveats (all three) | Contrast ratios assessed by eye, not tool-measured. Cross-renderer Arabic RTL rendering confirmed in only one browser environment. Mobile/small-screen delivery risk documented but not addressed — left for downstream responsive tooling. | | |

None of the three has been marked finally approved, resolved, or student-facing-eligible. Each validation record has `readyForHumanReview: true` but `reviewer: null`, `reviewedAt: null` — a human review has not occurred.

## 5. Visual house-style candidate

Established across the three completed visuals; not yet written up as a standalone style-guide document (do this after `ch01-t10`'s visual exists — see §6).

- **Teal (`#1f6f8b`)** — structure/path (object outlines, axes, circle paths, fills)
- **Rust-orange (`#d9480f`)** — motion or velocity vectors
- **Violet (`#6d28d9`)** — acceleration vectors
- **Slate/navy (`#334155` / `#0f172a`)** — labels and secondary structure (text, neutral connector arrows)
- **Amber (`#fff7ed` / `#f59e0b` / `#b45309`)** — internal draft-footer band only
- Every English and Arabic string is its **own separate `<text>` element** — never mixed in one run
- Every text element carries an **explicit `direction="ltr"` or `direction="rtl"`** attribute
- Single-letter variables (`t`, `T`, `f`, `a`, `g`, `v`, `A`, `V`, `k`) are **italicized**; unit symbols (`m`, `s`, `Hz`, `cm²`, `m/s²`, etc.) stay **upright**; exponents use true SVG superscripts, not caret notation
- Each SVG has `role="img"` plus `<title>` and `<desc>` **accessibility metadata**, and a visible "DRAFT — REVIEW REQUIRED" footer

## 6. Remaining work

1. Create `ch01-t10-visual-001.svg` (see §7 for the spec).
2. Create its validation record, `ch01-t10-visual-001-validation.json`, covering the same dimensions used for the other three (scientific accuracy, consistency with `ch01-corr-008`, bilingual rendering, rights-policy compliance, accessibility/readability, readiness for human review).
3. Conduct a read-only rendered visual review (browser-rendered, not just source inspection) and apply any approved minor revisions, following the same pattern as the other three.
4. Once all four diagrams exist, formalize the house-style candidate in §5 into a written style-guide document.
5. Prepare a visual-pilot approval record only *after* a genuine human review has occurred — not before.
6. Do not authorize student publication at any point in this remaining work.

## 7. Exact next action: `ch01-t10-visual-001.svg` specification

Ground the diagram in:
- **`ch01-corr-008`** (`docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json`): velocity is tangent to the circular path at every instant; centripetal acceleration is the continuous change in that velocity's direction and points toward the center — never along the velocity, never outward; constant speed does not imply zero acceleration.
- **`ch01-t10-block-visual`**'s existing approved spec (`docs/content-design/chapter-01/pilot/ch01-t10-content.json`): a circle representing the circular path, with an object at one point; a solid-line velocity arrow tangent to the circle (perpendicular to the radius, pointing in the direction of travel) labeled `v (tangent)`; a separate, shorter, dashed-line acceleration arrow from the same point pointing directly toward the center, labeled `a_c (toward center)`; a small inset showing the object an instant later, slightly further along the circle, with its velocity arrow rotated to remain tangent at the new position while the acceleration arrow still points toward the same center — demonstrating that velocity direction changes while the center-pointing relationship of acceleration stays fixed.
- **The three completed visuals as style references** (not layout templates — do not force a two- or three-panel layout onto this topic if a single annotated circle with an inset better serves it): reuse the palette in §5 exactly — velocity arrow in rust-orange, acceleration arrow in violet, circle/structure in teal, labels in slate/navy; bilingual captions as separate LTR/RTL text elements; italic `v`/`a_c` with upright units; `role="img"` + `<title>` + `<desc>`; visible draft footer.
- Include an explicit anti-misconception caption (bilingual), matching this topic's misconception block: velocity is never directed toward the center; only acceleration is.

## 8. Constraints (apply to all remaining work)

- Do not modify `docs/content-audits/`.
- Do not build, install, stage, commit, or push.
- Do not mark any visual finally approved or resolved.
- Do not infer or imply independent human expert review where none has occurred.
- Preserve honest attribution throughout: approvals are recorded as the **project owner's decision made on the basis of Claude's completed review**, not as an independently-derived human re-verification — continue this exact framing in any new governance record.
