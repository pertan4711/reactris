// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import { useState } from "react";
import { gameSettingsType } from "../model/modeltypes";
import playGroundModel from "../model/playground";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
import ShowDialog from "./ShowDialog";

let initGameSettings: gameSettingsType = {
  numColumns: 10,
  numRows: 14,
  initWallHeight: 4,
  levelUpgradeDiv: 2,
  brickSize: 70,
  brickSpace: 72,
};

const Game = (props: any) => {
  const pg = playGroundModel.getInstance(
    window.innerWidth,
    window.innerHeight,
    initGameSettings
  );

  const { activeBlockBricks, gameStatus, togglePause, showSettings } =
    UseGameState(pg);

  return (
    <div>
      <div>
        <Playground
          blockBricks={activeBlockBricks}
          gameStatus={gameStatus}
          actionCallbacks={(props.startNewGame, togglePause, showSettings)}
          pg={pg}
        />
      </div>
      <div>
        <ShowDialog
          gameStatus={gameStatus}
          actionCallbacks={(props.startNewGame, togglePause, showSettings)}
          pg={pg}
        />
      </div>
    </div>
  );
};

const TetrisApp = () => {
  const [gameId, setGameId] = useState(1);
  return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)} />;
};

export default TetrisApp;
