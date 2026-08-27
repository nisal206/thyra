export interface ProjectEntry {
  id: string;
  name: string;
  alias: string;
  path: string;
  createdAt: string;
  /**
   * Optional per-project editor override. When set, it takes precedence over the
   * global editor but is still overridden by the `-e`/`--editor` flag on
   * `thyra open`. Absent on entries saved before this field existed.
   */
  editor?: string;
}
