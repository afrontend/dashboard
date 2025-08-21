import React from "react";

interface Bookmark {
  name: string;
  link: string;
}

interface SaveButtonProps {
  jsonData?: Bookmark[];
}

export function SaveButton({ jsonData }: SaveButtonProps) {
  const param = jsonData
    ? "?data=" + encodeURIComponent(JSON.stringify(jsonData))
    : "?data=";
  const { origin, pathname } = window.location;
  const url = origin + pathname + param;
  return <a href={url}> Save</a>;
}
