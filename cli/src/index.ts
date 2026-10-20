#!/usr/bin/env node
import { playGroundModel } from "@reactris/engine";
import { render, hideCursor, showCursor, forceClear } from "./renderer";
import { SettingsScreen } from "./settings";
import { attachInput } from "./input";
import { startLoop, LoopHandle } from "./loop";
import {
  loadSettings,
  saveSettings,
  qualifiesForHighScore,
  saveHighScore,
  getHighScores,
  loadBoardSize,
  saveBoardSize,
} from "./store";

function main(): void {
  const settings = loadSettings();
  let size = loadBoardSize();

  const pg = new playGroundModel(settings);
  pg.reset();

  let loop: LoopHandle;
  let savedThisGame = false;
  let enteringName = false;
  let settingsScreen: SettingsScreen | null = null;
  let pausedBeforeSettings = false;
  let confirmingRestart = false;
  let pausedBeforeRestart = false;

  const draw = () =>
    render({
      pg,
      size,
      showNext: settings.showNextPiece !== 0,
      paused: loop ? loop.isPaused() : false,
      gameOver: pg.gameover,
      confirmRestart: confirmingRestart,
    });

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
    enteringName = true;
    let buf = "";
    const onData = (data: Buffer) => {
      const s = data.toString("utf8");
      for (const ch of s) {
        const code = ch.charCodeAt(0);
        if (code === 13 || code === 10) {
          process.stdin.off("data", onData);
          process.stdout.write("\n");
          enteringName = false;
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

  const startNewGame = () => {
    savedThisGame = false;
    pg.reset();
    loop.setPaused(false);
  };

  const openSettings = () => {
    pausedBeforeSettings = loop.isPaused();
    loop.setPaused(true);
    settingsScreen = new SettingsScreen({ ...settings, boardSize: size });
    settingsScreen.render();
  };

  const closeSettings = (apply: boolean) => {
    const next = settingsScreen!.values;
    settingsScreen = null;
    forceClear();
    let restart = false;
    if (apply) {
      const { boardSize, ...gameSettings } = next;
      // These change the board or the pieces, so they need a fresh game
      restart = (
        ["gameType", "numColumns", "numRows", "initWallHeight", "initWallPropability"] as const
      ).some((k) => gameSettings[k] !== settings[k]);
      Object.assign(settings, gameSettings);
      saveSettings(settings);
      size = boardSize;
      saveBoardSize(size);
      pg.configure(settings);
    }
    if (restart) {
      startNewGame();
    } else {
      loop.setPaused(pausedBeforeSettings);
    }
    draw();
    if (pg.gameover) printScoreboard();
  };

  const detach = attachInput((action, keyName) => {
    if (action === "quit") return shutdown(0);
    // Keys typed into the high-score name must not also play the game
    if (enteringName) return;
    if (settingsScreen) {
      const result = settingsScreen.handleKey(keyName);
      if (result === "open") settingsScreen.render();
      else closeSettings(result === "apply");
      return;
    }
    // Y restarts; any other key goes back to the game as it was
    if (confirmingRestart) {
      confirmingRestart = false;
      if (keyName === "y") startNewGame();
      else loop.setPaused(pausedBeforeRestart);
      draw();
      return;
    }
    if (action === "settings") return openSettings();
    // During a game R asks first, since it sits next to E (rotate right)
    if (action === "restart" && !pg.gameover) {
      pausedBeforeRestart = loop.isPaused();
      loop.setPaused(true);
      confirmingRestart = true;
      draw();
      return;
    }
    // Not after game over: Z would redraw over the scoreboard
    if (action === "toggleSize" && !pg.gameover) {
      size = size === "large" ? "normal" : "large";
      saveBoardSize(size);
      draw();
      return;
    }
    if (pg.gameover) {
      if (action === "restart") {
        startNewGame();
        draw();
      }
      return;
    }
    switch (action) {
      case "left":
        pg.tryMove(-1);
        break;
      case "right":
        pg.tryMove(1);
        break;
      case "rotateLeft":
        pg.tryRotate("left");
        break;
      case "rotateRight":
        pg.tryRotate("right");
        break;
      case "softDrop":
        pg.softDrop();
        break;
      case "pause":
        loop.setPaused(!loop.isPaused());
        break;
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
