import {useEffect, useState} from "react";
import '../css/bookmark.css';

export function Bookmark() {
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
    (bookmark)  => <div key={bookmark.link}>
      <a href={bookmark.link}>{bookmark.name}</a>
      <span className="description">{bookmark.link}</span>
    </div>
  )
}

