import React from "react";

import { TBookmark } from "../types";

interface BookmarkJsonDataProps {
  hasDescription?: boolean;
  bookmarkAry?: TBookmark[];
}

export function BookmarkJsonData({
  hasDescription,
  bookmarkAry = [],
}: BookmarkJsonDataProps) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  return bAry.map((b, index) => (
    <div style={{ marginBottom: "0.5rem" }} key={b[1] + index}>
      <a href={b[1]}>{b[0]}</a>
      &nbsp;
      {hasDescription && (
        <span className="text-[blueviolet] text-xs">{b[1]}</span>
      )}
    </div>
  ));
}
