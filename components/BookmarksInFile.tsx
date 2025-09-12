import React, { useEffect, useState, useRef } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { TBookmark } from "../types";

interface BookmarkJsonFileProps {
  jsonFilename: string;
}

export function BookmarksInFile({ jsonFilename }: BookmarkJsonFileProps) {
  const [bookmarkAry, setBookmark] = useState<TBookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>("");
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const path = `json/${jsonFilename}?` + new Date().valueOf();
      try {
        const response = await fetch(path);
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMsg(
              `File not found: json/${jsonFilename}\n\nTo fix this, create the file with bookmark data:\necho '[["Google", "https://google.com"], ["🌤 Daily", ""]]' > json/${jsonFilename}`,
            );
          } else {
            setErrorMsg(`HTTP ${response.status}: ${response.statusText}`);
          }
          return;
        }
        const bList: TBookmark[] = await response.json();
        setBookmark(bList);
      } catch (error) {
        if (error instanceof TypeError && error.message.includes("fetch")) {
          setErrorMsg(`Network error: Unable to load ${jsonFilename}`);
        } else {
          setErrorMsg(`Error loading file: ${String(error)}`);
        }
      } finally {
        setLoading(false);
      }
    };
    if (jsonFilename) {
      fetchData();
    }
  }, [jsonFilename]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        setShowFilter(true);
        setTimeout(() => {
          filterInputRef.current?.focus();
        }, 0);
      } else if (event.key === "Escape") {
        setShowFilter(false);
        setFilterText("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <pre>{errorMsg}</pre>;

  const filteredBookmarks = filterText.trim()
    ? bookmarkAry.filter((bookmark) => {
        const [name, url] = bookmark;
        const searchTerm = filterText.toLowerCase();
        return (
          name.toLowerCase().includes(searchTerm) ||
          url.toLowerCase().includes(searchTerm)
        );
      })
    : bookmarkAry;

  return (
    <>
      {showFilter && (
        <div className="mb-4">
          <input
            ref={filterInputRef}
            type="text"
            placeholder="Filter bookmarks... (Press Escape to close)"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowFilter(false);
                setFilterText("");
              }
            }}
          />
        </div>
      )}
      <BookmarkJsonData bookmarkAry={filteredBookmarks} />
    </>
  );
}
