/*
  Checa rolagem horizontal e elementos que vazam da janela em várias larguras.
  Serve dist/ por HTTP, abre o Chrome headless e mede via CDP.

    node scripts/overflow-check.mjs [pasta-build] [larguras]
    node scripts/overflow-check.mjs dist 320,360,390,768,1024,1440
*/
import { spawn, execFileSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const root = path.resolve(process.argv[2] ?? "dist");
const widths = (process.argv[3] ?? "320,360,390,768,1024,1440")
  .split(",")
  .map((n) => parseInt(n.trim(), 10))
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".json": "application/json",
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}/index.html`;

function findChrome() {
  const local = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe")
    : null;
  const c = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    local,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  for (const p of c) if (fs.existsSync(p)) return p;
  throw new Error("Chrome não encontrado");
}

const profile = path.join(process.cwd(), ".taste-skill", "chrome-overflow");
fs.mkdirSync(profile, { recursive: true });
// porta de uma execução anterior ficaria obsoleta
fs.rmSync(path.join(profile, "DevToolsActivePort"), { force: true });
const child = spawn(
  findChrome(),
  [
    "--headless=new",
    `--user-data-dir=${profile}`,
    "--remote-debugging-port=0",
    "--no-first-run",
    "--disable-gpu",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const kill = () => {
  if (child.exitCode != null) return;
  try {
    execFileSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
  } catch {
    try {
      child.kill();
    } catch {
      /* já saiu */
    }
  }
};

try {
  const dp = path.join(profile, "DevToolsActivePort");
  let devtools = null;
  for (let i = 0; i < 120 && !devtools; i++) {
    await sleep(100);
    if (fs.existsSync(dp)) {
      const port = fs.readFileSync(dp, "utf8").split("\n")[0].trim();
      if (port) devtools = `http://127.0.0.1:${port}`;
    }
  }
  if (!devtools) throw new Error("Chrome não abriu o porto de depuração");

  const target = await (
    await fetch(`${devtools}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })
  ).json();

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => {
    ws.addEventListener("open", r, { once: true });
    ws.addEventListener("error", () => j(new Error("WebSocket falhou")), { once: true });
  });

  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, { resolve, reject });
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  await send("Page.enable");
  await send("Runtime.enable");

  let failed = false;

  for (const w of widths) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: w,
      height: 900,
      deviceScaleFactor: 1,
      mobile: w < 600,
    });
    await send("Page.navigate", { url });
    await sleep(1200);

    const { result } = await send("Runtime.evaluate", {
      expression: `(() => {
        const vw = document.documentElement.clientWidth;
        const bad = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          if (r.left < -100) continue;              // honeypot / fora de tela proposital
          if (r.right > vw + 1) {
            bad.push(el.tagName.toLowerCase() + '.' + String(el.className).split(' ').filter(Boolean).slice(0,3).join('.') + ' → ' + Math.round(r.right));
          }
        }
        return JSON.stringify({
          scrollW: document.documentElement.scrollWidth,
          vw,
          bad: [...new Set(bad)].slice(0, 8),
        });
      })()`,
      returnByValue: true,
    });

    const data = JSON.parse(result.value);
    const overflow = data.scrollW > data.vw + 1;
    const ok = !overflow && data.bad.length === 0;
    if (!ok) failed = true;
    console.log(
      `${ok ? "OK  " : "FAIL"} ${String(w).padStart(4)}px  scrollW=${data.scrollW} vw=${data.vw}` +
        (data.bad.length ? `\n       ${data.bad.join("\n       ")}` : ""),
    );
  }

  console.log(failed ? "\nOVERFLOW: FAIL" : "\nOVERFLOW: PASS");
  process.exitCode = failed ? 1 : 0;
} catch (err) {
  console.error("OVERFLOW: ERROR —", err.message);
  process.exitCode = 2;
} finally {
  kill();
  server.close();
}
