import { describe, it, expect, vi, afterEach } from "vitest";
import * as utils from "../utils";

describe("isJSON", () => {
  it("valid JSON object returns true", () => {
    expect(utils.isJSON('{"a":1}')).toBe(true);
  });
  it("valid JSON array returns true", () => {
    expect(utils.isJSON("[1,2]")).toBe(true);
  });
  it("invalid JSON returns false", () => {
    expect(utils.isJSON('{a:1}')).toBe(false);
  });
  it("empty string returns false", () => {
    expect(utils.isJSON("")).toBe(false);
  });
});

function stubLocationSearch(search: string) {
  vi.stubGlobal("window", { location: { search } });
}

describe("getJsonData", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns initialData when no param", () => {
    stubLocationSearch("");
    expect(utils.getJsonData()).toEqual([
      { emoji: "📁", label: "Bookmarks", url: "" },
      { emoji: "🔍", label: "Google", url: "https://google.com" },
      { emoji: "💻", label: "GitHub", url: "https://github.com" },
      { emoji: "📚", label: "Resources", url: "" },
      { emoji: "📖", label: "MDN Web Docs", url: "https://developer.mozilla.org" },
    ]);
  });

  it("returns initialData for invalid JSON string param", () => {
    stubLocationSearch("?data=invalid-json");
    expect(utils.getJsonData()[0].label).toBe("Bookmarks");
  });

  it("parses valid TBookmark array from query param", () => {
    const bookmarks = [{ emoji: "🍑", label: "Test", url: "https://test.com" }];
    stubLocationSearch(`?data=${encodeURIComponent(JSON.stringify(bookmarks))}`);
    expect(utils.getJsonData()).toEqual(bookmarks);
  });

  it("normalizes legacy tuple data from query param", () => {
    stubLocationSearch(
      `?data=${encodeURIComponent(JSON.stringify([["Docs", "https://example.com"]]))}`,
    );

    expect(utils.getJsonData()).toEqual([
      { emoji: "", label: "Docs", url: "https://example.com" },
    ]);
  });

  it("returns initialData for invalid-shape object param", () => {
    stubLocationSearch(`?data=${encodeURIComponent(JSON.stringify({ foo: "bar" }))}`);
    expect(utils.getJsonData()[0].label).toBe("Bookmarks");
  });

  it("returns initialData for primitive array param", () => {
    stubLocationSearch(`?data=${encodeURIComponent(JSON.stringify([1, 2, 3]))}`);
    expect(utils.getJsonData()[0].label).toBe("Bookmarks");
  });

  it("normalizes object data with urls property from query param", () => {
    stubLocationSearch(
      `?data=${encodeURIComponent(
        JSON.stringify({
          urls: [{ emoji: "🚀", label: "Test", url: "https://test.com" }],
        }),
      )}`,
    );

    expect(utils.getJsonData()).toEqual([
      { emoji: "🚀", label: "Test", url: "https://test.com" },
    ]);
  });
});

describe("parseBookmarkData", () => {
  it("normalizes object with urls property", () => {
    const input = {
      urls: [{ emoji: "🚀", label: "Test", url: "https://test.com" }],
    };
    expect(utils.parseBookmarkData(input)).toEqual([
      { emoji: "🚀", label: "Test", url: "https://test.com" },
    ]);
  });

  it("normalizes legacy tuple arrays", () => {
    expect(utils.parseBookmarkData([["Docs", "https://example.com"]])).toEqual([
      { emoji: "", label: "Docs", url: "https://example.com" },
    ]);
  });

  it("returns null for primitive arrays", () => {
    expect(utils.parseBookmarkData([1, 2, 3])).toBeNull();
  });

  it("returns null for plain objects", () => {
    expect(utils.parseBookmarkData({ foo: "bar" })).toBeNull();
  });
});
