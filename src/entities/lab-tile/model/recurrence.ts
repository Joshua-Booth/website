export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WEEKS = 2;

export const START_DAYS: readonly boolean[] = DAYS.map(
  (_, i) => i === 0 || i === 2
);

export function describeRecurrence(on: readonly boolean[]) {
  const days = DAYS.filter((_, i) => on[i]);
  const last = days.at(-1);

  if (!last) return "Pick at least one day";

  const list =
    days.length > 1 ? `${days.slice(0, -1).join(", ")} and ${last}` : last;

  return `Every ${WEEKS} weeks on ${list}`;
}

export const toggleDay = (on: readonly boolean[], i: number) =>
  on.map((v, j) => (j === i ? !v : v));
