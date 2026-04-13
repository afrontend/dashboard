#!/usr/bin/env node

const http = require("http");
const fs = require("fs");
const path = require("path");

const DEFAULT_JSON = JSON.stringify(
  {
    urls: [
      { emoji: "🌐", label: "Google", url: "https://google.com" },
      { emoji: "📚", label: "GitHub", url: "https://github.com" },
    ],
  },
  null,
  2,
);

function ensureDefaultJson(cwd) {
  const jsonDir = path.join(cwd, "json");
  const filePath = path.join(jsonDir, "dashboard.json");
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(jsonDir, { recursive: true });
    fs.writeFileSync(filePath, DEFAULT_JSON);
    console.log(`Created default bookmark file: ${filePath}`);
  }
}

module.exports = { ensureDefaultJson };

const MIME = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".map": "application/json",
};

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, {
        "Content-Type": MIME[ext] || "application/octet-stream",
      });
      res.end(data);
    }
  });
}

if (require.main === module) {
  const PORT = 1234;
  const distDir = path.join(__dirname, "..", "dist");
  const cwd = process.cwd();

  const configIdx = process.argv.indexOf("--config");
  const configArg = configIdx !== -1 ? process.argv[configIdx + 1] : null;
  const configPath = configArg
    ? path.isAbsolute(configArg)
      ? configArg
      : path.resolve(cwd, configArg)
    : null;

  if (configPath) {
    if (!fs.existsSync(configPath)) {
      console.error(`Error: config file not found: ${configPath}`);
      process.exit(1);
    }
  } else {
    ensureDefaultJson(cwd);
  }

  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;

    if (pathname === "/json/dashboard.json") {
      serveStatic(res, configPath || path.join(cwd, "json", "dashboard.json"));
    } else if (pathname.endsWith(".json")) {
      serveStatic(res, path.join(cwd, pathname));
    } else {
      const target = pathname === "/" ? "/local.html" : pathname;
      serveStatic(res, path.join(distDir, target));
    }
  });

  const displayPath = configPath || path.join(cwd, "json", "dashboard.json");
  server.listen(PORT, () => {
    console.log(`\n  Dashboard running at http://localhost:${PORT}`);
    console.log(`  Bookmarks: ${displayPath}`);
    console.log(`\n  Ctrl+C to stop\n`);
  });

  process.on("SIGINT", () => {
    server.close();
    process.exit();
  });
}
