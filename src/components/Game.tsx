// Main entry for game app
// Implement view part in MVP - Model exist in singelton object 'pg'

import { useRef } from "react";
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

  // Fresh game on every mount: the playground is a singleton, so re-entering
  // from the menu would otherwise inherit the previous game's "game over" state
  // and stale active block.
  const resetOnce = useRef(false);
  if (!resetOnce.current) {
    pg.reset();
    resetOnce.current = true;
  }

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
      <div style={{ position: "relative", width: pwidth + 360, height: pheight, flexShrink: 0, padding: "5px 0 5px 5px", boxSizing: "content-box" }}>
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
