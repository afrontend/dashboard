import React from "react";
// import { TextForCopy } from "../components/TextForCopy";
import { BookmarksInURL } from "../components/BookmarksInURL";
import { useLocalFileFlag } from "../hooks/useLocalFileFlag";
import { BookmarksInFile } from "../components/BookmarksInFile";
import { ErrorBoundary } from "../components/ErrorBoundary";

export function App() {
  const { flag: fileFlag, LocalFileFlag } = useLocalFileFlag();

  return (
    <div className="bg-gray-300 mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex justify-center mb-4">
        <LocalFileFlag />
      </div>
      <div className="flex items-start justify-center">
        <ErrorBoundary>
          {fileFlag ? (
            <div className="w-full max-w-6xl">
              <BookmarksInFile jsonFilename="dashboard.json" />
            </div>
          ) : (
            <BookmarksInURL />
          )}
        </ErrorBoundary>
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
