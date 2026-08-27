import { describe, expect, it } from "bun:test";

import { DEFAULT_EDITOR, resolveEditor } from "./editor";

describe("resolveEditor", () => {
  it("uses the flag when it is set, regardless of project or global", () => {
    expect(
      resolveEditor({ flag: "code", project: "vim", global: "webstorm" }),
    ).toBe("code");
  });

  it("uses the project editor when no flag is set, over the global", () => {
    expect(
      resolveEditor({ flag: undefined, project: "vim", global: "webstorm" }),
    ).toBe("vim");
  });

  it("falls back to the global editor when no flag or project editor is set", () => {
    expect(
      resolveEditor({ flag: undefined, project: undefined, global: "webstorm" }),
    ).toBe("webstorm");
  });

  it("falls back to the default editor when nothing is set anywhere", () => {
    expect(resolveEditor({})).toBe(DEFAULT_EDITOR);
    expect(DEFAULT_EDITOR).toBe("code");
  });

  it("treats blank / whitespace-only values as not set and falls through", () => {
    expect(resolveEditor({ flag: "   ", project: "vim" })).toBe("vim");
    expect(resolveEditor({ flag: "", project: "", global: "webstorm" })).toBe(
      "webstorm",
    );
    expect(resolveEditor({ flag: " ", project: " ", global: " " })).toBe(
      DEFAULT_EDITOR,
    );
  });

  it("trims surrounding whitespace from the resolved value", () => {
    expect(resolveEditor({ flag: "  code  " })).toBe("code");
  });
});
