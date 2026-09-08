<script setup lang="ts">
import { ref } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const updating = ref(false);

const { offlineReady, needRefresh } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker at: ${swUrl}`);

    if (!r) return;

    // 5 min periodic update, TODO: increase when we are more stable
    setInterval(() => r.update(), 5 * 60000);
  },
});

async function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}

/**
 * How long to wait for the new worker to take control before giving up on it.
 */
const TAKEOVER_TIMEOUT_MS = 8000;

/**
 * Tells the waiting worker to take over, against the registration itself.
 *
 * `updateServiceWorker(true)` only messages a worker that workbox-window put into waiting. One
 * that arrived any other way is "external" to it and the message goes nowhere - which is the
 * position every client is in until it has loaded an index.html without the register script that
 * used to be injected into it. Asking the registration directly works either way.
 *
 * Returns whether there was anything to hand over to.
 */
async function skipWaiting() {
  const registration = await navigator.serviceWorker?.getRegistration();

  if (!registration?.waiting) return false;

  registration.waiting.postMessage({ type: 'SKIP_WAITING' });

  return true;
}

async function update() {
  if (updating.value) return;
  updating.value = true;

  // The new worker taking control is what the reload has to wait for. Reloading before that just
  // loads the old app again, and leaves the same worker waiting - so this dialog comes straight
  // back, which is the loop this replaced.
  navigator.serviceWorker?.addEventListener('controllerchange', () => window.location.reload(), { once: true });

  try {
    if (!(await skipWaiting())) {
      // Nothing is waiting, so the prompt is stale; a plain reload is the whole update.
      window.location.reload();
      return;
    }
  } catch (err) {
    console.error('Error updating service worker:', err);
    updating.value = false;
    return;
  }

  /*
   * If it still has not taken control, the worker is stuck and no amount of reloading will move
   * it. Dropping the registration ends it for good: the page comes back uncontrolled and
   * registers the new worker from scratch. One unregister is better than a dialog that returns
   * on every load.
   */
  window.setTimeout(async () => {
    const registration = await navigator.serviceWorker?.getRegistration();

    await registration?.unregister();
    window.location.reload();
  }, TAKEOVER_TIMEOUT_MS);
}
</script>

<template>
  <v-dialog v-model="needRefresh" max-width="420" :persistent="updating">
    <v-card>
      <v-card-title> {{ $t('dialogs.update.title') }} </v-card-title>

      <v-card-text>
        <p>{{ $t('dialogs.update.text1') }}</p>

        <p class="mt-3">{{ $t('dialogs.update.text2') }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" :loading="updating" :disabled="updating" @click="update" @keydown.enter="update">
          {{ $t('dialogs.update.update') }}
        </v-btn>
        <v-btn color="red darken-1" :disabled="updating" @click="close()" @keydown.enter="close">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
