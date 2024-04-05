import { PauseProps } from "../../model/componentProps";

const Pause = ({ pgLeft, pgTop, startGame }: PauseProps) => {
  return (
    <div
      className="playground-dialogue"
      style={{
        left: pgLeft,
        top: pgTop,
      }}
    >
      <div className="dialog-text">Paused</div>
      <button
        className="button-text"
        id="resetButton"
        onClick={() => startGame()}
      >
        Play
      </button>
    </div>
  );
};

export default Pause;
