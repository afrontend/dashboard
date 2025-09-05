import React, { useEffect, useState } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";

type Bookmark = [string, string];

interface BookmarkJsonFileProps {
  hasDescription?: boolean;
  jsonFilename: string;
}

export function BookmarksInFile({
  hasDescription,
  jsonFilename,
}: BookmarkJsonFileProps) {
  const [bookmarkAry, setBookmark] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const path = `json/${jsonFilename}?` + new Date().valueOf();
      try {
        const response = await fetch(path);
        console.log(`response.ok: ${response.ok}`);
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
        const bList: Bookmark[] = await response.json();
        setBookmark(bList);
      } catch (error) {
        console.log(error);
        setErrorMsg(
          `File not found: json/${jsonFilename}\n\nTo fix this, create the file with bookmark data:\necho '[["Google", "https://google.com"], ["🌤 Daily", ""]]' > json/${jsonFilename}`,
        );
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
