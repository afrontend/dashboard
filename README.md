# Dashboard

Local web service to show bookmarks

**Live demo:** https://afrontend.github.io/dashboard/

## How to run

### npx (권장)

설치 없이 즉시 실행:

```bash
npx local-bookmark-dash
```

처음 실행 시 현재 디렉토리에 `json/dashboard.json`을 자동 생성합니다.
`json/dashboard.json`을 편집해 북마크를 추가하세요.

브라우저에서 http://localhost:1234 로 접속합니다.

기존 JSON 파일을 사용하려면 `--config`로 경로를 지정할 수 있습니다:

```bash
npx local-bookmark-dash --config ./my-bookmarks.json
npx local-bookmark-dash --config /home/user/bookmarks.json
```

### Local file mode

Loads bookmarks from a local JSON file.

```bash
git clone https://github.com/afrontend/dashboard.git
cd dashboard
npm install
mkdir -p json
echo '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"}]}' > json/dashboard.json
npm run serve
```

### Docker

Run the local file mode in a Docker container. The container automatically sets up dependencies and creates a default bookmark JSON file.

#### Build locally

**Build the image:**

```bash
docker build -t dashboard .
```

**Run the container:**

```bash
# Basic usage (uses default bookmarks: Google, GitHub)
# Without a volume mount, the container uses the default json/dashboard.json created during build
docker run -p 1234:1234 dashboard

# With custom bookmarks (mount local json file)
docker run -p 1234:1234 -v $(pwd)/json:/app/json dashboard

# Run in background
docker run -d -p 1234:1234 --name dashboard dashboard
```

Then open http://localhost:1234 in your browser.

#### Use pre-built image from GHCR

Docker images are automatically built and published to GitHub Container Registry on every push to `main` and for tagged releases.

**Pull and run the latest image:**

```bash
docker run -p 1234:1234 ghcr.io/afrontend/dashboard:latest
```

**Use a specific version:**

```bash
docker run -p 1234:1234 ghcr.io/afrontend/dashboard:v1.0.2
```

**With custom bookmarks:**

```bash
docker run -p 1234:1234 -v $(pwd)/json:/app/json ghcr.io/afrontend/dashboard:latest
```

#### Custom bookmarks

Create a `json/dashboard.json` file:

```json
{
  "urls": [
    { "emoji": "🍑", "label": "Google", "url": "https://google.com" },
    { "emoji": "📚", "label": "GitHub", "url": "https://github.com" }
  ]
}
```

Then mount it when running:

```bash
docker run -p 1234:1234 -v $(pwd)/json:/app/json dashboard
```

#### Setup and Automation

This repository uses GitHub Actions for automatic Docker image building and publishing to GHCR.

**How it works:**

- Every push to `main` automatically builds and publishes a `latest` image
- Every git tag (e.g., `v1.0.0`) automatically creates a versioned image
- Pull requests trigger a build test (without publishing)

**Check build status:**

1. Go to [GitHub Actions](https://github.com/afrontend/dashboard/actions) to monitor automated builds
2. After the first successful build, make the package public (optional):
   - Go to your package settings on GitHub
   - Set visibility to "Public" for public access
3. Release a new version:
   ```bash
   npm run release
   ```
   This bumps the patch version in `package.json`, creates a git commit and tag, and pushes everything to origin. GitHub Actions will automatically build and publish the new image to GHCR.

### Editor mode

Edit bookmark JSON directly in a CodeMirror editor with live preview. Deployable to GitHub Pages.

```bash
npm run serve:editor
```

> **No backend required — your data lives in the URL.** When you click **Save** (💾), the entire bookmark dataset is encoded into the page URL. Bookmark that URL or share it, and you get your full dashboard back anywhere — no database, no account, no server-side storage.

## Commands

```bash
npm run serve          # Local file mode development server
npm run serve:editor   # Editor mode development server
npm run dev            # Build then serve (local file mode)
npm run build          # Production build (editor mode) to dist/
npm run build:npm      # Production build for npm publish (bundles React, no source maps)
npm run watch          # Watch mode without serving
npm run typecheck      # Run TypeScript type checking
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run test           # Run unit tests
npm run test:smoke     # Run smoke test against local build
npm run deploy         # Deploy editor mode to GitHub Pages
```

## Publishing to npm

```bash
# 1. 버전 업
npm version patch   # 또는 minor / major

# 2. npm용 빌드
npm run build:npm

# 3. 스모크 테스트 — 빌드 산출물이 실제로 동작하는지 확인
npm run test:smoke

# 4. 배포
npm publish
```

### Smoke test 항목

`npm run test:smoke`는 publish 전에 다음을 검증합니다:

- 서버가 정상 기동되는지 (HTTP 200)
- `local.html`과 JS 번들이 올바르게 서빙되는지
- React가 번들에 포함되어 있는지 (bare specifier 없음 — 브라우저 blank screen 방지)
- `json/dashboard.json`이 자동 생성되는지
- JSON 파일이 HTTP로 서빙되는지

## Bookmark data format

```json
{
  "urls": [
    { "emoji": "🍑", "label": "Google", "url": "https://google.com" },
    { "emoji": "🌤", "label": "Daily", "url": "" }
  ]
}
```

Each bookmark has optional `emoji`, `label`, and `url` fields. Entries without a `url` are displayed as plain text.

## Keyboard shortcuts

- **S** — Open search filter
- **Escape** — Close search filter

## Editor mode features

- **Editor toggle** — iOS-style toggle switch to show/hide the CodeMirror editor
- **Import** (📂) — Load bookmarks from a JSON file
- **Export** (↧) — Download bookmarks as a JSON file
- **Save** (💾) — Encodes the entire bookmark dataset into the URL. The URL becomes your storage: bookmark it in your browser or share it to restore the full dashboard anywhere, with no backend needed.
- **Clear** (✕) — Resets to default state

## Architecture

### Development server

The app uses a custom Node.js HTTP server (`server.js`) that:

- Serves JSON files (`.json`) directly from the filesystem
- Proxies all other requests to Parcel (on port 1235)

This approach bypasses Parcel's SPA routing for static JSON files while maintaining full support for hot reloading and bundling.

### Entry points

- **Local file mode** (`local.html` → `src/local.tsx`) — Loads bookmarks from `json/dashboard.json`
- **Editor mode** (`index.html` → `src/index.tsx`) — Editable bookmarks with CodeMirror, deployable to GitHub Pages

## Tech stack

- **React 18** with **TypeScript**
- **Parcel 2.8** — Bundler and dev server
- **CodeMirror** — JSON editor with syntax highlighting and validation
- **Pico CSS** + **Tailwind CSS** — Styling
- **GitHub Pages** — Deployment via `gh-pages`
- **GitHub Actions** — Automated Docker image building to GHCR

## Project structure

```
.
├── src/                          # React application code
│   ├── index.tsx                # Editor mode entry point
│   └── local.tsx                # Local file mode entry point
├── components/                   # React components
│   ├── EditorApp.tsx            # Editor mode app
│   ├── LocalApp.tsx             # Local file mode app
│   ├── BookmarksInFile.tsx      # Loads bookmarks from JSON file
│   ├── BookmarksInURL.tsx       # CodeMirror JSON editor
│   ├── SearchableBookmarkList.tsx
│   ├── BookmarkJsonData.tsx     # Bookmark rendering
│   └── ErrorBoundary.tsx        # Error handling
├── hooks/                        # Custom React hooks
│   └── useEditorVisible.tsx     # Visibility toggle state
├── js/                           # Utilities
│   └── utils.ts                 # JSON parsing and validation
├── json/                         # Bookmark data directory (local development)
├── server.js                     # Custom HTTP server (dev mode)
├── Dockerfile                    # Docker image definition
├── index.html                    # Editor mode HTML template
├── local.html                    # Local file mode HTML template
└── package.json                  # Project dependencies and scripts
```
