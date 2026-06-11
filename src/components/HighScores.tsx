// High Scores Component
import React, { useMemo, useEffect, useRef } from "react";
import "./HighScores.css";
import { getHighScores, HighScoreEntry } from "../utils/highScores";

interface HighScoresProps {
  onBack: () => void;
}

const HighScores: React.FC<HighScoresProps> = ({ onBack }) => {
  const scores: HighScoreEntry[] = getHighScores();
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    })), []);

  const getRankEmoji = (position: number): string => {
    switch (position) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "🏅";
    }
  };

  return (
    <div className="highscores-container">
      <div className="highscores-content">
        <div className="highscores-header">
          <h1 className="highscores-title">
            🏆 HIGH SCORES 🏆
          </h1>
          <p className="highscores-subtitle">Hall of Fame</p>
        </div>

        <div className="scores-list">
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '2rem', fontSize: '1.2rem' }}>
              No scores yet — play a game to get on the board!
            </div>
          ) : (
            <>
              <div className="scores-header">
                <span className="header-rank">RANK</span>
                <span className="header-name">NAME</span>
                <span className="header-score">SCORE</span>
                <span className="header-level">LEVEL</span>
                <span className="header-date">DATE</span>
              </div>
              {scores.map((score, index) => (
                <div
                  key={score.id}
                  className={`score-row ${index < 3 ? 'top-three' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="score-rank">
                    {getRankEmoji(index + 1)} #{index + 1}
                  </span>
                  <span className="score-name">{score.name}</span>
                  <span className="score-points">{formatScore(score.score)}</span>
                  <span className="score-level">{score.level}</span>
                  <span className="score-date">{formatDate(score.date)}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="highscores-actions">
          <button
            ref={backRef}
            className="back-button"
            onClick={onBack}
          >
            <span className="button-icon">←</span>
            BACK TO MENU
          </button>
        </div>

        <div className="achievement-info">
          <p className="achievement-text">
            🎯 Beat the top score to become the new Tetris Champion!
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="score-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HighScores;