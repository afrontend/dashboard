# Mode Separation Design

## Overview

Separate the bookmark dashboard's two modes (editor mode and local file mode) into independent entry points, add editor hide/show toggle, and share search functionality across both modes.

## Goals

- Eliminate the checkbox toggle that switches between unrelated features
- Editor mode (`index.html`): deployable to GitHub Pages, standalone bookmark editor
- Local file mode (`local.html`): local-only, reads `json/dashboard.json`
- Add editor hide/show toggle with localStorage persistence
- Add `s` key search to editor mode (currently only in local file mode)

## Data Format

`TBookmark` is an object interface (not a tuple):

```typescript
export interface TBookmark {
  emoji?: string;
  label?: string;
  url?: string;
}
```

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

- `components/BookmarkJsonData.tsx` — Wrap with `SearchableBookmarkList` that adds `s` key search UI and filtering logic (moved from `BookmarksInFile`). `BookmarkJsonData` itself remains a pure rendering component.
- `components/BookmarksInFile.tsx` — Remove search logic (now in `SearchableBookmarkList`), used by `LocalApp`
- `components/BookmarksInURL.tsx` — Continues to exist as-is, imported by `EditorApp` for the CodeMirror editor and JSON validation
- `package.json` — Update npm scripts

### New Wrapper Component

- `components/SearchableBookmarkList.tsx` — Wraps `BookmarkJsonData` with search state and keyboard listener. Both modes use this instead of `BookmarkJsonData` directly.

### Deleted Files

- `src/App.tsx` — Replaced by `EditorApp` and `LocalApp`
- `hooks/useLocalFileFlag.tsx` — No longer needed (no mode toggle)
- `hooks/useShowURLFlag.tsx` — Already deleted in working tree

## Editor Mode Data Flow

```
EditorApp
  ├─ useState<TBookmark[]>(urlBookmarks) — bookmark state lives here
  ├─ useEditorVisible() — editor show/hide state
  ├─ BookmarksInURL (onBookmarksChange={setUrlBookmarks})
  │   └─ CodeMirror editor, JSON validation, Save/Clear buttons
  └─ SearchableBookmarkList (bookmarkAry={urlBookmarks})
      └─ BookmarkJsonData (pure renderer)
```

When the editor is hidden, `urlBookmarks` state is preserved — bookmarks continue to render from last-parsed data. Save/Clear buttons are hidden along with the editor.

## Editor Toggle Design

- Button positioned at top-left of editor area: `◀ Hide` / `▶ Edit`
- `useEditorVisible` hook: reads/writes localStorage key `"editorVisible"`, default `true`
- Editor visible: left 5/12 editor + right 7/12 bookmark list + Save/Clear buttons
- Editor hidden: bookmark list expands to full width, Save/Clear hidden

## Search Feature (Shared via SearchableBookmarkList)

- `SearchableBookmarkList` wraps `BookmarkJsonData` with search state
- `s` key: opens search input above bookmark list, real-time filtering by label
- `Escape`: closes search, resets filter
- Focus guard: checks `event.target.closest('.cm-editor')` to avoid capturing `s` key when CodeMirror has focus (CodeMirror uses `contenteditable` div, not textarea)

## NPM Scripts

```json
{
  "serve": "parcel local.html --no-cache",
  "serve:editor": "parcel index.html --no-cache",
  "build": "parcel build index.html --no-cache",
  "watch": "parcel watch index.html --no-cache",
  "copyjson": "cp -rf json dist/",
  "predeploy": "parcel build index.html --no-cache",
  "deploy": "gh-pages -d dist",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src components hooks js",
  "lint:fix": "eslint src components hooks js --fix"
}
```

- `npm run serve` — local file mode development (primary local use)
- `npm run serve:editor` — editor mode development/testing
- `npm run build` / `npm run deploy` — editor mode only (GitHub Pages)
- `copyjson` preserved for local mode but removed from `predeploy` (editor mode doesn't need JSON files)
- `watch`, `typecheck`, `lint`, `lint:fix` unchanged

## Shared Components

Both modes share:
- `SearchableBookmarkList` — search UI + filtering wrapper
- `BookmarkJsonData` — pure bookmark rendering
- `ErrorBoundary` — error handling
- `TBookmark` type — object interface (`{ emoji?, label?, url? }`)
- `js/utils.ts` — JSON validation utilities
