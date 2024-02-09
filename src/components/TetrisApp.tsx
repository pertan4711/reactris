// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import { useState } from "react";
//import { gameSettingsType } from "../model/modeltypes";
import playGroundModel from "../model/playground";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
import ShowDialog from "./ShowDialog";

let initGameSettings: { name: string; value: number }[] = [
  { name: "numColumns", value: 10 },
  { name: "numRows", value: 14 },
  { name: "initWallHeight", value: 4 },
  { name: "levelUpgradeDiv", value: 2 },
  { name: "brickSize", value: 70 },
  { name: "brickSpace", value: 72 },
];

const Game = (props: any) => {
  const [gameSettings, setGameSettings] = useState(initGameSettings);
  const pg = playGroundModel.getInstance(
    window.innerWidth,
    window.innerHeight,
    gameSettings
  );

  const {
    activeBlockBricks,
    gameStatus,
    startNewGame,
    togglePause,
    showSettings,
  } = UseGameState(pg);

  return (
    <div>
      <div>
        <Playground
          blockBricks={activeBlockBricks}
          gameStatus={gameStatus}
          actionCallbacks={{ startNewGame, togglePause, showSettings }}
          pg={pg}
        />
      </div>
      <div>
        <ShowDialog
          gameStatus={gameStatus}
          actionCallbacks={{ startNewGame, togglePause, showSettings }}
          gameSettings={gameSettings}
          gameSettingsCallback={setGameSettings}
          score={pg.score}
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
