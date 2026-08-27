import crypto from "node:crypto";
import path from "node:path";

import { resolveFolderPath, ensureDirectoryExists, extractEditorFlag } from "~/utils";
import  { ConfigStore } from "~/core";

export function runConfig(store: ConfigStore, args: string[]): void {
  const { rest, editor, error } = extractEditorFlag(args);

  if (error) {
    console.error(error);
    console.log("Usage: thyra config <name> <folder_path> [-e | --editor <editor>]");
    process.exit(1);
  }

  const name = rest[0];
  const folderArg = rest[1];

  if (!name || !folderArg) {
    console.error("Missing arguments for 'config' command.");
    console.log("Usage: thyra config <name> <folder_path> [-e | --editor <editor>]");
    process.exit(1);
  }

  const folderPath = resolveFolderPath(folderArg);
  ensureDirectoryExists(folderPath);

  const folderName = path.basename(folderPath);

  store.set(name, {
    id: crypto.randomUUID(),
    name: folderName || name,
    alias: name,
    path: folderPath,
    createdAt: new Date().toISOString(),
    ...(editor ? { editor } : {}),
  });
  console.log(`Saved mapping: "${name}" -> ${folderPath}`);
  if (editor) {
    console.log(`Editor for "${name}" set to "${editor}".`);
  }
}
