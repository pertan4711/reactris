import chalk from "chalk";
import { playGroundModel, blocks, emptyWallBrick } from "@reactris/engine";

const BRICK = "██";
const EMPTY = "  ";
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

function brick(colorIndex: number): string {
  return chalk.hex(blocks[colorIndex].color)(BRICK);
}

type Frame = {
  pg: playGroundModel;
  paused: boolean;
  gameOver: boolean;
};

export function render(frame: Frame): void {
  const { pg, paused, gameOver } = frame;
  const wall = pg.getWall();
  const numRows = pg.numRows;
  const numCols = pg.numColumns;

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
      line += previewGrid[y][x] === emptyWallBrick ? EMPTY : brick(previewGrid[y][x]);
    }
    preview.push(line);
  }

  // Compose output line-by-line so the side panel sits next to the board
  const out: string[] = [];
  const border = chalk.gray("│");
  const topBorder = chalk.gray("┌" + "─".repeat(numCols * 2) + "┐");
  const bottomBorder = chalk.gray("└" + "─".repeat(numCols * 2) + "┘");

  out.push(topBorder + "   " + chalk.bold.cyan("CONSOLTRIS"));
  for (let y = 0; y < numRows; y++) {
    let line = border;
    for (let x = 0; x < numCols; x++) {
      const v = board[y][x];
      line += v === emptyWallBrick ? EMPTY : brick(v);
    }
    line += border;

    let side = "";
    if (y === 1) side = `   Score: ${chalk.yellow(pg.score)}`;
    else if (y === 2) side = `   Level: ${chalk.green(pg.level)}`;
    else if (y === 4) side = "   Next:";
    else if (y >= 5 && y <= 8) side = "     " + preview[y - 5];
    else if (y === 10) side = chalk.gray("   ←/→ move  ↓ drop");
    else if (y === 11) side = chalk.gray("   ↑ rotate  Esc pause");
    else if (y === 12) side = chalk.gray("   Ctrl+C quit");
    else if (paused && y === Math.floor(numRows / 2)) side = "   " + chalk.bold.yellow("PAUSED");
    else if (gameOver && y === Math.floor(numRows / 2)) side = "   " + chalk.bold.red("GAME OVER");
    out.push(line + side);
  }
  out.push(bottomBorder);

  process.stdout.write(HOME + out.join("\n") + "\n");
}
