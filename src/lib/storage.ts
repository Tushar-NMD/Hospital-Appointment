const isBrowser = typeof window !== "undefined";

export function getItem<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    console.warn(`Failed to read storage key: ${key}`);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): boolean {
  if (!isBrowser) return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn(`Failed to write storage key: ${key} — storage may be full`);
    return false;
  }
}

export function removeItem(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

export function clearAppStorage(): void {
  if (!isBrowser) return;
  Object.values(STORAGE_KEYS).forEach(removeItem);
}

export const STORAGE_KEYS = {
  USERS: "medcare_users",
  DOCTOR_PROFILES: "medcare_doctor_profiles",
  APPOINTMENTS: "medcare_appointments",
  CURRENT_USER: "medcare_current_user",
} as const;
