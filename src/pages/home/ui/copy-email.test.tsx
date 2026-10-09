// @vitest-environment happy-dom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { CopyEmail } from "./copy-email";

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

function renderCopyEmail() {
  render(
    <>
      <a id="address" href="mailto:contact@joshuabooth.nz">
        contact@joshuabooth.nz
      </a>
      <CopyEmail addressId="address" />
    </>
  );
}

function liveRegion() {
  const region = document.querySelector('[aria-live="polite"]');

  if (!region) {
    throw new Error("no polite live region");
  }

  return region;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("announces Copied after copying, then clears when the label resets", async () => {
  stubClipboard(() => Promise.resolve());
  renderCopyEmail();

  expect(liveRegion().textContent).toBe("");

  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });

  expect(liveRegion().textContent).toBe("Copied");

  act(() => {
    vi.advanceTimersByTime(1601);
  });

  expect(liveRegion().textContent).toBe("");
});

it("announces Selected when the clipboard refuses", async () => {
  stubClipboard(() => Promise.reject(new Error("denied")));
  renderCopyEmail();

  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
  });

  expect(liveRegion().textContent).toBe("Selected");
  expect(getSelection()?.toString()).toBe("contact@joshuabooth.nz");
});
