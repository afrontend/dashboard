import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";

BookmarkJsonFile.propTypes = {
  hasDescription: PropTypes.bool,
  jsonFilename: PropTypes.string,
};

export function BookmarkJsonFile({ hasDescription, jsonFilename }) {
  const [bookmarkAry, setBookmark] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const path = `json/${jsonFilename}?` + new Date().valueOf();
      try {
        const response = await fetch(path);
        const bList = await response.json();
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
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMsg) return <pre>{errorMsg}</pre>;

  return (
    <BookmarkJsonData
      hasDescription={hasDescription}
      bookmarkAry={bookmarkAry}
    />
  );
}
