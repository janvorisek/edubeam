<script setup lang="ts">
/**
 * A checkbox in miniature, for a chip that switches something on: an outlined square, with a check
 * inside when it is on. Box and check are both drawn in the chip's text colour, so they read on a
 * tinted chip and on a filled one alike, and the box is the same size in both states.
 */
defineProps<{ on: boolean }>();
</script>

<template>
  <span class="chip-check" :class="{ 'chip-check--on': on }" />
</template>

<style scoped>
.chip-check {
  position: relative;
  display: inline-block;
  width: 11px;
  height: 11px;
  margin-right: 5px;
  flex: 0 0 auto;
  box-sizing: border-box;
  border: 1.5px solid currentColor;
  border-radius: 2px;
}

/* The check: a short-and-tall rectangle showing only its right and bottom edges, turned. */
.chip-check::after {
  content: '';
  position: absolute;
  left: 2.5px;
  top: 0;
  width: 3px;
  height: 6px;
  border: solid currentColor;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.12s;
}

.chip-check--on::after {
  opacity: 1;
}
</style>
