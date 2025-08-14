import React from "react";

import { BookmarkJsonFile } from "../components/BookmarkJsonFile";
export function BookmarkJsonFiles() {
  return (
    <>
      <div className="w-1/2 relative">
        <BookmarkJsonFile jsonFilename="officeBookmark.json" />
      </div>
      <div className="w-1/2 relative">
        <BookmarkJsonFile jsonFilename="homeBookmark.json" />
      </div>
    </>
  );
}
