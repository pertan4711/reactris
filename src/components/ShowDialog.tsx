import GameOver from "./board/GameOver";
import Pause from "./board/Pause";
import Settings from "./board/Settings";
import { ShowDialogProps } from "../model/types";
import { gameStatusEnum } from "../model/modeltypes";

const ShowDialog = (props: ShowDialogProps) => {
  let gameOverTextLeft =
    (props.pg.numColumns * props.pg.gameSettings.brickSpace) / 2 - 100;
  let gameOverTextTop =
    (props.pg.numRows * props.pg.gameSettings.brickSpace) / 2 - 100;
  let gameStatus: gameStatusEnum = props.gameStatus;
  //console.log("gameStatus: " + gameStatus);

  return (
    <div>
      {gameStatus === gameStatusEnum.Settings && <Settings pg={props.pg} />}
      {gameStatus === gameStatusEnum.GameOver && (
        <GameOver
          score={props.pg.score}
          pgLeft={gameOverTextLeft}
          pgTop={gameOverTextTop}
          startNewGame={props.actionCallbacks.startNewGame}
        />
      )}
      {props.gameStatus === gameStatusEnum.Pause && (
        <Pause
          pgLeft={gameOverTextLeft}
          pgTop={gameOverTextTop}
          startGame={props.actionCallbacks.togglePause}
        />
      )}
    </div>
  );
};

export default ShowDialog;
