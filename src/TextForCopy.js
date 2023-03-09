import {useEffect, useState} from "react";

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

  if (textAry.length === 0) return 'Loading...'

  return textAry.map(
    (text) => <div key={text.text}>
      <button>{text.text}</button>
    </div>
  )
}

