<script setup lang="ts">
import { axisConvention } from '@/utils/axisConvention';
import { useAppStore } from '@/store/app';

/**
 * The axes in the drawing's bottom left corner: which way x and the vertical axis point. A click
 * opens the settings where that is chosen, with the units. Above the drawing, not in the grid
 * under it, which every press on the drawing would reach first.
 */
const appStore = useAppStore();
const open = () => appStore.openSettings('lang');
</script>

<template>
  <button
    type="button"
    class="axes-helper"
    :title="$t('settings.axisConvention')"
    :aria-label="$t('settings.axisConvention')"
    @pointerdown.stop
    @click="open"
  >
    <!-- Drawn 40 units long and shown at 0.7 of that: 28 px arrows -->
    <svg width="48" height="48" viewBox="-12 -56 68 68" aria-hidden="true">
      <template v-if="axisConvention === 'y-up'">
        <text fill="red" text-anchor="middle" dy="0.35em" x="40" y="-10">x</text>
        <text fill="green" text-anchor="middle" dy="0.35em" x="10" y="-40">y</text>
        <line y1="0" x1="0" y2="-40" x2="0" stroke-width="3" stroke="green" stroke-linecap="round" />
        <line y1="0" x1="0" y2="0" x2="40" stroke-width="3" stroke="red" stroke-linecap="round" />
      </template>
      <template v-else>
        <text fill="red" text-anchor="middle" dy="0.35em" x="40" y="-30">x</text>
        <text fill="green" text-anchor="middle" dy="0.35em" x="10" y="0">z</text>
        <line y1="-40" x1="0" y2="0" x2="0" stroke-width="3" stroke="green" stroke-linecap="round" />
        <line y1="-40" x1="0" y2="-40" x2="40" stroke-width="3" stroke="red" stroke-linecap="round" />
      </template>
    </svg>
  </button>
</template>

<style scoped lang="scss">
/* Tucked into the corner, just inside the rulers */
.axes-helper {
  position: absolute;
  z-index: 100;
  left: 20px;
  bottom: 20px;
  display: block;
  padding: 0;
  border-radius: 8px;
  // A button does not take its font from the page; the letters as the grid drew them
  font: inherit;
  line-height: 0;
  cursor: pointer;
  transition: background-color 0.12s;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.06);
  }

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
  }
}
</style>
