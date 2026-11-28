# Home

The home page introduces Josh as a design engineer, shows the project tiles with their links, lists his work, and
gives the email address with a button that copies it.

## Sub-features

- `home-intro`: name, "Design engineer, Auckland" and "I design and build interfaces."
- `home-tiles`: project tiles in showcase order, each with its picture and links.
- `home-work`: the work list with roles and years.
- `home-copy`: Copy address copies the email and says so.

## How to get to it (user POV)

- Open `/`.
- Click the name in the header from any other page.

## Driving it with Playwright

Preconditions: a build, served.

- Intro: load `/`. `h1` reads "Joshua Booth", and the page has "Design engineer, Auckland" and
  "I design and build interfaces.". `<meta name="description">` says design engineer.
- Tiles: each tile's `img` has `naturalWidth > 0` after scrolling to it. Its links open in a new tab and their
  names end "(opens in a new tab)".
- Copy: grant `clipboard-read` and `clipboard-write`, click the button named "Copy address", then read the
  clipboard. It holds the address and the button shows "Copied".
- Run `mise run audit` for layout, focus and hover across widths.

## Gotchas

- The tile pictures load lazily. Scroll the page before checking images or taking a full-page screenshot.
- The copy button keeps every label in one grid cell, hidden but measured, so its text content includes all three.
  Read its accessible name, not `textContent`.
