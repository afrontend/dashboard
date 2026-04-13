#!/usr/bin/env node

/**
 * Post-publish smoke test.
 * Verifies that the built artifacts and CLI work correctly end-to-end.
 *
 * Usage:
 *   npm run test:smoke
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const PORT = 1234;
const BASE_URL = `http://localhost:${PORT}`;
const CLI = path.join(__dirname, "cli.js");

let passed = 0;
let failed = 0;

function ok(label) {
  console.log(`  ✓ ${label}`);
  passed++;
}

function fail(label, detail) {
  console.error(`  ✗ ${label}`);
  if (detail) console.error(`    → ${detail}`);
  failed++;
}

function get(urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get(`${BASE_URL}${urlPath}`, (res) => {
        let body = "";
        res.on("data", (d) => (body += d));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      })
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
  );
  console.log(`\nSmoke test: ${pkg.name}@${pkg.version}\n`);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "lbd-smoke-"));
  const server = spawn("node", [CLI], {
    cwd: tmpDir,
    stdio: "pipe",
  });

  server.stderr.on("data", (d) => process.stderr.write(d));

  await sleep(2000);

  try {
    // ── 1. 서버 기동 ────────────────────────────────────────
    const root = await get("/").catch(() => null);
    if (root?.status === 200) {
      ok("서버 기동 (HTTP 200)");
    } else {
      fail("서버 기동 실패", `status: ${root?.status ?? "연결 불가"}`);
      return; // 서버가 없으면 이하 테스트 의미 없음
    }

    // ── 2. local.html 서빙 ──────────────────────────────────
    const localHtml = await get("/local.html");
    if (localHtml.status === 200) {
      ok("local.html 서빙");
    } else {
      fail("local.html 서빙 실패");
    }

    // ── 3. React 공유 청크 서빙 ─────────────────────────────
    const sharedChunk = root.body.match(/src=(dashboard\.[a-f0-9]+\.js)/)?.[1];
    if (sharedChunk) {
      const res = await get(`/${sharedChunk}`);
      if (res.status === 200) {
        ok(`React 공유 청크 서빙 (${sharedChunk})`);
      } else {
        fail("React 공유 청크 서빙 실패", sharedChunk);
      }
    } else {
      fail("local.html에서 공유 청크를 찾을 수 없음");
    }

    // ── 4. bare specifier 없음 (React 정상 번들링) ──────────
    const appChunk = root.body.match(/src=(local\.[a-f0-9]+\.js)/)?.[1];
    if (appChunk) {
      const res = await get(`/${appChunk}`);
      const hasBare = /from"(react|react-dom|@codemirror)/.test(res.body);
      if (!hasBare) {
        ok("React 번들링 정상 (bare specifier 없음)");
      } else {
        fail(
          "React 번들링 실패 — bare specifier 검출",
          "브라우저에서 blank screen 발생"
        );
      }
    } else {
      fail("local.html에서 앱 JS 청크를 찾을 수 없음");
    }

    // ── 5. json/dashboard.json 자동 생성 ────────────────────
    const jsonFile = path.join(tmpDir, "json", "dashboard.json");
    if (fs.existsSync(jsonFile)) {
      const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
      if (Array.isArray(data.urls) && data.urls.length > 0) {
        ok("json/dashboard.json 자동 생성");
      } else {
        fail("json/dashboard.json 형식 오류");
      }
    } else {
      fail("json/dashboard.json 자동 생성 실패");
    }

    // ── 6. JSON HTTP 서빙 ────────────────────────────────────
    const jsonRes = await get("/json/dashboard.json");
    if (jsonRes.status === 200 && JSON.parse(jsonRes.body).urls) {
      ok("json/dashboard.json HTTP 서빙");
    } else {
      fail("json/dashboard.json HTTP 서빙 실패");
    }
  } finally {
    server.kill();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  const total = passed + failed;
  console.log(`\n  ${total}개 중 ${passed}개 통과${failed ? `, ${failed}개 실패` : ""}\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error("\n  오류:", err.message);
  process.exit(1);
});
