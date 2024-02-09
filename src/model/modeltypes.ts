export type blockModelType = {
  blockIndex: number;
  pX: number;
  pY: number;
  spinPosition: number;
};

export type brickModelType = {
  pX: number;
  pY: number;
  color: number;
};

export type wallModelType = {
  numColumns: number;
  numRows: number;
  initWallHeight: number;
};

// export type gameSettingsType = {
//   numColumns: number;
//   numRows: number;
//   initWallHeight: number;
//   levelUpgradeDiv: number;
//   brickSize: number;
//   brickSpace: number;
// };

export enum gameStatusEnum {
  GameOver,
  Pause,
  Ongoing,
  Settings,
}
