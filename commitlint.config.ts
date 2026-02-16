import type { UserConfig } from "@commitlint/types";

interface Commit {
  type: string | null;
  scope: string | null;
  subject: string | null;
  header: string | null;
  body: string | null;
  footer: string | null;
}

type RuleResult = [boolean] | [boolean, string];

const ERROR = 2;
const WARNING = 1;

// Official gitmoji emoji list (subset of most commonly used)
const GITMOJI = new Set([
  "🎨",
  "⚡",
  "🔥",
  "🐛",
  "🚑",
  "✨",
  "📝",
  "🚀",
  "💄",
  "🎉",
  "✅",
  "🔒",
  "🔐",
  "🔖",
  "🚨",
  "🚧",
  "💚",
  "⬇️",
  "⬆️",
  "📌",
  "👷",
  "📈",
  "♻️",
  "➕",
  "➖",
  "🔧",
  "🔨",
  "🌐",
  "✏️",
  "💩",
  "⏪",
  "🔀",
  "📦",
  "👽",
  "🚚",
  "📄",
  "💥",
  "🍱",
  "♿",
  "💡",
  "🍻",
  "💬",
  "🗃️",
  "🔊",
  "🔇",
  "👥",
  "🚸",
  "🏗️",
  "📱",
  "🤡",
  "🥚",
  "🙈",
  "📸",
  "⚗️",
  "🔍",
  "🏷️",
  "🌱",
  "🚩",
  "🥅",
  "💫",
  "🗑️",
  "🛂",
  "🩹",
  "🧐",
  "⚰️",
  "🧪",
  "👔",
  "🩺",
  "🧱",
  "🧑‍💻",
  "💸",
  "🧵",
  "🦺",
]);

const config: UserConfig = {
  plugins: ["commitlint-plugin-function-rules"],

  rules: {
    // Disable conventional commit rules (gitmoji replaces type/scope)
    "type-enum": [0],
    "type-case": [0],
    "type-empty": [0],
    "scope-enum": [0],
    "scope-case": [0],
    "scope-empty": [0],
    "subject-empty": [0],
    "subject-case": [0],
    "subject-full-stop": [0],
    "subject-min-length": [0],
    "subject-max-length": [0],
    "header-case": [0],
    "header-full-stop": [0],
    "header-max-length": [0],
    "body-case": [0],

    // Body/footer formatting
    "body-max-line-length": [ERROR, "always", 100],
    "body-leading-blank": [ERROR, "always"],
    "footer-max-line-length": [ERROR, "always", 100],
    "footer-leading-blank": [ERROR, "always"],

    /**
     * Validate commit starts with a gitmoji emoji.
     * @param root0
     * @param root0.header
     */
    "function-rules/header-max-length": [
      ERROR,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        // Check header length (72 chars)
        if (header.length > 72) {
          return [
            false,
            `Header must be 72 characters or fewer (currently ${String(header.length)})`,
          ];
        }
        return [true];
      },
    ],

    /**
     * Validate commit starts with a valid gitmoji.
     * @param root0
     * @param root0.header
     */
    "function-rules/header-case": [
      ERROR,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        // Extract first character(s) — emoji can be 1-2 code points
        const segments = [...new Intl.Segmenter().segment(header)];
        const firstGrapheme = segments[0]?.segment;

        if (!firstGrapheme || !GITMOJI.has(firstGrapheme)) {
          return [
            false,
            "Commit must start with a gitmoji emoji (e.g., ✨ for new feature, 🐛 for bug fix). See https://gitmoji.dev",
          ];
        }
        return [true];
      },
    ],

    /**
     * Imperative mood enforcement.
     * @param root0
     * @param root0.header
     */
    "function-rules/subject-case": [
      ERROR,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        // Extract subject (text after emoji and space)
        const segments = [...new Intl.Segmenter().segment(header)];
        const subject = segments
          .slice(1)
          .map((s) => s.segment)
          .join("")
          .trim();
        if (!subject) return [true];

        const firstWord = subject.split(" ")[0].toLowerCase();

        const verbMap = new Map([
          ["adds", "add"],
          ["added", "add"],
          ["adding", "add"],
          ["fixes", "fix"],
          ["fixed", "fix"],
          ["fixing", "fix"],
          ["updates", "update"],
          ["updated", "update"],
          ["updating", "update"],
          ["removes", "remove"],
          ["removed", "remove"],
          ["removing", "remove"],
          ["changes", "change"],
          ["changed", "change"],
          ["changing", "change"],
          ["creates", "create"],
          ["created", "create"],
          ["creating", "create"],
          ["implements", "implement"],
          ["implemented", "implement"],
          ["implementing", "implement"],
          ["moves", "move"],
          ["moved", "move"],
          ["moving", "move"],
          ["renames", "rename"],
          ["renamed", "rename"],
          ["renaming", "rename"],
          ["deletes", "delete"],
          ["deleted", "delete"],
          ["deleting", "delete"],
          ["improves", "improve"],
          ["improved", "improve"],
          ["improving", "improve"],
          ["refactors", "refactor"],
          ["refactored", "refactor"],
          ["refactoring", "refactor"],
        ]);

        if (verbMap.has(firstWord)) {
          const imperative = verbMap.get(firstWord) ?? firstWord;
          return [
            false,
            `Use imperative mood: "${firstWord}" -> use "${imperative}" (e.g., "add feature" not "added feature")`,
          ];
        }
        return [true];
      },
    ],

    /**
     * Atomic commit warning - detect "and" suggesting multiple changes.
     * @param root0
     * @param root0.header
     */
    "function-rules/scope-enum": [
      WARNING,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        // eslint-disable-next-line sonarjs/slow-regex -- simple word-boundary check, input is short commit subject
        if (/\s+and\s+/i.test(header) && !/-and-/i.test(header)) {
          return [
            false,
            'Consider splitting into atomic commits - subject contains "and" (suggests multiple changes)',
          ];
        }
        return [true];
      },
    ],
  },
};

export default config;
