import React, {useState} from "react";
// import { BookmarkJsonFile } from "../components/BookmarkJsonFile";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
// import { TextForCopy } from "../components/TextForCopy";
// import { Switch } from "../components/Switch";
import  * as classes from '../css/App.module.css'

const mock = [
  {
    "name": "🌤 Daily",
    "link": ""
  }
]

function Link({ jsonData }) {
  const param = '?data=' + encodeURIComponent(JSON.stringify(jsonData))
  const { origin, pathname } = window.location;
  const url = origin + pathname + param;
  return (
    <a href={url}>{url}</a>
  );
}

function getJsonData() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const d = urlParams.get('data')
  if (d) {
    return JSON.parse(decodeURIComponent(d))
  }
  return []
}

function isJSON(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export function App() {
  const jsonAry = getJsonData()
  const [bookmarkAry, setBookmarkAry] = useState(jsonAry.length === 0 ? mock : jsonAry)
  const [bookmarkText, setBookmarkText] = useState(JSON.stringify(jsonAry.length === 0 ? mock : jsonAry, null, 2))
  const [hasDescription, toggleDescription] = useState(false)
  const [msg, setMsg] = useState("")

  function handleChange (e) {
    const text = e.target.value;
    setBookmarkText(text)
    if (text && isJSON(text)) {
      setMsg("Valid JSON")
      const jsonAry = JSON.parse(text)
      setBookmarkAry(jsonAry)
    } else {
      setMsg("Invalid JSON")
    }
  }

  return <div className={classes.background}>
    <h2>Dashboard</h2>
    <div className={classes.link}><Link jsonData={bookmarkAry}/></div>
    <div className={classes.wrapper}>
      <div className={classes.side}>
        <textarea className={classes.textarea} value={bookmarkText} onChange={handleChange}/>
      </div>
      <div className={classes.rightSide}>
        {msg && <pre>{msg}</pre>}
        <BookmarkJsonData
          hasDescription={hasDescription}
          bookmarkAry={bookmarkAry}
        />
      </div>
      {/* <div className={classes.side}>
        <BookmarkJsonFile
          hasDescription={hasDescription}
          jsonFilename="officeBookmark.json"
        />
      </div>
      <div className={classes.side}>
        <BookmarkJsonFile
          hasDescription={hasDescription}
          jsonFilename="homeBookmark.json"
        />
      </div> */}
    </div>
    {/* <Switch onOff={hasDescription} setOnOff={toggleDescription} name="show description"/> */}
    {/* <h2>Text For Copy</h2> */}
    {/* <TextForCopy /> */}
  </div>;
}

