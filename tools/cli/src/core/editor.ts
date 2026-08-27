/**
 * Editor resolution for `thyra open`.
 *
 * Three tiers, highest priority first:
 *   1. `flag`    - the `-e`/`--editor` value passed on the command line
 *   2. `project` - the per-project `editor` saved in the config entry
 *   3. `global`  - the global default (the `EDITOR` env var)
 *
 * When none of the tiers provide a usable value, {@link DEFAULT_EDITOR} is used.
 */

/** Editor used when nothing else is configured. */
export const DEFAULT_EDITOR = "code";

export interface EditorSources {
  /** `-e`/`--editor` flag value from `thyra open`. */
  flag?: string;
  /** Per-project `editor` from the saved {@link ProjectEntry}. */
  project?: string;
  /** Global default, typically `process.env.EDITOR`. */
  global?: string;
}

/** A value counts as "set" only if it is a non-empty, non-whitespace string. */
function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Resolve which editor command `thyra open` should launch, applying the
 * flag > project > global priority. Blank or whitespace-only values are treated
 * as "not set" so resolution falls through to the next tier. Always returns a
 * usable command, falling back to {@link DEFAULT_EDITOR}.
 */
export function resolveEditor(sources: EditorSources): string {
  return (
    normalize(sources.flag) ??
    normalize(sources.project) ??
    normalize(sources.global) ??
    DEFAULT_EDITOR
  );
}
