import React, { useState, ChangeEvent } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { ClearButton } from "../components/ClearButton";
import { SaveButton } from "../components/SaveButton";
import { getJsonData, isJSON } from "../js/utils";

interface Bookmark {
  name: string;
  link: string;
}

export function BookmarkWithURL() {
  const jsonAry = getJsonData();
  const [bookmarkAry, setBookmarkAry] = useState<Bookmark[]>(jsonAry);
  const [bookmarkText, setBookmarkText] = useState<string>(
    JSON.stringify(jsonAry, null, 2),
  );
  const [msg, setMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    setBookmarkText(text);
    if (text && isJSON(text)) {
      setMsg("Valid JSON");
      setErrorMsg("");
      const jsonAry: Bookmark[] = JSON.parse(text);
      setBookmarkAry(jsonAry);
      return;
    }
    setMsg("");
    setErrorMsg("Invalid JSON");
  }

  return (
    <>
      <div className="w-1/2 relative">
        <textarea
          className="rounded-sm p-4 border-2 border-solid border-purple-500/75 h-[calc(100vh-400px)] w-[95%] m-2"
          value={bookmarkText}
          onChange={handleChange}
        />
        {msg && (
          <div className="absolute top-4 right-8" style={{ color: "#8c7ae6" }}>
            {msg}
          </div>
        )}
        {errorMsg && (
          <div className="absolute top-4 right-8" style={{ color: "#e84118" }}>
            {errorMsg}
          </div>
        )}

        <div className="break-words m-4">
          <SaveButton jsonData={bookmarkAry} />
          &nbsp;
          <ClearButton />
        </div>
      </div>
      <div className={"w-1/2 m-2"}>
        <BookmarkJsonData bookmarkAry={bookmarkAry} hasDescription={true} />
      </div>
    </>
  );
}
