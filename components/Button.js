import React from "react";
import PropTypes from "prop-types";
import * as buttonCss from "../css/button.module.css";

Button.propTypes = {
  name: PropTypes.string,
};

export function Button({ name }) {
  return <button className={buttonCss.btn}>{name}</button>;
}
