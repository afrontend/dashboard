import React from "react";
import PropTypes from "prop-types";
import * as buttonCss from "../css/button.module.css";

SaveButton.propTypes = {
  jsonData: PropTypes.string,
};

export function SaveButton({ jsonData }) {
  const param = jsonData
    ? "?data=" + encodeURIComponent(JSON.stringify(jsonData))
    : "?data=";
  const { origin, pathname } = window.location;
  const url = origin + pathname + param;
  return (
    <a href={url}>
      <button className={buttonCss.btn}>Save</button>
    </a>
  );
}
