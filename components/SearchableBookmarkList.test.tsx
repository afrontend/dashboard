// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchableBookmarkList } from "./SearchableBookmarkList";
import { TBookmark } from "../types";

(
  globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  }
).IS_REACT_ACT_ENVIRONMENT = true;

function setNativeValue(element: HTMLInputElement, value: string) {
  const { set } =
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value") ?? {};
  set?.call(element, value);
}

vi.mock("./BookmarkJsonData", () => ({
  BookmarkJsonData: ({
    bookmarkAry,
    searchTerm,
    onReorder,
  }: {
    bookmarkAry: TBookmark[];
    searchTerm?: string;
    onReorder?: (_: TBookmark[]) => void;
  }) => (
    <div
      data-count={String(bookmarkAry.length)}
      data-search-term={searchTerm ?? ""}
      data-reorder-enabled={String(Boolean(onReorder))}
    >
      {bookmarkAry.map((bookmark, index) => (
        <span key={`${bookmark.label}-${index}`}>{bookmark.label}</span>
      ))}
    </div>
  ),
}));

const bookmarks: TBookmark[] = [
  { label: "Google", url: "https://google.com" },
  { label: "GitHub", url: "https://github.com" },
];

describe("SearchableBookmarkList", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("opens filter with S and narrows results", () => {
    const onReorder = vi.fn();

    act(() => {
      root.render(
        <SearchableBookmarkList bookmarkAry={bookmarks} onReorder={onReorder} />,
      );
    });

    expect(container.textContent).toContain("Press S to search");

    act(() => {
      document.body.dispatchEvent(
        new KeyboardEvent("keydown", { key: "s", bubbles: true }),
      );
    });

    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-label")).toBe("Filter bookmarks");

    act(() => {
      setNativeValue(input!, "git");
      input!.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(container.textContent).toContain("1 / 2 results");

    const data = container.querySelector("[data-count]");
    expect(data?.getAttribute("data-count")).toBe("1");
    expect(data?.getAttribute("data-search-term")).toBe("git");
    expect(data?.getAttribute("data-reorder-enabled")).toBe("false");
  });

  it("closes filter with Escape", () => {
    act(() => {
      root.render(<SearchableBookmarkList bookmarkAry={bookmarks} />);
    });

    act(() => {
      document.body.dispatchEvent(
        new KeyboardEvent("keydown", { key: "s", bubbles: true }),
      );
    });
    expect(container.querySelector("input")).not.toBeNull();

    act(() => {
      document.body.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
    });

    expect(container.querySelector("input")).toBeNull();
    expect(container.textContent).toContain("Press S to search");
  });
});
