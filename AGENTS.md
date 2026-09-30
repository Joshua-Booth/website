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
Flags are read when a page is built, so set it for the build and the preview. Netlify deploy previews turn every
flag on.

## Audit

`mise run audit` checks overlaps, navigation and hover against a production build with every flag on:
`SITE_FLAGS=all mise run build && SITE_FLAGS=all mise run preview`, then `mise run audit`.

## Analytics

PostHog starts only on `joshuabooth.nz`, so local builds, audits and deploy previews send no events.
