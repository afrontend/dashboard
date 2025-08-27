import React, { useState, ChangeEvent } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { ClearButton } from "../components/ClearButton";
import { SaveButton } from "../components/SaveButton";
import { getJsonData, isJSON } from "../js/utils";

type Bookmark = [string, string];

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
        <div className="ml-2">
          <SaveButton jsonData={bookmarkAry} />, <ClearButton />, &nbsp;
          {msg && (
            <span className="" style={{ color: "#8c7ae6" }}>
              {msg}
            </span>
          )}
          {errorMsg && (
            <span className="" style={{ color: "#e84118" }}>
              {errorMsg}
            </span>
          )}
        </div>
        <div className="w-full h-[calc(100vh-200px)]">
          <textarea
            className="rounded-sm p-4 border-2 border-solid border-purple-500/75 h-[calc(100vh-200px)]"
            value={bookmarkText}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={"w-1/2 m-2"}>
        <BookmarkJsonData bookmarkAry={bookmarkAry} hasDescription={true} />
      </div>
    </>
  );
}
