# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Most readers want a quick sense of Joshua's frontend and design-engineering work. They usually arrive from LinkedIn,
GitHub or a shared link, and decide in a few seconds whether to read on or get in touch.

Some stay longer: designers and engineers who look through every project, the case studies and the source code.

AI agents also read the site, through `llms.txt`, `llms-full.txt` and the Markdown version of each page.

## Product Purpose

joshuabooth.nz is Joshua Booth's personal site. It says who he is, lists his work and projects, and gives a way to get
in touch.

It works when someone looking at his work gets a clear sense of his craft, then reads further (a project, a case study, the
source code) or gets in touch by email, LinkedIn or GitHub.

## Positioning

The work is the evidence. Joshua is a design engineer: he designs in Figma and builds what he designs. The site
stays quiet, white and plain so the projects' own pictures and links carry it. It's built carefully, it works without
script, and the source is public.

## Operating Context

- People visit on desktop and phone.
- The site is a static export served from Netlify's CDN. Pages arrive finished.
- Every page has a Markdown version (`/index.md`, `/projects.md` and so on), alongside `llms.txt` and `llms-full.txt`.
  All of them are built from the same data as the pages.
- PostHog feature flags gate the PCOS case study and the build write-up, which are off until they're reworked.
  Flags are read at build time. A flag that's off removes its page and every link to it.
- PostHog analytics run only on joshuabooth.nz.

## Capabilities and Constraints

Pages:

- **Home:** the name and intro, Projects (the big project tiles), Work and Contact. Contact has the email address, a
  copy button, LinkedIn and GitHub.
- **Projects** (`/projects`): every project, big tiles first, then smaller designs, games and tools, with filter chips
  for Apps, Designs, Games and Tools.
- **PCOS Protocol** (`/work/pcos-protocol`, flagged): case study of a course app for a nutrition business.
- **How this site is built** (`/writing/this-site`, flagged): how the site is built. It still describes the old
  x-ray look and needs rewriting.
- **Not found:** a 404 with links home and a few projects.
- **Error:** shown when a script breaks, with a Try again button.

Terms used in code and copy: **big tiles** and **small tiles** (the two sizes of project), and the **mat** (the grey
ground a project's picture sits on).

Constraints:

- The site describes work Joshua has done and how he did it.
- Every file the site serves is public, including `llms.txt`, `llms-full.txt` and the `.md` pages.
- Projects that aren't ready to share (the email client, the Frontend Craft course) stay off the site.
- Content must read completely without script.
- Copy is in NZ English, and `html` is set to `lang="en-NZ"`.

## Brand Commitments

- **Name and contact:** Joshua Booth, joshuabooth.nz, contact@joshuabooth.nz.
- **Current introduction:** "Design engineer, Auckland. I design and build interfaces."
- **Voice:** first person, plain and sincere. One small, concrete claim per line, warm and direct. No wordplay, no
  punchlines, no smugness.
- **Assets:** the jb mark in the icons in `public/` (`icon.svg`, `favicon.ico`, `apple-icon.png`) and the Open Graph
  image (`public/og.png`, rendered from `scripts/og/og.html`).

## Evidence on Hand

- Work history: `src/entities/job/model/jobs.ts` (Solve Data, stuff.co.nz, The PCOS Nutritionist). Joshua left Solve
  Data in 2026, so no job is shown as current.
- Projects: `src/entities/project/model/showcase.ts`, with their pictures in `public/projects/`.
- The PCOS Protocol case study: `src/pages/pcos-protocol/ui/pcos-protocol.mdx`. It covers the client, dates, role and
  stack, what was cut from version one, and the checkout that was designed but not used.
- The build write-up: `src/pages/this-site/ui/this-site.mdx`.
- Missing, and not to be made up: testimonials, client quotes, logos, metrics, and case studies or screenshots of the
  work at Solve Data or stuff.co.nz.

## Product Principles

1. **Quick to read and worth exploring.** Who Joshua is, his work and how to reach him are clear at a glance, and
   every project is a click away.
2. **Show it working.** A live app, a demo or the code counts for more than describing a skill.
3. **Complete without script.** The server renders the content finished.
4. **One source for every reader.** Pages, Markdown versions and `llms.txt` come from the same data and say the same
   thing.
5. **Only what's public and true.** No invented proof and nothing private.

## Accessibility & Inclusion

No formal WCAG level has been set. Already in place:

- Every tab stop shows a focus ring, and in-page links move focus to their target.
- Copying the email announces itself through `aria-live`, and links that open a new tab say so.
- Filter chips are buttons with `aria-pressed`.
- The audit (`mise run audit`) checks each page at six widths for overlaps, clipping and sideways scroll, plus links,
  keyboard focus, hover and the header's links.
