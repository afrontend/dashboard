import {useEffect, useState} from "react";

export function Bookmark() {
  const [bookmarks, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('json/bookmark.json?');
      const bList = await response.json();
      console.log(bList)
      setList(bList)
    };
    fetchData();
  }, []);

  if (bookmarks.length === 0) return 'loading'

  return bookmarks.map(
    (bookmark)  => <>
      <a href={bookmark.link}>{bookmark.name}</a>
      <span className="description">{bookmark.link}</span>
      <br />
    </>
  )
}

