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
          <div className="w-full max-w-6xl">
            <button
              onClick={toggleEditor}
              className="mb-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              {editorVisible ? "◀ Hide" : "▶ Edit"}
            </button>
            <div className="flex gap-4">
              {editorVisible && (
                <div className="w-5/12 flex-shrink-0">
                  <BookmarksInURL onBookmarksChange={setUrlBookmarks} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <SearchableBookmarkList bookmarkAry={urlBookmarks} />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
