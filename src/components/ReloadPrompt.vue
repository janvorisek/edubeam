<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker at: ${swUrl}`);
    {
      r &&
        setInterval(async () => {
          console.log("Checking for sw update");
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
  updateServiceWorker(true);
}
</script>

<template>
  <v-dialog v-model="needRefresh" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.update.title") }} </v-card-title>

      <v-card-text>
        <p>{{ $t("dialogs.update.text1") }}</p>

        <p class="mt-3">{{ $t("dialogs.update.text2") }}</p>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="update" @keydown.enter="update">
          {{ $t("dialogs.update.update") }}
        </v-btn>
        <v-btn color="red darken-1" @click="close()" @keydown.enter="close">{{ $t("dialogs.common.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0px #8885;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
