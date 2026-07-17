// Centralized governance configuration for the whole application.
//
// Every component that needs to know "are we allowed to do X" reads from
// here, rather than each component independently re-deriving the answer
// from scattered conditions. This mirrors how the source JSON itself
// centralizes governance into one `blocking` object per record rather than
// several independent flags — see MVP_PRODUCT_SPEC.md §7's recommendation
// and docs/app/MVP_IMPLEMENTATION_DECISIONS.json.
//
// These values are fixed constants for this build, not derived from
// content or user action, and application code must never set any of them
// to a more permissive value. Changing any of these requires a new,
// explicit project-owner governance decision recorded the same way prior
// ones were — see docs/content-design/chapter-01/PILOT_AUTHORIZATION.json
// and docs/app/MVP_IMPLEMENTATION_DECISIONS.json, decision L
// (publicationState).

export const APPLICATION_MODE = "internalReviewer" as const;

/**
 * Chapter-wide publication flags, mirrored verbatim from
 * docs/app/MVP_IMPLEMENTATION_DECISIONS.json's publicationState. Not
 * derived from any content record — those carry their own per-record
 * blocking.studentFacingAllowed, which is a separate (also-false) fact
 * this module never overrides.
 */
export const PUBLICATION_STATE = {
  internalMvpBuildAuthorized: true,
  localTestingAuthorized: true,
  publicDeploymentAuthorized: false,
  studentFacingAllowed: false,
  studentPublicationAuthorized: false,
} as const;

export const INSTRUCTOR_REVIEW_PANEL_LABEL = {
  en: "Instructor Review Note",
  ar: "ملاحظة لمراجعة المدرّس",
} as const;

/**
 * A record is safe for the main learner-style flow only if its own source
 * visibility says so. "shared" and "student" both qualify; "instructor"
 * never does, regardless of any other field. This function is the single
 * choke point for that decision — no component re-implements this check.
 */
export function isLearnerVisible(visibility: "shared" | "student" | "instructor"): boolean {
  return visibility === "shared" || visibility === "student";
}

/**
 * Rendering blocked/draft content inside this internal-review build does
 * not, and cannot, change its governance status. This function exists so
 * that fact is stated in exactly one place in code (as a comment/constant)
 * rather than left implicit.
 */
export const RENDERING_DOES_NOT_ALTER_GOVERNANCE = true as const;

/** availabilityStatus:"available" is not the same fact as human-reviewed/approved. */
export function describeVisualReviewStatus(
  readyForHumanReview: boolean,
  reviewer: string | null,
): "readyForHumanReview" | "reviewed" | "unavailable" {
  if (reviewer) return "reviewed";
  if (readyForHumanReview) return "readyForHumanReview";
  return "unavailable";
}
