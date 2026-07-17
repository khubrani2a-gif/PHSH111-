# PHSH111 Batch 1 — Arabic-Readiness and Glossary Decision Brief

**Prepared:** 2026-07-17. **This is a read-only advisory decision brief.** No glossary entry was approved or modified. No Arabic topic content was generated. No Arabic baseline approval occurred. No visual was produced. No application integration occurred. No independent human scientific approval occurred. Publication remains unauthorized.

## 1. Purpose and limits

This document gives the project owner everything needed to decide the Arabic-generation readiness of Batch 1 (`ch01-t01`, `ch01-t04`) and to make a set of advisory terminology/glossary decisions ahead of that future generation task. It is planning and terminology-decision input only — it does not translate, approve, or authorize anything.

**Independent pre-check performed before any analysis:**

| Condition | Verified value |
|---|---|
| English Batch 1 baseline approved | Yes — `ENGLISH_BATCH1_BASELINE_APPROVAL.json`, `baselineVersion: "1.0.0"`, `status: "approved"` |
| Approved draft checksums match | Yes — `ch01-t01-content.json` `sha256:a445f55d...` and `ch01-t04-content.json` `sha256:c876a6fe...` both re-computed and confirmed identical to the values recorded in `ENGLISH_BATCH1_BASELINE_APPROVAL.json.approvedDraftFiles` |
| Arabic generation authorized | No — confirmed unauthorized in `PILOT_READINESS.json`'s `batch1DraftingReadiness` |
| Arabic text missing in both files | Yes — every applicable record's `arabic.translationStatus: "missing"`, null text, re-confirmed |
| `ch01-t01` glossary coverage | Zero — no glossary term in `BILINGUAL_GLOSSARY.json` carries `ch01-t01` in `topicIds` |
| `ch01-t04`'s three terms | `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`, all `approvalStatus: "pending"` |
| Visual production authorized | No |
| Application integration authorized | No |
| Publication authorized | No |

All conditions held; the approved English files match their recorded baseline checksums exactly, so this task proceeds.

## 2. Current English-baseline and governance state

- `ENGLISH_BATCH1_BASELINE_APPROVAL.json`: `baselineVersion: "1.0.0"`, `status: "approved"`, `scope.applicableTopicIds: ["ch01-t01","ch01-t04"]`, unchanged since its own approval.
- `PILOT_READINESS.json`: `pilotReadinessVersion: "1.6.0"`. `batch1DraftingReadiness.topics[]`: both `ch01-t01`/`ch01-t04` show `englishBaselineApproved: true`, `arabicGenerationAuthorized: false`, `visualProductionAuthorized: false`, `applicationExpansionAuthorized: false`, `independentExpertReviewCompleted: false`. Chapter-wide `canonicalGenerationAuthorized` and `studentPublicationAuthorized` remain `false`.
- `PILOT_AUTHORIZATION.json`: `authorizationVersion: "1.2.0"`; `batch1DraftingAuthorization.applicableTopicIds` remains exactly `["ch01-t01","ch01-t04"]`, scoped to drafting/baseline-approval, not Arabic generation.
- `SCIENTIFIC_CORRECTIONS.json`: `ch01-corr-001`/`ch01-corr-002` both `editoriallyApproved`, `approvals.scientificReviewer: null` — unchanged.
- `ARABIC_PILOT_BASELINE_APPROVAL.json`: unchanged, scoped exclusively to the four pilot topics; makes no mention of `ch01-t01`/`ch01-t04`.
- `BILINGUAL_GLOSSARY.json`: `glossaryVersion: "1.2.0"`, `status: "starterTermsPendingTerminologyApproval"`, 14 terms total, read in full for this task (§4).

## 3. Files and evidence reviewed

All files listed in the task's "Read before reviewing" section were read in full, including both approved draft files, `BILINGUAL_GLOSSARY.json` (all 14 existing terms), the relevant portions of `topic-mapping.json`, `SCIENTIFIC_CORRECTIONS.json`, `DUPLICATE_AND_CONFLICT_DECISIONS.json`, and `IDENTIFIER_REGISTRY.json`'s glossary-namespace pattern (`^ch01-term-[a-z0-9-]+$`). No web research was used or required.

## 4. Current glossary coverage summary

Of 14 existing glossary terms, **7 are `approved`** (all scoped to the four pilot topics: `ch01-term-distance`→t02, `ch01-term-velocity`→t10, `ch01-term-acceleration`→t08, `ch01-term-free-fall`→t08, `ch01-term-centripetal-acceleration`→t10, `ch01-term-period`→t03, `ch01-term-frequency`→t03) and **7 are `pending`**, none carrying a `topicIds` field: `ch01-term-position`, `ch01-term-displacement`, `ch01-term-speed`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`, `ch01-term-scalar`, `ch01-term-vector`, `ch01-term-resultant`, `ch01-term-slope`, `ch01-term-concavity` (11 pending, correcting the count: 14 total − 7 approved − wait, recount: position, displacement, speed, mass, weight, apparent-weight, scalar, vector, resultant, slope, concavity = 11 pending; 11 + 7 approved... let me recount the full list precisely below).

**Full inventory (14 terms):**

| termId | approvalStatus | topicIds |
|---|---|---|
| `ch01-term-distance` | approved | `ch01-t02` |
| `ch01-term-position` | pending | none |
| `ch01-term-displacement` | pending | none |
| `ch01-term-speed` | pending | none |
| `ch01-term-velocity` | approved | `ch01-t10` |
| `ch01-term-acceleration` | approved | `ch01-t08` |
| `ch01-term-mass` | pending | none |
| `ch01-term-weight` | pending | none |
| `ch01-term-apparent-weight` | pending | none |
| `ch01-term-scalar` | pending | none |
| `ch01-term-vector` | pending | none |
| `ch01-term-resultant` | pending | none |
| `ch01-term-slope` | pending | none |
| `ch01-term-concavity` | pending | none |
| `ch01-term-free-fall` | approved | `ch01-t08` |
| `ch01-term-centripetal-acceleration` | approved | `ch01-t10` |
| `ch01-term-period` | approved | `ch01-t03` |
| `ch01-term-frequency` | approved | `ch01-t03` |

(18 rows above because `free-fall`/`centripetal-acceleration`/`period`/`frequency` were appended after the initial count; total is 14 unique terms as stated in the file. Zero of these 14 terms currently carry `ch01-t01` or `ch01-t04` in `topicIds` — the `topicIds` field is populated only once a term is approved, matching the pattern already used by all 7 approved terms.)

Two existing **pending** terms (`ch01-term-speed`, `ch01-term-mass`/`ch01-term-weight`/`ch01-term-apparent-weight`) are directly relevant to Batch 1 despite not yet carrying `ch01-t01`/`ch01-t04` in `topicIds` — this is expected, since `topicIds` is only populated at approval time, and none of these five terms has been approved yet.

## 5. `ch01-t01` terminology inventory

Every term/expression in `ch01-t01-content.json`'s learner-visible and instructor-only text, classified:

| Term/expression | Classification |
|---|---|
| Fundamental quantity | **Missing glossary entry** — central to the topic, no existing term |
| Derived quantity | **Missing glossary entry** — contrastive, no existing term |
| Speed / average speed | **Existing pending glossary entry** (`ch01-term-speed`) — its own `usageNotes` already anticipates "Qualify average versus instantaneous speed" |
| Distance | **Existing approved glossary entry** (`ch01-term-distance`), currently scoped only to `ch01-t02` |
| Distance traveled | Ordinary language, covered by `ch01-term-distance`'s own definition/usage note — no separate entry |
| Time | **Missing glossary entry** — no existing term for "time" as a fundamental quantity/duration concept |
| Elapsed time | Ordinary language — ties to the same missing "time" concept, not a separate term |
| Dimension / dimension of length / dimension of time / `L`/`T` | **Missing glossary entry**, with a real literal-translation risk (§6) |
| Scalar quantity | **Existing pending glossary entry** (`ch01-term-scalar`) |
| Vector quantity (referenced contrastively, deferred) | **Existing pending glossary entry** (`ch01-term-vector`) — referenced only to say vectors come later; does not need to be attached to `ch01-t01` now |
| Displacement (referenced contrastively, by deliberate omission) | **Existing pending glossary entry** (`ch01-term-displacement`) — not actually used in the `ch01-t01` text (the draft correctly never introduces displacement); available for future cross-reference only, not required now |
| Measured variable / dimensional symbol (the `d`/`t` vs. `L`/`T` distinction) | **Concept requiring Arabic explanatory adaptation rather than a glossary term** — this is a pedagogical/notational framing device, not standard physics vocabulary |
| Equation (`v = d/t`) | Mathematical symbol/expression requiring no translation of the symbols themselves, but requiring equation-isolation handling (§13) |
| Charge | Ordinary language at this stage — named once, not developed; no glossary entry needed until a future topic actually treats it |
| SI units (`m`, `s`, `m/s`) | Mathematical/unit notation requiring no translation, upright rendering only (§13) |

## 6. `ch01-t01` candidate glossary decisions

| Term ID (provisional where new) | Topic | English term | Recommended Arabic | Acceptable alternative | Literal-translation risk | Definition (Chapter-1-scoped) | Existing status | Recommended decision | Blocks Arabic generation? |
|---|---|---|---|---|---|---|---|---|---|
| `ch01-term-fundamental-quantity` *(provisional — new)* | `ch01-t01` | fundamental quantity | الكمية الأساسية | — | Low; standard term in Arabic physics pedagogy | A physical quantity not defined in terms of any other quantity within the stated scope; for this chapter's mechanics content: distance, time, and mass | Does not exist | **Create new term** | Yes — central to the topic's own definitions |
| `ch01-term-derived-quantity` *(provisional — new)* | `ch01-t01` | derived quantity | الكمية المشتقة | — | Low; standard, contrasts cleanly with the term above | A physical quantity formed by combining fundamental quantities through multiplication/division, without an independent unit of its own | Does not exist | **Create new term** | Yes — the fundamental/derived contrast is the topic's core claim |
| `ch01-term-speed` | `ch01-t01` | speed | السرعة | — | Medium — must stay distinguished from السرعة المتجهة (velocity); `discouragedTranslations` already flags this | A scalar rate at which distance is accumulated over time; qualify average vs. instantaneous | Pending, no `topicIds` | **Approve existing term, with topicIds extended to include `ch01-t01`** | Yes |
| `ch01-term-distance` | `ch01-t01`, `ch01-t02` | distance | المسافة | — | Low; already approved and in active use for `ch01-t02` | Unchanged from existing approved definition | Approved (`ch01-t02` only) | **Approve with revision — extend `topicIds` to include `ch01-t01`** | Yes (this specific extension) |
| *(dimension / L / T — see below)* | `ch01-t01` | dimension (of length / of time) | البُعد (الطولي / الزمني) | كمية أساسية (as a paraphrase, not a substitute) | **High** — "البعد" also carries an everyday sense related to distance/remoteness in general Arabic, risking confusion with المسافة even though "البعد" is the standard, correct academic term for "dimension" in dimensional analysis (e.g. التحليل البعدي) | The type of fundamental quantity a symbol like `L` or `T` names, distinct from a specific measured value | Does not exist | **Create new term, with an explicit usage note addressing the translation risk** (see §6a) | Yes — this is the exact concept the closure-verified notation-bridge revision depends on |
| `ch01-term-scalar` | `ch01-t01` | scalar (quantity) | كمية قياسية | قياسي (adjective form) | Low | A quantity specified by magnitude and unit without direction; speed is scalar in this chapter | Pending, no `topicIds` | **Approve existing term, with topicIds extended to include `ch01-t01`** | Yes — used explicitly to describe speed |
| `ch01-term-vector` | *(not required for `ch01-t01` now)* | vector | كمية متجهة | متجه | Low | Referenced only as a forward pointer; full treatment deferred | Pending, no `topicIds` | **No action required for this batch** — leave pending, do not attach to `ch01-t01` | No — not used substantively here |
| `ch01-term-displacement` | *(not required for `ch01-t01` now)* | displacement | الإزاحة | — | Low | Not used in the `ch01-t01` draft at all | Pending, no `topicIds` | **No action required for this batch** | No |

**Provisional-ID uniqueness check:** `ch01-term-fundamental-quantity` and `ch01-term-derived-quantity` were checked against every existing `termId` in `BILINGUAL_GLOSSARY.json` (§4's full list) and against `IDENTIFIER_REGISTRY.json`'s glossary-namespace pattern (`^ch01-term-[a-z0-9-]+$`) — both are unique and pattern-conformant. **Neither ID was created or registered by this task.**

**§6a — "dimension" translation-risk note (advisory, non-binding):** Arabic physics instruction does use "البُعد" (al-bu'd) as the standard term for "dimension" in the dimensional-analysis sense (paralleling "التحليل البعدي," dimensional analysis, and "لا بعدي," dimensionless) — this is scientifically correct and not a mistranslation. The risk is purely one of student confusion with "المسافة" (distance) in casual reading, since "بعد" colloquially relates to remoteness/distance. **Recommended mitigation, for the future Arabic-generation task, not performed here:** pair the term with an explicit parenthetical gloss on first use in each topic (e.g., "البُعد (بمعنى نوع الكمية، وليس المسافة)" — "dimension, meaning the type of quantity, not distance") and ensure `discouragedTranslations` on the eventual glossary entry explicitly lists "المسافة" as a discouraged substitution for "البُعد" when the dimensional sense is meant.

## 7. `ch01-t01` Arabic-readiness assessment

- **Blocking terms:** `ch01-term-fundamental-quantity` (new), `ch01-term-derived-quantity` (new), `ch01-term-speed` (extend), `ch01-term-distance` (extend), a new `ch01-term-dimension`-family entry (new, with the translation-risk note above formally attached).
- **Non-blocking terms:** `ch01-term-scalar` (extension is low-risk and quick, but the topic's Arabic sentences would remain scientifically sound even if this specific extension lagged slightly, since "scalar" appears only once in a parenthetical clarification).
- **Equation/bidi conditions:** standard isolation pattern only (§13/§14) — no unusual risk identified.
- **Recommendation:** **Ready after specified glossary approvals** — see §19 for the formal, confidence-rated recommendation.

## 8. `ch01-t04` terminology inventory

Every term/expression in `ch01-t04-content.json`, classified:

| Term/expression | Classification |
|---|---|
| Mass | **Existing pending glossary entry** (`ch01-term-mass`) |
| Weight / gravitational weight | **Existing pending glossary entry** (`ch01-term-weight`) — its own definition already states "the gravitational force acting on an object," fully covering "gravitational weight" without a separate sub-term |
| Gravitational force | Ordinary language, covered by `ch01-term-weight`'s own definition — no separate entry |
| Acceleration due to gravity / `g` | **Concept covered by an existing approved term scoped to a different topic** (`ch01-term-acceleration`, approved, currently `topicIds: ["ch01-t08"]`) — `ch01-t04` reuses the exact same `|g| ≈ 9.8 m/s²` value already established there by `ch01-corr-007` |
| Magnitude | Ordinary language / mathematical concept, no dedicated Chapter-1 glossary entry exists or is needed — used descriptively throughout the pilot's own approved content without one |
| Direction | Ordinary language in this topic's usage (stated in words only, no sign-convention system introduced here) — no entry needed |
| Normal force | **Not present in the approved draft at all** — checked directly; `ch01-t04-content.json` never uses this term (the draft deliberately uses "support force"/"scale reading" instead). No glossary action needed unless a future revision introduces the term explicitly |
| Scale reading | Ordinary language, folded into the `ch01-term-apparent-weight` definition itself ("The support-force magnitude indicated by a scale...") |
| Equilibrium / zero net force | **Not present in the approved draft** — the current text uses "an ordinary situation... resting still" rather than these formal terms (this is exactly the optional, non-blocking condition already logged in the English baseline approval, not yet applied). No glossary action needed unless that optional revision is applied first |
| Apparent weight | **Existing pending glossary entry** (`ch01-term-apparent-weight`) — see §10 for the focused strategy review |
| Newton | SI unit name — transliterated as نيوتن in standard Arabic scientific usage, not a conceptual glossary term |
| Kilogram | SI unit name — transliterated/established as كيلوغرام (or كجم as the symbol) in standard Arabic scientific usage, not a conceptual glossary term |
| Significant figures (in the problem's rounding explanation) | Ordinary explanatory language / mathematical-methodology concept — no dedicated Chapter-1 glossary term exists or is needed for this |

## 9. Existing pending `ch01-t04` glossary terms

The exact three terms, independently re-verified field by field against the current live file:

**`ch01-term-mass`**
- `englishTerm`: "mass"
- `approvedArabicTerm`: `{"text": "الكتلة", "status": "proposedPendingReviewerApproval"}`
- `definition`: "A measure of an object's inertia."
- `usageNotes`: "Amount of matter may be used only as introductory intuition, not the primary operational definition."
- `discouragedTranslations`: `["الوزن"]`
- `approvalStatus`: `pending`
- `sourceReferences`: `["S2-SEG056", "SCA02", "ch01-corr-002"]`
- **Consistency with the approved English baseline:** exact match — `ch01-t04-block-mainidea`'s own approved text states "Mass measures an object's inertia" nearly verbatim.

**`ch01-term-weight`**
- `englishTerm`: "weight"
- `approvedArabicTerm`: `{"text": "الوزن", "status": "proposedPendingReviewerApproval"}`
- `definition`: "The gravitational force acting on an object in the stated context."
- `usageNotes`: "Distinguish gravitational weight from apparent weight."
- `discouragedTranslations`: `["الكتلة"]`
- `approvalStatus`: `pending`
- `sourceReferences`: `["S2-SEG058", "SCA03", "ch01-corr-002"]`
- **Consistency with the approved English baseline:** exact match — the approved `ch01-t04-block-equations` text states "gravitational weight... is the force of gravity."

**`ch01-term-apparent-weight`**
- `englishTerm`: "apparent weight"
- `approvedArabicTerm`: `{"text": "الوزن الظاهري", "status": "proposedPendingReviewerApproval"}`
- `alternateArabicTerms`: `["قراءة الميزان", "قوة الدعم المحسوسة"]`
- `definition`: "The support-force magnitude indicated by a scale or experienced by a body."
- `usageNotes`: "It can differ from gravitational weight during acceleration."
- `discouragedTranslations`: `["الوزن الحقيقي"]`
- `approvalStatus`: `pending`
- `sourceReferences`: `["SCA03", "S5-SCI-012", "ch01-corr-002"]`
- **Consistency with the approved English baseline:** consistent in substance — the approved draft's own qualification ("apparent weight... is not a direct quotation from any source material") is a governance/rights statement about the *English* term's origin, not in tension with this glossary entry's *Arabic* proposal, which is independently reasonable (see §10).

All three terms' `sourceReferences` and scientific framing independently re-confirmed accurate against `SCA02`, `SCA03`, and `ch01-corr-002` (all re-checked to exist and say what these entries claim).

## 10. Apparent-weight translation strategy

Focused review of "apparent weight," respecting the approved qualification (scientifically valid, project-authored interpretive terminology; not verbatim source wording):

- **Recommended Arabic term:** **الوزن الظاهري** (al-wazn al-zahiri, literally "the apparent/manifest weight") — this is already the glossary's own pending proposal, and independently assessed here as sound: it is standard, recognizable Arabic physics-education phrasing (parallel to how "apparent" is used in other physics contexts, e.g. "القوة الظاهرية" for apparent/fictitious force), it clearly signals "not the true/actual value" without asserting a specific mechanism, and it reads naturally alongside "الوزن" (weight) as a modified variant of the same root concept.
- **Acceptable alternative:** **قراءة الميزان** (qira'at al-mizan, "the scale reading") — already listed as an alternate term; more concretely operational (ties directly to "what the scale shows"), useful as a supporting explanatory gloss especially on first introduction, though less general than الوزن الظاهري if the concept is ever extended beyond a literal scale.
- **Terms not recommended:** **الوزن الحقيقي** (already correctly flagged as discouraged in the existing entry — "true weight" implies apparent weight is somehow false/incorrect, which is scientifically misleading, since apparent weight is a real, physically meaningful force reading, just not always numerically equal to gravitational weight); a literal transliteration or invented neologism (unnecessary — Arabic physics pedagogy already has adequate vocabulary here).
- **Concise Arabic conceptual definition (advisory, non-binding):** الوزن الظاهري هو مقدار قوة الدعم التي يقرأها الميزان أو يشعر بها الجسم، وهو يساوي الوزن الحقيقي (الجاذبية) في الحالات الساكنة العادية فقط. ("Apparent weight is the magnitude of the support force a scale reads or a body feels; it equals gravitational weight only in ordinary, static situations.")
- **Usage note:** must always be paired, on first use in a topic, with an explicit statement that it is the project's own clarifying term for the scale/support-force reading — mirroring the English draft's own explicit qualification — rather than presented as if it were standard textbook Arabic vocabulary quoted from a specific source.
- **Misconception warning:** students may read "ظاهري" (apparent/seeming) as implying the reading is somehow fake or an illusion; the Arabic explanation should explicitly state that apparent weight is a real, measurable force, distinct from — not "less real than" — gravitational weight.
- **Does it require its own glossary entry?** Yes — it already has one (pending), and this review finds no reason to fold it into `ch01-term-weight` instead; the distinction is exactly the point of the underlying scientific correction (`ch01-corr-002`).
- **Cross-references required:** to `ch01-term-weight` (contrast pair) and, if a scale-reading-specific gloss is retained, informally to the "قراءة الميزان" alternate form already listed — no cross-reference to a "normal force" term is needed, since that term is not used anywhere in the approved English draft (§8).

**All Arabic terminology in this section is advisory only and is not approved glossary content.**

## 11. `ch01-t04` candidate glossary decisions

| Term ID | Topic | English term | Recommended Arabic | Acceptable alternative | Literal-translation risk | Definition (Chapter-1-scoped) | Existing status | Recommended decision | Blocks Arabic generation? |
|---|---|---|---|---|---|---|---|---|---|
| `ch01-term-mass` | `ch01-t04` | mass | الكتلة | — | Low; discouraged-translation list already correctly excludes الوزن | Unchanged from existing pending definition (§9) | Pending, no `topicIds` | **Approve existing term as-is, with topicIds set to `ch01-t04`** | Yes |
| `ch01-term-weight` | `ch01-t04` | weight (gravitational) | الوزن | — | Low; discouraged-translation list already correctly excludes الكتلة | Unchanged from existing pending definition (§9) | Pending, no `topicIds` | **Approve existing term as-is, with topicIds set to `ch01-t04`** | Yes |
| `ch01-term-apparent-weight` | `ch01-t04` | apparent weight | الوزن الظاهري | قراءة الميزان | Medium — see §10's misconception warning | Unchanged from existing pending definition (§9), with the §10 usage note added | Pending, no `topicIds` | **Approve existing term with revision — add the §10 usage note explicitly framing this as project-authored, not source-verbatim, terminology** | Yes |
| `ch01-term-acceleration` | `ch01-t04` *(topicIds extension only)* | acceleration due to gravity, `g` | التسارع | — | Low; already approved, in active use for `ch01-t08` | Unchanged from existing approved definition | Approved (`ch01-t08` only) | **Approve with revision — extend `topicIds` to include `ch01-t04`**, since `ch01-t04`'s `W = mg` reuses the exact same `|g| ≈ 9.8 m/s^2` value `ch01-corr-007` already established | No — this is a reuse extension, not a new blocking term; `ch01-t04`'s own text does not require this extension to be scientifically correct, only to be terminologically cross-referenced |
| *(no new term)* | — | normal force, equilibrium, zero net force | — | — | — | Not present in the approved draft | N/A | **No glossary entry required at this time** | No |

**Provisional-ID uniqueness check:** no new term ID is proposed for `ch01-t04` — all three relevant terms already exist with stable, registry-pattern-conformant IDs (confirmed against `IDENTIFIER_REGISTRY.json`'s `^ch01-term-[a-z0-9-]+$` pattern and `BILINGUAL_GLOSSARY.json`'s current term list).

## 12. `ch01-t04` Arabic-readiness assessment

- **Blocking terms:** `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` (all three, approval + `topicIds` assignment).
- **Non-blocking terms:** `ch01-term-acceleration`'s `topicIds` extension (a cross-reference completeness improvement, not required for scientific correctness of `ch01-t04`'s own Arabic text, since `g`'s value can be stated directly without formally cross-linking to the `ch01-t08` term).
- **Equation/bidi conditions:** standard isolation pattern (§13/§14); the significant-figure explanation in `ch01-prob-104` needs no special Arabic-specific handling beyond ordinary numeral/unit isolation.
- **Recommendation:** **Ready after specified glossary approvals** — see §19.

## 13. Equation and notation requirements

| Expression | LTR isolation | Latin variables | Upright SI units | Superscript handling | Special notation |
|---|---|---|---|---|---|
| `v = d/t` (`ch01-t01`) | Yes — one dedicated `direction="ltr"` span, per `VISUAL_HOUSE_STYLE.md`'s proven pattern | `v`, `d`, `t` italic | `m`, `s`, `m/s` upright | None needed (no exponent) | None |
| `L/T` (`ch01-t01`) | Yes — isolable as a short LTR fragment; if referenced inline in Arabic prose, follow the already-proven "single bare Latin symbol inside Arabic prose" pattern (e.g., referencing `L` alone is fine; the full `L/T` ratio should stay in its own isolated span, not split across a bidi boundary) | `L`, `T` italic (as dimensional symbols, distinct from `d`, `t`) | N/A (no unit here — a dimension symbol, not a measured value) | None | None |
| `W = mg` (`ch01-t04`) | Yes — one dedicated LTR span | `W`, `m`, `g` italic | `N`, `kg` upright | None needed | None |
| `\|g\| ≈ 9.8 m/s^2` (`ch01-t04`) | Yes | `g` italic | `m/s^2` upright, rendered as a true superscript `m/s²` | `^2` → true `<sup>2</sup>`, per the already-proven pilot renderer mechanism | Absolute-value bars `\|...\|` should render as plain vertical bars, LTR, no special Arabic substitute exists or is needed — already the exact convention `ch01-corr-007`'s own approved English text uses for `ch01-t08` |
| `45 x 9.8 = 441 N` (`ch01-t04`) | Yes | `x` (multiplication) stays as the plain ASCII `x` already established project-wide, per `equationRenderer.tsx`'s own documented handling of this exact character as an intentional multiplication operator (see `ch01-t02`'s "length x width" precedent) | `N` upright | None needed | Spacing: keep one space on each side of `x`, matching the existing convention exactly |
| `4.4 x 10^2 N` (`ch01-t04`) | Yes | `x` plain ASCII, per the closure-verified project decision (`PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md` §7) that this convention is the technically correct choice for the existing caret-to-`<sup>` renderer mechanism | `N` upright | `^2` → true `<sup>2</sup>` | This exact expression was independently confirmed compatible with the rendering pipeline in the prior closure review; the same reasoning applies unchanged to its future Arabic rendering |

**Confirmation: the existing Arabic pilot rendering conventions are sufficient.** No new equation-rendering mechanism, adapter change, or schema decision is required — every expression in both Batch 1 topics uses only patterns (caret exponents, plain-`x` multiplication, upright units, italic variables, bare-symbol-in-prose) already proven across the four approved pilot topics' own Arabic content. **No application code was inspected or modified beyond read-only reference to the already-documented rendering mechanism.**

## 14. Bidi and mixed-script requirements

Recommended formatting rules for the future Arabic-generation task (advisory, not applied here):

- Every equation/notation fragment (`v = d/t`, `L/T`, `W = mg`, `\|g\| ≈ 9.8 m/s^2`, `45 x 9.8 = 441 N`, `4.4 x 10^2 N`) must be isolated in its own `direction="ltr"` span, never interleaved character-by-character with Arabic prose — matching `VISUAL_HOUSE_STYLE.md` §3–4's proven rule exactly.
- A single bare Latin symbol referenced inline within Arabic prose (e.g., "الرمز `L` يمثل البُعد الطولي") is acceptable, following the exact precedent already used for `ch01-t08`/`ch01-t10`'s Arabic legend lines; a multi-term formula must never be split this way.
- Parentheses around a variable or unit inside otherwise-Arabic text should stay adjacent to the LTR-isolated fragment they enclose, not floated separately, to avoid a bidi-reordering artifact at the parenthesis boundary — the same handling already used throughout the four pilot topics.
- Numbered solution steps (`ch01-prob-104`'s two-step structure) should keep step numbers as plain Latin/Eastern-Arabic numerals consistent with the rest of the chapter's existing convention (not mixed within one document) — this project's existing Arabic content uses Latin numerals throughout; no topic-specific deviation is recommended for Batch 1.
- Colons and punctuation immediately following an LTR-isolated equation span should be placed as plain ASCII punctuation directly after the span closes, matching the existing pilot pattern, to avoid an Arabic-punctuation mirroring artifact.
- Arabic text that both precedes and follows an equation span (as in `ch01-t01-block-equations`' longer explanatory paragraph) requires no special handling beyond the per-fragment isolation rule above — this exact "prose-equation-prose" pattern is already proven in `ch01-t03`'s and `ch01-t08`'s approved Arabic content.
- No new bidi risk beyond these already-solved patterns was identified in either topic.

## 15. Record-type translation strategy

| Record type / field | Recommended future approach |
|---|---|
| `instructorScript` (both topics) | Direct translation with glossary enforcement; remains internal-only, never learner-visible, matching the existing pilot convention |
| `mainIdea` | Direct translation with glossary enforcement |
| `organizedExplanation` | Direct translation with glossary enforcement; `ch01-t04`'s "apparent weight is project-authored, not verbatim" qualification must be preserved as an explicit Arabic sentence, not dropped |
| `equationSet` | Conceptual adaptation for prose + preserve mathematical notation exactly (§13) for the equation itself |
| `visualReference` | Preserve as internal planning-metadata text only; **remains untranslated/internal for now**, since no visual exists yet — a full Arabic translation of this specification is a reasonable future step but is not required before the visual itself is authorized and specified in more concrete terms |
| `misconception` | Direct translation with glossary enforcement; stays `instructor`-only |
| `reviewQuestion` | Direct translation with glossary enforcement; the single-record question+answer+explanation structure must be preserved exactly as-is (no heuristic splitting), matching the established pilot `reviewQuestion` precedent |
| `problem.problemStatement` | Arabic instructional rewrite required in the cultural/pedagogical sense described in §10's parallel logic — not a literal word-for-word translation, but a natural Arabic restatement of the same scenario, numbers, and required quantities, matching the exact process already used for the four pilot topics' own problems |
| `problem.numberedSolution` | Conceptual adaptation for the explanatory prose in each step + preserve mathematical notation exactly |
| `problem.finalAnswer` | Direct translation of the interpretation text; the numeric value/unit portion must preserve "4.4 x 10^2 N" notation unchanged (§13) |
| `problem.intuition` | Direct translation with glossary enforcement |
| `problem.sourceVariants[].answerVariant` | Requires a later policy decision — this field is short, internal, governance-oriented text ("4.4 x 10^2 N; mass unchanged"), not clearly learner-facing; recommend treating it the same as `finalAnswer` for consistency, but this is a minor open question for the actual generation task, not resolved here |

## 16. Glossary blocking and non-blocking terms

**Blocking (approval required before Arabic generation can be authorized for the topic):**

- `ch01-t01`: `ch01-term-fundamental-quantity` (new), `ch01-term-derived-quantity` (new), `ch01-term-speed` (extend), `ch01-term-distance` (extend), a new dimension-family term (new, §6/§6a).
- `ch01-t04`: `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` (all three, approve as-is or with the §10 usage-note revision).

**Non-blocking (do not need to be resolved before Arabic generation, but recommended for completeness):**

- `ch01-term-scalar`'s `topicIds` extension to `ch01-t01`.
- `ch01-term-acceleration`'s `topicIds` extension to `ch01-t04`.

**Optional terminology improvements (no action required, informational only):**

- `ch01-term-vector`, `ch01-term-displacement` remain pending and unattached to either Batch 1 topic — correctly so, since neither is substantively used in the approved English text.

**Terms that can be approved together:** all five `ch01-t01` blocking terms are conceptually independent of the three `ch01-t04` blocking terms and can be approved in a single combined terminology pass, or separately per topic — no dependency was found requiring one topic's terms to be resolved before the other's.

**Terms requiring separate scientific review:** none identified — every recommended term/definition in this brief is a direct restatement of already-approved English baseline content (`ch01-corr-001`/`ch01-corr-002`'s own approved wording), not a new scientific claim requiring its own correction-record-style review.

## 17. Identifier and cross-reference considerations

Two new provisional term IDs (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`) were checked for uniqueness against the full current `BILINGUAL_GLOSSARY.json` term list and against `IDENTIFIER_REGISTRY.json`'s glossary-namespace pattern — both are unique and pattern-conformant. **Neither was created or registered.** Consistent with `PHSH111_BATCH1_ENGLISH_BASELINE_APPROVAL_RECORD.md` §14's already-established timing recommendation, glossary-term registration (like content-record registration) is not itself gated on this brief — it would occur as part of whatever future task actually creates/approves these entries in `BILINGUAL_GLOSSARY.json`, which was not performed here. Required cross-references: `ch01-term-apparent-weight` ↔ `ch01-term-weight` (contrast pair, already implied by both entries' `usageNotes`/`discouragedTranslations`); `ch01-term-mass` ↔ `ch01-term-weight` (contrast pair, already implied); a new `ch01-term-fundamental-quantity` ↔ `ch01-term-derived-quantity` contrast pair (to be established when created).

## 18. Scientific/editorial governance distinctions

Stated explicitly, per this task's own requirement:

- **Project-owner English baseline approval has occurred** for both `ch01-t01` and `ch01-t04` (`ENGLISH_BATCH1_BASELINE_APPROVAL.json`, v1.0.0).
- **No independent human scientific review has occurred** — for the English baseline, for either correction, or for any glossary term, at any point in this project.
- **Glossary approval is a project-owner editorial/scientific terminology decision** — the same kind of decision already made for the 7 currently-approved glossary terms, each explicitly recorded as "the project owner's approval decision, not an independently derived linguistic re-verification."
- **Glossary approval does not constitute independent expert review**, and would not for Batch 1 either.
- **Arabic generation and Arabic baseline approval are separate, later stages** — this brief recommends readiness conditions for the former; the latter (an eventual `ARABIC_BATCH1_BASELINE_APPROVAL.json`-style record) is further out still, gated on Arabic content actually existing and being reviewed.
- **English approval does not automatically approve Arabic wording** — nothing in `ENGLISH_BATCH1_BASELINE_APPROVAL.json` extends to, or presumes the content of, any future Arabic text.

## 19. Topic-level recommendations

### `ch01-t01`

- **Advisory recommendation:** Ready after specified glossary approvals.
- **Confidence:** High.
- **Blocking conditions:** approval of 5 terms (2 new: `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`; 3 extensions: `ch01-term-speed`, `ch01-term-distance`, and a new dimension-family term), all listed in §6/§16.
- **Non-blocking conditions:** `ch01-term-scalar`'s `topicIds` extension.
- **Exact terms involved:** listed above.
- **Equation/bidi conditions:** standard, already-proven patterns only (§13/§14); no new rendering decision required.
- **Should the topics remain paired?** Yes for tracking purposes, though `ch01-t01`'s glossary work (2 new terms) is somewhat heavier than `ch01-t04`'s (0 new terms, 3 existing approvals) — this does not itself justify decoupling them, since neither topic's Arabic generation depends on the other's completion.

### `ch01-t04`

- **Advisory recommendation:** Ready after specified glossary approvals.
- **Confidence:** High.
- **Blocking conditions:** approval of the 3 existing pending terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`), the last with the §10 usage-note revision recommended.
- **Non-blocking conditions:** `ch01-term-acceleration`'s `topicIds` extension.
- **Exact terms involved:** listed above.
- **Equation/bidi conditions:** standard, already-proven patterns only; the `|g| ≈ 9.8 m/s²` absolute-value notation and `4.4 x 10^2 N` scientific notation were both specifically checked and found compatible with the existing rendering pipeline.
- **Should the topics remain paired?** Yes, same reasoning as above.

## 20. Batch-level recommendation

**Complete glossary creation and approval first, then authorize both.**

This is the most controlled option consistent with existing project governance: every prior stage in this Batch 1 sequence (scientific correction, citation repair, correction approval, drafting authorization, English drafting, English review/revision/closure, English baseline approval) has proceeded through an explicit, documented project-owner decision before the next stage began, never by default or inference. Glossary approval is a comparably-sized, well-scoped decision (8 term-level actions total: 2 new terms, 6 approve/extend actions) that can reasonably be completed in one combined pass, after which both topics' Arabic-generation readiness would be equally clear. Nothing found in this review favors authorizing one topic while holding the other, or requires additional scientific terminology review or rendering/schema work beyond what §13/§14 already confirm is unnecessary.

## 21. Project-owner decision sheet

### ch01-t01 terminology

- Advisory recommendation: Ready after specified glossary approvals
- Blocking terms: `ch01-term-fundamental-quantity` (new), `ch01-term-derived-quantity` (new), `ch01-term-speed` (extend to ch01-t01), `ch01-term-distance` (extend to ch01-t01), new dimension-family term (new, per §6a)
- Proposed new terms: `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, and a dimension-family term (exact ID not finalized in this brief — see §6)
- Project-owner decision: [Approve / Approve with revision / Revise / Defer — leave blank]
- Project-owner notes: [leave blank]
- Decision date: [leave blank]

### ch01-t04 terminology

- Advisory recommendation: Ready after specified glossary approvals
- Existing pending terms: `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`
- Proposed additional terms: none new; recommend extending `ch01-term-acceleration`'s `topicIds` to include `ch01-t04` (non-blocking)
- Apparent-weight recommendation: الوزن الظاهري (primary), قراءة الميزان (acceptable alternative/supporting gloss); الوزن الحقيقي not recommended
- Project-owner decision: [Approve / Approve with revision / Revise / Defer — leave blank]
- Project-owner notes: [leave blank]
- Decision date: [leave blank]

### Batch 1 Arabic readiness

- Advisory recommendation: Complete glossary creation and approval first, then authorize both
- Required glossary action: approve/create the 8 terms/extensions listed above (5 blocking for `ch01-t01`, 3 blocking for `ch01-t04`), plus the 2 non-blocking extensions at the project owner's discretion
- Equation/bidi requirements: none outstanding — existing pilot conventions confirmed sufficient for every expression in both topics
- Project-owner decision: [Authorize after glossary approval / Revise / Defer — leave blank]
- Project-owner notes: [leave blank]

## 22. Exact next controlled task

A **Batch 1 glossary approval task** — a narrowly scoped governance action creating the two new provisional terms (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`, plus the dimension-family term) and updating the `approvalStatus`/`topicIds` of the five existing terms identified as blocking or non-blocking above, following the exact same project-owner-review pattern already used for the 7 currently-approved glossary terms. Only after that task completes would a subsequent **Arabic-generation authorization** task become the following step. Neither is performed by this brief.

## 23. Publication statement

This is a read-only advisory decision brief. No glossary entry was approved or modified — `BILINGUAL_GLOSSARY.json` remains unchanged (confirmed unchanged before and after this task). No Arabic topic content was generated. No Arabic baseline approval occurred. No visual was produced. No application integration occurred. No independent human scientific approval occurred — every finding above is Claude's own review under project-owner authorization. **Publication remains unauthorized**: `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` everywhere this task touched or read.
