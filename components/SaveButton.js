import React from "react";
import PropTypes from "prop-types";

SaveButton.propTypes = {
  jsonData: PropTypes.array,
};

export function SaveButton({ jsonData }) {
  const param = jsonData
    ? "?data=" + encodeURIComponent(JSON.stringify(jsonData))
    : "?data=";
  const { origin, pathname } = window.location;
  const url = origin + pathname + param;
  return (
    <a href={url}>
      <button>Save</button>
    </a>
  );
}
