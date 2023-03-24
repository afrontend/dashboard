import React, {useEffect, useState} from "react";
import buttonCss from '../css/button.module.css';

const COPIED_MESSAGE = 'copied'

export function TextForCopy() {
  const [textAry, setTextAry] = useState([])
  const [message, setMessage] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('json/text.json?' + (new Date()).valueOf());
      const tList = await response.json();
      setTextAry(tList)
    };
    fetchData();
  }, []);


  function toClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(()=>{
        setMessage(text)
        setTimeout(() => {
          setMessage('')
        }, 2000);
      })
  }

  if (textAry.length === 0) return 'Loading...'

  return textAry.map(
    (text, index) => <div style={{marginBottom: '0.5rem'}} key={text.content + index}>
      <a className={buttonCss.btn} onClick={() => toClipboard(text.content)}>{text.content}</a>
      &nbsp;
      {message === text.content && COPIED_MESSAGE}
    </div>
  )
}

