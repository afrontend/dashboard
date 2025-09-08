import React, { useEffect, useState } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { TBookmark } from "../types";

interface BookmarkJsonFileProps {
  hasDescription?: boolean;
  jsonFilename: string;
}

export function BookmarksInFile({
  hasDescription,
  jsonFilename,
}: BookmarkJsonFileProps) {
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

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <pre>{errorMsg}</pre>;

  return (
    <BookmarkJsonData
      hasDescription={hasDescription}
      bookmarkAry={bookmarkAry}
    />
  );
}
