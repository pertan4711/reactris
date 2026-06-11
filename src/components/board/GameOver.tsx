import { useState, useEffect, useRef } from "react";
import { GameOverProps } from "../../model/componentProps";
import { qualifiesForHighScore, saveHighScore } from "../../utils/highScores";

const GameOver = ({ score, level, pgLeft, pgTop, startNewGame, onBackToMenu, onViewHighScores }: GameOverProps) => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const qualifies = qualifiesForHighScore(score);
  const playAgainRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (submitted) return;
    saveHighScore(name, score, level);
    setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const showInput = qualifies && !submitted;
  useEffect(() => {
    if (!showInput) {
      playAgainRef.current?.focus();
    }
  }, [showInput]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === 'INPUT') return;
      // Cycle through ALL visible buttons on screen (side panel + dialog)
      const buttons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button')
      ).filter(b => b.offsetParent !== null);
      if (buttons.length === 0) return;
      e.preventDefault();
      const idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
      const next = e.key === 'ArrowDown'
        ? (idx + 1) % buttons.length
        : (idx <= 0 ? buttons.length - 1 : idx - 1);
      buttons[next].focus();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="playground-dialogue playground-text"
      style={{ left: pgLeft, top: pgTop }}
    >
      <div>Game Over</div>
      <div>Your score: {score}</div>

      {showInput && (
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
        <button ref={playAgainRef} className="button-text" id="resetButton" onClick={() => startNewGame()}>
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
