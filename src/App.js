import React from "react";
import { Bookmark } from "./Bookmark";
import { TextForCopy } from "./TextForCopy";
export function App() {
  return <div>
    <h1>Dashboard</h1>
    <Bookmark />
    <h1>Text For Copy</h1>
    <TextForCopy />
  </div>;
}

