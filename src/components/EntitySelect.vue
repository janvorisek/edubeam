<script setup lang="ts">
import { computed, ref } from 'vue';

/**
 * A native select over the entities of the model - nodes, or elements - whose options are built
 * only once it is used.
 *
 * The tables in the bottom bar put one of these in every row, and a row is rendered again whenever
 * anything the table reads changes, the selection in the drawing included. Listing every entity in
 * every one of them costs rows x entities option elements on every such render, for lists nobody
 * has opened: clicking around a model of a few hundred elements spent most of a second per click
 * building them.
 */

type Entity = { label: string | number };

const props = defineProps<{
  modelValue: string | number;
  items: Entity[];
  /** Written before the label, so the options read as "Node 3" rather than "3". */
  prefix: string;
  /** Label to leave out - an element cannot start and end at the same node. */
  exclude?: string | number | null;
}>();

const emit = defineEmits<{ 'update:modelValue': [string | number] }>();

/**
 * Set by the press or the focus that is about to open the list. The browser opens it after the
 * event has been handled, and Vue has patched the options in by then, so the very first press
 * already gets the whole list.
 */
const used = ref(false);

const options = computed((): Entity[] => {
  // Closed: only what the select displays, which is the option it currently shows.
  if (!used.value) {
    const current = props.items.find((item) => item.label == props.modelValue);
    return [current ?? { label: props.modelValue }];
  }

  if (props.exclude === undefined || props.exclude === null) return props.items;

  return props.items.filter((item) => item.label != props.exclude);
});

/** A select answers with a string; the label it stands for is what the model is keyed by. */
const onChange = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value;
  const chosen = options.value.find((item) => String(item.label) === value);

  emit('update:modelValue', chosen ? chosen.label : value);
};
</script>

<template>
  <select
    class="mini-select flex-shrink-0"
    :value="props.modelValue"
    @focus="used = true"
    @pointerdown="used = true"
    @keydown="used = true"
    @change="onChange"
  >
    <option v-for="option in options" :key="option.label" :value="option.label">
      {{ `${props.prefix} ${option.label}` }}
    </option>
  </select>
</template>
