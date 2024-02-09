import playgroundModel from "./playground";
import { gameSettingsType, gameStatusEnum } from "./modeltypes";

export type PlaygroundProps = {
  blockBricks: { pX: number; pY: number }[];
  gameStatus: gameStatusEnum;
  actionCallbacks: any;
  pg: playgroundModel;
};

export type ShowDialogProps = {
  score: number;
  gameStatus: gameStatusEnum;
  gameSettings: gameSettingsType;
  actionCallbacks: any;
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
  gameStatus: gameStatusEnum;
  actionCallbacks: any;
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
  gameSettings: gameSettingsType;
  setGameSettings: any;
};
