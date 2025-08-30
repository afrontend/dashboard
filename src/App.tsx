import React from "react";
// import { TextForCopy } from "../components/TextForCopy";
import { BookmarkWithURL } from "../components/BookmarkWithURL";
import { useFileCheckBox } from "../hooks/useFileCheckBox";
import { BookmarkJsonFile } from "../components/BookmarkJsonFile";

export function App() {
  const { useFileFlag, FileFlagCheckBox } = useFileCheckBox();

  return (
    <div className="bg-gray-300 mx-auto p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="flex justify-center mb-4">
        <FileFlagCheckBox />
      </div>
      <div className="flex items-start justify-center">
        {useFileFlag ? (
          <div className="w-full max-w-4xl">
            <BookmarkJsonFile jsonFilename="dashboard.json" />
          </div>
        ) : (
          <BookmarkWithURL />
        )}
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
