import {useEffect, useState} from "react";

export function Bookmark() {
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('json/bookmark.json?');
      const bookmarkList = await response.json();
      console.log(bookmarkList)
      setList(bookmarkList)
    };
    fetchData();
  });

  return list.map(
    b => <>
      <a href="{b.link}">{b.name}</a>
      <span className="description">{b.link}</span>
      <br />
    </>
  )
}

