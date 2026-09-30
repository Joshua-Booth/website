export function frameLoop(
  signal: AbortSignal,
  frame: (time: number) => boolean
) {
  let id = 0;

  const tick = (time: number) => {
    id = frame(time) ? requestAnimationFrame(tick) : 0;
  };

  signal.addEventListener(
    "abort",
    () => {
      cancelAnimationFrame(id);
    },
    { once: true }
  );

  return {
    start() {
      if (!id && !signal.aborted) id = requestAnimationFrame(tick);
    },
  };
}
