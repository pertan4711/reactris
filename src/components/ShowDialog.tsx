import React from "react";
import GameOver from "./board/GameOver";
import Pause from "./board/Pause";
import Settings from "./board/Settings";
import { ShowDialogProps } from "../model/types";

const ShowDialog = (props : ShowDialogProps) => {

  let gameOverTextLeft = (props.pg.numColumns * props.pg.gameSettings.brickSpace) / 2 - 100;
  let gameOverTextTop = (props.pg.numRows * props.pg.gameSettings.brickSpace) / 2 - 100;

  return (
    <div>
      {props.showSettings && (props.gameOver || props.pause) && (
        <Settings settings={props.showSettings} pg={props.pg} />
      )}
      {props.gameOver && !props.pause && !props.showSettings && (
        <GameOver
          score={props.pg.score}
          pgLeft={gameOverTextLeft}
          pgTop={gameOverTextTop}
          startNewGame={props.newgame}
        />
      )}
      {props.pause && !props.gameOver && !props.showSettings && (
          <Pause
            pgLeft={gameOverTextLeft}
            pgTop={gameOverTextTop}
            startGame={props.pause}
          />
        )
      }
  </div>
  );
}

export default ShowDialog;