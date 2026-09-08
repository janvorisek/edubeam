import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import { i18n } from '@/plugins/i18n';
import ReloadPrompt from '@/components/ReloadPrompt.vue';

/**
 * The update button has to make the waiting worker take control before it reloads. Reloading first
 * loads the old app again and leaves the same worker waiting, so the prompt comes straight back on
 * the next load - a loop rather than an update. That is what a blind reload after a timeout did.
 *
 * It also cannot rely on `updateServiceWorker()`, which only messages a worker that workbox-window
 * itself put into waiting; one that arrived any other way is external to it and the message goes
 * nowhere.
 */
vi.mock('virtual:pwa-register/vue', () => ({
  useRegisterSW: () => ({ offlineReady: ref(false), needRefresh: ref(true), updateServiceWorker: vi.fn() }),
}));

const reload = vi.fn();
let controllerChange: (() => void) | null = null;

const withRegistration = (registration: unknown) => {
  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      getRegistration: async () => registration,
      addEventListener: (type: string, fn: () => void) => {
        if (type === 'controllerchange') controllerChange = fn;
      },
    },
    configurable: true,
  });
};

/** The dialog teleports out of the component, so its buttons are found in the document. */
const clickUpdate = async () => {
  document.body.innerHTML = '';

  const wrapper = mount(ReloadPrompt, {
    global: { plugins: [createVuetify({ components }), i18n] },
    attachTo: document.body,
  });

  await new Promise((r) => setTimeout(r, 0));

  const buttons = Array.from(document.querySelectorAll('button'));
  const update = buttons.find((b) => (b.textContent ?? '').trim().length > 0);

  expect(update, `no buttons rendered (found ${buttons.length})`).toBeTruthy();
  update!.click();
  await new Promise((r) => setTimeout(r, 0));

  return wrapper;
};

describe('the update button', () => {
  beforeEach(() => {
    reload.mockClear();
    controllerChange = null;
    Object.defineProperty(window, 'location', { value: { reload }, configurable: true, writable: true });
  });

  it('asks the waiting worker to take over, and waits for it', async () => {
    const waiting = { postMessage: vi.fn() };
    withRegistration({ waiting, unregister: vi.fn() });

    await clickUpdate();

    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    // reloading here would leave the same worker waiting and bring this dialog back
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads once the worker has taken control', async () => {
    withRegistration({ waiting: { postMessage: vi.fn() }, unregister: vi.fn() });

    await clickUpdate();
    controllerChange?.();

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('just reloads when nothing is waiting', async () => {
    withRegistration({ waiting: null, unregister: vi.fn() });

    await clickUpdate();

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
