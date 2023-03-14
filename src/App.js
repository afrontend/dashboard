import React, {useState} from "react";
import { Bookmark } from "../components/Bookmark";
import { TextForCopy } from "../components/TextForCopy";
import { Switch } from "../components/Switch";
import * as classes  from '../css/App.module.css'

export function App() {
  const [hasDescription, toggleDescription] = useState(false)
  return <div className={classes.background}>
    <h1>Dashboard</h1>
    <div className={classes.wrapper}>
      <div className={classes.side}>
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
      </div>
    </div>
    <Switch onOff={hasDescription} setOnOff={toggleDescription} name="show description"/>
    <h1>Text For Copy</h1>
    <TextForCopy />
  </div>;
}

