# npx 지원 및 npm 배포 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `npx local-bookmark-dash` 한 줄로 북마크 대시보드를 즉시 실행할 수 있도록 CLI를 만들고 npm에 배포한다.

**Architecture:** `bin/cli.js`를 신규 생성해 npx 진입점으로 사용한다. 정적 파일은 패키지의 `dist/`에서, JSON 데이터는 사용자의 현재 디렉토리(`process.cwd()/json/`)에서 서빙한다. `cli.js`는 기존 `server.js`와 동일하게 CommonJS(`require`)로 작성한다. 기존 `server.js`(개발 전용)는 변경하지 않는다.

**Tech Stack:** Node.js HTTP (내장), Parcel 2 (빌드), Vitest (테스트), CommonJS

---

## 파일 변경 맵

| 작업 | 파일 | 역할 |
|------|------|------|
| 신규 생성 | `bin/cli.js` | npx 진입점, 기본 JSON 생성, HTTP 서버 |
| 신규 생성 | `bin/cli.test.ts` | ensureDefaultJson 단위 테스트 |
| 수정 | `package.json` | name, bin, files, main, engines, keywords, build:npm |
| 수정 | `README.md` | npx 사용법 추가 |

---

### Task 1: bin/cli.js — 기본 JSON 생성 로직 TDD

**Files:**
- Create: `bin/cli.js`
- Create: `bin/cli.test.ts`

- [ ] **Step 1: `bin/` 디렉토리 생성 및 빈 cli.js 작성**

```bash
mkdir -p bin
```

`bin/cli.js` 파일을 생성 (빈 파일):

```js
#!/usr/bin/env node
```

- [ ] **Step 2: 실패하는 테스트 작성**

`bin/cli.test.ts` 생성:

```ts
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
// vitest는 CJS 모듈 interop을 지원하므로 require 스타일 모듈도 import 가능
import { ensureDefaultJson } from "./cli.js";

describe("ensureDefaultJson", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dash-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("json/dashboard.json이 없으면 기본 파일을 생성한다", () => {
    ensureDefaultJson(tmpDir);
    const filePath = path.join(tmpDir, "json", "dashboard.json");
    expect(fs.existsSync(filePath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    expect(data.urls).toHaveLength(2);
    expect(data.urls[0]).toHaveProperty("url");
  });

  it("json/dashboard.json이 이미 있으면 덮어쓰지 않는다", () => {
    const jsonDir = path.join(tmpDir, "json");
    fs.mkdirSync(jsonDir);
    const filePath = path.join(jsonDir, "dashboard.json");
    const existing = JSON.stringify({ urls: [{ label: "existing" }] });
    fs.writeFileSync(filePath, existing);

    ensureDefaultJson(tmpDir);

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    expect(data.urls[0].label).toBe("existing");
  });
});
```

- [ ] **Step 3: 테스트 실행 — 실패 확인**

```bash
npx vitest run bin/cli.test.ts
```

Expected: FAIL — `ensureDefaultJson` not exported from `./cli.js`

- [ ] **Step 4: `bin/cli.js`에 `ensureDefaultJson` 구현**

`bin/cli.js` 전체 내용:

```js
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
```

- [ ] **Step 5: 테스트 실행 — 통과 확인**

```bash
npx vitest run bin/cli.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 6: 커밋**

```bash
git add bin/cli.js bin/cli.test.ts
git commit -m "feat: add ensureDefaultJson with tests"
```

---

### Task 2: bin/cli.js — HTTP 서버 추가

**Files:**
- Modify: `bin/cli.js`

`module.exports` 줄 아래에 다음 HTTP 서버 코드를 추가한다. `module.exports` 줄은 유지한다.

- [ ] **Step 1: MIME 타입 맵 및 서버 시작 코드 추가**

`bin/cli.js`에서 `module.exports = { ensureDefaultJson };` 줄 **아래에** 다음을 추가한다:

```js
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

// require()로 import된 경우(테스트)에는 서버를 시작하지 않음
if (require.main === module) {
  const PORT = 1234;
  const distDir = path.join(__dirname, "..", "dist");
  const cwd = process.cwd();

  ensureDefaultJson(cwd);

  const server = http.createServer((req, res) => {
    const pathname = new URL(req.url, "http://localhost").pathname;

    if (pathname.endsWith(".json")) {
      // JSON 파일은 사용자 현재 디렉토리에서 서빙
      serveStatic(res, path.join(cwd, pathname));
    } else {
      // 나머지는 패키지 dist/ 에서 서빙, 루트는 local.html로
      const target = pathname === "/" ? "/local.html" : pathname;
      serveStatic(res, path.join(distDir, target));
    }
  });

  server.listen(PORT, () => {
    console.log(`\n  Dashboard running at http://localhost:${PORT}`);
    console.log(`  Bookmarks: ${path.join(cwd, "json", "dashboard.json")}`);
    console.log(`\n  Ctrl+C to stop\n`);
  });

  process.on("SIGINT", () => {
    server.close();
    process.exit();
  });
}
```

- [ ] **Step 2: 기존 테스트가 여전히 통과하는지 확인**

```bash
npx vitest run bin/cli.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 3: 커밋**

```bash
git add bin/cli.js
git commit -m "feat: add HTTP server to cli.js"
```

---

### Task 3: package.json 수정

**Files:**
- Modify: `package.json`

- [ ] **Step 1: package.json의 다음 항목들을 변경/추가**

변경할 필드들 (나머지는 그대로 유지):

```json
{
  "name": "local-bookmark-dash",
  "main": "bin/cli.js",
  "bin": {
    "local-bookmark-dash": "./bin/cli.js"
  },
  "files": [
    "bin",
    "dist"
  ],
  "engines": {
    "node": ">=16"
  },
  "keywords": [
    "dashboard",
    "bookmarks",
    "local",
    "npx"
  ]
}
```

`"private": true` 줄을 **삭제**한다.

`scripts`에 `"build:npm"` 추가:
```json
"build:npm": "parcel build index.html local.html --no-cache --public-url ./"
```

- [ ] **Step 2: 전체 테스트 통과 확인**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 3: 커밋**

```bash
git add package.json
git commit -m "feat: configure package.json for npm publish"
```

---

### Task 4: npm 빌드 실행 및 로컬 검증

**Files:**
- Modify: `dist/` (빌드 결과물 갱신)

- [ ] **Step 1: 기존 dist 정리 후 npm용 빌드**

```bash
rm -rf dist
npm run build:npm
```

Expected: `dist/` 폴더 생성됨

- [ ] **Step 2: dist에 local.html 존재 확인**

```bash
ls dist/
```

Expected: `local.html` 파일이 목록에 있음

- [ ] **Step 3: 로컬 테스트 — 임시 디렉토리에서 cli 실행**

```bash
mkdir -p /tmp/dash-test
cd /tmp/dash-test
node /Users/bob/src/dashboard/bin/cli.js
```

Expected 출력:
```
Created default bookmark file: /tmp/dash-test/json/dashboard.json

  Dashboard running at http://localhost:1234
  Bookmarks: /tmp/dash-test/json/dashboard.json

  Ctrl+C to stop
```

브라우저에서 `http://localhost:1234` 접속 → 북마크 대시보드 표시 확인 후 Ctrl+C로 종료

- [ ] **Step 4: 원래 디렉토리로 복귀 후 커밋**

```bash
cd /Users/bob/src/dashboard
git add dist/
git commit -m "build: rebuild dist for npm publish"
```

---

### Task 5: README 업데이트

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README의 `## How to run` 섹션 바로 아래에 npx 섹션 추가**

```markdown
### npx (권장)

설치 없이 즉시 실행:

```bash
npx local-bookmark-dash
```

처음 실행 시 현재 디렉토리에 `json/dashboard.json`을 자동 생성합니다.
`json/dashboard.json`을 편집해 북마크를 추가하세요.

브라우저에서 http://localhost:1234 로 접속합니다.
```

- [ ] **Step 2: 커밋**

```bash
git add README.md
git commit -m "docs: add npx usage to README"
```

---

### Task 6: npm publish

- [ ] **Step 1: npm 로그인 확인**

```bash
npm whoami
```

Expected: npm 사용자명 출력. 로그인 안 되어 있으면 `! npm login` 을 실행해 로그인

- [ ] **Step 2: 패키지 포함 파일 미리 확인**

```bash
npm pack --dry-run
```

Expected: `bin/cli.js`, `dist/` 파일들, `package.json`, `README.md`, `LICENSE` 만 포함됨.
`src/`, `components/`, `server.js`, `node_modules/` 등이 **없는지** 확인.

- [ ] **Step 3: npm publish**

```bash
npm publish
```

Expected: `+ local-bookmark-dash@1.0.4` 출력

- [ ] **Step 4: 배포 검증 — 별도 디렉토리에서 npx 실행**

```bash
mkdir /tmp/npx-verify
cd /tmp/npx-verify
npx local-bookmark-dash
```

Expected: 서버 시작, `json/dashboard.json` 자동 생성, `http://localhost:1234` 접속 가능
