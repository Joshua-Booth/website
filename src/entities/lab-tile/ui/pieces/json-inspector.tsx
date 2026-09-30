import type { ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "@/shared/ui/tokens.stylex";

import { surface } from "../tile-tokens.stylex";

const styles = stylex.create({
  details: {
    marginLeft: "14px",
  },
  outer: {
    marginLeft: 0,
  },
  summary: {
    cursor: "pointer",
    listStyle: "none",
    "::-webkit-details-marker": { display: "none" },
    // ▸ when closed and ▾ when open, from the details it opens, not any open
    // one further out
    "::before": {
      content: { default: '"▸ "', ":is([open] > *)": '"▾ "' },
      color: surface.codeQuiet,
    },
  },
  line: {
    marginLeft: "14px",
  },
  key: { color: surface.codeKey },
  string: { color: surface.codeString },
  number: { color: colors.ink },
  quiet: { color: surface.codeQuiet },
});

function Branch({
  label,
  count,
  open,
  outer,
  children,
}: {
  label: string;
  count: string;
  open?: boolean;
  outer?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={open}
      {...stylex.props(styles.details, outer && styles.outer)}
    >
      <summary {...stylex.props(styles.summary)}>
        <span {...stylex.props(styles.key)}>{label}</span>{" "}
        <span {...stylex.props(styles.quiet)}>{count}</span>
      </summary>
      {children}
    </details>
  );
}

function Line({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.line)}>{children}</div>;
}

const Key = ({ children }: { children: ReactNode }) => (
  <span {...stylex.props(styles.key)}>{children}</span>
);

const Str = ({ children }: { children: ReactNode }) => (
  <span {...stylex.props(styles.string)}>&quot;{children}&quot;</span>
);

const Num = ({ children }: { children: ReactNode }) => (
  <span {...stylex.props(styles.number)}>{children}</span>
);

// Native disclosure, so it works without any script
export function JsonInspector() {
  return (
    <div>
      <Branch label="recipe" count="{4}" open outer>
        <Line>
          <Key>title</Key>: <Str>Pork buns</Str>
        </Line>
        <Line>
          <Key>serves</Key>: <Num>4</Num>
        </Line>
        <Branch label="steps" count="[5]">
          <Line>
            <Str>Make the dough</Str>
          </Line>
          <div {...stylex.props(styles.line, styles.quiet)}>…</div>
        </Branch>
        <Branch label="time" count="{2}" open>
          <Line>
            <Key>prep</Key>: <Num>40</Num>
          </Line>
          <Line>
            <Key>cook</Key>: <Num>25</Num>
          </Line>
        </Branch>
      </Branch>
    </div>
  );
}
