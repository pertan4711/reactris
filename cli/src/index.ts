#!/usr/bin/env node
import { playGroundModel } from "@reactris/engine";
import { render, hideCursor, showCursor } from "./renderer";
import { attachInput } from "./input";
import { startLoop, LoopHandle } from "./loop";
import {
  loadSettings,
  saveSettings,
  qualifiesForHighScore,
  saveHighScore,
  getHighScores,
} from "./store";

function main(): void {
  const settings = loadSettings();

  const pg = playGroundModel.getInstance(
    settings.numColumns,
    settings.numRows,
    settings.gameType,
    settings.initWallHeight,
    settings.initWallPropability,
    settings.levelUpgradeDiv
  );
  pg.reset();

  let loop: LoopHandle;
  let savedThisGame = false;

  const draw = () =>
    render({ pg, paused: loop ? loop.isPaused() : false, gameOver: pg.gameover });

  const printScoreboard = (): void => {
    const scores = getHighScores(settings.gameType);
    process.stdout.write("\n  High scores:\n");
    if (scores.length === 0) {
      process.stdout.write("  (none yet)\n");
    } else {
      scores.slice(0, 5).forEach((s, i) => {
        process.stdout.write(
          `  ${i + 1}. ${s.name.padEnd(12)} ${String(s.score).padStart(6)}  lvl ${s.level}\n`
        );
      });
    }
    process.stdout.write("\n  Press R to play again, Ctrl+C to quit.\n");
  };

  const promptHighScoreName = (cb: (name: string) => void): void => {
    process.stdout.write("\n  New high score! Name: ");
    let buf = "";
    const onData = (data: Buffer) => {
      const s = data.toString("utf8");
      for (const ch of s) {
        const code = ch.charCodeAt(0);
        if (code === 13 || code === 10) {
          process.stdin.off("data", onData);
          process.stdout.write("\n");
          cb(buf.trim());
          return;
        }
        if (code === 3) {
          process.stdin.off("data", onData);
          shutdown(0);
          return;
        }
        if (code === 127 || code === 8) {
          if (buf.length > 0) {
            buf = buf.slice(0, -1);
            process.stdout.write("\b \b");
          }
          continue;
        }
        if (code >= 32 && buf.length < 20) {
          buf += ch;
          process.stdout.write(ch);
        }
      }
    };
    process.stdin.on("data", onData);
  };

  const handleGameOver = () => {
    if (!pg.gameover || savedThisGame) return;
    savedThisGame = true;
    draw();
    if (qualifiesForHighScore(pg.score, settings.gameType)) {
      promptHighScoreName((name) => {
        saveHighScore(
          {
            name: name || "Player",
            score: pg.score,
            level: pg.level,
            numColumns: settings.numColumns,
            numRows: settings.numRows,
            date: new Date().toISOString(),
          },
          settings.gameType
        );
        printScoreboard();
      });
    } else {
      printScoreboard();
    }
  };

  hideCursor();
  loop = startLoop(pg, () => {
    draw();
    handleGameOver();
  });
  draw();

  const detach = attachInput((action) => {
    if (pg.gameover) {
      if (action === "restart") {
        savedThisGame = false;
        pg.reset();
        loop.setPaused(false);
        draw();
      } else if (action === "quit") {
        shutdown(0);
      }
      return;
    }
    switch (action) {
      case "left":
        pg.activeBlock.moveLeft();
        if (pg.checkBlockPosition()) pg.activeBlock.moveRight();
        break;
      case "right":
        pg.activeBlock.moveRight();
        if (pg.checkBlockPosition()) pg.activeBlock.moveLeft();
        break;
      case "rotateLeft":
        pg.activeBlock.turnLeft();
        if (pg.checkBlockPosition()) pg.activeBlock.turnRight();
        break;
      case "rotateRight":
        pg.activeBlock.turnRight();
        if (pg.checkBlockPosition()) pg.activeBlock.turnLeft();
        break;
      case "softDrop":
        pg.incTime();
        pg.updateGame();
        break;
      case "pause":
        loop.setPaused(!loop.isPaused());
        break;
      case "quit":
        shutdown(0);
        return;
    }
    draw();
    handleGameOver();
  });

  function shutdown(code: number): void {
    loop.stop();
    detach();
    showCursor();
    saveSettings(settings);
    process.exit(code);
  }

  process.on("SIGINT", () => shutdown(0));
  process.on("SIGTERM", () => shutdown(0));
}

main();
