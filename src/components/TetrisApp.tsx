// Main entry for game app

import { useState } from "react";
import { gameSettingsType, gameTypeEnum } from "../model/modeltypes";
import Game from "./Game";

const TetrisApp = () => {
  const [gameId, setGameId] = useState(1); // Should be used to reset game

  let initGameSettings: gameSettingsType = {
    numColumns: 10,
    numRows: 14,
    initWallHeight: 4,
    levelUpgradeDiv: 2,
    brickSize: 70,
    brickSpace: 72,
    gameType: gameTypeEnum.Classic,
  };

  return (
    <Game
      key={gameId}
      startNewGame={() => setGameId(gameId + 1)}
      gameSettings={initGameSettings}
    />
  );
};

export default TetrisApp;
