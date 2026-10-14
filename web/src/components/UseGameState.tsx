import { useState, useEffect, useCallback } from "react";
import {
  gameStatusEnum,
  playGroundModel,
  gameSettingsType,
  intervalForLevel,
} from "@reactris/engine";
import { saveSettings } from "../utils/settings";

//
// Handle state and user hooks
//
function UseGameState(
  pg: playGroundModel,
  myGameSettings: gameSettingsType,
  onSettingsApplied?: (s: gameSettingsType) => void
): any {
  // State variables
  const [activeBlockBricks, setActiveBlockBricks] = useState(
    pg.activeBlock.getBrickPosition()
  );
  const [timeInterval, setTimeInterval] = useState(1000);
  const [level, setLevel] = useState(pg.level);
  const [gameStatus, setGameStatus] = useState(gameStatusEnum.Ongoing);
  const [lastGameStatus, setLastGameStatus] = useState(gameStatus);
  const [gameSettings, setGameSettings] = useState(myGameSettings);

  // Set interval first to 1 sec
  const gameTick = useCallback(() => {
    if (gameStatus === gameStatusEnum.Ongoing) {
      pg.tick();
    }
  }, [pg, gameStatus]);

  // Update active block and wall
  const updatePlayground: any = useCallback(() => {
    //console.log("updatePlayground");
    if (pg.gameover) {
      console.log("Game Over! gameStatus:" + gameStatus);
      setLastGameStatus(gameStatus);
      setGameStatus(gameStatusEnum.GameOver);
    } else {
      pg.updateGame();
      setActiveBlockBricks(pg.activeBlock.getBrickPosition());
    }
  }, [pg, gameStatus]);

  // Sync brick size and board dimensions when the parent recomputes them
  // (window resize or a settings change that bubbled up).
  useEffect(() => {
    setGameSettings(prev => ({
      ...prev,
      brickSize: myGameSettings.brickSize,
      brickSpace: myGameSettings.brickSpace,
      numColumns: myGameSettings.numColumns,
      numRows: myGameSettings.numRows,
    }));
  }, [
    myGameSettings.brickSize,
    myGameSettings.brickSpace,
    myGameSettings.numColumns,
    myGameSettings.numRows,
  ]);

  // Toggle game status Pause
  const togglePause = useCallback(() => {
    console.log("toggle: " + pg.pause + "  gameStatus: " + gameStatus);
    if (gameStatus !== gameStatusEnum.GameOver) {
      setLastGameStatus(gameStatus);
      if (gameStatus === gameStatusEnum.Pause) {
        pg.pause = false;
        setGameStatus(gameStatusEnum.Ongoing);
      } else {
        pg.pause = true;
        setGameStatus(gameStatusEnum.Pause);
      }
    }
  }, [pg, gameStatus]);

  // Start new game from scratch
  const startNewGame = () => {
    console.log("startNewGame gameStatus: " + gameStatus);
    pg.reset();
    setLastGameStatus(gameStatus);
    setGameStatus(gameStatusEnum.Ongoing);
    setLevel(1);
  };

  const handleKeys = useCallback(
    (event: KeyboardEvent) => {
      // Don't hijack keys while the user is typing in an input
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      console.log("event.key: " + event.key);
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          pg.tryMove(-1);
          break;
        case "ArrowRight":
        case "d":
          pg.tryMove(1);
          break;
        case "ArrowUp":
        case "q":
          pg.tryRotate("left");
          break;
        case "e":
          pg.tryRotate("right");
          break;
        case "ArrowDown":
        case "s":
          pg.softDrop();
          break;
        case "p":
          pg.printConfig();
          console.log("Time interval: " + timeInterval);
          break;
        case "7":
          pg.addRow();
          break;
        case "8":
          pg.numRows = pg.numRows - 1;
          break;
        case "9":
          pg.addColumn();
          break;
        case "0":
          pg.deleteColumn();
          break;
        case "Escape":
          togglePause();
          break;
        case "+":
          setGameSettings(prev => ({
            ...prev,
            brickSize: Math.min(prev.brickSpace, prev.brickSize + 1),
          }));
          break;
        case "-":
          setGameSettings(prev => ({
            ...prev,
            brickSize: Math.max(4, prev.brickSize - 1),
          }));
          break;
        default:
      }
      // when pressing a key - update
      updatePlayground();
    },
    [pg, togglePause, updatePlayground, timeInterval]
  );

  const showSettings = useCallback(() => {
    console.log("showSettings gameStatus: " + gameStatus);
    document.removeEventListener("keydown", handleKeys);
    setLastGameStatus(gameStatus);
    setGameStatus(gameStatusEnum.Settings);
  }, [gameStatus, handleKeys]);

  const setGameSettingsCallback = useCallback(
    (myGameSettings: gameSettingsType) => {
      console.log("setGameSettingsCallback gameStatus: " + gameStatus);
      document.removeEventListener("keydown", handleKeys);
      setGameStatus(lastGameStatus);
      setGameSettings(myGameSettings);
      // The already-spawned activeBlock plays out as-is; wall height and
      // probability apply on the next new game.
      pg.configure(myGameSettings);
      setGameSettings(myGameSettings);
      saveSettings(myGameSettings);
      onSettingsApplied?.(myGameSettings);
    },
    [gameStatus, lastGameStatus, handleKeys, pg, onSettingsApplied]
  );

  // Main game engine
  useEffect(() => {
    document.addEventListener("keydown", handleKeys);
    setTimeInterval(intervalForLevel(level));
    const gameIntervalId = setInterval(() => {
      if (gameStatus === gameStatusEnum.Ongoing) {
        gameTick();
        updatePlayground();
        if (pg.level !== level) {
          setLevel(pg.level);
          console.log(
            "levelUp timeInternal: " +
              timeInterval +
              "  level: " +
              level +
              "  score: " +
              pg.score
          );
        }
        //console.log("gameIntervalId: " + gameIntervalId);
      } else if (gameStatus === gameStatusEnum.Settings) {
        document.removeEventListener("keydown", handleKeys);
      }
    }, timeInterval);

    return () => {
      console.log("clearInterval removeEventListener");
      document.removeEventListener("keydown", handleKeys);
      clearInterval(gameIntervalId);
    };
  }, [
    pg,
    gameTick,
    timeInterval,
    level,
    gameStatus,
    handleKeys,
    updatePlayground,
  ]);

  return {
    activeBlockBricks,
    gameStatus,
    gameSettings,
    startNewGame,
    togglePause,
    showSettings,
    setGameSettingsCallback,
  };
}

export default UseGameState;
