import React from "react";

export function Switch({name = '', onOff, setOnOff}) {
  return <div>
    <input type="checkbox" id="cb" checked={onOff} onClick={e => setOnOff(e.target.checked)} />
    <label for="cb">{name}</label>
  </div>
}

