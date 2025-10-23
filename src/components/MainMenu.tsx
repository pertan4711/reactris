// Main Menu Component for Tetris Game
import React, { useState, useEffect } from "react";
import "./MainMenu.css";

interface MainMenuProps {
  onStartGame: () => void;
  onShowHighScores: () => void;
}

// Tetris block shapes for animation
const TETRIS_SHAPES = [
  // I-block
  [[1, 1, 1, 1]],
  // O-block
  [[1, 1], [1, 1]],
  // T-block
  [[0, 1, 0], [1, 1, 1]],
  // S-block
  [[0, 1, 1], [1, 1, 0]],
  // Z-block
  [[1, 1, 0], [0, 1, 1]],
  // J-block
  [[1, 0, 0], [1, 1, 1]],
  // L-block
  [[0, 0, 1], [1, 1, 1]]
];

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
];

interface FallingBlockProps {
  shape: number[][];
  color: string;
  startX: number;
  delay: number;
}

const FallingBlock: React.FC<FallingBlockProps> = ({ shape, color, startX, delay }) => {
  const [position, setPosition] = useState({ x: startX, y: -100 });

  useEffect(() => {
    const timer = setTimeout(() => {
      const fallInterval = setInterval(() => {
        setPosition(prev => {
          if (prev.y > window.innerHeight + 100) {
            return { x: startX, y: -100 };
          }
          return { x: prev.x, y: prev.y + 2 };
        });
      }, 50);

      return () => clearInterval(fallInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [startX, delay]);

  return (
    <div
      className="falling-block"
      style={{
        left: position.x,
        top: position.y,
        color: color,
      }}
    >
      {shape.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="block-cell"
              style={{
                backgroundColor: color,
                left: colIndex * 25,
                top: rowIndex * 25,
              }}
            />
          ) : null
        )
      )}
    </div>
  );
};

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onShowHighScores }) => {
  const [animatedBlocks, setAnimatedBlocks] = useState<Array<{
    id: number;
    shape: number[][];
    color: string;
    startX: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    // Create falling blocks
    const blocks = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      shape: TETRIS_SHAPES[Math.floor(Math.random() * TETRIS_SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      startX: Math.random() * (window.innerWidth - 100),
      delay: Math.random() * 5000,
    }));

    setAnimatedBlocks(blocks);
  }, []);

  return (
    <div className="main-menu">
      {/* Animated falling blocks background */}
      <div className="falling-blocks-container">
        {animatedBlocks.map(block => (
          <FallingBlock
            key={block.id}
            shape={block.shape}
            color={block.color}
            startX={block.startX}
            delay={block.delay}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="main-menu-content">
        <div className="title-container">
          <h1 className="game-title">REACTRIS</h1>
          <p className="game-subtitle">A React Tetris Experience</p>
        </div>

        <div className="menu-buttons">
          <button 
            className="menu-button start-button"
            onClick={onStartGame}
          >
            <span className="button-icon">▶</span>
            START GAME
          </button>
          
          <button 
            className="menu-button highscore-button"
            onClick={onShowHighScores}
          >
            <span className="button-icon">🏆</span>
            HIGH SCORES
          </button>
        </div>

        <div className="game-info">
          <div className="info-item">
            <span className="info-label">Controls:</span>
            <span className="info-text">Arrow Keys to Move • Space to Rotate</span>
          </div>
        </div>
      </div>

      {/* Decorative tetris blocks */}
      <div className="decorative-blocks">
        <div className="deco-block deco-block-1" style={{backgroundColor: '#FF6B6B'}}></div>
        <div className="deco-block deco-block-2" style={{backgroundColor: '#4ECDC4'}}></div>
        <div className="deco-block deco-block-3" style={{backgroundColor: '#45B7D1'}}></div>
        <div className="deco-block deco-block-4" style={{backgroundColor: '#96CEB4'}}></div>
      </div>
    </div>
  );
};

export default MainMenu;