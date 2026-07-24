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

/**
 * Same narrow scope as the rest of this module (see header comment and
 * MVP_IMPLEMENTATION_DECISIONS.json amendments[1]) — used only for
 * ch01-t01's Slides accordion "viewed slide IDs" list, a UI display
 * preference (which slide headers have been opened at least once), never
 * treated as a completion, assessment, or analytics record.
 */
export function readPersistedStringArray(key: string, fallback: string[]): string[] {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((v) => typeof v === "string")
      ? (parsed as string[])
      : fallback;
  } catch {
    return fallback;
  }
}

export function writePersistedStringArray(key: string, value: string[]): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // Best-effort only.
  }
}

/**
 * Result of reading a nullable persisted value: whether anything was ever
 * stored under the key at all, distinct from what was stored. Needed
 * because `readPersistedString`'s empty-string fallback cannot tell "never
 * stored" apart from "explicitly stored as absent" — exactly the
 * distinction the Slides accordion's open/closed state needs (a fresh
 * visit defaults to a slide open; a visit where the user explicitly
 * collapsed everything must stay collapsed). Never encodes the absent
 * value as the literal string "null".
 */
export type PersistedNullableString = { present: false } | { present: true; value: string | null };

/**
 * Reads a small versioned `{ version, <field>: string | null }` JSON
 * envelope. Same narrow scope as the rest of this module — currently used
 * only for the Slides accordion's open-slide id. Any missing key,
 * malformed JSON, wrong version, or wrong-shaped value is treated as
 * "never stored" rather than thrown — a corrupted or previous-format value
 * must fall back safely, never crash.
 */
export function readPersistedNullableString(key: string, field: string): PersistedNullableString {
  if (!isStorageAvailable()) return { present: false };
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return { present: false };
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      (parsed as Record<string, unknown>).version === 1 &&
      field in parsed
    ) {
      const value = (parsed as Record<string, unknown>)[field];
      if (value === null || typeof value === "string") {
        return { present: true, value };
      }
    }
    return { present: false };
  } catch {
    return { present: false };
  }
}

/**
 * Writes the versioned envelope `readPersistedNullableString` reads back.
 * Explicitly stores `null` inside real JSON (`{"version":1,"<field>":null}`)
 * rather than ever serializing it as the literal text "null".
 */
export function writePersistedNullableString(key: string, field: string, value: string | null): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify({ version: 1, [field]: value }));
  } catch {
    // Best-effort only.
  }
}

/**
 * Generic guarded JSON read/write, for a UI-preference/progress value too
 * structured for the string/boolean/string-array helpers above (e.g. the
 * Slide Reader's per-slide viewed/completed/mastered timestamps — see
 * src/app/slideProgress.ts). `isValid` narrows the parsed `unknown` value;
 * any missing key, malformed JSON, or value that fails `isValid` is
 * treated as "never stored" and returns `fallback`, matching every other
 * helper in this module — a corrupted or previous-shape value must fall
 * back safely, never crash or silently coerce.
 */
export function readPersistedJSON<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writePersistedJSON<T>(key: string, value: T): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // Best-effort only.
  }
}
