import React, { useEffect, useState } from "react";
import { SearchableBookmarkList } from "../components/SearchableBookmarkList";
import { TBookmark, BookmarkData } from "../types";

interface BookmarkJsonFileProps {
  jsonFilename: string;
}

export function BookmarksInFile({ jsonFilename }: BookmarkJsonFileProps) {
  const [bookmarkAry, setBookmark] = useState<TBookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const path = `json/${jsonFilename}?` + new Date().valueOf();
      try {
        const response = await fetch(path);
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMsg(
              `File not found: json/${jsonFilename}\n\nTo fix this, create the file with bookmark data:\necho '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"}]}' > json/${jsonFilename}`,
            );
          } else {
            setErrorMsg(`HTTP ${response.status}: ${response.statusText}`);
          }
          return;
        }
        const data: BookmarkData = await response.json();
        setBookmark(data.urls || []);
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

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <pre>{errorMsg}</pre>;

  return <SearchableBookmarkList bookmarkAry={bookmarkAry} />;
}
