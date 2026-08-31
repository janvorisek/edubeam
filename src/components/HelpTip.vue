<template>
  <v-menu
    v-model="open"
    :open-on-hover="hasHover"
    :open-on-click="!hasHover"
    :close-on-content-click="false"
    :location="location"
    :open-delay="150"
    :close-delay="150"
    max-width="320"
  >
    <template #activator="{ props: activator }">
      <v-btn
        v-bind="activator"
        class="help-tip"
        :class="[`help-tip--${align}`, { 'help-tip--active': open }]"
        icon="mdi-help-circle-outline"
        :size="size"
        variant="text"
        :aria-label="$t('help.aria')"
        @click.stop
      />
    </template>

    <v-card class="help-tip__card" max-width="320">
      <v-card-text class="pb-1">
        <div class="text-body-2 font-weight-medium mb-1">{{ $t(topicDef.title) }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ $t(topicDef.body) }}</div>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn
          variant="text"
          size="small"
          color="primary"
          :href="href"
          target="_blank"
          rel="noopener"
          append-icon="mdi-open-in-new"
          @click="onReadMore"
        >
          {{ $t('help.readMore') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { helpTopics, type HelpTopicKey } from '@/utils/helpTopics';
import { docsUrl, trackDocsClick } from '@/utils/docs';

/**
 * `text` optically centers the icon against an adjacent text label, `center` centers it
 * on the line box, which is what you want next to other icon buttons.
 */
type TipAlign = 'text' | 'center';

/** Subset of Vuetify anchors used by the help icons. */
type TipLocation = 'top' | 'bottom' | 'start' | 'end' | 'top left' | 'top end' | 'bottom start' | 'bottom end';

const props = withDefaults(
  defineProps<{
    topic: HelpTopicKey;
    location?: TipLocation;
    size?: string;
    align?: TipAlign;
  }>(),
  { location: 'bottom', size: 'x-small', align: 'text' }
);

const open = ref(false);

// Touch devices never fire hover, there the icon has to be tapped.
const hasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

const topicDef = computed(() => helpTopics[props.topic]);
const href = computed(() => docsUrl(topicDef.value.path, props.topic));

const onReadMore = () => {
  trackDocsClick(props.topic);
  open.value = false;
};
</script>

<style lang="scss">
.help-tip {
  opacity: 0.6;

  // A box centered icon reads as too high next to text, whose ink sits below the
  // middle of the line box. Nudge it onto the optical centre of the label.
  &.help-tip--text {
    position: relative;
    top: 1.5px;
  }

  &:hover,
  &:focus-visible,
  &.help-tip--active {
    opacity: 1;
  }
}

.help-tip__card {
  // The popover is informative, it should never grab attention from the dialog below it.
  font-size: 13px;
}
</style>
