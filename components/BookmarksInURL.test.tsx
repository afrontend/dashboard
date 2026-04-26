// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BookmarksInURL } from "./BookmarksInURL";

(
  globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  }
).IS_REACT_ACT_ENVIRONMENT = true;

function setNativeValue(
  element: HTMLTextAreaElement,
  value: string,
) {
  const { set } =
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value") ??
    {};
  set?.call(element, value);
}

vi.mock("@uiw/react-codemirror", () => ({
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (_: string) => void;
  }) => (
    <textarea
      aria-label="Bookmark editor"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

vi.mock("@codemirror/lang-json", () => ({
  json: () => ({}),
}));

describe("BookmarksInURL", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    container.remove();
  });

  it("accepts object JSON and normalizes bookmarks", () => {
    const onBookmarksChange = vi.fn();

    act(() => {
      root.render(<BookmarksInURL onBookmarksChange={onBookmarksChange} />);
    });

    const editor = container.querySelector("textarea");

    act(() => {
      setNativeValue(
        editor!,
        JSON.stringify({
        urls: [{ emoji: "🚀", label: "Test", url: "https://test.com" }],
        }),
      );
      editor!.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(container.textContent).toContain("Valid");
    expect(onBookmarksChange).toHaveBeenLastCalledWith([
      { emoji: "🚀", label: "Test", url: "https://test.com" },
    ]);
  });

  it("shows an error for invalid JSON input", () => {
    const onBookmarksChange = vi.fn();

    act(() => {
      root.render(<BookmarksInURL onBookmarksChange={onBookmarksChange} />);
    });

    const editor = container.querySelector("textarea");

    act(() => {
      setNativeValue(editor!, "{invalid");
      editor!.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(container.textContent).toContain("Invalid JSON");
  });
});
