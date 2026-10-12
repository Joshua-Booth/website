---
name: joshuabooth.nz
description: A royal blue ground with white ink, wide Archivo display type, and an x-ray that shows how the page is built.
colors:
  ground: "#034694"
  ink: "#fff"
  soft: "rgba(255, 255, 255, 0.86)"
  faint: "rgba(255, 255, 255, 0.7)"
  rule: "rgba(255, 255, 255, 0.22)"
  invert-bg: "#fff"
  invert-ink: "#034694"
  measure: "#ff9ebb"
  xray-stroke: "rgba(255, 255, 255, 0.95)"
  xray-text: "rgba(255, 255, 255, 0.5)"
  xray-dash: "rgba(255, 255, 255, 0.55)"
  lab-light-bg: "#f4f5f7"
  lab-light-ink: "#15171c"
  lab-light-soft: "#5b6270"
  lab-light-rule: "#e3e6eb"
  lab-card: "#fff"
  lab-code-bg: "#0b1630"
  lab-code-ink: "#dde6f7"
  lab-code-quiet: "#7f95bc"
  lab-code-key: "#9cc7ff"
  lab-code-string: "#ff9ebb"
typography:
  display-name:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(54px, 12.6cqw, 186px)"
    fontWeight: 850
    lineHeight: 0.84
    letterSpacing: "-0.02em"
  display-page-title:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(44px, 10cqw, 150px)"
    fontWeight: 850
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  display-big:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 6.2cqw, 86px)"
    fontWeight: 850
    lineHeight: 0.92
    letterSpacing: "-0.015em"
  display-mid:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(24px, 3.6cqw, 48px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  intro:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(19px, 2cqw, 23px)"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  paragraph:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-archivo), ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "0.12em"
  code:
    fontFamily: "var(--font-plex-mono), ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "24px"
rounded:
  pill: "99px"
  tile: "8px"
  spec-chip: "3px"
  lab-control-sm: "5px"
  lab-control: "6px"
spacing:
  gutter: "clamp(16px, 1.6vw, 20px)"
  page: "1240px"
components:
  pill-button:
    backgroundColor: "{colors.invert-bg}"
    textColor: "{colors.invert-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  row-link-pill:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  back-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 16px"
  lab-filter:
    textColor: "{colors.soft}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
  lab-filter-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
  lab-tile:
    rounded: "{rounded.tile}"
---

# Design System: joshuabooth.nz

Read this file before any UI, layout, styling or visible copy change on the site. Every value here is copied from the code, and each group names the file it comes from. If the code and this file disagree, the code wins, so fix this file in the same pull request.

The site's job is to show the work is well made, so the site has to be well made too.

## Colours

The site has one dark look: a royal blue ground with white ink. Only the tab icon changes with the system theme, from `app/icon.svg`.

Source: `src/shared/ui/tokens.stylex.ts` (`colors`). `src/app/styles/global.css` holds copies of `ground` and `ink` for the rules StyleX can't target, so change both together.

| Role         | Token                   | Value                       | Where                                                              |
| ------------ | ----------------------- | --------------------------- | ------------------------------------------------------------------ |
| Canvas       | `ground`                | `#034694`                   | The page, the html element and the theme colour                    |
| Text         | `ink`                   | `#fff`                      | Headings, the name, strong text and focus rings                    |
| Muted text   | `soft`                  | `rgba(255, 255, 255, 0.86)` | The intro, paragraphs, nav links and row details                   |
| Quieter text | `faint`                 | `rgba(255, 255, 255, 0.7)`  | Section labels, row meta, the footer and fact terms                |
| Rule         | `rule`                  | `rgba(255, 255, 255, 0.22)` | Borders between rows and around tiles, and resting link underlines |
| Action       | `invertBg`, `invertInk` | `#fff`, `#034694`           | The Copy address button, and a row link on hover or focus          |
| Selected     | `invertBg`, `invertInk` | `#fff`, `#034694`           | Text selection, from `global.css`                                  |
| Accent       | `measure`               | `#ff9ebb`                   | The x-ray's measurements only                                      |

A pressed Lab filter flips to `ink` on `ground`, and a picked day in the Lab's recurrence editor is `ground` with `ink` text.

The x-ray has its own three, used only while it's on: `xrayStroke` (`rgba(255, 255, 255, 0.95)`) outlines display type, `xrayText` (`rgba(255, 255, 255, 0.5)`) dims body text, and `xrayDash` (`rgba(255, 255, 255, 0.55)`) colours the dashed rules.

**The One Accent Rule.** Pink is only for the x-ray's measurements. Nothing else on the site is pink, and no colour is added that doesn't mean something.

### Lab surfaces

Lab demos are light or code panels set inside a tile, so they carry their own palette. Source: `src/entities/lab-tile/ui/tile-tokens.stylex.ts` (`surface`).

| Token        | Value     | Where                                                  |
| ------------ | --------- | ------------------------------------------------------ |
| `lightBg`    | `#f4f5f7` | A light demo's background                              |
| `lightInk`   | `#15171c` | A light demo's text                                    |
| `lightSoft`  | `#5b6270` | A light demo's quieter text                            |
| `lightRule`  | `#e3e6eb` | Card and control borders in a light demo               |
| `card`       | `#fff`    | Cards and controls in a light demo                     |
| `codeBg`     | `#0b1630` | A code demo's background                               |
| `codeInk`    | `#dde6f7` | Code text                                              |
| `codeQuiet`  | `#7f95bc` | Punctuation and disclosure marks in the JSON inspector |
| `codeKey`    | `#9cc7ff` | JSON keys                                              |
| `codeString` | `#ff9ebb` | JSON strings                                           |

The tile itself sits on `rgba(255, 255, 255, 0.05)`, from `src/entities/lab-tile/ui/tile-frame.tsx`.

## Typography

Archivo is for everything, set wide for display. IBM Plex Mono is for code and for every x-ray label: dimension labels, measurements, spec chips and the title block, from `overlay-styles.ts`.

Source: `src/shared/ui/tokens.stylex.ts` (`fonts`) and `src/app/styles/fonts.ts`.

- **Archivo** (`var(--font-archivo), ui-sans-serif, system-ui, sans-serif`), loaded with its `wdth` axis so display type can stretch.
- **IBM Plex Mono** (`var(--font-plex-mono), ui-monospace, monospace`), loaded at weights 400, 500 and 600.

The body is Archivo at 18px, weight 400, line height 1.5, from `app/layout.tsx`.

### Display

Display type is uppercase Archivo at weight 850 and `font-stretch: 125%`, from `src/shared/ui/display.ts`. Sizes use container units (`cqw`), so they follow the site's width rather than the window's.

| Use                       | Size                          | Line height | Letter spacing | Source                                       |
| ------------------------- | ----------------------------- | ----------- | -------------- | -------------------------------------------- |
| The name on the home page | `clamp(54px, 12.6cqw, 186px)` | 0.84        | -0.02em        | `src/widgets/site-header/ui/site-header.tsx` |
| Page titles               | `clamp(44px, 10cqw, 150px)`   | 0.86        | -0.02em        | `src/shared/ui/page-frame.tsx`               |
| Big rows and `Big` prose  | `clamp(30px, 6.2cqw, 86px)`   | 0.92        | -0.015em       | `src/shared/ui/display.ts`                   |
| Mid rows                  | `clamp(24px, 3.6cqw, 48px)`   | 0.95        | -0.01em        | `src/pages/home/ui/rows.tsx`                 |
| The email address         | `clamp(26px, 5.6cqw, 78px)`   | 1           | -0.02em        | `src/pages/home/ui/home-page.tsx`            |
| Cut list items            | `clamp(28px, 5cqw, 64px)`     | 1           |                | `src/shared/ui/prose.tsx`                    |

Mid rows use weight 800 and `font-stretch: 118%`. The email address keeps its case.

### Reading

| Use        | Size                      | Weight        | Line height | Line length | Source            |
| ---------- | ------------------------- | ------------- | ----------- | ----------- | ----------------- |
| Intro      | `clamp(19px, 2cqw, 23px)` | 400, lead 600 | 1.45        | 30em        | `site-header.tsx` |
| Paragraph  | 20px                      | 400           | 1.5         | 34em        | `prose.tsx`       |
| Row detail | 17px                      | 400           |             | 44em        | `rows.tsx`        |
| Fact value | 17px                      | 500           |             |             | `prose.tsx`       |

Weight 400 is the body's, from `app/layout.tsx`, and the rest is inherited.

### Labels and UI

| Use                 | Size                   | Weight | Letter spacing | Source                             |
| ------------------- | ---------------------- | ------ | -------------- | ---------------------------------- |
| Section label       | 14px, uppercase        | 600    | 0.12em         | `prose.tsx`                        |
| Fact term           | 13px, uppercase        | 600    | 0.1em          | `prose.tsx`                        |
| Nav                 | 15px                   | 600    | 0.01em         | `site-header.tsx`                  |
| Row meta            | 15px, tabular numerals | 400    |                | `rows.tsx`                         |
| Pills               | 15px                   | 600    |                | `rows.tsx`, `interactive.ts`       |
| Copy address button | 14px                   | 600    |                | `copy-email.tsx`, `interactive.ts` |
| Footer              | 14px                   | 400    |                | `app/layout.tsx`                   |

**The Tabular Rule.** Numbers use tabular numerals. On the site's pages only row meta sets them, from `rows.tsx`. In the Lab, the width dial and duration input readouts set them too, from `width-dial.tsx` and `duration-input.tsx`.

Keep Inter and JetBrains Mono out, along with all-mono labels and `//` separators.

## Spacing and radius

Source: `src/shared/ui/tokens.stylex.ts` (`space`, `sizes`, `breakpoints`).

- **Page width** (1240px, `sizes.page`): the header, main and footer all stop here.
- **Gutter** (`clamp(16px, 1.6vw, 20px)`, `space.gutter`): the page's side padding.
- **Narrow** (`@container (max-width: 760px)`, `breakpoints.narrow`): the one layout breakpoint. It's a container query on the site, not a media query, so a copy of any part lays out the same.

There's no spacing scale token. Components set their own spacing, and the recurring steps are these:

- Section labels sit 64px below what's above and 10px above their rows, from `prose.tsx`.
- The contact block starts 80px down, from `home-page.tsx`.
- The footer sits 64px below the page with 16px above its text, from `app/layout.tsx`.
- Rows pad 18px on top, 16px at the bottom and 12px at the sides, with no start padding when narrow, from `rows.tsx`.
- Anchored sections stop 24px from the top when scrolled to, from `global.css`.

Check every page at 390 and 360 wide, with the system in light and dark mode, and with no sideways scroll. The page looks the same in both, but the tab icon and anything that follows the colour scheme can change.

Radius is used sparingly:

| Shape                                                          | Value       | Source                                                    |
| -------------------------------------------------------------- | ----------- | --------------------------------------------------------- |
| Pills (buttons, row links, filters, back link)                 | 99px        | `src/shared/ui/interactive.ts`                            |
| Lab tiles, light demo cards and the duration input's buttons   | 8px         | `tile-frame.tsx`, `demo-surface.ts`, `duration-input.tsx` |
| Controls in the Lab demos (recurrence editor, hotkey recorder) | 5px and 6px | `recurrence-editor.tsx`, `hotkey-recorder.tsx`            |
| The x-ray's spec chips                                         | 3px         | `overlay-styles.ts`                                       |

## Surfaces and borders

The site is flat. Depth comes from rules and from inverting colour, not from shadows.

- **Rules** are 2px solid `rule`, drawn above a list and under each row, from `rows.tsx` and `src/shared/ui/xray.ts`. Facts and the footer draw a 2px rule above.
- **Row pills** have a 1px border. The back link and Lab filters have 2px.
- **Lab tiles** have a 1px `rule` border, 8px corners and the tile ground.
- **Focus** is a 3px solid `#fff` outline, offset 4px, from `global.css`. A row link has no outline and inverts instead.
- **Shadow**: the only shadow on a surface is on Lab demo cards. It's `0 1px 2px rgba(21, 23, 28, 0.06)`, from `demo-surface.ts`. The x-ray uses box-shadow in two more places. The build sweep's edge glows with `0 0 18px 4px rgba(190, 210, 255, 0.6)`, from `overlay-styles.ts`. Pills draw their x-ray outline with `inset 0 0 0 1.5px` in `faint`, from `interactive.ts`.

Keep glassmorphism, rounded cards with a coloured stripe down one side, and copycat brutalism off the site.

## Components

### Rows

Work and Projects are lists of rows, from `src/pages/home/ui/rows.tsx`. A row has a big or mid title, meta to the right, an optional role or detail, and an optional pill. When narrow, the meta and pill drop under the title on the left.

A linked row inverts on hover or focus, to `invertBg` with `invertInk` text, and the pill flips with it. A row can carry a second Code pill beside it, which inverts on its own.

### Pills

Pills are the site's buttons and link targets: 99px corners and weight 600, from `interactive.ts`.

- **Row pill**: 15px, line height 1.5, 6px by 14px padding, 1px border in `ink`, with an arrow icon.
- **Copy address**: from `src/pages/home/ui/copy-email.tsx`. `invertBg` with `invertInk` text, 14px, 6px by 14px padding, no border. Every label sits in one grid cell with the inactive ones hidden, so the button stays as wide as its longest label. After a copy, "Copied" or "Selected" shows for 1600ms, from `src/pages/home/model/copy-labels.ts`, and is read out by a polite live region.
- **Back link**: 15px, 6px by 16px padding, 2px border in `rule` that turns `ink` on hover.
- **Lab filters**: 14px, 5px by 14px padding, 2px border in `rule`, `soft` text. A pressed filter is `ink` with `ground` text.

### Text links

Links keep the text colour, with a 2px underline 5px below the text in `rule`, which turns `ink` on hover, from `interactive.ts`.

### Header

The bar holds the jb mark and the nav, from `site-header.tsx`. The jb mark is 28.4px by 24.1px, from `src/shared/ui/jb-mark.tsx`, with no tile behind the letters. Nav links are `soft` and turn `ink` on hover or focus. On the home page the header also holds the name and the intro.

The name appears once, as the big type on the home page.

### Prose

Case study pages use `Para`, `Label`, `Big`, `Facts` and `CutList` from `src/shared/ui/prose.tsx`. Facts are a four column grid, or two when narrow. Section labels have no item counts.

### Lab tiles

A tile is a figure with its demo on top and a caption below, from `tile-frame.tsx`. The caption has the name in 14px weight 700 at `font-stretch: 108%`, and a 12.5px weight 500 tag in `faint`. Demos pad 18px and set 14px text at line height 1.4, from `demo-surface.ts`.

### Icons

Icons are Lucide arrows at 1em, stroke 2.25, from `src/shared/ui/icon.ts`. No emoji in the UI.

## Imagery and blueprint marks

The site has no photos. Its imagery is the page drawn as a technical drawing, from `src/features/page-effects/ui/overlay-styles.ts`.

- **X-ray**: the page under a light that follows the pointer, and that you drag on a phone. The ground gets 1px lines every 8px at `rgba(255, 255, 255, 0.09)`. Display type turns to a 1.5px outline in `xrayStroke`, rules turn dashed, and pills draw a 1.5px inset outline in `faint` so they keep the same box.
- **Blueprint**: shown while the window resizes. A 40px grid at `rgba(255, 255, 255, 0.08)` over an 8px grid at `rgba(255, 255, 255, 0.035)`, on the ground.
- **Dimensions**: 1.2px white lines with labels in IBM Plex Mono 500 at 14px, or 11px under 600px wide. Each label has a 5px halo in the ground colour, so the numbers stay readable where they cross the page's own text.
- **Guides**: 1px lines on each heading's baseline and cap height, measured from Archivo's own metrics. Cap guides are dashed.
- **Measurements**: 2px `measure` lines with 12px end caps, labelled in IBM Plex Mono 500 at 13px, or 10px under 600px wide.
- **Spec chips**: IBM Plex Mono 500 at 13px in `invertInk` on `invertBg`, with 3px corners.
- **Title block**: a 330px box with a 1.5px white border, or 250px under 600px wide. Its text is IBM Plex Mono 500 at 12px, or 10px under 600px wide, from `overlay-styles.ts`.

The light's glow is the one gradient allowed. Interactions work without a hidden control.

## Motion

Motion is short and only on colour, opacity and lines being drawn.

| What                         | Duration | Easing or delay                               | Source              |
| ---------------------------- | -------- | --------------------------------------------- | ------------------- |
| Row and pill colour          | 0.25s    |                                               | `rows.tsx`          |
| X-ray light and glow fade in | 0.8s     |                                               | `overlay-styles.ts` |
| Blueprint fades in           | 0.35s    |                                               | `overlay-styles.ts` |
| Dimension lines draw         | 0.7s     | `cubic-bezier(0.3, 0.7, 0.2, 1)`, after 0.15s | `overlay-styles.ts` |
| Dimension labels fade in     | 0.4s     | after 0.5s                                    | `overlay-styles.ts` |
| Title block fades in         | 0.4s     | after 0.7s                                    | `overlay-styles.ts` |
| Guides draw                  | 0.6s     | `cubic-bezier(0.3, 0.7, 0.2, 1)`              | `overlay-styles.ts` |
| Spec chips fade in           | 0.3s     | after 0.3s                                    | `overlay-styles.ts` |
| Build copy fades             | 0.4s     |                                               | `overlay-styles.ts` |

The build sweep and the assembly ease in and out on a cubic curve, from `src/features/page-effects/lib/motion.ts`. The light follows the pointer on a spring with stiffness 12 and damping 1, from `src/features/page-effects/model/torch.ts`.

Work and Projects assemble as you scroll to them. The page is hidden for the moment it takes to put the build covers on, and shows after 2.5s anyway if they never go on, from `app/layout.tsx`.

With reduced motion, the page shows straight away and smooth scrolling is off, from `app/layout.tsx` and `global.css`.

## Never

Keep these off the site:

1. Decorative gradients. The light's glow is fine.
2. Colours that mean nothing.
3. Pulsing or redundant badges and dots.
4. Rounded cards with a coloured stripe down one side.
5. Emoji in the UI.
6. Elements out of line. Measure baselines instead of eyeballing them. The page effects do it in `src/features/page-effects/lib/measure.ts`, and the audit does the same in `scripts/audit/in-page.ts`. They set an "H" at 1000px in the page's resolved Archivo, followed by an empty inline-block `<i>`. The baseline is the bottom of the `<i>`, less the top of the letter, divided by 1000. Both sit in an unknown element, `<font-probe>`, not a `<span>`, so the page's span rules don't change the layout.
7. Inter or JetBrains Mono by default, all-mono labels, or `//` separators.
8. Text that only makes sense inside the project. Internal names never show up in visible text, though they're fine in code comments.
9. Glassmorphism, or copycat brutalism.
10. Hype words and landing-page subtitles.
11. Repeats on a page, and item counts on section labels.
12. Timelines, gaps or contribution graphs, or anything else that makes quiet periods look like inactivity.
