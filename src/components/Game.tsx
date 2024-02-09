// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import { useState } from "react";
import playGroundModel from "../model/playground";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
import ShowDialog from "./ShowDialog";

const Game = (props: any) => {
  const [gameSettings, setGameSettings] = useState(props.gameSettings);

  const pg = playGroundModel.getInstance(
    window.innerWidth,
    window.innerHeight,
    gameSettings
  );

  pg.gameSettings = gameSettings;

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
          gameSettings={gameSettings}
          score={pg.score}
          actionCallbacks={{
            startNewGame,
            togglePause,
            showSettings,
            setGameSettings,
          }}
        />
      </div>
    </div>
  );
};

export default Game;
