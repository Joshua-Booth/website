#!/usr/bin/env node
import { spawn, execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readlinkSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { connect, createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptPath = fileURLToPath(import.meta.url);

function findRepo(start) {
  let dir = start;

  while (dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, "package.json");

    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

      if (pkg.name === "website") return dir;
    }

    dir = path.dirname(dir);
  }

  return null;
}

const repo = findRepo(process.cwd()) ?? findRepo(path.dirname(scriptPath));

if (!repo) {
  console.error("Run verify-website from the joshuabooth.nz website repo.");
  process.exit(1);
}

const artifactsRoot = path.join(
  repo,
  ".cursor/skills/verify-website/artifacts"
);

function runId() {
  const id = process.env.VERIFY_RUN_ID;

  if (!id || !/^[A-Za-z0-9._-]+$/.test(id)) {
    console.error(
      "Set VERIFY_RUN_ID to a short id such as verify-1. Two runs with different ids can serve side by side."
    );
    process.exit(1);
  }

  return id;
}

function runDir(id) {
  return path.join("/tmp/verify-website", id);
}

function statePath(id) {
  return path.join(runDir(id), "state.json");
}

function readState(id) {
  const file = statePath(id);

  if (!existsSync(file)) {
    throw new Error(
      `No verification instance for VERIFY_RUN_ID=${id}. Launch one before driving it.`
    );
  }

  return JSON.parse(readFileSync(file, "utf8"));
}

function writeState(id, state) {
  const dir = runDir(id);

  mkdirSync(dir, { recursive: true });
  const file = statePath(id);
  const tmp = `${file}.tmp`;

  writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(tmp, file);
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];

      if (next === undefined || next.startsWith("--")) flags[key] = "true";
      else {
        flags[key] = next;
        i += 1;
      }
    } else positional.push(arg);
  }

  return { positional, flags };
}

function gitRev() {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repo,
    encoding: "utf8",
  }).trim();
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function commandLine(pid) {
  return readFileSync(`/proc/${pid}/cmdline`, "utf8").replaceAll("\0", " ");
}

function proofPath(input) {
  if (!input) throw new Error("Pass --path for the proof file.");

  const abs = path.resolve(repo, input);
  const root = `${artifactsRoot}${path.sep}`;

  if (abs !== artifactsRoot && !abs.startsWith(root)) {
    throw new Error(
      `Proof files must live under ${artifactsRoot}. Cleanup never deletes that directory.`
    );
  }

  mkdirSync(path.dirname(abs), { recursive: true });
  return abs;
}

function freePort() {
  const preferred = process.env.VERIFY_PORT;

  if (preferred) {
    if (!/^\d+$/.test(preferred)) {
      throw new Error("VERIFY_PORT must be a number.");
    }

    return Number(preferred);
  }

  return new Promise((resolve, reject) => {
    const probe = createServer();

    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : 0;

      probe.close(() => resolve(port));
    });
  });
}

function portOwnedBy(pid, port) {
  const hex = port.toString(16).toUpperCase().padStart(4, "0");
  const tcp = readFileSync("/proc/net/tcp", "utf8");
  const inodes = new Set();

  for (const line of tcp.split("\n").slice(1)) {
    const parts = line.trim().split(/\s+/);

    if (parts.length < 10) continue;
    if (parts[3] !== "0A") continue;
    if (!parts[1].endsWith(`:${hex}`)) continue;
    inodes.add(parts[9]);
  }

  let fds = [];

  try {
    fds = readdirSync(`/proc/${pid}/fd`);
  } catch {
    return false;
  }

  for (const fd of fds) {
    try {
      const target = readlinkSync(`/proc/${pid}/fd/${fd}`);
      const match = /^socket:\[(\d+)\]$/.exec(target);

      if (match && inodes.has(match[1])) return true;
    } catch {
      // A descriptor can vanish while we read it.
    }
  }

  return false;
}

function requireBuilt() {
  const required = [
    "out/index.html",
    "out/lab.html",
    "out/work/pcos-protocol.html",
    "out/writing/this-site.html",
    "out/404.html",
  ];
  const missing = required.filter((file) => !existsSync(path.join(repo, file)));

  if (missing.length > 0) {
    throw new Error(
      `Missing ${missing.join(", ")}. Build with SITE_FLAGS=all mise run build before launch.`
    );
  }
}

async function waitForHttp(url) {
  const deadline = Date.now() + 20000;
  let last = "no response";

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${url}/`);

      if (res.status === 200) {
        const body = await res.text();

        if (body.includes("Joshua Booth") && body.includes('lang="en-NZ"')) {
          return;
        }

        last = 'homepage did not include Joshua Booth and lang="en-NZ"';
      } else last = `status ${res.status}`;
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }

  throw new Error(`Server never became usable: ${last}`);
}

async function waitUntilInteractive(page) {
  await page.waitForLoadState("load");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.getByRole("heading").first().waitFor({
    state: "visible",
    timeout: 10000,
  });
  await page.waitForFunction(
    () => {
      for (const node of document.querySelectorAll("a, button")) {
        for (const key of Object.keys(node)) {
          if (
            key.startsWith("__reactFiber") ||
            key.startsWith("__reactProps")
          ) {
            return true;
          }
        }
      }

      return false;
    },
    null,
    { timeout: 10000 }
  );
}

function roleLocator(page, flags) {
  if (!flags.role || !flags.name) {
    throw new Error("Pass both --role and --name.");
  }

  return page.getByRole(flags.role, { name: flags.name, exact: true });
}

async function expectVisible(locator) {
  const deadline = Date.now() + 5000;

  while (Date.now() < deadline) {
    const count = await locator.count();

    for (let i = 0; i < count; i += 1) {
      if (await locator.nth(i).isVisible()) return;
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }

  throw new Error("No matching element is visible.");
}

async function handleBrowser(page, baseUrl, request) {
  if (request.action === "goto") {
    if (!request.path || !request.path.startsWith("/")) {
      throw new Error("Pass --path starting with /.");
    }

    const target = new URL(request.path, `${baseUrl}/`);

    await page.goto(target.toString(), { waitUntil: "load" });
    await waitUntilInteractive(page);
    return { url: page.url() };
  }

  if (request.action === "click") {
    const loc = roleLocator(page, request);
    const href = await loc.getAttribute("href");

    await loc.click();

    if (href && !href.startsWith("http") && !href.startsWith("mailto:")) {
      const desired = new URL(href, page.url());

      await page.waitForURL(
        (target) =>
          target.pathname === desired.pathname && target.hash === desired.hash,
        { timeout: 5000 }
      );
    }

    return { url: page.url() };
  }

  if (request.action === "assert") {
    await expectVisible(roleLocator(page, request));
    return { url: page.url() };
  }

  if (request.action === "assert-text") {
    if (!request.text) throw new Error("Pass --text.");

    await expectVisible(page.getByText(request.text, { exact: true }));
    return { url: page.url() };
  }

  if (request.action === "assert-hidden") {
    if (!request.text) throw new Error("Pass --text.");

    const loc = page.getByText(request.text, { exact: true });
    const count = await loc.count();

    for (let i = 0; i < count; i += 1) {
      if (await loc.nth(i).isVisible()) {
        throw new Error(`"${request.text}" is still visible.`);
      }
    }

    return { count };
  }

  if (request.action === "pressed") {
    const value = await roleLocator(page, request).getAttribute("aria-pressed");

    if (value !== request.value) {
      throw new Error(
        `aria-pressed is "${value ?? ""}", expected "${request.value}".`
      );
    }

    return { pressed: value };
  }

  if (request.action === "snapshot") {
    const file = proofPath(request.path);
    const root = request.selector
      ? page.locator(request.selector)
      : page.locator("body");
    const aria = await root.ariaSnapshot();

    writeFileSync(file, aria);
    return { path: file };
  }

  if (request.action === "screenshot") {
    const file = proofPath(request.path);

    if (request.selector) {
      await page.locator(request.selector).screenshot({ path: file });
    } else await page.screenshot({ path: file, fullPage: true });

    return { path: file };
  }

  if (request.action === "clipboard") {
    const text = await page.evaluate(async () =>
      navigator.clipboard.readText()
    );

    return { text };
  }

  if (request.action === "url") return { url: page.url() };

  throw new Error(`Unknown browser action "${request.action}".`);
}

async function daemon(id) {
  requireBuilt();
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  const dir = runDir(id);

  mkdirSync(dir, { recursive: true });
  const serveLog = openSync(path.join(dir, "serve.log"), "a");
  const serveBin = path.join(repo, "node_modules/.bin/serve");
  const serve = spawn(
    serveBin,
    [
      path.join(repo, "out"),
      "--listen",
      `tcp://127.0.0.1:${port}`,
      "--no-clipboard",
      "--no-port-switching",
    ],
    {
      cwd: repo,
      stdio: ["ignore", serveLog, serveLog],
      env: process.env,
    }
  );

  const fail = (error) => {
    writeState(id, {
      phase: "failed",
      pid: process.pid,
      error: error instanceof Error ? error.message : String(error),
    });
    serve.kill("SIGTERM");
    process.exit(1);
  };

  serve.once("exit", (code) => {
    if (code !== null && code !== 0) {
      fail(
        new Error(`serve exited ${code}. See ${path.join(dir, "serve.log")}`)
      );
    }
  });

  let browser;
  let control;

  const shutdown = async () => {
    control?.close();
    if (browser) await browser.close();
    if (alive(serve.pid)) serve.kill("SIGTERM");
    process.exit(0);
  };

  process.on("SIGTERM", () => {
    void shutdown();
  });
  process.on("SIGINT", () => {
    void shutdown();
  });

  try {
    await waitForHttp(url);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      baseURL: `${url}/`,
      viewport: { width: 1280, height: 900 },
      reducedMotion: "reduce",
      colorScheme: "dark",
    });

    await context.grantPermissions(["clipboard-read", "clipboard-write"], {
      origin: url,
    });
    const page = await context.newPage();

    await page.goto(`${url}/`, { waitUntil: "load" });
    await waitUntilInteractive(page);
    await page
      .getByRole("heading", { name: "Joshua Booth", exact: true })
      .waitFor({ state: "visible", timeout: 10000 });

    const socketPath = path.join(dir, "control.sock");

    if (existsSync(socketPath)) rmSync(socketPath);
    let queue = Promise.resolve();

    control = createServer({ allowHalfOpen: true }, (socket) => {
      let buffer = "";

      socket.setEncoding("utf8");
      socket.on("data", (chunk) => {
        buffer += chunk;
        const end = buffer.indexOf("\n");

        if (end === -1) return;
        const raw = buffer.slice(0, end);

        buffer = buffer.slice(end + 1);
        queue = queue.then(async () => {
          try {
            const result = await handleBrowser(page, url, JSON.parse(raw));

            socket.end(`${JSON.stringify({ ok: true, ...result })}\n`);
          } catch (error) {
            socket.end(
              `${JSON.stringify({
                ok: false,
                error: error instanceof Error ? error.message : String(error),
              })}\n`
            );
          }
        });
      });
    });
    await new Promise((resolve, reject) => {
      control.once("error", reject);
      control.listen(socketPath, () => resolve());
    });

    writeState(id, {
      phase: "ready",
      pid: process.pid,
      servePid: serve.pid,
      port,
      url,
      gitRev: gitRev(),
      socketPath,
      readyLine: `Accepting connections at ${url}`,
    });
  } catch (error) {
    if (browser) await browser.close();
    fail(error);
  }
}

function callDaemon(id, payload) {
  const state = readState(id);

  if (state.phase !== "ready") {
    throw new Error(state.error ?? "Verification instance is not ready.");
  }

  return new Promise((resolve, reject) => {
    const socket = connect(state.socketPath);
    let buffer = "";

    socket.setEncoding("utf8");
    socket.on("error", reject);
    socket.on("data", (chunk) => {
      buffer += chunk;
    });
    socket.on("end", () => {
      if (!buffer.trim()) {
        reject(
          new Error("Verification browser closed the socket without a result.")
        );
        return;
      }

      const response = JSON.parse(buffer);

      if (!response.ok) reject(new Error(response.error));
      else resolve(response);
    });
    socket.write(`${JSON.stringify(payload)}\n`);
  });
}

async function launch(id) {
  const existing = existsSync(statePath(id)) ? readState(id) : null;

  if (existing?.pid && alive(existing.pid)) {
    throw new Error(
      `VERIFY_RUN_ID=${id} is already running at ${existing.url}. Clean it up or pick another id.`
    );
  }

  requireBuilt();
  rmSync(runDir(id), { recursive: true, force: true });
  mkdirSync(runDir(id), { recursive: true });
  const logFd = openSync(path.join(runDir(id), "daemon.log"), "a");
  const child = spawn(process.execPath, [scriptPath, "daemon"], {
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: process.env,
    cwd: repo,
  });

  child.unref();

  const deadline = Date.now() + 45000;

  while (Date.now() < deadline) {
    if (!existsSync(statePath(id))) {
      if (!alive(child.pid)) {
        const log = readFileSync(path.join(runDir(id), "daemon.log"), "utf8");

        throw new Error(`Daemon exited before ready.\n${log.slice(-2000)}`);
      }

      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
      continue;
    }

    const state = readState(id);

    if (state.phase === "ready") {
      console.log(state.readyLine);
      console.log(`url ${state.url}`);
      console.log(`pid ${state.pid}`);
      console.log(`git ${state.gitRev}`);
      return;
    }

    if (state.phase === "failed") throw new Error(state.error);
    if (!alive(child.pid)) {
      const log = readFileSync(path.join(runDir(id), "daemon.log"), "utf8");

      throw new Error(`Daemon exited before ready.\n${log.slice(-2000)}`);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }

  throw new Error("Timed out waiting for the verification server and browser.");
}

async function doctor(id) {
  const state = readState(id);
  const checks = [];
  const check = (ok, line) => {
    checks.push({ ok, line });
    console.log(`${ok ? "ok" : "FAIL"} ${line}`);
  };

  if (state.phase !== "ready") {
    check(false, `phase ${state.phase ?? "missing"}`);
  } else check(true, "phase ready");

  const daemonUp =
    typeof state.pid === "number" &&
    alive(state.pid) &&
    commandLine(state.pid).includes("verify-website.mjs") &&
    commandLine(state.pid).includes("daemon");

  check(daemonUp, `daemon pid ${state.pid} is verify-website`);

  const serveUp =
    typeof state.servePid === "number" &&
    alive(state.servePid) &&
    commandLine(state.servePid).includes("serve") &&
    commandLine(state.servePid).includes(`${path.join(repo, "out")}`);

  check(serveUp, `serve pid ${state.servePid} is serving out/`);
  check(
    serveUp && portOwnedBy(state.servePid, state.port),
    `port ${state.port} is owned by the serve pid`
  );
  check(gitRev() === state.gitRev, `git ${state.gitRev}`);

  const routes = [
    ["/", 200, "Joshua Booth"],
    ["/lab", 200, "Lab"],
    ["/work/pcos-protocol", 200, "PCOS"],
    ["/writing/this-site", 200, "How this site is built"],
    ["/not-a-real-page", 404, "Not"],
  ];

  for (const [route, status, snippet] of routes) {
    try {
      const res = await fetch(`${state.url}${route}`);
      const body = await res.text();
      const homeLang = route !== "/" || body.includes('lang="en-NZ"');

      check(
        res.status === status && body.includes(snippet) && homeLang,
        `GET ${route} ${res.status} includes ${snippet}`
      );
    } catch (error) {
      check(
        false,
        `GET ${route} ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  if (checks.some((item) => !item.ok)) process.exitCode = 1;
}

async function cleanup(id) {
  if (!existsSync(statePath(id))) {
    console.log(`nothing to clean for VERIFY_RUN_ID=${id}`);
    return;
  }

  const state = readState(id);

  if (typeof state.pid === "number" && alive(state.pid)) {
    process.kill(state.pid, "SIGTERM");
    const deadline = Date.now() + 8000;

    while (alive(state.pid) && Date.now() < deadline) {
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    }

    if (alive(state.pid)) process.kill(state.pid, "SIGKILL");
  }

  if (typeof state.servePid === "number" && alive(state.servePid)) {
    process.kill(state.servePid, "SIGTERM");
  }

  rmSync(runDir(id), { recursive: true, force: true });
  console.log(`removed ${runDir(id)}`);
  console.log(`kept ${artifactsRoot}`);
}

async function browser(id, positional, flags) {
  const action = positional[0];

  if (!action) throw new Error("Pass a browser action.");

  const response = await callDaemon(id, {
    action,
    role: flags.role,
    name: flags.name,
    path: flags.path,
    text: flags.text,
    selector: flags.selector,
    value: flags.value,
  });

  if (action === "clipboard") console.log(response.text);
  else if (action === "url" || action === "goto" || action === "click") {
    console.log(response.url);
  } else if (response.path) console.log(response.path);
  else console.log("ok");
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const command = positional[0];

if (command === "daemon") {
  await daemon(runId());
} else if (command === "launch") {
  await launch(runId());
} else if (command === "doctor") {
  await doctor(runId());
} else if (command === "cleanup") {
  await cleanup(runId());
} else if (command === "browser") {
  await browser(runId(), positional.slice(1), flags);
} else {
  console.error(
    "Usage: verify-website.mjs <launch|doctor|cleanup|browser> [action] [--role --name --path --text --selector --value]"
  );
  process.exit(1);
}
