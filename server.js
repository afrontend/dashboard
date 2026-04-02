const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 1234;

// Start Parcel build process in background
const { spawn } = require("child_process");
const parcel = spawn("parcel", ["local.html", "--no-cache", "--port", "1235"], {
  stdio: "inherit",
});

// Create a simple HTTP server for static files
const server = http.createServer((req, res) => {
  // Extract pathname without query string
  const pathname = new URL(req.url, "http://localhost").pathname;

  // Serve JSON files directly from the filesystem
  if (pathname.endsWith(".json")) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File not found" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
  } else {
    // Proxy other requests to Parcel on port 1235
    const proxyReq = http.request(
      { hostname: "localhost", port: 1235, path: req.url, method: req.method },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      },
    );
    proxyReq.on("error", () => {
      res.writeHead(502);
      res.end("Bad Gateway");
    });
    req.pipe(proxyReq);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  server.close();
  parcel.kill();
  process.exit();
});
