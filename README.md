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
