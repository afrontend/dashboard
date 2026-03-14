import { useState } from "react";

export function useEditorVisible() {
  const [visible, setVisible] = useState<boolean>(
    localStorage.getItem("editorVisible") !== "false",
  );

  function toggle() {
    const next = !visible;
    setVisible(next);
    localStorage.setItem("editorVisible", String(next));
  }

  return { visible, toggle };
}
