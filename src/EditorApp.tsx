import React, { useState, useRef, useEffect } from "react";
import {
  BookmarksInURL,
  BookmarksInURLHandle,
} from "../components/BookmarksInURL";
import { SearchableBookmarkList } from "../components/SearchableBookmarkList";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { SaveToast } from "../components/SaveToast";
import { SaveHint } from "../components/SaveHint";
import { useEditorVisible } from "../hooks/useEditorVisible";
import { useSaveHint } from "../hooks/useSaveHint";
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
    <div className="flex flex-col items-center gap-0.5 cursor-pointer" onClick={onClick}>
      <div className={iconBtnClass}>
        {children}
      </div>
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}

export function EditorApp() {
  const [urlBookmarks, setUrlBookmarks] = useState<TBookmark[]>(getJsonData());
  const { visible: editorVisible, toggle: toggleEditor } = useEditorVisible();
  const editorRef = useRef<BookmarksInURLHandle>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const saveHint = useSaveHint();

  function handleSaveComplete() {
    setToastVisible(true);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = null;
    }, 5000);
    saveHint.show();
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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
                    onSaveComplete={handleSaveComplete}
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
      <SaveToast
        visible={toastVisible}
        onClose={() => {
          setToastVisible(false);
          if (toastTimerRef.current !== null) {
            window.clearTimeout(toastTimerRef.current);
            toastTimerRef.current = null;
          }
        }}
      />
      <SaveHint visible={saveHint.visible} onDismiss={saveHint.dismiss} />
    </div>
  );
}
