import React, { useEffect, useState } from "react";

const COPIED_MESSAGE = "copied";

interface TextItem {
  content: string;
}

export function TextForCopy() {
  const [textAry, setTextAry] = useState<TextItem[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("json/text.json?" + new Date().valueOf());
      const tList: TextItem[] = await response.json();
      setTextAry(tList);
    };
    fetchData();
  }, []);

  function toClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setMessage(text);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    });
  }

  if (textAry.length === 0) return "Loading...";

  return textAry.map((text, index) => (
    <div style={{ marginBottom: "0.5rem" }} key={text.content + index}>
      <a onClick={() => toClipboard(text.content)}>{text.content}</a>
      &nbsp;
      {message === text.content && COPIED_MESSAGE}
    </div>
  ));
}
