// Main entry for game app

import { useState } from "react";
import { gameSettingsType, gameTypeEnum } from "../model/modeltypes";
import Game from "./Game";
import calculateBrickSize from "../utils/utils";

// Init settings for startup
const TetrisApp = () => {
  const [gameId, setGameId] = useState(1); // Should be used to reset game

  let numCol = 10;
  let numRow = 14;
  let brickSize = calculateBrickSize(
    window.innerWidth,
    window.innerHeight,
    numCol,
    numRow
  );

  let initGameSettings: gameSettingsType = {
    numColumns: numCol,
    numRows: numRow,
    initWallHeight: 4,
    levelUpgradeDiv: 2,
    brickSize: brickSize,
    brickSpace: brickSize + 2,
    gameType: gameTypeEnum.Classic,
    initWallPropability: 0.5,
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
