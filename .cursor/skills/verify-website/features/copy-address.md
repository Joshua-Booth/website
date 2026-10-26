# Copy address

Copy address puts contact@joshuabooth.nz on the clipboard from the contact section, and says so in the button label.

## Sub-features

- `copy-reach` reaches the contact section from the main navigation.
- `copy-copied` changes the button label to `Copied`.
- `copy-clipboard` places `contact@joshuabooth.nz` on the clipboard.
- `copy-reset` returns the button label to `Copy address`.

## How to get to it (user POV)

- Open `/`, then choose `Contact` in the main navigation or scroll to the contact section.
- From another page, choose `Contact` in the main navigation. It opens `/#contact`.

## Driving it with verify-website

Preconditions:

- Doctor reports every line `ok`.
- The button is labelled `Copy address` before the click.
- No earlier copy in this journey is still showing `Copied`.

- **Reach contact.** From home, choose `Contact`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser goto --path /` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role link --name "Contact"`. The url ends in `#contact` and the heading `Contact` is visible.
- **See the address.** Confirm the mailto link. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role link --name "contact@joshuabooth.nz"`. The link is visible beside the button.
- **Before the click.** Capture the idle button. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role button --name "Copy address"` and `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --selector "#contact" --path .cursor/skills/verify-website/artifacts/copy-address/before.png`. The screenshot shows `Copy address`.
- **Copy.** Choose `Copy address`. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser click --role button --name "Copy address"`. The button label becomes `Copied`.
- **Proof.** Capture the copied state straight away, with both commands in one line so they run together: `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --selector "#contact" --path .cursor/skills/verify-website/artifacts/copy-address/copied.png & node .cursor/skills/verify-website/bin/verify-website.mjs browser snapshot --aria --selector "#contact" --path .cursor/skills/verify-website/artifacts/copy-address/copied.aria.txt & wait`. The screenshot shows `Copied`, and the snapshot has `button "Copied"` and the link `contact@joshuabooth.nz`.
- **Read the clipboard.** Read the side effect. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser clipboard`. The printed text is `contact@joshuabooth.nz`.
- **Page.** Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser screenshot --path .cursor/skills/verify-website/artifacts/copy-address/page.png`. The page screenshot shows `Joshua Booth`.
- **Reset.** Wait until the label returns. Run `node .cursor/skills/verify-website/bin/verify-website.mjs browser assert --role button --name "Copy address"`. The button is labelled `Copy address` again.

## Gotchas

- The label returns to `Copy address` 1600ms after the click, and each command takes about half a second. Take the copied screenshot and snapshot together, straight after the click, before anything else. Run one after the other, or after the clipboard read, and the screenshot shows `Copy address`. The reset step is the command that waits for that label.
- `Selected` means the clipboard write failed and the address text was highlighted instead. That is a failed copy, not a pass.
- The mailto link and the button are different controls. Clicking the link does not copy.
- A full-page screenshot taken only before the click does not prove the copy.
