type UnauthorizedSession = {
  store: object;
  requestToken: string | null;
  getToken: () => string | null;
  clearSession: () => void;
  notify: () => void;
  redirect: () => void;
};

/** Coalesce parallel 401s without invalidating a newer login or impersonation. */
export function createUnauthorizedSessionHandler() {
  const pending = new WeakMap<object, { token: string | null; timer?: ReturnType<typeof setTimeout> }>();

  return ({ store, requestToken, getToken, clearSession, notify, redirect }: UnauthorizedSession): void => {
    if (getToken() !== requestToken) return;

    const previous = pending.get(store);
    if (previous && (requestToken === null || previous.token === requestToken)) return;
    if (previous?.timer) clearTimeout(previous.timer);

    const transition = { token: requestToken, timer: undefined as ReturnType<typeof setTimeout> | undefined };
    pending.set(store, transition);
    clearSession();
    notify();

    transition.timer = setTimeout(() => {
      if (pending.get(store) !== transition) return;
      pending.delete(store);
      // The user may already have signed in again during the notification.
      if (getToken() === null) redirect();
    }, 3000);
  };
}
