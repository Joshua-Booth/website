import type { CompiledStyles, StyleXArray } from "@stylexjs/stylex";

import * as stylex from "@stylexjs/stylex";

type Style = StyleXArray<CompiledStyles | boolean | null | undefined>;

export function sx(hook: string, ...styles: Style[]) {
  const props = stylex.props(...styles);

  return {
    ...props,
    className: [hook, props.className].filter(Boolean).join(" "),
  };
}
