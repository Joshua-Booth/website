export const COPY_RESET_MS = 1600;

const COPY_LABELS = ["Copy address", "Copied", "Selected"] as const;

export type CopyLabel = (typeof COPY_LABELS)[number];

export type CopyStatus = Exclude<CopyLabel, "Copy address">;

export function copyLabels(current: CopyLabel) {
  return COPY_LABELS.map((text) => ({ text, hidden: text !== current }));
}
