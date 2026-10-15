interface Memory {
  built: Set<string>;
  pointer: { x: number; y: number } | null;
}

export const memory: Memory = {
  built: new Set(),
  pointer: null,
};
