import { cache } from "react";

import type { SiteFlags } from "@/shared/config/flags";
import { ALL_OFF, ALL_ON, FLAG_KEYS, flagsWhere } from "@/shared/config/flags";
import { POSTHOG } from "@/shared/config/site";

/**
 * Every visitor gets the same page, so the flags are asked for one fixed id.
 */
const DISTINCT_ID = "joshuabooth.nz";

const FLAG_NAMES: readonly string[] = Object.values(FLAG_KEYS);

export function flagsOverride(
  value = process.env.SITE_FLAGS
): SiteFlags | null {
  const v = value?.trim();

  if (!v) return null;
  if (v === "all") return ALL_ON;
  if (v === "none") return ALL_OFF;

  const on = new Set(
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );

  const unknown = [...on].filter((key) => !FLAG_NAMES.includes(key));

  if (unknown.length > 0) {
    throw new Error(
      `SITE_FLAGS names unknown flags: ${unknown.join(", ")}. Use all, none or a comma list of ${FLAG_NAMES.join(", ")}`
    );
  }

  return flagsWhere((key) => on.has(key));
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Reads PostHog's answer. It leaves out flags that are off or deleted, so a
 * missing flag is off, but an answer it can't read, or one PostHog says has
 * errors, throws.
 */
function parseFlags(answer: unknown): SiteFlags {
  if (!isRecord(answer) || !isRecord(answer.flags)) {
    throw new Error("PostHog flags gave no answer");
  }

  if (answer.errorsWhileComputingFlags === true) {
    throw new Error("PostHog had errors working out the flags");
  }

  if (
    Array.isArray(answer.quotaLimited) &&
    answer.quotaLimited.includes("feature_flags")
  ) {
    throw new Error("PostHog's feature flag quota is used up");
  }

  const { flags } = answer;

  return flagsWhere((key) => {
    const flag = flags[key];

    if (flag === undefined) return false;

    if (!isRecord(flag) || typeof flag.enabled !== "boolean") {
      throw new Error(`PostHog's answer for the ${key} flag can't be read`);
    }

    return flag.enabled;
  });
}

/**
 * A failed request or an unreadable answer throws: the build fails and
 * Netlify keeps the last good deploy live instead of one with its flagged
 * parts missing.
 */
export const getSiteFlags = cache(async (): Promise<SiteFlags> => {
  const override = flagsOverride();

  if (override) return override;

  const res = await fetch(`${POSTHOG.host}/flags?v=2`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: POSTHOG.key,
      distinct_id: DISTINCT_ID,
      flag_keys_to_evaluate: Object.values(FLAG_KEYS),
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) throw new Error(`PostHog flags returned ${res.status}`);

  return parseFlags(await res.json());
});
