import React, { useState } from "react";

import { JSONToggleSwitch } from "../components/JSONToggleSwitch";

export function useFileToggleSwitch() {
  const [useFile, setUseFile] = useState(
    localStorage.getItem("useFile") === "true",
  );

  function handleSwitch(checked) {
    if (checked) {
      setUseFile(true);
      localStorage.setItem("useFile", "true");
      return;
    }
    setUseFile(false);
    localStorage.setItem("useFile", "false");
  }

  const SwitchComponent = () => {
    return (
      <JSONToggleSwitch
        onOff={useFile}
        setOnOff={handleSwitch}
        name="Use JSON file"
      />
    );
  };

  return { useFile, SwitchComponent };
}
