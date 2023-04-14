import React, {useEffect, useState} from "react";
import * as bookmarkCss from '../css/bookmark.module.css';
import * as buttonCss from '../css/button.module.css';

export function Bookmark({hasDescription, jsonFilename = 'bookmark.json'}) {
  const [bookmarkAry, setBookmark] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const path = (`json/${jsonFilename}?` + (new Date()).valueOf())
      try {
        const response = await fetch(path);
        const bList = await response.json();
        setBookmark(bList)
      } catch(error) {
        console.log(error)
        setErrorMsg(String(error))
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>
  if (errorMsg) return <pre>{errorMsg}</pre>

  return bookmarkAry.map(
    (b, index)  => <div style={{marginBottom: '0.5rem'}} key={b.link + index}>
      <a href={b.link} className={buttonCss.btn}>{b.name}</a>
      &nbsp;
      {hasDescription && <span className={bookmarkCss.description}>{b.link}</span>}
    </div>
  )
}

