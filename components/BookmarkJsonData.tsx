import React from "react";

import { TBookmark } from "../types";

interface BookmarkJsonDataProps {
  bookmarkAry: TBookmark[];
  showURL?: boolean;
}

export function BookmarkJsonData({
  bookmarkAry = [],
  showURL = false,
}: BookmarkJsonDataProps) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  return bAry.map((b, index) => (
    <div
      style={{ marginBottom: "0.5rem" }}
      className="flex justify-between items-center"
      key={`${b[1]}-${index}`}
    >
      <a href={b[1]}>{b[0]}</a>
      {b[1] && (showURL ? <span className="text-gray-500">{b[1]}</span> : null)}
    </div>
  ));
}
