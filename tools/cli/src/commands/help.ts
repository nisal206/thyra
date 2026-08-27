import color from "picocolors";

import { colorize, printCommandTable } from "~/core";

export function runHelp(exitCode: number) {
  console.log(
    `\n${color.bold(color.cyan("thyra"))} ${color.dim(
      "- Quick shortcut manager for project folders",
    )}\n`,
  );

  const rows = [
    {
      Command: colorize("thyra config <name> <folder_path> [-e | --editor <editor>]"),
      Description: "Save a folder path (optionally pin a per-project editor)",
    },
    {
      Command: colorize("thyra import <directory>"),
      Description: "Scan and register projects from a directory",
    },
    {
      Command: colorize("thyra open <name> [-e | --editor <editor>]"),
      Description: "Open folder in your editor (flag > project editor > $EDITOR)",
    },
    {
      Command: colorize("thyra cd <name>"),
      Description: "Open a new Terminal window at the saved folder",
    },
    {
      Command: colorize(
        "thyra update <name> [folder_path] [--editor <editor> | --clear-editor]",
      ),
      Description: "Update an existing saved path or its per-project editor",
    },
    {
      Command: colorize("thyra remove <name> | --all | --force"),
      Description:
        "Remove a saved path or all paths (--force to skip confirmation)",
    },
    { Command: colorize("thyra list"), Description: "Show all saved paths" },
    { Command: colorize("thyra --version"), Description: "Show CLI version" },
    { Command: colorize("thyra --help"), Description: "Show this help" },
  ];

  printCommandTable(rows);

  console.log(
    `\n${color.bold(color.underline("Examples:"))}
  ${colorize("thyra config <name> <folder_path>")}   ${color.dim(
    "# Save a path",
  )}
  ${colorize("thyra import ./projects")}             ${color.dim(
    "# Import multiple projects",
  )}
  ${colorize("thyra open <name>")}                   ${color.dim(
    "# Open in editor",
  )}
  ${colorize("thyra open <name> -e <editor>")}       ${color.dim(
    "# Open in <editor> (overrides project + global)",
  )}
  ${colorize("thyra config <name> <folder_path> -e <editor>")} ${color.dim(
    "# Save a path and pin its editor",
  )}
  ${colorize("thyra update <name> --editor <editor>")} ${color.dim(
    "# Change a project's editor",
  )}
  ${colorize("thyra update <name> --clear-editor")}  ${color.dim(
    "# Fall back to the global editor again",
  )}
  ${colorize("thyra cd <name>")}                     ${color.dim(
    "# Open a new Terminal window at the saved folder",
  )}
  ${colorize("thyra update <name> <folder_path>")} ${color.dim(
    "# Update an existing saved path",
  )}
  ${colorize("thyra remove <name>")}                ${color.dim(
    "# Remove a saved path",
  )}
  ${colorize("thyra remove --all")}                 ${color.dim(
    "# Remove all saved paths",
  )}
  ${colorize("thyra --version")}

${color.bold(color.underline("Editor resolution (highest priority first):"))}
  ${color.dim("1.")} ${colorize("-e | --editor <editor>")} ${color.dim("flag on 'thyra open'")}
  ${color.dim("2.")} ${color.cyan("per-project editor")} ${color.dim("saved via 'thyra config' / 'thyra update'")}
  ${color.dim("3.")} ${color.cyan("EDITOR")} ${color.dim("environment variable")}
  ${color.dim('   falls back to "code" when none are set')}

${color.bold(color.underline("Environment:"))}
  ${color.cyan("EDITOR")}  ${color.dim('Global editor command (default: "code")')}
`,
  );

  if (typeof exitCode === "number") process.exit(exitCode);
}
