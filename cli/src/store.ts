import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { gameSettingsType, gameTypeEnum } from "@reactris/engine";

const STATE_DIR = path.join(os.homedir(), ".reactris-console");
const STATE_FILE = path.join(STATE_DIR, "state.json");

export type PersistedSettings = Pick<
  gameSettingsType,
  | "numColumns"
  | "numRows"
  | "gameType"
  | "initWallHeight"
  | "levelUpgradeDiv"
  | "initWallPropability"
  | "showNextPiece"
>;

export type HighScoreEntry = {
  name: string;
  score: number;
  level: number;
  numColumns: number;
  numRows: number;
  date: string;
};

export type BoardSize = "normal" | "large";

type State = {
  settings: PersistedSettings;
  boardSize: BoardSize;
  highScores: Record<number, HighScoreEntry[]>;
};

const DEFAULT_STATE: State = {
  settings: {
    numColumns: 10,
    numRows: 20,
    gameType: gameTypeEnum.Classic,
    initWallHeight: 0,
    levelUpgradeDiv: 2,
    initWallPropability: 0.5,
    showNextPiece: 1,
  },
  boardSize: "large",
  highScores: {},
};

const MAX_PER_TYPE = 10;

function readState(): State {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) },
      boardSize: parsed.boardSize === "normal" ? "normal" : "large",
      highScores: parsed.highScores ?? {},
    };
  } catch {
    return { ...DEFAULT_STATE, highScores: {} };
  }
}

function writeState(state: State): void {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
  } catch {
    /* ignore */
  }
}

export function loadSettings(): PersistedSettings {
  return readState().settings;
}

export function saveSettings(settings: PersistedSettings): void {
  const state = readState();
  state.settings = settings;
  writeState(state);
}

export function loadBoardSize(): BoardSize {
  return readState().boardSize;
}

export function saveBoardSize(size: BoardSize): void {
  const state = readState();
  state.boardSize = size;
  writeState(state);
}

export function getHighScores(gameType: number): HighScoreEntry[] {
  return readState().highScores[gameType] ?? [];
}

export function qualifiesForHighScore(score: number, gameType: number): boolean {
  if (score <= 0) return false;
  const list = getHighScores(gameType);
  if (list.length < MAX_PER_TYPE) return true;
  return score > list[list.length - 1].score;
}

export function saveHighScore(entry: HighScoreEntry, gameType: number): void {
  const state = readState();
  const list = state.highScores[gameType] ?? [];
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  state.highScores[gameType] = list.slice(0, MAX_PER_TYPE);
  writeState(state);
}
