import type { PasswordEntry, Profile } from "./types";

const PROFILE_KEY = "kesef.profile.v1";
const ENTRIES_KEY = "kesef.entries.v1";

/**
 * Small wrapper around localStorage. Everything is stored locally on the
 * device only — this is an offline, on-device password keeper. SSR-safe:
 * all functions no-op / return defaults when `window` is unavailable.
 */

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
  window.localStorage.removeItem(ENTRIES_KEY);
}

export function loadEntries(): PasswordEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as PasswordEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries: PasswordEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

/** Cheap unique id without external deps. */
export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  );
}
