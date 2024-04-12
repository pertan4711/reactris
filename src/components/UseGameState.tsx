import { useState, useEffect, useCallback } from "react";
import { gameStatusEnum } from "../model/modeltypes";
import playGroundModel from "../model/playground";
import { gameSettingsType } from "../model/modeltypes";

//
// Handle state and user hooks
//
function UseGameState(
  pg: playGroundModel,
  myGameSettings: gameSettingsType
): any {
  // State variables
  const [activeBlockBricks, setActiveBlockBricks] = useState(
    pg.activeBlock.getBrickPosition()
  );
  const [timeInterval, setTimeInterval] = useState(1000);
  const [level, setLevel] = useState(pg.level);
  const [gameStatus, setGameStatus] = useState(gameStatusEnum.GameOver);
  const [lastGameStatus, setLastGameStatus] = useState(gameStatus);
  const [gameSettings, setGameSettings] = useState(myGameSettings);

  // Set interval first to 1 sec
  const gameTick = useCallback(() => {
    if (gameStatus === gameStatusEnum.Ongoing) {
      pg.incTime();
      console.log("nextActive: " + pg.nextActive.constructor.name);
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
    (event) => {
      console.log("event.key: " + event.key);
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          if (!pg.gameover) {
            pg.activeBlock.moveLeft();
            if (pg.checkBlockPosition()) {
              pg.activeBlock.moveRight();
            }
          }
          break;
        case "ArrowRight":
        case "d":
          if (!pg.gameover) {
            pg.activeBlock.moveRight();
            if (pg.checkBlockPosition()) {
              pg.activeBlock.moveLeft();
            }
          }
          break;
        case "ArrowUp":
        case "q":
          if (!pg.gameover) {
            pg.activeBlock.turnLeft();
          }
          break;
        case "e":
          if (!pg.gameover) {
            pg.activeBlock.turnRight();
          }
          break;
        case "ArrowDown":
        case "s":
          if (!pg.gameover) {
            pg.incTime();
          }
          break;
        case "p":
          pg.printConfig();
          console.log("Time interval: " + timeInterval);
          break;
        case "3":
          gameSettings.brickSize++;
          break;
        case "4":
          gameSettings.brickSize--;
          break;
        case "5":
          gameSettings.brickSpace++;
          break;
        case "6":
          gameSettings.brickSpace--;
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
          gameSettings.brickSize++;
          gameSettings.brickSpace++;
          break;
        case "-":
          gameSettings.brickSize--;
          gameSettings.brickSpace--;
          break;
        default:
      }
      // when pressing a key - update
      updatePlayground();
    },
    [
      pg,
      togglePause,
      updatePlayground,
      timeInterval,
      gameSettings.brickSize,
      gameSettings.brickSpace,
    ]
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
      pg.numColumns = myGameSettings.numColumns;
      pg.numRows = myGameSettings.numRows;
      setGameSettings(myGameSettings);
    },
    [gameStatus, lastGameStatus, handleKeys, pg]
  );

  // Main game engine
  useEffect(() => {
    function calcInterval(): number {
      //console.log("level: " + level + "  pg.level: " + pg.level);
      if (level < 2) {
        return 1000;
      }
      if (level === 2) {
        return 800;
      } else if (level === 3) {
        return 700;
      } else if (level === 4) {
        return 600;
      } else if (level === 5) {
        return 500;
      } else if (level > 5) {
        return 400;
      }
      return 400;
    }

    //pg.printConfig();
    document.addEventListener("keydown", handleKeys);
    setTimeInterval(calcInterval());
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
