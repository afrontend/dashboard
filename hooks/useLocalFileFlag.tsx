import React, { useState } from "react";

export function useLocalFileFlag() {
  const [flag, setFlag] = useState<boolean>(
    localStorage.getItem("useFileFlag") === "true",
  );

  function handleSwitch(checked: boolean) {
    if (checked) {
      setFlag(true);
      localStorage.setItem("useFileFlag", "true");
      return;
    }
    setFlag(false);
    localStorage.setItem("useFileFlag", "false");
  }

  const LocalFileFlag = () => {
    return (
      <div>
        <input
          className="mr-2"
          type="checkbox"
          id="cb"
          checked={flag}
          onChange={(e) => handleSwitch(e.target.checked)}
        />
        <label htmlFor="cb">Use local file</label>
      </div>
    );
  };

  return { flag, LocalFileFlag };
}
