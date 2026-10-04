import { cache } from "react";

import type { SiteFlags } from "@/shared/config/flags";
import { ALL_OFF, ALL_ON, FLAG_KEYS, flagsWhere } from "@/shared/config/flags";
import { POSTHOG } from "@/shared/config/site";

/**
 * Every visitor gets the same page, so the flags are asked for one fixed id.
 */
const DISTINCT_ID = "joshuabooth.nz";

export function flagsOverride(
  value = process.env.SITE_FLAGS
): SiteFlags | null {
  const v = value?.trim();

  if (!v) return null;
  if (v === "all") return ALL_ON;
  if (v === "none") return ALL_OFF;

  const on = new Set(v.split(",").map((s) => s.trim()));

  return flagsWhere((key) => on.has(key));
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * A failed request throws: the build fails and Netlify keeps the last good
 * deploy live instead of one with its flagged parts missing.
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

  const answer: unknown = await res.json();

  if (!isRecord(answer)) throw new Error("PostHog flags gave no answer");

  const flags = isRecord(answer.flags) ? answer.flags : {};

  return flagsWhere((key) => {
    const flag = flags[key];

    return isRecord(flag) && flag.enabled === true;
  });
});
