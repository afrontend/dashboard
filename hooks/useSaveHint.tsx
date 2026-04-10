import { useState } from "react";

const STORAGE_KEY = "hasSeenSaveHint";

export function useSaveHint() {
  const [visible, setVisible] = useState<boolean>(false);

  function show() {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setVisible(true);
    }
  }

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  return { visible, show, dismiss };
}
