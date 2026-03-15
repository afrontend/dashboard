import { describe, it, expect, vi, afterEach } from "vitest";
import { isJSON, getJsonData } from "../utils";

describe("isJSON", () => {
  it("유효한 JSON 객체를 true로 반환한다", () => {
    expect(isJSON('{"a":1}')).toBe(true);
  });

  it("유효한 JSON 배열을 true로 반환한다", () => {
    expect(isJSON("[1,2]")).toBe(true);
  });

  it("잘못된 JSON을 false로 반환한다", () => {
    expect(isJSON("{a:1}")).toBe(false);
  });

  it("빈 문자열을 false로 반환한다", () => {
    expect(isJSON("")).toBe(false);
  });
});

function stubLocationSearch(search: string) {
  vi.stubGlobal("window", { location: { search } });
}

describe("getJsonData", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("URL 파라미터가 없으면 initialData를 반환한다", () => {
    stubLocationSearch("");
    const result = getJsonData();
    expect(result).toEqual([
      { emoji: "📁", label: "Bookmarks", url: "" },
      { emoji: "🔍", label: "Google", url: "https://google.com" },
      { emoji: "💻", label: "GitHub", url: "https://github.com" },
      { emoji: "📚", label: "Resources", url: "" },
      { emoji: "📖", label: "MDN Web Docs", url: "https://developer.mozilla.org" },
    ]);
  });

  it("유효한 TBookmark[] 데이터를 파싱한다", () => {
    const bookmarks = [{ emoji: "🍑", label: "Test", url: "https://test.com" }];
    const encoded = encodeURIComponent(JSON.stringify(bookmarks));
    stubLocationSearch(`?data=${encoded}`);
    const result = getJsonData();
    expect(result).toEqual(bookmarks);
  });

  it("레거시 튜플 형식을 TBookmark[]로 변환한다", () => {
    const legacy = [["Google", "https://google.com"], ["GitHub", "https://github.com"]];
    const encoded = encodeURIComponent(JSON.stringify(legacy));
    stubLocationSearch(`?data=${encoded}`);
    const result = getJsonData();
    expect(result).toEqual([
      { emoji: "", label: "Google", url: "https://google.com" },
      { emoji: "", label: "GitHub", url: "https://github.com" },
    ]);
  });

  it("잘못된 JSON 데이터면 initialData를 반환한다", () => {
    stubLocationSearch("?data=invalid-json");
    const result = getJsonData();
    expect(result[0].label).toBe("Bookmarks");
  });

  it("인코딩된 한글/이모지 데이터를 정상 파싱한다", () => {
    const bookmarks = [{ emoji: "🌸", label: "네이버", url: "https://naver.com" }];
    const encoded = encodeURIComponent(JSON.stringify(bookmarks));
    stubLocationSearch(`?data=${encoded}`);
    const result = getJsonData();
    expect(result).toEqual(bookmarks);
  });
});
