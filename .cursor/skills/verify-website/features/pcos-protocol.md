# PCOS Protocol

PCOS Protocol is the case study for the course app Joshua designed and built for The PCOS Nutritionist.

## Sub-features

- `pcos-open` opens the case study from the Work row.
- `pcos-facts` shows the client, dates, role, and stack.
- `pcos-cuts` lists what was left out of version one.
- `pcos-back` returns to the Work row on the home page.

## How to get to it (user POV)

- On the home page, choose `Case study` on The PCOS Nutritionist row. The link's accessible name is `The PCOS Nutritionist Case study`.
- Open `/work/pcos-protocol`.

## Driving it with verify-website

Preconditions:

- Doctor reports every line `ok`, including `GET /work/pcos-protocol`.
- Home is open.

- **Open from Work.** Choose the case study row. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "The PCOS Nutritionist Case study"`. The url path is `/work/pcos-protocol`.
- **Read the title.** Confirm the page. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role heading --name "PCOS Protocol"`. The level 1 heading is visible.
- **Read the facts.** Confirm the client line. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-text --text "The PCOS Nutritionist"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-text --text "React, Django, Azure"`. Both lines are visible.
- **Read the cuts.** Confirm a cut item. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert-text --text "Chatbot"`. The list item is visible.
- **Back to Work.** Choose `All work`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "All work"`. The url ends in `#pcos-protocol` and the link `The PCOS Nutritionist Case study` is visible again.
- **Direct entry.** Open the path. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /work/pcos-protocol`. The heading `PCOS Protocol` is visible.
- **Proof.** Capture the case study. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser snapshot --aria --path .cursor/skills/verify-website/artifacts/pcos-protocol/study.aria.txt` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --path .cursor/skills/verify-website/artifacts/pcos-protocol/study.png`. Both show `PCOS Protocol` and `The PCOS Nutritionist`.

## Gotchas

- The row's accessible name is `The PCOS Nutritionist Case study`, not `Case study` alone.
- `All work` returns to `/#pcos-protocol` on the home page. It is not a link named `Work`.
- Without the pcos-case-study flag the row is plain text and `/work/pcos-protocol` is a not-found page. Doctor catches that. Do not prove the row from the home text alone.
