import { expect, fn, waitFor } from "storybook/test";

import { EMAIL } from "@/shared/config/site";

import preview from "../../../../.storybook/preview";
import { COPY_RESET_MS } from "../model/copy-labels";
import { CopyEmail } from "./copy-email";

function stubClipboard(writeText: Clipboard["writeText"]) {
  const { clipboard } = navigator;
  const original = clipboard.writeText.bind(clipboard);

  clipboard.writeText = writeText;

  return () => {
    clipboard.writeText = original;
  };
}

const meta = preview.meta({
  component: CopyEmail,
  beforeEach: () => stubClipboard(fn(() => Promise.resolve())),
  args: { addressId: "address" },
  render: (args) => (
    <>
      <span id={args.addressId}>{EMAIL}</span> <CopyEmail {...args} />
    </>
  ),
});

export const Default = meta.story();

function liveRegion(canvasElement: HTMLElement) {
  const region = canvasElement.querySelector("[aria-live=polite]");

  if (!(region instanceof HTMLElement)) {
    throw new TypeError("No polite live region");
  }

  return region;
}

Default.test(
  "announces Copied, then clears after the reset",
  async ({ canvas, canvasElement, userEvent }) => {
    const region = liveRegion(canvasElement);

    await expect(region).toHaveTextContent("");

    await userEvent.click(canvas.getByRole("button", { name: "Copy address" }));

    await waitFor(() => expect(region).toHaveTextContent("Copied"));

    await waitFor(() => expect(region).toHaveTextContent(""), {
      timeout: COPY_RESET_MS * 2,
    });
  }
);

Default.test(
  "a repeat press inside the reset stays silent",
  async ({ canvas, canvasElement, userEvent }) => {
    const region = liveRegion(canvasElement);
    const button = canvas.getByRole("button", { name: "Copy address" });

    await userEvent.click(button);
    await waitFor(() => expect(region).toHaveTextContent("Copied"));

    const changes: MutationRecord[] = [];

    const observer = new MutationObserver((records) => {
      changes.push(...records);
    });

    observer.observe(region, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    await userEvent.click(button);
    observer.disconnect();

    await expect(changes).toHaveLength(0);
    await expect(region).toHaveTextContent("Copied");
  }
);

Default.test(
  "announces Selected when the clipboard write is rejected",
  {
    beforeEach: () =>
      stubClipboard(
        fn().mockRejectedValue(new DOMException("Blocked", "NotAllowedError"))
      ),
  },
  async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Copy address" }));

    await waitFor(() =>
      expect(liveRegion(canvasElement)).toHaveTextContent("Selected")
    );

    await expect(getSelection()?.toString()).toBe(EMAIL);
  }
);
