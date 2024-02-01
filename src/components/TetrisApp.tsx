// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import { gameSettingsType } from "../model/modeltypes";
import playGroundModel from "../model/playground";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
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
    initGameSettings
  );

  const { activeBlockBricks, gameStatus, actionCallbacks } = UseGameState(pg);

  return (
    <div>
      <div>
        <Playground
          blockBricks={activeBlockBricks}
          gameStatus={gameStatus}
          actionCallbacks={actionCallbacks}
          pg={pg}
        />
      </div>
      <div>
        <ShowDialog
          gameStatus={gameStatus}
          actionCallbacks={actionCallbacks}
          pg={pg}
        />
      </div>
    </div>
  );
};

export default TetrisApp;
