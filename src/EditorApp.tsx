import React, { useState, useRef } from "react";
import {
  BookmarksInURL,
  BookmarksInURLHandle,
} from "../components/BookmarksInURL";
import { SearchableBookmarkList } from "../components/SearchableBookmarkList";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useEditorVisible } from "../hooks/useEditorVisible";
import { getJsonData } from "../js/utils";
import { TBookmark } from "../types";

const iconBtnClass =
  "w-9 h-9 flex items-center justify-center rounded-full bg-gray-400 text-white hover:bg-gray-500 transition-colors duration-150 text-base leading-none";

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button className={iconBtnClass} onClick={onClick}>
        {children}
      </button>
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 text-xs text-white bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
        {label}
      </span>
    </div>
  );
}

export function EditorApp() {
  const [urlBookmarks, setUrlBookmarks] = useState<TBookmark[]>(getJsonData());
  const { visible: editorVisible, toggle: toggleEditor } = useEditorVisible();
  const editorRef = useRef<BookmarksInURLHandle>(null);

  return (
    <div className="bg-gray-300 mx-auto p-5 pb-20">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex items-start justify-center mt-4">
        <ErrorBoundary>
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-2">
              <label className="inline-flex items-center cursor-pointer select-none">
                <span className="mr-2 text-sm font-medium text-gray-700">
                  Editor
                </span>
                <div className="relative" onClick={toggleEditor}>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${editorVisible ? "bg-blue-500" : "bg-gray-400"}`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${editorVisible ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
              </label>
              {editorVisible && (
                <div className="flex items-center gap-2">
                  <IconButton
                    label="Import"
                    onClick={() => editorRef.current?.triggerImport()}
                  >
                    📂
                  </IconButton>
                  <IconButton
                    label="Export"
                    onClick={() => editorRef.current?.triggerExport()}
                  >
                    ↧
                  </IconButton>
                  <IconButton
                    label="Save"
                    onClick={() => editorRef.current?.triggerSave()}
                  >
                    💾
                  </IconButton>
                  <a href="/">
                    <IconButton label="Clear">✕</IconButton>
                  </a>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {editorVisible && (
                <div className="w-full md:w-5/12 md:flex-shrink-0">
                  <BookmarksInURL
                    ref={editorRef}
                    onBookmarksChange={setUrlBookmarks}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <SearchableBookmarkList
                  bookmarkAry={urlBookmarks}
                  onReorder={setUrlBookmarks}
                />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
