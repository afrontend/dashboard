import React from "react";

interface ToggleSwitchProps {
  name: string;
  onOff: boolean;
  setOnOff: (checked: boolean) => void;
}

export function ToggleSwitch({ name, onOff, setOnOff }: ToggleSwitchProps) {
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
