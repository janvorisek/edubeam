<template>
  <v-dialog v-model="open" max-width="640">
    <v-card class="pa-1">
      <v-card-title>
        <div class="d-flex">
          <div class="flex-grow-1">{{ $t('sharing.shareViaURL') }}</div>
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            class="ml-1"
            :aria-label="$t('dialogs.common.cancel')"
            @click.prevent.stop="closeModal()"
          />
        </div>
      </v-card-title>
      <v-card-text class="pt-0">
        <p class="text-body-2 text-medium-emphasis mb-3">
          {{ $t('sharing.instructions') }}
        </p>
        <v-textarea
          v-model="val"
          readonly
          no-resize
          variant="outlined"
          hide-details
          class="share-textarea"
          @click="copyLink"
        >
          <template #append-inner>
            <v-tooltip :text="$t('sharing.copyCue')" location="bottom">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-content-copy"
                  variant="text"
                  color="primary"
                  :aria-label="$t('sharing.copyCue')"
                  @click.stop="copyLink"
                />
              </template>
            </v-tooltip>
          </template>
        </v-textarea>
        <textarea
          ref="clipboardHelper"
          class="sr-only"
          :value="val"
          aria-hidden="true"
          tabindex="-1"
          readonly
        ></textarea>
      </v-card-text>
      <v-divider />
      <v-card-actions class="share-actions d-flex flex-wrap">
        <v-btn variant="tonal" prepend-icon="mdi-content-copy" @click="copyLink">
          {{ $t('common.copy') }}
        </v-btn>
        <v-btn variant="text" prepend-icon="mdi-open-in-new" :href="val" target="_blank">
          {{ $t('sharing.openLink') }}
        </v-btn>
        <v-btn v-if="canUseNativeShare" variant="text" prepend-icon="mdi-share-variant" @click="shareViaSystem">
          {{ $t('sharing.nativeShare') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar
      v-model="feedbackVisible"
      :color="feedbackType === 'error' ? 'error' : 'primary'"
      timeout="2200"
      location="bottom"
    >
      <v-icon left size="x-small" class="mr-1">mdi-check</v-icon> {{ $t(feedbackMessage) }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { serializeModel } from '@/utils';
import { useProjectStore } from '@/store/project';

const open = ref(true);
const val = ref('');
const clipboardHelper = ref<HTMLTextAreaElement | null>(null);

type FeedbackType = 'success' | 'error';
type FeedbackMessage = 'sharing.linkCopied' | 'sharing.copyFailed';

const feedbackVisible = ref(false);
const feedbackType = ref<FeedbackType>('success');
const feedbackMessage = ref<FeedbackMessage>('sharing.linkCopied');

const canUseNativeShare =
  typeof window !== 'undefined' && typeof navigator !== 'undefined' && typeof navigator.share === 'function';

const shareMesh = () => {
  const projectStore = useProjectStore();
  const hash = serializeModel(projectStore.solver, projectStore.dimensions);

  const modelURL = new URL(window.location as unknown as URL);
  modelURL.searchParams.set('model', hash);

  val.value = modelURL.toString();
};

const showFeedback = (message: FeedbackMessage, type: FeedbackType) => {
  feedbackMessage.value = message;
  feedbackType.value = type;
  feedbackVisible.value = true;
};

const fallbackCopy = () => {
  if (typeof document === 'undefined' || !clipboardHelper.value) return false;
  clipboardHelper.value.focus();
  clipboardHelper.value.select();
  try {
    const copied = document.execCommand('copy');
    clipboardHelper.value.blur();
    return copied;
  } catch (error) {
    return false;
  }
};

const copyLink = async () => {
  if (!val.value) return;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(val.value);
    } else if (!fallbackCopy()) {
      throw new Error('Clipboard unavailable');
    }
    showFeedback('sharing.linkCopied', 'success');
  } catch (error) {
    const fallbackSucceeded = fallbackCopy();
    showFeedback(
      fallbackSucceeded ? 'sharing.linkCopied' : 'sharing.copyFailed',
      fallbackSucceeded ? 'success' : 'error'
    );
  }
};

const shareViaSystem = async () => {
  if (!val.value) return;
  if (!canUseNativeShare || typeof navigator === 'undefined') {
    await copyLink();
    return;
  }

  try {
    await navigator.share({ url: val.value });
  } catch (error) {
    if ((error as DOMException)?.name === 'AbortError') return;
    showFeedback('sharing.copyFailed', 'error');
  }
};

onMounted(() => {
  shareMesh();
});
</script>

<style lang="scss">
.share-textarea {
  cursor: pointer;

  textarea {
    padding: 8px 6px 0 6px !important;
  }

  .v-field {
    font-size: 12px !important;
    cursor: pointer;
  }
}

.share-actions {
  gap: 8px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
