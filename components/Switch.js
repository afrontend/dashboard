import React from "react";

export function Switch({name = '', onOff, setOnOff}) {
  return <div>
    <input type="checkbox" id="cb" checked={onOff} onChange={e => setOnOff(e.target.checked)} />
    <label htmlFor="cb"> {name}</label>
  </div>
}

