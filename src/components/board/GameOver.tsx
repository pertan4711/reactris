import { GameOverProps } from "../../model/componentProps";

const GameOver = ({ score, pgLeft, pgTop, startNewGame }: GameOverProps) => {
  return (
    <div
      className="playground-dialogue playground-text"
      style={{
        left: pgLeft,
        top: pgTop,
      }}
    >
      <div>Game Over</div>
      <div>Your score: {score}</div>
      <button
        className="button-text"
        id="resetButton"
        onClick={() => startNewGame()}
      >
        Play
      </button>
    </div>
  );
};

export default GameOver;
