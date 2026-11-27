# Markdown copies

Every page has a Markdown copy for agents and readers, plus `llms.txt` and `llms-full.txt`. With the redesign on,
they introduce a design engineer and list the showcase projects.

## Sub-features

- `md-index`: `/index.md` matches the home page.
- `md-projects`: `/projects.md` lists every project.
- `md-llms`: `/llms.txt` lists the live pages and the showcase.

## How to get to it (user POV)

- `/index.md`, `/projects.md`, `/llms.txt`, `/llms-full.txt`.

## Driving it with curl

Preconditions: a build served, with the flags you want to check.

- `curl -s localhost:4321/index.md | head -3` shows "**Design engineer, Auckland.** I design and build interfaces."
  with the redesign on, and the frontend lead intro with it off.
- `curl -s localhost:4321/llms.txt` has no "AI-native" with the redesign on, and every page under Pages answers 200.

## Gotchas

- These are built at build time from the same flags as the pages. Check them on the same build.
