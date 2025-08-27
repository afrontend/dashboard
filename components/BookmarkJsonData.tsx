import React from "react";

type Bookmark = [string, string];

interface BookmarkJsonDataProps {
  hasDescription?: boolean;
  bookmarkAry?: Bookmark[];
}

export function BookmarkJsonData({ hasDescription, bookmarkAry = [] }: BookmarkJsonDataProps) {
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
