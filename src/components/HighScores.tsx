// High Scores Component
import React, { useMemo, useEffect, useRef, useState } from "react";
import "./HighScores.css";
import { getHighScores, HighScoreEntry } from "../utils/highScores";
import { playMode } from "../model/constants";
import { gameTypeEnum } from "../model/modeltypes";

interface HighScoresProps {
  onBack: () => void;
  initialGameType?: number;
}

const PARTICLE_COLORS = ['#FFD700', '#00D4FF', '#FF6B6B', '#A29BFE', '#4CAF50', '#FF9800', '#E91E63'];

const gameTypeLabel = (idx: number): string => {
  const mode = playMode[idx];
  if (!mode) return `Type ${idx}`;
  const name = gameTypeEnum[mode.mode] ?? "Custom";
  if (name === "Custom") {
    const n = mode.blocks.length;
    return `Custom (${n})`;
  }
  return name;
};

const HighScores: React.FC<HighScoresProps> = ({ onBack, initialGameType }) => {
  const backRef = useRef<HTMLButtonElement>(null);

  const scoresByType = useMemo(() => {
    const map: Record<number, HighScoreEntry[]> = {};
    for (let i = 0; i < playMode.length; i++) {
      map[i] = getHighScores(i);
    }
    return map;
  }, []);

  const defaultType = useMemo(() => {
    if (initialGameType !== undefined && playMode[initialGameType]) {
      return initialGameType;
    }
    const firstWithScores = Object.keys(scoresByType)
      .map(Number)
      .find(i => (scoresByType[i]?.length ?? 0) > 0);
    return firstWithScores ?? 0;
  }, [scoresByType, initialGameType]);

  const [activeType, setActiveType] = useState<number>(defaultType);
  const scores = scoresByType[activeType] ?? [];

  useEffect(() => {
    backRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onBack();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveType(t => (t - 1 + playMode.length) % playMode.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveType(t => (t + 1) % playMode.length);
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
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
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

        <div className="gametype-tabs" role="tablist" aria-label="Game type">
          {playMode.map((_, i) => {
            const hasScores = (scoresByType[i]?.length ?? 0) > 0;
            return (
              <button
                key={i}
                role="tab"
                aria-selected={activeType === i}
                className={`gametype-tab ${activeType === i ? 'active' : ''} ${hasScores ? '' : 'empty'}`}
                onClick={() => setActiveType(i)}
              >
                {gameTypeLabel(i)}
              </button>
            );
          })}
        </div>

        <div className="scores-list">
          {scores.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', padding: '2rem', fontSize: '1.2rem' }}>
              No scores yet for {gameTypeLabel(activeType)} — play a game to get on the board!
            </div>
          ) : (
            <>
              <div className="scores-header">
                <span className="header-rank">RANK</span>
                <span className="header-name">NAME</span>
                <span className="header-score">SCORE</span>
                <span className="header-level">LEVEL</span>
                <span className="header-board">BOARD</span>
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
                  <span className="score-board">
                    {score.numColumns && score.numRows
                      ? `${score.numColumns}×${score.numRows}`
                      : '—'}
                  </span>
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
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HighScores;
