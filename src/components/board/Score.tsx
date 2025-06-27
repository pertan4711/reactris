import { ScoreProps } from "../../model/componentProps";

const ScoreBoard = ({ width, height, actionCallbacks, pg }: ScoreProps) => {
  return (
    <>
      {/* Board displaying score */}
      <div
        className="playground-panel"
        style={{
          position: "absolute",
          left: width + 5,
          width: 350,
          height: height,
          top: 0,
          backgroundColor: "#FFF8DC", // matches Settings panel background
          boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", // Match inner panel shadow for consistency
          borderRadius: "10px",
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
        <div className="sunken-panel"
          style={{
            backgroundColor: "#FFF9E3", // matches Settings inner panel
            margin: "10px",
            padding: "5px 10px 5px 10px",
            borderRadius: "10px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", // consistent shadow
          }}>
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
        </div>
        <p />
        <div 
          style={{
            backgroundColor: "#FFF9E3", // matches Settings inner panel
            margin: "10px",
            borderRadius: "10px",
            marginLeft: "10px",
            padding: "40px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", // consistent shadow
          }}
          className="score-panel sunken-panel"
        >
          <button
            className="button-text"
            style={{
              textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
              backgroundColor: "#EEEEE0", // Slightly grayer than lightyellow
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
              backgroundColor: "#EEEEE0", // Slightly grayer than lightyellow
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
              backgroundColor: "#EEEEE0", // Slightly grayer than lightyellow
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