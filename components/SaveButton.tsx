import React from "react";
import { TBookmark } from "../types";

interface SaveButtonProps {
  jsonData?: TBookmark[];
  onSave?: () => void;
}

export function SaveButton({ jsonData, onSave }: SaveButtonProps) {
  const handleClick = () => {
    const param = jsonData
      ? "?data=" + encodeURIComponent(JSON.stringify(jsonData))
      : "?data=";
    const { origin, pathname } = window.location;
    const url = origin + pathname + param;
    window.history.pushState({}, "", url);
    if (onSave) {
      onSave();
    }
  };

  return <button onClick={handleClick}>Save</button>;
}
