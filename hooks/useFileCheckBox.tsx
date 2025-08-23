import React, { useState } from "react";

export function useFileCheckBox() {
  const [useFileFlag, setUseFileFlag] = useState<boolean>(
    localStorage.getItem("useFileFlag") === "true",
  );

  function handleSwitch(checked: boolean) {
    if (checked) {
      setUseFileFlag(true);
      localStorage.setItem("useFileFlag", "true");
      return;
    }
    setUseFileFlag(false);
    localStorage.setItem("useFileFlag", "false");
  }

  const FileFlagCheckBox = () => {
    return (
      <div>
        <input
          className="mr-2"
          type="checkbox"
          id="cb"
          checked={useFileFlag}
          onChange={(e) => handleSwitch(e.target.checked)}
        />
        <label htmlFor="cb">Use dashboard.json file</label>
      </div>
    );
  };

  return { useFileFlag, FileFlagCheckBox };
}
