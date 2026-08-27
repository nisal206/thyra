import { describe, expect, it } from "bun:test";

import { extractEditorFlag } from "./args";

describe("extractEditorFlag", () => {
  it("returns positional args untouched when no editor flag is present", () => {
    const result = extractEditorFlag(["blog", "~/projects/blog"]);
    expect(result.rest).toEqual(["blog", "~/projects/blog"]);
    expect(result.editor).toBeUndefined();
    expect(result.clearEditor).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it("parses --editor and strips it from the positionals", () => {
    const result = extractEditorFlag(["blog", "~/blog", "--editor", "vim"]);
    expect(result.rest).toEqual(["blog", "~/blog"]);
    expect(result.editor).toBe("vim");
    expect(result.clearEditor).toBe(false);
  });

  it("supports the -e short flag anywhere in the args", () => {
    const result = extractEditorFlag(["-e", "code", "blog", "~/blog"]);
    expect(result.rest).toEqual(["blog", "~/blog"]);
    expect(result.editor).toBe("code");
  });

  it("treats an empty --editor value as a clear request", () => {
    const result = extractEditorFlag(["blog", "~/blog", "--editor", ""]);
    expect(result.editor).toBeUndefined();
    expect(result.clearEditor).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("treats --clear-editor as a clear request", () => {
    const result = extractEditorFlag(["blog", "--clear-editor"]);
    expect(result.rest).toEqual(["blog"]);
    expect(result.clearEditor).toBe(true);
    expect(result.editor).toBeUndefined();
  });

  it("errors when --editor has no value", () => {
    const result = extractEditorFlag(["blog", "~/blog", "--editor"]);
    expect(result.error).toBeTruthy();
  });

  it("errors when --editor is followed by another flag", () => {
    const result = extractEditorFlag(["blog", "--editor", "--clear-editor"]);
    expect(result.error).toBeTruthy();
  });

  it("errors when both --editor <value> and --clear-editor are given", () => {
    const result = extractEditorFlag(["blog", "--editor", "vim", "--clear-editor"]);
    expect(result.error).toBeTruthy();
  });
});
