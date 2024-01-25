// Main entry for game app
// Implement view part in MVP - Model exist in object 'pg' (of type 'playground')
// In here a keypress call other compontents to draw other visual parts.

import { gameSettingsType } from "../model/modeltypes";
import playGroundModel from "../model/playground";
import Playground from "./Playground";
import useGameState from "./useGameState";
import ShowDialog from "./ShowDialog";

let initGameSettings: gameSettingsType = {
  numColumns: 10,
  numRows: 14,
  initWallHeight: 4,
  levelUpgradeDiv: 10,
  brickSize: 70,
  brickSpace: 72,
};

const TetrisApp = () => {
  const pg = playGroundModel.getInstance(
    window.innerWidth, 
    window.innerHeight, 
    initGameSettings);
  const {
    activeBlockBricks,
    gameOver,
    pause, 
    showSettings,
    setShowSettings,
    startNewGame
  } = useGameState(pg);
  
  return (
    <div>
      <div>
        <Playground
          blockBricks={activeBlockBricks}
          pause={pause}
          showSettings={showSettings}
          newgame={startNewGame}
          pg={pg}
        />
      </div>
      <div>
        <ShowDialog
          pause={pause}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          gameOver={gameOver}
          newgame={startNewGame}
          pg={pg}
        />
      </div>
    </div>
  );
};

export default TetrisApp;
