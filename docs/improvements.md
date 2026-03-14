# Dashboard Improvements

## Short-term

- [ ] Fix `<body className="m-0">` to `<body class="m-0">` in `index.html` and `local.html`
- [ ] Update CLAUDE.md: fix TBookmark type description (object interface, not tuple), update component structure to reflect separated modes
- [ ] Editor height: replace `calc(100vh - 300px)` hardcoded value with a more flexible approach

## Mid-term

- [ ] Editor mode initial data: provide richer example data to help new users understand the format
- [ ] Search UX: show result count, highlight matching text
- [ ] Responsive layout: stack editor and preview vertically on mobile

## Long-term

- [ ] JSON import/export in editor mode: allow importing local file mode data and exporting editor data as a file
- [ ] Bookmark category collapse/expand: entries without URL act as category headers, allow folding
- [ ] Drag and drop sorting: reorder bookmarks without editing JSON directly
