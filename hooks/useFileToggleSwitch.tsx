import React, { useState } from "react";

export function useFileToggleSwitch() {
  const [useFile, setUseFile] = useState<boolean>(
    localStorage.getItem("useFileFlag") === "true",
  );

  function handleSwitch(checked: boolean) {
    if (checked) {
      setUseFile(true);
      localStorage.setItem("useFileFlag", "true");
      return;
    }
    setUseFile(false);
    localStorage.setItem("useFileFlag", "false");
  }

  const SwitchComponent = () => {
    return (
      <div>
        <input
          type="checkbox"
          id="cb"
          checked={useFile}
          onChange={(e) => handleSwitch(e.target.checked)}
        />
        <label htmlFor="cb">Use local JSON file</label>
      </div>
    );
  };

  return { useFile, SwitchComponent };
}
