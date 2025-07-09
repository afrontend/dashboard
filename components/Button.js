import React from "react";
import PropTypes from "prop-types";

Button.propTypes = {
  name: PropTypes.string,
};

export function Button({ name }) {
  return <button>{name}</button>;
}
