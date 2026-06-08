// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import playGroundModel from "../model/playground";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
import ShowDialog from "./ShowDialog";

interface GameProps {
  gameSettings: any;
  startNewGame: () => void;
  onBackToMenu?: () => void;
  onViewHighScores?: () => void;
}

const Game = (props: GameProps) => {
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

  const pwidth = gameSettings.numColumns * gameSettings.brickSpace;
  const pheight = gameSettings.numRows * gameSettings.brickSpace;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", width: pwidth + 360, height: pheight, flexShrink: 0 }}>
        <Playground
          blockBricks={activeBlockBricks}
          gameStatus={gameStatus}
          gameSettings={gameSettings}
          actionCallbacks={{ startNewGame, togglePause, showSettings, onBackToMenu: props.onBackToMenu }}
          pg={pg}
        />
        <ShowDialog
          gameStatus={gameStatus}
          gameSettings={gameSettings}
          score={pg.score}
          level={pg.level}
          actionCallbacks={{
            startNewGame,
            togglePause,
            showSettings,
            setGameSettingsCallback,
            onBackToMenu: props.onBackToMenu,
            onViewHighScores: props.onViewHighScores,
          }}
        />
      </div>
    </div>
  );
};

export default Game;
