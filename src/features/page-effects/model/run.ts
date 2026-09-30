import { HERO } from "../lib/measure";
import { createStage } from "../lib/stage";
import { startAssemble } from "./assemble";
import { startBlueprint } from "./blueprint";
import { startBuild } from "./build";
import { lightAfterHero, startTorch } from "./torch";

export function startEffects(site: HTMLElement, fx: HTMLElement) {
  const run = new AbortController();

  function start() {
    if (run.signal.aborted) return;

    const stage = createStage(site, fx, run.signal);
    const heroBuilt = lightAfterHero(stage);

    startBlueprint(stage);
    startAssemble(stage);

    startBuild(stage, (name) => {
      if (name === HERO) heroBuilt();
    });

    startTorch(stage);
  }

  // Effects start once Archivo has loaded, so every measurement is of the real
  // type. After a route change the font is already there, so they start at
  // once, before the new page is painted
  if (document.fonts.status === "loaded") {
    start();
  } else {
    void document.fonts.ready.then(() => requestAnimationFrame(start));
  }

  return () => {
    run.abort();
    fx.replaceChildren();
  };
}
