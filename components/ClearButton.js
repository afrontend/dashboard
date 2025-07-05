import React from "react";
import * as buttonCss from "../css/button.module.css";

export function ClearButton() {
  return (
    <a href={"/"}>
      <button className={buttonCss.btn}>Clear</button>
    </a>
  );
}
