import React from "react";

interface Bookmark {
  name: string;
  link: string;
}

interface BookmarkJsonDataProps {
  hasDescription?: boolean;
  bookmarkAry?: Bookmark[];
}

export function BookmarkJsonData({ hasDescription, bookmarkAry = [] }: BookmarkJsonDataProps) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  return bAry.map((b, index) => (
    <div style={{ marginBottom: "0.5rem" }} key={b.link + index}>
      <a href={b.link}>{b.name}</a>
      &nbsp;
      {hasDescription && (
        <span className="text-[blueviolet] text-xs">{b.link}</span>
      )}
    </div>
  ));
}
