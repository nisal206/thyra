import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn,
  type Mock,
} from "bun:test";

import { ConfigStore } from "~/core";

import { runConfig } from "./config";
import { runUpdate } from "./update";

let tmpDir: string;
let projectDir: string;
let store: ConfigStore;
let logSpy: Mock<typeof console.log>;
let errorSpy: Mock<typeof console.error>;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "thyra-cmd-"));
  projectDir = path.join(tmpDir, "blog");
  fs.mkdirSync(projectDir);
  store = new ConfigStore([
    path.join(tmpDir, "thyra.json"),
    path.join(tmpDir, "thyra.version.json"),
  ]);
  logSpy = spyOn(console, "log").mockImplementation(() => {});
  errorSpy = spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
  errorSpy.mockRestore();
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("thyra config --editor", () => {
  it("saves a project with a per-project editor", () => {
    runConfig(store, ["blog", projectDir, "--editor", "vim"]);
    expect(store.get("blog")?.editor).toBe("vim");
  });

  it("saves a project without an editor when the flag is omitted", () => {
    runConfig(store, ["blog", projectDir]);
    const entry = store.get("blog");
    expect(entry?.path).toBe(projectDir);
    expect(entry?.editor).toBeUndefined();
  });

  it("accepts the -e short flag before the positionals", () => {
    runConfig(store, ["-e", "code", "blog", projectDir]);
    expect(store.get("blog")?.editor).toBe("code");
  });
});

describe("thyra update editor override", () => {
  beforeEach(() => {
    runConfig(store, ["blog", projectDir, "--editor", "vim"]);
    logSpy.mockClear();
  });

  it("changes the editor without requiring a folder path", () => {
    runUpdate(store, ["blog", "--editor", "webstorm"]);
    expect(store.get("blog")?.editor).toBe("webstorm");
    expect(store.get("blog")?.path).toBe(projectDir);
  });

  it("clears the editor with --clear-editor", () => {
    runUpdate(store, ["blog", "--clear-editor"]);
    expect(store.get("blog")?.editor).toBeUndefined();
  });

  it("clears the editor with an empty --editor value", () => {
    runUpdate(store, ["blog", "--editor", ""]);
    expect(store.get("blog")?.editor).toBeUndefined();
  });

  it("preserves the editor when only the path is updated", () => {
    const moved = path.join(tmpDir, "blog-2");
    fs.mkdirSync(moved);
    runUpdate(store, ["blog", moved]);
    expect(store.get("blog")?.path).toBe(moved);
    expect(store.get("blog")?.editor).toBe("vim");
  });
});
