import { useState, useEffect, useCallback } from "react";
import {
  blockModelType,
  gameSettingsType,
  gameStatusEnum,
} from "../model/modeltypes";
import playGroundModel from "../model/playground";
import GameOver from "./board/GameOver";

//
// Handle state and user hooks
//
function UseGameState(pg: playGroundModel) {
  // State variables
  const [activeBlockBricks, setActiveBlockBricks] = useState(
    pg.activeBlock.getBrickPosition()
  );
  const [timeInterval, setTimeInterval] = useState(1000);
  const [gameRunStatus, setGameRunStatus] = useState(pg.getGameStatus);

  const updatePlayground = useCallback(() => {
    pg.updateBlockWallStatus();
    setActiveBlockBricks(pg.activeBlock.getBrickPosition());
    if (pg.score % pg.gameSettings.levelUpgradeDiv === 0) {
      if (timeInterval > 500) {
        setTimeInterval(timeInterval - 100);
      }
    }
  }, [pg, timeInterval]);

  const togglePause = useCallback(() => {
    if (gameRunStatus !== gameStatusEnum.GameOver) {
      if (gameRunStatus === gameStatusEnum.Pause) {
        pg.pause = false;
        setGameRunStatus(gameStatusEnum.Ongoing);
      } else {
        pg.pause = true;
        setGameRunStatus(gameStatusEnum.Pause);
      }
      updatePlayground();
    }
  }, [pg, gameRunStatus, updatePlayground]);

  // Start new game from scratch
  const startNewGame = () => {
    pg.reset();
    pg.gameover = false;
    pg.pause = false;
    setGameRunStatus(gameStatusEnum.Ongoing);
  };

  const levelUpgrade = () => {
    let interval: number = timeInterval;
    clearInterval(timeInterval);
    setTimeInterval(interval * 0.8);
    setInterval(() => gameTick(), timeInterval);
  };

  const gameTick = useCallback(() => {
    if (gameRunStatus === gameStatusEnum.Ongoing) {
      pg.incTime();
      updatePlayground();
    }
  }, [pg, updatePlayground]);

  const handleKeys = useCallback(
    (event) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          console.log("moveLeft");
          pg.activeBlock.moveLeft();
          break;
        case "ArrowRight":
        case "d":
          pg.activeBlock.moveRight();
          break;
        case "ArrowUp":
        case "q":
          pg.activeBlock.turnLeft();
          break;
        case "e":
          pg.activeBlock.turnRight();
          break;
        case "ArrowDown":
        case "s":
          pg.incTime();
          break;
        case "3":
          pg.gameSettings.brickSize++;
          break;
        case "4":
          pg.gameSettings.brickSize--;
          break;
        case "5":
          pg.gameSettings.brickSpace++;
          break;
        case "6":
          pg.gameSettings.brickSpace--;
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
          pg.gameSettings.brickSize++;
          pg.gameSettings.brickSpace++;
          break;
        case "-":
          pg.gameSettings.brickSize--;
          pg.gameSettings.brickSpace--;
          break;
        default:
      }
    },
    [pg, togglePause]
  );

  // Assign keypress events
  useEffect(() => {
    //pg.printConfig();
    if (gameRunStatus === gameStatusEnum.Ongoing) {
      document.addEventListener("keydown", handleKeys);
      updatePlayground();
    } else {
      document.removeEventListener("keydown", handleKeys);
    }
  }, [handleKeys, updatePlayground]);

  // Timeout approx 1 sec
  useEffect(() => {
    const gameIntervalId = setInterval(() => gameTick(), timeInterval);
    return () => clearInterval(gameIntervalId);
  }, [pg, gameTick, timeInterval, updatePlayground]);

  return {
    activeBlockBricks,
    gameStatus: gameRunStatus,
    actionCallbacks: { startNewGame, togglePause, setGameRunStatus },
  };
}

export default UseGameState;
