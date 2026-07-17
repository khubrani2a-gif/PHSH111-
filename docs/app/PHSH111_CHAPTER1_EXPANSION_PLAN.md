# PHSH111 Chapter 1 — Expansion-Readiness Plan

**Prepared:** 2026-07-16. **Type:** Read-only planning and inventory. Nothing was generated, drafted, translated, illustrated, corrected, or approved to produce this document, and no existing file (application, canonical, governance, or audit) was modified.

> **Update (2026-07-16, post-plan):** §5's readiness table and §15's recommended next task describe this document's state as originally written, when `ch01-corr-001`/`ch01-corr-002` were still `proposed`. Since then, both have gone through a scientific-reconciliation decision brief, a citation/traceability repair, and project-owner approval (`ch01-corr-001`: approved; `ch01-corr-002`: approved with qualification) — see `docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md`, `docs/app/PHSH111_BATCH1_CORRECTION_CITATION_REPAIR.md`, and `docs/app/PHSH111_BATCH1_CORRECTION_APPROVAL_RECORD.md`. Batch 1's scientific-reconciliation prerequisite is now complete. The original findings and recommendations below are preserved exactly as written — only resolution status is appended, in §16.

## 1. Purpose and constraints

This document determines exactly what would be required to expand PHSH111 from the current four-topic internal pilot to the complete 14-topic Chapter 1. It is planning and inventory only — a project-owner decision document, not an implementation. It does not authorize anything by itself.

**Constraints observed while producing this document:** no application code, canonical JSON, SVG file, validation record, baseline, correction record, governance/authorization file, or `docs/content-audits/` file was modified; no new topic content, translation, or visual was generated; no application route was added; nothing was installed, built, run, deployed, staged, committed, or pushed; no independent academic approval is claimed anywhere below.

## 2. Current verified checkpoint

Re-confirmed against the live repository, consistent with `docs/app/PHSH111_INTERNAL_PILOT_CHECKPOINT.md`:

- App name `PHSH111`, package name `phsh111`, application directory `apps/chapter1-mvp/` — unchanged.
- Four pilot topics, unchanged: `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10`.
- English and Arabic pilot baselines: both `1.0.2`.
- `studentFacingAllowed: false`, `studentPublicationAuthorized: false` — unchanged, chapter-wide and per-record.
- `PILOT_READINESS.json.canonicalGenerationAuthorized`: **`false`** chapter-wide — no topic outside the four-topic pilot currently has generation authorization of any kind.
- `PILOT_AUTHORIZATION.json` v1.1.0's `applicationBuildAuthorization.applicableTopicIds` is explicitly `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]` — the same four, verbatim. See §12.

## 3. Complete proposed Chapter 1 topic map

Source of truth: `docs/content-audits/chapter-01/topic-mapping.json`, cross-verified against `docs/content-design/chapter-01/IDENTIFIER_REGISTRY.json` (14-entry `topicIds` array), `PILOT_AUTHORIZATION.json`'s `scope.notAuthorized` list, and `CHAPTER_01_CANONICAL_STRUCTURE_PROPOSAL.md` §10. All 14 IDs and titles are explicitly attested in these files — none is invented.

| Topic ID | Title | Status |
|---|---|---|
| `ch01-t01` | Fundamental Quantities | Topic with audited material — not implemented |
| `ch01-t02` | Distance, Units, Area and Volume | **Already implemented in pilot** |
| `ch01-t03` | Time, Period and Frequency | **Already implemented in pilot** |
| `ch01-t04` | Mass, Inertia and Weight | Topic with audited material — not implemented |
| `ch01-t05` | Average and Instantaneous Speed | Topic with audited material — not implemented |
| `ch01-t06` | Velocity, Scalars and Vectors | Topic with partial source support — not implemented |
| `ch01-t07` | Vector Representation and Addition | Topic with audited material (conflicting visual sourcing) — not implemented |
| `ch01-t08` | Acceleration, Signs and g | **Already implemented in pilot** |
| `ch01-t09` | Free Fall | Topic with partial/insufficient source support — not implemented |
| `ch01-t10` | Centripetal Acceleration | **Already implemented in pilot** |
| `ch01-t11` | Rest and Uniform Motion | Topic with audited material (scope collision with t12) — not implemented |
| `ch01-t12` | Position-Time Graphs and Slope | Topic with audited material (terminology conflict) — not implemented |
| `ch01-t13` | Constant Acceleration and Motion Graphs | Topic with audited material (richest non-pilot topic) — not implemented |
| `ch01-t14` | Chapter Review and Problems | Topic explicitly marked incomplete — not implemented |

No topic ID is renumbered. No topic beyond these 14 is proposed — this list is exhaustive per the audited sources; nothing was added from general physics knowledge.

**Topics with conflicting source coverage:** `ch01-t05` (Usain Bolt fact conflict, `CD-CONF-005`), `ch01-t07` (vector-addition explanation conflict, `CD-CONF-003`, plus a rights-pending source visual), `ch01-t11`/`ch01-t12` (unresolved title/scope collision, audit-layer conflict `C04`, never promoted to a design-layer decision), `ch01-t12` (distance-time vs. position-time terminology conflict, audit-layer `C02`, not promoted), `ch01-t13` (graph-wording ambiguity, `CD-CONF-004`, plus two independently confirmed numeric errors in its problem source).

**Topics with no sufficient audited source (evidence gap, not just unresolved conflict):** `ch01-t09` (main narrative source reduced to a single segment, zero Source-002 coverage, one PDF page only) and `ch01-t14` (explicitly labeled `"readiness": "incomplete"` in the design-layer structure proposal, pending "the Kahoot decision and missing-source policy").

## 4. Source-coverage matrix

Coverage classification per topic per source. Sources: **Main** = `docs/content-audits/chapter-01/topic-mapping.json` (primary 70-segment conversation transcript); **S2** = Source-002 (`sources/source-002/topic-mapping.json`); **S3** = Source-003 PDF (`sources/source-003/topic-mapping.json`); **S3C** = Source-conv-003 solved-review Q&A (`sources/source-conv-003/`); **S5** = Source-conv-005 problem set (`sources/source-conv-005/`); **K1** = Kahoot question bank (`sources/source-kahoot-001/topic-coverage-report.md`); **R1** = Review-card source (`sources/source-review-001/`).

| Topic | Main | S2 | S3 (PDF) | S3C (Q&A) | S5 (problems) | K1 (Kahoot) | R1 (review card) |
|---|---|---|---|---|---|---|---|
| `ch01-t01` | Substantial (`SEG009`,`SEG010`; `coverageStatus: adequate`) | Substantial (12 segs) | Partial (pp.2–3) | Minimal (`S3C-Q001`) | Absent | Partial (5 occ./4 uniq.) | Minimal (`R1-Q001`, shared w/ t04) |
| `ch01-t04` | Substantial (`SEG021`,`SEG022`; adequate) | Substantial (8 segs) | Partial (pp.13–14) | Partial (3 Qs) | Absent | Substantial (18 occ./10 uniq.) | Partial (3 Qs) |
| `ch01-t05` | Complete (`SEG023`–`030`; `coverageStatus: rich`) | Complete (40 segs, largest S2 topic) | Complete (pp.15–23) | Partial (2 Qs) | Substantial (6 problems) | Complete (32 occ./18 uniq.) | Partial (2 Qs) |
| `ch01-t06` | Minimal (`SEG032` only; `coverageStatus: partial`, flagged "needs additional material") | Substantial (16 segs) | Minimal (p.24 only) | Partial (2 Qs) | Minimal (`S5-P012`, shared w/ t07) | Complete (34 occ./16 uniq. — heaviest Kahoot coverage of any topic) | Partial (2 Qs) |
| `ch01-t07` | Complete (`SEG033`–`035`; rich) | Substantial (8 segs) | Substantial (pp.25–27) — **requires visual inspection** (source visual identity unconfirmed) | Minimal (1 Q) | Partial (2 problems) | Partial (10 occ./6 uniq.) | Minimal (1 Q) |
| `ch01-t09` | Minimal (`SEG040` only; partial, flagged "needs additional material") | **Absent** (0 segments — after source cutoff) | Minimal (p.32 only) — **requires visual inspection** (context-limited photo) | Minimal (2 Qs, one shared w/ t13) | Minimal (2 problems, both shared w/ t13) | Complete (25 occ./16 uniq. — heaviest free-fall coverage) | Minimal (2 Qs) |
| `ch01-t11` | Complete (`SEG031`,`SEG044`–`049`; rich, 7 segs) | **Absent** (cutoff) | Complete (7 pages) | Absent (supporting-mention only, 0 mapped Qs) | Minimal (2 problems, shared w/ t05) | Partial (11 occ./7 uniq.) | **Absent** (zero review-card questions) |
| `ch01-t12` | Complete (`SEG050`–`054`; rich, 5 segs) | **Absent** (cutoff) | Complete (5 pages) — **requires visual inspection** (context-limited: discrete points, no drawn line) | Partial (2 Qs) | Substantial (4 problems) | **Conflicting** (28 occ./11 uniq. — 15 of 28 carry a distance-time/position-time mislabeling defect) | Partial (2 Qs) |
| `ch01-t13` | Complete (`SEG055`–`068`; rich, 12 segs — largest) | **Absent** (cutoff) | Complete (12 pages) — **requires visual inspection** (context-limited stroboscopic images, no time stamps) | Substantial (3 Qs) | Complete (9 problems — largest S5 topic; 2 confirmed numeric errors) | Complete (24 occ./17 uniq.; all 6 figure-dependent Kahoot items in the corpus concentrate here) | Substantial (3 Qs) |
| `ch01-t14` | Partial (6 segs across the whole chapter's framing material; explicitly "incomplete") | Substantial (18 segs, chapter-outline paragraphs) | Minimal (pp.1, 58–59) | Complete (all 18 questions map here as primary purpose) | Complete (all 33 problems map here) | Partial (6 occ./4 uniq. directly tagged; primary contribution is filling a previously-documented gap) | Complete (all 18 questions/4 cards map here) |

## 5. Topic-readiness table

Statuses use the required taxonomy. "Ready" is never assigned merely because a title exists — every status below cites the specific blocking or clearing evidence.

| Topic | Status | Evidence |
|---|---|---|
| `ch01-t02`, `ch01-t03`, `ch01-t08`, `ch01-t10` | **Already implemented in pilot** | Live in `apps/chapter1-mvp/`, baselines `1.0.2`, tests passing. |
| `ch01-t01` | **Requires scientific reconciliation** | `ch01-corr-001` (needsClarification, medium) is only `approvalStatus: "proposed"` — not approved, unlike the pilot's `ch01-corr-006/007/008/009` which were all approved before their topics were drafted. `CD-CONF-001` (scope-limiting conflict) is also unresolved (`proposedPendingCitationAndReviewerApproval`). Source coverage itself is adequate. Secondary gate: visual-source decision (§8). |
| `ch01-t04` | **Requires scientific reconciliation** | Same pattern as t01: `ch01-corr-002` proposed, not approved; `CD-CONF-002` unresolved. Source coverage adequate. Secondary gate: visual-source decision. |
| `ch01-t05` | **Requires scientific reconciliation** | Richest non-pilot source coverage, but `ch01-corr-005` is only `needsEvidence` (an earlier stage than "proposed" — a citation/fact pairing must be selected before the correction can even be reviewed), `CD-CONF-005` unresolved, and two further scientific-audit items (`SCA06`, `SCA07`) have no correction record at all yet. Highest scientific-risk-to-source-richness ratio of any non-pilot topic. |
| `ch01-t06` | **Ready after targeted source review** | No scientific-audit item, no correction, no conflict record exists for this topic at all — the only non-pilot topic with zero flagged scientific risk. However, the main narrative source is reduced to a single segment, explicitly flagged in `AUDIT_SUMMARY.md` as needing "additional material," and **no visual-inventory item exists for it at all** (unclear whether a visual is even needed — itself an open question a targeted review would resolve). Strong quiz-source coverage (heaviest Kahoot coverage of any topic) cannot substitute for explanatory source material per the established pilot precedent (Kahoot content is never used as a primary explanatory source). |
| `ch01-t07` | **Requires scientific reconciliation** (and requires visual-source decision) | `ch01-corr-003` is classified `"inaccurate"` (not merely `needsClarification`) — a confirmed error, not just an ambiguity — and remains `proposed`, not approved. Separately, its one formally tracked visual (`ch01-vis-001`, Figure 1.13 vector-addition panels) is `resolutionStatus: "open"` with `blockingReason` including `rightsPending` — a rights question, not just a redesign task. Both gates are independent and both must clear. |
| `ch01-t09` | **Insufficient evidence** | Main narrative source: one segment only, explicitly flagged as needing more material. Source-002: zero coverage (entirely after that source's cutoff). Source-003 PDF: one page. The topic's strongest coverage (Kahoot, 25 occurrences) is quiz-only and not usable as primary explanatory source. `SCA13` remains open with no correction record. This is a genuine source-gap, not merely an unresolved correction. |
| `ch01-t11` | **Requires scientific reconciliation** | Rich narrative source, but an unresolved title/scope collision with `ch01-t12` ("Constant Velocity" appears as a heading in both topics' segment ranges) is flagged only at the audit layer (`C04`, `status: "open"`) and was never promoted to a design-layer `CD-CONF-*` decision — meaning no one has yet formally decided where the t11/t12 boundary sits. Also zero review-card questions exist for this topic. `SCA09` open, no correction record. |
| `ch01-t12` | **Requires scientific reconciliation** (and requires visual-source decision) | Shares the unresolved t11/t12 boundary collision (`C04`) above. Its primary quiz source has a confirmed, concentrated defect: 15 of 28 Kahoot occurrences carry a distance-time/position-time mislabeling error (`K1-SCI-001`/`K1-SCI-002`) — drafting from this source without resolving that confusion first would risk inheriting it. `SCA14`, `SCA15` open, no correction record. Its one formally tracked visual (`ch01-vis-002`) is explicitly `"notRecoverableFromCurrentlyAuditedSources"` — a fully original diagram, not an adaptation, will be needed. |
| `ch01-t13` | **Requires scientific reconciliation** (and requires visual-source decision) | Richest non-pilot topic by every source (largest segment count, largest problem set, most teaching scripts), but `ch01-corr-004` remains `proposed`, `CD-CONF-004` unresolved, and its problem source has two independently confirmed numeric errors (`S5-SCI-009`: an unstated constant-acceleration assumption; `S5-SCI-011`: a rounding error, 8.29 m should be 8.28 m) that would need correcting before those specific problems could be adapted. Its formally tracked visual (`ch01-vis-003`) is likewise `"notRecoverableFromCurrentlyAuditedSources"`. |
| `ch01-t14` | **Insufficient evidence** | Explicitly labeled `"readiness": "incomplete"` in `CHAPTER_01_CANONICAL_STRUCTURE_PROPOSAL.md` §10, pending "the Kahoot decision and missing-source policy" — a chapter-wide policy question, not a per-topic content gap. Structurally, this topic aggregates review material from every other topic (all 33 S5 problems, all 18 S3C questions, all 18 R1 questions map here as their primary purpose) — it cannot be meaningfully drafted before the other ten topics' own content and corrections are further along, regardless of source volume. |

## 6. Recommended expansion batches

Seven batches, ordered by dependency and risk, none larger than two topics. No batch is recommended for immediate drafting — every batch's own readiness gate (§5) must clear first; see §14/§15 for what actually happens next.

**Batch 1 — `ch01-t01`, `ch01-t04` (lowest risk, foundational):**
- Conceptual relationship: both are early-chapter foundational-definition topics (fundamental quantities; mass/inertia/weight), structurally similar in profile to the pilot topics already corrected via a clarity-only fix (`ch01-corr-009`).
- Source readiness: adequate on both.
- Dependencies: none on each other or on any other batch.
- Expected record types: `instructorScript`, `contentBlock` (mainIdea, organizedExplanation, equationSet — minimal, mostly conceptual/definitional — example, misconception, reviewQuestion), `problem`. No visualReference blocking dependency beyond the shared open `ch01-vis-004` placeholder note.
- Expected visual needs: likely a simple explanatory diagram each (see §8) — neither topic's audited source ties to a formally blocked visual-resolution record.
- Scientific risks: `ch01-corr-001`, `ch01-corr-002` — both `needsClarification`/medium, both proposed-not-approved.
- Estimated review complexity: **Low.**

**Batch 2 — `ch01-t06` (solo, distinct risk profile):**
- Conceptual relationship: scalars vs. vectors, a standalone bridging topic before `ch01-t07`.
- Source readiness: thin narrative source, strong quiz-source coverage; no scientific-audit item at all.
- Dependencies: logically precedes `ch01-t07` (vectors) but not strictly blocking.
- Expected record types: same shape as Batch 1, though the `example`/`visualReference` blocks may need to be authored with less source scaffolding than usual.
- Expected visual needs: unresolved — no visual-inventory item exists; a targeted review must first determine whether one is needed.
- Scientific risks: none currently flagged — the source-review itself may surface some.
- Estimated review complexity: **Low-to-moderate** (driven by source thinness, not scientific risk).

**Batch 3 — `ch01-t11`, `ch01-t12` (paired by an unresolved boundary):**
- Conceptual relationship: adjacent motion-description topics whose segment ranges structurally overlap ("Constant Velocity" heading appears in both) — must be scoped together.
- Source readiness: rich narrative source for both; Source-002 entirely absent for both (post-cutoff).
- Dependencies: the audit-layer conflict `C04` (title/scope collision) must be resolved before either topic's boundary can be finalized — this is the batch's core prerequisite, not an implementation detail.
- Expected record types: standard content-block set for both; `ch01-t11` currently has zero review-card questions and would need that gap addressed.
- Expected visual needs: `ch01-t12` needs a fully original position-time/elevator graph (no recoverable source figure, per `ch01-vis-002`); `ch01-t11`'s visual need is less clearly scoped (`V16`, shared conceptual issue with `ch01-t08`'s already-resolved `SCA12`, but `SCA09`/`SCA14` remain open).
- Scientific risks: `C04` (boundary), `SCA09` (t11), `SCA14`/`SCA15` (t12), plus t12's concentrated Kahoot terminology defect (K1-SCI-001/002).
- Estimated review complexity: **Moderate-to-high** (structural boundary decision adds real complexity beyond either topic's own content).

**Batch 4 — `ch01-t05`, `ch01-t07` (deepest scientific reconciliation among the "regular" topics):**
- Conceptual relationship: both are foundational kinematics-description topics with a confirmed factual or classification error in their governing correction record (not merely an ambiguity).
- Source readiness: `ch01-t05` richest of the non-pilot topics; `ch01-t07` rich.
- Dependencies: none on each other; grouped by shared risk profile, not content adjacency — may be better run as two independent single-topic sub-batches if the project owner prefers strict topic-by-topic sequencing.
- Expected record types: standard set; `ch01-t05`'s problem records draw on 6 already-mapped S5 problems, `ch01-t07`'s on 2.
- Expected visual needs: `ch01-t07` has a formally blocked visual (`ch01-vis-001`, rights-pending) that must be resolved (either recovered-and-cleared or abandoned in favor of an original redesign) before drafting; `ch01-t05`'s visual need (`V10`, Bolt split-time table) has no dedicated resolution record yet.
- Scientific risks: `ch01-corr-005` (`needsEvidence` — a citation must be selected before review can even begin) plus open `SCA06`/`SCA07`; `ch01-corr-003` (`inaccurate` classification) plus the rights-pending visual.
- Estimated review complexity: **High.**

**Batch 5 — `ch01-t09` (solo, source-gap driven):**
- Conceptual relationship: free fall, thematically adjacent to the already-implemented `ch01-t08` (which shares `SCA12` with this topic's visual note).
- Source readiness: insufficient (§5) — this batch's actual first step is a targeted source audit, not drafting.
- Dependencies: none blocking, but benefits from `ch01-t08`'s already-approved sign-convention correction (`ch01-corr-007`) as a consistent foundation once source material is adequate.
- Expected record types: unknown until source gap is addressed.
- Expected visual needs: shares `V14` with `ch01-t08`; `SCA13` remains open specifically for the free-fall-specific portion.
- Scientific risks: `SCA13`, no correction record yet.
- Estimated review complexity: **Cannot be estimated until the source gap is addressed** — this is itself the finding.

**Batch 6 — `ch01-t13` (solo, highest content complexity):**
- Conceptual relationship: constant acceleration and motion graphs — the single richest and most complex non-pilot topic.
- Source readiness: richest of all (§4), but with two independently confirmed numeric errors in its problem source and an unresolved graph-wording conflict.
- Dependencies: benefits from `ch01-t12`'s graph-terminology reconciliation (Batch 3) being settled first, since both involve graph interpretation.
- Expected record types: full set, at larger scale — 9 mapped problems is more than double any pilot topic's single problem record, meaning either multiple `problem` records per topic (schema already permits this — `topicIds` is an array field) or a decision on how many of the 9 to adapt for this topic's pilot-equivalent content.
- Expected visual needs: fully original velocity-time graph (no recoverable source figure, `ch01-vis-003`).
- Scientific risks: `ch01-corr-004` (proposed, not approved), `CD-CONF-004`, plus `S5-SCI-009`/`S5-SCI-011` (confirmed problem-source errors), plus `SCA17`/`SCA18` (open, no correction record).
- Estimated review complexity: **Highest of any topic.** Recommend not combining with any other topic.

**Batch 7 — `ch01-t14` (solo, final, structurally dependent on all preceding batches):**
- Conceptual relationship: chapter-wide review and problem aggregation.
- Source readiness: explicitly incomplete, gated on "the Kahoot decision and missing-source policy" (a chapter-wide policy question, not resolvable within this topic alone).
- Dependencies: logically last — meaningfully drafting a chapter review requires the other ten topics' content and corrections to already exist.
- Expected record types: unclear until the policy question is resolved; likely a much larger `problem`-record set given all 33 S5 problems map here.
- Expected visual needs: `V01`, `V23`, `V24` (`SCA18` open), no dedicated resolution record.
- Scientific risks: `SCA18`, no correction record.
- Estimated review complexity: **Cannot be meaningfully estimated before Batches 1–6 (or at least a decisive majority of them) are further along.**

## 7. Schema assessment

Current schema: `docs/content-design/chapter-01/CANONICAL_DESIGN_SCHEMA.json`, `schemaVersion: "2.3.0"` (same version the four pilot topics and the application both target).

**Fits the existing schema as-is (no change needed):**
- All four `recordType`s (`contentBlock`, `instructorScript`, `problem`, `correction`) directly reuse for every one of the 10 remaining topics — nothing about their content type (definitions, explanations, equations, examples, problems, misconceptions, review items) falls outside what these four record types already model.
- `contentBlock.localizedContent` is schema-unconstrained (`"type": "object"`, no required sub-fields) — this is exactly what let the pilot's `reviewQuestion` blocks work as single authored-text records, and it will work identically for every remaining topic's review-question content without any schema change.
- `problem.givenValues`, `numberedSolution`, `calculation`, and `finalAnswer` are all schema-unconstrained arrays/objects — the pilot's existing per-problem shape (used successfully for all four pilot topics, including `ch01-t02`'s three-part problem) already extends to any remaining topic's problems without a schema change, including `ch01-t13`'s larger 9-problem set (via multiple `problem` records, or multiple `topicIds` entries — the schema permits either).

**Optional fields already supported, worth deliberately using for the remaining topics:**
- `correction.classification`, `.severity`, `.affectedContentBlockTypes`, `.approvals`, `.evidenceStatus` — already used inconsistently between the pilot corrections (`006`–`009`, fully populated) and the still-proposed ones (`001`–`005`, missing `approvals`/`evidenceStatus` in some cases) — recommend populating these consistently as each remaining topic's correction moves through review, matching the pattern already proven for the pilot.

**Content types that may require a schema decision before or during expansion (not a hard blocker for every topic, but relevant to specific batches):**
- **Tables** — no `table`/`tableData` definition exists anywhere in `CANONICAL_DESIGN_SCHEMA.json`; `instructorScript.tableGuidance` is a plain string array. No remaining topic's core content is table-centric enough to require this by itself (the pilot's SVG-diagram pattern can represent tabular data as an image, exactly as `ch01-t02`'s and `ch01-t08`'s diagrams already do for structured comparisons) — **optional, not required**, unless a future decision specifically wants machine-readable/interactive table data.
- **Graphs** — no `graph`/`graphSpec` definition exists in the schema file (only as non-binding narrative example text in `CHAPTER_01_CANONICAL_STRUCTURE_PROPOSAL.md`). `ch01-t12` and `ch01-t13` are both graph-centric topics. The proven pilot pattern (an original SVG diagram, referenced via `visualReference`, described in prose) already accommodates this **without a schema change** — exactly as `ch01-vis-002` and `ch01-vis-003` are already scoped as original SVG diagrams to be designed, not structured data. **Optional, not required**, unless a future decision wants interactive/data-driven graphs (a genuinely different, larger architectural decision — see §9).
- **Multi-part given-values structures** — flagged already for the pilot itself (`ch01-t02`, Phase 4 finding PH4-002, still deferred) and more consequential at scale: `ch01-t13` alone maps 9 problems, several of which may be multi-part. The schema does not prevent the pilot's existing flat-list pattern from continuing to work, but a structured `{symbol, value, unit, part}` shape would materially improve clarity for topics with multiple multi-part problems. **Recommended optional improvement, worth deciding before Batch 6 (`ch01-t13`) specifically** — not a blocker for Batches 1–5.
- **Structured `reviewQuestion` (separate question/answer/explanation fields)** — explicitly evaluated and declined during the Phase-4-driven correction task (see `docs/app/PHSH111_OWNER_REVIEW_PACKET.md` §8): splitting the canonical text would require heuristically parsing inconsistent marker phrases, which risks inventing a structural boundary the source doesn't define. This conclusion applies identically to every remaining topic's review-question source material (same authored-prose pattern observed throughout the audited sources). **Remains a single authored-text record; explicitly deferred, not required.**

**Issues that can remain deferred (schema-hygiene, not expansion-blocking):**
- The schema file's `schemaVersion` constant (`2.3.0`) is one minor version ahead of what `CHAPTER_01_CANONICAL_DESIGN_AMENDMENTS.md` narrates (documented only up to `2.2.0`) — a documentation-sync gap, not a functional one.
- `ch01-corr-009`'s extra fields (`issueType`, `provenanceNote`, `englishImpact`, `arabicImpact`, `affectedRecordAndField`, `noEffectOnVisualOrAnswers`, `publicationStatusUnchanged`) are not declared in the schema's `correction` `$def`, which sets `additionalProperties: false` — a minor schema-conformance gap worth reconciling (either loosen the `$def` or stop adding undeclared fields to future correction records) but not urgent.

## 8. Visual inventory

Evidence drawn only from `docs/content-audits/chapter-01/visual-inventory.json` and `docs/content-design/chapter-01/VISUAL_RESOLUTION_PLAN.json`. No publisher artwork is proposed for tracing or reuse anywhere below — every visual need described here would require an original redesign, exactly matching the pattern already proven for the four pilot SVGs.

| Topic | Likely visual need | Evidence / flag |
|---|---|---|
| `ch01-t01` | Original explanatory diagram (a short list/table-style graphic of fundamental quantities) | `V02` describes a complete list explanation; no dedicated visual-resolution record exists yet; covered only indirectly by the still-open `ch01-vis-004` placeholder note. |
| `ch01-t04` | Original explanatory diagram (mass vs. gravitational weight vs. apparent weight, e.g. a suitcase/scale scenario) | `V09` describes a complete mass/weight scenario; no dedicated resolution record; `ch01-vis-004` open. |
| `ch01-t05` | Original application-oriented health-sciences visual or data table (e.g. a split-time comparison) | `V10` (Bolt split-time table) tied to `SCA08`; no dedicated resolution record. **Flag:** depends on `ch01-corr-005`'s fact-pairing being resolved first, since the visual's own numbers are the disputed content. |
| `ch01-t06` | **Unclear — no visual-inventory item exists for this topic at all.** A targeted source review (Batch 2) should determine whether a visual is needed. | No `V##` entry, no resolution record. |
| `ch01-t07` | Equation/vector-relationship diagram (vector addition, e.g. head-to-tail or component method) | Has a formally tracked resolution record, `ch01-vis-001` (Figure 1.13 panels), **flagged: understanding depends on a source figure not yet independently redesigned** — `resolutionStatus: "open"`, `recoverability: "possiblyRecoverableButIdentityUnconfirmed"`, `blockingReason` includes `rightsPending`. This is the one visual need in the entire remaining-topic set with an active rights question, not just a redesign task. |
| `ch01-t09` | Original explanatory diagram or motion sequence (falling object at successive instants, matching the established `ch01-t08` house style) | `V14`, shared conceptual ground with `ch01-t08`'s visual; no dedicated resolution record; `SCA13` open. |
| `ch01-t11` | Motion sequence or four-representation diagram (position/velocity/graph correspondence) | `V16` describes a "runner four-representation sequence," tied to `SCA09`/`SCA14`; no dedicated resolution record. |
| `ch01-t12` | Graph (position-time), original design required | Has a formally tracked resolution record, `ch01-vis-002` (elevator height/position-time graph), **flagged: `recoverability: "notRecoverableFromCurrentlyAuditedSources"`** — a fully original diagram is required; no source figure to reference at all. |
| `ch01-t13` | Graph (velocity-time), original design required | Has a formally tracked resolution record, `ch01-vis-003` (Figure 1.40 bullet velocity-time graph), **flagged: `recoverability: "notRecoverableFromCurrentlyAuditedSources"`** — same as t12, fully original design required. |
| `ch01-t14` | Likely a chapter-summary graphic or none (review/aggregation topic) | `V01`, `V23`, `V24` (`SCA18` open); no dedicated resolution record; genuinely unclear until the topic's own content scope (§6, Batch 7) is settled. |

**Topics whose understanding depends on a source figure not yet independently redesigned:** `ch01-t07` (rights-pending), `ch01-t12` and `ch01-t13` (not recoverable from audited sources — original design required, not a rights question). All three require a visual-source decision before drafting can be considered complete for those topics, consistent with their §5 readiness status.

## 9. Scientific-risk inventory

| Risk category | Affected topic(s) | Source of ambiguity | Required reviewer expertise | Existing correction? |
|---|---|---|---|---|
| Scope/definitional clarity | `ch01-t01` | Source states fundamental quantities as though a complete universal list rather than scoped to this chapter's mechanics treatment | Physics content reviewer (conceptual scoping, not computational) | `ch01-corr-001`, proposed, **not approved** |
| Terminology conflation | `ch01-t04` | Mass vs. gravitational weight vs. apparent weight not consistently distinguished | Physics content reviewer | `ch01-corr-002`, proposed, **not approved** |
| Vector addition / resultant explanation | `ch01-t07` | Right-angle addition alone is presented as explaining a perpendicular resultant, without the actual component-cancellation reasoning | Physics content reviewer (vectors) | `ch01-corr-003` (classified `"inaccurate"`), proposed, **not approved** |
| Graph interpretation (concavity/slope) | `ch01-t13` | "Curves upward" wording ambiguous without a stated axis/sign convention | Physics content reviewer (kinematics graphs) | `ch01-corr-004`, proposed, **not approved** |
| Factual/citation accuracy | `ch01-t05` | Source pairs the wrong event label with a real-world sprint time (Berlin 2009 paired with Beijing 2008's time) | Fact-checker / citation reviewer, not primarily a physics reviewer | `ch01-corr-005`, **needsEvidence** — a citation must be selected before scientific review can even proceed |
| Distance-time vs. position-time terminology | `ch01-t12` | 15 of 28 Kahoot occurrences for this topic carry a concentrated mislabeling defect (`K1-SCI-001`/`K1-SCI-002`) | Physics content reviewer + quiz-content reviewer | No correction record yet; `SCA14`/`SCA15` open |
| Topic-boundary / scope collision | `ch01-t11`, `ch01-t12` | "Constant Velocity" heading appears in both topics' segment ranges; boundary never formally decided | Curriculum/content-structure reviewer (not purely a physics question) | No correction record; audit-layer `C04` unresolved, never promoted to a design-layer decision |
| Instantaneous vs. average quantities | `ch01-t05` | Average and instantaneous speed is this topic's own subject matter; `SCA06`/`SCA07` remain open with no correction yet | Physics content reviewer | None yet |
| Free-fall assumptions | `ch01-t09` | Source material itself is too thin to fully assess (§5); `SCA13` open | Physics content reviewer, pending adequate source | None yet |
| Numeric/computational accuracy | `ch01-t13` | Two independently confirmed errors in the mapped problem source: `S5-SCI-009` (unstated constant-acceleration assumption), `S5-SCI-011` (rounding: 8.29 m should be 8.28 m) | Physics content reviewer (computational check) | No correction record for either; flagged only as `S5-SCI-*` audit items |
| Chapter-wide review scope/policy | `ch01-t14` | Explicitly gated on an unresolved "Kahoot decision and missing-source policy," not a physics question | Project-owner / curriculum-policy decision, not a physics reviewer | None; `SCA18` open |

**Risk categories named in the task brief with no currently flagged instance among the audited non-pilot topics:** sign conventions and acceleration direction, scalar-vs-vector distinction, unit conversions, and circular-motion directionality are all risk categories the pilot topics (`ch01-t08`, `ch01-t10`) already addressed via `ch01-corr-007`/`008`/`009` — no equivalent open item was found tying these specific categories to any of the 10 remaining topics in the audited material reviewed for this plan. `ch01-t06` (scalars/vectors) in particular currently has zero flagged scientific-audit items of any kind (§5) — the absence of a flagged risk is evidence, not proof of a clean topic; it should still get the same reconciliation-readiness check the others received, just as a lighter one given no known issue currently exists.

## 10. Arabic-content requirements

The pilot's proven bilingual conventions (`VISUAL_HOUSE_STYLE.md`, the four pilot topics' `arabic.canonicalArabicTranslation` fields, and the correction task's own Arabic wording work) establish the pattern every remaining topic's Arabic content would need to follow:

- **Canonical Arabic translation**: none of the 10 remaining topics currently has any approved Arabic baseline content — `ARABIC_PILOT_BASELINE_APPROVAL.json`'s `scope.approvedTopicIds` is the same four-topic list as the English baseline. Each remaining topic needs full Arabic translation authored against its (not-yet-approved) English content, following the same `localizedContent.ar` / `arabic.canonicalArabicTranslation` dual-field pattern already used for all four pilot topics.
- **Arabic terminology normalization**: `BILINGUAL_GLOSSARY.json` currently has 16 terms, of which only 7 are `approvalStatus: "approved"` — **and all 7 approved terms are scoped exclusively to the four pilot topics.** The 9 `pending` terms map (by source-reference inference, not an explicit `topicIds` field) to `ch01-t04`, `ch01-t05`, `ch01-t06`, `ch01-t07`, and `ch01-t12` — meaning even the topics with the most existing terminology groundwork still require a full glossary-approval pass before their content can be considered terminologically consistent with the pilot. `ch01-t01`, `ch01-t09`, `ch01-t11`, `ch01-t13`, `ch01-t14` currently have zero glossary terms, approved or pending, associated with them at all.
- **Latin SI symbols / LTR equation isolation**: the pilot's established rule (Latin symbols and formulas stay upright and LTR-isolated inside Arabic prose, per-element `direction` attributes on every text node) applies identically to every remaining topic — no topic-specific deviation is evident in the audited material.
- **English abbreviations inside Arabic prose**: same established convention (wrapped `dir="ltr"` inline) applies uniformly; no topic-specific exception found.
- **Arabic punctuation**: rendered as authored, no runtime correction — same rule, no topic-specific exception found.
- **Figure-caption requirements**: every visual identified in §8 that reaches the drafting stage would need the same bilingual-per-element caption convention (English caption + Arabic caption as separate text elements) already proven across all four pilot SVGs.
- **Bilingual reviewer needs**: every remaining topic's Arabic translation would need the same translation-completeness and terminology-consistency review already performed for the pilot's Arabic baseline (`ARABIC_PILOT_BASELINE_APPROVAL.json`'s five-pass review basis) — this has not yet occurred for any remaining topic and is not something this planning document performs.

**Terms with existing approved glossary entries usable as-is if a remaining topic reuses the same concept:** none — every approved term is scoped to a pilot topic's specific content (e.g. `ch01-term-acceleration` is scoped to `ch01-t08`); whether it would apply verbatim to a remaining topic (e.g. a future free-fall topic reusing the acceleration term) is a glossary-scope decision, not something this plan resolves.

## 11. Application expansion impact

Analysis of `apps/chapter1-mvp/src/` against 10 additional topics, based on the architecture already documented in `docs/app/PHSH111_APP_HANDOFF.md` and confirmed by reading `src/config/topics.ts`, `src/content/rawImports.ts`, and `src/types/pilotSchema.ts`.

- **Topic registry**: `PILOT_TOPIC_ORDER` (`src/types/pilotSchema.ts`) is a fixed 4-element array; extending it to 14 entries is a mechanical, low-risk change — the adapter and every downstream component already consume this array generically (topic-agnostic by design, per Phase 2's own stated goal).
- **Route generation**: **no new route pattern is needed.** The existing `/chapter/1/topic/:topicId` route already resolves any topic ID via the registry/adapter lookup — adding topics extends the SET of valid IDs, it does not require new route definitions.
- **Previous/next ordering**: trivially extends — the navigation logic already derives entirely from `PILOT_TOPIC_ORDER`'s array order, with no hardcoded "four" assumption in the navigation component itself.
- **Content imports**: **this is the architecture's real scaling friction.** `src/content/rawImports.ts` hand-imports each topic's JSON and SVG by an explicit, individually named static import statement (by design, for auditability — see that file's own header comment). Adding 10 more topics means 10 more pairs of hand-written import lines, not a structural blocker but a repetitive, error-prone manual step at this scale. **Recommend evaluating Vite's `import.meta.glob` pattern (or an equivalent build-time directory scan) once more than a couple of batches are implemented**, to reduce this to a single generic loader — a deliberate architectural decision to make before or during mid-expansion, not before Batch 1.
- **Build size**: the four pilot topics currently produce a ~482 KB JS bundle (content, including all four SVGs, is inlined at build time). Scaling to 14 topics (potentially 3.5× the content, more for topics like `ch01-t13` with a larger problem set) would proportionally grow the bundle — no governance record sets an explicit size ceiling, but this should be monitored after each batch rather than assumed harmless. **Recommend evaluating route-based code-splitting (lazy-loading each topic's content on navigation rather than bundling all topics upfront) once bundle growth is actually observed**, not as a precondition for Batch 1 or 2.
- **Adapter assumptions**: the adapter itself (`src/content/adapter.ts`) is genuinely topic-agnostic (confirmed in Phase 2/3/4 work) — but some **test fixtures**, not the adapter logic itself, hardcode pilot-specific coincidences (e.g. "every topic has exactly 9 source records," true only because the four pilot topics happen to share that count). Future topics — especially `ch01-t13` and `ch01-t14` with larger problem/question sets — will not share this coincidence, and any new tests written for them should assert against their own actual record counts, not the pilot's.
- **Visual loading**: the existing single-mounted-SVG pattern (preview XOR enlarge dialog, never both) scales per-topic with no architectural change — just more SVG files following the same import/render pattern.
- **Test coverage**: the current 61 tests are a mix of adapter-logic tests (generic, will keep passing) and topic-specific fixture assertions (pilot-topic-specific, e.g. asserting exact record IDs or exact topic counts) — expansion would need new topic-specific test fixtures per batch as each is implemented, not a rewrite of the existing suite.
- **Chapter 1 topic-list usability**: the current responsive auto-fit grid (`ChapterOnePage.tsx` / `.chapter-page__grid`) scales visually to 14 cards without a structural redesign, but a flat 14-item list may benefit from conceptual grouping (e.g., "Fundamentals," "Vectors," "Motion in one dimension," "Circular motion," "Chapter review") for usability — a design recommendation, not a technical blocker.
- **Mobile navigation**: previous/next controls and the topic-list's single-column mobile layout both remain fine at any topic count — no topic-count-dependent redesign need was found.

**Overall recommendation**: the current static-import architecture is technically capable of scaling to all 14 topics through mechanical, low-risk additions (extend the order array, add import lines, add topic JSON/SVG files) — it is **not a blocker** to a small first batch. Two specific improvements are worth deliberately deciding on **during** (not necessarily before) expansion: switching to a dynamic/glob-based content-import pattern, and evaluating route-based code-splitting once bundle growth is actually observed.

## 12. Governance and approvals

Exact approvals required before any additional topic is drafted or implemented, distinguished by gate:

1. **Source-audit status** — already exists, at varying depth, for all 10 remaining topics (§4). No separate formal "audit approval" record type was found anywhere in this repository's precedent — for the four pilot topics, the audits fed directly into canonical generation without an intermediate audit-approval step. Consistent treatment would apply to expansion, but this is worth an explicit project-owner confirmation before assuming the precedent extends automatically.
2. **Chapter-wide or per-topic canonical-generation authorization** — **currently `false`, chapter-wide, in `PILOT_READINESS.json`, and no per-topic authorization exists for any of the 10 remaining topics in `PILOT_AUTHORIZATION.json`.** This is the single most fundamental gate: nothing else in this list can happen for any remaining topic until this authorization is explicitly granted, following the same pattern already used to authorize the original four (`PILOT_AUTHORIZATION.json` v1.0.0).
3. **Scientific correction approval** — required per-topic before drafting, following the established pilot precedent (`ch01-corr-006/007/008` were all approved before their topics' content was generated). `ch01-corr-001` through `005` remain unapproved (§5, §9) — this is the primary blocking gate for 7 of the 10 remaining topics.
4. **English baseline approval** — `ENGLISH_PILOT_BASELINE_APPROVAL.json`'s scope is explicitly the same four pilot topics only. A new baseline-approval action (either a scope extension to this file or a new baseline record) would be needed once any remaining topic's English content is drafted and reviewed.
5. **Arabic baseline approval** — same as above, `ARABIC_PILOT_BASELINE_APPROVAL.json` is four-topic-scoped; needs the equivalent new approval per topic once Arabic content exists.
6. **Visual readiness** — each new topic's visual needs the same validation process already proven for the four pilot SVGs (scientific accuracy, bilingual rendering, accessibility measurement, rights-policy compliance) before being marked `readyForHumanReview`.
7. **Application implementation authorization** — **`PILOT_AUTHORIZATION.json` v1.1.0's `applicationBuildAuthorization.applicableTopicIds` is explicitly and only `["ch01-t02","ch01-t03","ch01-t08","ch01-t10"]`.** Stated plainly, as required: **the existing v1.1.0 authorization covers only the four-topic internal pilot; it does not, by its own text, extend to any additional topic.** Rendering additional topics inside the application would require a new, explicit authorization amendment (parallel to how v1.1.0 itself was a controlled amendment adding application-build authorization on top of v1.0.0's content-only authorization) — this is not broadened by interpretation anywhere in this document.
8. **Internal QA** — the Phase 3-style process (contrast audit, keyboard review, responsive/bilingual QA, automated tests) would need re-running or extending for any newly implemented topic, at minimum as a regression check that existing coverage isn't disturbed.
9. **Independent expert review** — has not occurred for any topic, pilot or otherwise, at any point through the present. Expansion does not change this requirement; it means more content awaiting the same not-yet-obtained review, not a new or different obligation.
10. **Student-publication authorization** — entirely separate from and unaffected by expansion; `studentFacingAllowed`/`studentPublicationAuthorized` remain `false` regardless of how many topics the application eventually renders internally.

## 13. Deferred issues

Noted for completeness; none block a first controlled expansion batch by themselves:

- Three audit-layer conflicts (`C02` for `ch01-t12`, `C03` for `ch01-t05`, `C04` for `ch01-t11`/`ch01-t12`) have never been promoted to a design-layer `CD-CONF-*` decision record — worth reconciling as part of whichever batch touches those topics, not before.
- `ch01-t14`'s "Kahoot decision and missing-source policy" is an explicitly unresolved chapter-wide policy question, deferred until Batches 1–6 are further along (§6, Batch 7).
- The schema's undocumented `2.2.0 → 2.3.0` version bump and `ch01-corr-009`'s undeclared extra fields (§7) are schema-hygiene items, not expansion blockers.
- Structured table/graph/multi-part-given-values/reviewQuestion schema improvements (§7) are all optional; only the multi-part given-values question is worth a deliberate decision before Batch 6 specifically (`ch01-t13`'s larger problem set).
- The application's static-import content-loading pattern and eventual bundle-size growth (§11) are worth monitoring and deciding on during expansion, not before Batch 1.
- `ch01-t06`'s complete absence of any visual-inventory item (§8) is itself an open question a targeted source review (Batch 2) should resolve, not something this plan can resolve by inventory alone.

## 14. Recommended first expansion batch

**Batch 1 — `ch01-t01` (Fundamental Quantities) and `ch01-t04` (Mass, Inertia and Weight).**

Rationale: lowest scientific-risk profile among all 10 remaining topics (both corrections are `needsClarification`/medium, not `inaccurate` or `needsEvidence`), adequate (not merely partial) source coverage on every source, no unresolved topic-boundary collision, and no formally blocked visual-rights question — structurally the closest match to the risk profile already successfully resolved once for the pilot (`ch01-corr-009`'s clarity-only fix). This is a recommendation for sequencing, not a readiness claim — per §5, this batch's status is **"Requires scientific reconciliation,"** not "ready for controlled drafting."

## 15. Exact next authorized task

**One recommended next task: a scientific-reconciliation review of `ch01-corr-001` and `ch01-corr-002`** — a project-owner decision on the two already-drafted, currently `proposed` correction records for `ch01-t01` and `ch01-t04` (whether to approve, request revision, or reject each, following the same review pattern already used to move `ch01-corr-006/007/008` from proposed to `editoriallyApproved`).

This is explicitly a **scientific reconciliation** task, not source auditing (already done for these two topics), not a schema decision (§7 found none required for this batch), not English drafting (premature — no canonical generation authorization exists yet for either topic, §12 gate 2), and not visual planning (secondary to the correction decision, and gated behind it). Per §12, this task alone does not authorize drafting — it is a prerequisite step that would still need to be followed by the canonical-generation authorization (§12 gate 2) before any actual content drafting for `ch01-t01`/`ch01-t04` could begin.

## 16. Post-brief update log (added 2026-07-16)

This section was appended after §1–§15 above; nothing in those sections was altered to write it, consistent with this project's practice of preserving original findings as historical record and appending resolution status separately.

The exact next task this plan recommended in §15 — a scientific-reconciliation review of `ch01-corr-001` and `ch01-corr-002` — has now been completed, in three stages:

1. **`docs/app/PHSH111_BATCH1_CORRECTION_DECISION_BRIEF.md`** — read-only scientific-reconciliation decision brief; independently re-verified every cited source; identified two citation-traceability defects (`ch01-corr-001` cited `SEG004`, which belongs to `ch01-t14`, not `ch01-t01`; `ch01-corr-002` cited `SEG017`/`SEG018`, which belong to `ch01-t03`, and `S5-P033`, which belongs to `ch01-t08`); recommended Approve for both, at Medium confidence, pending those citation defects being addressed.
2. **`docs/app/PHSH111_BATCH1_CORRECTION_CITATION_REPAIR.md`** — the project owner decided "Revise" for both corrections, scoped strictly to citation repair. The miscited source IDs were replaced with each topic's own verified segments (`SEG009`/`SEG010` for `ch01-t01`; `SEG021`/`SEG022` for `ch01-t04`), with `S2-SEG026` and `SEG021`/`SEG022` respectively established as primary evidence. No scientific wording was changed.
3. **`docs/app/PHSH111_BATCH1_CORRECTION_APPROVAL_RECORD.md`** — the project owner then approved `ch01-corr-001` and approved `ch01-corr-002` with a qualification (that "apparent weight" is project-authored interpretive terminology, not verbatim source wording). Both records now carry `approvalStatus: "editoriallyApproved"` in `SCIENTIFIC_CORRECTIONS.json`, with `approvals.scientificReviewer` deliberately left `null` (project-owner editorial approval, not independent physics review).

**What this changes:** `ch01-corr-001` and `ch01-corr-002` are no longer `proposed` — both are `editoriallyApproved`. Every reference to their `proposed` status in §2, §5, §6, §9, §12, §13, and §15 above is preserved as an accurate historical record of this plan's state at the time it was written; it is superseded by the approval above, not incorrect for its own moment.

**What this does not change:** `ch01-t01`'s and `ch01-t04`'s topic-readiness classification in §5 ("Requires scientific reconciliation") is not automatically upgraded to "ready for controlled drafting" by this approval alone — per §12 gate 2, canonical-generation authorization is a separate, still-absent gate (`PILOT_READINESS.json.canonicalGenerationAuthorized` remains `false` chapter-wide; neither topic appears in `PILOT_AUTHORIZATION.json`'s authorized scope). No `ch01-t01` or `ch01-t04` canonical content exists. No Arabic translation was generated. No visual was produced. Publication remains unauthorized.

**Exact next task, if the project owner chooses to proceed:** a separate, explicit canonical-generation-authorization decision for `ch01-t01` and/or `ch01-t04`, amending `PILOT_AUTHORIZATION.json` and `PILOT_READINESS.json` following the same pattern already used for the original four pilot topics. This plan does not perform that decision.

## 17. Post-approval drafting-authorization update (added 2026-07-16)

The task named in §16 as "exact next task" has now been completed: `PILOT_AUTHORIZATION.json` (now v1.2.0) and `PILOT_READINESS.json` (now v1.5.0) were amended with a narrowly scoped, additive **English-language canonical drafting authorization** for exactly `ch01-t01` and `ch01-t04` — see `docs/app/PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md` for full detail. **Batch 1 scientific reconciliation is complete. Batch 1 English-drafting is now authorized. No draft file has been created yet — this is a governance action only.**

What remains unauthorized, unchanged by this update: Arabic content generation, visual production, application expansion (`apps/chapter1-mvp/`'s `applicationBuildAuthorization.applicableTopicIds` is still exactly the original four pilot topics), English baseline approval, and student-facing publication. `PILOT_READINESS.json`'s chapter-wide `canonicalGenerationAuthorized` flag remains `false` — the new authorization is recorded in a separate, topic-scoped `batch1DraftingReadiness` section, not by flipping that global flag.

**Exact next task, if the project owner chooses to proceed:** the actual English-drafting task itself, creating `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and/or `ch01-t04-content.json` under the scope and constraints in `docs/app/PHSH111_BATCH1_DRAFTING_AUTHORIZATION_RECORD.md`. Not performed by this update.

## 18. Batch 1 English baseline approval (added 2026-07-16)

Both `ch01-t01` and `ch01-t04` were drafted, independently reviewed, revised, and closure-verified (see `docs/app/PHSH111_BATCH1_ENGLISH_DRAFT_GENERATION_REPORT.md`, `PHSH111_BATCH1_ENGLISH_DRAFT_REVIEW.md`, `PHSH111_BATCH1_ENGLISH_DRAFT_REVISION_REPORT.md`, `PHSH111_BATCH1_ENGLISH_DRAFT_CLOSURE_REVIEW.md`, and `PHSH111_BATCH1_T04_SCHEMA_CLOSURE_REPORT.md`), then approved by the project owner as **Batch 1 English baseline version 1.0.0** — see `docs/content-design/chapter-01/ENGLISH_BATCH1_BASELINE_APPROVAL.json` and `docs/app/PHSH111_BATCH1_ENGLISH_BASELINE_APPROVAL_RECORD.md` for full detail. `PILOT_READINESS.json` is now v1.6.0.

**Both draft files remain exactly where they were drafted**, at `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json` — unmoved, unrenamed, uncopied, not promoted into `pilot/`. Baseline approval is recorded as a separate governance file referencing them by path and checksum, mirroring the exact pattern `ENGLISH_PILOT_BASELINE_APPROVAL.json` already established for the four pilot topics.

**What remains pending, unauthorized by this baseline approval:** Arabic generation (glossary work for `ch01-t01` has not started; `ch01-t04`'s three relevant glossary terms remain `pending`), visual production (both topics' visuals remain unproduced), identifier registration in `IDENTIFIER_REGISTRY.json` (required before any future application-integration step, not before baseline approval), application integration (mechanically blocked today regardless of authorization, since `batch1-drafts/` is outside `apps/chapter1-mvp/`'s current `server.fs.allow`/import scope), independent human expert review (has never occurred for any topic in this project), and student-facing publication.

**Exact next task, if the project owner chooses to proceed:** a Batch 1 Arabic-readiness and glossary decision task — assessing required glossary entries for `ch01-t01`, the approval status of `ch01-t04`'s three pending terms, a translation strategy for the qualified "apparent weight" term, equation/bidi-isolation requirements, and whether Arabic generation can then be authorized. Not performed by this update.

## 19. Batch 1 glossary reconciliation and approval (added 2026-07-17)

The Arabic-readiness/glossary decision brief (`docs/app/PHSH111_BATCH1_ARABIC_READINESS_GLOSSARY_DECISION_BRIEF.md`) identified an internal counting inconsistency, resolved by `docs/app/PHSH111_BATCH1_GLOSSARY_INVENTORY_RECONCILIATION_ADDENDUM.md` into a definitive inventory of **9 unique glossary records / 9 actions**. The project owner then approved all nine: two new terms created and approved (`ch01-term-fundamental-quantity`, `ch01-term-derived-quantity`), five existing pending terms approved (`ch01-term-speed`, `ch01-term-scalar`, `ch01-term-mass`, `ch01-term-weight`, `ch01-term-apparent-weight`), and two already-approved terms' topic scope extended (`ch01-term-distance` → also `ch01-t01`; `ch01-term-acceleration` → also `ch01-t04`) — see `docs/content-design/chapter-01/BILINGUAL_GLOSSARY.json` (now v1.3.0) and `docs/app/PHSH111_BATCH1_GLOSSARY_APPROVAL_RECORD.md` for full detail. `PILOT_READINESS.json` is now **v1.7.0**. No separate glossary term was created for "dimension"/"L/T dimensional notation" — that guidance was folded into `ch01-term-fundamental-quantity`'s own usage notes. Apparent weight is approved as الوزن الظاهري (supporting phrase قراءة الميزان; الوزن الحقيقي is not used as the preferred contrast).

**All Batch 1 blocking glossary terms are now approved. Arabic generation remains unauthorized** — `PILOT_READINESS.json`'s `batch1DraftingReadiness.arabicGenerationAuthorized` and `.arabicBaselineApproved` remain explicitly `false`; no Arabic topic content exists. Visual production, identifier registration (in `IDENTIFIER_REGISTRY.json`), application integration, independent expert review, and student-facing publication all remain pending/unauthorized, unchanged by this update.

**Exact next task, if the project owner chooses to proceed:** a scoped Batch 1 Arabic-generation authorization task for `ch01-t01`/`ch01-t04`, deciding permitted Arabic output paths, use of the now-approved glossary, record-by-record translation requirements, conceptual adaptation of "apparent weight," and equation/bidi requirements. Not performed by this update.

## 20. Batch 1 Arabic candidate-draft generation authorization, then correction (added 2026-07-17)

The task named in §19 as "exact next task" was performed: `PILOT_AUTHORIZATION.json` v1.3.0 added a Batch 1 Arabic-generation authorization (`batch1ArabicGenerationAuthorization`) and `PILOT_READINESS.json` reached v1.8.0. That original authorization was then found, on review, to contain three material scope defects — it authorized in-place editing of the approved English baseline files, described the authorized work as "Arabic canonical generation," and prohibited all Arabic terminology outside the nine Batch 1 glossary records. **These defects were corrected before any Arabic content had been generated under the original version.**

The corrected authorization (`PILOT_AUTHORIZATION.json` v1.3.1, `PILOT_READINESS.json` v1.8.1; see `docs/app/PHSH111_BATCH1_ARABIC_AUTHORIZATION_CORRECTION_RECORD.md` and `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_AUTHORIZATION_RECORD.md`'s dated correction section for full detail) now authorizes **controlled Arabic candidate-draft generation only** — not Arabic canonical or baseline approval — for `ch01-t01`/`ch01-t04`, under a corrected packaging model:

- The two approved English baseline files, `docs/content-design/chapter-01/batch1-drafts/ch01-t01-content.json` and `ch01-t04-content.json`, are **immutable** and must never be edited by any Arabic-generation task.
- Arabic candidate drafts are separate new files, to be created at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json` — a new, separate output directory. **Neither file exists yet.**
- The nine Batch 1 glossary decisions are mandatory where their concepts apply; other already-approved glossary terms may also be used; ordinary Arabic language does not require glossary registration; mathematical symbols and SI units remain untranslated; a new controlled scientific term may not be introduced without a separate glossary decision.

**What remains unchanged/unauthorized:** Arabic baseline approval, visual production, identifier registration, application integration (`applicationBuildAuthorization.applicableTopicIds` still exactly the original four pilot topics), independent expert review, and student-facing publication all remain pending/unauthorized for `ch01-t01`/`ch01-t04`. Chapter-wide `canonicalGenerationAuthorized` and `studentPublicationAuthorized` remain `false`.

**Exact next task, if the project owner chooses to proceed:** generate the two controlled Arabic candidate drafts at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json`, under the corrected authorization. Not performed by this update.

## 21. Batch 1 Arabic candidate-draft authorization ratified by project owner (added 2026-07-17)

The corrected Arabic candidate-draft generation authorization (§20) has now been **explicitly ratified by the project owner**. Governance history is preserved transparently: `PILOT_AUTHORIZATION.json` v1.3.0 was created before the project owner had issued the intended explicit authorization decision; v1.3.1 technically corrected its packaging/terminology/glossary defects but was a correction task, not the ratification itself; v1.3.2 supplies the explicit project-owner ratification of the already-corrected scope. `PILOT_AUTHORIZATION.json` is now **v1.3.2**; `PILOT_READINESS.json` is now **v1.8.2**. See `docs/app/PHSH111_BATCH1_ARABIC_GENERATION_RATIFICATION_RECORD.md` for the full record.

The ratification changes no technical scope: **controlled Arabic candidate-draft generation** remains authorized for `ch01-t01`/`ch01-t04` only, with candidate output at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json` — **a separate directory that still does not exist; no Arabic candidate file exists.** The approved English baseline files at `docs/content-design/chapter-01/batch1-drafts/` remain **immutable** (checksums re-verified unchanged: `a445f55d...`, `c876a6fe...`); glossary remains **v1.3.0**. Arabic baseline approval, visual production, application integration, deployment, independent human review, and student-facing publication all remain **pending/unauthorized/incomplete**. Chapter-wide `canonicalGenerationAuthorized` and `studentPublicationAuthorized` remain `false`.

**Exact next task, if the project owner chooses to proceed:** generate the two controlled Arabic candidate drafts at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` and `ch01-t04-content.json`, using English Batch 1 baseline v1.0.0 (immutable), glossary v1.3.0, the corrected and ratified authorization (v1.3.2), and the established equation/bidi rules. Not performed by this update.

## 21. Batch 1 Arabic candidate generation, review, and baseline approval (added 2026-07-17)

The task named in §20 as "exact next task" has since been completed, followed by review and approval:

1. **Generation:** the two controlled Arabic candidate drafts were created at `docs/content-design/chapter-01/batch1-arabic-drafts/ch01-t01-content.json` (7 records) and `ch01-t04-content.json` (8 records), as structural copies of the approved English baseline with only the Arabic localization structures populated — see `docs/app/PHSH111_BATCH1_ARABIC_DRAFT_GENERATION_REPORT.md`. A zero-mismatch deep-equality check confirmed no English-content drift; both English source files' checksums (`a445f55d...`, `c876a6fe...`) remained unchanged.
2. **Review and revision:** a consolidated scientific, linguistic, glossary, equation/bidi, and schema review found and corrected exactly two narrow draft-level defects (a duplicated parenthetical in `ch01-t01-block-equations`; a stray diacritic in `ch01-t04`'s problem solution) and concluded **"Remaining blockers: None"** for both topics — see `docs/app/PHSH111_BATCH1_ARABIC_DRAFT_REVIEW_AND_REVISION_REPORT.md`.
3. **Arabic baseline approval:** the project owner then approved both reviewed candidates as **Arabic Batch 1 baseline version 1.0.0** — `docs/content-design/chapter-01/ARABIC_BATCH1_BASELINE_APPROVAL.json` (a new, separate record, not merged into `ARABIC_PILOT_BASELINE_APPROVAL.json`) and `docs/app/PHSH111_BATCH1_ARABIC_BASELINE_APPROVAL_RECORD.md`. `PILOT_READINESS.json` is now **v1.9.0**.

**Current state:** both English and Arabic Batch 1 baselines are now approved at version 1.0.0. Both candidate files remain unmoved at `docs/content-design/chapter-01/batch1-arabic-drafts/` — baseline approval is a governance record referencing them by checksum, not a file promotion; `arabic.translationStatus` remains `"draft"` on every record, not changed to `"approved"`. **This is a project-owner internal approval only** — not independent human scientific approval, not visual approval, not application-integration authorization, and not student-facing or publication authorization. Visual production, identifier registration, application integration, independent human review, and student-facing publication all remain unauthorized/pending for `ch01-t01`/`ch01-t04`.

**Exact next task, if the project owner chooses to proceed:** a Batch 1 visual-production authorization decision for `ch01-t01` and `ch01-t04` — a scoped authorization, mirroring how visual production was separately authorized and executed for the four pilot topics, that would need to precede any actual diagram design work. Not performed by this update.

## 22. Batch 1 visual-production authorization (added 2026-07-17)

The task named in §21 as "exact next task" has now been completed: the project owner has granted a narrowly scoped **visual-production authorization** for exactly two visual IDs — `ch01-t01-visual-001` (topic `ch01-t01`) and `ch01-t04-visual-001` (topic `ch01-t04`) — following completion of both the approved English Batch 1 baseline (v1.0.0) and the approved Arabic Batch 1 baseline (v1.0.0). `PILOT_AUTHORIZATION.json` is now **v1.4.0** (`batch1VisualProductionAuthorization`); `PILOT_READINESS.json` is now **v1.10.0**. See `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_AUTHORIZATION_RECORD.md` for the full record.

**No visual asset was created by this authorization task.** `docs/content-design/chapter-01/batch1-visuals/` does not yet exist. A future, separate visual-production task may create exactly one original SVG per topic, using only the approved English and Arabic baselines as scientific/textual input and following `VISUAL_HOUSE_STYLE.md`; it may not trace, copy, redraw, or adapt any publisher visual. Both resulting assets must remain `draft`, `blocked`, `studentFacingAllowed: false`, `reviewer: null`, and `reviewedAt: null` at all times, matching the four pilot visuals' own established convention. This authorization does not authorize application integration, independent human visual or scientific review, deployment, or student-facing publication — all of which remain unauthorized/pending.

**Exact next task, if the project owner chooses to proceed:** the actual visual-production task itself — creating `ch01-t01-visual-001.svg` and/or `ch01-t04-visual-001.svg` at `docs/content-design/chapter-01/batch1-visuals/`, under this authorization's scope and constraints. Not performed by this update.

## 23. Batch 1 visual production, review, and project-owner internal visual approval (added 2026-07-17)

The task named in §22 as "exact next task" has since been completed, followed by a consolidated review and an explicit project-owner approval decision. **Production:** both visuals were created — `ch01-t01-visual-001.svg` and `ch01-t04-visual-001.svg` at `docs/content-design/chapter-01/batch1-visuals/`, each with its own validation record — see `docs/app/PHSH111_BATCH1_VISUAL_PRODUCTION_REPORT.md`. **Review and revision:** a consolidated review found and corrected two narrow scientific-completeness gaps in `ch01-t01` (speed's scalar nature and the average-speed identification for `v = d/t`, both restatements of already-approved baseline wording) plus a house-style shadow-rect bug, and found `ch01-t04` fully satisfactory with no correction needed — see `docs/app/PHSH111_BATCH1_VISUAL_REVIEW_AND_REVISION_REPORT.md`, concluding "Remaining blockers: None" for both. **Visual approval:** the project owner then approved both reviewed visuals, at their exact reviewed checksums (`ch01-t01-visual-001.svg`: `48c73a36fe...`; `ch01-t04-visual-001.svg`: `163b5eaa02...`), as **Visual Batch 1 baseline version 1.0.0** — `docs/content-design/chapter-01/VISUAL_BATCH1_APPROVAL.json` (a new, separate record) and `docs/app/PHSH111_BATCH1_VISUAL_APPROVAL_RECORD.md`. `PILOT_READINESS.json` is now **v1.11.0**.

**English baseline approved at version 1.0.0. Arabic baseline approved at version 1.0.0. Visual Batch 1 approved at version 1.0.0.** Both visual assets remain outside the application — no route, registry entry, or import references either SVG anywhere in `apps/chapter1-mvp/`. This is a **project-owner internal visual approval only** — not independent human visual or scientific approval, not application-integration authorization, not student-facing authorization, and not deployment or publication authorization. Neither SVG nor either validation record was modified, moved, renamed, or rewritten to produce this approval; both `reviewer`/`reviewedAt` fields remain `null` on both validation records. Recorded as non-blocking, deferred QA conditions (not approval blockers): mobile text at small viewport widths relies on the future application's enlarge/zoom interaction; cross-browser rendering has only been checked in one Chromium-based preview browser and must be checked during application-integration QA; the brick-red force color (`#b91c1c`) is approved for these two assets only, not ratified chapter-wide; `VISUAL_HOUSE_STYLE.md` itself was not modified by this approval. Independent human visual/scientific review, identifier registration, application integration, and student-facing publication all remain unauthorized/incomplete.

**Exact next controlled task, if the project owner chooses to proceed:** register the Batch 1 content, problem, source-marker, and approved visual identifiers required before application integration, in `IDENTIFIER_REGISTRY.json`. Not performed by this update.

## 24. Batch 1 identifier registration (added 2026-07-17)

The task named in §23 as "exact next task" has now been completed: exactly 18 identifiers — 2 `instructorScript` IDs (`ch01-is-101`, `ch01-is-104`), 12 `contentBlock` IDs (six per topic), 1 `problem` ID (`ch01-prob-104`), 1 shared authorship marker (`SRC-CH01-BATCH1-ORIGINAL`), and 2 approved visual IDs (`ch01-t01-visual-001`, `ch01-t04-visual-001`) — were registered in `docs/content-design/chapter-01/IDENTIFIER_REGISTRY.json`, now **registryVersion 1.3.0**. Two previously-missing namespace types (`instructorScript`, `contentBlock`) and one new pattern within the existing `visual` namespace (`^ch01-t[0-9]{2}-visual-[0-9]{3}$`) were added first, mirroring the exact precedent of registryVersion 1.1.0's conflict-namespace fix; a collision check confirmed no overlap with the four pilot topics' own identifiers or any other registered pattern. `PILOT_READINESS.json` is now **v1.12.0**. See `docs/app/PHSH111_BATCH1_IDENTIFIER_REGISTRATION_RECORD.md` for full detail.

`SRC-CH01-BATCH1-ORIGINAL` was registered strictly as a project-authorship/source-lineage marker — not an audited source, not independent scientific evidence — distinct from audited-source, scientific-audit, and correction records, which retain their own separate lineage. The nine Batch 1 glossary term IDs were deliberately **not** registered here; they remain glossary-local, governed exclusively inside `BILINGUAL_GLOSSARY.json` (unchanged, still v1.3.0). Neither approved topic JSON file, neither SVG, nor either visual-validation record was modified by this registration.

**English baseline approved at v1.0.0. Arabic baseline approved at v1.0.0. Visual Batch 1 approved at v1.0.0. Required Batch 1 identifiers are now registered (registryVersion 1.3.0).** Both topics remain outside the application — no route, import, or registry entry was added anywhere in `apps/chapter1-mvp/`. Application-integration authorization is the next required decision. Independent human review, QA, student-facing approval, and publication all remain pending/unauthorized.

**Exact next controlled task, if the project owner chooses to proceed:** create the controlled Batch 1 application-integration authorization for `ch01-t01` and `ch01-t04`. Not performed by this update.

## 25. Batch 1 application-integration authorization (added 2026-07-17)

The task named in §24 as "exact next task" has now been completed: the project owner has granted a narrowly scoped **internal application-integration authorization** for `ch01-t01` and `ch01-t04` — `PILOT_AUTHORIZATION.json` is now **v1.5.0** (`batch1ApplicationIntegrationAuthorization`); `PILOT_READINESS.json` is now **v1.13.0**. See `docs/app/PHSH111_BATCH1_APPLICATION_INTEGRATION_AUTHORIZATION_RECORD.md` for full detail.

The selected integration-source model is **direct import from the six approved source paths** (2 English, 2 Arabic, 2 visuals), mirroring the exact live-import pattern already proven by `src/content/rawImports.ts` for the four pilot topics — `vite.config.ts`'s existing `server.fs.allow` already covers the Batch 1 directories, so no configuration change is required. Because Batch 1's baseline is split across two separate files per topic (unlike the four pilot topics' single merged file each), the future integration task must add an in-memory English/Arabic merge step, never writing a merged file to disk. Required adapter changes were identified and documented (extending `PilotTopicId`, the topic-order constant, `rawImports.ts`, and `validateTopicSet`'s topic-count assertions) but **not performed** — this is an authorization only.

**All three Batch 1 baselines remain approved at v1.0.0; required identifiers remain registered; application integration is now authorized but not yet implemented.** QA, independent human review, student-facing approval, deployment, and publication all remain pending/unauthorized.

**Exact next controlled task, if the project owner chooses to proceed:** implement the authorized application integration for `ch01-t01` and `ch01-t04`, including tests and internal QA. Not performed by this update.

## 26. Batch 1 application integration verified (added 2026-07-17)

The task named in §25 as "exact next task" has now been completed and **verified with a real Node.js/npm toolchain** (a user-scoped Node v20.20.2/npm 10.8.2 runtime, checksum-verified against the official nodejs.org distribution, installed under the home directory with no `sudo` and no system-wide change). `PILOT_READINESS.json` is now **v1.14.0**. See `docs/app/PHSH111_BATCH1_APPLICATION_VERIFICATION_AND_QA_REPORT.md` for full detail.

**Results: TypeScript typecheck clean; full test suite 131/131 passing across 9 files; production build succeeds (81 modules, ~724.69 kB JS / 195.49 kB gzip); browser QA passed** — all six topics render in the correct order (`ch01-t01, ch01-t02, ch01-t03, ch01-t04, ch01-t08, ch01-t10`), both new topics render correctly in English and Arabic, `ch01-t01` shows no empty problem/solution UI, `ch01-t04` renders `ch01-prob-104` with 441 N as the labeled unrounded intermediate and 4.4 x 10^2 N as the final result, Review Card labels and instructor-only visibility are correct, both visual dialogs (enlarge/Escape/close/focus-trap/scroll-lock) work correctly, mobile and desktop layouts are usable, and the four original pilot topics show no regression. Two narrow test-only defects and one real merge-validation bug (the approved English baseline omits the `ar` key entirely from `LocalizedContent` fields, which the merge module had not accounted for) were found and fixed, all inside `apps/chapter1-mvp/` — no approved content, Arabic, baseline, glossary, identifier, or SVG file was touched.

**Current state: application integration is now implemented and verified.** Independent human review, student-facing authorization, deployment, and publication all remain unauthorized/incomplete — this is internal verification only.

**Exact next controlled task, if the project owner chooses to proceed:** a project-owner decision on independent human visual/scientific review and/or a future student-facing authorization track for Batch 1. Not performed by this update.
