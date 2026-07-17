# PHSH111 Batch 1 — Glossary Inventory Reconciliation Addendum

**Prepared:** 2026-07-17. **This is a read-only reconciliation.** No glossary record was created, approved, or modified. No identifier was registered. No Arabic topic content was generated. No English baseline file was modified. No Arabic-generation authorization was granted. Publication remains unauthorized.

## 1. Purpose

`docs/app/PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` contains an internal counting inconsistency between its detailed section-by-section findings and its own summary figures. This addendum reconciles that inconsistency with a single, definitive, re-verified inventory before any glossary modification or approval occurs. It supersedes the prior brief's counts only — it does not change any of that brief's substantive scientific or terminological recommendations except where explicitly noted in §5 and §7 below.

## 2. Identified inconsistency

The prior brief's §16/§19 detailed findings describe, across both topics:
- Two new terms: `ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`.
- One additional proposed new "dimension-family term" for `L`/`T` dimensional notation.
- Extensions to `ch01-term-speed` and `ch01-term-distance`.
- Approval of three pending `ch01-t04` terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`).
- Extension of `ch01-term-acceleration` to `ch01-t04`.
- (Also present, but not counted in the final summary: `ch01-term-scalar`'s extension to `ch01-t01`, and an unresolved "missing glossary entry" flag on "time" in §5's inventory table that was never carried into a §6 decision.)

The prior brief's closing summary (in its final chat report, echoing §22) instead stated "2 new terms, 6 approve/extend actions, 8 identified terms total." **These two accountings do not match**, and re-deriving the summary figure mechanically from the detailed sections above yields at least 10 named items, not 8 — confirming a real undercount, not merely an ambiguous phrasing. §12 below explains exactly how the mismatch arose.

## 3. Evidence reviewed

`docs/app/PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md` (full re-read), `BILINGUAL_GLOSSARY.json` (full re-read, all 14 terms, checksum `sha256:7b7c2b46e4214ecd449c8720825975ca5f0b534f3236e20ff0e78da51928d8c2`), `IDENTIFIER_REGISTRY.json` (full re-read, checksum `sha256:556fc7972af7a56ed1a79fb2f0541b76df8dec8da268c0d3215920cce4c1b6bf`), both approved Batch 1 draft files (re-read in full, checksums `a445f55d...` / `c876a6fe...`, unchanged from every prior task), `ENGLISH_BATCH1_BASELINE_APPROVAL.json` (checksum `cde0348b...`), and the four pilot topics' own Arabic content and glossary usage as terminology precedents (already established in the prior brief and re-confirmed unchanged here).

## 4. Definitive `ch01-t01` terminology actions

| English term | Term ID (provisional where new) | Arabic term | Topic | Current status | Action type | Blocking? | Reason | Source/audit basis |
|---|---|---|---|---|---|---|---|---|
| fundamental quantity | `ch01-term-fundamental-quantity` *(provisional)* | الكمية الأساسية | `ch01-t01` | Does not exist | **Create** | Yes | Core organizing concept of the topic; used in nearly every learner-visible record | `ch01-corr-001`, `SCA01`, `S3-SCI-001`, `S2-SEG026` |
| derived quantity | `ch01-term-derived-quantity` *(provisional)* | الكمية المشتقة | `ch01-t01` | Does not exist | **Create** | Yes | Contrastive pair to fundamental quantity; used in explanation, equation, and misconception blocks | Same basis |
| speed / average speed | `ch01-term-speed` (existing) | السرعة | `ch01-t01` | Pending, no `topicIds` | **Approve** (first-time `topicIds` assignment) | Yes | No approved Arabic term currently exists for this concept anywhere in the glossary; blocks any correct Arabic rendering of `ch01-t01-block-equations`/`-review` | `S3-P003` (equation selection basis) |
| distance | `ch01-term-distance` (existing) | المسافة | `ch01-t01` | **Already approved**, `topicIds: ["ch01-t02"]` | **Extend topic scope** (add `ch01-t01` to existing array) | **No** — reclassified from the prior brief's "blocking" (§12) | The Arabic term المسافة is already approved and usable; only the `topicIds` bookkeeping array needs the addition, which does not itself block correct Arabic authoring | `S2-SEG028`, `SCA14`, `SCA15` (unchanged from existing entry) |
| dimension / `L`/`T` | *(resolved: no separate term)* | — | `ch01-t01` | N/A | **Merge into `ch01-term-fundamental-quantity`'s own `usageNotes`** | Folded into a blocking item (#1 above), not a separate blocking action | See §5 | — |
| scalar (quantity) | `ch01-term-scalar` (existing) | كمية قياسية | `ch01-t01` | Pending, no `topicIds` | **Approve** (first-time `topicIds` assignment) | **No** — non-blocking | Used only once, in a single parenthetical clarification; the topic's scientific meaning does not depend on this specific cross-reference existing before Arabic generation | `S2-SEG106` (unchanged from existing entry) |
| time / elapsed time | *(none)* | — | `ch01-t01` | N/A | **No glossary action required** | No | Ordinary, unambiguous Arabic vocabulary (الوقت/الزمن); no competing or confusable term exists; correcting the prior brief's own inconsistency (flagged "missing" in its §5 inventory table but never carried into a §6 decision — see §12) | — |
| vector (referenced, deferred) | `ch01-term-vector` (existing) | كمية متجهة | — | Pending, no `topicIds` | **No action for this batch** | No | Not substantively used in `ch01-t01`'s approved text | — |
| displacement (referenced, deferred) | `ch01-term-displacement` (existing) | الإزاحة | — | Pending, no `topicIds` | **No action for this batch** | No | Not used in `ch01-t01`'s approved text at all | — |

**`ch01-t01` unique records with an action:** `ch01-term-fundamental-quantity` (create), `ch01-term-derived-quantity` (create), `ch01-term-speed` (approve), `ch01-term-distance` (extend), `ch01-term-scalar` (approve) = **5 unique records**, of which **3 are blocking** and **2 are non-blocking**.

## 5. Dimension-family-term resolution

Working through the task's own checklist directly:

- **Is this a separate glossary term?** Final recommendation: **No.**
- **Is it "dimension"? "dimensional notation"? "physical dimension"?** All three phrasings describe the same underlying concept (the `L`/`T` symbolic sense used in `ch01-t01-block-explanation`/`-equations`), so this is not a naming ambiguity — the concept itself is single and well-defined.
- **Is it only explanatory language that does not require a glossary entry?** Partially — see below.
- **Can it be covered through `fundamental quantity` and `derived quantity`?** Yes, and this is the recommended path.
- **Does an equivalent term already exist under another ID?** No equivalent term exists anywhere in the current 14-term glossary.
- **Would creating it duplicate an existing concept?** Not literally a duplicate of an existing *glossary* entry, but its own working definition (see the prior brief's §6: "the type of quantity a symbol like `L` or `T` names") sits very close conceptually to `fundamental quantity`'s own definition ("A physical quantity not defined in terms of any other quantity... within the stated scope") — close enough that a fully separate record risks redundant, hard-to-keep-consistent definitions rather than adding real terminological clarity.
- **Is it truly required to block Arabic generation?** No. Its actual footprint in the approved English text is narrow — exactly two records (`organizedExplanation`, `equationSet`), always in the tightly-scoped phrase "has dimension `L`/`T`" or "dimensional symbols," never used as a free-standing recurring noun the way "fundamental quantity," "distance," or "speed" are used repeatedly across the whole topic. This is a materially different usage pattern from `ch01-term-slope`/`ch01-term-concavity` (narrow-topic terms that nonetheless recur as independent nouns students must recall and apply repeatedly in graph-reading tasks) — "dimension" here functions as a one-time notational clarification bound to explaining the `L`/`T` symbols, not as its own independently-recalled concept.

**Final recommendation: merge its concept into `ch01-term-fundamental-quantity`.** When that term is eventually created, its `usageNotes` field should explicitly state the dimensional-symbol distinction and its translation risk: *"When explaining that a fundamental quantity like distance or time has an associated dimensional symbol (L for length, T for time), use البُعد for 'dimension' — this is the standard Arabic dimensional-analysis term (compare التحليل البعدي, 'dimensional analysis') — and do not substitute المسافة (distance), even though 'بُعد' has an unrelated everyday sense connected to remoteness/distance in casual Arabic."* This preserves the exact translation-risk mitigation the prior brief identified, without creating a third, narrowly-scoped, largely-redundant glossary record. **This one resolution is the primary source of the count correction in this addendum** (§12).

## 6. Definitive `ch01-t04` terminology actions

Independently re-verified, field by field, against the current live `BILINGUAL_GLOSSARY.json`:

| termId | English term | Current Arabic term | Current definition | Approval status | `topicIds` | Source lineage | Can approve as written? | Cross-references required |
|---|---|---|---|---|---|---|---|---|
| `ch01-term-mass` | mass | الكتلة (`proposedPendingReviewerApproval`) | "A measure of an object's inertia." | `pending` | none | `S2-SEG056`, `SCA02`, `ch01-corr-002` | **Yes, as written** — matches the approved English baseline's own "Mass measures an object's inertia" nearly verbatim | ↔ `ch01-term-weight` (already implied by `discouragedTranslations: ["الوزن"]`) |
| `ch01-term-weight` | weight | الوزن (`proposedPendingReviewerApproval`) | "The gravitational force acting on an object in the stated context." | `pending` | none | `S2-SEG058`, `SCA03`, `ch01-corr-002` | **Yes, as written** — matches the approved baseline's "gravitational weight... is the force of gravity" | ↔ `ch01-term-mass`, ↔ `ch01-term-apparent-weight` |
| `ch01-term-apparent-weight` | apparent weight | الوزن الظاهري (`proposedPendingReviewerApproval`), alternate قراءة الميزان | "The support-force magnitude indicated by a scale or experienced by a body." | `pending` | none | `SCA03`, `S5-SCI-012`, `ch01-corr-002` | **Approve with revision** — add the usage note (below) framing this as project-authored, not source-verbatim, terminology, consistent with the approved English draft's own explicit qualification | ↔ `ch01-term-weight` |

**Required preservation, restated exactly (per this task's explicit instruction):** primary Arabic term remains **الوزن الظاهري**; supporting explanatory phrase remains **قراءة الميزان**; **الوزن الحقيقي is not to be treated as the preferred contrast term** (it remains correctly listed only under `discouragedTranslations`, since it wrongly implies apparent weight is somehow false); the distinction between gravitational weight (a force due to gravity) and a scale reading (a support force, only numerically equal to gravitational weight in an unaccelerated situation) must be preserved in whatever usage note is eventually attached to `ch01-term-apparent-weight`.

`ch01-term-acceleration` (existing, approved, `topicIds: ["ch01-t08"]`) → **extend topic scope** to include `ch01-t04`, since the approved `ch01-t04-block-equations` text reuses the exact `|g| ≈ 9.8 m/s²` value `ch01-corr-007` already established for `ch01-t08`. **Non-blocking** — reclassified consistent with `ch01-term-distance`'s reclassification in §4 (Arabic التسارع is already approved and usable; only the `topicIds` array needs the addition).

**`ch01-t04` unique records with an action:** `ch01-term-mass` (approve), `ch01-term-weight` (approve), `ch01-term-apparent-weight` (approve with revision), `ch01-term-acceleration` (extend) = **4 unique records**, of which **3 are blocking** and **1 is non-blocking**.

## 7. Existing-term scope extensions — full checklist

Every term named in the task's checklist, independently re-checked:

| Candidate | Requires controlled glossary coverage? | Reason |
|---|---|---|
| time | **No** | Ordinary, unambiguous Arabic vocabulary; no competing term; no scientific-meaning risk |
| displacement | **No** (for this batch) | Not used in either approved draft |
| scalar quantity | **Yes** — but non-blocking (§4) | Used once in `ch01-t01`; existing pending term is directly applicable |
| vector quantity | **No** (for this batch) | Referenced only as a forward pointer, not substantively used |
| force | **No** | Used only generically ("the force of gravity"), fully covered by `ch01-term-weight`'s own definition |
| normal force | **No** | Not present anywhere in either approved draft (independently re-confirmed by direct text search) |
| significant figures | **No** | Mathematical-methodology language, not a physics-terminology confusability risk |
| SI unit (general) | **No** | Categorical/generic phrase, not a specific term needing its own entry |
| newton | **No** | Standard transliterated Arabic scientific unit name (نيوتن), not a conceptual glossary term |
| kilogram | **No** | Standard transliterated/established Arabic scientific unit name (كيلوغرام/كجم), not a conceptual glossary term |

No additional term beyond those already identified in §4/§6 was found to require controlled glossary coverage.

## 8. Cross-reference requirements

Every cross-reference identified is a **sub-detail of an already-counted create/approve/extend action**, not an independent action on a separate, additional record:

- `ch01-term-fundamental-quantity` ↔ `ch01-term-derived-quantity` (established when both are created).
- `ch01-term-mass` ↔ `ch01-term-weight` (already implied by existing `discouragedTranslations` entries on both).
- `ch01-term-weight` ↔ `ch01-term-apparent-weight` (already implied by existing `usageNotes`/`discouragedTranslations`).

**Cross-reference-only actions requiring a record not already counted elsewhere: zero.**

## 9. Blocking versus non-blocking terms — definitive list

**Blocking (6 unique records):**
- `ch01-term-fundamental-quantity` (create) — `ch01-t01`
- `ch01-term-derived-quantity` (create) — `ch01-t01`
- `ch01-term-speed` (approve) — `ch01-t01`
- `ch01-term-mass` (approve) — `ch01-t04`
- `ch01-term-weight` (approve) — `ch01-t04`
- `ch01-term-apparent-weight` (approve with revision) — `ch01-t04`

**Non-blocking (3 unique records):**
- `ch01-term-distance` (extend scope) — `ch01-t01`
- `ch01-term-scalar` (approve) — `ch01-t01`
- `ch01-term-acceleration` (extend scope) — `ch01-t04`

**Deferred (0 records specific to this batch):** no candidate item identified for `ch01-t01`/`ch01-t04` was left unresolved in an ambiguous "deferred" state by this reconciliation — every item was resolved to create, approve, extend, or "no action required." (The glossary's other pre-existing pending terms — `ch01-term-position`, `ch01-term-vector`, `ch01-term-displacement`, `ch01-term-resultant`, `ch01-term-slope`, `ch01-term-concavity` — remain generally pending as chapter-wide state untouched by Batch 1; this is not a new deferral created by this task.)

## 10. Unique-record count

| Category | Count |
|---|---|
| New glossary records (create) | **2** |
| Existing pending records to approve (first-time `topicIds` assignment) | **5** (`ch01-term-speed`, `ch01-term-scalar` for `ch01-t01`; `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` for `ch01-t04`) |
| Existing approved records requiring topic-scope extension | **2** (`ch01-term-distance`, `ch01-term-acceleration`) |
| Cross-reference-only actions (on a record not already counted above) | **0** |
| Deferred terms (batch-specific) | **0** |
| **Total unique glossary records affected** | **9** |

## 11. Action count

Every one of the 9 unique records above receives **exactly one** action (create, approve, approve-with-revision, or extend) — no record requires more than one distinct action.

| Category | Count |
|---|---|
| **Total actions** | **9** |

**Unique records and total actions are numerically equal in this specific case (9 = 9)** — this is a coincidence of this particular batch (no record happens to need two separate actions), not a general rule, and the two figures are reported separately per this task's explicit instruction rather than being assumed equal.

## 12. Explanation of the previous mismatch

Three distinct, independently-identifiable errors combined to produce the prior brief's "2 new terms, 6 approve/extend actions, 8 identified terms total" summary, against a correctly-reconciled figure of **9 unique records / 9 actions**:

1. **The "dimension-family term" was inconsistently handled.** The prior brief's detailed body (§6, §16, §19) listed it as a distinct, "new," blocking item three separate times, but the closing summary's "2 new terms" figure did not include it — undercounting new terms by one relative to the body's own claims. This addendum resolves the substance of that inconsistency (§5) by recommending the concept be merged into `ch01-term-fundamental-quantity` rather than created separately — which happens to make "2 new terms" the *correct* final figure, but for a reason the original brief never stated or intended.
2. **`ch01-term-scalar`'s extension was correctly identified as non-blocking in §16 but silently dropped from the final tally.** The original summary's "6 approve/extend actions" appears to total only the 5 blocking approve/extend items (`speed`, `distance`, `mass`, `weight`, `apparent-weight`) plus exactly one of the two non-blocking items (`acceleration`), while omitting `scalar` — an arithmetic omission, not a substantive judgment that `scalar` didn't need action.
3. **`ch01-term-distance` and `ch01-term-acceleration` were classified as "blocking" in the original body when they should have been "non-blocking"** (§4/§6 above) — since both already have an approved, usable Arabic term, and only their `topicIds` bookkeeping array is incomplete. This classification error did not itself change the original brief's raw *count* (it still listed both items), but it did mean the original brief overstated how many terms stood between the project and Arabic-generation readiness, which this addendum corrects.
4. **"Time" was flagged as a "missing glossary entry" in §5's inventory table but never carried forward into a §6 decision or the final tally** — an internal inconsistency this addendum resolves by explicitly recommending no action for "time" (§7), removing the loose thread entirely rather than either silently dropping it (as the original brief effectively did) or inflating the count by adding it as a tenth item.

Correcting all three/four points independently arrives at the same reconciled total from either direction: **9 unique records, 6 blocking + 3 non-blocking, 9 total actions.**

## 13. Exact glossary records to create or modify

For a future, separate glossary-approval task (not performed here):

| Record | Exact proposed final action |
|---|---|
| `ch01-term-fundamental-quantity` *(new termId, provisional — uniqueness re-confirmed against the current 14-term glossary and the `^ch01-term-[a-z0-9-]+$` registry pattern)* | Create with `approvalStatus: "approved"`, `topicIds: ["ch01-t01"]`, `approvedArabicTerm: {"text": "الكمية الأساسية", "status": "approved"}`, and `usageNotes` including the dimensional-symbol guidance from §5 |
| `ch01-term-derived-quantity` *(new termId, provisional, same uniqueness check)* | Create with `approvalStatus: "approved"`, `topicIds: ["ch01-t01"]`, `approvedArabicTerm: {"text": "الكمية المشتقة", "status": "approved"}` |
| `ch01-term-speed` | Update `approvalStatus: "pending"` → `"approved"`; set `approvedArabicTerm.status` → `"approved"`; add `topicIds: ["ch01-t01"]` |
| `ch01-term-distance` | Update `topicIds: ["ch01-t02"]` → `["ch01-t02", "ch01-t01"]`; no other field changes |
| `ch01-term-scalar` | Update `approvalStatus: "pending"` → `"approved"`; set `approvedArabicTerm.status` → `"approved"`; add `topicIds: ["ch01-t01"]` |
| `ch01-term-mass` | Update `approvalStatus: "pending"` → `"approved"`; set `approvedArabicTerm.status` → `"approved"`; add `topicIds: ["ch01-t04"]` |
| `ch01-term-weight` | Same pattern; add `topicIds: ["ch01-t04"]` |
| `ch01-term-apparent-weight` | Same pattern; add `topicIds: ["ch01-t04"]`; **also** add the usage note distinguishing this as project-authored interpretive terminology (per the approved English draft's own qualification), preserving the exact preferred/discouraged term relationships restated in §6 |
| `ch01-term-acceleration` | Update `topicIds: ["ch01-t08"]` → `["ch01-t08", "ch01-t04"]`; no other field changes |

For each: **project-owner terminology approval is sufficient** for this internal stage (matching the exact precedent already used for all 7 currently-approved glossary terms, each explicitly recorded as a project-owner decision, not independent linguistic re-verification). **Independent scientific review remains outstanding** for all 9 records, unchanged by any future glossary approval. **All 6 blocking records** would need to be resolved before Arabic-generation authorization could reasonably proceed for the relevant topic; **the 3 non-blocking records** do not block that authorization but are recommended for completeness.

## 14. Exact next controlled task

The **Batch 1 glossary approval task** itself — applying exactly the 9 record-level actions in §13 to `BILINGUAL_GLOSSARY.json`, following the same project-owner-review pattern already used for the 7 currently-approved terms. This addendum does not perform that task. Only after it completes would a subsequent Arabic-generation authorization task become the following step, exactly as the original decision brief's §22 already stated.

## 15. Governance and publication statement

This is a read-only reconciliation. No glossary record was created, approved, or modified — `BILINGUAL_GLOSSARY.json` remains at checksum `sha256:7b7c2b46e4214ecd449c8720825975ca5f0b534f3236e20ff0e78da51928d8c2`, unchanged before and after this task. No identifier was registered — `IDENTIFIER_REGISTRY.json` unchanged. No Arabic topic content was generated. No English baseline file was modified — both approved drafts and `ENGLISH_BATCH1_BASELINE_APPROVAL.json` unchanged. No Arabic-generation authorization was granted. **Publication remains unauthorized.**
