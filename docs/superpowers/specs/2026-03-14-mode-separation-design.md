# Mode Separation Design

## Overview

Separate the bookmark dashboard's two modes (editor mode and local file mode) into independent entry points, add editor hide/show toggle, and share search functionality across both modes.

## Goals

- Eliminate the checkbox toggle that switches between unrelated features
- Editor mode (`index.html`): deployable to GitHub Pages, standalone bookmark editor
- Local file mode (`local.html`): local-only, reads `json/dashboard.json`
- Add editor hide/show toggle with localStorage persistence
- Add `s` key search to editor mode (currently only in local file mode)

## Entry Points

### Editor Mode — `index.html` + `src/index.tsx` → `EditorApp`

- Deployed to GitHub Pages
- CodeMirror JSON editor + live bookmark preview
- Save/Clear buttons (visible when editor is shown)
- Editor toggle: `◀ Hide` / `▶ Edit` button
- `s` key search on bookmark list

### Local File Mode — `local.html` + `src/local.tsx` → `LocalApp`

- Local development only
- Fetches `json/dashboard.json` and renders bookmarks
- `s` key search (existing behavior, moved to shared component)

## Component Changes

### New Files

- `local.html` — HTML entry for local mode (copy of `index.html` with different script src)
- `src/local.tsx` — React entry rendering `LocalApp`
- `src/EditorApp.tsx` — Editor mode app component
- `src/LocalApp.tsx` — Local file mode app component
- `hooks/useEditorVisible.tsx` — localStorage-persisted editor visibility toggle

### Modified Files

- `components/BookmarkJsonData.tsx` — Add `s` key search UI and filtering logic (moved from `BookmarksInFile`)
- `components/BookmarksInFile.tsx` — Remove search logic (now in `BookmarkJsonData`)
- `package.json` — Update npm scripts

### Deleted Files

- `src/App.tsx` — Replaced by `EditorApp` and `LocalApp`
- `hooks/useLocalFileFlag.tsx` — No longer needed (no mode toggle)

## Editor Toggle Design

- Button positioned at top-left of editor area: `◀ Hide` / `▶ Edit`
- `useEditorVisible` hook: reads/writes localStorage key `"editorVisible"`, default `true`
- Editor visible: left 5/12 editor + right 7/12 bookmark list + Save/Clear buttons
- Editor hidden: bookmark list expands to full width, Save/Clear hidden

## Search Feature (Shared)

- Implemented inside `BookmarkJsonData`
- `s` key: opens search input above bookmark list, real-time filtering by label
- `Escape`: closes search, resets filter
- When CodeMirror editor has focus, `s` key goes to editor (no conflict)

## NPM Scripts

```json
{
  "serve": "parcel local.html --no-cache",
  "serve:editor": "parcel index.html --no-cache",
  "build": "parcel build index.html --no-cache",
  "deploy": "gh-pages -d dist"
}
```

- `npm run serve` — local file mode development (primary local use)
- `npm run serve:editor` — editor mode development/testing
- `npm run build` / `npm run deploy` — editor mode only (GitHub Pages)

## Shared Components

Both modes share:
- `BookmarkJsonData` — rendering + search
- `ErrorBoundary` — error handling
- `TBookmark` type — data format
- `js/utils.ts` — JSON validation utilities
