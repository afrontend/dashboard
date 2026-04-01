# Dashboard

Local web service to show bookmarks

**Live demo:** https://afrontend.github.io/dashboard/

## How to run

### Local file mode

Loads bookmarks from a local JSON file.

```bash
git clone https://github.com/afrontend/dashboard.git
cd dashboard
npm install
mkdir -p dist/json
echo '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"}]}' > dist/json/dashboard.json
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
# Basic usage (uses default bookmarks)
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

### Editor mode

Edit bookmark JSON directly in a CodeMirror editor with live preview. Deployable to GitHub Pages.

```bash
npm run serve:editor
```

## Commands

```bash
npm run serve          # Local file mode development server
npm run serve:editor   # Editor mode development server
npm run dev            # Build then serve (local file mode)
npm run build          # Production build (editor mode) to dist/
npm run watch          # Watch mode without serving
npm run typecheck      # Run TypeScript type checking
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix ESLint issues
npm run deploy         # Deploy editor mode to GitHub Pages
```

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
- **Save** (💾) — Encodes bookmark data into the URL for sharing
- **Clear** (✕) — Resets to default state

## Tech stack

- **React 18** with **TypeScript**
- **Parcel** — Build tool and dev server
- **CodeMirror** — JSON editor with syntax highlighting and validation
- **Pico CSS** + **Tailwind CSS** — Styling
- **GitHub Pages** — Deployment via `gh-pages`
