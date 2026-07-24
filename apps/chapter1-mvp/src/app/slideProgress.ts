// Per-slide learning-progress model for the Slide Reader (see
// src/features/topics/SlideReader/SlideReader.tsx) — a UI display/progress
// preference only, stored client-side exactly like every other value in
// src/app/persistedState.ts, never a login, database, cloud state, grade,
// or analytics record (same scope as that module's own header comment).
//
// Distinct from Slides.tsx's existing "viewedRecordIds" (a plain string
// array recording only whether a slide's accordion panel was ever opened):
// this model additionally distinguishes explicit completion (the learner
// pressed "Mark as Completed") and reserves a `masteredAt` field for a
// future or current Quick Check success signal. It is never inferred from
// visibility alone — see markViewed/markCompleted below.
//
// Backward-compatible migration: a returning visitor's existing
// "viewedRecordIds" list (written by the pre-existing accordion, and still
// written by it going forward — this module never touches that key) is
// read once, on first computation of a topic's learning state, to seed
// `viewedAt` for every already-viewed slide. The legacy key itself is
// never cleared or rewritten by this module, so switching back to "View
// All Slides" (src/features/topics/Slides.tsx, unchanged) continues to
// work exactly as before.
import { readPersistedJSON, readPersistedStringArray, writePersistedJSON } from "./persistedState";

export interface SlideLearningState {
  viewedAt?: string;
  completedAt?: string;
  masteredAt?: string;
}

export type TopicLearningState = Record<string, SlideLearningState>;

interface PersistedLearningStateEnvelope {
  version: 1;
  records: TopicLearningState;
}

function isSlideLearningState(value: unknown): value is SlideLearningState {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  for (const key of ["viewedAt", "completedAt", "masteredAt"] as const) {
    if (key in obj && typeof obj[key] !== "string") return false;
  }
  return true;
}

function isPersistedLearningStateEnvelope(value: unknown): value is PersistedLearningStateEnvelope {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  if (obj.version !== 1) return false;
  if (typeof obj.records !== "object" || obj.records === null || Array.isArray(obj.records)) return false;
  return Object.values(obj.records as Record<string, unknown>).every(isSlideLearningState);
}

function learningStateKey(topicId: string): string {
  return `${topicId}.slides.learningState`;
}

/** The exact legacy key Slides.tsx already reads/writes — never modified here, only read for one-time migration. */
function legacyViewedKey(topicId: string): string {
  return `${topicId}.slides.viewedRecordIds`;
}

/**
 * Reads a topic's current learning state, migrating from the legacy
 * viewed-record-ids list the first time (i.e. whenever no
 * "<topicId>.slides.learningState" key has been written yet). Migration
 * only fills in `viewedAt` for already-viewed slides — it never invents a
 * `completedAt`/`masteredAt`, since the legacy accordion never tracked
 * either concept. The exact original view timestamp isn't recoverable
 * from the legacy list, so the migrated `viewedAt` is set to the moment
 * of migration — sufficient to preserve "this slide was already viewed"
 * for progress-percentage and navigator-badge purposes, which is the only
 * guarantee this migration promises.
 */
export function readTopicLearningState(topicId: string): TopicLearningState {
  const stored = readPersistedJSON<PersistedLearningStateEnvelope | null>(
    learningStateKey(topicId),
    null,
    (value): value is PersistedLearningStateEnvelope => value === null || isPersistedLearningStateEnvelope(value),
  );
  if (stored) return stored.records;

  const legacyViewedIds = readPersistedStringArray(legacyViewedKey(topicId), []);
  if (legacyViewedIds.length === 0) return {};
  const migratedAt = new Date().toISOString();
  const migrated: TopicLearningState = {};
  for (const recordId of legacyViewedIds) {
    migrated[recordId] = { viewedAt: migratedAt };
  }
  return migrated;
}

export function writeTopicLearningState(topicId: string, records: TopicLearningState): void {
  writePersistedJSON<PersistedLearningStateEnvelope>(learningStateKey(topicId), { version: 1, records });
}

/** Marks a slide viewed (idempotent — an already-viewed slide's original viewedAt is preserved, never overwritten by re-opening it). */
export function withViewed(state: TopicLearningState, recordId: string): TopicLearningState {
  if (state[recordId]?.viewedAt) return state;
  return { ...state, [recordId]: { ...state[recordId], viewedAt: new Date().toISOString() } };
}

/** Marks a slide explicitly completed — only ever called from the "Mark as Completed" control, never from navigation/visibility alone. */
export function withCompleted(state: TopicLearningState, recordId: string): TopicLearningState {
  return {
    ...state,
    [recordId]: { ...state[recordId], viewedAt: state[recordId]?.viewedAt ?? new Date().toISOString(), completedAt: new Date().toISOString() },
  };
}

/** Reverses explicit completion ("Mark as Incomplete") — leaves viewedAt/masteredAt untouched. */
export function withIncomplete(state: TopicLearningState, recordId: string): TopicLearningState {
  if (!state[recordId]) return state;
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
