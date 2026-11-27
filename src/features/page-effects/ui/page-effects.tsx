"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

import { HOOK } from "@/shared/config/effect-hooks";

import { startEffects } from "../model/run";
import { useHashFocus, useSectionFocus } from "./use-hash-focus";

export function PageEffects() {
  return <EffectsRun key={usePathname()} />;
}

/**
 * The white look has no x-ray or covers, but a link to a button or link on
 * the page still moves focus to it, and a link to a section moves focus there.
 */
export function HashFocus() {
  return <HashFocusRun key={usePathname()} />;
}

function HashFocusRun() {
  useHashFocus();
  useSectionFocus();

  return null;
}

/**
 * Holds the overlays, as the last thing inside `.site`. React renders it empty
 * and never looks inside, so it leaves them alone. It isn't positioned, so
 * overlays measure from `.site`. The effects start in a layout effect, so a new
 * page's covers are on before it's painted.
 */
function EffectsRun() {
  const fx = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layer = fx.current;
    const site = layer?.closest<HTMLElement>(`.${HOOK.site}`);

    if (!layer || !site) return;

    return startEffects(site, layer);
  }, []);

  useHashFocus();

  return <div className={HOOK.fx} ref={fx} />;
}
