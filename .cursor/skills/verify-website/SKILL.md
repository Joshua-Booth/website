---
name: verify-website
description: "Drive the joshuabooth.nz static site in a browser and prove a user-facing feature. Use when changing pages, navigation, the Lab, case studies, or the contact copy button, and when you need a screenshot or accessibility snapshot as evidence."
---

# Verify joshuabooth.nz

The site is a static Next.js export. A visitor uses the pages in a browser. Markdown routes, `llms.txt`, and `llms-full.txt` are the same words for agents; this skill proves the pages.

Do not drive `mise run dev` or an existing preview on port 3000. Those processes are shared. This skill starts its own `serve` and its own browser, then kills only those processes.

## Launch

From the repo root, with Node from `.node-version` and pnpm from `mise.toml`:

```bash
pnpm install
pnpm exec playwright install chromium
export VERIFY_RUN_ID=verify-1
SITE_FLAGS=all mise run build
node .cursor/skills/verify-website/bin/verify-website.mjs launch
```

`SITE_FLAGS=all` is required. `mise run build` alone defaults `SITE_FLAGS` to `none`, which omits Lab, the PCOS Protocol case study, and "How this site is built". Launch refuses to start when `out/lab.html`, `out/work/pcos-protocol.html`, `out/writing/this-site.html`, or `out/404.html` is missing.

Ready when launch prints a line of the form `Accepting connections at http://127.0.0.1:<port>`, then `url`, `pid`, and `git`. The home page is open, the heading `Joshua Booth` is visible, and the page script has hydrated. The port is a free port unless you set `VERIFY_PORT`.

A second run needs a different `VERIFY_RUN_ID`. If it also sets `VERIFY_PORT`, use a different port. The helper will not attach to an instance it did not start.

There is no database and no seed. The pages are the build.

## Doctor

Run this before driving whenever something looks wrong:

```bash
node .cursor/skills/verify-website/bin/verify-website.mjs doctor
```

Every line must start with `ok`. Doctor checks, without clicking:

- the daemon pid is this helper's `daemon` process
- the serve pid is `serve` of this repo's `out/` directory
- that pid owns the printed port
- `git rev-parse HEAD` still matches the revision recorded at launch
- `GET /` is 200 and contains `Joshua Booth` and `lang="en-NZ"`
- `GET /lab`, `GET /work/pcos-protocol`, and `GET /writing/this-site` are 200
- `GET /not-a-real-page` is 404 and contains `Not`

A failed doctor means do not drive. Rebuild with `SITE_FLAGS=all mise run build`, clean up, and launch again.

## Drive

The helper holds one Chromium window per `VERIFY_RUN_ID`. It uses a 1280 by 900 viewport, dark color scheme, and `prefers-reduced-motion: reduce`, matching a visitor who has reduced motion on. Reduced motion shows the finished page. It does not prove the torch, the assemble motion, or the blueprint.

Commands, from the repo root:

```bash
node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /lab
node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "Work"
node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role heading --name "Contact"
node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-text --text "Chatbot"
node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-hidden --text "Duration input"
node .cursor/skills/verify-website/bin/verify-website.mjs browser pressed --role button --name "Details" --value "true"
node .cursor/skills/verify-website/bin/verify-website.mjs browser clipboard
node .cursor/skills/verify-website/bin/verify-website.mjs browser url
node .cursor/skills/verify-website/bin/verify-website.mjs browser snapshot --aria --selector "#contact" --path .cursor/skills/verify-website/artifacts/copy-address/contact.aria.txt
node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --selector "#contact" --path .cursor/skills/verify-website/artifacts/copy-address/contact.png
```

`--name` is the accessible name, matched exactly. Stable handles in this site:

- navigation `Main`
- home mark link `Joshua Booth, back to top`; other pages use `Joshua Booth, home`
- nav links `Work`, `Projects`, `Lab`, `Contact`
- headings `Joshua Booth`, `Work`, `Projects`, `Lab`, `Contact`, `PCOS Protocol`, `How this site is built`, `Not found`
- work link `The PCOS Nutritionist Case study`
- project link `This site How it's built`
- project link `Tax Calculator Try it (opens in a new tab)` and `Tax Calculator Code (opens in a new tab)`
- home Lab link `The lab`
- button `Copy address`, then `Copied`
- Lab group `Show` with buttons `All`, `Components`, `Experiments`, `Details`
- regions `#work`, `#projects`, `#lab`, `#contact`

Read `features/README.md` and the feature file before a journey. Do not follow a link whose name contains `opens in a new tab`. Prove that link from its accessible name and url in an ARIA snapshot.

## Evidence

Proof shows the action and the state after it. For a mutation, also read the side effect back.

- UI: an ARIA snapshot and a screenshot. The home heading `Joshua Booth`, or the page's own `h1`, must be visible in a full-page screenshot.
- Clipboard: `browser clipboard` must print `contact@joshuabooth.nz` after a successful copy. `Selected` means the clipboard write failed.
- HTTP: doctor output for the route under test.
- Record `VERIFY_RUN_ID`, the feature file, and the entry point in the note next to the artifacts.

Write proof only under `.cursor/skills/verify-website/artifacts/<feature>/`. That directory is gitignored. Cleanup does not delete it.

Do not call a test-only route. The site has none. Do not prove a page by reading `out/*.html` alone.

## Cleanup

```bash
node .cursor/skills/verify-website/bin/verify-website.mjs cleanup
```

Cleanup sends `SIGTERM` to the daemon pid stored for this `VERIFY_RUN_ID`, then to the serve pid if it is still alive. It deletes `/tmp/verify-website/$VERIFY_RUN_ID` only. It does not delete `.cursor/skills/verify-website/artifacts/`. Run it after a failed launch too, so the port and browser are not left behind.

## Helpers

`.cursor/skills/verify-website/bin/verify-website.mjs` is the harness. Invoke it with `node`, as the commands above do. It imports `playwright` from this repo's `node_modules`.

Subcommands are `launch`, `doctor`, `cleanup`, and `browser`. Browser actions are `goto`, `click`, `assert`, `assert-text`, `assert-hidden`, `pressed`, `snapshot`, `screenshot`, `clipboard`, and `url`. `assert` matches an accessible name. `assert-text` matches visible text when the element has no accessible name, such as a paragraph or a definition.
