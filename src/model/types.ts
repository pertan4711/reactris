import playgroundModel from "./playground";

export type PlaygroundProps = {
  blockBricks: { pX: number; pY: number }[];
  settings: any;
  pause: any;
  newgame: any;
  pg: playgroundModel;
};

export type BrickProps = {
  brick: { pX: number; pY: number };
  color: string;
  brickSize: number;
  brickSpace: number;
};

export type BlockProps = {
  bricks: { pX: number; pY: number }[];
  color: string;
  brickSize: number;
  brickSpace: number;
  numCol: number;
};

export type WallProps = {
  wall: number[][];
  numCol: number;
  numRow: number;
  brickSize: number;
  brickSpace: number;
};

export type BoundaryProps = {
  xoffset: number;
  height: number;
};

export type ScoreProps = {
  width: number;
  height: number;
  settings: any;
  pause: any;
  newgame: any;
  pg: playgroundModel;
};

export type GameOverProps = {
  score: number;
  pgLeft: number;
  pgTop: number;
  startNewGame: any;
};

export type PauseProps = {
  pgLeft: number;
  pgTop: number;
  startGame: any;
};

export type SettingsProps = {
  settings: any;
  pg: playgroundModel;
};

export type HighScoreProps = {
  highscoreList: { name: string; score: number }[];
};
