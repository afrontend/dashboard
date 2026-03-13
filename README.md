# Dashboard

Local web service to show bookmarks

## How to run

JSON files in the `dist/json/` directory store bookmarks and text to copy.

```bash
git clone https://github.com/afrontend/dashboard.git
cd dashboard
npm install
mkdir -p dist/json
echo '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"}]}' > dist/json/dashboard.json
echo '[{"content":"This is a text for copy"}]' > dist/json/text.json
npm run serve
```

## Build

```bash
npm run build        # Production build to dist/
npm run serve        # Development server with hot reload
npm run watch        # Watch mode without serving
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run deploy       # Deploy to GitHub Pages
```

## Usage

The app has two modes, toggled via a switch in the header:

- **File mode** (default): Loads bookmarks from JSON files in the `json/` directory.
- **Manual mode**: Edit bookmark JSON directly in a CodeMirror editor with live preview.

### Bookmark data format

```json
{
  "urls": [
    { "emoji": "🍑", "label": "Google", "url": "https://google.com" },
    { "emoji": "🌤", "label": "Daily", "url": "" }
  ]
}
```

Each bookmark has optional `emoji`, `label`, and `url` fields. Entries without a `url` are displayed as plain text.

### Keyboard shortcuts

- **S** — Open search filter (file mode)
- **Escape** — Close search filter

### Options

- **Show URL** — Toggle to display bookmark URLs below each link.
