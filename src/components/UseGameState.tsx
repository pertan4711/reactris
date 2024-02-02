import { useState, useEffect, useCallback } from "react";
import { gameStatusEnum } from "../model/modeltypes";
import playGroundModel from "../model/playground";

//
// Handle state and user hooks
//
function UseGameState(pg: playGroundModel): any {
  // State variables
  const [activeBlockBricks, setActiveBlockBricks] = useState(
    pg.activeBlock.getBrickPosition()
  );
  const [timeInterval, setTimeInterval] = useState(1000);
  const [gameRunStatus, setGameRunStatus] = useState(gameStatusEnum.GameOver);

  // Set interval first to 1 sec
  const gameTick = useCallback(() => {
    if (gameRunStatus === gameStatusEnum.Ongoing) {
      pg.incTime();
      //updatePlayground();
    }
  }, [pg, gameRunStatus]);

  // Update active block and wall
  const updatePlayground: any = useCallback(() => {
    console.log("updatePlayground");
    pg.updateBlockWallStatus();
    setActiveBlockBricks(pg.activeBlock.getBrickPosition());

    // If upgrade level
    if (
      pg.score % pg.gameSettings.levelUpgradeDiv === 0 &&
      pg.score !== pg.lastScore
    ) {
      if (timeInterval > 500) {
        let interval: number = timeInterval;
        clearInterval(timeInterval);

        console.log("LevelUp timeInternal: " + timeInterval);
        setTimeInterval(interval * 0.8);
        setInterval(() => gameTick(), timeInterval);
        pg.lastScore = pg.score;
      }
    }

    if (pg.gameover) {
      console.log("Game Over");
      setGameRunStatus(gameStatusEnum.GameOver);
    }
  }, [pg, gameTick, timeInterval]);

  // Toggle game status Pause
  const togglePause = useCallback(() => {
    if (gameRunStatus !== gameStatusEnum.GameOver) {
      if (gameRunStatus === gameStatusEnum.Pause) {
        pg.pause = false;
        setGameRunStatus(gameStatusEnum.Ongoing);
      } else {
        pg.pause = true;
        setGameRunStatus(gameStatusEnum.Pause);
      }
    }
  }, [pg, gameRunStatus]);

  // Start new game from scratch
  const startNewGame = () => {
    pg.reset();
    pg.gameover = false;
    pg.pause = false;
    setGameRunStatus(gameStatusEnum.Ongoing);
  };

  const showSettings = () => {
    setGameRunStatus(gameStatusEnum.Settings);
  };

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
        case "p":
          pg.printConfig();
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
      // when pressing a key - update
      updatePlayground();
    },
    [pg, togglePause, updatePlayground]
  );

  // Assign keypress events
  useEffect(() => {
    //pg.printConfig();
    document.addEventListener("keydown", handleKeys);
    const gameIntervalId = setInterval(() => {
      if (gameRunStatus === gameStatusEnum.Ongoing) {
        gameTick();
        updatePlayground();
      }
    }, timeInterval);

    return () => {
      clearInterval(gameIntervalId);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [pg, gameTick, timeInterval, gameRunStatus, handleKeys, updatePlayground]);

  return {
    activeBlockBricks,
    gameStatus: gameRunStatus,
    startNewGame,
    togglePause,
    showSettings,
  };
}

export default UseGameState;
