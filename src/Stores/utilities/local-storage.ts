/** Storage may be unavailable in private browsing, embedded pages, or at quota. */
export function readLocalStorage(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: string): void {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {
    // Redux remains usable even when the browser cannot persist the session.
  }
}

export function removeLocalStorage(key: string): void {
  try {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  } catch {
    // Clearing in-memory state must not depend on storage availability.
  }
}

export function readLocalStorageJson<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => boolean,
): T {
  const stored = readLocalStorage(key);
  if (stored === null) return fallback;

  try {
    const value: unknown = JSON.parse(stored);
    return isValid(value) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}
