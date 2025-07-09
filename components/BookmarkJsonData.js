import React from "react";

export function BookmarkJsonData({ hasDescription, bookmarkAry = [] }) {
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
