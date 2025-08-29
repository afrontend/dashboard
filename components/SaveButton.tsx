import React from "react";

type Bookmark = [string, string];

interface SaveButtonProps {
  jsonData?: Bookmark[];
}

export function SaveButton({ jsonData }: SaveButtonProps) {
  const param = jsonData
    ? "?data=" + encodeURIComponent(JSON.stringify(jsonData))
    : "?data=";
  const { origin, pathname } = window.location;
  const url = origin + pathname + param;
  return (
    <a href={url}>
      <button>Save</button>
    </a>
  );
}
