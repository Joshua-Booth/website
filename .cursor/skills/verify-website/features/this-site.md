# How this site is built

How this site is built explains how joshuabooth.nz is put together, from the Projects row on the home page.

## Sub-features

- `site-open` opens the write-up from the This site project row.
- `site-page` shows the section about the finished page and reduced motion.
- `site-xray` shows the section about the x-ray.
- `site-lab` shows the Lab section when the Lab flag is on.
- `site-back` returns to the project row.

## How to get to it (user POV)

- On the home page, choose `How it's built` on the This site row. The link's accessible name is `This site How it's built`.
- Open `/writing/this-site`.

## Driving it with verify-website

Preconditions:

- Doctor reports every line `ok`, including `GET /writing/this-site`.
- Home is open.
- The Lab flag is on, so the write-up includes the Lab section.

- **Open from Projects.** Choose the project row. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "This site How it's built"`. The url path is `/writing/this-site`.
- **Read the title.** Confirm the page. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role heading --name "How this site is built"`. The level 1 heading is visible.
- **Page section.** Confirm reduced motion is described. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role heading --name "The page"`. The heading is visible.
- **X-ray section.** Confirm the x-ray section. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role heading --name "The x-ray"`. The heading is visible.
- **Lab section.** Confirm the flagged section. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role heading --name "The Lab"`. The heading is visible. If it is missing, the Lab flag was off. Report that failure.
- **Back to Projects.** Choose `All projects`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "All projects"`. The url ends in `#this-site` and the link `This site How it's built` is visible again.
- **Direct entry.** Open the path. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /writing/this-site`. The heading `How this site is built` is visible.
- **Proof.** Capture the write-up. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser snapshot --aria --path .cursor/skills/verify-website/artifacts/this-site/write-up.aria.txt` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --path .cursor/skills/verify-website/artifacts/this-site/write-up.png`. Both show `How this site is built` and `The x-ray`.

## Gotchas

- The row's accessible name is `This site How it's built`. `How it's built` alone is not the link name.
- `All projects` returns to `/#this-site`. It is not the nav link `Projects`.
- The GitHub link inside the first paragraph opens a new tab. Do not follow it. The in-site proof is the write-up itself.
- The Lab section is omitted when the lab flag is off. Do not delete that step to make the journey pass.
