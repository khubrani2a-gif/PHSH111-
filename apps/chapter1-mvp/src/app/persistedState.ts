// Small localStorage helper used only by the ch01-t01 (Fundamental
// Quantities) interactive presentation and the app-wide language toggle.
// MVP_IMPLEMENTATION_DECISIONS.json decision J originally scoped this
// MVP's state to session-local React state only, with no persistence
// across reloads. This module implements the formal, narrowly-scoped
// exception recorded in that same document's
// amendments[0] (ch01-mvp-implementation-decisions-001-amendment-001,
// 2026-07-19) — authorized for exactly: the active language, and (for
// ch01-t01 only) collapsible-section open/closed state and the
// review-card answer-reveal state. It still adds no login, database,
// cloud state, student progress, grades, or analytics of any kind.
//
// Guarded for environments with no `window`/`localStorage` (this app's
// Node-environment test suite, and privacy-mode browsers that throw on
// storage access) — every read/write falls back to a no-op default
// rather than throwing.

function isStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

const KEY_PREFIX = "phsh111:";

export function readPersistedBoolean(key: string, fallback: boolean): boolean {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return fallback;
    return raw === "true";
  } catch {
    return fallback;
  }
}

export function writePersistedBoolean(key: string, value: boolean): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEY_PREFIX + key, value ? "true" : "false");
  } catch {
    // Best-effort only — never throw for a non-essential UI preference.
  }
}

export function readPersistedString(key: string, fallback: string): string {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    return raw ?? fallback;
  } catch {
    return fallback;
  }
}

export function writePersistedString(key: string, value: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEY_PREFIX + key, value);
  } catch {
    // Best-effort only.
  }
}
