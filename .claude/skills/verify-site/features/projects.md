# Projects page

`/projects` shows every project, big tiles first, with filters for apps, designs, games and tools.

## Sub-features

- `projects-grid`: every big and small project, with pictures.
- `projects-filter`: All, Apps, Designs, Games and Tools narrow the grid.

## How to get to it (user POV)

- Projects in the header.
- All projects on the home page and the 404 page.

## Driving it with Playwright

Preconditions: redesign build, served. The page exists only with the redesign flag.

- Grid: load `/projects`, scroll through, and every `img` has `naturalWidth > 0`.
- Filter: click the button named "Games". It has `aria-pressed="true"`, All has `aria-pressed="false"`, and only
  game tiles remain. Click All and the full grid returns.
- The header's Projects link has `aria-current="page"` here.

## Gotchas

- A chosen filter and the current header link don't change on hover, on purpose. The audit skips them.
