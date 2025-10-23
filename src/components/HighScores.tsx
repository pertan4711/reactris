// High Scores Component
import React from "react";
import "./HighScores.css";

interface HighScoresProps {
  onBack: () => void;
}

interface Score {
  id: number;
  name: string;
  score: number;
  level: number;
  date: string;
}

const HighScores: React.FC<HighScoresProps> = ({ onBack }) => {
  // Mock high scores data - in a real app, this would come from localStorage or a backend
  const mockScores: Score[] = [
    { id: 1, name: "TETRIS MASTER", score: 125430, level: 15, date: "2024-10-20" },
    { id: 2, name: "BLOCK BREAKER", score: 98750, level: 12, date: "2024-10-19" },
    { id: 3, name: "LINE CLEARER", score: 76540, level: 10, date: "2024-10-18" },
    { id: 4, name: "PUZZLE KING", score: 65220, level: 9, date: "2024-10-17" },
    { id: 5, name: "SHAPE SHIFTER", score: 54780, level: 8, date: "2024-10-16" },
    { id: 6, name: "BRICK MASTER", score: 43210, level: 7, date: "2024-10-15" },
    { id: 7, name: "GAME GURU", score: 32150, level: 6, date: "2024-10-14" },
    { id: 8, name: "PIXEL PRO", score: 21090, level: 5, date: "2024-10-13" },
    { id: 9, name: "NOVICE", score: 15670, level: 4, date: "2024-10-12" },
    { id: 10, name: "BEGINNER", score: 8430, level: 3, date: "2024-10-11" },
  ];

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

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
          <div className="scores-header">
            <span className="header-rank">RANK</span>
            <span className="header-name">NAME</span>
            <span className="header-score">SCORE</span>
            <span className="header-level">LEVEL</span>
            <span className="header-date">DATE</span>
          </div>

          {mockScores.map((score, index) => (
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
        </div>

        <div className="highscores-actions">
          <button 
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
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HighScores;