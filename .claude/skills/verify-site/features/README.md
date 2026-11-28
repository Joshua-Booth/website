# joshuabooth.nz verification map

The maintained source for checking what a visitor sees and does on the site. Read this, then the feature's file.

## Baseline preconditions

- A build from `SKILL.md` Launch, served from `out/` on a port you started, and the Doctor check passing.
- `SITE_FLAGS=none` unless the feature says otherwise.
- Chromium with reduced motion for anything measured after a scroll.

## Driving conventions

- Drive through what a visitor uses: links, buttons and the keyboard. No calls into React or the page's code.
- Prefer roles and names: `nav[aria-label="Main"]`, `aria-current="page"`, `aria-pressed`, section ids.
- Start each recipe from a fresh page load.

## Proof and skip reporting

- Capture the action and the state after it: the URL, the focused element, and a screenshot.
- Report a check you couldn't run with the command you tried and why. Don't count a different path as the same
  proof.

## Features

- [Home](./home.md): intro, project tiles, work, contact and copying the address.
- [Projects page](./projects.md): the full grid and its filters.
- [Header and in-page links](./header.md): Projects, Work, Contact and where focus goes.
- [Missing page](./not-found.md): the 404 page and its way back.
- [Markdown copies](./markdown.md): `index.md`, `projects.md`, `llms.txt` and `llms-full.txt`.
