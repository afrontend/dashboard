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
        const bList: Bookmark[] = await response.json();
        setBookmark(bList);
      } catch (error) {
        console.log(error);
        setErrorMsg(String(error));
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
