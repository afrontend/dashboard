import React, {useEffect, useState} from "react";
import bookmarkCss from '../css/bookmark.module.css';
import buttonCss from '../css/button.module.css';

export function Bookmark({hasDescription, jsonFilename = 'bookmark.json'}) {
  const [bookmarkAry, setBookmark] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const path = (`json/${jsonFilename}?` + (new Date()).valueOf())
      const response = await fetch(path);
      const bList = await response.json();
      setBookmark(bList)
    };
    fetchData();
  }, []);

  if (bookmarkAry.length === 0) return <div>Loading...</div>

  return bookmarkAry.map(
    (b, index)  => <div style={{marginBottom: '0.5rem'}} key={b.link + index}>
      <a href={b.link} className={buttonCss.btn}>{b.name}</a>
      &nbsp;
      {hasDescription && <span className={bookmarkCss.description}>{b.link}</span>}
    </div>
  )
}

