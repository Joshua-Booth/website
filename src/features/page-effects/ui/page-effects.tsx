"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

import { startEffects } from "../model/run";
import { useHashFocus } from "./use-hash-focus";

export function PageEffects() {
  return <EffectsRun key={usePathname()} />;
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
    const site = layer?.closest<HTMLElement>(".site");

    if (!layer || !site) return;

    return startEffects(site, layer);
  }, []);

  useHashFocus();

  return <div className="fx" ref={fx} />;
}
