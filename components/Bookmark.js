import React, {useEffect, useState} from "react";
import classes from '../css/bookmark.module.css';

export function Bookmark({hasDescription, jsonFilename = 'bookmark.json'}) {
  const [bookmarks, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const path = (`json/${jsonFilename}?`)
      const response = await fetch(path);
      const bList = await response.json();
      setList(bList)
    };
    fetchData();
  }, []);

  if (bookmarks.length === 0) return 'Loading...'

  return bookmarks.map(
    (b, index)  => <div style={{ marginBottom: '0.5rem' }}key={b.link + index}>
      <a href={b.link} className={classes.btn}>{b.name}</a>
      &nbsp;
      {hasDescription && <span className={classes.description}>{b.link}</span>}
    </div>
  )
}

