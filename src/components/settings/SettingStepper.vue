<template>
  <div class="setting-stepper" role="group" :aria-label="label">
    <v-btn
      icon="mdi-minus"
      size="x-small"
      variant="tonal"
      :disabled="modelValue <= min"
      :aria-label="`${label} −`"
      @click="change(-1)"
    />
    <span class="setting-stepper__value" aria-live="polite">{{ format(modelValue) }}</span>
    <v-btn
      icon="mdi-plus"
      size="x-small"
      variant="tonal"
      :disabled="modelValue >= max"
      :aria-label="`${label} +`"
      @click="change(1)"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: number;
    min: number;
    max: number;
    step: number;
    label?: string;
    format?: (value: number) => string;
  }>(),
  { label: '', format: (value: number) => String(value) }
);
const emit = defineEmits<{ 'update:modelValue': [value: number] }>();

/** Snapped to the step so repeated presses of a decimal step never drift to 0.30000000000000004. */
const change = (direction: 1 | -1) => {
  const next = Math.round((props.modelValue + direction * props.step) / props.step) * props.step;
  emit('update:modelValue', Math.min(props.max, Math.max(props.min, Number(next.toFixed(6)))));
};
</script>

<style scoped>
/* Pressing quickly is a double click, which would select the nearest word */
.setting-stepper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  user-select: none;
}

/*
 * Vuetify lets clicks through a disabled button, so at the limit a quick press would land on the
 * text underneath and select it. The button keeps them, and stays inert being disabled.
 */
.setting-stepper :deep(.v-btn--disabled) {
  pointer-events: auto;
  cursor: default;
}

.setting-stepper__value {
  min-width: 52px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
</style>
