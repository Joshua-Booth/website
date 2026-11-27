# Header and in-page links

The white header has the name (except on the home page) and Projects, Work and Contact. Work and Contact go to
sections of the home page.

## Sub-features

- `header-projects`: goes to `/projects`.
- `header-home`: the name goes to `/`.
- `header-sections`: Work and Contact scroll to their section, and the next Tab starts there.

## How to get to it (user POV)

- Any page, top of the page.

## Driving it with Playwright

Preconditions: redesign build, served.

- From `/`, click `nav[aria-label="Main"] a[href="/projects"]`. The URL is `/projects` and the `h1` is "Projects".
- Click `#top a[href="/"]`. The URL is `/`.
- Click `nav[aria-label="Main"] a[href$="#work"]`. The URL ends `#work`, `document.activeElement.id` is `work`,
  and the next Tab lands on the first link or button after the Work section starts.
- Do the same for Contact. The next Tab lands on the email address.
- Repeat the round and compare listener counts on `window`, `document` and `<html>` through CDP. They shouldn't grow.

## Gotchas

- Next's links change the URL with `pushState`, so `hashchange` never fires. Wait for the URL, not the event.
