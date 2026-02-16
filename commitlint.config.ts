import type { UserConfig } from "@commitlint/types";
import { gitmojis } from "gitmojis";

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

/**
 * Map of emoji → { code, description } from the official gitmoji list.
 * Used for validation and to provide helpful suggestions in error messages.
 * @see https://gitmoji.dev
 * @see https://github.com/carloscuesta/gitmoji
 */
const GITMOJI_MAP = new Map(
  gitmojis.map((g) => [g.emoji, { code: g.code, description: g.description }])
);

/**
 * Keyword → gitmoji mapping for suggesting the right emoji.
 * Each keyword maps to one or more gitmoji codes that are relevant.
 * Used to provide contextual suggestions when no gitmoji is found.
 */
const KEYWORD_SUGGESTIONS = new Map<string, string[]>([
  ["fix", [":bug:", ":adhesive_bandage:", ":ambulance:"]],
  ["bug", [":bug:", ":adhesive_bandage:"]],
  ["feat", [":sparkles:"]],
  ["feature", [":sparkles:"]],
  ["add", [":sparkles:", ":heavy_plus_sign:"]],
  ["new", [":sparkles:", ":tada:"]],
  ["remove", [":fire:", ":heavy_minus_sign:", ":coffin:"]],
  ["delete", [":fire:", ":heavy_minus_sign:", ":coffin:"]],
  ["refactor", [":recycle:"]],
  ["perf", [":zap:"]],
  ["performance", [":zap:"]],
  ["optimize", [":zap:"]],
  ["style", [":lipstick:", ":art:"]],
  ["ui", [":lipstick:"]],
  ["css", [":lipstick:"]],
  ["docs", [":memo:"]],
  ["document", [":memo:"]],
  ["readme", [":memo:"]],
  ["test", [":white_check_mark:", ":test_tube:"]],
  ["deploy", [":rocket:"]],
  ["release", [":bookmark:"]],
  ["version", [":bookmark:"]],
  ["security", [":lock:"]],
  ["lint", [":rotating_light:"]],
  ["warning", [":rotating_light:"]],
  ["ci", [":construction_worker:", ":green_heart:"]],
  ["config", [":wrench:"]],
  ["configure", [":wrench:"]],
  ["dependency", [":arrow_up:", ":arrow_down:", ":heavy_plus_sign:"]],
  ["upgrade", [":arrow_up:"]],
  ["downgrade", [":arrow_down:"]],
  ["type", [":label:"]],
  ["typo", [":pencil2:"]],
  ["move", [":truck:"]],
  ["rename", [":truck:"]],
  ["revert", [":rewind:"]],
  ["merge", [":twisted_rightwards_arrows:"]],
  ["break", [":boom:"]],
  ["breaking", [":boom:"]],
  ["access", [":wheelchair:"]],
  ["a11y", [":wheelchair:"]],
  ["responsive", [":iphone:"]],
  ["animation", [":dizzy:"]],
  ["i18n", [":globe_with_meridians:"]],
  ["locale", [":globe_with_meridians:"]],
  ["wip", [":construction:"]],
  ["progress", [":construction:"]],
  ["init", [":tada:"]],
  ["initial", [":tada:"]],
  ["begin", [":tada:"]],
  ["error", [":goal_net:", ":bug:"]],
  ["catch", [":goal_net:"]],
  ["log", [":loud_sound:", ":mute:"]],
  ["asset", [":bento:"]],
  ["image", [":bento:"]],
  ["db", [":card_file_box:"]],
  ["database", [":card_file_box:"]],
  ["auth", [":passport_control:"]],
  ["permission", [":passport_control:"]],
  ["seo", [":mag:"]],
  ["analytic", [":chart_with_upwards_trend:"]],
  ["track", [":chart_with_upwards_trend:"]],
  ["dead", [":coffin:"]],
  ["deprecate", [":wastebasket:"]],
  ["experiment", [":alembic:"]],
  ["dx", [":technologist:"]],
  ["developer", [":technologist:"]],
  ["validate", [":safety_vest:"]],
  ["validation", [":safety_vest:"]],
  ["architect", [":building_construction:"]],
  ["infra", [":bricks:"]],
  ["script", [":hammer:"]],
  ["health", [":stethoscope:"]],
  ["business", [":necktie:"]],
  ["logic", [":necktie:"]],
  ["text", [":speech_balloon:"]],
  ["literal", [":speech_balloon:"]],
  ["comment", [":bulb:"]],
  ["snapshot", [":camera_flash:"]],
  ["mock", [":clown_face:"]],
  ["gitignore", [":see_no_evil:"]],
  ["ignore", [":see_no_evil:"]],
  ["license", [":page_facing_up:"]],
  ["flag", [":triangular_flag_on_post:"]],
  ["seed", [":seedling:"]],
  ["secret", [":closed_lock_with_key:"]],
  ["contributor", [":busts_in_silhouette:"]],
  ["thread", [":thread:"]],
  ["concurrent", [":thread:"]],
  ["sponsor", [":money_with_wings:"]],
  ["offline", [":airplane:"]],
]);

/** Get the first grapheme (visual character) from a string. */
function firstGrapheme(text: string): string | undefined {
  return [...new Intl.Segmenter().segment(text)][0]?.segment;
}

/** Extract the subject text (everything after the emoji and space). */
function extractSubject(header: string): string {
  const segments = [...new Intl.Segmenter().segment(header)];
  return segments
    .slice(1)
    .map((s) => s.segment)
    .join("")
    .trim();
}

/** Format a gitmoji entry for display: "✨ :sparkles: — Introduce new features." */
function formatGitmoji(emoji: string): string {
  const info = GITMOJI_MAP.get(emoji);
  if (!info) return emoji;
  return `  ${emoji} ${info.code} — ${info.description}`;
}

/**
 * Find gitmoji suggestions based on keywords in the commit subject.
 * Returns formatted suggestion lines, or a default set of common gitmojis.
 */
function getSuggestions(subject: string): string {
  const words = subject.toLowerCase().split(/\s+/);
  const matchedCodes = new Set<string>();

  for (const word of words) {
    const codes = KEYWORD_SUGGESTIONS.get(word);
    if (codes) {
      for (const code of codes) matchedCodes.add(code);
    }
  }

  if (matchedCodes.size > 0) {
    const suggestions = gitmojis
      .filter((g) => matchedCodes.has(g.code))
      .slice(0, 5)
      .map((g) => `  ${g.emoji} ${g.code} — ${g.description}`);

    return ["Based on your message, try one of these:", ...suggestions].join(
      "\n"
    );
  }

  // Default: show the most commonly used gitmojis
  const commonCodes = new Set([
    ":sparkles:",
    ":bug:",
    ":recycle:",
    ":memo:",
    ":zap:",
    ":wrench:",
    ":lipstick:",
    ":white_check_mark:",
    ":fire:",
    ":adhesive_bandage:",
  ]);

  const defaults = gitmojis
    .filter((g) => commonCodes.has(g.code))
    .map((g) => `  ${g.emoji} ${g.code} — ${g.description}`);

  return [
    "Common gitmojis:",
    ...defaults,
    "",
    "Full list: https://gitmoji.dev",
  ].join("\n");
}

/** Imperative mood: maps non-imperative verb forms to their imperative. */
const IMPERATIVE_VERBS = new Map([
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

    /** Header must be 72 characters or fewer. */
    "function-rules/header-max-length": [
      ERROR,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        if (header.length > 72) {
          return [
            false,
            `Header must be 72 characters or fewer (currently ${String(header.length)})`,
          ];
        }
        return [true];
      },
    ],

    /** Commit must start with a valid gitmoji from the official list. */
    "function-rules/header-case": [
      ERROR,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        const emoji = firstGrapheme(header);

        if (!emoji || !GITMOJI_MAP.has(emoji)) {
          const subject = header.trim();
          const suggestions = getSuggestions(subject);

          return [
            false,
            `Commit must start with a gitmoji emoji.\n\n${suggestions}`,
          ];
        }

        return [true];
      },
    ],

    /** Subject must use imperative mood (e.g., "add" not "added"). */
    "function-rules/subject-case": [
      ERROR,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        const subject = extractSubject(header);
        if (!subject) return [true];

        const firstWord = subject.split(" ")[0].toLowerCase();
        const imperative = IMPERATIVE_VERBS.get(firstWord);

        if (imperative) {
          return [
            false,
            `Use imperative mood: "${firstWord}" → use "${imperative}" (e.g., "${imperative} feature" not "${firstWord} feature")`,
          ];
        }
        return [true];
      },
    ],

    /** Warn when subject contains "and", suggesting atomic commits. */
    "function-rules/scope-enum": [
      WARNING,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        // eslint-disable-next-line sonarjs/slow-regex -- simple word-boundary check, input is short commit subject
        if (/\s+and\s+/i.test(header) && !/-and-/i.test(header)) {
          return [
            false,
            'Consider splitting into atomic commits — subject contains "and" (suggests multiple changes)',
          ];
        }
        return [true];
      },
    ],

    /** Validate the gitmoji matches the commit content (suggestion only). */
    "function-rules/type-enum": [
      WARNING,
      "always",
      ({ header }: Commit): RuleResult => {
        if (!header) return [true];

        const emoji = firstGrapheme(header);
        if (!emoji || !GITMOJI_MAP.has(emoji)) return [true]; // handled by header-case rule

        const subject = extractSubject(header).toLowerCase();
        if (!subject) return [true];

        const info = GITMOJI_MAP.get(emoji);
        if (!info) return [true];

        // Check if any keyword in the subject suggests a different gitmoji
        const words = subject.split(/\s+/);
        const suggestedCodes = new Set<string>();

        for (const word of words) {
          const codes = KEYWORD_SUGGESTIONS.get(word);
          if (codes) {
            for (const code of codes) suggestedCodes.add(code);
          }
        }

        // If we found keyword matches and none of them match the used emoji, warn
        if (suggestedCodes.size > 0 && !suggestedCodes.has(info.code)) {
          const betterOptions = gitmojis
            .filter((g) => suggestedCodes.has(g.code))
            .slice(0, 3)
            .map((g) => formatGitmoji(g.emoji));

          // Only warn if the suggestion seems strong (exact action word match)
          const actionWords = new Set([
            "fix",
            "add",
            "remove",
            "delete",
            "refactor",
            "deploy",
            "release",
            "revert",
            "merge",
            "test",
            "upgrade",
            "downgrade",
          ]);
          const hasActionMatch = words.some((w) => actionWords.has(w));

          if (hasActionMatch) {
            return [
              false,
              `${emoji} ${info.code} means "${info.description}" — did you mean one of these?\n${betterOptions.join("\n")}`,
            ];
          }
        }

        return [true];
      },
    ],
  },
};

export default config;
