import { describe, it, expect, vi, afterEach } from 'vitest';
import { checkForUpdate } from '@/utils/serviceWorkerUpdate';

const setOnline = (online: boolean) =>
  Object.defineProperty(navigator, 'onLine', { value: online, configurable: true });
const setVisibility = (state: DocumentVisibilityState) =>
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });

describe('the periodic check for a new version', () => {
  afterEach(() => {
    setOnline(true);
    setVisibility('visible');
  });

  it('asks the registration for an update', async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    await checkForUpdate({ update });
    expect(update).toHaveBeenCalledOnce();
  });

  // Safari rejects with "TypeError: Internal error", Firefox with an InvalidStateError
  it('lets a failed check go instead of rejecting', async () => {
    const update = vi.fn().mockRejectedValue(new TypeError('Internal error'));
    await expect(checkForUpdate({ update })).resolves.toBeUndefined();
  });

  it('does not try while offline or in the background, where it can only fail', async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    setOnline(false);
    await checkForUpdate({ update });
    setOnline(true);
    setVisibility('hidden');
    await checkForUpdate({ update });
    expect(update).not.toHaveBeenCalled();
  });
});
