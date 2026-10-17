# Home

Home introduces Joshua Booth and lists his work, projects, a Lab strip, and ways to get in touch.

## Sub-features

- `home-identity` shows the name and the Auckland introduction.
- `home-work` lists Solve Data, stuff.co.nz, and The PCOS Nutritionist.
- `home-projects` lists This site, Tax Calculator, creact, and Audio Devotions.
- `home-lab` shows the Lab strip and a link to the Lab page.
- `home-contact` scrolls to the contact section from the main navigation.

## How to get to it (user POV)

- Open `/`.
- Choose `Joshua Booth, home` from the main navigation on any other page.
- Choose `Home` on the not-found page.

## Driving it with verify-website

Preconditions:

- Doctor reports every line `ok`.
- The build includes Lab, so the main navigation contains `Lab`.

- **Open home.** Go to the front page. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /`. The url path is `/` and a level 1 heading named `Joshua Booth` is visible.
- **Read the introduction.** Confirm the introduction. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-text --text "I'm an AI-native frontend engineer in Auckland. I design and build products from first concept to live in production."`. That sentence is visible.
- **Work rows.** Confirm the three employers. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role region --name "Work"`. The Work region contains `Solve Data`, `stuff.co.nz`, and a link named `The PCOS Nutritionist Case study`.
- **Project rows.** Confirm the four projects. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role link --name "This site How it's built"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role link --name "Tax Calculator Try it (opens in a new tab)"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role link --name "creact Code (opens in a new tab)"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role link --name "Audio Devotions Try it (opens in a new tab)"`. Each link is visible. Do not follow the ones that open a new tab.
- **Lab strip.** Jump to the strip. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "Lab"`. The url ends in `/lab`. Come back with `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role link --name "The lab"`.
- **Contact jump.** Choose `Contact` in the main navigation. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "Contact"`. The url ends in `#contact` and the heading `Contact` is visible.
- **Proof.** Capture the front page. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser snapshot --aria --path .cursor/skills/verify-website/artifacts/home/home.aria.txt` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --path .cursor/skills/verify-website/artifacts/home/home.png`. Both artifacts show `Joshua Booth`, `Work`, and `Contact`.

## Gotchas

- Solve Data and stuff.co.nz are text rows, not links. The PCOS Nutritionist row is the only Work link when the case study flag is on.
- `Tax Calculator Code (opens in a new tab)` is a separate link from `Try it`. Matching `Tax Calculator` alone is not exact.
- A build with `SITE_FLAGS=none` has no `Lab` nav link and no `The lab` link. Doctor fails that build. Do not skip the Lab checks to make home pass.
- The harness uses reduced motion, so the page is already finished when the heading appears.
