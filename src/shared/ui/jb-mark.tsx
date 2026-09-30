import * as stylex from "@stylexjs/stylex";

import { xrayMarker } from "./markers.stylex";
import { colors } from "./tokens.stylex";

const styles = stylex.create({
  mark: {
    display: "block",
    width: "28.4px",
    height: "24.1px",
    fill: {
      default: "currentColor",
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: "none",
    },
    stroke: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: colors.ink,
    },
    strokeWidth: {
      default: null,
      [stylex.when.ancestor("[data-xray]", xrayMarker)]: 22,
    },
  },
});

export function JbMark() {
  return (
    <svg
      {...stylex.props(styles.mark)}
      viewBox="-71.7 -724.8 1099.4 932.3"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M62.5 -595.3V-724.8H266.9V-595.3ZM60 207.5Q41 207.5 17.2 205.3Q-6.7 203.1 -29.9 198.9Q-53 194.7 -71.7 189.7V74.3H-14Q23.3 74.3 42.9 54.5Q62.5 34.7 62.5 3V-527.8H266.9V6Q266.9 71.4 246.9 116.4Q226.8 161.4 181.6 184.4Q136.3 207.5 60 207.5Z" />
      <path
        d="M460.7 12Q401.3 12 347.2 -8.7Q293 -29.5 252.9 -82.2H244.2L228.3 0H62.5V-724.8H266.9V-467.7H275.4Q298.2 -493.7 330 -509.7Q361.7 -525.6 396.7 -532.7Q431.6 -539.8 462.8 -539.8Q541.5 -539.8 604.3 -510.2Q667 -480.5 703.9 -419.5Q740.7 -358.5 740.7 -263.8Q740.7 -169.5 703.8 -108.3Q666.8 -47.2 603.6 -17.6Q540.4 12 460.7 12ZM399.5 -134.9Q445.1 -134.9 474.7 -150.4Q504.4 -166 518.9 -193.5Q533.4 -220.9 533.4 -255.2V-272.5Q533.4 -306.9 518.9 -333.8Q504.4 -360.8 475 -376.8Q445.5 -392.9 399.9 -392.9Q365.6 -392.9 340.3 -383.2Q315.1 -373.4 298.5 -356.6Q281.9 -339.8 273.9 -317Q265.9 -294.2 265.9 -267V-260.5Q265.9 -225.2 280.1 -196.5Q294.3 -167.8 324.1 -151.3Q353.9 -134.9 399.5 -134.9Z"
        transform="translate(287 0)"
      />
    </svg>
  );
}
