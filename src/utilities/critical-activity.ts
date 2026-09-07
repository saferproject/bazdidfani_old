const activities = new Set<symbol>();
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

/** Keep updates disabled until a write (including queued draft work) settles. */
export function beginCriticalActivity(): () => void {
  const activity = Symbol("critical-activity");
  activities.add(activity);
  notify();
  return () => {
    if (activities.delete(activity)) notify();
  };
}

export const hasCriticalActivity = () => activities.size > 0;

export function subscribeCriticalActivity(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export async function withCriticalActivity<T>(operation: () => Promise<T>): Promise<T> {
  const finish = beginCriticalActivity();
  try {
    return await operation();
  } finally {
    finish();
  }
}

/** Recheck at the actual reload boundary; activation can follow an upload start. */
export function whenCriticalActivityIdle(operation: () => void): () => void {
  let cancel = () => {};
  const check = () => {
    if (!hasCriticalActivity()) {
      cancel();
      operation();
    }
  };
  cancel = subscribeCriticalActivity(check);
  check();
  return cancel;
}
