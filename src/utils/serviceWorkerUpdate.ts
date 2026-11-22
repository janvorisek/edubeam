/**
 * A periodic check for a new version of the app, against the service worker's registration.
 *
 * `registration.update()` fetches the worker script again and rejects when it cannot: offline, or
 * while the page is in the background, where Safari answers "TypeError: Internal error" and Firefox
 * an InvalidStateError. Nothing is wrong then, and the next check comes in a few minutes, so a check
 * is skipped when it could only fail and a failed one is let go instead of becoming an unhandled
 * rejection (EDUBEAM-APP-7E, EDUBEAM-APP-FV).
 */
export const checkForUpdate = async (registration: Pick<ServiceWorkerRegistration, 'update'>): Promise<void> => {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return;
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;

  try {
    await registration.update();
  } catch {
    // A failed check is not an error: the next one is due in a few minutes
  }
};
