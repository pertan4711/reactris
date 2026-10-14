// Main entry for game app
// Implement view part in MVP - Model is the playground object 'pg'

import { useRef } from "react";
import { gameSettingsType, playGroundModel } from "@reactris/engine";
import Playground from "./Playground";
import UseGameState from "./UseGameState";
import ShowDialog from "./ShowDialog";

interface GameProps {
  gameSettings: any;
  startNewGame: () => void;
  onBackToMenu?: () => void;
  onViewHighScores?: (gameType?: number) => void;
  onSettingsApplied?: (s: gameSettingsType) => void;
}

const Game = (props: GameProps) => {
  // One playground per mount; TetrisApp re-mounts Game (key={gameId}) for
  // every new game started from the menu.
  const pgRef = useRef<playGroundModel | null>(null);
  if (pgRef.current === null) {
    pgRef.current = new playGroundModel(props.gameSettings);
    pgRef.current.reset();
  }
  const pg = pgRef.current;

  const {
    activeBlockBricks,
    gameStatus,
    gameSettings,
    startNewGame,
    togglePause,
    showSettings,
    setGameSettingsCallback,
  } = UseGameState(pg, props.gameSettings, props.onSettingsApplied);

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
