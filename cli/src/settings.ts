import chalk from "chalk";
import { playMode } from "@reactris/engine";
import { BoardSize, PersistedSettings } from "./store";

const HOME = "\x1b[H";
const CLEAR = "\x1b[2J";

export type SettingsValues = PersistedSettings & { boardSize: BoardSize };

type Field = {
  key: keyof SettingsValues;
  label: string;
  // Returns the value one step left (-1) or right (+1), clamped to the valid range
  step: (v: SettingsValues, dir: number) => SettingsValues[keyof SettingsValues];
  show: (v: SettingsValues) => string;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const FIELDS: Field[] = [
  {
    key: "gameType",
    label: "Game mode",
    step: (v, d) => (v.gameType + d + playMode.length) % playMode.length,
    show: (v) => playMode[v.gameType].name,
  },
  {
    key: "numColumns",
    label: "Columns",
    step: (v, d) => clamp(v.numColumns + d, 6, 30),
    show: (v) => String(v.numColumns),
  },
  {
    key: "numRows",
    label: "Rows",
    step: (v, d) => clamp(v.numRows + d, 6, 40),
    show: (v) => String(v.numRows),
  },
  {
    key: "initWallHeight",
    label: "Initial wall height",
    step: (v, d) => clamp(v.initWallHeight + d, 0, v.numRows - 4),
    show: (v) => String(v.initWallHeight),
  },
  {
    key: "initWallPropability",
    label: "Wall probability (0-1)",
    step: (v, d) => clamp(Math.round((v.initWallPropability + d * 0.1) * 10) / 10, 0, 1),
    show: (v) => v.initWallPropability.toFixed(1),
  },
  {
    key: "levelUpgradeDiv",
    label: "Level upgrade divider",
    step: (v, d) => clamp(v.levelUpgradeDiv + d, 1, 50),
    show: (v) => String(v.levelUpgradeDiv),
  },
  {
    key: "showNextPiece",
    label: "Show next piece",
    step: (v) => (v.showNextPiece ? 0 : 1),
    show: (v) => (v.showNextPiece ? "Yes" : "No"),
  },
  {
    key: "boardSize",
    label: "Board size",
    step: (v) => (v.boardSize === "large" ? "normal" : "large"),
    show: (v) => (v.boardSize === "large" ? "Large" : "Normal"),
  },
];

const KEY_BINDINGS: [string, string][] = [
  ["← / A", "Move left"],
  ["→ / D", "Move right"],
  ["↓ / S", "Soft drop"],
  ["↑ / Q", "Rotate left"],
  ["E", "Rotate right"],
  ["Esc", "Pause"],
  ["Z", "Board size"],
  ["O", "Settings"],
  ["R", "Restart"],
  ["Ctrl+C", "Quit"],
];

export type SettingsResult = "open" | "cancel" | "apply";

/// Settings screen, the console counterpart of the web Settings dialog.
/// Edits a copy of the values; the caller reads `values` after "apply".
export class SettingsScreen {
  values: SettingsValues;
  private initial: SettingsValues;
  private selected = 0;
  private askingToSave = false;

  constructor(initial: SettingsValues) {
    this.initial = { ...initial };
    this.values = { ...initial };
  }

  private isChanged(key: keyof SettingsValues): boolean {
    return this.values[key] !== this.initial[key];
  }

  handleKey(name: string | undefined): SettingsResult {
    // Closing with unsaved changes asks first, so they aren't lost by mistake
    if (this.askingToSave) {
      this.askingToSave = false;
      if (name === "y") return "apply";
      if (name === "n") return "cancel";
      return "open";
    }
    switch (name) {
      case "up":
        this.selected = (this.selected + FIELDS.length - 1) % FIELDS.length;
        break;
      case "down":
        this.selected = (this.selected + 1) % FIELDS.length;
        break;
      case "left":
      case "right": {
        const field = FIELDS[this.selected];
        const next = field.step(this.values, name === "right" ? 1 : -1);
        this.values = { ...this.values, [field.key]: next };
        // Keep the wall below the top when rows shrink
        this.values.initWallHeight = Math.min(this.values.initWallHeight, this.values.numRows - 4);
        break;
      }
      case "return":
      case "enter":
        return "apply";
      case "escape":
      case "o":
        if (FIELDS.some((f) => this.isChanged(f.key))) {
          this.askingToSave = true;
          break;
        }
        return "cancel";
    }
    return "open";
  }

  render(): void {
    const out: string[] = [];
    const labelWidth = Math.max(...FIELDS.map((f) => f.label.length)) + 2;
    out.push("");
    out.push("  " + chalk.bold.cyan("SETTINGS"));
    out.push("");
    FIELDS.forEach((f, i) => {
      const label = f.label.padEnd(labelWidth);
      const value = `‹ ${f.show(this.values)} ›` + (this.isChanged(f.key) ? " *" : "");
      out.push(
        i === this.selected
          ? chalk.yellow("› ") + chalk.bold(label) + chalk.inverse(` ${value} `)
          : "  " + label + ` ${value} `
      );
    });
    out.push("");
    out.push(
      this.askingToSave
        ? chalk.bold.yellow("  Save changes?  Y save  N discard  other key: keep editing")
        : chalk.gray("  ↑/↓ choose  ←/→ change  Enter save  Esc close")
    );
    out.push(chalk.gray("  Changing mode, columns, rows or wall starts a new game."));
    out.push("");
    out.push("  " + chalk.bold("Key bindings"));
    for (const [keys, label] of KEY_BINDINGS) {
      out.push("  " + chalk.hex("#ffd166")(keys.padEnd(8)) + label);
    }
    process.stdout.write(CLEAR + HOME + out.join("\n") + "\n");
  }
}
