# Chapter 1 Canonical Structure Proposal

## Purpose and boundary

This document proposes the information architecture and governance model for future canonical Chapter 1 content. It does not generate the complete canonical chapter, merge source wording, translate missing text, approve scientific corrections, clear publication rights, or define application implementation.

The source-preservation and audit layers under `docs/content-audits/chapter-01/` remain immutable inputs. Canonical records, when later authorized, must be new records that reference those inputs.

### Accepted amendment authority

The accepted Claude architecture/readiness review is implemented by `CHAPTER_01_CANONICAL_DESIGN_AMENDMENTS.md` and the governed JSON files in this directory. Those files are normative extensions of this proposal. They add a complete `instructorScript` schema; duplicate/preference handling; multi-source problem variants; unified identifier validation; source-Arabic/canonical-Arabic separation; a bilingual glossary; explicit blocker fields; dual audit/conflict correction linkage; five formal correction cases; an independent visual-remediation plan; and design-only pilot readiness.

If an earlier example below omits a required field introduced by `CANONICAL_DESIGN_SCHEMA.json`, the schema governs. No amendment authorizes canonical generation or student publication.

## Design principles

1. **Preserve before transforming.** Original wording stays in the source layer; canonical records point to it.
2. **Correct without overwriting.** Source wording and proposed corrected wording are distinct fields.
3. **Block unresolved science from students.** High- or medium-severity unresolved content cannot be student-publishable.
4. **Separate pedagogy from presentation.** Content meaning is independent of Student Mode, Instructor Mode, or bilingual layout.
5. **Trace every claim.** Every canonical content block has at least one provenance link or is explicitly labeled newly authored.
6. **Treat visuals as governed assets.** A visual reference is not automatically a reusable visual asset.
7. **Localize explicitly.** Missing Arabic remains missing; it is not inferred from English.
8. **Keep assessment answers access-controlled.** Student-facing questions and instructor answer/explanation fields share an identity but have different visibility.
9. **Use stable IDs.** IDs identify meaning across later storage, UI, export, and revision layers.
10. **Version decisions.** Scientific, editorial, translation, rights, and visual approvals are separately recorded.

## 1. Chapter hierarchy

### Hierarchy

```text
Chapter
└── Topic
    └── Subtopic
        └── Learning Unit
            └── Content Block
```

| Level | Purpose | Stable ID pattern | Ordering rule |
|---|---|---|---|
| Chapter | Defines the whole instructional arc, chapter outcomes, prerequisites, and review layer | `ch01` | One record |
| Topic | Corresponds to one of the accepted 14 Chapter 1 topics | `ch01-t01` … `ch01-t14` | Fixed by approved topic map |
| Subtopic | Groups a coherent concept within a topic | `ch01-t05-st01` | Explicit `order`; IDs do not change if order changes |
| Learning unit | Represents one teachable student progression with a question, explanation, practice, and transition | `ch01-t05-u01` or `ch01-t05-st01-u01` | Explicit `order` within subtopic |
| Content block | Smallest independently governed and renderable unit | `ch01-t05-u01-b001` | Explicit `order`; block type controls rendering and permissions |

### Chapter record

```json
{
  "chapterId": "ch01",
  "version": "0.1.0-design",
  "status": "structureApproved|drafting|scientificReview|editorialReview|approved",
  "title": {
    "en": {"text": null, "status": "notAuthored"},
    "ar": {"text": null, "status": "missing"}
  },
  "topicIds": ["ch01-t01", "ch01-t02"],
  "chapterLearningObjectives": [],
  "prerequisiteRefs": [],
  "chapterReviewUnitId": "ch01-t14",
  "provenanceLinks": [],
  "rightsStatus": "mixedPendingReview",
  "approval": {
    "scientific": "pending",
    "editorial": "pending",
    "localization": "pending",
    "rights": "pending"
  }
}
```

### Topic, subtopic, and learning-unit records

```json
{
  "topicId": "ch01-tXX",
  "chapterId": "ch01",
  "order": 0,
  "readiness": "ready|readyWithScientificCorrection|readyWithVisualLimitation|incomplete",
  "title": {
    "en": {"text": null, "status": "notAuthored"},
    "ar": {"text": null, "status": "missing"}
  },
  "meaningfulQuestionTitle": {
    "en": {"text": null, "status": "notAuthored"},
    "ar": {"text": null, "status": "missing"}
  },
  "learningObjectiveIds": [],
  "subtopicIds": [],
  "learningUnitIds": [],
  "assessmentRefs": [],
  "topicTransitionRef": null,
  "scientificCorrectionIds": [],
  "provenanceLinks": [],
  "status": "structureOnly"
}
```

```json
{
  "subtopicId": "ch01-tXX-stYY",
  "topicId": "ch01-tXX",
  "order": 0,
  "title": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "learningUnitIds": [],
  "provenanceLinks": []
}
```

```json
{
  "learningUnitId": "ch01-tXX-stYY-uZZ",
  "topicId": "ch01-tXX",
  "subtopicId": "ch01-tXX-stYY",
  "order": 0,
  "meaningfulQuestionBlockId": null,
  "objectiveBlockIds": [],
  "instructionBlockIds": [],
  "exampleBlockIds": [],
  "applicationBlockIds": [],
  "misconceptionBlockIds": [],
  "assessmentBlockIds": [],
  "transitionBlockId": null,
  "completionCriteria": [],
  "provenanceLinks": []
}
```

### Content-block base record

Every specialized block extends this base:

```json
{
  "blockId": "ch01-tXX-uYY-bZZZ",
  "blockType": "organizedExplanation",
  "chapterId": "ch01",
  "topicId": "ch01-tXX",
  "subtopicId": null,
  "learningUnitId": "ch01-tXX-uYY",
  "order": 0,
  "visibility": "student|instructor|shared|internalAudit",
  "localizedContent": {
    "en": {"text": null, "status": "notAuthored", "reviewStatus": "pending"},
    "ar": {"text": null, "status": "missing", "reviewStatus": "notStarted"}
  },
  "provenanceLinks": [],
  "scientificCorrectionIds": [],
  "conflictRecordIds": [],
  "visualReferenceIds": [],
  "arabic": {
    "originalArabicText": {"text": null, "status": "missing", "language": "ar", "direction": "rtl", "sourceReferenceIds": [], "reviewer": null, "reviewedAt": null},
    "canonicalArabicTranslation": {"text": null, "status": "missing", "language": "ar", "direction": "rtl", "sourceReferenceIds": [], "reviewer": null, "reviewedAt": null},
    "translationStatus": "missing",
    "translationReviewer": null,
    "terminologyApprovalStatus": "notStarted",
    "glossaryTermIds": [],
    "languagePreferenceDecisionIds": []
  },
  "duplicateHandling": {
    "duplicateGroupIds": [],
    "revisionGroupId": null,
    "canonicalPreferenceStatus": "notEvaluated",
    "preferredSourceRecordId": null,
    "preferenceReason": null,
    "supersededBy": null,
    "retainedForHistoricalTrace": true
  },
  "blocking": {
    "blockingStatus": "blocked",
    "blockingReason": ["rightsPending"],
    "blockingRecordIds": [],
    "studentFacingAllowed": false,
    "instructorFacingAllowed": true,
    "resolutionRequired": true,
    "resolutionOwner": null,
    "resolutionStatus": "open"
  },
  "contentLeakTestStatus": "notRun",
  "rightsStatus": "pendingReview",
  "publicationStatus": "blocked",
  "revision": 1
}
```

Allowed `blockType` values initially include:

- `meaningfulQuestion`
- `learningObjectives`
- `sourceTextReference`
- `organizedExplanation`
- `mainIdea`
- `conceptualFlow`
- `keyConcept`
- `equationSet`
- `visualReference`
- `example`
- `application`
- `misconception`
- `topicTransition`
- `instructorScript`
- `reviewQuestion`
- `reviewCard`
- `workedProblem`
- `practiceProblem`
- `quizQuestion`
- `scientificCorrectionNote`
- `provenanceNote`

## 2. Structure of each topic

Every topic should support the following proposed fields. A field may be empty only when its status explains why.

| Field | Data form | Purpose and rule |
|---|---|---|
| `meaningfulQuestionTitle` | Localized short text | Frames the topic as a meaningful question; must not embed the answer |
| `learningObjectives` | Ordered objective records | Observable outcomes using student-action verbs; each links to units and assessments |
| `originalSourceTextReferences` | Provenance-link array | Points to original segments/pages/cards/problems; does not copy restricted text into canonical storage by default |
| `organizedEnglishExplanation` | English localized blocks | Future approved explanation in the user's preferred organized teaching style |
| `mainIdea` | Localized concise statement | One conceptual anchor for the topic |
| `numberedConceptualFlow` | Ordered step objects | Numbered main ideas with short supporting bullets; each step is traceable |
| `keyConcept` | Localized concise statement | The non-negotiable scientific takeaway |
| `equations` | Equation records | Semantic equation, notation, conditions, units, sign convention, and derivation references |
| `figuresAndVisualReferences` | Visual-reference array | Links to governed visual assets or unresolved placeholders |
| `examples` | Example records | Conceptual or numerical examples with assumptions and outcomes |
| `applications` | Application records | Real-life or medical applications; medical material requires separate accuracy/safety review |
| `commonMisconceptions` | Misconception records | Student misconception, diagnosis, correction, and instructor response |
| `connectionToNextTopic` | Transition block | Explains why the next topic follows; must name the target topic ID |
| `arabicTranslation` | Arabic localized fields | Only supplied or approved translation; missing remains `null` |
| `instructorTeachingScripts` | Instructor-only blocks | Narration, pacing, questions, pauses, expected responses, board/visual cues |
| `reviewQuestions` | Assessment references | Topic-level formative checks |
| `reviewCards` | Review-card references | Card grouping, visible source image, question IDs, and answer-access policy |
| `workedProblems` | Worked-problem references | Fully explained problems with corrected-answer workflow |
| `practiceProblems` | Practice-problem references | Student attempts with hints and controlled solution reveal |
| `quizQuestions` | Quiz references | Multiple-choice, true/false, conceptual, numerical, and Kahoot-compatible variants |
| `scientificCorrectionNotes` | Correction-reference array | Links to audit records and approval decisions; instructor/internal only unless pedagogically surfaced |
| `provenanceAndRightsStatus` | Structured governance record | Source IDs, locators, linkage confidence, rights decision, reuse restrictions |

### Topic structure skeleton

```json
{
  "topicId": "ch01-tXX",
  "meaningfulQuestionTitle": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "learningObjectives": [],
  "originalSourceTextReferences": [],
  "organizedEnglishExplanationBlockIds": [],
  "mainIdeaBlockId": null,
  "numberedConceptualFlowBlockIds": [],
  "keyConceptBlockId": null,
  "equationIds": [],
  "figureAndVisualReferenceIds": [],
  "exampleIds": [],
  "applicationIds": [],
  "commonMisconceptionIds": [],
  "connectionToNextTopicBlockId": null,
  "arabicTranslationStatus": "missing|partial|sourceSupplied|translated|reviewed|approved",
  "instructorTeachingScriptIds": [],
  "reviewQuestionIds": [],
  "reviewCardIds": [],
  "workedProblemIds": [],
  "practiceProblemIds": [],
  "quizQuestionIds": [],
  "scientificCorrectionIds": [],
  "provenanceAndRightsStatus": {
    "sourceIds": [],
    "rightsStatus": "pendingReview",
    "publicReuse": "notApproved"
  }
}
```

### Instructor-script schema

`instructorScript` is defined completely in `$defs.instructorScript` of `CANONICAL_DESIGN_SCHEMA.json`. Required fields are:

- opening hook;
- meaningful question;
- learning objectives;
- word-for-word teaching script;
- slide/page and figure cues;
- questions to ask and expected student responses;
- misconceptions, analogies, and examples;
- transitions and emphasis notes;
- timing and pause cues;
- instructor-only cautions;
- scientific-correction references;
- source traceability;
- Arabic separation, duplicate handling, and blocking workflow.

This record is instructor-only. A student-facing block may reuse an approved concept but never exposes instructor cautions, answer keys, raw source wording, or audit notes.

### Numbered conceptual-flow block

```json
{
  "blockType": "conceptualFlow",
  "steps": [
    {
      "stepNumber": 1,
      "title": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
      "bullets": {
        "en": [],
        "ar": []
      },
      "provenanceLinks": [],
      "scientificCorrectionIds": []
    }
  ]
}
```

### Equation record

```json
{
  "equationId": "ch01-eq-XXX",
  "latex": null,
  "plainText": null,
  "quantityType": "scalar|vector|mixed",
  "meaning": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "symbolDefinitions": [],
  "units": [],
  "conditions": [],
  "signConventionRequired": false,
  "averageOrInstantaneous": "average|instantaneous|notApplicable",
  "derivationBlockIds": [],
  "scientificApproval": "pending",
  "provenanceLinks": []
}
```

## 3. Student and instructor separation

### Visibility model

| Content | Student Mode | Instructor Mode | Shared canonical basis |
|---|---|---|---|
| Meaningful question and objectives | Visible | Visible with teaching intent | Same approved localized records |
| Organized explanation, main idea, conceptual flow, key concept | Visible | Visible plus instructor annotations | Same scientific content; mode-specific presentation |
| Equations and approved figures | Visible | Visible with derivation, caveats, and teaching cues | Same equation/visual identity |
| Examples and real-life applications | Visible | Visible with extension questions and timing | Same approved example/application record |
| Medical applications | Visible only after medical/safety approval | Includes scope and safety notes | Same evidence-governed record |
| Common misconceptions | Student sees corrective prompt or self-check | Instructor sees diagnosis, likely responses, and intervention | One misconception identity with filtered fields |
| Topic transition | Visible | Visible with pacing note | Same transition record |
| Arabic/English display | User-selectable | User-selectable with translation status | Same localized record |
| Instructor teaching script | Hidden | Visible | Instructor-only record |
| Original source wording | Hidden unless rights-approved excerpt is pedagogically necessary | Available as restricted reference if authorized | Source layer remains separate |
| Scientific audit and correction history | Hidden | Visible to authorized instructor/editor roles | Internal governance record |
| Review/practice question | Visible | Visible with answer key and pedagogy | Same question identity |
| Correct answer and full solution | Hidden until configured reveal/submission | Visible | Access-controlled fields |
| Review-card source image | Visible only if rights-approved and quality-suitable | Visible with provenance warning | Governed visual asset |
| Provenance and rights details | Simplified attribution if required | Full detail | Same provenance links |

### Mode fields

```json
{
  "visibility": "student|instructor|shared|internalAudit",
  "studentPolicy": {
    "show": true,
    "revealAfterAttempt": false,
    "requiresScientificApproval": true,
    "requiresRightsApproval": true
  },
  "instructorPolicy": {
    "show": true,
    "showSourceWording": true,
    "showAuditNotes": true,
    "showAnswerKey": true
  }
}
```

Student Mode must never query raw source files directly. It consumes only canonical records whose `publicationStatus` is `studentApproved`.

## 4. Language model

### Localized field shape

The preferred shape expands the requested `{ "en": "...", "ar": "..." }` pattern with explicit status metadata:

```json
{
  "en": {
    "text": null,
    "status": "notAuthored|sourceSupplied|draft|reviewed|approved",
    "direction": "ltr",
    "sourceLanguage": "en"
  },
  "ar": {
    "text": null,
    "status": "missing|sourceSupplied|draft|reviewed|approved",
    "direction": "rtl",
    "sourceLanguage": "ar"
  }
}
```

For a compact approved record, a derived display object may be:

```json
{
  "en": "approved English text",
  "ar": "approved Arabic text"
}
```

That compact form must not be used while either language is missing or unapproved.

### Display modes

- **English:** render only approved English; math and units retain semantic formatting.
- **Arabic:** render only approved Arabic; use RTL layout while preserving equation order, symbols, and SI notation.
- **Bilingual:** render aligned English and Arabic fields from the same content-block ID. Never align unrelated source paragraphs merely because they share a topic.

### Localization rules

- Do not translate missing Arabic during structure design.
- Store `text: null` and `status: missing` when Arabic does not exist.
- Preserve source-supplied Arabic exactly in the source layer; a future canonical Arabic field is a separately reviewed record.
- Track translation provenance: `sourceSupplied`, `humanTranslated`, `machineAssisted`, or `unknown`.
- Review scientific terminology independently in each language.
- Store equations once as semantic math; localize explanations, not the underlying expression.
- Store glossary term IDs so English and Arabic use consistent approved terminology.
- Store source-supplied Arabic in `originalArabicText` and future canonical Arabic in `canonicalArabicTranslation`; never overwrite one with the other.
- Track `translationStatus`, `translationReviewer`, and `terminologyApprovalStatus` independently.
- Starter terminology records live in `BILINGUAL_GLOSSARY.json`; their Arabic candidates remain pending until explicitly approved.

## 5. Source traceability

Every canonical content block must contain one or more `provenanceLinks`, unless `authorshipType` is explicitly `newCanonicalAuthorship`. Newly authored content still records which audited concepts informed it.

### Provenance-link schema

```json
{
  "provenanceLinkId": "prov-ch01-XXXX",
  "sourceId": "SRC-CH01-CONV-001",
  "locatorType": "segment|page|card|question|problem|occurrence|visual|file",
  "locatorId": "SEG001",
  "locatorDetail": {
    "pageNumber": null,
    "lineRange": null,
    "region": null
  },
  "sourceContribution": "wording|concept|equation|example|visual|answer|teachingMethod|translation|formatPreference",
  "linkageType": "explicit|inferred",
  "confidence": "confirmed|high|medium|low|unresolved",
  "evidence": null,
  "scientificAuditRecordIds": [],
  "conflictRecordIds": [],
  "visualReferenceIds": [],
  "rightsStatus": "restricted|pendingReview|approvedInternal|approvedPublic|unknown",
  "allowedUse": "referenceOnly|internalExcerpt|publicExcerpt|adaptationAllowed|unknown"
}
```

### Traceability rules

- Page, segment, card, question, and problem IDs must match existing audit records.
- Explicit and inferred links must never share the same confidence label without evidence.
- An inferred link cannot authorize reuse of an image or verbatim text.
- Scientific-audit IDs travel with every derived block until the correction is approved.
- Multiple sources may support one block; none is silently treated as the canonical source.
- Canonical blocks retain `reverseIndexRecordIds` so source records can list every downstream use.
- Rights status is evaluated per source contribution, not merely per topic.
- All locators must validate through `IDENTIFIER_REGISTRY.json`; an unknown or ambiguous prefix is a blocker.

## 6. Scientific correction workflow

### Separate original and corrected wording

```json
{
  "correctionId": "ch01-corr-XXX",
  "sourceAuditRecordIds": ["S3-SCI-003"],
  "conflictRecordIds": ["CD-CONF-001"],
  "severity": "high|medium|low|validationOnly",
  "originalWordingRef": {
    "sourceId": "SRC-CH01-PDF-003",
    "locatorType": "page",
    "locatorId": "S3-P018"
  },
  "originalWordingCopy": null,
  "originalCopyRightsStatus": "referenceOnly",
  "proposedCorrectedWording": {
    "en": {"text": null, "status": "notAuthored"},
    "ar": {"text": null, "status": "missing"}
  },
  "scientificRationale": null,
  "affectedBlockIds": [],
  "workflowStatus": "flagged",
  "approvals": {
    "scientificReviewer": null,
    "scientificApprovedAt": null,
    "editorialReviewer": null,
    "editorialApprovedAt": null
  }
}
```

### Workflow states

```text
sourcePreserved
→ flagged
→ correctionProposed
→ scientificReview
→ scientificallyApproved
→ editorialReview
→ editoriallyApproved
→ studentPublishable
```

`rejected`, `needsEvidence`, and `blockedByVisual` are allowed side states.

### Publication guards

- High or medium unresolved audit items set `publicationStatus: blocked`.
- A source answer known to be wrong is never copied into `correctedAnswer`; it remains in `sourceAnswer` with restricted/instructor visibility.
- Student Mode displays only `scientificallyApproved` and `editoriallyApproved` wording.
- If no correction has been approved, the content block is omitted or replaced by an approved neutral placeholder—not by the raw wording.
- Corrections do not edit raw source files or extraction records.
- Approval requires reviewer identity, timestamp, rationale, and affected-block list.
- A later correction creates a new revision; historical approved revisions remain auditable.

### Initial blocking correction families from the consolidation review

- Distance/path length versus position/displacement
- Speed versus velocity and average versus instantaneous definitions
- Negative acceleration and sign conventions
- Tangent velocity versus inward centripetal acceleration
- Constant-acceleration assumptions in Problems 30 and 32
- Problem 12 southeast direction
- Problem 32 rounding and reference-origin labels
- Free-fall model assumptions
- Period/frequency cycle conditions
- Equation-summary classification
- Fundamental-quantities scope within mechanics versus broader physics
- Mass, gravitational weight, and apparent-weight terminology
- Perpendicular-resultant geometric interpretation
- Graph slope/concavity wording under explicit axes and sign conventions
- Usain Bolt event/time mismatch: Berlin 2009 = 9.58 s; Beijing 2008 = 9.69 s

The formal proposed records are in `SCIENTIFIC_CORRECTIONS.json`. Every correction links both scientific-audit records and a design/source conflict record, and remains suppressed from Student Mode until approved.

This list seeds workflow records later; it does not create corrected content now.

## 7. Visual workflow

### Visual-reference record

```json
{
  "visualReferenceId": "ch01-vis-XXX",
  "visualType": "pdfPage|pdfCrop|reviewCard|photograph|diagram|graph|table|equationGraphic|missingPlaceholder|recreatedAsset",
  "sourceId": "SRC-CH01-PDF-003",
  "sourceLocatorId": "S3-P025",
  "linkageType": "explicit|inferred",
  "confidence": "confirmed|high|medium|low|unresolved",
  "availability": "available|missing|contextLimited|lowResolution|candidateMatch",
  "assetId": null,
  "altText": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "caption": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "instructionalPurpose": null,
  "scientificReviewStatus": "pending",
  "qualityStatus": "pending",
  "rightsStatus": "pendingReview",
  "displayStatus": "blocked"
}
```

### Asset and display rules

- Preserve original PDFs and review-card images as source assets; do not overwrite or crop them in the raw layer.
- A canonical crop or redraw receives a new asset ID and links back to its source page/visual.
- PDF figures may be referenced by page immediately for internal design, but displayed to students only after rights, quality, and scientific review.
- Review-card images remain separate from their transcribed questions and solved-review explanations.
- Missing visuals use `visualType: missingPlaceholder`, `availability: missing`, and `displayStatus: blocked`.
- Candidate recovery links, such as P5 Figure 1.13 ↔ P3 pp. 26–27, remain `inferred` or `candidateMatch` until confirmed.
- P5 elevator and Figure 1.40 records remain missing; their numerical answers carry visual-validation status.
- Context-limited PDF visuals must be redrawn or supplemented with labels, axes, scales, assumptions, or connecting lines as required.
- Graphs should be canonicalized from reviewed data and semantic axis definitions, not merely screenshots.
- Every graph record declares `xQuantity`, `yQuantity`, units, sign convention, domain, data points/function, and whether connecting lines are meaningful.
- Every visual has English and Arabic alt-text status; missing alt text blocks accessibility approval.
- Medical imagery or claims require separate rights and domain review.

### Graph specification

```json
{
  "graphId": "ch01-graph-XXX",
  "graphType": "positionTime|distanceTime|velocityTime|accelerationTime|other",
  "xAxis": {"quantity": "time", "unit": "s", "range": null},
  "yAxis": {"quantity": "position", "unit": "m", "range": null},
  "signConvention": null,
  "dataModel": "points|piecewise|function|qualitative",
  "data": [],
  "connectPoints": null,
  "slopeMeaning": null,
  "areaMeaning": null,
  "scientificCorrectionIds": [],
  "provenanceLinks": [],
  "displayStatus": "blocked"
}
```

## 8. Problem schema

### Problem record

```json
{
  "problemId": "ch01-prob-XXX",
  "topicIds": [],
  "problemType": "worked|practice|challenge|application",
  "difficulty": "introductory|standard|advanced",
  "statement": {
    "en": {"text": null, "status": "notAuthored"},
    "ar": {"text": null, "status": "missing"}
  },
  "givenValues": [
    {
      "symbol": null,
      "value": null,
      "unit": null,
      "direction": null,
      "sign": null,
      "exactOrApproximate": "exact|approximate|unknown"
    }
  ],
  "conceptualInterpretation": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "assumptions": [],
  "equationSelection": [
    {
      "equationId": null,
      "reason": null,
      "conditionsSatisfied": [],
      "conditionsMissing": []
    }
  ],
  "numberedSolution": [
    {
      "stepNumber": 1,
      "purpose": null,
      "explanation": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
      "calculationRef": null
    }
  ],
  "calculations": [
    {
      "calculationId": null,
      "expression": null,
      "substitution": null,
      "result": null,
      "unit": null,
      "roundingRule": null,
      "significantFigures": null
    }
  ],
  "finalAnswer": {
    "value": null,
    "unit": null,
    "direction": null,
    "sign": null,
    "referencePoint": null,
    "interpretation": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}}
  },
  "unitChecks": [],
  "directionAndSignChecks": [],
  "intuition": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "commonMistakes": [],
  "sourceAnswer": {
    "textRef": null,
    "value": null,
    "unit": null,
    "direction": null,
    "status": "unknown|correct|incorrect|partiallyCorrect|unverified"
  },
  "correctedAnswer": {
    "value": null,
    "unit": null,
    "direction": null,
    "status": "notProposed|proposed|scientificallyApproved|editoriallyApproved"
  },
  "sourceVariants": [],
  "selectedVariantIds": [],
  "selectionRationale": null,
  "duplicateHandling": {
    "duplicateGroupIds": [],
    "revisionGroupId": null,
    "canonicalPreferenceStatus": "notEvaluated",
    "preferredSourceRecordId": null,
    "preferenceReason": null,
    "supersededBy": null,
    "retainedForHistoricalTrace": true
  },
  "hintBlocks": [],
  "visualReferenceIds": [],
  "scientificCorrectionIds": [],
  "provenanceLinks": [],
  "rightsStatus": "pendingReview",
  "publicationStatus": "blocked"
}
```

### Problem-mode behavior

- A worked problem may reveal all approved solution fields.
- A practice problem initially reveals the statement and approved visuals; hints and solutions follow configured reveal rules.
- `sourceAnswer` is instructor/internal evidence and may be wrong.
- `correctedAnswer` is the only answer eligible for Student Mode after approval.
- `direction`, `sign`, `referencePoint`, units, rounding, and assumptions are separately validated, not buried in answer text.
- Visual-dependent problems remain blocked or explicitly qualitative until their visual is confirmed.
- `sourceVariants` may reference multiple source IDs, problem IDs, solution IDs, review-card IDs, question IDs, pages, segments, occurrences, visuals, answer variants, correction records, and conflict records.
- `selectedVariantIds` and `selectionRationale` make a preferred solution explicit without discarding nonpreferred occurrences.

## 9. Review and quiz schema

### Common assessment record

```json
{
  "questionId": "ch01-q-XXX",
  "questionType": "multipleChoice|trueFalse|conceptualPrompt|numerical|reviewCard|kahootCompatible",
  "topicIds": [],
  "learningObjectiveIds": [],
  "prompt": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "visualReferenceIds": [],
  "difficulty": "introductory|standard|advanced",
  "studentResponseMode": "singleSelect|multiSelect|boolean|shortText|numericWithUnit",
  "answerPolicy": {
    "reveal": "never|afterAttempt|afterSubmission|instructorControlled",
    "showExplanation": false
  },
  "correctResponse": null,
  "answerExplanation": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "distractorExplanations": [],
  "scientificCorrectionIds": [],
  "provenanceLinks": [],
  "rightsStatus": "pendingReview",
  "publicationStatus": "blocked"
}
```

### Multiple choice

```json
{
  "choices": [
    {
      "choiceId": "A",
      "text": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
      "isCorrect": null,
      "feedback": null
    }
  ],
  "selectionMode": "single|multiple"
}
```

### True/false

```json
{
  "correctResponse": null,
  "requiredCorrectionIfFalse": null,
  "confidencePromptEnabled": false
}
```

### Conceptual prompt

```json
{
  "expectedConceptIds": [],
  "acceptableResponseCriteria": [],
  "misconceptionSignals": [],
  "rubric": []
}
```

### Numerical question

```json
{
  "expectedValue": null,
  "acceptedTolerance": null,
  "requiredUnit": null,
  "requiredDirection": null,
  "requiredSignConvention": null,
  "significantFiguresPolicy": null,
  "calculationPathRequired": false
}
```

### Review card

```json
{
  "reviewCardId": "ch01-card-XXX",
  "title": {"en": {"text": null, "status": "notAuthored"}, "ar": {"text": null, "status": "missing"}},
  "questionIds": [],
  "sourceCardRef": null,
  "sourceImageVisualRef": null,
  "answerKeyVisibility": "instructorOnly",
  "layoutStatus": "notDesigned",
  "rightsStatus": "pendingReview"
}
```

### Kahoot-compatible question

No Kahoot source is currently available, so this is an export-compatible structure, not reconstructed Kahoot content.

```json
{
  "kahootExport": {
    "enabled": false,
    "platformConstraintsValidated": false,
    "questionTextRef": null,
    "choiceIds": [],
    "timeLimitSeconds": null,
    "pointsMode": null,
    "mediaVisualRef": null,
    "language": "en|ar",
    "exportReviewStatus": "notStarted"
  }
}
```

Platform limits must be verified at export time rather than hard-coded from memory.

## 10. Topic readiness map

This map carries forward the accepted consolidation review. “Proceed” means the topic may enter controlled canonical drafting after the named gate; it does not authorize drafting in this phase.

| Topic | Readiness | Canonical-design action |
|---|---|---|
| `ch01-t01` Fundamental Quantities | ready with scientific correction | Create structure now; block student wording until mechanics scope and charge context are approved |
| `ch01-t02` Distance, Units, Area and Volume | ready | May proceed directly to canonical drafting after rights/provenance selection |
| `ch01-t03` Time, Period and Frequency | ready with scientific correction | Define cycle and periodic-process conditions before approval |
| `ch01-t04` Mass, Inertia and Weight | ready with scientific correction | Approve mass-as-inertia and weight/apparent-weight terminology first |
| `ch01-t05` Average and Instantaneous Speed | ready with scientific correction | Resolve path length/displacement, average/instantaneous definitions, and Bolt data status |
| `ch01-t06` Velocity, Scalars and Vectors | ready with scientific correction | Standardize scalar/vector symbols and link to Topic 5 corrections |
| `ch01-t07` Vector Representation and Addition | ready with visual limitation | Use confirmed P3 visuals only; keep Figure 1.13 candidate link blocked; correct Q009 explanation |
| `ch01-t08` Acceleration, Signs and g | ready with scientific correction | Approve the axis/sign convention and distinguish `|g|` from signed acceleration before student use |
| `ch01-t09` Free Fall | ready with scientific correction | Add model, initial-condition, and sign assumptions; C2 absence is not blocking |
| `ch01-t10` Centripetal Acceleration | ready with scientific correction | Correct tangent-velocity/inward-acceleration wording before drafting |
| `ch01-t11` Rest and Uniform Motion | ready with scientific correction | Use position/displacement notation and general initial-position equation |
| `ch01-t12` Position-Time Graphs and Slope | ready with scientific correction | Apply graph taxonomy globally; keep elevator visual-dependent records blocked |
| `ch01-t13` Constant Acceleration and Motion Graphs | ready with scientific correction | Approve constant-acceleration assumptions, signs, rounding, and graph specifications |
| `ch01-t14` Chapter Review and Problems | incomplete | Structure may be designed, but final content set waits for the Kahoot decision and missing-source policy |

### Global readiness gates

Before any topic becomes `studentPublishable`:

1. All linked high and medium scientific corrections are approved.
2. Rights status permits the intended use.
3. English content is scientifically and editorially approved.
4. Arabic is either approved or explicitly unavailable in the selected display mode.
5. Required visuals are available, reviewed, accessible, and correctly linked.
6. Assessment answers, units, signs, directions, and assumptions pass validation.
7. Instructor/student visibility rules pass a content-leak test.

## 11. Claude handoff package

The original 57-file audit handoff has completed and is superseded for amendment verification. Claude should now receive only the focused 26-file package listed, in exact order, in `CLAUDE_REREVIEW_HANDOFF.md`.

The re-review must verify the amended schemas, registries, correction records, visual blockers, and pilot readiness. It must not reread raw verbatim sources unless a specific amendment cannot be verified from the listed audit evidence, and it must not generate pilot content.

The required final decision is one of:

- `approvedForPilotGenerationRequest`; or
- `requiresDesignRevision`.

## Validation statement

This proposal and its accepted amendment files define all five hierarchy levels; Student, Instructor, and Shared content; English, Arabic, and bilingual localization; a complete instructor-script schema; duplicate and multi-source handling; identifier validation; source-Arabic/canonical-Arabic separation; terminology governance; explicit blocking; dual audit/conflict correction linkage; visual remediation; the 14-topic readiness map; design-only pilot readiness; and an exact 26-file Claude re-review order.

No complete canonical Chapter 1 content or missing Arabic translation was generated. No source-level audit record was altered, no source text was merged or rewritten, and no application, package, or Git operation was performed.
