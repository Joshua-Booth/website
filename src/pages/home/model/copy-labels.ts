const COPY_LABELS = ["Copy address", "Copied", "Selected"] as const;

export type CopyLabel = (typeof COPY_LABELS)[number];

export function copyLabels(current: CopyLabel) {
  return COPY_LABELS.map((text) => ({ text, hidden: text !== current }));
}
