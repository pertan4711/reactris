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
        <div className="score-heading">Reactris</div>
        <div className=" sunken-panel"
          style={{
            backgroundColor: "rgb(255, 165, 255)",
            margin: "10px",
            padding: "5px 10px 5px 10px",
            borderRadius: "10px",
            }}>
          <div className="score-text">Score:{pg.score}</div>
          <div className="score-text">Level:{pg.level}</div>
        </div>
        <p />
        <div 
          style={{
            backgroundColor: "rgb(255, 165, 255)",
            margin: "10px",
            borderRadius: "10px",
            marginLeft: "10px",
            padding: "40px"
            }}
          className="score-panel sunken-panel">
          <button
            className="button-text tilt-left-light shadow-button"
            onClick={() => actionCallbacks.showSettings()}
          >
            Settings
          </button>
          <br />
          <button
            className="button-text tilt-right shadow-button"
            onClick={() => actionCallbacks.togglePause()}
          >
            Pause
          </button>
          <br />
          <button
            className="button-text tilt-left-light shadow-button"
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
