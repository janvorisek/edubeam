import { ref } from 'vue';
import { useViewerStore } from '@/store/viewer';

/**
 * What a changelog entry can let the reader try at once.
 *
 * The entry only names one (`"tryIt": "diagramStyles"`); what it changes is decided here, so the
 * changelog file can never set arbitrary settings. Each returns how to put things back.
 */
const TRY_IT = {
  /** Hatched diagrams with the degree of each segment, on the bending moment. */
  diagramStyles: () => {
    const viewer = useViewerStore();
    const before = { style: { ...viewer.diagramStyle }, showBendingMoment: viewer.showBendingMoment };

    Object.assign(viewer.diagramStyle, { fill: 'hatch', showDegrees: true });
    viewer.showBendingMoment = true;

    return () => {
      Object.assign(viewer.diagramStyle, before.style);
      viewer.showBendingMoment = before.showBendingMoment;
    };
  },
  /** The new drawing, with hatched diagrams, as someone new starts with it. */
  newDrawing: () => {
    const viewer = useViewerStore();
    const before = { renderer: viewer.renderer, fill: viewer.diagramStyle.fill };

    viewer.renderer = 'plot';
    viewer.diagramStyle.fill = 'hatch';

    return () => {
      viewer.renderer = before.renderer;
      viewer.diagramStyle.fill = before.fill;
    };
  },
} satisfies Record<string, () => () => void>;

export type TryItId = keyof typeof TRY_IT;

/** Every feature there is to try: each has its notice, `dialogs.changelog.tried.<id>` */
export const TRY_IT_IDS = Object.keys(TRY_IT) as TryItId[];

export const isTryItId = (value: unknown): value is TryItId =>
  typeof value === 'string' && Object.hasOwn(TRY_IT, value);

/** The one tried last, while its notice offers to undo it. */
export const triedFeature = ref<{ id: TryItId; undo: () => void } | null>(null);

export const tryFeature = (id: TryItId) => {
  triedFeature.value = { id, undo: TRY_IT[id]() };
};

export const undoTriedFeature = () => {
  triedFeature.value?.undo();
  triedFeature.value = null;
};

/** Keeps what was tried; its notice goes. */
export const dismissTriedFeature = () => {
  triedFeature.value = null;
};
