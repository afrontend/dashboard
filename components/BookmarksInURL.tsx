import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { ClearButton } from "../components/ClearButton";
import { SaveButton } from "../components/SaveButton";
import { getJsonData, isJSON } from "../js/utils";
import { TBookmark } from "../types";

interface BookmarksInURLProps {
  showURL?: boolean;
}

export function BookmarksInURL({ showURL = false }: BookmarksInURLProps) {
  const jsonAry = getJsonData();
  const [bookmarkAry, setBookmarkAry] = useState<TBookmark[]>(jsonAry);
  const [bookmarkText, setBookmarkText] = useState<string>(
    JSON.stringify(jsonAry, null, 2),
  );
  const [msg, setMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [saveMsg, setSaveMsg] = useState<string>("");

  function handleChange(text: string) {
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

  function handleSave() {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const shortcut = isMac ? "⌘D" : "Ctrl+D";
    setSaveMsg(`URL updated! Press ${shortcut} to bookmark this page`);
  }

  useEffect(() => {
    if (saveMsg) {
      const timer = setTimeout(() => {
        setSaveMsg("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [saveMsg]);

  return (
    <>
      <div className="w-1/2 relative">
        <div className="w-full">
          <div
            className={`rounded-sm border-2 border-solid overflow-hidden ${
              errorMsg ? "border-red-600" : "border-purple-500/75"
            }`}
          >
            <CodeMirror
              value={bookmarkText}
              height="calc(100vh - 300px)"
              extensions={[json()]}
              onChange={handleChange}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                foldGutter: true,
                bracketMatching: true,
              }}
            />
          </div>
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
            {saveMsg && (
              <span className="" style={{ color: "#10ac84" }}>
                &nbsp; {saveMsg}
              </span>
            )}
            <SaveButton jsonData={bookmarkAry} onSave={handleSave} />{" "}
            <ClearButton />
          </div>
        </div>
      </div>
      <div className={"w-1/2 m-2"}>
        <BookmarkJsonData bookmarkAry={bookmarkAry} showURL={showURL} />
      </div>
    </>
  );
}
