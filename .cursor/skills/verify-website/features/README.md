# joshuabooth.nz verification map

This directory is the maintained source for verifying the user-facing behavior of joshuabooth.nz. Read the index before driving the site, then use the matching feature file as the recipe.

## Baseline preconditions

- Build with `SITE_FLAGS=all mise run build` so Lab, PCOS Protocol, and "How this site is built" exist.
- Launch with `VERIFY_RUN_ID` set. The ready line is `Accepting connections at http://127.0.0.1:<port>`.
- Run `node .cursor/skills/verify-website/bin/verify-website.mjs doctor` and require every line to start with `ok`.
- Never drive an instance that was not started by this verification run.
- The harness turns on reduced motion. Prove the finished page, not the torch or the assemble motion.

## Driving conventions

- Start every recipe from the home page unless its preconditions say otherwise.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position. `#contact` is the exception the copy proof uses for a cropped screenshot.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Run browser actions through `node .cursor/skills/verify-website/bin/verify-website.mjs browser`.
- Do not follow a link whose accessible name contains `opens in a new tab`.
- Leave proof files in `.cursor/skills/verify-website/artifacts/`. Cleanup removes the server and browser only.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes an ARIA snapshot and a screenshot with the page heading visible.
- Copy proof includes the clipboard text read back after the click.
- Record the feature id and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with verify-website` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Home](./home.md) covers the introduction, Work, Projects, the Lab strip, and jumping to Contact.
- [Copy address](./copy-address.md) covers copying contact@joshuabooth.nz from the contact section.
- [Lab](./lab.md) covers opening the Lab and filtering Components, Experiments, and Details.
- [PCOS Protocol](./pcos-protocol.md) covers opening the case study from Work and returning to that row.
- [How this site is built](./this-site.md) covers opening the write-up from Projects and returning to that row.
