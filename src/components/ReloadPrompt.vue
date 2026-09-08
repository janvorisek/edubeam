<script setup lang="ts">
import { ref } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const updating = ref(false);

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
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
 * How long to wait for the new worker to take over before reloading anyway.
 *
 * `updateServiceWorker(true)` asks the waiting worker to skip waiting and reloads once it takes
 * control. If that never happens the dialog is persistent while updating, so the spinner is a dead
 * end - the page has to be reloaded by hand. Reloading ourselves is no worse than the update the
 * button promised, and it ends the wait.
 */
const TAKEOVER_TIMEOUT_MS = 8000;

async function update() {
  if (updating.value) return;
  updating.value = true;

  const fallback = window.setTimeout(() => window.location.reload(), TAKEOVER_TIMEOUT_MS);

  try {
    await updateServiceWorker(true);
  } catch (err) {
    window.clearTimeout(fallback);
    console.error('Error updating service worker:', err);
    updating.value = false;
  }
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
