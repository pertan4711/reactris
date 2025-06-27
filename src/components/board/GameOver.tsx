import { GameOverProps } from "../../model/componentProps";
//import css from "./GameOver.module.css";

const GameOver = ({ score, pgLeft, pgTop, startNewGame }: GameOverProps) => {
  return (
    <div
      className="playground-dialogue playground-text sunken-panel"
      style={{
        left: pgLeft,
        top: pgTop,
        width: 280,
        height: 180,
        padding: "24px 0",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF9E3", // Match Score.tsx and Settings inner panel
        boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", // Match panel shadow
      }}
    >
      <div
        className="dialog-text"
        style={{
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
        }}
      >
        Game Over
      </div>
      <div
        className="dialog-text"
        style={{
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
        }}
      >
        Your score: {score}
      </div>
      <button
        className="button-text"
        id="resetButton"
        style={{
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          backgroundColor: "#EEEEE0", // Slightly grayer than lightyellow
          border: "none",
          cursor: "pointer",
          marginTop: "16px",
          transform: "rotate(-5deg)",
          transition: "transform 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "rotate(0deg)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "rotate(-5deg)")}
        onClick={() => startNewGame()}
      >
        Play
      </button>
    </div>
  );
};

export default GameOver;
