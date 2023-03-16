import React, {useEffect, useState} from "react";
import * as classes from '../css/bookmark.module.css';

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
    (b, index)  => <div key={b.link + index}>
      <button>
        <a href={b.link}>{b.name}</a>
      </button>
      &nbsp;
      {hasDescription && <span className={classes.description}>{b.link}</span>}
    </div>
  )
}

