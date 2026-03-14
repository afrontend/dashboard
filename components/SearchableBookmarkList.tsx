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
      {!showFilter && (
        <p className="text-sm text-gray-400 mb-2">Press S to search</p>
      )}
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
          {filterText.trim() && (
            <p className="text-sm text-gray-500 mt-1">
              {filteredBookmarks.length} / {bookmarkAry.length} results
            </p>
          )}
        </div>
      )}
      <BookmarkJsonData
        bookmarkAry={filteredBookmarks}
        searchTerm={showFilter ? filterText.trim() : undefined}
      />
    </>
  );
}
