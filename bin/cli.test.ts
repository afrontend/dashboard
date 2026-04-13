import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { ensureDefaultJson } from "./cli.js";

describe("ensureDefaultJson", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dash-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("json/dashboard.json이 없으면 기본 파일을 생성한다", () => {
    ensureDefaultJson(tmpDir);
    const filePath = path.join(tmpDir, "json", "dashboard.json");
    expect(fs.existsSync(filePath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    expect(data.urls).toHaveLength(2);
    expect(data.urls[0]).toHaveProperty("url");
  });

  it("json/dashboard.json이 이미 있으면 덮어쓰지 않는다", () => {
    const jsonDir = path.join(tmpDir, "json");
    fs.mkdirSync(jsonDir);
    const filePath = path.join(jsonDir, "dashboard.json");
    const existing = JSON.stringify({ urls: [{ label: "existing" }] });
    fs.writeFileSync(filePath, existing);

    ensureDefaultJson(tmpDir);

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    expect(data.urls[0].label).toBe("existing");
  });
});
