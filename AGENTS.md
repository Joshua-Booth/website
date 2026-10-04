<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on this site

- No barrel files. Import from the file that defines the thing.
- The empty root `pages/` folder stops Next.js reading `src/pages` as the Pages Router. Keep it.
- Commits use gitmoji. See `.claude/CLAUDE.md` and `commitlint.config.ts`.

## Feature flags

Parts of the site are behind PostHog feature flags, listed in `src/shared/config/flags.ts`. Locally they're all
off. Set `SITE_FLAGS` to `all`, or a comma list of flag keys, to turn parts on, or leave it empty to ask PostHog.
Flags are read when the site is built, so set it for the build. The live site asks PostHog when Netlify builds it,
so a flag flipped in PostHog shows up after the next deploy. Netlify deploy previews turn every flag on.

## Audit

`mise run audit` checks overlaps, navigation and hover against a production build with every flag on:
`SITE_FLAGS=all mise run build && mise run preview`, then `AUDIT_URL=<the address it prints> mise run audit`.

## Analytics

PostHog starts only on `joshuabooth.nz`, so local builds, audits and deploy previews send no events.

## Design in Figma

The design system is the Figma file `A9t8vOArNk4Li3M9EVGykA`, and it's edited directly. Its old page-building
scripts are retired, because running them wipes everything edited by hand. Only the colour variables and text
styles still come from scripts, so copy any colour change in `src/shared/ui/tokens.stylex.ts` across to them.

For a new feature:

1. Try the options on a trial page named after the ticket, such as "JB-55 trial".
2. Build the chosen option on the site.
3. Fold it into the components on the Components page and the frames on the Templates page. Row links are the
   `Row link` component, so a change to the link look is one edit.
4. Trim the trial page to the chosen option, and note anything that changed while building it.
5. If the home page changed, refresh its captures.

### Refresh the captures

The Captures page holds `Home · 1440` and `Home · 390`, captured from the live site with Figma's
`generate_figma_design` tool and a Playwright browser:

1. Call `generate_figma_design` with the file key and the Captures page, `0:1`, to get a capture ID for each width.
2. In the browser, remove the site's Content-Security-Policy headers with `page.route`, as the tool suggests. Turn
   on reduced motion with `page.emulateMedia({ reducedMotion: "reduce" })`, or the rows are caught mid-animation.
3. At 1440 by 900, then 390 by 844, open `https://joshuabooth.nz/` and wait for `document.fonts.ready`, then 2.5
   seconds. Set `display: none` on every `.fx` element, or the x-ray covers the page.
4. Inject Figma's `capture.js` and call `window.figma.captureForDesign({ captureId, endpoint, selector: "body" })`
   without awaiting it, then wait about 10 seconds. Awaiting it can hang.
5. Poll `generate_figma_design` with the capture ID until it's done. Replace the old frame, and keep its name and
   position.
