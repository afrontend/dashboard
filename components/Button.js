import React from "react";
import * as buttonCss from "../css/button.module.css";

export function Button({ name }) {
  return <button className={buttonCss.btn}>{name}</button>;
}
