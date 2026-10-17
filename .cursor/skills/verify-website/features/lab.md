# Lab

Lab lists small interfaces and components, and filters them into Components, Experiments, and Details.

## Sub-features

- `lab-open` opens the Lab from the main navigation and from the home strip.
- `lab-all` shows every tile, with `All` pressed.
- `lab-components` shows component tiles and hides the others.
- `lab-experiments` shows the Width dial and hides component tiles.
- `lab-details` shows Overshoot and hides component tiles.

## How to get to it (user POV)

- Choose `Lab` in the main navigation.
- On the home page, choose `The lab` under the Lab strip.
- Open `/lab`.

## Driving it with verify-website

Preconditions:

- Doctor reports every line `ok`, including `GET /lab`.
- The filter group `Show` starts with `All` pressed.

- **Navigation entry.** From home, choose `Lab`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "Lab"`. The url path is `/lab`, the level 1 heading is `Lab`, and `Lab` in the navigation is the current page.
- **Strip entry.** Return home and choose `The lab`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "The lab"`. The url path is `/lab` again.
- **All tiles.** Confirm the starting filter. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser pressed --role button --name "All" --value "true"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role figure --name "Duration input Component"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role figure --name "Width dial Experiment"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role figure --name "Overshoot Detail · type"`. All three figures are visible.
- **Components.** Choose `Components`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role button --name "Components"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser pressed --role button --name "Components" --value "true"`. `Duration input` stays visible. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-hidden --text "Width dial"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-hidden --text "Overshoot"`. Those tiles are not visible.
- **Experiments.** Choose `Experiments`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role button --name "Experiments"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role figure --name "Width dial Experiment"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-hidden --text "Duration input"`. Only the experiment tile stays visible.
- **Details.** Choose `Details`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role button --name "Details"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role figure --name "Overshoot Detail · type"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-hidden --text "JSON inspector"`. Overshoot stays visible.
- **Proof.** Capture the Details filter. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser snapshot --aria --path .cursor/skills/verify-website/artifacts/lab/details.aria.txt` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --path .cursor/skills/verify-website/artifacts/lab/details.png`. Both show the heading `Lab`, pressed `Details`, and `Overshoot`.

## Gotchas

- The home strip is not the Lab page. `The lab` is the link that opens `/lab`. The nav link is named `Lab`.
- Hidden tiles stay in the page with the `hidden` attribute. A search of the HTML still finds them. Assert visibility.
- Day buttons inside Recurrence editor are named `Monday` through `Sunday`, not the single letters on them.
- A build without the lab flag has no `/lab` page. Doctor reports that. Do not replace this journey with the home strip.
