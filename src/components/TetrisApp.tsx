// Main entry for game app

// Implementerar viewdelen i MVP
// Modellen finns i objektet pg (ren javascript av typen playground)
// Här fångas alla tangenttryckningar och anropar andra komponenter för att
// rita ut de visuella delarna

import { useState, useEffect } from "react";
import playground from "../model/playground";
import Playground from "./Playground";
import GameOver from "./board/GameOver";
import Pause from "./board/Pause";
import Settings from "./board/Settings";
const TetrisApp = () => {
  const pg = playground.getInstance(window.innerWidth, window.innerHeight);

  const [activeBlockBricks, setActiveBlockBricks] = useState(
    pg.activeBlock.getBrickPosition()
  );
  const [timeInterval, setTimeInterval] = useState(1000);
  const [gameOver, setGameOver] = useState(pg.gameover);
  const [pause, setPause] = useState(pg.pause);
  const [openSettings, setOpenSettings] = useState(false);
  //const levelUpgradeDiv = 2;

  // Assigna tangenttryckningar - Will only run once when component is mounted
  useEffect(() => {
    pg.printConfig();
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
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
          pg.brickSize++;
          break;
        case "4":
          pg.brickSize--;
          break;
        case "5":
          pg.brickSpace++;
          break;
        case "6":
          pg.brickSpace--;
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
          pg.brickSize++;
          pg.brickSpace++;
          break;
        case "-":
          pg.brickSize--;
          pg.brickSpace--;
          break;
        default:
      }
      updatePlayground();
    });

    setInterval(() => gameTick(), timeInterval);
  }, []);

  const togglePause = () => {
    if (!pg.gameover) {
      pg.pause = !pg.pause;
      setPause(!pause);
      updatePlayground();
    }
  };

  // Timeout till approx 1 sec
  const gameTick = () => {
    if (!pg.gameover && !pg.pause) {
      pg.incTime();
      updatePlayground();
    }
  };

  // Updatera modell
  const updatePlayground = () => {
    pg.updateBlockWallStatus();
    setActiveBlockBricks(pg.activeBlock.getBrickPosition());

    // if (score !== pg.score && pg.score % levelUpgradeDiv === 0) {
    //   levelUpgrade(timeInterval);
    // }

    setGameOver(pg.gameover);
    setPause(pg.pause);
  };

  // Start new game from scratch
  const startNewGame = () => {
    pg.reset();
    pg.gameover = false;
    pg.pause = false;
    setGameOver(false);
    setPause(false);
  };

  const myOpenSettings = () => {
    setOpenSettings(!openSettings);
  };

  const levelUpgrade = () => {
    let interval: number = timeInterval;
    clearInterval(timeInterval);
    setTimeInterval(interval * 0.8);
    setInterval(() => gameTick(), timeInterval);
  };

  let gameoverTextLeft = (pg.numColumns * pg.brickSpace) / 2 - 100;
  let gameoverTextTop = (pg.numRows * pg.brickSpace) / 2 - 100;

  return (
    <div>
      <div>
        <Playground
          blockBricks={activeBlockBricks}
          settings={myOpenSettings}
          pause={togglePause}
          newgame={startNewGame}
          pg={pg}
        />
        {/* Hantering av dialogfönster */}
        {openSettings && (gameOver || pause) && (
          <Settings settings={myOpenSettings} pg={pg} />
        )}
        {gameOver && !pause && !openSettings && (
          <GameOver
            score={pg.score}
            pgLeft={gameoverTextLeft}
            pgTop={gameoverTextTop}
            startNewGame={startNewGame}
          />
        )}
        {pause && !gameOver && !openSettings && (
          <Pause
            pgLeft={gameoverTextLeft}
            pgTop={gameoverTextTop}
            startGame={togglePause}
          />
        )}
      </div>
    </div>
  );
};

export default TetrisApp;
