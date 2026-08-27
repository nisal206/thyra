import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "bun:test";

import type { ProjectEntry } from "~/types";

import { ConfigStore } from "./config-store";

let tmpDir: string;
let configPath: string;
let versionPath: string;

function makeEntry(overrides: Partial<ProjectEntry> = {}): ProjectEntry {
  return {
    id: "id-1",
    name: "blog",
    alias: "blog",
    path: "/tmp/blog",
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function newStore(): ConfigStore {
  return new ConfigStore([configPath, versionPath]);
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "thyra-config-"));
  configPath = path.join(tmpDir, "thyra.json");
  versionPath = path.join(tmpDir, "thyra.version.json");
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("ConfigStore per-project editor", () => {
  it("persists the editor field and reads it back", () => {
    const store = newStore();
    store.set("blog", makeEntry({ editor: "vim" }));

    const onDisk = JSON.parse(fs.readFileSync(configPath, "utf8"));
    expect(onDisk.blog.editor).toBe("vim");

    expect(newStore().get("blog")?.editor).toBe("vim");
  });

  it("round-trips entries without an editor field (editor stays undefined)", () => {
    const store = newStore();
    store.set("blog", makeEntry());

    const reloaded = newStore().get("blog");
    expect(reloaded).toBeDefined();
    expect(reloaded?.editor).toBeUndefined();
  });

  it("loads a pre-existing config file that has no editor field on entries", () => {
    const legacy = {
      blog: {
        id: "id-legacy",
        name: "blog",
        alias: "blog",
        path: "/tmp/blog",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    };
    fs.writeFileSync(configPath, JSON.stringify(legacy, null, 2), "utf8");

    const entry = newStore().get("blog");
    expect(entry?.path).toBe("/tmp/blog");
    expect(entry?.editor).toBeUndefined();
  });

  it("still migrates the legacy string-based config format", () => {
    fs.writeFileSync(
      configPath,
      JSON.stringify({ blog: "/tmp/blog" }, null, 2),
      "utf8",
    );

    const entry = newStore().get("blog");
    expect(entry?.path).toBe("/tmp/blog");
    expect(entry?.alias).toBe("blog");
    expect(entry?.editor).toBeUndefined();
  });

  it("clears the editor field when a rewritten entry omits it", () => {
    const store = newStore();
    store.set("blog", makeEntry({ editor: "vim" }));

    const entry = store.get("blog")!;
    delete entry.editor;
    store.set("blog", entry);

    const onDisk = JSON.parse(fs.readFileSync(configPath, "utf8"));
    expect("editor" in onDisk.blog).toBe(false);
    expect(newStore().get("blog")?.editor).toBeUndefined();
  });
});
