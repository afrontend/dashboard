import React, {useState} from "react";
import { Bookmark } from "./Bookmark";
import { TextForCopy } from "./TextForCopy";
import { Switch } from "./Switch";
import '../css/App.css'

export function App() {
  const [hasDescription, toggleDescription] = useState(false)
  return <div className="background">
    <h1>Dashboard</h1>
    <Bookmark hasDescription={hasDescription} />
    <Switch onOff={hasDescription} setOnOff={toggleDescription} name="show description"/>
    <h1>Text For Copy</h1>
    <TextForCopy />
  </div>;
}

