# joshuabooth.nz

[![Netlify Status](https://api.netlify.com/api/v1/badges/01601b5d-95b6-48ee-9a01-307dbf2cb079/deploy-status)](https://app.netlify.com/sites/joshuabooth/deploys)

My personal site, built with Next.js and StyleX and deployed on Netlify.

## Commands

The Node version comes from `.node-version` and the pnpm version from `mise.toml`, both installed by [mise](https://mise.jdx.dev).

| Command             | Action                                                           |
| :------------------ | :--------------------------------------------------------------- |
| `pnpm install`      | Install dependencies                                             |
| `mise run dev`      | Start the dev server at `localhost:3000`                         |
| `mise run build`    | Build the static site into `out/`                                |
| `mise run preview`  | Serve `out/` locally                                             |
| `mise run check`    | Format, lint, stylelint, types, structure, knip, spelling, tests |
| `mise run test:run` | Run the unit tests                                               |
| `mise run audit`    | Run the overlap, navigation and hover audits against `preview`   |

## Structure

Routes live in `app/`. Everything else follows [Feature-Sliced Design](https://feature-sliced.design) in `src/`:
`app` (global styles and fonts), `pages`, `widgets`, `features` (the page effects), `entities` (the Lab tiles)
and `shared`.
