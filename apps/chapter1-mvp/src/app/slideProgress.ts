// Per-slide learning-progress model for the Slide Reader (see
// src/features/topics/SlideReader/SlideReader.tsx) and the View All Slides
// accordion (src/features/topics/Slides.tsx) — a UI display/progress
// preference only, stored client-side exactly like every other value in
// src/app/persistedState.ts, never a login, database, cloud state, grade,
// or analytics record (same scope as that module's own header comment).
//
// This module is the ONE canonical source of truth for per-slide learning
// state, scoped by topic + slide record ID (never by slideNumber alone —
// record IDs are the stable identity, slide numbers are navigation
// metadata that can be reordered). Both the reader and the accordion read
// and write through the exact same functions here (readTopicLearningState/
// writeTopicLearningState/withViewed/withCompleted/withIncomplete), so a
// slide marked Viewed or Completed in either view is immediately visible
// in the other the next time that view mounts — SlidesExperience.tsx
// always fully unmounts one view and mounts the other on every switch, so
// "read fresh from canonical storage on mount" is sufficient for same-tab
// live synchronization with no polling, timers, or storage-event listener.
//
// Legacy compatibility: a returning visitor's existing "viewedRecordIds"
// list — written by an OLDER version of the accordion, before this module
// became the accordion's own write target too — is still safe to read.
// readTopicLearningState reconciles it into canonical state on every read
// (not merely the first time canonical storage is created), so any legacy
// Viewed entry accumulated at any point safely and idempotently imports a
// missing `viewedAt` without ever overwriting or downgrading existing
// canonical Viewed/Completed/Mastered data. The legacy key itself is never
// written by this module or by the accordion going forward (see
// src/features/topics/Slides.tsx) — it is a read-only migration source now.
import { readPersistedJSON, readPersistedStringArray, writePersistedJSON } from "./persistedState";

export interface SlideLearningState {
  viewedAt?: string;
  completedAt?: string;
  masteredAt?: string;
}

export type TopicLearningState = Record<string, SlideLearningState>;

interface PersistedLearningStateEnvelope {
  version: 1;
  records: unknown;
}

/** Top-level envelope shape only — record-by-record content is sanitized separately by sanitizeLearningStateRecords, so one malformed record never discards the whole envelope. */
function isPersistedLearningStateEnvelopeShape(value: unknown): value is PersistedLearningStateEnvelope {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  if (obj.version !== 1) return false;
  return "records" in obj;
}

/**
 * Sanitizes an arbitrary parsed JSON value into a valid TopicLearningState,
 * field by field and record by record: a record that isn't itself a plain
 * object is dropped entirely (its siblings are unaffected); within a
 * record that IS a plain object, only viewedAt/completedAt/masteredAt
 * fields whose value is actually a string are kept — a wrong-typed field
 * (a number, an array, etc.) is silently ignored rather than promoted into
 * valid state, and any other unknown/extra property is ignored. Never
 * throws on `null`, an array, or any other unexpected shape.
 */
function sanitizeLearningStateRecords(value: unknown): TopicLearningState {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const result: TopicLearningState = {};
  for (const [recordId, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry !== "object" || entry === null || Array.isArray(entry)) continue;
    const obj = entry as Record<string, unknown>;
    const sanitized: SlideLearningState = {};
    if (typeof obj.viewedAt === "string") sanitized.viewedAt = obj.viewedAt;
    if (typeof obj.completedAt === "string") sanitized.completedAt = obj.completedAt;
    if (typeof obj.masteredAt === "string") sanitized.masteredAt = obj.masteredAt;
    result[recordId] = sanitized;
  }
  return result;
}

function learningStateKey(topicId: string): string {
  return `${topicId}.slides.learningState`;
}

/** The exact legacy key the accordion used to write (and still may, from an older cached page load) — read-only here, never written. */
function legacyViewedKey(topicId: string): string {
  return `${topicId}.slides.viewedRecordIds`;
}

/** Reads only the canonical (non-legacy) persisted state, tolerating a malformed/missing/wrong-shaped envelope by falling back to {} rather than crashing or discarding valid sibling records. */
function readCanonicalLearningState(topicId: string): TopicLearningState {
  const stored = readPersistedJSON<PersistedLearningStateEnvelope | null>(
    learningStateKey(topicId),
    null,
    (value): value is PersistedLearningStateEnvelope => value === null || isPersistedLearningStateEnvelopeShape(value),
  );
  if (!stored) return {};
  return sanitizeLearningStateRecords(stored.records);
}

/**
 * Pure reconciliation core: merges a legacy viewed-record-id list into an
 * already-sanitized canonical state, adding a `viewedAt` only for a legacy
 * id that (a) is a non-empty string, (b) is in `validRecordIds` when that
 * filter is supplied (an unknown/stale legacy id is ignored rather than
 * silently reviving dead content), and (c) does not already have a
 * `viewedAt` in canonical. Never removes, overwrites, or downgrades an
 * existing canonical `viewedAt`/`completedAt`/`masteredAt` — legacy data
 * can only ever fill a gap, never replace newer information. Returns the
 * original `canonical` reference unchanged (no new object) when nothing
 * needed reconciling, so repeated calls are cheap and idempotent.
 */
export function reconcileLegacyViewedState(
  canonical: TopicLearningState,
  legacyViewedIds: readonly string[],
  validRecordIds?: readonly string[],
  now: string = new Date().toISOString(),
): TopicLearningState {
  const allowed = validRecordIds ? new Set(validRecordIds) : null;
  let next = canonical;
  for (const recordId of legacyViewedIds) {
    if (typeof recordId !== "string" || recordId.length === 0) continue;
    if (allowed && !allowed.has(recordId)) continue;
    if (next[recordId]?.viewedAt) continue;
    if (next === canonical) next = { ...canonical };
    next[recordId] = { ...next[recordId], viewedAt: now };
  }
  return next;
}

/**
 * Reads a topic's current, fully reconciled learning state: canonical
 * storage merged with any not-yet-imported legacy Viewed entries — run on
 * EVERY call, not gated on "canonical key does not exist yet", so a
 * learner who accumulates new legacy-only viewed entries (e.g. from an
 * older cached page) after canonical storage already exists still gets
 * them safely imported. When `validRecordIds` is supplied (the caller's
 * current topic slide record IDs), a legacy id that no longer corresponds
 * to a real slide is ignored rather than reconciled. Callers that hold the
 * result in React state and persist it back via writeTopicLearningState
 * on change (see SlideReader.tsx and Slides.tsx) naturally commit any
 * reconciled legacy entries to canonical storage on next write, without
 * this read function itself performing any write.
 */
export function readTopicLearningState(topicId: string, validRecordIds?: readonly string[]): TopicLearningState {
  const canonical = readCanonicalLearningState(topicId);
  const legacyViewedIds = readPersistedStringArray(legacyViewedKey(topicId), []);
  if (legacyViewedIds.length === 0) return canonical;
  return reconcileLegacyViewedState(canonical, legacyViewedIds, validRecordIds);
}

export function writeTopicLearningState(topicId: string, records: TopicLearningState): void {
  writePersistedJSON<PersistedLearningStateEnvelope>(learningStateKey(topicId), { version: 1, records });
}

/** Marks a slide viewed (idempotent — an already-viewed slide's original viewedAt is preserved, never overwritten by re-opening it). */
export function withViewed(state: TopicLearningState, recordId: string, now: string = new Date().toISOString()): TopicLearningState {
  if (state[recordId]?.viewedAt) return state;
  return { ...state, [recordId]: { ...state[recordId], viewedAt: now } };
}

/** Marks a slide explicitly completed — only ever called from the "Mark as Completed" control, never from navigation/visibility alone. Idempotent: an already-completed slide's original completedAt is preserved, never overwritten by re-marking it. Ensures viewedAt exists, since explicit completion necessarily implies the slide was viewed. */
export function withCompleted(state: TopicLearningState, recordId: string, now: string = new Date().toISOString()): TopicLearningState {
  if (state[recordId]?.completedAt) return state;
  return {
    ...state,
    [recordId]: { ...state[recordId], viewedAt: state[recordId]?.viewedAt ?? now, completedAt: now },
  };
}

/** Reverses explicit completion ("Mark as Incomplete") — removes only completedAt; viewedAt and masteredAt are left untouched. */
export function withIncomplete(state: TopicLearningState, recordId: string): TopicLearningState {
  if (!state[recordId]?.completedAt) return state;
  const { completedAt: _completedAt, ...rest } = state[recordId];
  return { ...state, [recordId]: rest };
}

export function isViewed(state: TopicLearningState, recordId: string): boolean {
  return Boolean(state[recordId]?.viewedAt);
}

export function isCompleted(state: TopicLearningState, recordId: string): boolean {
  return Boolean(state[recordId]?.completedAt);
}

export function isMastered(state: TopicLearningState, recordId: string): boolean {
  return Boolean(state[recordId]?.masteredAt);
}

/** Completed-slide count / total — the header's progress percentage (distinct from the navigator's separate viewed/completed/mastered badges). */
export function completionProgress(state: TopicLearningState, recordIds: string[]): { completed: number; total: number; percent: number } {
  const completed = recordIds.filter((id) => isCompleted(state, id)).length;
  const total = recordIds.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}

/**
 * Viewed/Completed/Mastered counts, each computed strictly from its own
 * field (viewedAt/completedAt/masteredAt respectively) — never one used as
 * a stand-in for another — and restricted to `recordIds` (the caller's
 * current topic slides), so a stale record ID left over in storage from
 * regenerated content never inflates any count.
 */
export function progressCounts(
  state: TopicLearningState,
  recordIds: string[],
): { viewed: number; completed: number; mastered: number; total: number } {
  return {
    viewed: recordIds.filter((id) => isViewed(state, id)).length,
    completed: recordIds.filter((id) => isCompleted(state, id)).length,
    mastered: recordIds.filter((id) => isMastered(state, id)).length,
    total: recordIds.length,
  };
}
