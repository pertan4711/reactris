import { ScoreProps } from "../../model/types";

const ScoreBoard = ({
  width,
  height,
  settings,
  pause,
  newgame,
  pg,
}: ScoreProps) => {
  return (
    <>
      {/* Shadow of board */}
      <div
        style={{
          position: "absolute",
          background: "grey",
          left: width + 10,
          width: 350,
          height: height,
          top: 5,
        }}
      ></div>
      {/* Board displaying score */}
      <div
        className="playground-panel"
        style={{
          position: "absolute",
          left: width + 5,
          width: 350,
          height: height,
          top: 0,
        }}
      >
        <div className="score-heading">Reactris</div>
        <div className="score-text">Score:{pg.score}</div>
        <div className="score-text">Level:{pg.level}</div>
        <div style={{ color: "white", margin: "5px" }}>
          <button className="button-text" onClick={() => settings()}>
            Settings
          </button>
          <br />
          <button className="button-text" onClick={() => pause()}>
            Pause
          </button>
          <br />
          <button className="button-text" onClick={() => newgame()}>
            New Game
          </button>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
