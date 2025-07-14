import React, { useState } from "react";

import { ToggleSwitch } from "../components/ToggleSwitch";

export function useFileToggleSwitch() {
  const [useFile, setUseFile] = useState(
    localStorage.getItem("useFileFlag") === "true",
  );

  function handleSwitch(checked) {
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
      <ToggleSwitch
        onOff={useFile}
        setOnOff={handleSwitch}
        name="Use local JSON file"
      />
    );
  };

  return { useFile, SwitchComponent };
}
