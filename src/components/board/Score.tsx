import { ScoreProps } from "../../model/componentProps";

const ScoreBoard = ({ width, height, actionCallbacks, pg }: ScoreProps) => {
  return (
    <>
      {/* Shadow of board */}
      <div
        style={{
          position: "absolute",
          background: "rgba(0,0,0,0.4)",
          left: width + 10,
          width: 350,
          height: height,
          top: 5,
          borderRadius: 8,
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
        <div className="score-text">Score: {pg.score}</div>
        <div className="score-text">Level: {pg.level}</div>
        <p />
        <div style={{ color: "white", margin: "5px" }}>
          <button
            className="button-text"
            onClick={() => actionCallbacks.showSettings()}
          >
            Settings
          </button>
          <br />
          <button
            className="button-text"
            onClick={() => actionCallbacks.togglePause()}
          >
            Pause
          </button>
          <br />
          <button
            className="button-text"
            onClick={() => actionCallbacks.startNewGame()}
          >
            New Game
          </button>
          <br />
          {actionCallbacks.onBackToMenu && (
            <button
              className="button-text"
              style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)" }}
              onClick={() => actionCallbacks.onBackToMenu()}
            >
              Main Menu
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
