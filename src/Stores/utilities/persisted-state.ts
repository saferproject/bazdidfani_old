export function readPersistedState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const savedValue = window.sessionStorage.getItem(key);

    return savedValue ? (JSON.parse(savedValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writePersistedState<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures and continue with in-memory Redux state.
  }
}

export function removePersistedState(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage failures and continue with in-memory Redux state.
  }
}
