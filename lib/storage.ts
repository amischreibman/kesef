import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PasswordEntry, Profile } from "./types";

const PROFILE_KEY = "kesef.profile.v1";
const ENTRIES_KEY = "kesef.entries.v1";

/**
 * On-device storage. Everything lives only on this phone (AsyncStorage) — the
 * app never talks to any server. A future stage will move the secrets behind
 * the device Keychain/Keystore and a biometric lock.
 */

export async function loadProfile(): Promise<Profile | null> {
  try {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([PROFILE_KEY, ENTRIES_KEY]);
}

export async function loadEntries(): Promise<PasswordEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(ENTRIES_KEY);
    return raw ? (JSON.parse(raw) as PasswordEntry[]) : [];
  } catch {
    return [];
  }
}

export async function saveEntries(entries: PasswordEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

/** Cheap unique id without external deps. */
export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
  );
}
