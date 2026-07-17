# PHSH111 Chapter 1 — Batch 1 Scientific-Reconciliation Decision Brief

**Prepared:** 2026-07-16. **Type:** Read-only scientific-reconciliation decision brief. Covers exactly two correction records: `ch01-corr-001` (affecting `ch01-t01`, "Fundamental Quantities") and `ch01-corr-002` (affecting `ch01-t04`, "Mass, Inertia and Weight") — the two topics recommended as Batch 1 in `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md` §14. This document does not approve, reject, revise, or apply either correction, and does not authorize drafting, translation, illustration, or application expansion of any kind.

## 1. Purpose and scope

This brief exists to give the project owner everything needed to decide the disposition of `ch01-corr-001` and `ch01-corr-002` — the two prerequisite scientific corrections blocking any drafting work on Batch 1 (`ch01-t01`, `ch01-t04`) — without performing any of that drafting work itself. Every scientific claim below was independently re-verified against the underlying audited source records (not merely read from `SCIENTIFIC_CORRECTIONS.json`'s own summary fields), per the explicit instruction for this task. Two source-citation discrepancies were found during that independent verification and are reported in full in §3 and §7 — this is exactly the kind of finding this brief is designed to surface, not to resolve.

**Files read in full before writing this brief:** `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md`, `docs/app/PHSH111_INTERNAL_PILOT_CHECKPOINT.md`, `docs/app/PHSH111_APP_HANDOFF.md`, `docs/content-design/chapter-01/SCIENTIFIC_CORRECTIONS.json`, `docs/content-design/chapter-01/IDENTIFIER_REGISTRY.json`, `docs/content-design/chapter-01/PILOT_AUTHORIZATION.json`, `docs/content-design/chapter-01/PILOT_READINESS.json`, `docs/content-design/chapter-01/ENGLISH_PILOT_BASELINE_APPROVAL.json`, `docs/content-design/chapter-01/ARABIC_PILOT_BASELINE_APPROVAL.json`, `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json`, `docs/content-design/chapter-01/DUPLICATE_AND_CONFLICT_DECISIONS.json`, `docs/content-audits/chapter-01/topic-mapping.json`, `docs/content-audits/chapter-01/scientific-audit.json`, `docs/content-audits/chapter-01/duplicates-and-conflicts.json`, `docs/content-audits/chapter-01/visual-inventory.json`, `docs/content-audits/chapter-01/problems-and-questions-inventory.json`, `docs/content-audits/chapter-01/unresolved-items.md`, `docs/content-audits/chapter-01/AUDIT_SUMMARY.md`, `docs/content-audits/chapter-01/raw-sources/source-001-segments.json`, and every per-source `topic-mapping.json`, `scientific-audit.json`, page/segment/problem/question-inventory file, and cross-source link file under `docs/content-audits/chapter-01/sources/` and `docs/content-audits/chapter-01/cross-source/` for Source-002, Source-003 (PDF), Source-conv-003, Source-conv-005, Source-review-001, and Source-kahoot-001, to the extent each cited a record relevant to `ch01-t01` or `ch01-t04`.

## 2. Current verified state

### 2.1 Correction-record verification (both corrections)

| Field | `ch01-corr-001` | `ch01-corr-002` |
|---|---|---|
| Correction ID | `ch01-corr-001` | `ch01-corr-002` |
| Affected topic ID | `ch01-t01` (Fundamental Quantities) | `ch01-t04` (Mass, Inertia and Weight) |
| Current classification | `needsClarification` | `needsClarification` |
| Current severity | `medium` | `medium` |
| Current approval status | **`proposed`** | **`proposed`** |
| Scientific reviewer status | `null` — not reviewed | `null` — not reviewed |
| Editorial reviewer status | `null` — not reviewed | `null` — not reviewed |
| Linked conflict record ID(s) | `CD-CONF-001` (design-layer, `resolutionStatus: "proposed"`, `canonicalPreferenceStatus: "candidate"`) | `CD-CONF-002` (design-layer, `resolutionStatus: "proposed"`, `canonicalPreferenceStatus: "candidate"`) |
| Student-facing suppression | `true` | `true` |
| Arabic status | `correctedWording.ar: null`, `arabicStatus: "notGenerated"` | `correctedWording.ar: null`, `arabicStatus: "notGenerated"` |
| Already applied (any part)? | **No.** `affectedContentBlockIds: []`. No `ch01-t01-content.json` file exists anywhere in the repository (confirmed by direct filesystem search of `docs/content-design/chapter-01/`). | **No.** `affectedContentBlockIds: []`. No `ch01-t04-content.json` file exists anywhere in the repository (same search). |
| Record complete enough for a project-owner decision? | **Yes, with one caveat.** Classification, severity, rationale, original/corrected wording, and audit linkage are all populated. Caveat: one of five `originalWording.sourceRecordIds` entries (`SEG004`) is independently found to be miscited — see §3.2. This does not block a decision; it is a traceability gap worth correcting alongside any decision, not a missing-information gap. | **Yes, with one caveat.** Same completeness profile. Caveat: two of five `originalWording.sourceRecordIds` entries (`SEG017`, `SEG018`, and separately `S5-P033`) are independently found to be miscited — see §7.2/§7.3. Same non-blocking nature as above. |

**Explicit confirmation:** both `ch01-corr-001` and `ch01-corr-002` remain `approvalStatus: "proposed"` as of this brief, with `approvals.scientificReviewer`, `approvals.editorialReviewer`, and `approvals.approvedAt` all `null`. Neither has been applied to any canonical content, because no canonical content exists yet for either topic. `PILOT_READINESS.json.canonicalGenerationAuthorized` is `false` chapter-wide, and `PILOT_AUTHORIZATION.json` v1.1.0's `applicationBuildAuthorization.applicableTopicIds` is exactly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]` — `ch01-t01` and `ch01-t04` are outside every current authorization.

### 2.2 Repository context re-confirmed for this brief

- English/Arabic pilot baselines: both `1.0.2`, scoped exclusively to the four pilot topics (`ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`) — `ch01-t01`/`ch01-t04` are outside this scope entirely.
- `docs/app/PHSH111_CHAPTER1_EXPANSION_PLAN.md` §5 rates both `ch01-t01` and `ch01-t04` "**Requires scientific reconciliation**" — this brief is that reconciliation review, not a readiness upgrade.
- No independent human physics-subject-matter review has occurred on either correction, consistent with every other governance record in this project (see §16).

## 3. `ch01-corr-001` evidence brief

### 3.1 Exact issue reconstruction

- **Exact original claim:** No single verbatim sentence is quoted in `SCIENTIFIC_CORRECTIONS.json`; its `originalWording.summary` characterizes the pattern as: *"Distance, time, and mass are presented as though they form the complete universal list of fundamental quantities."* Independent verification (below) confirms this is an accurate characterization of the **compressed/bullet forms** of the source material, though the **fuller narrative forms** already partially self-correct (see §3.3).
- **Exact proposed corrected claim:** *"Distance, time, and mass are the fundamental quantities emphasized in this chapter's treatment of mechanics. Charge is another fundamental property used later in the course."*
- **Affected source/section/topic field:** `ch01-t01`'s eventual `mainIdea`/`organizedExplanation`/`keyConcept`/`equationSet`-adjacent framing content — no canonical field exists yet, since `ch01-t01` has no content file.
- **Scientific concept involved:** the scope of "fundamental physical quantities" in an introductory mechanics chapter — a curriculum-sequencing/definitional-scope question, not a computational or measurement-technique question.
- **Why the issue was originally flagged:** four independent audit passes (SCA01 at the top-level scientific audit, S3-SCI-001 on the PDF slide, S3C-SCI-001 on the solved-review Q&A, R1-SCI-001 on the review-card question) each separately identified that a "distance, time, mass" list, presented without an explicit "for this chapter's mechanics" scope statement, risks being read as an exhaustive claim about all of physics.
- **What a student may misunderstand if the original wording remains:** that physics recognizes only three fundamental quantities everywhere (as opposed to specifically for the mechanics content this chapter covers), and that charge — which the same lecture script (SEG009) explicitly names as a fourth fundamental property two sentences earlier — is somehow excluded or forgotten rather than deliberately deferred to a later chapter (charge is covered "in Chapter 7" per S2-SEG026).
- **Issue-type classification (per the required taxonomy):** primarily **incomplete** (the claim omits an explicit scope qualifier and the already-mentioned fourth fundamental, charge) with a secondary **ambiguous** component (a reader encountering only the compressed bullet form, without the surrounding sentence that names charge, could plausibly read "three fundamental quantities" as literally exhaustive). It is **not** scientifically incorrect — distance (L), time (T), and mass (M) genuinely are the three fundamentals a first mechanics chapter needs, and treating them as the complete list for *that scope* is standard practice — the issue is the missing scope qualifier, not an error in the physics itself.

### 3.2 Evidence verification — item by item

| Cited item | Exists? | Exact identifier | What it supports | Classification |
|---|---|---|---|---|
| `SEG004` | **Yes, but miscited.** `docs/content-audits/chapter-01/raw-sources/source-001-segments.json` | `SEG004` is tagged `linkedTopicIds: ["ch01-t14"]` (Chapter Review), not `ch01-t01`. It is "Slide 6 — Fundamental Physical Quantities" from a chapter-outline planning script, and does contain the "Distance (L) / Time (T) / Mass (M)" bullet pattern the correction targets, but it is not one of `ch01-t01`'s own two content-mapped segments (those are `SEG009`/`SEG010`, per `docs/content-audits/chapter-01/topic-mapping.json`'s `ch01-t01` entry: `"segmentIds": ["SEG009","SEG010"]`). | **Conflicting/miscited** — supports the general pattern the correction describes, but is attributed to the wrong topic. Flagged as a citation-accuracy issue, not a substantive evidence gap (see the Option B revision in §5). |
| `S2-SEG026` | **Yes.** `docs/content-audits/chapter-01/sources/source-002/source-002-segments.json` | Full textbook-style paragraph: *"...The units of measure of all of these quantities can be traced back to the units of measure of distance, time, and two properties of matter called mass and charge. We will postpone our treatment of charge until Chapter 7."* This is the fullest, most textbook-authoritative source and **already states the corrected framing almost verbatim** — it names charge and explicitly defers it. | **Strongly supports proposed correction** — in fact, this source shows the corrected wording is not new content but a restoration of language already present in the richest source. |
| `S3-P003` | **Yes.** `docs/content-audits/chapter-01/sources/source-003/page-inventory.json` | PDF bullet slide: *"Distance (L) / Mass (M) / Time (T)"* — no mention of charge on this specific page. Its own `scientificIssueIds: ["S3-SCI-001"]` confirms this page was independently flagged. The **immediately preceding page**, `S3-P002`, states the fuller paragraph (including charge) almost identically to `S2-SEG026`. | **Strongly supports proposed correction** — this is the clearest instance of the "compressed bullet omits the scope/charge context stated one page earlier" pattern the correction addresses. |
| `S3C-Q001` | **Yes.** `docs/content-audits/chapter-01/sources/source-conv-003/problem-solution-inventory.json` | Multiple-choice item: *"Three of the fundamental physical quantities in physics are… (b) distance, time, and mass."* The stem's own wording — **"three of"** — already avoids claiming exhaustiveness. | **Supports only with stated conditions** — the printed question is not itself scientifically wrong (its own audit, S3C-SCI-001, confirms "the answer is correct as worded"); it supports the correction only as an example of a compressed form that *could* be misread without the surrounding lecture context, not as an instance of an actually-incorrect claim. |
| `R1-Q001` | **Yes.** `docs/content-audits/chapter-01/sources/source-review-001/question-inventory.json` | Same "Three of the fundamental physical quantities…" stem, four-choice format, keyed `(b) distance, time, and mass`. | **Supports only with stated conditions** — same reasoning as `S3C-Q001` above; its own audit (R1-SCI-001) reaches the identical conclusion. |
| `SCA01` | **Yes.** `docs/content-audits/chapter-01/scientific-audit.json` | *"Length, mass, and time form a complete fundamental system… suitable for introductory mechanics but not all of physics… scope the claim explicitly to the mechanics quantities used in Chapter 1."* `status: "open"`. | **Strongly supports proposed correction** — this is the originating top-level audit finding; its recommended correction is the direct basis for `ch01-corr-001`'s corrected wording. |
| `S3-SCI-001` | **Yes.** `docs/content-audits/chapter-01/sources/source-003/scientific-audit.json` | *"Presents distance, mass, and time as the classification basis for nearly all quantities while the preceding slide also names charge… acceptable for mechanics only; too broad as a general physics claim."* `severity: "medium"`. | **Strongly supports proposed correction.** |
| `S3C-SCI-001` | **Yes.** `docs/content-audits/chapter-01/sources/source-conv-003/scientific-audit.json` | *"The answer is correct as worded ('three of')… retain the answer, but say these are the three fundamental quantities used in the chapter's mechanics treatment; charge is introduced later."* `severity: "low"`. | **Partially supports proposed correction** — explicitly confirms no factual error exists, recommends the same scope-qualifier fix at a lower severity. |
| `R1-SCI-001` | **Yes.** `docs/content-audits/chapter-01/sources/source-review-001/scientific-audit.json` | *"The wording says 'Three of,' so (b) is correct… When teaching, say distance, time, and mass are the three fundamental quantities emphasized for mechanics in this chapter."* `severity: "low"`. | **Partially supports proposed correction** — same pattern as `S3C-SCI-001`. |
| `CD-CONF-001` | **Yes.** `docs/content-design/chapter-01/DUPLICATE_AND_CONFLICT_DECISIONS.json` | Design-layer record restating the same scope concern; `canonicalPreferenceStatus: "candidate"`, `preferredSourceRecordId: null`, `resolutionStatus: "proposed"`. **No audit-layer (`C0x`) predecessor was found** — checked all four `canonicalConflicts` (`C01`–`C04`) in `docs/content-audits/chapter-01/duplicates-and-conflicts.json`; none concerns `ch01-t01` or fundamental-quantities scope. `CD-CONF-001` appears to have been authored directly from `SCA01`/`S3-SCI-001`/`S3C-SCI-001`/`R1-SCI-001`, not promoted from an existing audit-layer conflict. | Design-layer restatement of the same evidence above; not independent additional evidence. |
| `K1-SCI-004` (not cited by the correction record, found during independent verification) | **Yes.** `docs/content-audits/chapter-01/sources/source-kahoot-001/scientific-audit.json` | A **genuinely stronger** instance of the same pattern: a Kahoot item frames the claim as *"Physics describes three fundamental aspects of the universe"* keyed to "space, time, matter" — an explicitly cosmological framing, not just an unscoped mechanics list. Marked `severity: "medium"`, `relatedExistingRecords: ["SCA01","S3-SCI-001"]`. This Kahoot source is `studentFacingBlocked: true` and not part of the pilot precedent's evidence base, but independently corroborates that the scope-overreach pattern SCA01 identifies is real and recurring, not an isolated wording accident. | **Strongly supports proposed correction** (found independently; not one of the correction's own cited items, included here for completeness per the instruction to verify against the full audited evidence base, not just the correction's own citation list). |

### 3.3 Source-by-source comparison table

| Source | Classification | Basis |
|---|---|---|
| Textbook/chapter source (Source-002, `S2-SEG026`) | **Strongly supports proposed correction** | Already states the corrected framing nearly verbatim, including the charge deferral. |
| Course outline / lecture slides (Source-001 conversational script, `SEG009`/`SEG010` — the actual `ch01-t01` segments) | **Supports only with stated conditions** | `SEG009` itself already names charge in the same breath as distance/time/mass ("Those properties are called mass and charge"); `SEG010`'s closing line — *"These three quantities are so important that physics builds almost everything from them"* — is the actual locus of overreach risk in this source, since it drops the charge qualifier stated one segment earlier. |
| Lecture slides (Source-003 PDF, `S3-P002`/`S3-P003`) | **Conflicts with proposed correction on `S3-P003` alone / supports on `S3-P002`** | `S3-P002`'s paragraph form matches the textbook; `S3-P003`'s bullet form (the specifically flagged page) omits charge entirely — the clearest example of the pattern needing correction. |
| Solved review (Source-conv-003, `S3C-Q001`) | **Supports only with stated conditions** | Question wording itself ("three of") is not incorrect; audit confirms no answer-key error. |
| Problems (Source-conv-005) | **Silent** | No problem in this source maps to `ch01-t01` (`"problemCount": 0, "coverage": "absent-as-primary-problem-topic"` in that source's topic-mapping). |
| Review cards (Source-review-001, `R1-Q001`) | **Supports only with stated conditions** | Same reasoning as `S3C-Q001`. |
| Kahoot / question bank (Source-kahoot-001) | **Strongly supports proposed correction** | 5 occurrences / 4 unique questions; one item (`K1-SCI-004`) is the single clearest overreach instance found across all sources ("three fundamental aspects of the universe"). |
| Glossary (`BILINGUAL_GLOSSARY.json`) | **Unavailable** | No glossary term exists for "fundamental quantities," "time," or "charge" — searched directly, zero matches. This topic has no terminology groundwork at all (distinct from `ch01-t04`, see §7). |
| Visual inventory (`V02`) | **Silent** | `V02`'s spec ("Organize measurable reality as space, time, matter and introduce L, T, M") neither states nor contradicts the scope qualifier — it has not been drawn (`imageAvailable: false`), so there is nothing yet to conflict with. |
| Conflict record (`CD-CONF-001`) | **Strongly supports proposed correction** | Design-layer restatement of the same audit evidence; adds no new evidence. |
| Cross-source link (`S2S3-LINK-001`) | **Silent (structural only)** | Confirms `S2-SEG026` and `S3-P002` describe the same underlying content; no independent evidentiary weight. |

**No source directly and unambiguously conflicts with the proposed correction.** The closest thing to a conflict is that the review-question sources' own printed wording ("three of…") is already technically correct, meaning the correction's severity is arguably better characterized as addressing an *ambiguity risk in the compressed forms* rather than a live, standalone error — consistent with its `needsClarification`/`medium` classification (not `inaccurate`).

## 4. `ch01-corr-001` scientific analysis

- **Scientifically established fact:** distance (L), mass (M), and time (T) are indeed the three base dimensions from which the SI mechanical unit system is built (this is standard dimensional-analysis practice, independent of this repository's sources). Charge is a separate SI base-adjacent quantity relevant to electromagnetism, not mechanics.
- **Relevant assumptions / conditions of validity:** the "three fundamental quantities" framing is valid **specifically for the mechanics scope of this chapter** — it is not a claim about all of physics, and every source that states it correctly (S2-SEG026, S3-P002, SEG009) already scopes it that way.
- **Introductory-level simplification:** deferring charge to a later chapter (as `S2-SEG026` states, "Chapter 7") is a legitimate and common instructional sequencing choice, not a simplification that misrepresents the physics.
- **Is the proposed wording scientifically precise?** Yes. "Emphasized in this chapter's treatment of mechanics" is an accurate, non-overreaching scope statement; "Charge is another fundamental property used later in the course" is consistent with `S2-SEG026`'s own stated plan.
- **Appropriate for PHSH111 students?** Yes — PHSH111 is a health-sciences physics course; an explicit mechanics-scope statement is, if anything, more appropriate for this audience than an unscoped "all of physics" claim would be.
- **New ambiguity introduced?** None identified. The corrected wording is, if anything, less ambiguous than the original compressed forms.
- **Consistency with the rest of Chapter 1:** consistent — no other pilot or non-pilot topic's content contradicts a mechanics-scoped L/M/T framing.
- **Conflict with existing approved glossary terminology?** None — no glossary term exists for this topic's core vocabulary (see §3.3), so there is nothing to conflict with.
- **Does an existing approved correction already resolve part of this?** No. `ch01-corr-006` through `ch01-corr-009` (the four approved pilot corrections) address period/frequency, signed acceleration, centripetal acceleration, and the `v0=0` wording — none touches fundamental-quantities scope.

**Separation of established physics / source wording / instructional simplification / project recommendation:**
- *Established physics:* L, M, T are the mechanics-relevant fundamentals; charge is a separate, later-course quantity.
- *Source-specific wording:* Source-002's textbook prose already states this correctly; Source-003's bullet slide and the Kahoot item are the two clearest instances that drop the scope qualifier.
- *Instructional simplification:* deferring charge to a later chapter is a legitimate, source-sanctioned sequencing choice, not a physics simplification.
- *Project recommendation (this brief's own, non-binding):* the corrected wording is well-supported and low-risk; the one open item is the `SEG004` citation mismatch (§3.2), which is a recordkeeping matter, not a scientific one.

### Effects on existing records (if approved)

- **Definitely affected:** none — no `ch01-t01` content record exists yet to update.
- **Potentially affected (once drafting is separately authorized):** a future `ch01-t01-content.json`'s `mainIdea`/`organizedExplanation`/`keyConcept` blocks; `CD-CONF-001`'s `resolutionStatus` (would move from `proposed` toward `resolved` as a consequence of approval, per the pattern already used for `CD-CONF-006`–`008`); a future glossary decision for "charge" if that term is ever formally introduced; `PILOT_READINESS.json`'s per-topic readiness entry for `ch01-t01` (still gated on the separate canonical-generation-authorization decision, §12 gate 2 of the expansion plan).
- **Confirmed unaffected:** all four pilot topics' content, baselines, and application code; `ch01-corr-002`'s own record (no cross-dependency found); `V02`'s visual-inventory entry (text-only correction, no visual exists to affect).

## 5. `ch01-corr-001` decision options

### Option A — Approve as proposed

- **Why scientifically defensible:** the corrected wording restores language already present verbatim in the richest available source (`S2-SEG026`) and is independently recommended by four separate audit passes (SCA01, S3-SCI-001, S3C-SCI-001, R1-SCI-001) plus one additional item found during this brief's independent verification (K1-SCI-004). No source conflicts with it.
- **Evidence supporting approval:** §3.2/§3.3 in full — the strongest table classification ("strongly supports") applies to the majority of independently-checked sources.
- **Exact implementation implications:** the corrected two-sentence wording would become the basis for whichever content block(s) eventually state `ch01-t01`'s fundamental-quantities framing, once canonical-generation authorization for `ch01-t01` is separately granted (not part of this decision).
- **Residual risk:** low. No computational, unit, or notation content is involved (§ equivalent of Section 5 of the task brief — see explicit statement below).
- **Checks required after implementation:** re-verify wording is applied consistently to every content block that references "fundamental quantities" for this topic; correct the `SEG004`→`SEG009`/`SEG010` citation (§3.2) at the same time for recordkeeping accuracy, since it is the same file being touched.

### Option B — Revise before approval

- **Exact scientific or pedagogical weakness:** not a weakness in the wording itself — the weakness is evidentiary/traceability: `ch01-corr-001.originalWording.sourceRecordIds` includes `SEG004`, which `docs/content-audits/chapter-01/topic-mapping.json` tags to `ch01-t14`, not `ch01-t01`. The two segments actually mapped to `ch01-t01` (`SEG009`, `SEG010`) are not cited at all, even though `SEG010`'s closing line ("these three quantities are so important that physics builds almost everything from them") is arguably the clearest instance of the overreach pattern *within the topic's own actual source material*.
- **Narrowly defined revision direction:** replace `SEG004` with `SEG009` and `SEG010` in `originalWording.sourceRecordIds`, so the correction record cites the segments that actually constitute `ch01-t01`'s source content. This does not change the corrected wording itself.
- **Non-binding illustrative wording only** (if the project owner also wants the corrected wording to explicitly echo the source's own "physics builds almost everything from them" framing): *"Distance, time, and mass are the fundamental quantities this chapter's mechanics treatment builds nearly everything else from; charge, the fourth fundamental property named earlier in this same lecture, is developed separately beginning later in the course."* This is illustrative only, not a canonical proposal.
- **Evidence supporting revision:** the citation mismatch is independently confirmed (§3.2), and is the kind of traceability gap the pilot's own precedent treats seriously (e.g., `ch01-corr-009`'s `provenanceNote` field exists specifically to document non-standard evidence chains).
- **What must be re-reviewed afterward:** only the citation list; the scientific substance would not need re-review, since Option B does not propose changing it.

### Option C — Reject

- **Why rejection could be considered:** the review-question sources' own printed wording ("three of the fundamental physical quantities…") is not itself incorrect, and the topic's actual lecture-script segments (`SEG009`) already mention charge in the same breath — a reader who hears the full segment, not just an isolated bullet, would not necessarily be misled.
- **Evidence against the correction:** none found that directly contradicts the correction's substance; the case for rejection rests entirely on the argument that the *existing* source material, taken as a whole (not just the flagged compressed forms), is already adequate without a wording change.
- **What issue would remain unresolved:** the `S3-P003` bullet slide and the `K1-SCI-004` Kahoot item would remain unscoped, and any future content block drawn primarily from the compressed bullet form (rather than the fuller `SEG009`/`S2-SEG026` narrative) would still risk the overreach four independent audits flagged.
- **Required alternative action:** none proposed by any source — no audit record recommends leaving the wording unscoped. Rejection would mean overriding four independent, low-to-medium-severity audit findings without a competing source-based rationale, which the evidence gathered for this brief does not support.

## 6. `ch01-corr-001` advisory recommendation

- **Advisory recommendation:** **Approve**
- **Confidence:** **Medium** (not higher, specifically because of the `SEG004` citation mismatch identified in §3.2/§5 — a traceability gap, not a substance concern)
- **Strongest supporting evidence:** `S2-SEG026`'s textbook paragraph already states the corrected framing almost verbatim, including the charge deferral — the correction restores existing source language rather than inventing new content.
- **Strongest counterargument:** the citation list cites a segment (`SEG004`) that is not actually part of `ch01-t01`'s own mapped source content, which weakens the record's internal traceability even though it does not weaken the underlying scientific case.
- **Remaining uncertainty:** none scientific; the only open item is the citation-accuracy question in §5 Option B.
- **Independent physics subject-matter review required?** Not strictly required to proceed — this is a scope/completeness clarification, not a factual-accuracy correction, and is comparable in kind to `ch01-corr-006`'s (period/frequency `needsClarification`) precedent, which was approved via project-owner review of Claude's completed analysis without separate independent SME review.
- **Project-owner review alone sufficient at this stage?** Yes, consistent with the precedent set by `ch01-corr-006`–`009`.
- **Arabic review required before implementation?** Not before this correction decision itself; an Arabic translation and terminology decision would be needed before any Arabic canonical content is drafted (see §11).
- **Visual review required before implementation?** No — `V02` has no visual asset yet (§3.3), so there is nothing to review.

## 7. `ch01-corr-002` evidence brief

### 7.1 Exact issue reconstruction

- **Exact original claim:** `originalWording.summary`: *"Mass is treated primarily as amount of matter, and weight language does not consistently separate gravitational force from apparent weight."*
- **Exact proposed corrected claim:** *"Mass measures an object's inertia. Gravitational weight is the gravitational force on the object, while apparent weight is the support force indicated by a scale or felt by the body."*
- **Affected source/section/topic field:** `ch01-t04`'s eventual `mainIdea`/`organizedExplanation`/`keyConcept`/`misconception` content — no canonical field exists yet.
- **Scientific concept involved:** the operational definition of mass (inertia vs. "amount of matter") and the distinction between gravitational weight and apparent weight.
- **Why the issue was originally flagged:** two separate top-level audit items — `SCA02` (mass-as-amount-of-matter is an intuitive, partly circular description) and `SCA03` (the source's "no gravity means no weight" framing omits the gravitational-force/apparent-weight distinction) — plus a tangential low-severity note (`S5-SCI-012`) in an unrelated problem about felt-force phrasing.
- **What a student may misunderstand if the original wording remains:** that mass literally means "amount of matter" (a definition that becomes circular once pressed — "how much matter" is itself usually defined by mass), and that "weight" is a single, unambiguous quantity rather than something that can differ between its gravitational-force sense and its scale-reading (apparent) sense — a distinction that matters directly for later course material (e.g., apparent weightlessness, accelerating reference frames).
- **Issue-type classification (per the required taxonomy):** primarily **terminology inconsistency** (weight is used in more than one sense without being named as such) with a secondary **incomplete** component (mass's inertial definition is present in the source material but not led with). **Not** scientifically incorrect in the sense of stating a falsehood — "amount of matter" is a common introductory gloss, and the source elsewhere (S2-SEG056, S3-P013) does correctly connect mass to inertia — the issue is ordering/emphasis and a missing explicit distinction, not a false claim.

### 7.2 Evidence verification — item by item

| Cited item | Exists? | Exact identifier | What it supports | Classification |
|---|---|---|---|---|
| `SEG017` | **Yes, but miscited.** `docs/content-audits/chapter-01/raw-sources/source-001-segments.json` | Tagged `linkedTopicIds: ["ch01-t03"]` (Time), not `ch01-t04`. Its content is a "Time" lecture script ("Slide — 1.1 Fundamental Physical Quantities: Time… Time is defined by processes that repeat…"), unrelated to mass or weight. | **Conflicting/miscited** — this citation does not actually support the correction's mass/weight claim; it is the wrong segment. |
| `SEG018` | **Yes, but miscited.** Same file. | Also tagged `linkedTopicIds: ["ch01-t03"]`, also a Time/period-frequency lecture script ("Slide — where time stops being a background variable…"). | **Conflicting/miscited** — same issue as `SEG017`. |
| `S2-SEG056` | **Yes.** `docs/content-audits/chapter-01/sources/source-002/source-002-segments.json` | Full textbook paragraph: *"...Mass is also a measure of what we sometimes refer to as inertia. The larger the mass of an object, the greater its inertia and the more difficult it is to speed up or slow down."* | **Strongly supports proposed correction** — this source already states the inertia framing the correction proposes leading with; it is currently secondary to an "amount of matter" opening in the same paragraph, matching `SCA02`'s exact concern. |
| `S2-SEG058` | **Yes.** Same file. | *"...Weight, a quantity that is related to but is not the same as mass, is used instead… when you try to lift a heavy suitcase, you are experiencing its weight. When you pull it along and speed it up or slow it down, you are experiencing its mass."* | **Partially supports proposed correction** — clearly distinguishes weight-as-felt-from-lifting from mass-as-felt-from-accelerating (i.e., gravitational weight vs. inertia), but does **not** use or define the term "apparent weight" specifically — that half of the corrected wording is not verbatim-present in this source. |
| `S5-P033` | **Yes, but miscited.** `docs/content-audits/chapter-01/sources/source-conv-005/problem-inventory.json` | This problem's own `topicIds` field is `["ch01-t08"]` (Acceleration), not `ch01-t04`. `source-conv-005`'s own `ch01-t04` topic-mapping entry independently confirms `"problemIds": [], "problemCount": 0"` — `S5-P033` is not listed under `ch01-t04` anywhere else in the audit corpus. Its content is a drag-car acceleration problem ("0 to 300 mph in 5 s… 2.74 g"), only tangentially touching weight via a felt-force phrasing note (`S5-SCI-012`). | **Weak/indirect at best, effectively miscited** — this is an acceleration-topic problem, not mass/weight instructional content. Its only real connection is the low-severity `S5-SCI-012` note about not describing horizontal contact force as "body weight pushing backward," which is a different (though related) weight-terminology precision point than the correction's gravitational/apparent-weight distinction. |
| `SCA02` | **Yes.** `docs/content-audits/chapter-01/scientific-audit.json` | *"Mass is the amount of matter in an object… This is an intuitive and partly circular description… Lead with mass as a measure of inertia, while labeling amount of matter as introductory intuition."* `status: "open"`. | **Strongly supports proposed correction** — direct basis for the corrected wording's first sentence. |
| `SCA03` | **Yes.** Same file. | *"No gravity means no weight… This omits the distinction between gravitational force and apparent weight… Define gravitational weight and separately note apparent weight when relevant."* `status: "open"`. | **Strongly supports proposed correction** — direct basis for the corrected wording's second sentence. |
| `S5-SCI-012` | **Yes.** `docs/content-audits/chapter-01/sources/source-conv-005/scientific-audit.json` | *"The source says the driver feels nearly three times their body weight pushing backward… Say the seat must provide a horizontal force of about 2.74 times the driver's weight magnitude, rather than saying body weight pushes backward."* `severity: "low"`. | **Weak/indirect** — a real, valid weight-phrasing precision point, but in a different topic's (`ch01-t08`) problem, about a horizontal contact force, not the gravitational-weight/apparent-weight distinction `ch01-corr-002` is actually about. |
| `CD-CONF-002` | **Yes.** `docs/content-design/chapter-01/DUPLICATE_AND_CONFLICT_DECISIONS.json` | `sourceRecordIds: ["SEG017","SEG018","S2-SEG056","S2-SEG058","R1-Q004"]` — **note this design-layer record cites `R1-Q004`, not `S5-P033`, in the fifth evidence slot**, an internal inconsistency between `ch01-corr-002` and its own linked conflict record. `R1-Q004` (verified below) is a correctly-tagged, on-topic item. | Design-layer restatement; the `R1-Q004` substitution it makes is actually more accurate than `ch01-corr-002`'s own citation — see next row. |
| `R1-Q004` (cited by `CD-CONF-002`, not by `ch01-corr-002` itself — found during verification) | **Yes.** `docs/content-audits/chapter-01/sources/source-review-001/question-inventory.json` | True/false item, correctly tagged `topicIds: ["ch01-t04"]`: *"In mechanics, weight and mass measure the same property of matter."* Printed answer: **False**. | **Strongly supports proposed correction** — a correctly-scoped, on-topic review item that directly reinforces the mass≠weight distinction, and is a better-fitting fifth evidence citation than `S5-P033`. |

### 7.3 Source-by-source comparison table

| Source | Classification | Basis |
|---|---|---|
| Textbook/chapter source (Source-002, `S2-SEG056`/`S2-SEG058`) | **Strongly supports proposed correction** | Already states the inertia framing and the lift-vs-accelerate weight/mass distinction; does not yet use the term "apparent weight" specifically. |
| Course outline / lecture slides (Source-001 conversational script, `SEG021`/`SEG022` — the actual `ch01-t04` segments; **not** `SEG017`/`SEG018` as miscited in the correction record) | **Strongly supports proposed correction** | `SEG021`: *"Mass is a measure of what we often call inertia… We are not talking about gravity. We are not talking about weight."* `SEG022`: *"Mass measures inertia… Weight measures the force of gravity."* This is the most directly on-point source once the citation error is corrected — it states the corrected framing nearly verbatim. |
| Lecture slides (Source-003 PDF, `S3-P013`/`S3-P014`) | **Strongly supports proposed correction** | `S3-P013`: *"Mass is also a measure of what we sometimes refer to in everyday speech as inertia."* `S3-P014`: the lift-vs-pull suitcase contrast, matching `S2-SEG058`. Both pages independently show `scientificReviewStatus: "reviewed-no-material-issue-found"` — meaning the slides themselves were not separately flagged, consistent with the issue being one of emphasis/completeness rather than a stated error on these specific pages. |
| Solved review (Source-conv-003) | **Silent on this correction's core claim** | `S3C-Q001` (shared with `ch01-t01`) concerns fundamental-quantities scope, not mass/weight specifically; no `ch01-t04`-specific mass/weight question content was found flagged in this source beyond topic co-tagging. |
| Problems (Source-conv-005, `S5-P033`) | **Miscited / not actually about this topic** | See §7.2 — this problem belongs to `ch01-t08`, not `ch01-t04`, per its own `topicIds` field. |
| Review cards (Source-review-001, `R1-Q004`) | **Strongly supports proposed correction** | Correctly-tagged true/false item directly reinforcing mass≠weight — see §7.2. |
| Kahoot / question bank (Source-kahoot-001, `K1-SCI-010`) | **Conflicts with proposed correction's premise that a rewrite is universally needed — a positive-contrast finding** | *"This source's mass/weight wording is already clean… first source that does not need the SCA02/SCA03 correction applied to its own text."* Multiple Kahoot items (e.g., "'I weigh 70 kg' is physically incorrect because kg measures mass, not weight") already correctly separate the concepts. This does not argue against approving the correction (it corroborates the corrected framing is the field-standard answer, the same corroboration pattern used for the already-approved `ch01-corr-008`) but it does show the *source material itself* is not uniformly deficient — only specific passages are. |
| Glossary (`BILINGUAL_GLOSSARY.json`) | **Strongly supports proposed correction** | Three **pending** (not yet approved) glossary terms — `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight` — already define these concepts in language that closely mirrors the corrected wording, and all three list `ch01-corr-002` in their own `sourceReferences`. This is meaningful corroboration but not independent evidence (the glossary terms were evidently drafted with this same correction in mind). |
| Visual inventory (`V09`) | **Silent** | `V09`'s spec (lifting vs. accelerating a suitcase) is consistent with the gravitational-weight/inertia distinction but does not depict or caption an "apparent weight" (scale/elevator) scenario. Not drawn yet (`imageAvailable: false`). |
| Conflict record (`CD-CONF-002`) | **Strongly supports proposed correction** | See §7.2 — also corrects one of the correction record's own citation errors (`R1-Q004` vs. `S5-P033`). |

**No source directly contradicts the proposed correction's substance.** The one genuine tension is that "apparent weight" as a named, defined concept is not verbatim-present in any of the cited narrative sources (`S2-SEG058`, `S3-P014`, `SEG022` all describe the lift/pull-suitcase phenomenon but do not use that exact term) — it originates from `SCA03`'s own recommended-correction language. This is a legitimate, standard physics term (not an invention), but its introduction here is a slightly larger addition than the mass-as-inertia half of the correction, which is directly source-verbatim.

## 8. `ch01-corr-002` scientific analysis

- **Scientifically established fact:** mass is an intrinsic measure of inertia (resistance to acceleration under a given force, per Newton's second law); weight, in the gravitational-force sense, is `W = mg` and is location-dependent; apparent weight (the normal/support force a scale reads) equals gravitational weight only in the absence of vertical acceleration, and differs from it under acceleration (e.g., in an elevator).
- **Relevant assumptions / conditions of validity:** the corrected wording's "apparent weight is the support force indicated by a scale or felt by the body" is valid generally, without qualification — no special-case assumption is smuggled in.
- **Introductory-level simplification:** "amount of matter" remains a legitimate, source-supported introductory *intuition* for mass (both `SCA02` and the corrected wording's design intent, mirrored in the pending `ch01-term-mass` glossary entry, treat it this way) — the correction does not propose deleting this intuition, only demoting it from the primary operational definition to a supporting one.
- **Is the proposed wording scientifically precise?** Yes, for both clauses. "Mass measures an object's inertia" and the gravitational/apparent-weight split are both standard, unqualified-correct statements at the introductory level.
- **Appropriate for PHSH111 students?** Yes — the apparent-weight concept is directly relevant to health-sciences contexts (e.g., patient transport equipment, scale readings under motion) and is a reasonable, not overly advanced, addition for this course.
- **New ambiguity introduced?** Minor: the term "apparent weight" is introduced without the narrative sources' own worked illustration (no elevator/scale scenario currently exists in the cited source material) — see the residual-risk note in §9's Option A.
- **Consistency with the rest of Chapter 1:** consistent — no approved pilot content contradicts this framing; `ch01-t08`'s already-approved `ch01-corr-007` (sign-convention correction) discusses gravitational acceleration magnitude/sign but does not use the word "weight," so no direct terminology overlap or conflict exists with already-approved content (independently confirmed by a full-text search of `ch01-t08-content.json` for "mass"/"weight," which returned zero hits).
- **Conflict with existing approved glossary terminology?** No approved (only pending) terms exist for mass/weight/apparent-weight — nothing to conflict with, though see §11 for the terminology-approval gate this still requires.
- **Does an existing approved correction already resolve part of this?** No — the four approved pilot corrections (`006`–`009`) do not touch mass, weight, or inertia terminology.

**Separation of established physics / source wording / instructional simplification / project recommendation:**
- *Established physics:* mass = inertia measure; gravitational weight = `mg`; apparent weight = scale/support-force reading, which can differ from gravitational weight under acceleration.
- *Source-specific wording:* `SEG021`/`SEG022` (the correctly-identified `ch01-t04` segments) and `S2-SEG056`/`S2-SEG058` already state the inertia/gravitational-weight halves clearly; none uses the specific term "apparent weight."
- *Instructional simplification:* retaining "amount of matter" as introductory intuition (not the primary definition) is a reasonable simplification, consistent with the source material's own sequencing.
- *Project recommendation (this brief's own, non-binding):* well-supported for the mass/gravitational-weight half; the apparent-weight half is sound physics but should be flagged to the project owner as the more source-novel addition, alongside the citation corrections in §7.2.

### Effects on existing records (if approved)

- **Definitely affected:** none — no `ch01-t04` content record exists yet.
- **Potentially affected (once drafting is separately authorized):** a future `ch01-t04-content.json`'s `mainIdea`/`organizedExplanation`/`keyConcept`/`misconception` blocks; `CD-CONF-002`'s `resolutionStatus`; the three **pending** glossary terms (`ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`), which would need to move through terminology and scientific review to reach `approved` status (they are not automatically approved by approving this correction); `PILOT_READINESS.json`'s per-topic readiness entry for `ch01-t04`.
- **Confirmed unaffected:** all four pilot topics, including `ch01-t08` (independently confirmed to contain no "mass"/"weight" text to reconcile against); `ch01-corr-001`'s own record; `V09`'s visual-inventory entry (no visual exists yet).

## 9. `ch01-corr-002` decision options

### Option A — Approve as proposed

- **Why scientifically defensible:** both halves of the corrected wording are standard, unqualified-correct physics, directly supported by `SCA02`/`SCA03`, the correctly-identified `SEG021`/`SEG022` segments, `S2-SEG056`/`S2-SEG058`, `S3-P013`/`S3-P014`, `R1-Q004`, and (as positive corroboration of the field-standard framing) `K1-SCI-010`.
- **Evidence supporting approval:** §7.2/§7.3 in full.
- **Exact implementation implications:** becomes the basis for `ch01-t04`'s future mass/weight framing content, once canonical-generation authorization is separately granted; would also be the trigger to move the three pending glossary terms into their own terminology-review process (approving the correction does not itself approve the glossary terms).
- **Residual risk:** low-to-moderate. The "apparent weight" clause, while scientifically sound, is the one part of the corrected wording without a direct verbatim source precedent — worth the project owner's explicit awareness, not a reason to block approval on its own.
- **Checks required after implementation:** correct the `SEG017`/`SEG018`→`SEG021`/`SEG022` and `S5-P033`→`R1-Q004` citation errors (§7.2) at the same time, for the same recordkeeping-accuracy reason as `ch01-corr-001`; separately advance the three pending glossary terms through review before any Arabic canonical text is drafted (§11).

### Option B — Revise before approval

- **Exact scientific or pedagogical weakness:** again, not in the wording itself, but in the record's evidentiary trail: two of five `originalWording.sourceRecordIds` (`SEG017`, `SEG018`) are independently confirmed to belong to `ch01-t03` (Time), not `ch01-t04`; a third (`S5-P033`) belongs to `ch01-t08` and is absent from `ch01-t04`'s own problem list. The correction's own linked conflict record (`CD-CONF-002`) already cites the more accurate `R1-Q004` in that slot, meaning the more correct citation exists elsewhere in the repository and was simply not carried over.
- **Narrowly defined revision direction:** replace `SEG017`, `SEG018` with `SEG021`, `SEG022`, and replace `S5-P033` with `R1-Q004`, in `originalWording.sourceRecordIds`. No change to the corrected wording's substance is proposed.
- **Non-binding illustrative wording only** (if the project owner wants the apparent-weight clause more explicitly source-grounded before approval, e.g. by adding a brief illustrative scenario): *"Mass measures an object's inertia — its resistance to a change in motion, distinct from how much matter it is said to contain. Gravitational weight is the gravitational force on the object; apparent weight, the reading a scale gives or the support force a body feels, can differ from gravitational weight — for example, during acceleration — and is discussed further later in the course."* This is illustrative only, not a canonical proposal.
- **Evidence supporting revision:** the citation mismatches are independently confirmed (§7.2), and `CD-CONF-002`'s own more-accurate citation shows the correct evidence was already identified elsewhere in the governance record.
- **What must be re-reviewed afterward:** only the citation list (mechanical fix); if the illustrative apparent-weight elaboration is also adopted, that specific added clause would need its own brief re-check against source material, though none currently contradicts it.

### Option C — Reject

- **Why rejection could be considered:** `S3-P013`/`S3-P014` (the PDF slides) were independently reviewed with `scientificReviewStatus: "reviewed-no-material-issue-found"` — i.e., not separately flagged as containing an error — and the Kahoot source's positive-contrast finding (`K1-SCI-010`) shows correctly-distinguished mass/weight content is achievable without a corpus-wide rewrite.
- **Evidence against the correction:** none found that contradicts the correction's substance; `K1-SCI-010` argues the *problem is not universal across every source*, not that the problem doesn't exist where `SCA02`/`SCA03` identify it.
- **What issue would remain unresolved:** the circular "amount of matter" primary definition (`SCA02`) and the unnamed gravitational/apparent-weight distinction (`SCA03`) would both remain unaddressed in whatever source material eventually becomes `ch01-t04`'s canonical content.
- **Required alternative action:** none proposed by any source; no audit record recommends leaving mass/weight terminology as originally found.

## 10. `ch01-corr-002` advisory recommendation

- **Advisory recommendation:** **Approve**
- **Confidence:** **Medium** (the mass/gravitational-weight half of the wording is very strongly evidenced; the apparent-weight half, while sound physics, has a thinner direct-source trail — combined with the two citation-mismatch findings in §7.2, this keeps confidence at Medium rather than High)
- **Strongest supporting evidence:** `SEG021`/`SEG022` — the correctly-identified `ch01-t04` lecture segments — already state the mass-as-inertia and gravitational-weight-as-force-of-gravity framing in language very close to the proposed correction, once the citation error is looked past.
- **Strongest counterargument:** "apparent weight" as a specifically named, defined concept is not verbatim-present in any cited narrative source; it is a sound but source-novel addition relative to the mass-as-inertia half.
- **Remaining uncertainty:** whether the project owner wants the apparent-weight clause elaborated with a concrete scenario (Option B's illustrative addition) before approval, or is comfortable approving the definitional statement as-is and letting a worked scenario emerge during future drafting.
- **Independent physics subject-matter review required?** Not strictly required — comparable in kind to the already-approved `ch01-corr-007`'s (`contextDependent`) precedent, which also introduced a clarifying distinction (sign convention vs. magnitude) not verbatim-stated in the original source, and was approved via project-owner review alone.
- **Project-owner review alone sufficient at this stage?** Yes, consistent with precedent.
- **Arabic review required before implementation?** Not before this correction decision itself; three glossary terms already await terminology review (see §11) and would need to complete that process before Arabic canonical content is drafted.
- **Visual review required before implementation?** No — `V09` has no visual asset yet (§7.3).

## 11. Arabic impact

**Neither correction has generated Arabic wording** (`arabicStatus: "notGenerated"` on both records). Per the constraints of this task, no canonical Arabic translation is produced here — the following are non-binding terminology notes only.

**`ch01-corr-001` / `ch01-t01`:**
- No glossary term exists for "fundamental quantities," "distance" (the one existing `ch01-term-distance` entry is scoped only to `ch01-t02`), "time," or "charge." This topic has **zero** terminology groundwork — a full new glossary-approval pass would be needed before Arabic canonical content could be drafted, following the same terminology-review→scientific-review→approved pipeline already used for the pilot's 7 approved terms.
- The corrected wording contains no equations and only one Latin single-letter-adjacent token risk (none, in fact — "L," "T," "M" symbol notation appears only in the underlying source slides, not in the corrected prose itself); LTR-isolation and bidi risk are minimal for this specific correction.
- A direct translation of the corrected wording appears feasible without conceptual adaptation, once the "charge" term itself is formally defined in the glossary (not yet the case).

**`ch01-corr-002` / `ch01-t04`:**
- Three glossary terms already exist in **pending** (not approved) status — `ch01-term-mass` (الكتلة), `ch01-term-weight` (الوزن), `ch01-term-apparent-weight` (الوزن الظاهري) — each explicitly cross-referencing `SCA02`/`SCA03`/`ch01-corr-002` in `sourceReferences`, and each with a `discouragedTranslations` note keeping "mass" and "weight" from being conflated in Arabic (`ch01-term-mass` discourages الوزن; `ch01-term-weight` discourages الكتلة). This is meaningfully more terminology groundwork than `ch01-t01` has, but **none of the three terms is yet `approved`** — all three would need to complete terminology + scientific review before Arabic canonical content is drafted, exactly like every other pilot glossary term did.
- No equations or unit symbols are involved; LTR-isolation/bidi risk is low, similar to `ch01-corr-001`.
- A direct translation of the mass/gravitational-weight sentence appears feasible using the existing pending terms. The apparent-weight clause, being the more source-novel half (§9/§10), may benefit from an explicit terminology-reviewer check that الوزن الظاهري is the reviewer's preferred rendering (it is already the pending proposal) before being treated as settled.

**Neither topic's Arabic content can proceed** until (a) this correction decision is made, (b) canonical-generation authorization is separately granted for the topic (§12 gate 2 of the expansion plan — unaffected by this brief), and (c) the relevant glossary terms complete their own approval pipeline.

## 12. Visual impact

**`ch01-corr-001` / `ch01-t01` — `V02` ("Fundamental quantities list"):**
- **Classification: No visual impact.** `V02` does not exist yet (`imageAvailable: false`) — there is nothing to change. Its current spec text ("organize measurable reality as space, time, matter and introduce L, T, M") neither states nor contradicts the mechanics-scope qualifier the correction adds.
- **Forward-looking note (non-binding):** whenever `V02` is eventually specified for production, its caption/summary-box language should be written to match whatever scope qualifier this correction settles on, so the visual doesn't reintroduce the same "complete list" impression in graphical form that the text correction is resolving. This is a note for a future visual-planning task, not an action for this brief.

**`ch01-corr-002` / `ch01-t04` — `V09` ("Mass and weight suitcase"):**
- **Classification: No visual impact.** `V09` does not exist yet (`imageAvailable: false`) — same reasoning.
- **Forward-looking note (non-binding):** `V09`'s current spec (lift vs. accelerate a suitcase) already depicts the gravitational-weight/inertia contrast well, but does not depict an apparent-weight (scale/elevator) scenario. If the corrected wording's apparent-weight clause is approved as proposed, a future visual-planning task may want to consider whether `V09`'s scope should extend to illustrate apparent weight, or whether that remains text-only for this topic. Not resolved here.

Neither correction requires creating, modifying, or specifying any visual as part of this brief, and none was created or modified.

## 13. Batch-level assessment

- **Conceptual relationship:** both topics are early-chapter, foundational-definition topics. `ch01-t01` establishes the L/T/M fundamental-quantities framework in general; `ch01-t04` elaborates specifically on one of those three (mass) plus the closely related derived concept of weight. There is a mild, natural prerequisite relationship (understanding "mass is fundamental" before "mass measures inertia, distinct from weight" reads more smoothly in that order) but not a hard dependency — `ch01-t04` does not require `ch01-t01`'s correction to be resolved first to be scientifically coherent on its own.
- **Prerequisite relationship:** soft/sequencing only, not blocking, as above.
- **Shared terminology:** minimal direct overlap — `ch01-t01`'s corrected wording mentions "mass" as one of three fundamentals; `ch01-t04` is where mass is actually defined operationally. No terminology conflict was found between the two corrections' proposed wordings.
- **Shared scientific risks:** both are `needsClarification`/`medium` — a scope/completeness risk profile, not a factual-accuracy risk profile — consistent with the expansion plan's own characterization of Batch 1 as the lowest-risk non-pilot batch.
- **Shared visual needs:** none — `V02` and `V09` are unrelated diagrams with no shared asset or dependency.
- **Shared Arabic terminology:** none — the two topics' glossary needs are entirely disjoint (charge/fundamental-quantities vocabulary vs. mass/weight vocabulary).
- **Must one correction be resolved before the other?** No — they are independent decisions; either could be approved, revised, or rejected without technically blocking the other.
- **Should one topic move to a different batch?** No basis found for separating them — both share the same risk classification, the same "requires scientific reconciliation" readiness gate, and the same citation-hygiene issue pattern (each correction record has at least one miscited source), which is itself a mild point of similarity rather than a reason to split them.
- **Can drafting begin immediately after both correction decisions?** No — per the expansion plan §12 gate 2, canonical-generation authorization (`PILOT_READINESS.json.canonicalGenerationAuthorized`, currently `false` chapter-wide, and no per-topic authorization in `PILOT_AUTHORIZATION.json` for either topic) is a separate, still-absent gate. Resolving these two corrections is a prerequisite step, not the final one.

**Recommendation: keep Batch 1 unchanged.** Both topics remain well-matched in risk profile, scope, and readiness state; no evidence gathered for this brief supports separating, deferring, or reordering them.

## 14. Post-decision pathways

**If `ch01-corr-001` and/or `ch01-corr-002` is approved (as proposed, or as revised):**
- Update the relevant correction record's `approvalStatus` to `editoriallyApproved` and populate `approvals` (scientific/editorial reviewer, date, basis) — a controlled correction-record-update task, following the exact pattern already used for `ch01-corr-006`–`009`.
- If Option B's citation corrections are also accepted, apply them to `originalWording.sourceRecordIds` as part of that same controlled task.
- Separately request English canonical-generation authorization for the approved topic(s) — this is not automatic; it requires its own explicit `PILOT_AUTHORIZATION.json`/`PILOT_READINESS.json` amendment, following the same pattern used to authorize the original four pilot topics.
- Arabic planning: advance the relevant glossary terms (three pending for `ch01-t04`; none yet drafted for `ch01-t01`) through terminology review, separately from and after the English drafting authorization.
- Visual planning: a dedicated visual-specification task for `V02`/`V09`, informed by the forward-looking notes in §12, only after English content exists to visualize.
- Baseline implications: once English content is drafted and reviewed, a **new** baseline-approval action would be needed (the existing `ENGLISH_PILOT_BASELINE_APPROVAL.json`/`ARABIC_PILOT_BASELINE_APPROVAL.json` are scoped exclusively to the four pilot topics and do not extend automatically).

**If revision is requested for either correction:**
- A correction-revision task, scoped narrowly to the specific citation or wording change requested — not a new decision brief, unless the revision is substantial enough to materially change the evidence picture.
- Re-check any newly-cited source records the same way this brief did (existence, exact quote, classification) before the revised correction is presented for a fresh approval decision.
- A short targeted addendum to this brief (or a note in the correction record itself) would suffice for a citation-only fix; a full new decision brief would only be warranted for a substantive wording change.

**If either correction is rejected:**
- `CD-CONF-001`/`CD-CONF-002`'s `resolutionStatus` would need an explicit disposition decision (e.g., marked `rejected` or `supersededBy` a different resolution) rather than being left indefinitely `proposed`.
- The corresponding topic's readiness classification in a future expansion-plan revision would stay "Requires scientific reconciliation" (or move to a new, unresolved state) — rejection does not by itself make a topic ready for drafting.
- An alternative scientific-resolution task would be needed to determine what wording (if not the one proposed here) should eventually address the underlying `SCA01`/`SCA02`/`SCA03` findings, since no audit record proposes leaving them unaddressed.

**None of the above actions were performed during this task.**

## 15. Project-owner decision sheet

### ch01-corr-001

- Topic: ch01-t01
- Advisory recommendation: Approve
- Confidence: Medium
- Independent review required: Not strictly required (project-owner review alone is consistent with existing precedent)
- Project-owner decision: [Approve / Revise / Reject — leave blank]
- Project-owner notes: [leave blank]
- Decision date: [leave blank]

### ch01-corr-002

- Topic: ch01-t04
- Advisory recommendation: Approve
- Confidence: Medium
- Independent review required: Not strictly required (project-owner review alone is consistent with existing precedent)
- Project-owner decision: [Approve / Revise / Reject — leave blank]
- Project-owner notes: [leave blank]
- Decision date: [leave blank]

### Batch 1

- Advisory batch recommendation: Keep Batch 1 unchanged (ch01-t01 + ch01-t04)
- Proceed after correction decisions: [Yes / No — leave blank]
- Additional prerequisite task: [leave blank]
- Project-owner notes: [leave blank]

## 16. Governance statement

- **Both `ch01-corr-001` and `ch01-corr-002` remain `approvalStatus: "proposed"`** as of the completion of this brief — unchanged by this task.
- **Neither correction has been applied** to any canonical content, and none exists to apply it to: no `ch01-t01-content.json` or `ch01-t04-content.json` file exists anywhere in this repository.
- **No project-owner decision was made during this task.** The recommendations in §6 and §10 are this brief's own independent advisory analysis, not a decision, approval, or rejection of either correction.
- **No independent human subject-matter approval was inferred, claimed, or implied anywhere in this document.** Every scientific analysis, evidence classification, and recommendation above was performed by Claude under project-owner direction, consistent with every other governance record in this project (baseline approvals, `ch01-corr-006`–`009`'s own `approvalBasis` fields, and the Phase 4 owner review packet).
- **Student-facing publication remains unauthorized.** `studentFacingAllowed` and `studentPublicationAuthorized` remain `false` chapter-wide and on every existing record; this brief does not touch, and has no bearing on, those flags.
- **Completing this brief does not authorize drafting, translation, illustration, or application expansion of any kind.** It is a prerequisite analysis step only, per the expansion plan's own §15 characterization of this exact task.

---

### Validation (confirmed before finishing)

- Both correction records (`ch01-corr-001`, `ch01-corr-002`) in `SCIENTIFIC_CORRECTIONS.json` remain unchanged by this task — this brief only read that file, never wrote to it.
- Both `approvalStatus` fields remain `proposed`.
- No Arabic canonical wording was generated anywhere in this document — §11 contains non-binding terminology notes only, explicitly labeled as such.
- No content record (`ch01-t01-content.json`, `ch01-t04-content.json`, or any other) was created.
- No baseline, readiness, authorization, glossary, conflict-decision, or content-audit file was changed.
- Every field in §15's decision sheet that was required to be left blank (`Project-owner decision`, `Project-owner notes`, `Decision date`, and the Batch 1 `Proceed after correction decisions` / `Additional prerequisite task` / `Project-owner notes` fields) is blank.
- Publication remains unauthorized (§16).
