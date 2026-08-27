import { ConfigStore } from "~/core";
import {
  resolveFolderPath,
  ensureDirectoryExists,
  extractEditorFlag,
} from "~/utils";

const USAGE =
  "Usage: thyra update <name> [folder_path] [-e | --editor <editor> | --clear-editor]";

export function runUpdate(store: ConfigStore, args: string[]): void {
  const { rest, editor, clearEditor, error } = extractEditorFlag(args);

  if (error) {
    console.error(error);
    console.log(USAGE);
    process.exit(1);
  }

  const name = rest[0];
  const folderArg = rest[1];
  const changesEditor = clearEditor || editor !== undefined;

  if (!name || (!folderArg && !changesEditor)) {
    console.error("Missing arguments for 'update' command.");
    console.log(USAGE);
    process.exit(1);
  }

  if (!store.has(name)) {
    console.error(
      `No folder found for alias "${name}". Use 'thyra list' to see saved entries.`
    );
    process.exit(1);
  }

  const entry = store.get(name)!;

  if (folderArg) {
    const folderPath = resolveFolderPath(folderArg);
    ensureDirectoryExists(folderPath);
    entry.path = folderPath;
    console.log(`Updated mapping: "${name}" -> ${folderPath}`);
  }

  if (clearEditor) {
    delete entry.editor;
    console.log(`Cleared editor override for "${name}".`);
  } else if (editor !== undefined) {
    entry.editor = editor;
    console.log(`Editor for "${name}" set to "${editor}".`);
  }

  store.set(name, entry);
}
