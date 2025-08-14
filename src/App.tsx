import React from "react";
// import { TextForCopy } from "../components/TextForCopy";
import { BookmarkJsonFiles } from "../components/BookmarkJsonFiles";
import { BookmarkWithURL } from "../components/BookmarkWithURL";
import { useFileToggleSwitch } from "../hooks/useFileToggleSwitch";

export function App() {
  const { useFile: useFileFlag, SwitchComponent } = useFileToggleSwitch();

  return (
    <div className="bg-gray-300 mx-auto max-w-6xl p-5">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 pb-4 border-b-2 border-gray-400">
        Dashboard
      </h1>
      <div className="mb-4 ml-4">
        <SwitchComponent />
      </div>
      <div className="flex items-start justify-center">
        {useFileFlag ? <BookmarkJsonFiles /> : <BookmarkWithURL />}
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
