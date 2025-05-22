<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker at: ${swUrl}`);
    {
      r &&
        setInterval(async () => {
          console.log('Checking for sw update');
          await r.update();
          console.log(needRefresh.value);
        }, 5 * 60000 /* 5 min periodic update, TODO: increase when we are more stable */);
    }
  },
});

async function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}

async function update() {
  updateServiceWorker(true).catch((err) => {
    console.error('Error updating service worker:', err);
  });
}
</script>

<template>
  <v-dialog v-model="needRefresh" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.update.title') }} </v-card-title>

      <v-card-text>
        <p>{{ $t('dialogs.update.text1') }}</p>

        <p class="mt-3">{{ $t('dialogs.update.text2') }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="update" @keydown.enter="update">
          {{ $t('dialogs.update.update') }}
        </v-btn>
        <v-btn color="red darken-1" @click="close()" @keydown.enter="close">{{ $t('dialogs.common.cancel') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
