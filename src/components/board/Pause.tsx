import { useEffect, useRef } from "react";
import { PauseProps } from "../../model/componentProps";

const Pause = ({ pgLeft, pgTop, startGame }: PauseProps) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

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
        ref={btnRef}
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
