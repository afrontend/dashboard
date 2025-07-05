import React, { useState } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { BookmarkJsonFile } from "../components/BookmarkJsonFile";
import { getJsonData, isJSON } from "../js/utils";
// import { TextForCopy } from "../components/TextForCopy";
import { JSONToggleSwitch } from "../components/JSONToggleSwitch";
import * as classes from "../css/App.module.css";
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
    <div className={classes.background}>
      <h2> Dashboard </h2>
      <div style={{ marginBottom: "1rem", marginLeft: "1rem" }}>
        <JSONToggleSwitch
          onOff={useJsonFile}
          setOnOff={handleSwitch}
          name="Use JSON file"
        />
      </div>
      <div className={classes.wrapper}>
        {useJsonFile ? (
          <>
            <div className={classes.side}>
              <BookmarkJsonFile jsonFilename="officeBookmark.json" />
            </div>
            <div className={classes.side}>
              <BookmarkJsonFile jsonFilename="homeBookmark.json" />
            </div>
          </>
        ) : (
          <>
            <div className={classes.side}>
              <textarea
                className={classes.textarea}
                value={bookmarkText}
                onChange={handleChange}
              />
              {msg && (
                <div className={classes.msg} style={{ color: "#8c7ae6" }}>
                  {msg}
                </div>
              )}
              {errorMsg && (
                <div className={classes.msg} style={{ color: "#e84118" }}>
                  {errorMsg}
                </div>
              )}
              <div className={classes.link}>
                <SaveButton jsonData={bookmarkAry} />
                <ClearButton />
              </div>
            </div>
            <div className={classes.rightSide}>
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
