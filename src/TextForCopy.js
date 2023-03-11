import React, {useEffect, useState} from "react";
import '../css/button.css'

export function TextForCopy() {
  const [textAry, setText] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('json/text.json?');
      const tList = await response.json();
      setText(tList)
    };
    fetchData();
  }, []);

  function toClipboard(e) {
    const text = e.target.innerText
    navigator.clipboard.writeText(text)
      .then(()=>{})
  }

  if (textAry.length === 0) return 'Loading...'

  return textAry.map(
    (text, index) => <button key={text.content + index} onClick={toClipboard}>{text.content}</button>
  )
}

