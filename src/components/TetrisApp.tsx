// Main entry for game app

import { useState, useEffect } from "react";
import { gameSettingsType, gameTypeEnum } from "../model/modeltypes";
import Game from "./Game";
import MainMenu from "./MainMenu";
import HighScores from "./HighScores";
import calculateBrickSize from "../utils/utils";

type AppScreen = 'menu' | 'game' | 'highscores';

// Init settings for startup
const TetrisApp = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [gameId, setGameId] = useState(1); // Should be used to reset game
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const numCol = 10;
  const numRow = 14;
  const brickSize = calculateBrickSize(windowSize.width, windowSize.height, numCol, numRow);

  const initGameSettings: gameSettingsType = {
    numColumns: numCol,
    numRows: numRow,
    initWallHeight: 4,
    levelUpgradeDiv: 2,
    brickSize: brickSize,
    brickSpace: brickSize + 2,
    gameType: gameTypeEnum.Classic,
    initWallPropability: 0.5,
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
    setGameId(gameId + 1); // Reset game when starting new
  };

  const handleShowHighScores = () => {
    setCurrentScreen('highscores');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu 
            onStartGame={handleStartGame}
            onShowHighScores={handleShowHighScores}
          />
        );
      case 'game':
        return (
          <Game
            key={gameId}
            startNewGame={handleStartGame}
            gameSettings={initGameSettings}
            onBackToMenu={handleBackToMenu}
            onViewHighScores={handleShowHighScores}
          />
        );
      case 'highscores':
        return (
          <HighScores 
            onBack={handleBackToMenu}
          />
        );
      default:
        return (
          <MainMenu 
            onStartGame={handleStartGame}
            onShowHighScores={handleShowHighScores}
          />
        );
    }
  };

  return renderCurrentScreen();
};

export default TetrisApp;
