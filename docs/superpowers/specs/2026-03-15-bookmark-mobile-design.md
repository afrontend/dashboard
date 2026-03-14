# BookmarkJsonData Mobile Responsive Design

## Summary

Add Tailwind responsive classes to `BookmarkJsonData.tsx` to improve mobile usability. Primary use case: quickly tapping bookmarks on mobile (read-only). Desktop layout remains unchanged.

## Changes

### BookmarkItem component

1. **Touch target**: Add `py-2 sm:py-0` for adequate mobile tap area (~44px)
2. **URL visibility**: Add `hidden sm:inline-block` to URL `<span>` — hidden on mobile, visible on desktop
3. **Spacing**: Replace inline `style={{ marginBottom: "0.5rem" }}` with Tailwind `mb-2 sm:mb-1`

### Category header

1. **Touch target**: Add `py-2 sm:py-0` to category header `<div>` for mobile tap area

## Out of scope

- Component structure / props: no changes
- Drag-and-drop logic: unchanged (mobile is read-only use case)
- Search functionality: owned by `SearchableBookmarkList.tsx`, separate concern
- Category collapse/expand: unchanged

## Files affected

- `components/BookmarkJsonData.tsx` (only file modified)
