export const START_MINUTES = 85;
export const MIN_MINUTES = 5;
export const MAX_MINUTES = 600;

export const stepMinutes = (minutes: number, step: number) =>
  Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, minutes + step));

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return [h > 0 && `${h} h`, m > 0 && `${m} min`].filter(Boolean).join(" ");
}
