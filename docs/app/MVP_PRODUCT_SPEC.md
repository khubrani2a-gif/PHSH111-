# Medical Physics — Chapter 1 Pilot: Internal MVP Product Specification

**Status:** Specification only. No application code exists yet. This document does not authorize building, and building is a separate future decision (see Repository Verification, item 5).

---

## 0. Repository Verification (performed before writing this spec)

| Check | Result |
|---|---|
| Existing frontend/app scaffold anywhere in repo (`package.json`, `vite.config*`, `tsconfig.json`, `src/`, `*.ts`/`*.tsx`/`*.js`/`*.jsx`) | **None found.** Repository root contains only `.git`, `docs/`, `tmp/`, and two non-code lecture-material directories ("Lectures pdf", "lectures ppt", "review cards"). |
| `docs/app/` directory | **Did not exist prior to this task.** Created only to hold this file. |
| Content JSON schema consistency (`ch01-t02/t03/t08/t10-content.json`) | All four share `schemaVersion: "2.3.0"`, identical `recordType` counts (1 `instructorScript`, 7 `contentBlock`, 1 `problem`), identical `blockType` ordering (`mainIdea` → `organizedExplanation` → `equationSet` → `example` → `visualReference` → `misconception` → `reviewQuestion`), and identical top-level key sets per record type. This is a genuinely low-risk, high-consistency source schema. |
| `blocking` sub-object schema | Identical 8-key shape (`blockingStatus`, `blockingReason`, `blockingRecordIds`, `studentFacingAllowed`, `instructorFacingAllowed`, `resolutionRequired`, `resolutionOwner`, `resolutionStatus`) on **every** record of every type in all four files, with no exceptions found. |
| `visibility` field values | `mainIdea`/`equationSet`/`visualReference` = `"shared"`; `organizedExplanation`/`example`/`reviewQuestion` = `"student"`; **`misconception` = `"instructor"` in all four topics, with no exceptions.** This directly affects §5 and is flagged as a discrepancy below. |
| Visual validation records (`ch01-t*-visual-001-validation.json`) | All four present, all four structurally consistent, but **not identical**: `t02` carries an extra `contentScopeDivergence` object (a resolved historical note) that `t03`/`t08`/`t10` do not have; `houseStyleNote` is present on `t02`/`t08`/`t10` but absent on `t03`. Both are optional/additive fields, not structural breaks. |
| `PILOT_READINESS.json.pilotTopicOrder` | `["ch01-t02", "ch01-t03", "ch01-t08", "ch01-t10"]` — **matches this task's requested topic order exactly.** This order is governance-established, not merely a UX recommendation. |
| `PILOT_AUTHORIZATION.json.doesNotAuthorize` | Explicitly lists **"Application build, packaging, or deployment"** as not authorized by the current pilot authorization record. See discrepancy note below. |
| `studentFacingAllowed` / `studentPublicationAuthorized` | `false` everywhere — every content record, every visual, `PILOT_READINESS.json` (chapter-wide and per-topic), `PILOT_AUTHORIZATION.json`. No exceptions found anywhere in the four topics. |
| Baseline approvals | `ENGLISH_PILOT_BASELINE_APPROVAL.json` and `ARABIC_PILOT_BASELINE_APPROVAL.json` are both `status: "approved"` at `baselineVersion: 1.0.1`. Their own `downstreamAuthorization` field states explicitly: *"Designating this baseline as the translation/artwork source text does not itself perform any translation or artwork, and does not authorize student-facing publication."* "Approved baseline" and "authorized for students" are two different, independently-gated facts — both must be checked by the application, not conflated. |
| `VISUAL_HOUSE_STYLE.md` | Present, governs color semantics, typography, bilingual rendering, and accessibility targets for the four SVGs (see §9, §10, §12 below, which draw on it directly). |
| The four SVG assets | All four load as well-formed XML, all four carry `role="img"` + `<title>` + `<desc>`, all four remain `assetStatus: "draft"` and end with a visible amber "DRAFT — REVIEW REQUIRED" footer band. |

### Discrepancies between repository state and this task's requested structure (reported, not silently resolved)

1. **Misconception content is scoped `visibility: "instructor"` in the source schema**, but §5 of this task places "Common misconception" as a numbered section of the topic-detail page alongside student-visible content. This MVP is internal-only (§1, §7) and its entire population of viewers is already gated as authorized internal reviewers rather than the public student body the schema's `visibility` field is ultimately meant to gate — so displaying `instructor`-visibility content inside this internal tool is arguably in scope. It is documented here as a decision the application's governance layer must make explicitly (e.g., label it distinctly, gate it behind the same internal-mode flag as everything else) rather than an ambiguity to paper over. See §7 and §20.
2. **`PILOT_AUTHORIZATION.json` does not authorize building this application.** Its scope is "draft-form canonical generation... for the four scoped topics" and its `doesNotAuthorize` list names "Application build, packaging, or deployment" explicitly. This specification is content-generation-adjacent documentation work, consistent with prior work in this repository, and creates no code. **Before Phase 1 of §19 begins, a separate, explicit project-owner authorization for building the internal MVP application should be obtained** — this spec does not create that authorization and should not be read as implying it exists. See §20.
3. **"Learning objective" (§5, item 2) has no dedicated `contentBlock`.** It exists only inside `instructorScript.learningObjectives[]`, alongside instructor-only material (`instructorOnlyCautions`, `wordForWordTeachingScript`, `slidePageCues`) that has no `visibility` field to distinguish it from shareable content at all. See §6 for the resulting adapter requirement.

---

## 1. Product Definition

**Provisional internal title:** *Medical Physics — Chapter 1 Pilot*

An internal, non-public, bilingual (English/Arabic) learning application MVP that renders exactly the four authorized Chapter 1 pilot topics — `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10` — directly from their existing canonical JSON records and SVG diagrams. Its purpose is to validate the pilot content and design pipeline end-to-end in a working application, not to launch a product.

The MVP exists to validate, and validation success is the deliverable:

- content ingestion from the canonical pilot JSON records without duplication or rewriting
- correct English and Arabic rendering, including direction switching
- scientific notation and equation legibility (italics, units, super/subscripts)
- SVG diagram delivery at usable fidelity on multiple screen sizes
- topic navigation across the four-topic governance-defined sequence
- worked-example and original-problem presentation
- answer-reveal interaction
- responsive behavior from mobile through projector
- accessibility fundamentals
- **whether this approach is worth scaling to the remaining ten Chapter 1 topics**

No branding system, logo, marketing copy, or public-launch requirement is defined, because none is needed to answer the above questions and none is authorized (§0, item 2).

## 2. Users and Use Cases

**Primary users (internal only — see §7):**
- Health-sciences students studying introductory physics, in a supervised/pilot context, not general public access.
- Instructors reviewing and demonstrating the pilot content, including in a classroom/projector setting.
- Internal academic reviewers validating content accuracy, translation quality, and rendering correctness — the same role already performing the reviews described in `PILOT_HANDOFF.md` and the visual validation records.

**Main use cases:**
- Browse the four topics from a chapter landing page.
- Switch the active language between English and Arabic.
- Read the organized explanation for a topic.
- Inspect the topic's scientific visual, including enlarging it.
- Read the key equation(s) and a worked example.
- Attempt the topic's original problem.
- Reveal, then hide, the step-by-step solution.
- Move to the previous or next topic in the four-topic sequence.
- Use the application on desktop, tablet, a classroom projector, and a mobile phone.

**This MVP is not authorized for external or student-production deployment.** Every use case above happens inside an internally-run instance, consistent with `studentFacingAllowed: false` and `studentPublicationAuthorized: false` holding everywhere in the source data (§0).

## 3. MVP Scope

**Included:**
Internal application shell · Chapter 1 landing page · four topic cards · topic-detail pages · English/Arabic language toggle · direction-aware LTR/RTL rendering · learning objective · main idea · step-by-step explanation · key concept/summary · key equations · embedded SVG visual · fullscreen/zoomable visual viewer · worked example · common misconception · original problem · revealable solution · previous/next topic navigation · a visible internal Draft/Review-Required status · loading, missing-content, and invalid-record fallback states.

**Explicitly excluded:**
Authentication · user accounts · backend services · cloud database · cloud sync · student-progress storage · grades · teacher dashboard · analytics · notifications · discussion features · AI tutoring · question-bank generation · Kahoot export · public deployment · the full Chapter 1 (only the four pilot topics) · in-app content editing · any student-publication authorization.

## 4. Information Architecture

| Route | Purpose |
|---|---|
| `/` | Internal MVP landing page — states this is an internal pilot build, links to the chapter. |
| `/chapter/1` | Chapter 1 topic list — exactly the four pilot topic cards, in governance order. |
| `/chapter/1/topic/:topicId` | Topic-detail page. `:topicId` is one of `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10` — the same IDs used as `topicId` in the source JSON, used verbatim as the route param (no re-mapping or renumbering). |

**Topic order** (from `PILOT_READINESS.json.pilotTopicOrder`, not invented): `ch01-t02` → `ch01-t03` → `ch01-t08` → `ch01-t10`.

**Structural elements:**
- **App header** — app title, language control, link back to the chapter list.
- **Language control** — a two-state toggle (English / العربية), always visible in the header.
- **Internal-status banner** — persistent, non-dismissible-by-default, states this is an internal draft build not authorized for student publication (§7).
- **Chapter navigation** — the four topic cards on `/chapter/1`, each showing topic title (EN/AR), a one-line description drawn from the topic's `mainIdea` block, and its position in the sequence.
- **Topic cards** — clickable, keyboard-focusable, route to the topic-detail page.
- **Topic-progress indicator** — a simple "Topic 2 of 4" style indicator reflecting position in the four-topic sequence *for this session's view only* — **not persisted, not a completion tracker.** Do not describe or build this as student progress; it is a navigation aid, not a state record (§3, §15).
- **Previous/next controls** — bound to the four-topic sequence above; disabled (not hidden) at the first/last topic.
- **Visual viewer** — the embedded SVG plus a fullscreen/zoom affordance (§10).
- **Problem-and-solution interaction** — problem statement always visible; solution hidden by default behind a reveal control (§14, `SolutionReveal`).

## 5. Topic-Page Experience

| # | Section | Canonical source |
|---|---|---|
| 1 | Topic title | `topicTitle` / `topicTitleAr` (file-level, in each `ch01-t*-content.json`) |
| 2 | Learning objective | `instructorScript.learningObjectives[]` — **the only source for this field; see §6 uncertainty.** |
| 3 | Main idea | `contentBlock` where `blockType: "mainIdea"` (`visibility: "shared"`) — prefer this dedicated, governed block over `instructorScript.mainIdea`, which duplicates the concept without its own governance/provenance wrapper (§6). |
| 4 | Step-by-step conceptual explanation | `contentBlock` where `blockType: "organizedExplanation"` (`visibility: "student"`) |
| 5 | Key equation / equation group | `contentBlock` where `blockType: "equationSet"` (`visibility: "shared"`) |
| 6 | Scientific visual | `contentBlock` where `blockType: "visualReference"`, resolved through its `visualGovernance[]` entry to the matching SVG asset and validation record (§6, §10) |
| 7 | Worked example | `contentBlock` where `blockType: "example"` (`visibility: "student"`) — unstructured prose text, not the same structure as `problem` (§6) |
| 8 | Common misconception | `contentBlock` where `blockType: "misconception"` (**`visibility: "instructor"` — see §0 discrepancy #1 and §7**) |
| 9 | Original problem | the `problem` record (`problemStatement`, `givenValues`, `conceptualInterpretation`, etc.) |
| 10 | Revealable step-by-step solution | same `problem` record's `numberedSolution[]` joined with `calculation[]` by `calculationRef` → `calculationId`, plus `finalAnswer` (§6) |
| 11 | Key concept / summary | **No dedicated block exists for this.** Recommend reusing the `mainIdea` block's text a second time in a distinct, shorter "summary" visual treatment at the end of the page, OR omitting a separate summary section in the MVP and relying on `mainIdea` appearing once, at the top. This is flagged as an open content-architecture question, not silently invented (§6, §20). |
| 12 | Previous/next topic navigation | Derived from the fixed four-topic order (§4), not from any content record. |

No instructional content is rewritten, paraphrased, or duplicated *inside this specification* — the table above names the source field, it does not reproduce the field's text.

## 6. Content-Source Architecture

The pilot JSON files remain the single source of truth. The application never stores a second copy of instructional text; it reads, normalizes, and renders.

**Adapter/normalization layer** sits between the raw JSON and React components:

```
pilot content JSON  →  [ content adapter ]  →  normalized TS model  →  React components
(ch01-t*-content.json,                          (validated, typed,
 visual validation JSON)                         governance-checked)
```

The adapter must:
- Preserve every record ID, `topicId`, source-traceability/provenance link, and correction/conflict reference verbatim — these are audit trail, not cosmetic metadata, and the application must not be a place where that trail can be silently lost.
- Preserve English and Arabic fields as parallel, equally-first-class data — never derive one from the other.
- Preserve `blocking` metadata (`blockingStatus`, `studentFacingAllowed`, etc.) on every normalized record, not just at the topic level, since blocking is recorded per-record, not only per-topic.
- Refuse to render anything as student-facing if the record's own `studentFacingAllowed` is `false` — this is the single most important behavior in the whole application (§7).
- Never copy content strings into `.tsx` component files. Components receive normalized data as props; they contain no topic-specific prose.
- Be topic-agnostic: adding a 5th topic later means adding a JSON file and a topic-registry entry, not touching any page or component.
- Surface JSON validation failures as loud, actionable development-time errors (console + visible dev overlay), not silent `undefined` rendering.

### Proposed normalized TypeScript model (field responsibilities, not implementation)

| Type | Responsibility |
|---|---|
| `LocalizedText` | The atomic bilingual unit. Mirrors the JSON's own repeated `{ text, status, language, direction }` shape (found on nearly every leaf field in the source). Fields: `en: { text, status }`, `ar: { text, status }`, each carrying its own `status` (`"draft"` etc.) since English and Arabic can be at different review states independently. |
| `GovernanceStatus` | Mirrors the source `blocking` object 1:1 (`blockingStatus`, `blockingReason[]`, `studentFacingAllowed`, `instructorFacingAllowed`, `resolutionStatus`, `resolutionRequired`, `resolutionOwner`). Attached to every normalized record type below, not a single topic-level flag, because the source data is not either. |
| `Topic` | `topicId`, `topicTitle: LocalizedText`, `order` (position in the fixed four-topic sequence), and references to its `ContentSection[]`, `EquationBlock`, `VisualAsset`, `WorkedExample`, `Problem`, plus its own file-level `generationStatus`/`generationNote`. |
| `ContentSection` | Normalizes any `contentBlock` (`mainIdea`, `organizedExplanation`, `misconception`, `reviewQuestion`): `blockId`, `blockType`, `visibility` (`"shared" \| "student" \| "instructor"` — preserved, not discarded), `content: LocalizedText`, `governance: GovernanceStatus`, `scientificCorrectionIds[]`. |
| `EquationBlock` | Normalizes the `equationSet` content block. **Field responsibility is uncertain — see uncertainty note below.** At minimum: `blockId`, `expression: LocalizedText` (the raw text as authored), `governance: GovernanceStatus`. |
| `VisualAsset` | Joins a `visualReference` content block with its `visualGovernance[]` entry and (where `visualResolutionId` resolves) the matching validation JSON: `visualId`, `assetPath`, `assetFormat`, `assetStatus`, `availabilityStatus`, `rightsStatus`, `studentFacingAllowed` (from the validation record, which is the authoritative field for the asset itself, distinct from the content block's own `blocking.studentFacingAllowed`), `title`/`desc` text pulled straight from the SVG's own `<title>`/`<desc>` for accessible fallback, not re-authored. |
| `WorkedExample` | Normalizes the `example` content block. Prose-only: `blockId`, `content: LocalizedText`, `governance: GovernanceStatus`. Structurally simpler than `Problem` — see uncertainty note below. |
| `Problem` | `problemId`, `statement: LocalizedText`, `givenValues[]` (`symbol`, `value`, `unit`), `conceptualInterpretation: LocalizedText`, `steps: SolutionStep[]`, `finalAnswer` (`value`, `unit`, `direction`, `interpretation: LocalizedText`), `commonMistake: LocalizedText[]`, `governance: GovernanceStatus`. |
| `SolutionStep` | One entry from `numberedSolution[]` **joined with** its matching `calculation[]` entry via `calculationRef`/`calculationId` (this join does not exist pre-computed in the source JSON — the adapter must perform it): `stepNumber`, `purpose: LocalizedText`, `explanation: LocalizedText`, `expression` (from the matched calculation's `expression`/`substitution`/`result`/`unit`). |

### Uncertainty in the current schema (to resolve during implementation, not silently paper over)

1. **Equations are stored as plain authored text**, e.g. `"a_c = v^2 / r, where v is speed and r is the radius..."` — not as structured `{ lhs, rhs, variables[], units[] }` data. `SCIENTIFIC_CORRECTIONS.json` *does* contain a structured `equations[]` array (`equationId`, `expression`, `meaning`, `units[]`) for its correction records, but this structured form is not mirrored into the per-topic `equationSet` content blocks the UI actually renders from. **Decision needed:** either (a) render `equationSet` as styled prose text with markup-level italic/superscript handling matching the SVG house style (§9), accepting that this is manual per-topic markup, not derived formatting, or (b) author a small structured equation representation for these four topics specifically as part of implementation. Do not invent a structured schema silently — confirm with whoever owns `CANONICAL_DESIGN_SCHEMA.json`.
2. **`example` (worked example) and `problem` records have fundamentally different structures** — `example` is a single prose block; `problem` has fully decomposed steps, given values, and a final answer object. The MVP's "Worked example" page section (§5, #7) will necessarily look and behave differently from its "Original problem" section (§5, #9) because the underlying data actually is different, not because of a UI inconsistency. Do not force them into the same component shape.
3. **`instructorScript` has no `visibility` field at all**, unlike every `contentBlock`. It mixes fields clearly meant for a student-safe "Learning objective" section (`learningObjectives[]`, arguably `mainIdea`, `intuition`) with fields clearly meant to stay internal to an instructor (`instructorOnlyCautions`, `wordForWordTeachingScript`, `slidePageCues`, `questionsToAskStudents`, `expectedStudentResponses`). **Recommendation:** the adapter exposes only an explicit allow-list from `instructorScript` (`learningObjectives`, and no other field) to any non-instructor-mode view, rather than exposing the object wholesale. This allow-list is a product decision to confirm, not a schema fact to trust blindly.
4. **No dedicated "key concept / summary" block exists** (§5, #11) — see the resolution options already noted there.
5. **`t02`'s visual validation record carries a `contentScopeDivergence` object that the other three do not** (§0). The adapter should treat all optional/additive validation fields as optional in its type, not required.

## 7. Governance Enforcement in the Application

The application is a **read-only, internal-review-mode tool.** It enforces the repository's existing governance state; it does not set governance state.

- The app has exactly one mode in this MVP: **internal review.** There is no toggle to a "production" or "public" mode, because no such mode is authorized (§0, discrepancy #2; §3).
- **`studentFacingAllowed: false` is never overridden, ignored, or worked around** — anywhere it is `false` (which is everywhere, today), the content it gates renders behind the same internal-review framing as everything else, never as if it were cleared for a real student audience.
- Student publication remains unauthorized by this application, full stop. Nothing in the MVP changes, sets, or proposes a change to any `studentFacingAllowed` / `studentPublicationAuthorized` value in the source data.
- Draft/Review-Required indicators (mirroring the SVGs' own amber footer band and each record's `blocking.blockingStatus`) remain visible at all times in this MVP — there is no "hide draft banner" setting.
- Content marked `blocked` (which is all of it) is still rendered, but only inside this internal-review tool to its internal audience (§2) — "blocked for student publication" and "invisible to internal reviewers" are different things, and the app must not conflate them.
- **No public-production mode ships in the initial MVP.** Building one is explicitly out of scope (§3, §21) and would additionally require resolving the authorization gap noted in §0.
- Removing any Draft indicator, or treating any topic as finally approved, requires a later, explicit publication decision recorded the same way prior pilot decisions have been (a project-owner-authorized governance record) — the application cannot make or infer that decision from usage patterns, time elapsed, or internal review activity.
- **Application code never writes to any content, visual, or governance file.** The adapter is read-only against `docs/content-design/`. There is no in-app editing surface (§3).
- If a future correction to approved baseline content is needed, it follows the existing `baselineVersion` bump + `revisionLog` entry pattern already used in `ENGLISH_PILOT_BASELINE_APPROVAL.json` / `ARABIC_PILOT_BASELINE_APPROVAL.json` — the application does not provide its own, competing correction workflow.

**Recommendation:** implement this as one centralized governance/feature configuration module (e.g. `src/config/governance.ts`) that every component consults for a single boolean-and-reason answer ("can this be rendered, and why/why not"), rather than scattering `if (blockingStatus === "blocked")` checks through individual components. This keeps the enforcement auditable in one place and matches how the source JSON itself centralizes `blocking` as one sub-object per record rather than several separate flags.

## 8. Bilingual Behavior

- **One language displayed at a time**, by default — not side-by-side (deferred, see below).
- English pages: `dir="ltr"`. Arabic pages: `dir="rtl"`, set at the page root so the whole layout mirrors, not just the text.
- **Equations, Latin variable names, and SI unit symbols stay LTR even inside an Arabic-language page** — matching exactly how the four SVGs already isolate every equation/formula element as its own `direction="ltr"` node, per `VISUAL_HOUSE_STYLE.md` §3–4. The web UI must replicate this isolation (e.g. `<span dir="ltr">` wrapping any embedded Latin/formula fragment inside Arabic prose), not rely on the browser's default bidi algorithm to get it right unassisted.
- **SVG files retain their own internal `direction` metadata as authored** — the viewer embeds them unmodified; it does not attempt to re-flow or re-localize SVG internals at runtime.
- The language toggle changes **UI chrome labels and content together**, atomically — there is no intermediate state where the interface is in English but content is in Arabic or vice versa.
- **Language state is session-local for this MVP** (in-memory or `sessionStorage`) — not synced to any account, not persisted across devices, consistent with no backend/no accounts (§3).
- **Bilingual side-by-side mode (both languages visible at once) is explicitly deferred** — not built, not stubbed, not partially implemented.

**Specific handling:**
| Concern | Handling |
|---|---|
| Arabic punctuation | Rendered as authored in the source `ar` text fields; no runtime substitution or "correction" of punctuation. |
| English abbreviations inside Arabic content | Wrapped `dir="ltr"` inline, matching the SVG legend convention already established (single Latin symbols/abbreviations named inside otherwise-Arabic prose — see `VISUAL_HOUSE_STYLE.md` §3). |
| Equations embedded between Arabic sections | Equation block is its own isolated `dir="ltr"` element positioned between Arabic prose blocks — never interleaved character-by-character. |
| Latin SI unit symbols | Upright, `dir="ltr"`, never transliterated into Arabic script. |
| Ordered/unordered lists | Arabic lists use RTL list mirroring (marker position flips with `dir="rtl"`); list *content* follows the same per-item bilingual rules above. |
| Previous/next direction in RTL mode | The semantic meaning ("go to the next topic in sequence") stays fixed to the governance-defined order (§4) regardless of language; only the *visual* left/right placement of the controls mirrors with `dir`. Do not let RTL layout invert which topic "next" actually points to. |
| Accessibility labels in both languages | Every interactive control (`LanguageToggle`, `SolutionReveal`, `TopicNavigation`, visual-viewer open/close) has an `aria-label` sourced from the same bilingual content system as visible text, in the currently active language — not English-only labels under an Arabic UI. |

**No automatic machine translation at runtime**, anywhere. Arabic content is only ever the authored `ar` fields already present in the source JSON.

## 9. Scientific Equation Rendering

**Recommendation: semantic HTML with controlled typography — not KaTeX, not MathJax — for this MVP's actual content.**

**Why:** every equation in these four topics' `equationSet` blocks (`f = 1/T, T = 1/f`; `a = -g` / `a = +g`; `a_c = v²/r`; the length/area/volume `k`, `k²`, `k³` relationships) is a short, single-line expression using only italic variables, upright units, and simple superscripts/subscripts — exactly the notation already hand-built successfully as SVG `<tspan>` markup across all four pilot visuals (`VISUAL_HOUSE_STYLE.md` §3). None of the four topics contains multi-line derivations, matrices, integrals, summations, fractions-as-stacked-notation, or anything else that would need a real math-typesetting engine to render correctly.

**Tradeoffs:**
| Option | For | Against (for this MVP) |
|---|---|---|
| Semantic HTML (`<em>`/`<i>` for variables, `<sup>`/`<sub>` for exponents/subscripts, plain text for units) | Zero new dependency; trivially matches the exact notation already proven in the SVGs; fully accessible as real text (screen readers, copy-paste, find-in-page all work); fastest to implement and test. | Requires each equation to be hand-marked-up once (not derived automatically from the plain-text source string — see §6 uncertainty #1); would not scale to genuinely complex notation. |
| KaTeX | Handles arbitrary LaTeX-like notation; fast rendering; more "authoritative" math typesetting. | New dependency solving a problem this content doesn't have; requires converting every existing equation string to LaTeX source; adds a rendering pipeline and bundle size for zero content that needs it. |
| MathJax | Most complete LaTeX/MathML support. | Heaviest of the three options; solves problems (multi-line derivations, complex operators) absent from all four pilot topics; slowest to render; clearly disproportionate to the actual content. |

**Requirements regardless of approach** (all achievable with the recommended semantic-HTML approach):
- Variables italic, units upright — direct carry-over of the already-proven SVG rule.
- True `<sup>`/`<sub>` elements for exponents and subscripts (e.g. `a<sub>c</sub> = v<sup>2</sup>/r`), never Unicode superscript characters and never a visually-faked offset with CSS alone divorced from semantic markup.
- Equation elements isolated as their own `dir="ltr"` node (§8).
- No malformed bidi rendering — verified by placing every equation block inside an actual Arabic-language page during testing (§17, §18), not assumed from the LTR isolation alone.
- An accessible text alternative equivalent to the visible notation (for equations, well-marked-up semantic HTML *is* the accessible text — no separate alt-text layer is needed, unlike the SVG visuals in §10, which are images).
- **No equation is ever delivered only as a rasterized/embedded image** — text-based semantic HTML only for equation blocks, distinct from the SVG diagrams (§10), which are appropriately images because they are diagrams, not equations.

If a future chapter introduces genuinely complex notation, KaTeX is the natural upgrade path — this recommendation is scoped to what these four topics actually contain, not a permanent architectural ceiling.

## 10. Visual Rendering

The four existing SVGs (`ch01-t02/t03/t08/t10-visual-001.svg`) are used exactly as they are — embedded, not recreated, not manually re-translated, not redrawn for mobile.

**The visual viewer must:**
- Render each SVG at its authored aspect ratio (`t02`: 1100×850, `t03`: 900×680, `t08`/`t10`: 1000×1000) — no forced square cropping or uniform sizing across topics.
- Avoid blindly shrinking a wide diagram to fit a narrow container — a naive `width:100%` shrink was directly tested and confirmed to make `t10`'s labels illegible at 375px (§0, `VISUAL_HOUSE_STYLE.md` §7).
- Support a zoom or fullscreen inspection mode as the primary answer to "the desktop canvas doesn't fit this screen" (§11).
- Support horizontal or contained overflow (scrollable/pannable container) as a fallback where fullscreen is not the chosen interaction.
- Remain usable on desktop, tablet, and projector at native or near-native size, where all four assets are already legible per their own validation records.
- Provide a **deliberate** mobile strategy (§11) — not an accidental one.
- Preserve the SVG's own `role="img"`, `<title>`, and `<desc>` — the viewer does not strip or replace this accessibility metadata; it can additionally surface `<desc>` as visible or screen-reader-only text near the viewer if useful, but never in place of the SVG's own metadata.
- **Retain the visible internal Draft footer band inside the SVG during the MVP** — the viewer does not crop, mask, or hide the amber "DRAFT — REVIEW REQUIRED" band that is already part of each asset.
- Provide a fallback (e.g. a text notice plus the `<desc>` content) if an SVG fails to load, rather than a broken-image icon or blank space.

**This MVP must document, visibly, that the current visuals are not finally human-approved.** Every one of the four visual validation records has `readyForHumanReview: true` but `reviewer: null` and `reviewedAt: null` — drawn but not yet reviewed by a human. The viewer's own chrome (not just the SVG's internal footer) should reflect this status, consistent with §7's centralized governance approach.

## 11. Responsive UX

| Breakpoint | Expected behavior |
|---|---|
| Mobile (~375px) | Full page usable in a single column. The SVG visual is **not** shown shrunk-to-illegible inline; instead it opens in the fullscreen/zoom viewer on tap (§10). All other sections (explanation, equations, worked example, problem, solution) reflow to single-column text at normal, readable size. |
| Tablet (~768px) | Single or lightly multi-column layout; the SVG can be shown inline at a size that keeps its own text legible (informed by each asset's actual native size — `t03` at 900px wide fits more comfortably inline at this breakpoint than `t02` at 1100px), with the same fullscreen/zoom affordance still available. |
| Desktop (~1280px) | Full layout, SVGs shown inline near-native size, equation panel and captions at their designed proportions. |
| Classroom projector / wide display | Same as desktop, with attention to large-distance legibility — this is already a target the SVGs were designed against (`VISUAL_HOUSE_STYLE.md` §7: "designed for classroom-projector and standard student-screen viewing"), so the web chrome around them should not undermine that with low-contrast or undersized surrounding UI text. |

**The mobile design must not reduce the full desktop SVG to unreadable inline text.** Recommended mobile visual experience (combine as needed, do not require all): tap-to-open fullscreen viewer as the primary pattern; pinch/controlled zoom once open; horizontal pan inside a bounded viewer for very wide assets (`t02`) if fullscreen alone isn't sufficient; a separate, always-readable caption/summary line outside the SVG itself so the core teaching point isn't lost even before a student opens the viewer.

**No mobile-specific SVG redraws are required or recommended for this MVP** — the four assets stay exactly as validated; only their *presentation container* adapts by screen size.

## 12. Accessibility

| Requirement | Automated check possible? |
|---|---|
| Semantic headings (`h1`/`h2`/etc. reflecting §5's section order) | Yes — automatable (e.g. axe-core heading-order rule) |
| Full keyboard navigation (tab order through nav, toggle, reveal, viewer) | Partially — tab-reachability is automatable; sensible tab *order* needs manual review |
| Visible focus states on every interactive element | Partially — presence is automatable (no `outline: none` without replacement); adequacy is manual |
| Accessible, bilingual language-toggle labels | Manual (content correctness) + automatable (label presence) |
| Correct `lang` and `dir` attributes, updated on toggle | Yes — automatable |
| Descriptive button labels (not "Click here") | Manual |
| Answer reveal fully keyboard-usable (open/close via Enter/Space, not mouse-only) | Automatable (interaction testing) |
| No information conveyed by color alone | Manual — direct carry-over of the same rule already proven in the SVGs (`VISUAL_HOUSE_STYLE.md` §7: color + line-style + legend, never color alone) |
| Text contrast ≥ 4.5:1 | Automatable (contrast-checking tools), and already demonstrated feasible: the `t10` visual-review process measured and corrected a real 4.30:1 failure to 4.567:1 using exactly this method (§0) |
| Graphical contrast ≥ 3:1 where applicable | Automatable for solid colors; same precedent as above (`t10`'s radius-line fix, 2.359:1 → 3.186:1) |
| SVG `<title>`/`<desc>` preserved | Automatable (structural check that the viewer doesn't strip these nodes) |
| Reduced-motion preference respected | Automatable (`prefers-reduced-motion` media query honored) |
| No unnecessary animation | Manual judgment; MVP default should be no motion beyond simple, respectful transitions (reveal/collapse, viewer open/close) that already honor reduced-motion |

**Manual-review-only items:** actual Arabic screen-reader experience, actual tab-order sensibility, actual color/contrast *in context* (automated tools check pairs, not composed layouts), and cross-browser Arabic shaping (§8, §20) — none of these can be fully substituted by automation.

## 13. Recommended Technical Architecture

**No existing frontend scaffold was found anywhere in the repository (§0)** — this is a from-scratch recommendation, not a fit-to-existing-code decision.

**Preferred default stack:** React + Vite + TypeScript + React Router + plain CSS/CSS Modules + static JSON/SVG assets. No backend, no database, no authentication — this matches §3's exclusions exactly and is proportionate to the actual MVP scope (a read-only, local-first, four-topic renderer). No dependency is added beyond this set unless a demonstrated need appears during implementation (§9 already rejects KaTeX/MathJax on exactly this principle).

**Recommended folder structure** (naming only — nothing created in this task):

| Directory | Responsibility |
|---|---|
| `src/app` | App-level bootstrap: router setup, providers (language context), top-level error boundary. |
| `src/components` | Generic, reusable, content-agnostic UI primitives shared across pages (buttons, banners, toggles). |
| `src/pages` | Route-level components (`ChapterLandingPage`, `TopicDetailPage`) — composition only, no business logic or embedded content. |
| `src/features/topics` | Topic-domain-specific components that are more than generic UI but not full pages: `TopicCard`, `TopicNavigation`, `ProblemCard`, `SolutionReveal`, etc. (§14). |
| `src/content` | Read-only references/loaders for the actual pilot JSON and SVG files — this layer knows *where* the source of truth lives (`docs/content-design/chapter-01/...`) so nothing else needs to. |
| `src/adapters` | The normalization layer from §6 — raw JSON in, typed/validated `Topic`/`ContentSection`/etc. out. |
| `src/types` | The TypeScript model from §6 (`Topic`, `LocalizedText`, `ContentSection`, `EquationBlock`, `VisualAsset`, `WorkedExample`, `Problem`, `SolutionStep`, `GovernanceStatus`). |
| `src/styles` | Global CSS, design tokens matching `VISUAL_HOUSE_STYLE.md`'s palette (teal/rust-orange/violet/slate/amber), RTL/LTR base rules. |
| `src/assets` | Any app-owned static assets (icons, fonts) — **not** a copy of the pilot SVGs, which are read from `docs/content-design/` in place (§6: never copy content into the app). |
| `src/config` | The centralized governance/feature configuration from §7, plus the fixed topic-order/registry from §4. |
| `src/tests` | Test suite per §18. |

## 14. Component Model

| Component | Purpose | Primary inputs | Directionality concerns | Accessibility considerations |
|---|---|---|---|---|
| `AppShell` | Top-level layout: header, banner, routed content, footer. | children/route outlet | Sets `dir`/`lang` at the root based on active language. | Landmark regions (`header`, `main`, `nav`); skip-to-content link. |
| `InternalStatusBanner` | Persistent internal-review/draft notice (§7, §10). | governance summary (from `src/config`) | Bilingual text, direction-aware. | Non-dismissible or reset-on-reload; sufficient contrast against amber background per §12. |
| `LanguageToggle` | Switches active language app-wide (§8). | current language | Triggers root `dir`/`lang` change. | `aria-pressed`/role reflecting current state; bilingual `aria-label`. |
| `ChapterTopicList` | Renders the four `TopicCard`s in governance order (§4). | `Topic[]` (normalized) | List mirrors under RTL. | List semantics (`<ul>`/`<li>` or equivalent); heading precedes list. |
| `TopicCard` | Summary + link into a topic (§4). | one `Topic` | Card content direction follows active language. | Whole card keyboard-focusable and activatable, not just a nested link. |
| `TopicPage` | Composes the full §5 section order for one topic. | `topicId` (route param), resolved `Topic` | Whole-page `dir` inherited from `AppShell`. | Heading hierarchy matches §5's order; §12 requirements apply page-wide. |
| `ContentSection` | Generic renderer for a `mainIdea`/`organizedExplanation`/etc. block. | `ContentSection` (normalized), governance | Bilingual text block, direction-aware. | Section has its own heading; respects `visibility`/governance before rendering (§7). |
| `EquationBlock` | Renders one equation per §9's semantic-HTML approach. | `EquationBlock` (normalized) | Always its own isolated `dir="ltr"` node regardless of page language (§8). | Real text, not an image; readable by screen readers and copy-paste. |
| `VisualViewer` | Embeds an SVG inline plus fullscreen/zoom control (§10). | `VisualAsset` (normalized) | Container direction follows page; SVG's own internal direction is untouched. | Preserves SVG `role`/`title`/`desc`; fullscreen toggle keyboard-operable and focus-trapped while open. |
| `WorkedExample` | Renders the `example` block's prose (§6). | `WorkedExample` (normalized) | Bilingual prose block. | Own heading; no interactive state (unlike `ProblemCard`). |
| `MisconceptionCallout` | Renders the `misconception` block, visually distinct as a callout. | `ContentSection` (normalized) | Bilingual prose block. | Distinguished by more than color alone (icon/label + border, per §12); respects `visibility: "instructor"` gating decision from §0/§7. |
| `ProblemCard` | Renders the problem statement and given values; hosts `SolutionReveal`. | `Problem` (normalized) | Bilingual statement; numeric values/units stay LTR (§8). | Clear labeling of "given" vs. "find"; problem statement itself always readable without requiring reveal interaction. |
| `SolutionReveal` | Toggles visibility of `SolutionStep[]` and `finalAnswer`. | `SolutionStep[]`, `finalAnswer` | Bilingual step text; equations/values inside steps stay LTR. | Real disclosure widget (`aria-expanded`, keyboard Enter/Space-operable, §12) — not a hover-only or mouse-only interaction. |
| `TopicNavigation` | Previous/next controls (§4). | current `topicId`, fixed order | Semantic "next" fixed to governance order regardless of RTL/LTR visual mirroring (§8). | Buttons/links labeled with the actual destination topic title, not just "Next". |
| `ErrorState` | Fallback UI for §16's error conditions. | error type/message (dev-safe) | Bilingual where the error is user-facing; direction-aware. | Never a raw stack trace in the rendered UI (§16); clear, actionable message. |

## 15. State Management

Expected MVP state is small and local:

- **Active language** — React state (e.g. context) at the `AppShell` level, session-local (§8).
- **Current route** — owned by React Router; `topicId` comes from the URL, not duplicated into component state.
- **Solution expanded/collapsed** — local component state inside `SolutionReveal`, one instance per topic page, reset on navigation (not persisted).
- **Visual viewer open/closed** — local component state inside `VisualViewer`.

**Recommendation: plain React state + URL routing, nothing else.** No Redux, no global state library, no backend persistence, no student-progress storage — none of the four state items above need cross-component sharing beyond simple context (language) or straightforward local state (reveal/viewer toggles), and no existing architecture in this repository (there is none — §0) creates a demonstrated need for more.

## 16. Error Handling and Validation

| Condition | Behavior |
|---|---|
| Unknown `topicId` in the route | `ErrorState`: "Topic not found," with a link back to `/chapter/1`. Never a blank page or unhandled crash. |
| Missing Arabic localization on a field | Render the English field with a visible, non-alarming inline note that Arabic is not yet available for this field (do not silently fall back to English with no indication — that would misrepresent bilingual completeness). |
| Missing visual asset | `VisualViewer` shows its load-failure fallback (§10) — the SVG's own `<desc>` text as a substitute description if resolvable, otherwise a generic "visual unavailable" notice. |
| Invalid JSON record (fails adapter validation) | Development: loud console error naming the file, record ID, and validation failure. Production/internal-review UI: `ErrorState` for just that section, not a whole-page crash — one bad record should not take down the rest of a working topic page. |
| Unsupported `blockType` | Adapter logs and skips the block with a dev-visible warning; the page renders everything it does understand rather than failing entirely. |
| Blocked / publication-restricted content | Rendered per §7's governance rules (visible in internal-review mode, never presented as student-cleared) — this is expected, normal, everyday state for this MVP, not an error. |
| SVG load failure (network/parse) | Same as "missing visual asset" fallback above. |
| Malformed equation field | `EquationBlock` falls back to rendering the raw text unstyled (readable, ungarbled) rather than crashing or producing broken markup — degraded typography is acceptable; a broken page is not. |

**No raw stack traces in the user-facing UI**, ever, including in internal-review mode — actionable messages only; full detail goes to the console/dev tools.

**Recommended development-time schema validation:** given the source schema's high actual consistency (§0) but real, documented edge cases (§6 uncertainties), a lightweight validation approach is proportionate:
- **TypeScript guards** (`function isEquationBlock(x: unknown): x is EquationBlockRaw`) for the common, well-understood shapes — zero dependency cost, sufficient for most of this schema's uniformity.
- **Zod** (or similar) only if the adapter needs to validate deeply nested, variably-optional structures (e.g. the `problem` record's many optional sub-objects) with good error messages — worth the small dependency if hand-written guards start duplicating a lot of structural logic.
- **Recommendation: start with hand-written TypeScript guards; add Zod only if guard code becomes unwieldy during implementation.** Do not add Zod speculatively before that need is demonstrated (§13's dependency principle).

## 17. Acceptance Criteria

**Functional**
- All four topic routes (`ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`) load without error.
- `/chapter/1` lists exactly four topic cards, no more, no fewer, in governance order.
- Previous/next navigation follows the fixed order `t02 → t03 → t08 → t10` and is correctly disabled at both ends.
- Solution reveal works by mouse click and by keyboard (Enter/Space) and correctly toggles back to hidden.

**Bilingual**
- English and Arabic content on every topic page render from the source JSON's `en`/`ar` fields, not from any hardcoded or duplicated string.
- Language switching updates `dir`/`lang` at the document root and updates all visible UI chrome and content together, with no intermediate mismatched state.
- Arabic shaping (cursive joining, correct RTL glyph order) renders correctly in the actual target delivery browser — verified manually, not assumed (§8, §18).

**Scientific-rendering**
- Equations remain LTR-isolated inside Arabic-mode pages, with no visible bidi mangling.
- Variables render italic, units render upright, exponents/subscripts render as true `<sup>`/`<sub>` on every equation across all four topics.

**Responsive**
- All four SVGs load and display at their correct aspect ratio on desktop, tablet, and projector-scale viewports.
- On a narrow (~375px) viewport, visuals are inspectable via the fullscreen/zoom viewer rather than rendered as illegible shrunk inline text.
- Desktop, tablet, mobile, and projector layouts are each usable without horizontal scroll of the page itself (contained overflow inside the visual viewer is acceptable; the page shell is not).

**Accessibility**
- Every interactive control is reachable and operable by keyboard alone.
- Automated contrast checks pass at ≥4.5:1 text / ≥3:1 graphical on the app's own chrome (the embedded SVGs' internal contrast is governed separately by `VISUAL_HOUSE_STYLE.md` and each asset's own validation record).
- SVG `<title>`/`<desc>` remain present and unaltered in the rendered DOM.

**Governance**
- Draft/Review-Required status remains visible on every topic page and on the visual viewer at all times.
- No code path can render any record as student-cleared when its `studentFacingAllowed` is `false` — verified by a direct test asserting this for every one of the four topics' records (§18).
- No public deployment is performed as part of this MVP's build/verification (§3, §21).

**Content-integrity**
- No instructional content (explanations, equations, examples, problems, solutions) is duplicated or rewritten inside any React component file — verified by confirming components receive this content only as props/adapter output, never as literal strings in `.tsx` source (§6).
- Missing content (a field absent or unlocalized) shows the controlled fallback from §16, never a blank section with no explanation.

## 18. Testing Strategy

| Test type | Covers |
|---|---|
| Content-adapter unit tests | Raw JSON → normalized model transforms for all four topics; the `numberedSolution`/`calculation` join (§6); governance-field pass-through. |
| Route tests | All three routes (§4) resolve; unknown `topicId` hits `ErrorState`, not a crash. |
| Language-direction tests | Toggling language flips `dir`/`lang` at the root; equation blocks stay `dir="ltr"` regardless of page language. |
| Component interaction tests | `LanguageToggle`, `TopicNavigation`, `VisualViewer` open/close respond correctly to click and keyboard input. |
| Answer-reveal tests | `SolutionReveal` toggles correctly via mouse and keyboard; initial state is always collapsed. |
| Missing-content fallback tests | Each §16 condition (missing Arabic, missing visual, invalid record, unsupported block type) triggers its specified fallback, not a crash. |
| Governance-flag tests | For every one of the four topics' records, assert `studentFacingAllowed === false` is respected end-to-end (no rendering path bypasses it). |
| SVG-render smoke tests | All four SVGs mount without console errors and expose their `title`/`desc` nodes in the DOM. |
| Manual Arabic-render review | Actual visual inspection of Arabic shaping/RTL layout in the real target browser(s) — not substitutable by automated tests (§8, §12). |
| Manual responsive review | Actual inspection at the four breakpoints in §11, including projector-scale, since automated viewport tests can check layout metrics but not true legibility/usability. |

**Recommended minimal test stack**, compatible with §13's Vite/TypeScript choice and adding nothing unproven: **Vitest** (unit/component tests, native Vite integration) + **React Testing Library** (component interaction, accessibility-oriented queries). No end-to-end browser automation framework is recommended for this MVP's scope — the manual review items above cover what E2E would otherwise be reached for, at lower setup cost, given the small, fixed (four-topic) surface area. **Nothing in this section is installed as part of this task.**

## 19. Implementation Sequence

| Phase | Deliverables | Dependencies | Completion criteria |
|---|---|---|---|
| **0 — Repository verification** | Confirmed project structure, content/asset paths, absence of conflicting scaffold (this has already been performed for this spec — §0) | None | Findings match §0's table; any new discrepancy since this spec was written is re-documented before Phase 1 starts. |
| **1 — Application scaffold** | React/Vite/TypeScript project initialized; React Router configured with the three routes (§4); global styles baseline; `InternalStatusBanner` visible on every route | Phase 0 complete; **explicit build authorization obtained (§0, discrepancy #2)** | App boots locally, shows the banner and empty routed pages, no console errors. |
| **2 — Content layer** | TypeScript models (§6); JSON adapter; validation guards (§16); topic registry (§4/§13) | Phase 1 | Adapter correctly normalizes all four topics' JSON with no validation errors on the known-good data, and demonstrably fails loudly (not silently) on a deliberately malformed test fixture. |
| **3 — Core pages** | `ChapterLandingPage` with four `TopicCard`s; `TopicPage` route wired to real data; `TopicNavigation` | Phase 2 | Navigating `/` → `/chapter/1` → any topic → previous/next works end-to-end with real content, in the governance order. |
| **4 — Bilingual rendering** | `LanguageToggle`; RTL/LTR layout switching; equation LTR isolation inside Arabic pages; localized UI chrome labels | Phase 3 | Full topic page renders correctly in both languages, verified against §17's bilingual acceptance criteria. |
| **5 — Learning components** | `ContentSection`, `EquationBlock`, `VisualViewer`, `WorkedExample`, `MisconceptionCallout`, `ProblemCard`, `SolutionReveal`, all per §14 | Phase 4 | Every §5 page section renders from real data for all four topics; solution reveal fully interactive. |
| **6 — Responsive and accessible delivery** | Mobile visual viewer strategy (§11); keyboard interaction pass; contrast/focus verification; projector-scale review | Phase 5 | §17's responsive and accessibility acceptance criteria pass at all four breakpoints. |
| **7 — Internal QA** | All four topics manually verified end-to-end; source traceability spot-checked against the JSON; governance restrictions re-confirmed; remaining known issues documented | Phase 6 | §17's acceptance criteria pass in full; a short internal QA note lists anything deferred, matching §21's future-phase boundary. |

## 20. Risks and Open Decisions

| Item | Category |
|---|---|
| Current visuals are not finally human-approved (`reviewer: null` on all four validation records) | **Established by governance** — the app must display this state, not resolve it. |
| Mobile readability of wide SVGs at native size is confirmed poor (`t10`'s direct 375px simulation) | **Established by evidence** — §10/§11's viewer strategy is the implementation answer. |
| Cross-browser Arabic shaping has only been checked in one authoring browser, for all four assets and (once built) the app itself | **Unresolved** — requires manual verification in each actually-targeted delivery browser during implementation (§8, §18). |
| Bidi behavior around equations embedded in Arabic pages is untested outside the SVGs (which have their own proven isolation pattern — the *web* implementation of the same pattern is new and untested) | **Unresolved** — first real test happens in Phase 4/6. |
| Schema variability between record/validation types (§0, §6) — optional fields present on some assets' validation records but not others, `instructorScript` lacking a `visibility` field, equations as plain text rather than structured data | **Unresolved implementation decisions** — flagged with recommended defaults in §6, not silently decided. |
| Untracked repository files: the entire `docs/` tree (including every pilot content, visual, and governance file this spec depends on) is currently untracked in git (`?? docs/`), with no commit protecting any of it | **Established by observation, not this spec's to fix** — worth flagging because the application's "source of truth" currently has no version-control safety net; any accidental deletion or edit outside this pipeline is unrecoverable via git today. |
| Lack of git protection for current work (same root cause as above) | **Established by observation** — a recommendation, not a decision this spec can make. |
| Accidental public rendering of blocked content | **Implementation recommendation** — mitigated by §7's centralized governance module and the plain fact that no public-production mode exists in this MVP's scope (§3) to accidentally expose through. |
| Future scale to the full (14-topic) Chapter 1 | **Decision needed from the project owner**, informed by this MVP's outcome — §6's topic-agnostic adapter design and §13's folder structure are built to make this addition mechanical (new JSON + registry entry) *if* the decision to proceed is made, but that decision itself is out of this spec's scope. |
| **Building this application at all is not yet covered by any existing authorization record** (§0, discrepancy #2) | **Decision needed from the project owner** — the single most important open item in this list; nothing in §19 should begin until this is resolved. |
| Whether `visibility: "instructor"` content (the `misconception` block) should render inside this internal-only MVP, and how it should be visually distinguished if so | **Decision needed from the project owner** — §0 discrepancy #1 lays out the reasoning; a default recommendation is given in §7/§14, but it is a recommendation, not a governance fact already established. |
| Resolution of §5's missing "key concept/summary" source block, and §6's `instructorScript`-field allow-list | **Implementation recommendations offered, confirmation recommended** before Phase 5 locks in the final component behavior. |

## 21. Future Phases (explicitly out of this MVP)

Full Chapter 1 (remaining ten topics) · persistent student progress · quizzes and a question bank · a distinct instructor mode · a distinct student mode · analytics · authentication · a backend · any deployment · a content-management/editing workflow inside the app · additional chapters beyond Chapter 1.

None of these are designed, stubbed, or scaffolded for in this MVP. Where this specification's architecture happens to make a later addition easier (e.g. the topic-agnostic adapter in §6), that is a byproduct of sound design, not a commitment to build any of the above.

## 22. Final Implementation Recommendation

- **Recommended stack:** React + Vite + TypeScript + React Router + plain CSS/CSS Modules, reading static JSON and SVG assets directly from `docs/content-design/chapter-01/`. No backend, database, or authentication (§13).
- **Recommended route structure:** `/` (internal landing) → `/chapter/1` (four topic cards, governance order) → `/chapter/1/topic/:topicId` (the four real topic IDs as route params) (§4).
- **Recommended content-adapter approach:** a single read-only normalization layer (§6) converting the existing pilot JSON into the typed model in §6, preserving every ID, governance flag, and bilingual field losslessly, with development-time validation via hand-written TypeScript guards (escalating to Zod only if that becomes unwieldy) (§16).
- **Recommended first implementation milestone:** Phase 3 of §19 — a working chapter landing page and one fully data-driven topic page (suggest `ch01-t02`, the first in governance order) rendering real content end-to-end in English only, before bilingual and responsive work begins. This proves the adapter and page architecture before compounding it with direction-switching and viewport work.
- **Exact definition of MVP completion:** every acceptance criterion in §17 passes, across all four topics, in both languages, at all four breakpoints in §11, with governance enforcement (§7) verified by test (§18), and the Phase 7 internal QA note (§19) filed with no unresolved blocking issues.
- **Exact conditions that must be met before any student-facing deployment (of any kind, to any audience beyond the internal reviewers in §2):**
  1. An explicit project-owner authorization to build and run this application exists (resolving §0 discrepancy #2) — a prerequisite for implementation, separate from and prior to publication.
  2. Every one of the four visuals has an actual human review recorded (`reviewer` and `reviewedAt` populated, not `null`) in its validation JSON.
  3. The relevant content records' `studentFacingAllowed` and the chapter-level `studentPublicationAuthorized` flags are explicitly changed to `true` by the project owner, through the same governance process already used for every other authorization in this repository — never inferred, defaulted, or set by application code.
  4. The `visibility: "instructor"` question (§0 discrepancy #1, §20) is explicitly resolved for any content that would be shown to a genuinely public/student audience, not just an internal reviewer.
  5. This MVP's own acceptance criteria (§17) have passed in full — a deployment decision should not be the first time these are checked.

None of these five conditions are met today, and this specification does not attempt to meet them.
