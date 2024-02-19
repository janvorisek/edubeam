<template>
  <div style="display: grid; grid-template-columns: clamp(200px, 365px, 50%) clamp(200px, 365px, 50%)">
    <div>
      <h3 class="mb-2">{{ $t("settings.mouse.mouse") }}</h3>

      <v-select
        v-model="appStore.panButton"
        item-title="name"
        item-value="code"
        hide-details="auto"
        :items="[
          { name: $t('settings.mouse.wheel'), code: 4 },
          { name: $t('settings.mouse.right_button'), code: 2 },
        ]"
        :label="$t('settings.mouse.pan_button')"
      >
      </v-select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/store/app";
const appStore = useAppStore();
</script>
