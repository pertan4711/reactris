// Main entry for game app

import { useState, useEffect } from "react";
import { gameSettingsType, gameTypeEnum } from "@reactris/engine";
import Game from "./Game";
import MainMenu from "./MainMenu";
import HighScores from "./HighScores";
import Settings from "./board/Settings";
import calculateBrickSize from "../utils/utils";
import { loadSettings, saveSettings } from "../utils/settings";

type AppScreen = 'menu' | 'game' | 'highscores' | 'settings';

const readPersisted = () => {
  const s = loadSettings();
  return {
    numColumns: s.numColumns ?? 10,
    numRows: s.numRows ?? 14,
    initWallHeight: s.initWallHeight ?? 4,
    levelUpgradeDiv: s.levelUpgradeDiv ?? 2,
    gameType: s.gameType ?? gameTypeEnum.Classic,
    initWallPropability: s.initWallPropability ?? 0.5,
  };
};

// Init settings for startup
const TetrisApp = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [gameId, setGameId] = useState(1); // Should be used to reset game
  const [highScoresInitialType, setHighScoresInitialType] = useState<number | undefined>(undefined);
  const [persisted, setPersisted] = useState(readPersisted);
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

  const brickSize = calculateBrickSize(windowSize.width, windowSize.height, persisted.numColumns, persisted.numRows);

  const initGameSettings: gameSettingsType = {
    numColumns: persisted.numColumns,
    numRows: persisted.numRows,
    initWallHeight: persisted.initWallHeight,
    levelUpgradeDiv: persisted.levelUpgradeDiv,
    brickSize: brickSize,
    brickSpace: brickSize + 2,
    gameType: persisted.gameType,
    initWallPropability: persisted.initWallPropability,
  };

  const handleStartGame = () => {
    setCurrentScreen('game');
    setGameId(gameId + 1); // Reset game when starting new
  };

  const handleShowHighScores = (gameType?: number) => {
    setHighScoresInitialType(gameType);
    setCurrentScreen('highscores');
  };

  const handleShowSettings = () => {
    setCurrentScreen('settings');
  };

  const updatePersistedFromSettings = (newSettings: gameSettingsType) => {
    setPersisted({
      numColumns: newSettings.numColumns,
      numRows: newSettings.numRows,
      initWallHeight: newSettings.initWallHeight,
      levelUpgradeDiv: newSettings.levelUpgradeDiv,
      gameType: newSettings.gameType,
      initWallPropability: newSettings.initWallPropability,
    });
  };

  const handleApplySettings = (newSettings: gameSettingsType) => {
    updatePersistedFromSettings(newSettings);
    saveSettings(newSettings);
    setCurrentScreen('menu');
  };

  const handleBackToMenu = () => {
    // Re-read persisted settings in case the in-game Settings dialog changed them.
    setPersisted(readPersisted());
    setCurrentScreen('menu');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onShowHighScores={handleShowHighScores}
            onShowSettings={handleShowSettings}
          />
        );
      case 'settings':
        return (
          <div className="settings-fullscreen">
            <Settings
              gameSettings={initGameSettings}
              setGameSettingsCallback={handleApplySettings}
            />
          </div>
        );
      case 'game':
        return (
          <Game
            key={gameId}
            startNewGame={handleStartGame}
            gameSettings={initGameSettings}
            onBackToMenu={handleBackToMenu}
            onViewHighScores={handleShowHighScores}
            onSettingsApplied={updatePersistedFromSettings}
          />
        );
      case 'highscores':
        return (
          <HighScores
            onBack={handleBackToMenu}
            initialGameType={highScoresInitialType}
          />
        );
      default:
        return (
          <MainMenu
            onStartGame={handleStartGame}
            onShowHighScores={handleShowHighScores}
            onShowSettings={handleShowSettings}
          />
        );
    }
  };

  return renderCurrentScreen();
};

export default TetrisApp;
