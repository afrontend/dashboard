# Mode Separation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate editor mode and local file mode into independent entry points, add editor hide/show toggle, and share search functionality via a new `SearchableBookmarkList` wrapper component.

**Architecture:** Two HTML entry points (`index.html` for editor, `local.html` for local file) each render their own App component. Search logic is extracted from `BookmarksInFile` into a shared `SearchableBookmarkList` wrapper that both modes use. `BookmarkJsonData` remains a pure renderer.

**Tech Stack:** React 18, TypeScript, Parcel, CodeMirror, Tailwind CSS (browser CDN)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/SearchableBookmarkList.tsx` | Create | Wraps `BookmarkJsonData` with `s` key search + filter UI |
| `src/EditorApp.tsx` | Create | Editor mode app: CodeMirror editor with toggle + bookmark preview |
| `src/LocalApp.tsx` | Create | Local file mode app: fetch JSON + bookmark display |
| `src/local.tsx` | Create | React entry point for `local.html` |
| `local.html` | Create | HTML entry for local file mode |
| `hooks/useEditorVisible.tsx` | Create | localStorage-persisted editor visibility hook |
| `src/index.tsx` | Modify | Import `EditorApp` instead of `App` |
| `components/BookmarksInFile.tsx` | Modify | Remove search logic, use `SearchableBookmarkList` |
| `package.json` | Modify | Update npm scripts |
| `src/App.tsx` | Delete | Replaced by `EditorApp` and `LocalApp` |
| `hooks/useLocalFileFlag.tsx` | Delete | No longer needed |
| `hooks/useShowURLFlag.tsx` | Delete | Already deleted in working tree, stage the removal |

---

## Chunk 1: Shared Search Component

### Task 1: Create `SearchableBookmarkList` component

**Files:**
- Create: `components/SearchableBookmarkList.tsx`

- [ ] **Step 1: Create `SearchableBookmarkList.tsx`**

```tsx
import React, { useState, useRef, useEffect } from "react";
import { BookmarkJsonData } from "./BookmarkJsonData";
import { TBookmark } from "../types";

interface SearchableBookmarkListProps {
  bookmarkAry: TBookmark[];
}

export function SearchableBookmarkList({
  bookmarkAry,
}: SearchableBookmarkListProps) {
  const [showFilter, setShowFilter] = useState(false);
  const [filterText, setFilterText] = useState("");
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.closest(".cm-editor")
      ) {
        return;
      }

      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        setShowFilter(true);
        setTimeout(() => filterInputRef.current?.focus(), 0);
      } else if (event.key === "Escape") {
        setShowFilter(false);
        setFilterText("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredBookmarks = filterText.trim()
    ? bookmarkAry.filter((bookmark) => {
        const searchTerm = filterText.toLowerCase();
        const values = Object.values(bookmark);
        return values.some(
          (v) => typeof v === "string" && v.toLowerCase().includes(searchTerm),
        );
      })
    : bookmarkAry;

  return (
    <>
      {showFilter && (
        <div className="mb-4">
          <input
            ref={filterInputRef}
            type="text"
            placeholder="Filter bookmarks... (Press Escape to close)"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowFilter(false);
                setFilterText("");
              }
            }}
          />
        </div>
      )}
      <BookmarkJsonData bookmarkAry={filteredBookmarks} />
    </>
  );
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/SearchableBookmarkList.tsx
git commit -m "Add SearchableBookmarkList wrapper with shared search functionality"
```

---

### Task 2: Update `BookmarksInFile` to use `SearchableBookmarkList`

**Files:**
- Modify: `components/BookmarksInFile.tsx`

- [ ] **Step 1: Replace search logic with `SearchableBookmarkList`**

Remove: `showFilter`, `filterText`, `filterInputRef` state; the `keydown` useEffect; the filtering logic; the filter input JSX. Replace `BookmarkJsonData` import and usage with `SearchableBookmarkList`.

The updated file should be:

```tsx
import React, { useEffect, useState } from "react";
import { SearchableBookmarkList } from "../components/SearchableBookmarkList";
import { TBookmark, BookmarkData } from "../types";

interface BookmarkJsonFileProps {
  jsonFilename: string;
}

export function BookmarksInFile({ jsonFilename }: BookmarkJsonFileProps) {
  const [bookmarkAry, setBookmark] = useState<TBookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const path = `json/${jsonFilename}?` + new Date().valueOf();
      try {
        const response = await fetch(path);
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMsg(
              `File not found: json/${jsonFilename}\n\nTo fix this, create the file with bookmark data:\necho '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"}]}' > json/${jsonFilename}`,
            );
          } else {
            setErrorMsg(`HTTP ${response.status}: ${response.statusText}`);
          }
          return;
        }
        const data: BookmarkData = await response.json();
        setBookmark(data.urls || []);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setErrorMsg(`Network error: Unable to load ${jsonFilename}`);
        } else {
          setErrorMsg(`Error loading file: ${String(error)}`);
        }
      } finally {
        setLoading(false);
      }
    };
    if (jsonFilename) {
      fetchData();
    }
  }, [jsonFilename]);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <pre>{errorMsg}</pre>;

  return <SearchableBookmarkList bookmarkAry={bookmarkAry} />;
}
```

- [ ] **Step 2: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/BookmarksInFile.tsx
git commit -m "Simplify BookmarksInFile by delegating search to SearchableBookmarkList"
```

---

## Chunk 2: Editor Mode Components

### Task 3: Create `useEditorVisible` hook

**Files:**
- Create: `hooks/useEditorVisible.tsx`

- [ ] **Step 1: Create the hook**

```tsx
import { useState } from "react";

export function useEditorVisible() {
  const [visible, setVisible] = useState<boolean>(
    localStorage.getItem("editorVisible") !== "false",
  );

  function toggle() {
    const next = !visible;
    setVisible(next);
    localStorage.setItem("editorVisible", String(next));
  }

  return { visible, toggle };
}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add hooks/useEditorVisible.tsx
git commit -m "Add useEditorVisible hook with localStorage persistence"
```

---

### Task 4: Create `EditorApp`

**Files:**
- Create: `src/EditorApp.tsx`
- Modify: `src/index.tsx`

- [ ] **Step 1: Create `EditorApp.tsx`**

```tsx
import React, { useState } from "react";
import { BookmarksInURL } from "../components/BookmarksInURL";
import { SearchableBookmarkList } from "../components/SearchableBookmarkList";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useEditorVisible } from "../hooks/useEditorVisible";
import { TBookmark } from "../types";

export function EditorApp() {
  const [urlBookmarks, setUrlBookmarks] = useState<TBookmark[]>([]);
  const { visible: editorVisible, toggle: toggleEditor } = useEditorVisible();

  return (
    <div className="bg-gray-300 mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex items-start justify-center mt-4">
        <ErrorBoundary>
          <div className="w-full max-w-6xl flex gap-4">
            <div className={editorVisible ? "w-5/12 flex-shrink-0" : ""}>
              <button
                onClick={toggleEditor}
                className="mb-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                {editorVisible ? "◀ Hide" : "▶ Edit"}
              </button>
              {editorVisible && (
                <BookmarksInURL onBookmarksChange={setUrlBookmarks} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <SearchableBookmarkList bookmarkAry={urlBookmarks} />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `src/index.tsx` to use `EditorApp`**

Replace the file content with:

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { EditorApp } from "./EditorApp";

const container = document.getElementById("app");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
root.render(<EditorApp />);
```

- [ ] **Step 3: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/EditorApp.tsx src/index.tsx
git commit -m "Add EditorApp with editor hide/show toggle"
```

---

## Chunk 3: Local File Mode Entry Point

### Task 5: Create `LocalApp` and local entry point

**Files:**
- Create: `src/LocalApp.tsx`
- Create: `src/local.tsx`
- Create: `local.html`

- [ ] **Step 1: Create `LocalApp.tsx`**

```tsx
import React from "react";
import { BookmarksInFile } from "../components/BookmarksInFile";
import { ErrorBoundary } from "../components/ErrorBoundary";

export function LocalApp() {
  return (
    <div className="bg-gray-300 mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex items-start justify-center mt-4">
        <ErrorBoundary>
          <div className="w-full max-w-6xl">
            <BookmarksInFile jsonFilename="dashboard.json" />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/local.tsx`**

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { LocalApp } from "./LocalApp";

const container = document.getElementById("app");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
root.render(<LocalApp />);
```

- [ ] **Step 3: Create `local.html`**

Copy `index.html` but change the script src from `src/index.tsx` to `src/local.tsx`:

```html
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8" />
    <title>Dashboard</title>
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="manifest" href="site.webmanifest" />
    <link rel="apple-touch-icon" href="icon.jpg" />
    <link rel="icon" href="favicon.ico" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
    />

    <meta name="theme-color" content="#fafafa" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>
      a {
        text-decoration: none;
      }
    </style>
  </head>

  <body className="m-0">
    <noscript>You need to enable JavaScript to run this app.</noscript>

    <div id="app"></div>
    <script type="module" src="src/local.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/LocalApp.tsx src/local.tsx local.html
git commit -m "Add LocalApp with separate local.html entry point"
```

---

## Chunk 4: Cleanup and Script Updates

### Task 6: Update npm scripts and delete old files

**Files:**
- Modify: `package.json`
- Delete: `src/App.tsx`
- Delete: `hooks/useLocalFileFlag.tsx`

- [ ] **Step 1: Update `package.json` scripts**

Replace the `scripts` section:

```json
"scripts": {
  "copyjson": "cp -rf json dist/",
  "build": "parcel build index.html --no-cache",
  "serve": "parcel local.html --no-cache",
  "serve:editor": "parcel index.html --no-cache",
  "watch": "parcel watch index.html --no-cache",
  "predeploy": "parcel build index.html --no-cache",
  "deploy": "gh-pages -d dist",
  "lint": "eslint src components hooks js",
  "lint:fix": "eslint src components hooks js --fix",
  "typecheck": "tsc --noEmit"
}
```

Key changes:
- `serve` → points to `local.html` (primary local use)
- `serve:editor` → new script for editor mode dev
- `predeploy` → removed `copyjson` (editor mode doesn't need JSON files)

- [ ] **Step 2: Delete `src/App.tsx`**

```bash
git rm src/App.tsx
```

- [ ] **Step 3: Delete `hooks/useLocalFileFlag.tsx`**

```bash
git rm hooks/useLocalFileFlag.tsx
```

- [ ] **Step 4: Stage deletion of `hooks/useShowURLFlag.tsx`**

```bash
git rm hooks/useShowURLFlag.tsx
```

- [ ] **Step 5: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "Update npm scripts for separated modes and remove old App/toggle files"
```

---

## Chunk 5: Verification

### Task 7: Verify both modes work

- [ ] **Step 1: Test local file mode**

Run: `npm run serve`
- Open browser to served URL
- Verify bookmarks load from `json/dashboard.json`
- Press `s` key → search input appears
- Type a filter term → bookmarks filter
- Press `Escape` → search closes

- [ ] **Step 2: Test editor mode**

Run: `npm run serve:editor`
- Open browser to served URL
- Verify CodeMirror editor appears with JSON data
- Verify bookmark preview on the right
- Click `◀ Hide` → editor hides, bookmarks expand to full width
- Click `▶ Edit` → editor reappears with previous data intact
- Press `s` key when editor is NOT focused → search input appears
- Type in CodeMirror → `s` key types normally (no search triggered)
- Click `Save` → URL updates with encoded data
- Refresh page → editor visibility state persists from localStorage

- [ ] **Step 3: Run typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: No errors
