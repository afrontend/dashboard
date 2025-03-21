import React from "react";
import * as bookmarkCss from "../css/bookmark.module.css";
import * as buttonCss from "../css/button.module.css";

export function BookmarkJsonData({ hasDescription, bookmarkAry = [] }) {
  const bAry = bookmarkAry && bookmarkAry.length > 0 ? bookmarkAry : [];
  return bAry.map((b, index) => (
    <div style={{ marginBottom: "0.5rem" }} key={b.link + index}>
      <a href={b.link} className={buttonCss.btn}>
        {b.name}
      </a>
      &nbsp;
      {hasDescription && (
        <span className={bookmarkCss.description}>{b.link}</span>
      )}
    </div>
  ));
}
