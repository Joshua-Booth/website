import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

describe("document language", () => {
  it("sets html lang to en-NZ to match og:locale", () => {
    const layout = readFileSync(`${ROOT}/app/layout.tsx`, "utf8");

    const metadata = readFileSync(
      `${ROOT}/src/shared/lib/page-metadata.ts`,
      "utf8"
    );

    expect(layout).toMatch(/\blang="en-NZ"/);
    expect(metadata).toMatch(/locale:\s*"en_NZ"/);
  });
});
