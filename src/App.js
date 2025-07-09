import React, { useState } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { BookmarkJsonFile } from "../components/BookmarkJsonFile";
import { getJsonData, isJSON } from "../js/utils";
// import { TextForCopy } from "../components/TextForCopy";
import { JSONToggleSwitch } from "../components/JSONToggleSwitch";
import { SaveButton } from "../components/SaveButton";
import { ClearButton } from "../components/ClearButton";

export function App() {
  const jsonAry = getJsonData();
  const [bookmarkAry, setBookmarkAry] = useState(jsonAry);
  const [bookmarkText, setBookmarkText] = useState(
    JSON.stringify(jsonAry, null, 2),
  );
  const [useJsonFile, setUseJsonFile] = useState(
    localStorage.getItem("useJsonFile") === "true",
  );
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleSwitch(checked) {
    if (checked) {
      setUseJsonFile(true);
      localStorage.setItem("useJsonFile", "true");
      return;
    }
    setUseJsonFile(false);
    localStorage.setItem("useJsonFile", "false");
  }

  function handleChange(e) {
    const text = e.target.value;
    setBookmarkText(text);
    if (text && isJSON(text)) {
      setMsg("Valid JSON");
      setErrorMsg("");
      const jsonAry = JSON.parse(text);
      setBookmarkAry(jsonAry);
      return;
    }
    setMsg("");
    setErrorMsg("Invalid JSON");
  }

  return (
    <div className={"bg-gray-300 mx-auto max-w-6xl p-5"}>
      <h2> Dashboard </h2>
      <div className={"mb-4 ml-4"}>
        <JSONToggleSwitch
          onOff={useJsonFile}
          setOnOff={handleSwitch}
          name="Use JSON file"
        />
      </div>

      <div className={"flex items-start justify-center"}>
        {useJsonFile ? (
          <>
            <div className="w-1/2 relative">
              <BookmarkJsonFile jsonFilename="officeBookmark.json" />
            </div>
            <div className="w-1/2 relative">
              <BookmarkJsonFile jsonFilename="homeBookmark.json" />
            </div>
          </>
        ) : (
          <>
            <div className="w-1/2 relative">
              <textarea
                className="rounded-sm p-4 border-2 border-solid border-purple-500/75 h-[calc(100vh-400px)] w-[95%] m-2"
                value={bookmarkText}
                onChange={handleChange}
              />
              {msg && (
                <div
                  className="absolute top-4 right-8"
                  style={{ color: "#8c7ae6" }}
                >
                  {msg}
                </div>
              )}
              {errorMsg && (
                <div
                  className="absolute top-4 right-8"
                  style={{ color: "#e84118" }}
                >
                  {errorMsg}
                </div>
              )}

              <div className="break-words m-4">
                <SaveButton jsonData={bookmarkAry} />
                <ClearButton />
              </div>
            </div>
            <div className={"w-1/2 m-2"}>
              <BookmarkJsonData
                bookmarkAry={bookmarkAry}
                hasDescription={true}
              />
            </div>
          </>
        )}
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
