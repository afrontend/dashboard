import React, { useState } from "react";

export function useFileSelectionFlag() {
  const [isDashboard, setIsDashboard] = useState<boolean>(
    localStorage.getItem("fileSelectionFlag") !== "false",
  );

  function handleSwitch(checked: boolean) {
    if (checked) {
      setIsDashboard(true);
      localStorage.setItem("fileSelectionFlag", "true");
      return;
    }
    setIsDashboard(false);
    localStorage.setItem("fileSelectionFlag", "false");
  }

  const filename = isDashboard ? "dashboard.json" : "another.json";

  const FileSelectionFlag = () => {
    return (
      <div>
        <input
          className="mr-2"
          type="checkbox"
          id="fileSelectionCb"
          checked={isDashboard}
          onChange={(e) => handleSwitch(e.target.checked)}
        />
        <label htmlFor="fileSelectionCb">Use dashboard.json</label>
      </div>
    );
  };

  return { filename, FileSelectionFlag };
}