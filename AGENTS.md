<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Working on this site

- Read `DESIGN.md` before any UI, layout, styling or visible copy change, so new work matches the site.
- Read `PRODUCT.md` before adding a page or changing what the site says, so new work stays true to who it's for.
- No barrel files. Import from the file that defines the thing.
- The empty root `pages/` folder stops Next.js reading `src/pages` as the Pages Router. Keep it.
- Commits use gitmoji. See `.claude/CLAUDE.md` and `commitlint.config.ts`.

## Feature flags

Parts of the site are behind PostHog feature flags, listed in `src/shared/config/flags.ts`. Locally they're all
off. Set `SITE_FLAGS` to `all`, or a comma list of flag keys, to turn parts on, or leave it empty to ask PostHog.
Flags are read when the site is built, so set it for the build. The live site asks PostHog when Netlify builds it,
so a flag flipped in PostHog shows up after the next deploy. Netlify deploy previews build with `redesign` on.

## Audit

`mise run audit` checks a production build: `mise run build && mise run preview`, then
`AUDIT_URL=<the address it prints> mise run audit`. It reads the look from the home page.

- The redesign's white look: build with `SITE_FLAGS=redesign`, which is what it will ship. It checks layout at six
  widths, links, keyboard focus, hover and the header's links.
- The live x-ray look: build with every flag but the redesign, `SITE_FLAGS=lab,pcos-case-study,this-site-case-study`.
  It checks overlaps against the x-ray, navigation and hover above the overlays.

The `verify-site` skill in `.claude/skills/` has the full loop and what to check on each page.

## Analytics

PostHog starts only on `joshuabooth.nz`, so local builds, audits and deploy previews send no events.

<!-- git-workflow:start -->

## Commits

- Commits use gitmoji with a lowercase imperative subject, checked by commitlint. Don't skip the hooks.
- Before the first commit in a fresh clone, install the hooks with `pnpm install`.
- Commits on a branch get a short body with context. PRs are squash-merged, so the default branch gets one subject-only commit.

<!-- git-workflow:end -->
