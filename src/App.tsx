import React, { useState } from "react";
// import { TextForCopy } from "../components/TextForCopy";
import { BookmarksInURL } from "../components/BookmarksInURL";
import { useLocalFileFlag } from "../hooks/useLocalFileFlag";
import { useShowURLFlag } from "../hooks/useShowURLFlag";

import { BookmarksInFile } from "../components/BookmarksInFile";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { TBookmark } from "../types";

export function App() {
  const { flag: fileFlag, LocalFileFlag } = useLocalFileFlag();
  const { flag: showURL, ShowURLFlag } = useShowURLFlag();
  const [urlBookmarks, setUrlBookmarks] = useState<TBookmark[]>([]);

  return (
    <div className="bg-gray-300 mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex justify-center mb-4 gap-6">
        <LocalFileFlag />
        <ShowURLFlag />

      </div>
      <div className="flex items-start justify-center">
        <ErrorBoundary>
          <div className="w-full max-w-6xl flex gap-4">
            {!fileFlag && (
              <div className="w-5/12 flex-shrink-0">
                <BookmarksInURL onBookmarksChange={setUrlBookmarks} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              {fileFlag ? (
                <BookmarksInFile jsonFilename="dashboard.json" showURL={showURL} />
              ) : (
                <BookmarkJsonData
                  bookmarkAry={urlBookmarks}
                  showURL={showURL}
                />
              )}
            </div>
          </div>
        </ErrorBoundary>
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
