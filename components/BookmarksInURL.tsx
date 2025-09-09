import React, { useState, ChangeEvent } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { ClearButton } from "../components/ClearButton";
import { SaveButton } from "../components/SaveButton";
import { getJsonData, isJSON } from "../js/utils";
import { TBookmark } from "../types";

export function BookmarksInURL() {
  const jsonAry = getJsonData();
  const [bookmarkAry, setBookmarkAry] = useState<TBookmark[]>(jsonAry);
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
      const jsonAry: TBookmark[] = JSON.parse(text);
      setBookmarkAry(jsonAry);
      return;
    }
    setMsg("");
    setErrorMsg("Invalid JSON");
  }

  return (
    <>
      <div className="w-1/2 relative">
        <div className="w-full">
          <textarea
            className={`rounded-sm p-2 border-2 border-solid h-[calc(100vh-300px)] ${
              errorMsg ? "border-red-600" : "border-purple-500/75"
            }`}
            value={bookmarkText}
            onChange={handleChange}
          />
          <div className="mt-2 mb-2 flex justify-end items-center gap-2">
            {msg && (
              <span className="" style={{ color: "#8c7ae6" }}>
                &nbsp; {msg}
              </span>
            )}
            {errorMsg && (
              <span className="" style={{ color: "#e84118" }}>
                &nbsp; {errorMsg}
              </span>
            )}
            <SaveButton jsonData={bookmarkAry} /> <ClearButton />
          </div>
        </div>
      </div>
      <div className={"w-1/2 m-2"}>
        <BookmarkJsonData bookmarkAry={bookmarkAry} />
      </div>
    </>
  );
}
