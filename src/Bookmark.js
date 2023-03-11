import React, {useEffect, useState} from "react";
import * as classes from '../css/bookmark.module.css';

export function Bookmark({hasDescription}) {
  const [bookmarks, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('json/bookmark.json?');
      const bList = await response.json();
      setList(bList)
    };
    fetchData();
  }, []);

  if (bookmarks.length === 0) return 'Loading...'

  return bookmarks.map(
    (b, index)  => <div key={b.link + index}>
      <a href={b.link}>{b.name}</a>
      &nbsp;
      {hasDescription && <span className={classes.description}>{b.link}</span>}
    </div>
  )
}

