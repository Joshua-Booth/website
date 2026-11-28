---
name: joshuabooth.nz
description: Near-black ink on white, Archivo at medium weights, and project pictures on quiet grey mats.
colors:
  ground: "#fff"
  ink: "#0e0e10"
  soft: "#55575d"
  faint: "#8a8c92"
  rule: "#e4e4e7"
  invert-bg: "#0e0e10"
  invert-ink: "#fff"
  mat: "#f3f3f1"
  chip-border: "#d4d4d8"
typography:
  name:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "64px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  email:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(28px, 7cqw, 56px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  tile-name:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  intro:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
  body:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
  meta:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.1
rounded:
  pill: "999px"
  mat: "12px"
  small-mat: "8px"
spacing:
  gutter: "clamp(16px, 1.6vw, 20px)"
  page: "1200px"
components:
  dark-pill:
    backgroundColor: "{colors.invert-bg}"
    textColor: "{colors.invert-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  filter-chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px 5px"
  filter-chip-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "7px 14px 5px"
  mat:
    backgroundColor: "{colors.mat}"
    rounded: "{rounded.mat}"
---

# Design System: joshuabooth.nz

Read this file before any UI, layout, styling or visible copy change on the site. Every value here is copied from the code, and each group names the file it comes from. If the code and this file disagree, the code wins, so fix this file in the same pull request.

The site's job is to show the work is well made, so the site has to be well made too. The look is quiet on purpose: white, near-black type, and the work's own pictures carrying the colour.

The Figma file holds the source mocks: the home page, the Projects page, the 404 and error pages, and every tile's mat.

## Colours

The site has one light look. Source: `src/shared/ui/tokens.stylex.ts` (`colors`). `src/app/styles/global.css` holds copies of `ink` and `ground` for selection and focus, which StyleX can't target, so change both together.

| Role         | Token                   | Value             | Where                                                       |
| ------------ | ----------------------- | ----------------- | ----------------------------------------------------------- |
| Canvas       | `ground`                | `#fff`            | The page, the html element and the theme colour             |
| Text         | `ink`                   | `#0e0e10`         | Headings, names, the intro, links and focus rings           |
| Muted text   | `soft`                  | `#55575d`         | Descriptions, nav links, roles, and a dark pill's hover     |
| Quieter text | `faint`                 | `#8a8c92`         | Tags, years, small tile lines, earlier roles and the footer |
| Rule         | `rule`                  | `#e4e4e7`         | Hairlines under labels, the hero, each job and the footer   |
| Action       | `invertBg`, `invertInk` | `#0e0e10`, `#fff` | The Copy address button and text selection                  |
| Mat          | `mat`                   | `#f3f3f1`         | The ground a project's picture sits on                      |

A filter chip at rest has a 1px `#d4d4d8` border, from `src/pages/projects/ui/project-list.tsx`.

**No accent.** The only colour on the site comes from the projects' own pictures. Don't add a colour that doesn't mean something.

## Typography

Archivo is for everything, at weights 400 to 600. Source: `src/shared/ui/tokens.stylex.ts` (`fonts`) and `src/app/styles/fonts.ts`, which loads Archivo with its `wdth` axis. The body is 18px at line height 1.5, from `app/layout.tsx`, and components set their own sizes.

| Use                                | Size                      | Weight   | Line height | Letter spacing | Source                                                      |
| ---------------------------------- | ------------------------- | -------- | ----------- | -------------- | ----------------------------------------------------------- |
| The name on the home page          | 64px, 44px narrow         | 500      | 1.05        | -0.025em       | `src/pages/home/ui/home-page.tsx`                           |
| Page titles (Projects, 404, error) | 48px, 40px narrow         | 500      | 1.05        | -0.02em        | `projects-page.tsx`, `not-found-page.tsx`, `error-page.tsx` |
| The email address                  | `clamp(28px, 7cqw, 56px)` | 500      | 1.1         | -0.025em       | `home-page.tsx`                                             |
| Big tile name                      | 24px                      | 600      | 1.1         | -0.01em        | `src/entities/project/ui/tiles.tsx`                         |
| Role and intro                     | 20px, 18px narrow         | 400      |             |                | `home-page.tsx`                                             |
| Employer                           | 18px                      | 600      | 1.3         |                | `home-page.tsx`                                             |
| Section label                      | 16px                      | 500      | 1.3         |                | `home-page.tsx`, `project-list.tsx`                         |
| Tile description, role line        | 16px                      | 400      | 1.45, 1.4   |                | `tiles.tsx`, `home-page.tsx`                                |
| Small tile name                    | 16px                      | 600      | 1.1         |                | `tiles.tsx`                                                 |
| Nav, text links                    | 15px                      | 400, 500 | 1.5         |                | `site-header.tsx`, `tiles.tsx`                              |
| Filter chips                       | 14px                      | 500      | 1.2         |                | `project-list.tsx`                                          |
| Tags, years, small tile line       | 13px                      | 400      | 1.1         |                | `tiles.tsx`                                                 |
| Footer                             | 13px                      | 400      |             |                | `app/layout.tsx`                                            |

**The Tabular Rule.** Numbers that line up use tabular numerals: tile tags and the years in the work list.

Keep Inter and JetBrains Mono out, along with all-mono labels and `//` separators. The case study pages still use the old wide uppercase display type from `src/shared/ui/display.ts` until they're redesigned.

## Spacing and layout

Source: `src/shared/ui/tokens.stylex.ts` (`space`, `breakpoints`) and each page's styles.

- **Page width** (1200px): the header, main and footer all stop here.
- **Gutter** (`clamp(16px, 1.6vw, 20px)`, `space.gutter`): the page's side padding.
- **Narrow** (`@container (max-width: 760px)`) and **mid** (`@container (min-width: 761px) and (max-width: 1040px)`): container queries on the site, not media queries, so a copy of any part lays out the same.

There's no spacing scale token. The recurring steps:

- Page titles and the home hero start 96px below the header, 56px narrow.
- Sections are 120px apart, 80px narrow. The first is 64px below the hero.
- A section label has 12px under its text, a hairline, then 32px to its content.
- Big tiles: three columns, two at mid, one narrow, with 33px between columns and 56px between rows (48px narrow). A wide tile spans two.
- Small tiles: four columns, three at mid, two narrow, with 20px (16px narrow) between columns and 40px (32px narrow) between rows.
- The footer sits 120px below the page, under a 1px hairline with 16px above its text, from `app/layout.tsx`.
- Anchored sections stop 24px from the top when scrolled to, from `global.css`.

Check every page at 390 and 360 wide, with no sideways scroll.

## Surfaces and borders

The site is flat. Depth comes from the mats, not from shadows.

- **Rules** are 1px solid `rule`: under the hero, under each section label, under each job and above the footer.
- **Mats** are `mat` with 12px corners, 8px on small tiles, and clip the picture inside.
- **Focus** is a 3px solid `ink` outline, offset 4px, from `global.css`. A section focused by an in-page link shows no outline.

Keep glassmorphism, rounded cards with a coloured stripe down one side, and copycat brutalism off the site.

## Components

### Header

From `src/widgets/site-header/ui/site-header.tsx`. Away from home, the name sits on the left in 15px weight 600 and links home. The nav is Projects, Work and Contact on the right, in `soft`, turning `ink` on hover. The current page's link is `ink`. On the home page, Work and Contact jump to their sections.

### Project tiles

From `src/entities/project/ui/tiles.tsx`, with the projects in `src/entities/project/model/showcase.ts`.

- **Big tile**: the picture on a mat, then the name with a quiet tag beside it (like "Open source"), a 16px line about it in `soft`, and underlined text links.
- **Small tile**: the picture on a small mat, the name with its year, one 13px line in `faint`, and an optional "View the code" link.

Tile pictures are exported from the Figma mats at 2x (big tiles 756px wide, small ones 570px) into `public/projects/` as WebP. A wide big tile keeps its height when it drops to one column and loses its sides.

### Text links

Links keep `ink` with a 1px underline 4px below the text, which thickens to 2px on hover, from `textLink` in `tiles.tsx`. Every link that opens a new tab says so to screen readers, from `src/shared/ui/new-tab-note.tsx`.

### Buttons

- **Copy address**: from `src/pages/home/ui/copy-email.tsx`. A dark pill: `invertBg` with `invertInk` text, 14px weight 600, 6px by 14px padding, lightening to `soft` on hover. Every label sits in one grid cell with the inactive ones hidden, so the button stays as wide as its longest label. After a copy, "Copied" or "Selected" shows for 1600ms, from `src/pages/home/model/copy-labels.ts`, and is read out by a polite live region.
- **Try again**: the error page's dark pill, 15px weight 500, from `src/pages/error/ui/error-page.tsx`.
- **Filter chips**: on the Projects page. 14px weight 500, 1px `#d4d4d8` border that turns `ink` on hover. A pressed chip is `ink` with `ground` text. The padding is 7px on top and 5px below, because Archivo's caps sit a pixel above the middle of the line box.

### Work list

A role ledger, from `home-page.tsx`: the employer on the left, then one line per role with its years on the right, latest first. Earlier roles are `faint`. Every role has an end year, as none is current, so nothing says "now" or "present".

### Prose

Case study pages use `Para`, `Label`, `Big`, `Facts` and `CutList` from `src/shared/ui/prose.tsx`. They're switched off and get redesigned before they come back.

### Icons

Icons are Lucide at 1em, stroke 2.25, from `src/shared/ui/icon.ts`. No emoji in the UI.

## Motion

There's almost none. Links thicken their underline on hover, buttons change colour, and smooth scrolling is on within a page unless reduced motion is set, from `global.css`.

## Never

Keep these off the site:

1. Decorative gradients.
2. Colours that mean nothing.
3. Pulsing or redundant badges and dots.
4. Rounded cards with a coloured stripe down one side.
5. Emoji in the UI.
6. Elements out of line. Measure baselines and optical centres instead of eyeballing them.
7. Inter or JetBrains Mono by default, all-mono labels, or `//` separators.
8. Text that only makes sense inside the project. Internal names never show up in visible text, though they're fine in code comments.
9. Glassmorphism, or copycat brutalism.
10. Hype words, landing-page subtitles, and intro lines Josh didn't write.
11. Repeats on a page, and item counts on section labels.
12. Timelines, gaps or contribution graphs, or anything else that makes quiet periods look like inactivity.
