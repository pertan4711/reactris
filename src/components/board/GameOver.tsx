import { GameOverProps } from "../../model/componentProps";

const GameOver = ({ score, pgLeft, pgTop, startNewGame, onBackToMenu }: GameOverProps) => {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          className="button-text"
          id="resetButton"
          onClick={() => startNewGame()}
        >
          Play Again
        </button>
        {onBackToMenu && (
          <button
            className="button-text"
            onClick={onBackToMenu}
          >
            Main Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOver;
