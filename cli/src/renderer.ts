import chalk from "chalk";
import { playGroundModel, blocks, emptyWallBrick } from "@reactris/engine";
import { BoardSize } from "./store";

// Each cell is drawn 2 chars wide by 1 line tall at scale 1
const BRICK = "██";
const EMPTY = "  ";
const SIDE_WIDTH = 25;
const HOME = "\x1b[H";
const HIDE_CURSOR = "\x1b[?25l";
const SHOW_CURSOR = "\x1b[?25h";
const CLEAR = "\x1b[2J";

export function hideCursor(): void {
  process.stdout.write(HIDE_CURSOR + CLEAR);
}

export function showCursor(): void {
  process.stdout.write(SHOW_CURSOR + "\n");
}

let lastScale = 0;

/// Make the next render clear the screen, e.g. after another screen was shown
export function forceClear(): void {
  lastScale = 0;
}

function brick(colorIndex: number, scale: number): string {
  return chalk.hex(blocks[colorIndex].color)(BRICK.repeat(scale));
}

function cell(v: number, scale: number): string {
  return v === emptyWallBrick ? EMPTY.repeat(scale) : brick(v, scale);
}

// Large doubles the board when the terminal has room for it, otherwise it falls back to normal
function fitScale(size: BoardSize, numRows: number, numCols: number): number {
  if (size === "normal") return 1;
  const cols = process.stdout.columns ?? 80;
  const rows = process.stdout.rows ?? 24;
  const fits = numCols * 4 + 2 + SIDE_WIDTH <= cols && numRows * 2 + 2 <= rows;
  return fits ? 2 : 1;
}

type Frame = {
  pg: playGroundModel;
  size: BoardSize;
  showNext: boolean;
  paused: boolean;
  gameOver: boolean;
  confirmRestart: boolean;
};

export function render(frame: Frame): void {
  const { pg, size, showNext, paused, gameOver, confirmRestart } = frame;
  const wall = pg.getWall();
  const numRows = pg.numRows;
  const numCols = pg.numColumns;
  const scale = fitScale(size, numRows, numCols);
  // Wipe leftovers from the previous size when the scale changes
  const clear = scale !== lastScale ? CLEAR : "";
  lastScale = scale;

  // Build a working board with the active block overlaid
  const board: number[][] = wall.map((row) => row.slice());
  if (!gameOver) {
    const bricks = pg.activeBlock.getBrickPosition();
    const idx = pg.activeBlock.blockIndex;
    for (const b of bricks) {
      if (b.pY >= 0 && b.pY < numRows && b.pX >= 0 && b.pX < numCols) {
        board[b.pY][b.pX] = idx;
      }
    }
  }

  // Next-block preview rendered into a small 4x4 grid
  const preview: string[] = [];
  const nextBricks = pg.nextActive.getBrickPosition();
  const previewIdx = pg.nextActive.blockIndex;
  const minX = Math.min(...nextBricks.map((b) => b.pX));
  const minY = Math.min(...nextBricks.map((b) => b.pY));
  const previewGrid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(emptyWallBrick));
  for (const b of nextBricks) {
    const x = b.pX - minX;
    const y = b.pY - minY;
    if (y >= 0 && y < 4 && x >= 0 && x < 4) previewGrid[y][x] = previewIdx;
  }
  for (let y = 0; y < 4; y++) {
    let line = "";
    for (let x = 0; x < 4; x++) {
      line += cell(previewGrid[y][x], scale);
    }
    for (let s = 0; s < scale; s++) preview.push(line);
  }

  // Compose output line-by-line so the side panel sits next to the board
  const out: string[] = [];
  const border = chalk.gray("│");
  const topBorder = chalk.gray("┌" + "─".repeat(numCols * 2 * scale) + "┐");
  const bottomBorder = chalk.gray("└" + "─".repeat(numCols * 2 * scale) + "┘");

  const innerWidth = numCols * 2 * scale;
  const boardLines: string[] = [];
  const sideLines: string[] = [];
  for (let y = 0; y < numRows; y++) {
    let line = "";
    for (let x = 0; x < numCols; x++) {
      line += cell(board[y][x], scale);
    }
    for (let s = 0; s < scale; s++) {
      boardLines.push(line);
      sideLines.push(sideText(y, s));
    }
  }

  // Banner across the middle of the board so pause and game over can't be mistaken for a freeze
  const banner = confirmRestart
    ? { style: chalk.bgCyan.black.bold, text: ["", "RESTART?", "Y yes  N no", ""] }
    : paused
    ? { style: chalk.bgYellow.black.bold, text: ["", "PAUSED", "Esc to resume", ""] }
    : gameOver
    ? { style: chalk.bgRed.white.bold, text: ["", "GAME OVER", "R to play again", ""] }
    : null;
  if (banner) {
    const top = Math.floor((boardLines.length - banner.text.length) / 2);
    banner.text.forEach((full, i) => {
      // Cut the text on very narrow boards so the padding never goes negative
      const t = full.slice(0, innerWidth);
      const left = Math.floor((innerWidth - t.length) / 2);
      boardLines[top + i] = banner.style(" ".repeat(left) + t + " ".repeat(innerWidth - left - t.length));
    });
  }

  out.push(topBorder + "   " + chalk.bold.cyan("CONSOLTRIS"));
  boardLines.forEach((line, i) => out.push(border + line + border + sideLines[i]));
  out.push(bottomBorder);

  process.stdout.write(clear + HOME + out.join("\n") + "\n");

  // Side panel text for sub-line s of board row y; labels go on the first sub-line
  function sideText(y: number, s: number): string {
    if (showNext && y >= 5 && y <= 8) return "     " + preview[(y - 5) * scale + s];
    if (s > 0) return "";
    let side = "";
    if (y === 1) side = `   Score: ${chalk.yellow(pg.score)}`;
    else if (y === 2) side = `   Level: ${chalk.green(pg.level)}`;
    else if (showNext && y === 4) side = "   Next:";
    else if (y === 10) side = chalk.gray("   ←/→ move  ↓ drop");
    else if (y === 11) side = chalk.gray("   ↑ rotate  Esc pause");
    else if (y === 12) side = chalk.gray("   Z size  O settings");
    else if (y === 13) side = chalk.gray("   R restart  Ctrl+C quit");
    return side;
  }
}
