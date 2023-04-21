import React, {useState} from "react";
import { BookmarkJsonFile } from "../components/BookmarkJsonFile";
import { BookmarkJsonData } from "../components/BookmarkJsonData";
// import { TextForCopy } from "../components/TextForCopy";
import { Switch } from "../components/Switch";
import  * as classes from '../css/App.module.css'

const initialData = [
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

const initialJsonFile = localStorage.getItem('useJsonFile') === 'true'

export function App() {
  const jsonData = getJsonData()
  const jsonAry = jsonData.length === 0 ? initialData : jsonData
  const [bookmarkAry, setBookmarkAry] = useState(jsonAry)
  const [bookmarkText, setBookmarkText] = useState(JSON.stringify(jsonAry, null, 2))
  const [useJsonFile, setJsonFile] = useState(initialJsonFile)
  const [msg, setMsg] = useState("")

  function handleSwitch(checked) {
    if (checked) {
      setJsonFile(true)
      localStorage.setItem('useJsonFile', 'true')
    } else {
      setJsonFile(false)
      localStorage.setItem('useJsonFile', 'false')
    }
  }

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
    <h2> Dashboard </h2>
    <div style={{ marginBottom: '1rem' }}><Switch onOff={useJsonFile} setOnOff={handleSwitch} name="use JSON file"/></div>
    {!useJsonFile && <div className={classes.link}><Link jsonData={bookmarkAry}/></div>}
    <div className={classes.wrapper}>
      { !useJsonFile && <>
        <div className={classes.side}>
          <textarea className={classes.textarea} value={bookmarkText} onChange={handleChange}/>
        </div>
        <div className={classes.rightSide}>
          {msg && <pre>{msg}</pre>}
          <BookmarkJsonData
            bookmarkAry={bookmarkAry}
          />
        </div>
      </>
      }
      {useJsonFile && <>
        <div className={classes.side}>
          <BookmarkJsonFile
            jsonFilename="officeBookmark.json"
          />
        </div>
        <div className={classes.side}>
          <BookmarkJsonFile
            jsonFilename="homeBookmark.json"
          />
        </div>
      </>}
    </div>
    {/* <h2>Text For Copy</h2> */}
    {/* <TextForCopy /> */}
  </div>;
}

