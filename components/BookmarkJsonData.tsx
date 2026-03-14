import React, { useState } from "react";

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

interface Category {
  header: TBookmark;
  items: TBookmark[];
}

function groupByCategory(bookmarks: TBookmark[]): Category[] {
  const groups: Category[] = [];
  let current: Category | null = null;

  for (const b of bookmarks) {
    if (!b.url) {
      current = { header: b, items: [] };
      groups.push(current);
    } else if (current) {
      current.items.push(b);
    } else {
      if (groups.length === 0) {
        groups.push({ header: { label: "" }, items: [] });
      }
      groups[0].items.push(b);
    }
  }
  return groups;
}

function BookmarkItem({
  b,
  searchTerm,
}: {
  b: TBookmark;
  searchTerm?: string;
}) {
  return (
    <div
      style={{ marginBottom: "0.5rem" }}
      className="flex justify-between items-center"
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
  );
}

export function BookmarkJsonData({
  bookmarkAry = [],
  searchTerm,
}: BookmarkJsonDataProps) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  const groups = groupByCategory(bAry);
  const hasCategories = groups.some((g) => g.header.label);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  if (!hasCategories) {
    return bAry.map((b, index) => (
      <BookmarkItem key={`${b.url}-${index}`} b={b} searchTerm={searchTerm} />
    ));
  }

  function toggleGroup(idx: number) {
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return groups.map((group, gIdx) => (
    <div key={gIdx} className="mb-2">
      {group.header.label && (
        <div
          onClick={() => toggleGroup(gIdx)}
          className="flex items-center gap-1 cursor-pointer select-none mb-1"
        >
          <span className="text-xs text-gray-500">
            {collapsed[gIdx] ? "▶" : "▼"}
          </span>
          <span className="font-semibold">
            {group.header.emoji && (
              <span>
                <HighlightText
                  text={group.header.emoji}
                  searchTerm={searchTerm}
                />{" "}
              </span>
            )}
            <HighlightText
              text={group.header.label}
              searchTerm={searchTerm}
            />
          </span>
          <span className="text-xs text-gray-400 ml-1">
            ({group.items.length})
          </span>
        </div>
      )}
      {!collapsed[gIdx] &&
        group.items.map((b, index) => (
          <div key={`${gIdx}-${index}`} className={group.header.label ? "ml-4" : ""}>
            <BookmarkItem b={b} searchTerm={searchTerm} />
          </div>
        ))}
    </div>
  ));
}
