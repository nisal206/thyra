/**
 * Shared parsing for the per-project editor override flags used by
 * `thyra config` and `thyra update`:
 *
 *   -e, --editor <editor>   set the project's editor override
 *   --editor ""             clear the override (empty value)
 *   --clear-editor          clear the override
 *
 * Returns the positional arguments with the flags removed so callers can keep
 * reading them by index, plus the requested editor change. `error` is set to a
 * human-readable message when the flags are malformed; callers report it the
 * same way as other CLI errors.
 */

export interface EditorFlagResult {
  /** Positional args with the editor flags (and their values) stripped out. */
  rest: string[];
  /** New editor value, when `-e`/`--editor <editor>` was given a real value. */
  editor?: string;
  /** True when the caller asked to clear the override. */
  clearEditor: boolean;
  /** Set when the flags are malformed; `editor`/`clearEditor` are unusable. */
  error?: string;
}

const EDITOR_FLAGS = new Set(["-e", "--editor"]);

export function extractEditorFlag(args: string[]): EditorFlagResult {
  const rest: string[] = [];
  let editor: string | undefined;
  let clearEditor = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--clear-editor") {
      clearEditor = true;
      continue;
    }

    if (EDITOR_FLAGS.has(arg)) {
      if (i + 1 >= args.length) {
        return { rest, clearEditor, error: `Missing <editor> value for "${arg}".` };
      }

      const value = args[++i];

      if (value === "") {
        clearEditor = true;
        editor = undefined;
        continue;
      }

      if (value.startsWith("-")) {
        return {
          rest,
          clearEditor,
          error: `Missing <editor> value for "${arg}".`,
        };
      }

      editor = value;
      continue;
    }

    rest.push(arg);
  }

  if (editor !== undefined && clearEditor) {
    return {
      rest,
      clearEditor,
      error: 'Cannot use "--editor <editor>" and "--clear-editor" together.',
    };
  }

  return { rest, editor, clearEditor };
}
