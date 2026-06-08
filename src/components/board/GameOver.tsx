import { useState } from "react";
import { GameOverProps } from "../../model/componentProps";
import { qualifiesForHighScore, saveHighScore } from "../../utils/highScores";

const GameOver = ({ score, level, pgLeft, pgTop, startNewGame, onBackToMenu, onViewHighScores }: GameOverProps) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const qualifies = qualifiesForHighScore(score);

  const handleSubmit = () => {
    saveHighScore(name, score, level);
    setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div
      className="playground-dialogue playground-text"
      style={{ left: pgLeft, top: pgTop }}
    >
      <div>Game Over</div>
      <div>Your score: {score}</div>

      {qualifies && !submitted && (
        <div style={{ margin: '10px 0' }}>
          <div style={{ fontSize: '22px', marginBottom: '8px' }}>🏆 New High Score!</div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
            autoFocus
            style={{
              fontFamily: '"Joti One", cursive',
              fontSize: '20px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(102,126,234,0.6)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: '8px',
              outline: 'none',
            }}
          />
          <button className="button-text" onClick={handleSubmit} style={{ width: '100%' }}>
            Save Score
          </button>
        </div>
      )}

      {submitted && (
        <div style={{ fontSize: '20px', margin: '8px 0', color: '#55EFC4' }}>
          ✓ Score saved!
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
        <button className="button-text" id="resetButton" onClick={() => startNewGame()}>
          Play Again
        </button>
        {submitted && onViewHighScores && (
          <button className="button-text" onClick={onViewHighScores}>
            View High Scores
          </button>
        )}
        {onBackToMenu && (
          <button
            className="button-text"
            style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}
            onClick={onBackToMenu}
          >
            Main Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default GameOver;
