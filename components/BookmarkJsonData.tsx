import React from "react";

import { TBookmark } from "../types";

interface BookmarkJsonDataProps {
  bookmarkAry: TBookmark[];
  searchTerm?: string;
}

function HighlightText({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm?: string;
}) {
  if (!searchTerm || !text) return <>{text}</>;
  const lower = text.toLowerCase();
  const term = searchTerm.toLowerCase();
  const idx = lower.indexOf(term);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

export function BookmarkJsonData({
  bookmarkAry = [],
  searchTerm,
}: BookmarkJsonDataProps) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  return bAry.map((b, index) => (
    <div
      style={{ marginBottom: "0.5rem" }}
      className="flex justify-between items-center"
      key={`${b.url}-${index}`}
    >
      <a href={b.url}>
        {b.emoji && (
          <span>
            <HighlightText text={b.emoji} searchTerm={searchTerm} />{" "}
          </span>
        )}
        <HighlightText text={b.label || ""} searchTerm={searchTerm} />
      </a>
      {b.url && (
        <span className="text-gray-500 truncate max-w-lg inline-block">
          <HighlightText text={decodeURI(b.url)} searchTerm={searchTerm} />
        </span>
      )}
    </div>
  ));
}
