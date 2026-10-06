export const COPY_LABELS = ["Copy address", "Copied", "Selected"] as const;

export type CopyLabel = (typeof COPY_LABELS)[number];

/**
 * Every label, so the button can stack them all and keep the width of the
 * longest. Only the current one is shown and read out.
 */
export function copyLabels(current: CopyLabel) {
  return COPY_LABELS.map((text) => ({ text, hidden: text !== current }));
}
