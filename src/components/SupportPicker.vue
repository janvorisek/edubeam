<script setup lang="ts">
import { computed } from 'vue';
import SupportIcon from './SupportIcon.vue';
import { supportType, supportTypes, type SupportType } from '@/utils/supports';

/**
 * Named supports as icons, a shortcut beside the DOF checkboxes rather than a replacement for
 * them: a combination with no name just leaves every icon unpressed. `compact` folds the icons
 * into a menu behind the current one, for the nodes table.
 */
const props = defineProps<{ bcs: Set<number>; compact?: boolean }>();
const emit = defineEmits<{ select: [type: SupportType] }>();

const types = Object.keys(supportTypes) as SupportType[];
const current = computed(() => supportType(props.bcs));
</script>

<template>
  <v-menu v-if="compact" location="bottom">
    <template #activator="{ props: menu }">
      <button
        v-tooltip="{ text: $t(`supports.${current}`), location: 'top' }"
        v-bind="menu"
        type="button"
        class="support-select"
        :aria-label="$t(`supports.${current}`)"
      >
        <v-icon v-if="current === 'custom'" size="16" icon="mdi-tune-variant" />
        <SupportIcon v-else :type="current" :size="18" />
        <v-icon size="16" icon="mdi-menu-down" class="support-select-chevron" />
      </button>
    </template>
    <v-list density="compact" class="py-0">
      <v-list-item v-for="type in types" :key="type" :active="current === type" @click="emit('select', type)">
        <template #prepend>
          <SupportIcon :type="type" :size="20" class="mr-2" />
        </template>
        <v-list-item-title class="text-body-2">{{ $t(`supports.${type}`) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <div v-else class="d-flex flex-wrap ga-1" role="group" :aria-label="$t('nodes.defineSupports')">
    <v-btn
      v-for="type in types"
      :key="type"
      v-tooltip="{ text: $t(`supports.${type}`), location: 'top' }"
      :active="current === type"
      :color="current === type ? 'primary' : undefined"
      :aria-label="$t(`supports.${type}`)"
      :aria-pressed="current === type"
      variant="text"
      density="compact"
      size="small"
      icon
      @click="emit('select', type)"
    >
      <SupportIcon :type="type" :size="22" />
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
/* Boxed like the inputs beside it in the nodes table, with a chevron to say it opens a list. */
.support-select {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  height: 25px;
  padding: 0 1px 0 4px;
  background: #fff;
  border: thin solid #ddd;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;

  &:hover {
    border-color: #aaa;
  }
}

.support-select-chevron {
  color: gray;
}
</style>
