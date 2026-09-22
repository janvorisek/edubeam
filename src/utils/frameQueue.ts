/**
 * Keeps only the latest value until the next frame, then applies it once.
 *
 * A finger or a wheel reports far more often than the screen paints, and applying every report
 * costs a layout and a re-render that is never seen. Values are not queued: the newest one wins,
 * which is what a position is.
 */
export const frameQueue = <T>(apply: (value: T) => void) => {
  let pending: { value: T } | null = null;
  let frame = 0;

  const run = () => {
    frame = 0;

    const latest = pending;
    pending = null;

    if (latest) apply(latest.value);
  };

  return {
    schedule(value: T) {
      pending = { value };

      if (frame === 0) frame = requestAnimationFrame(run);
    },

    cancel() {
      if (frame !== 0) cancelAnimationFrame(frame);

      frame = 0;
      pending = null;
    },
  };
};
