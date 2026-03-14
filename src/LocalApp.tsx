import React from "react";
import { BookmarksInFile } from "../components/BookmarksInFile";
import { ErrorBoundary } from "../components/ErrorBoundary";

export function LocalApp() {
  return (
    <div className="bg-gray-300 mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex items-start justify-center mt-4">
        <ErrorBoundary>
          <div className="w-full max-w-6xl">
            <BookmarksInFile jsonFilename="dashboard.json" />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
