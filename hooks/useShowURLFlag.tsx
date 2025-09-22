import React, { useState } from "react";

export function useShowURLFlag() {
  const [flag, setFlag] = useState<boolean>(
    localStorage.getItem("showURLFlag") === "true",
  );

  function handleSwitch(checked: boolean) {
    if (checked) {
      setFlag(true);
      localStorage.setItem("showURLFlag", "true");
      return;
    }
    setFlag(false);
    localStorage.setItem("showURLFlag", "false");
  }

  const ShowURLFlag = () => {
    return (
      <div>
        <input
          className="mr-2"
          type="checkbox"
          id="showURLCb"
          checked={flag}
          onChange={(e) => handleSwitch(e.target.checked)}
        />
        <label htmlFor="showURLCb">Show URLs</label>
      </div>
    );
  };

  return { flag, ShowURLFlag };
}