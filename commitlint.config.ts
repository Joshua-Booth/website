import type { SyncRule, UserConfig } from "@commitlint/types";

import { RuleConfigSeverity } from "@commitlint/types";
import { gitmojis } from "gitmojis";

const GITMOJI_MAP = new Map(
  gitmojis.map((g) => [g.emoji, { code: g.code, description: g.description }])
);

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

function firstGrapheme(text: string): string | undefined {
  return [...new Intl.Segmenter().segment(text)][0]?.segment;
}

function extractSubject(header: string): string {
  const segments = [...new Intl.Segmenter().segment(header)];

  return segments
    .slice(1)
    .map((s) => s.segment)
    .join("")
    .trim();
}

function formatGitmoji(emoji: string): string {
  const info = GITMOJI_MAP.get(emoji);

  if (!info) return emoji;

  return `  ${emoji} ${info.code} — ${info.description}`;
}

function keywordCodes(subject: string): Set<string> {
  const codes = new Set<string>();

  for (const word of subject.toLowerCase().split(/\s+/)) {
    for (const code of KEYWORD_SUGGESTIONS.get(word) ?? []) codes.add(code);
  }

  return codes;
}

function getSuggestions(subject: string): string {
  const matchedCodes = keywordCodes(subject);

  if (matchedCodes.size > 0) {
    const suggestions = gitmojis
      .filter((g) => matchedCodes.has(g.code))
      .slice(0, 5)
      .map((g) => formatGitmoji(g.emoji));

    return ["Based on your message, try one of these:", ...suggestions].join(
      "\n"
    );
  }

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
    .map((g) => formatGitmoji(g.emoji));

  return [
    "Common gitmojis:",
    ...defaults,
    "",
    "Full list: https://gitmoji.dev",
  ].join("\n");
}

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

const gitmoji: SyncRule = ({ header }) => {
  const emoji = header ? firstGrapheme(header) : undefined;

  if (header && (!emoji || !GITMOJI_MAP.has(emoji))) {
    return [
      false,
      `Commit must start with a gitmoji emoji.\n\n${getSuggestions(header.trim())}`,
    ];
  }

  return [true];
};

const imperativeMood: SyncRule = ({ header }) => {
  const firstWord = (
    extractSubject(header ?? "").split(" ")[0] ?? ""
  ).toLowerCase();

  const imperative = IMPERATIVE_VERBS.get(firstWord);

  if (imperative) {
    return [
      false,
      `Use imperative mood: "${firstWord}" → use "${imperative}" (e.g., "${imperative} feature" not "${firstWord} feature")`,
    ];
  }

  return [true];
};

const lowercaseSubject: SyncRule = ({ header }) => {
  const subject = extractSubject(header ?? "");
  const first = subject.charAt(0);

  if (first !== first.toLowerCase()) {
    return [
      false,
      `Start the subject with a lowercase letter: "${first.toLowerCase()}${subject.slice(1)}"`,
    ];
  }

  return [true];
};

const atomicSubject: SyncRule = ({ header }) => {
  if (header && /\sand\s/i.test(header)) {
    return [
      false,
      'Consider splitting into atomic commits — subject contains "and" (suggests multiple changes)',
    ];
  }

  return [true];
};

const ACTION_WORDS = new Set([
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

const gitmojiFits: SyncRule = ({ header }) => {
  const emoji = header ? firstGrapheme(header) : undefined;
  const info = emoji ? GITMOJI_MAP.get(emoji) : undefined;

  if (!header || !emoji || !info) return [true];

  const subject = extractSubject(header).toLowerCase();
  const suggestedCodes = keywordCodes(subject);

  const hasActionMatch = subject
    .split(/\s+/)
    .some((word) => ACTION_WORDS.has(word));

  if (
    hasActionMatch &&
    suggestedCodes.size > 0 &&
    !suggestedCodes.has(info.code)
  ) {
    const betterOptions = gitmojis
      .filter((g) => suggestedCodes.has(g.code))
      .slice(0, 3)
      .map((g) => formatGitmoji(g.emoji));

    return [
      false,
      `${emoji} ${info.code} means "${info.description}" — did you mean one of these?\n${betterOptions.join("\n")}`,
    ];
  }

  return [true];
};

const { Error, Warning } = RuleConfigSeverity;

const config: UserConfig = {
  plugins: [
    {
      rules: {
        gitmoji,
        "imperative-mood": imperativeMood,
        "lowercase-subject": lowercaseSubject,
        "atomic-subject": atomicSubject,
        "gitmoji-fits": gitmojiFits,
      },
    },
  ],

  rules: {
    "header-max-length": [Error, "always", 72],
    "body-max-line-length": [Error, "always", 100],
    "body-leading-blank": [Error, "always"],
    "footer-max-line-length": [Error, "always", 100],
    "footer-leading-blank": [Error, "always"],
    gitmoji: [Error, "always"],
    "imperative-mood": [Error, "always"],
    "lowercase-subject": [Error, "always"],
    "atomic-subject": [Warning, "always"],
    "gitmoji-fits": [Warning, "always"],
  },
};

export default config;
