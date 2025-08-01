import React from "react";
// import { TextForCopy } from "../components/TextForCopy";
import { BookmarkFiles } from "../components/BookmarkFiles";
import { BookmarkWithURL } from "../components/BookmarkWithURL";
import { useFileToggleSwitch } from "../hooks/useFileToggleSwitch";

export function App() {
  const { useFile: useFileFlag, SwitchComponent } = useFileToggleSwitch();

  return (
    <div className="bg-gray-300 mx-auto max-w-6xl p-5">
      <h1>Dashboard</h1>
      <div className="mb-4 ml-4">
        <SwitchComponent />
      </div>
      <div className="flex items-start justify-center">
        {useFileFlag ? <BookmarkFiles /> : <BookmarkWithURL />}
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
