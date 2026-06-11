// Main Menu Component for Tetris Game
import React, { useState, useEffect, useRef } from "react";
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

const CELL_SIZE = 104;

interface FallingBlockProps {
  shape: number[][];
  color: string;
  startX: number;
  startY: number;
  speed: number;
  spinDelay: number;
}

const FallingBlock: React.FC<FallingBlockProps> = ({ shape, color, startX, startY, speed, spinDelay }) => {
  const [position, setPosition] = useState({ x: startX, y: startY });

  useEffect(() => {
    const fallInterval = setInterval(() => {
      setPosition(prev => {
        if (prev.y > window.innerHeight + 100) {
          return { x: prev.x, y: -shape.length * CELL_SIZE - 20 };
        }
        return { x: prev.x, y: prev.y + speed };
      });
    }, 50);
    return () => clearInterval(fallInterval);
  }, [speed, shape.length]);

  return (
    <div
      className="falling-block"
      style={{
        left: position.x,
        top: position.y,
        color: color,
        animationDelay: `0s, ${spinDelay}s`,
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
                left: colIndex * CELL_SIZE,
                top: rowIndex * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
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
    startY: number;
    speed: number;
    spinDelay: number;
  }>>([]);
  const startRef = useRef<HTMLButtonElement>(null);
  const highScoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const COUNT = 14;
    const margin = 4 * CELL_SIZE;
    const blocks = Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      shape: TETRIS_SHAPES[Math.floor(Math.random() * TETRIS_SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      startX: Math.random() * Math.max(0, window.innerWidth - margin),
      // Distribute initial vertical positions across (and above) the viewport
      // so blocks are already scattered when the menu first appears.
      startY: -100 + Math.random() * (window.innerHeight + 200),
      // Each block falls at its own pace so they don't sync up after recycling.
      speed: 1.5 + Math.random() * 1.5,
      // Negative delay starts each block mid-rotation, so spins stay out of phase.
      spinDelay: -Math.random() * 22,
    }));

    setAnimatedBlocks(blocks);
    startRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const active = document.activeElement;
        if (active === startRef.current) highScoreRef.current?.focus();
        else startRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
            startY={block.startY}
            speed={block.speed}
            spinDelay={block.spinDelay}
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
            ref={startRef}
            className="menu-button start-button"
            onClick={onStartGame}
          >
            <span className="button-icon">▶</span>
            START GAME
          </button>

          <button
            ref={highScoreRef}
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
            <span className="info-text">↑/↓ to select • Enter to confirm • Arrows/WASD to move • Q/E to rotate • Esc to pause</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainMenu;