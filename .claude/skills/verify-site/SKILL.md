---
name: verify-site
description: Drive a production build of joshuabooth.nz in a real browser and prove a change works, with the redesign's white look or the live x-ray look. Use after any change to a page, the header, links, focus or hover, before saying a site change is done.
---

# Verify joshuabooth.nz

The site is a static Next.js export. Verification builds it with a set of flags, serves `out/`, and drives it with
Playwright through `mise run audit`. Read `features/README.md` for what to check and how.

## Launch

1. Pick the flags. `SITE_FLAGS=redesign` is what the redesign will ship. `SITE_FLAGS=all` is what a deploy preview
   shows, and it adds pages that stay off at launch (the case studies and the Lab, still in the old look). Never
   use `all` to judge whether something is ready to ship.
2. Build: `SITE_FLAGS=redesign mise run build`. Ready when it prints the route table and exits 0.
3. Serve on a port of your own, in the background, and keep its PID:
   `npx serve out -l 4321 & echo $! > /tmp/verify-site.pid`. Ready when `curl -s localhost:4321/sitemap.xml`
   answers.

Rebuild after every source change. The server serves files, so a stale `out/` shows stale work.

## Doctor

Run this before driving, and again when a result looks wrong:

```sh
curl -s localhost:4321/sitemap.xml | grep -o '<loc>[^<]*' ; \
curl -s localhost:4321/ | grep -o 'data-look="white"' || echo "x-ray look"
```

The sitemap lists the pages this build has on. `data-look="white"` means the redesign flag was on. If either isn't
what you built, the port belongs to another server or `out/` is stale.

## Drive

`AUDIT_URL=http://localhost:4321 mise run audit` reads the look from the home page and runs:

- White look (`scripts/audit/white.ts`): text that overlaps or clips, broken images and sideways scroll at 1440, 1280,
  1024, 768, 390 and 360; every link on this site answers 200 and every hash has its id; Tab reaches every control
  with a ring, on screen and uncovered; every link and button changes on hover (the current page and a chosen
  filter are exempt); the header's Projects, Work and Contact links land, and after Work or Contact the next Tab
  starts in that section.
- X-ray look (`overlap.ts`, `navigation.ts`, `hover.ts`): the x-ray, glow and blueprint checks. It needs every
  page with the redesign off: `SITE_FLAGS=lab,pcos-case-study,this-site-case-study`.

If Playwright's own browser isn't installed (a cloud container with a different Playwright), point the audit at one
with `AUDIT_CHROME=/opt/pw-browsers/chromium`.

For a specific behaviour, drive it with a short Playwright script against the same server, using the handles in
the feature files: roles, `aria-label`, `aria-current`, `aria-pressed` and ids, not coordinates.

## Evidence

- The audit's stdout, with its exit code. Exit 0 and no `FAIL` lines is a pass.
- Full-page screenshots at 1440, 390 and 360 of every page you touched, taken with reduced motion after scrolling
  the page once so lazy images load. Look at them; a pass from the audit doesn't prove the page looks right.
- Keep both outside the repo or in `audit-output/`, which git ignores. Name each file with its width and page.

## Cleanup

`kill $(cat /tmp/verify-site.pid)`. Kill only the server you started, never by process name. Leave
`audit-output/` and your screenshots.

## Gotchas

- `SITE_FLAGS` empty asks PostHog. Set it explicitly for verification.
- The white look has no x-ray, so its checks don't touch `.fx` or `[data-overlay]`. The x-ray checks fail on a
  white build, which is why the audit switches on the look.
- `html` has smooth scrolling. Emulate reduced motion before measuring anything after a scroll.
