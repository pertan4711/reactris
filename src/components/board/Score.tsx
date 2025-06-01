import { ScoreProps } from "../../model/componentProps";

const ScoreBoard = ({ width, height, actionCallbacks, pg }: ScoreProps) => {
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
        <div
          className="score-heading"
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Reactris
        </div>
        <div
          className="score-text"
          style={{
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
          }}
        >
          Score: {pg.score}
        </div>
        <div
          className="score-text"
          style={{
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
          }}
        >
          Level: {pg.level}
        </div>
        <p />
        <div
          style={{
            color: "white",
            margin: "5px",
          }}
        >
          <button
            className="button-text"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              backgroundColor: "lightyellow",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => actionCallbacks.showSettings()}
          >
            Settings
          </button>
          <br />
          <button
            className="button-text"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              backgroundColor: "lightyellow",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => actionCallbacks.togglePause()}
          >
            Pause
          </button>
          <br />
          <button
            className="button-text"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              backgroundColor: "lightyellow",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => actionCallbacks.startNewGame()}
          >
            New Game
          </button>
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;