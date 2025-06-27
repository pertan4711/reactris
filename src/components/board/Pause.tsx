import { PauseProps } from "../../model/componentProps";

const Pause = ({ pgLeft, pgTop, startGame }: PauseProps) => {
  return (
    <div
      className="playground-dialogue sunken-panel"
      style={{
        left: pgLeft,
        top: pgTop,
        width: 240,
        height: 140,
        padding: "18px 0",
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
        Paused
      </div>
      <button
        className="button-text"
        id="resetButton"
        style={{
          textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
          backgroundColor: "#F5F5E0", // Slightly grayer than lightyellow
          border: "none",
          cursor: "pointer",
          marginTop: "16px",
          transform: "rotate(-5deg)",
          transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(-5deg)")}
        onClick={() => startGame()}
      >
        Play
      </button>
    </div>
  );
};

export default Pause;
