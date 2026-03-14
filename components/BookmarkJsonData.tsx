import React, { useState } from "react";

import { TBookmark } from "../types";

interface BookmarkJsonDataProps {
  bookmarkAry: TBookmark[];
  searchTerm?: string;
  // eslint-disable-next-line no-unused-vars
  onReorder?: (reordered: TBookmark[]) => void;
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
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragOver,
}: {
  b: TBookmark;
  searchTerm?: string;
  draggable?: boolean;
  onDragStart?: () => void;
  // eslint-disable-next-line no-unused-vars
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
  isDragOver?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center py-2 sm:py-0 mb-2 sm:mb-1 ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${isDragOver ? "border-t-2 border-blue-400" : ""}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
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
        <span className="text-gray-500 truncate max-w-lg hidden sm:inline-block">
          <HighlightText text={decodeURI(b.url)} searchTerm={searchTerm} />
        </span>
      )}
    </div>
  );
}

export function BookmarkJsonData({
  bookmarkAry = [],
  searchTerm,
  onReorder,
}: BookmarkJsonDataProps) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  const groups = groupByCategory(bAry);
  const hasCategories = groups.some((g) => g.header.label);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function handleDrop(toIdx: number) {
    if (dragIdx === null || dragIdx === toIdx || !onReorder) return;
    const reordered = [...bAry];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(toIdx, 0, moved);
    onReorder(reordered);
    setDragIdx(null);
    setDragOverIdx(null);
  }

  function handleDragEnd() {
    setDragIdx(null);
    setDragOverIdx(null);
  }

  if (!hasCategories) {
    return bAry.map((b, index) => (
      <BookmarkItem
        key={`${b.url}-${index}`}
        b={b}
        searchTerm={searchTerm}
        draggable={!!onReorder}
        onDragStart={() => setDragIdx(index)}
        onDragOver={(e) => { e.preventDefault(); setDragOverIdx(index); }}
        onDrop={() => handleDrop(index)}
        onDragEnd={handleDragEnd}
        isDragOver={dragOverIdx === index && dragIdx !== index}
      />
    ));
  }

  function toggleGroup(idx: number) {
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  // Build flat index mapping for drag across categories
  let flatIdx = 0;
  return groups.map((group, gIdx) => {
    const headerFlatIdx = flatIdx;
    flatIdx++;
    return (
      <div key={gIdx} className="mb-2">
        {group.header.label && (
          <div
            onClick={() => toggleGroup(gIdx)}
            className={`flex items-center gap-1 cursor-pointer select-none mb-1 py-2 sm:py-0 ${onReorder ? "cursor-grab active:cursor-grabbing" : ""} ${dragOverIdx === headerFlatIdx && dragIdx !== headerFlatIdx ? "border-t-2 border-blue-400" : ""}`}
            draggable={!!onReorder}
            onDragStart={() => setDragIdx(headerFlatIdx)}
            onDragOver={(e) => { e.preventDefault(); setDragOverIdx(headerFlatIdx); }}
            onDrop={() => handleDrop(headerFlatIdx)}
            onDragEnd={handleDragEnd}
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
          group.items.map((b) => {
            const itemFlatIdx = flatIdx;
            flatIdx++;
            return (
              <div key={`${gIdx}-${itemFlatIdx}`} className={group.header.label ? "ml-4" : ""}>
                <BookmarkItem
                  b={b}
                  searchTerm={searchTerm}
                  draggable={!!onReorder}
                  onDragStart={() => setDragIdx(itemFlatIdx)}
                  onDragOver={(e) => { e.preventDefault(); setDragOverIdx(itemFlatIdx); }}
                  onDrop={() => handleDrop(itemFlatIdx)}
                  onDragEnd={handleDragEnd}
                  isDragOver={dragOverIdx === itemFlatIdx && dragIdx !== itemFlatIdx}
                />
              </div>
            );
          })}
      </div>
    );
  });
}
