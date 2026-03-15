import { describe, it, expect } from "vitest";
import { isJSON } from "../utils";

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
