import React from "react";
import PropTypes from "prop-types";

ToggleSwitch.propTypes = {
  name: PropTypes.string.isRequired,
  onOff: PropTypes.bool,
  setOnOff: PropTypes.func.isRequired,
};

export function ToggleSwitch({ name, onOff, setOnOff }) {
  return (
    <div>
      <input
        type="checkbox"
        id="cb"
        checked={onOff}
        onChange={(e) => setOnOff(e.target.checked)}
      />
      <label htmlFor="cb">{name}</label>
    </div>
  );
}
