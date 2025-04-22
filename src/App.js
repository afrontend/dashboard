import React, { useState } from "react";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
import { BookmarkJsonFile } from "../components/BookmarkJsonFile";
import { getJsonData, isJSON } from "../js/utils";
// import { TextForCopy } from "../components/TextForCopy";
import { Switch } from "../components/Switch";
import * as classes from "../css/App.module.css";

function Link(a) {
  const jsonData = a.jsonData;
  const param = jsonData
    ? "?data=" + encodeURIComponent(JSON.stringify(jsonData))
    : "?data=";
  const { origin, pathname } = window.location;
  const url = origin + pathname + param;
  return <a href={url}>Save</a>;
}

function Clear() {
  return <a href={"/"}>Clear</a>;
}

export function App() {
  const jsonAry = getJsonData(window.location.search);
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
        <Switch
          onOff={useJsonFile}
          setOnOff={handleSwitch}
          name="Use JSON file"
        />
      </div>
      <div className={classes.wrapper}>
        {!useJsonFile && (
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
                <Link jsonData={bookmarkAry} /> <Clear />
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
        {useJsonFile && (
          <>
            <div className={classes.side}>
              <BookmarkJsonFile jsonFilename="officeBookmark.json" />
            </div>
            <div className={classes.side}>
              <BookmarkJsonFile jsonFilename="homeBookmark.json" />
            </div>
          </>
        )}
      </div>
      {/* <h2>Text For Copy</h2> */}
      {/* <TextForCopy /> */}
    </div>
  );
}
