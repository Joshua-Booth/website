import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";

async function freePort(): Promise<number> {
  const server = createServer().listen(0);

  await once(server, "listening");

  const address = server.address();

  server.close();

  if (!address || typeof address === "string") throw new Error("No free port");

  return address.port;
}

export async function serveBuild(): Promise<string> {
  if (!existsSync("out/index.html")) {
    throw new Error(
      "No build in out/. Run SITE_FLAGS=all mise run build first"
    );
  }

  const port = await freePort();
  const url = `http://localhost:${port}`;

  const child = spawn(
    "serve",
    ["out", "-l", String(port), "--no-port-switching", "--no-clipboard"],
    { stdio: "ignore" }
  );

  child.unref();
  process.on("exit", () => child.kill());

  for (let tries = 0; tries < 50; tries++) {
    try {
      await fetch(url);

      return url;
    } catch {
      await sleep(100);
    }
  }

  throw new Error(`serve didn't answer on ${url}`);
}
