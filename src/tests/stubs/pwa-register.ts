import { ref } from 'vue';

/**
 * Stand-in for `virtual:pwa-register/vue`, which only exists when vite-plugin-pwa is in the
 * config - and it is not in the one vitest uses. Enough for a component that uses it to mount;
 * a test that cares about the registration replaces this with vi.mock.
 */
export const useRegisterSW = () => ({
  offlineReady: ref(false),
  needRefresh: ref(false),
  updateServiceWorker: async () => {},
});
