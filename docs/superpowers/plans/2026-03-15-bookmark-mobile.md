# BookmarkJsonData Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make BookmarkJsonData mobile-friendly by adding Tailwind responsive classes — hide URLs on mobile, increase touch targets, fix spacing.

**Architecture:** CSS-only changes using Tailwind responsive prefixes (`sm:`). No component structure or logic changes.

**Tech Stack:** Tailwind CSS (browser CDN v4), React/TypeScript

**Spec:** `docs/superpowers/specs/2026-03-15-bookmark-mobile-design.md`

---

## Chunk 1: Mobile responsive changes

### Task 1: Update BookmarkItem touch target and spacing

**Files:**
- Modify: `components/BookmarkJsonData.tsx:81-83`

- [ ] **Step 1: Remove inline style and add responsive spacing**

In `BookmarkItem`, replace the wrapper `<div>` (lines 81-83):

```tsx
// Before (lines 81-83):
<div
  style={{ marginBottom: "0.5rem" }}
  className={`flex justify-between items-center ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragOver ? "border-t-2 border-blue-400" : ""}`}
>

// After (lines 81-82, style prop removed):
<div
  className={`flex justify-between items-center py-2 sm:py-0 mb-2 sm:mb-1 ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragOver ? "border-t-2 border-blue-400" : ""}`}
>
```

Changes:
- Remove `style={{ marginBottom: "0.5rem" }}`
- Add `py-2 sm:py-0` (touch target on mobile, no padding on desktop)
- Add `mb-2 sm:mb-1` (replaces the inline 0.5rem margin)

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/BookmarkJsonData.tsx
git commit -m "feat: add mobile touch targets and responsive spacing to BookmarkItem"
```

### Task 2: Hide URL on mobile

**Files:**
- Modify: `components/BookmarkJsonData.tsx:99`

- [ ] **Step 1: Replace inline-block with responsive visibility**

On line 99, change the URL `<span>` className:

```tsx
// Before:
<span className="text-gray-500 truncate max-w-lg inline-block">

// After:
<span className="text-gray-500 truncate max-w-lg hidden sm:inline-block">
```

Changes:
- Replace `inline-block` with `hidden sm:inline-block` (hidden on mobile, shown on desktop)

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/BookmarkJsonData.tsx
git commit -m "feat: hide bookmark URLs on mobile for cleaner layout"
```

### Task 3: Add touch target to category headers

**Files:**
- Modify: `components/BookmarkJsonData.tsx:164`

- [ ] **Step 1: Add responsive padding to category header**

On line 164, add `py-2 sm:py-0` to the className:

```tsx
// Before:
className={`flex items-center gap-1 cursor-pointer select-none mb-1 ${onReorder ? "cursor-grab active:cursor-grabbing" : ""} ${dragOverIdx === headerFlatIdx && dragIdx !== headerFlatIdx ? "border-t-2 border-blue-400" : ""}`}

// After:
className={`flex items-center gap-1 cursor-pointer select-none mb-1 py-2 sm:py-0 ${onReorder ? "cursor-grab active:cursor-grabbing" : ""} ${dragOverIdx === headerFlatIdx && dragIdx !== headerFlatIdx ? "border-t-2 border-blue-400" : ""}`}
```

- [ ] **Step 2: Run typecheck**

Run: `npm run typecheck`
Expected: No errors

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: No errors (or only pre-existing warnings)

- [ ] **Step 4: Commit**

```bash
git add components/BookmarkJsonData.tsx
git commit -m "feat: add mobile touch targets to category headers"
```

### Task 4: Manual verification

- [ ] **Step 1: Start dev server**

Run: `npm run serve`

- [ ] **Step 2: Verify desktop**

Open browser at localhost, confirm layout looks the same as before (URL visible, compact spacing).

- [ ] **Step 3: Verify mobile**

Use browser DevTools responsive mode (375px width). Confirm:
- URLs are hidden
- Each bookmark has adequate tap spacing
- Category headers have adequate tap spacing
- Collapse/expand still works
