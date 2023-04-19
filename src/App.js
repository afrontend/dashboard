import React, {useState} from "react";
import { Bookmark } from "../components/Bookmark";
import { TextForCopy } from "../components/TextForCopy";
import { Switch } from "../components/Switch";
import  * as classes from '../css/App.module.css'

const mock = [
  {
    "name": "🌤 Daily",
    "link": ""
  }
]

function getUrlParameter() {
  return '?data=' + encodeURIComponent(JSON.stringify(mock))
}

function Link() {
  const param = getUrlParameter();
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

export function App() {
  const [hasDescription, toggleDescription] = useState(false)
  const [bookmarkAry] = useState(getJsonData())

  console.log('apple', bookmarkAry);

  return <div className={classes.background}>
    <h2>Dashboard</h2>
    <div className={classes.wrapper}>
      <div className={classes.side}>
        <pre>
          {JSON.stringify(bookmarkAry, null, 2)}
        </pre>
      </div>
      <div className={classes.side}>
        <Bookmark
          hasDescription={hasDescription}
          jsonData={bookmarkAry}
        />
      </div>
      {/* <div className={classes.side}>
        <Bookmark
          hasDescription={hasDescription}
          jsonFilename="officeBookmark.json"
        />
      </div>
      <div className={classes.side}>
        <Bookmark
          hasDescription={hasDescription}
          jsonFilename="homeBookmark.json"
        />
      </div> */}
    </div>
    <Switch onOff={hasDescription} setOnOff={toggleDescription} name="show description"/>
    <h2>Text For Copy</h2>
    <TextForCopy />
  </div>;
}

