<template>
  <div
    class="axis-picker"
    :class="{ 'axis-picker--compact': compact }"
    role="radiogroup"
    :aria-label="$t('settings.axisConvention')"
  >
    <v-card
      v-for="option in options"
      :key="option.value"
      class="axis-picker__option"
      :class="{ 'axis-picker__option--active': modelValue === option.value }"
      variant="outlined"
      role="radio"
      :aria-checked="modelValue === option.value"
      :tabindex="radioTabIndex(values, option.value, modelValue)"
      @click="emit('update:modelValue', option.value)"
      @keydown="onRadioKeydown($event, values, option.value, (value) => emit('update:modelValue', value))"
    >
      <!-- Compact cards say which is chosen by their tint alone, like the cards beside them -->
      <v-icon
        v-if="!compact && modelValue === option.value"
        class="axis-picker__check"
        icon="mdi-check-circle"
        color="primary"
      />

      <svg class="axis-picker__drawing" viewBox="0 0 112 88" aria-hidden="true">
        <!-- Positive rotation, counter-clockwise in both systems -->
        <path :d="option.arc" class="axis-picker__rotation" />
        <polygon :points="option.arcHead" class="axis-picker__rotation-head" />
        <text :x="option.arcLabel[0]" :y="option.arcLabel[1]" class="axis-picker__label axis-picker__label--rotation">
          <tspan>+R</tspan>
          <tspan dy="3" font-size="9">{{ option.out }}</tspan>
        </text>

        <!-- Horizontal axis -->
        <line :x1="option.origin[0]" :y1="option.origin[1]" x2="92" :y2="option.origin[1]" class="axis-picker__x" />
        <polygon :points="head([100, option.origin[1]], [1, 0])" class="axis-picker__x-head" />
        <text x="100" :y="option.origin[1] + 14" class="axis-picker__label axis-picker__label--x">x</text>

        <!-- Vertical axis -->
        <line
          :x1="option.origin[0]"
          :y1="option.origin[1]"
          :x2="option.origin[0]"
          :y2="option.verticalTip[1] - 8 * option.verticalDir"
          class="axis-picker__v"
        />
        <polygon :points="head(option.verticalTip, [0, option.verticalDir])" class="axis-picker__v-head" />
        <text
          :x="option.origin[0] + 8"
          :y="option.verticalTip[1] + (option.verticalDir > 0 ? 0 : 8)"
          class="axis-picker__label axis-picker__label--v"
        >
          {{ option.vertical }}
        </text>

        <!-- Out-of-plane axis, toward the viewer -->
        <circle :cx="option.origin[0]" :cy="option.origin[1]" r="5" class="axis-picker__out" />
        <circle :cx="option.origin[0]" :cy="option.origin[1]" r="1.6" class="axis-picker__out-dot" />
        <text
          :x="option.origin[0] - 16"
          :y="option.origin[1] + (option.verticalDir > 0 ? -4 : 12)"
          class="axis-picker__label axis-picker__label--out"
        >
          {{ option.out }}
        </text>
      </svg>

      <div class="axis-picker__title">{{ option.title }}</div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { AxisConvention } from '@/utils/axisConvention';
import { onRadioKeydown, radioTabIndex } from '@/utils/radioGroup';

/** `compact` draws the axes smaller, for a dialog where the picker is one choice among several. */
defineProps<{ modelValue: AxisConvention; compact?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: AxisConvention] }>();

const { t } = useI18n();

const values: readonly AxisConvention[] = ['z-down', 'y-up'];

type Point = [number, number];

/** An arrowhead as polygon points, tip at `tip`, pointing along the unit vector `dir`. */
const head = (tip: Point, dir: Point, length = 8, halfWidth = 4) => {
  const [bx, by] = [tip[0] - dir[0] * length, tip[1] - dir[1] * length];
  const [nx, ny] = [-dir[1] * halfWidth, dir[0] * halfWidth];
  return `${tip[0]},${tip[1]} ${bx + nx},${by + ny} ${bx - nx},${by - ny}`;
};

/**
 * A counter-clockwise arc around `origin` between two angles, measured the mathematical way
 * (counter-clockwise from x, on a screen whose y grows downward), with its arrowhead at the end.
 */
const rotation = (origin: Point, radius: number, from: number, to: number) => {
  const at = (deg: number): Point => {
    const rad = (deg * Math.PI) / 180;
    return [origin[0] + radius * Math.cos(rad), origin[1] - radius * Math.sin(rad)];
  };
  const [start, end] = [at(from), at(to - 12)];
  const rad = (to * Math.PI) / 180;
  const tip = at(to);
  return {
    arc: `M${start[0]},${start[1]} A${radius},${radius} 0 0 0 ${end[0]},${end[1]}`,
    arcHead: head(tip, [-Math.sin(rad), -Math.cos(rad)], 7, 3.5),
  };
};

const options = computed(() => [
  {
    value: 'z-down' as const,
    title: t('settings.axisConvention_zDown'),
    origin: [30, 20] as Point,
    vertical: 'z',
    out: 'y',
    verticalDir: 1,
    verticalTip: [30, 82] as Point,
    ...rotation([30, 20], 26, -76, -14),
    arcLabel: [54, 52] as Point,
  },
  {
    value: 'y-up' as const,
    title: t('settings.axisConvention_yUp'),
    origin: [30, 68] as Point,
    vertical: 'y',
    out: 'z',
    verticalDir: -1,
    verticalTip: [30, 6] as Point,
    ...rotation([30, 68], 26, 14, 76),
    arcLabel: [56, 38] as Point,
  },
]);
</script>

<style scoped>
.axis-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.axis-picker__option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px 10px;
  border-color: rgba(var(--v-border-color), var(--v-border-opacity));
  cursor: pointer;
}

.axis-picker__option--active {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
  padding: 11px 7px 9px;
}

.axis-picker__option:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.axis-picker__check {
  position: absolute;
  top: 6px;
  right: 6px;
}

.axis-picker__drawing {
  width: 100%;
  max-width: 140px;
  height: auto;
}

.axis-picker--compact .axis-picker__option {
  padding: 8px 6px 6px;
}

.axis-picker--compact .axis-picker__option--active {
  padding: 7px 5px 5px;
  background: rgba(var(--v-theme-primary), 0.06);
}

.axis-picker--compact .axis-picker__drawing {
  max-width: 84px;
}

.axis-picker__title {
  margin-top: 6px;
  font-size: 0.875rem;
  text-align: center;
}

.axis-picker__x,
.axis-picker__v,
.axis-picker__out,
.axis-picker__rotation {
  fill: none;
  stroke-width: 2;
}

.axis-picker__x {
  stroke: #d32f2f;
}
.axis-picker__x-head,
.axis-picker__label--x {
  fill: #d32f2f;
}

.axis-picker__v {
  stroke: #2e7d32;
}
.axis-picker__v-head,
.axis-picker__label--v {
  fill: #2e7d32;
}

.axis-picker__out {
  stroke: #1565c0;
  fill: rgb(var(--v-theme-surface));
}
.axis-picker__out-dot,
.axis-picker__label--out {
  fill: #1565c0;
}

.axis-picker__rotation {
  stroke: rgba(var(--v-theme-on-surface), 0.6);
  stroke-width: 1.5;
}
.axis-picker__rotation-head,
.axis-picker__label--rotation {
  fill: rgba(var(--v-theme-on-surface), 0.7);
}

.axis-picker__label {
  font-size: 13px;
  font-weight: 600;
  font-style: italic;
}

.axis-picker__label--rotation {
  font-size: 11px;
  font-weight: 500;
}
</style>
