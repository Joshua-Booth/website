# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Most readers want a quick sense of Joshua's frontend and design-engineering work. They usually arrive from LinkedIn,
GitHub or a shared link, and decide in a few seconds whether to read on or get in touch.

Some stay longer: designers and engineers who come for the Lab, the build write-up and the source code.

AI agents also read the site, through `llms.txt`, `llms-full.txt` and the Markdown version of each page.

## Product Purpose

joshuabooth.nz is Joshua Booth's personal site. It says who he is, lists his work and projects, and gives a way to get
in touch.

It works when someone looking at his work gets a clear sense of his craft, then reads further (a case study, the Lab, the
build write-up) or gets in touch by email, LinkedIn or GitHub.

## Positioning

The site is its own evidence. Joshua designed it in the browser as coded mockups and built it himself, and it shows
the skills it claims. The page assembles itself as you scroll. A light follows the pointer and shows an x-ray of the
layout underneath. Resizing the window turns the page into a blueprint. With the effects off, the page is still
complete and usable. The source is public.

## Operating Context

- People visit on desktop and phone. The x-ray follows the pointer, or a drag on touch screens.
- The site is a static export served from Netlify's CDN. Pages arrive finished, and the effects start once the
  script loads.
- Every page has a Markdown version (`/index.md`, `/lab.md` and so on), alongside `llms.txt` and `llms-full.txt`. All
  of them are built from the same data as the pages.
- PostHog feature flags gate the Lab, the PCOS case study and the build write-up. Flags are read at build time. A flag
  that's off removes its page and every link to it.
- PostHog analytics run only on joshuabooth.nz.

## Capabilities and Constraints

Pages:

- **Home:** Work, Projects, a Lab strip (flagged) and Contact. Contact has the email address, a copy button,
  LinkedIn and GitHub.
- **PCOS Protocol** (`/work/pcos-protocol`, flagged): case study of a course app for a nutrition business.
- **How this site is built** (`/writing/this-site`, flagged): how the site and its effects work.
- **Lab** (`/lab`, flagged): small interfaces and components built to get the details right.
- **Not found:** a plain 404.

Terms used in code and copy: the **x-ray** (the layout revealed under the light), the **torch** (the light that
follows the pointer), **assemble** (sections building as they scroll in), the **blueprint** (the resize view), and
Lab **tiles**.

Constraints:

- The site describes work Joshua has done and how he did it.
- Every file the site serves is public, including `llms.txt`, `llms-full.txt` and the `.md` pages.
- Lab tags and descriptions name a project only once that project is public.
- Content must read completely without the effects. The effects stop at the finished page when reduced motion is on.
- Copy is in NZ English, and `html` is set to `lang="en-NZ"`.

## Brand Commitments

- **Name and contact:** Joshua Booth, joshuabooth.nz, contact@joshuabooth.nz.
- **Current introduction:** "I'm an AI-native frontend engineer in Auckland. I design and build products from first
  concept to live in production."
- **Voice:** first person, plain and sincere. One small, concrete claim per line, warm and direct. No wordplay, no
  punchlines, no smugness.
- **Assets:** the JB mark (`src/shared/ui/jb-mark.tsx`), the icons in `app/` (`icon.svg`, `favicon.ico`,
  `apple-icon.png`) and the Open Graph image (`public/og.png`).

## Evidence on Hand

- Work history: `src/entities/job/model/jobs.ts` (Solve Data, stuff.co.nz, The PCOS Nutritionist).
- Projects: `src/entities/project/model/projects.ts`. All four are open source, and Tax Calculator and Audio Devotions
  have live apps.
- The PCOS Protocol case study: `src/pages/pcos-protocol/ui/pcos-protocol.mdx`. It covers the client, dates, role and
  stack, what was cut from version one, and the checkout that was designed but not used.
- The build write-up: `src/pages/this-site/ui/this-site.mdx`.
- Lab components: `src/entities/lab-tile/`.
- Missing, and not to be made up: testimonials, client quotes, logos, metrics, and case studies or screenshots of the
  work at Solve Data or stuff.co.nz.

## Product Principles

1. **Quick to read and worth exploring.** Who Joshua is, his work and how to reach him are clear at a glance. The
   effects are proof of craft and get equal weight. When the two conflict, decide case by case rather than defaulting
   to either.
2. **Show it working.** A live app, a Lab component or the page itself counts for more than describing a skill.
3. **Complete without the effects.** The server renders the content finished, and the effects sit on top of it. They
   never hide content, block navigation or cover what the pointer is on.
4. **One source for every reader.** Pages, Markdown versions and `llms.txt` come from the same data and say the same
   thing.
5. **Only what's public and true.** No invented proof and nothing private.

## Accessibility & Inclusion

No formal WCAG level has been set. Already in place:

- Effects stop at the finished page under reduced motion.
- Hover states have matching `:focus-visible` states, so keyboard users see the same feedback.
- Linked rows are named by their title and action, and the rest is read as the description. Copying the email
  announces itself through `aria-live`, and links that open a new tab say so.
- The audit (`mise run audit`) checks each page at six widths for overlapping text, and checks that the light never
  covers what the pointer is on.
