// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import playGroundModel from "../model/playground";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
import ShowDialog from "./ShowDialog";

const Game = (props: any) => {
  const pg = playGroundModel.getInstance(
    props.gameSettings.numColumns,
    props.gameSettings.numRows,
    props.gameSettings.gameType,
    props.gameSettings.initWallHeight,
    props.gameSettings.initWallPropability,
    props.gameSettings.levelUpgradeDiv
  );

  const {
    activeBlockBricks,
    gameStatus,
    gameSettings,
    startNewGame,
    togglePause,
    showSettings,
    setGameSettingsCallback,
  } = UseGameState(pg, props.gameSettings);

  //console.log("gameStatus: " + gameStatus);

  return (
    <div>
      <div>
        <Playground
          blockBricks={activeBlockBricks}
          gameStatus={gameStatus}
          gameSettings={gameSettings}
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
            setGameSettingsCallback,
          }}
        />
      </div>
    </div>
  );
};

export default Game;
