import playgroundModel from "./playground";
import { gameStatusEnum } from "./modeltypes";

export type PlaygroundProps = {
  blockBricks: { pX: number; pY: number }[];
  gameStatus: gameStatusEnum;
  actionCallbacks: any;
  pg: playgroundModel;
};

export type ShowDialogProps = {
  gameStatus: gameStatusEnum;
  actionCallbacks: any;
  gameSettings: any;
  gameSettingsCallback: any;
  score: number;
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
  gameSettings: [string, number][];
  gameSettingsCallback: any;
};
