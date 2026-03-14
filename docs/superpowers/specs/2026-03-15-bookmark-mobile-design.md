# BookmarkJsonData Mobile Responsive Design

## Summary

Add Tailwind responsive classes to `BookmarkJsonData.tsx` to improve mobile usability. Primary use case: quickly tapping bookmarks on mobile (read-only). Desktop layout remains unchanged.

## Changes

### BookmarkItem wrapper `<div>` (line 81)

1. **Touch target + spacing**: Remove inline `style={{ marginBottom: "0.5rem" }}`. Add `py-2 sm:py-0 mb-2 sm:mb-1` to className. Both padding and margin apply to the same wrapper div. On desktop `sm:py-0 sm:mb-1` preserves the current visual rhythm (~0.5rem = ~mb-1 equivalent).
2. **URL visibility**: On the URL `<span>` (line 99), replace existing `inline-block` with `hidden sm:inline-block` so the span is hidden on mobile and inline-block on desktop. The rest of its classes (`text-gray-500 truncate max-w-lg`) remain unchanged.

### Category header `<div>` (line 162)

1. **Touch target**: Add `py-2 sm:py-0` to className. Existing `mb-1` is kept as-is (category headers already have sufficient spacing from margin alone; only padding is added for tap target).

## Out of scope

- Component structure / props: no changes
- Drag-and-drop logic: unchanged (mobile is read-only use case)
- Search functionality: owned by `SearchableBookmarkList.tsx`, separate concern
- Category collapse/expand: unchanged

## Files affected

- `components/BookmarkJsonData.tsx` (only file modified)
