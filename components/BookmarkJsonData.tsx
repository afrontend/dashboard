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
      key={`${b.url}-${index}`}
    >
      <a href={b.url}>
        {b.emoji && <span>{b.emoji} </span>}
        {b.label}
      </a>
      {b.url &&
        (showURL ? (
          <span className="text-gray-500 truncate max-w-lg inline-block">
            {b.url}
          </span>
        ) : null)}
    </div>
  ));
}
