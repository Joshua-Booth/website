import * as stylex from "@stylexjs/stylex";

import { visuallyHidden } from "./visually-hidden";

export function NewTabNote() {
  return (
    <span {...stylex.props(visuallyHidden.text)}> (opens in a new tab)</span>
  );
}
