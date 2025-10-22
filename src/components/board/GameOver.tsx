import React, { useState } from "react";
import { GameOverProps } from "../../model/componentProps";
//import css from "./GameOver.module.css";

const GameOver = ({ score, pgLeft, pgTop, startNewGame }: GameOverProps) => {
  const [isHovered, setIsHovered] = useState(false);
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
        borderRight: "2px solid #d1cfc7", // subtle right border
  borderBottom: "3px solid #6c6b68", // much darker bottom border
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
          backgroundColor: "#EEEEE0",
          border: "none",
          cursor: "pointer",
          marginTop: "16px",
          transform: isHovered ? "rotate(0deg)" : "rotate(-5deg)",
          transition: "transform 0.7s",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => startNewGame()}
      >
        Play
      </button>
    </div>
  );
};

export default GameOver;
