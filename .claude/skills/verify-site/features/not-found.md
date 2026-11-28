# Missing page

Any address that isn't a page gets the 404 page: "Page not found", a link home, the email address and three
projects.

## Sub-features

- `404-content`: heading, link home, email, three tiles.
- `404-status`: the server answers 404.

## How to get to it (user POV)

- Any mistyped address, such as `/not-a-page`.

## Driving it with Playwright

Preconditions: a build, served.

- `curl -s -o /dev/null -w '%{http_code}' localhost:4321/not-a-page` prints 404.
- Load `/not-a-page`. The `h1` is "Page not found", and "Go to the home page" goes to `/`.

## Gotchas

- The browser logs the 404 as a console error. The audit ignores that one message and no other.
- The error page (`app/error.tsx`) only shows when a page throws in the browser. There is no address for it, so a
  static build can't show it. Check it in a unit test or by throwing in dev, and say which you did.
