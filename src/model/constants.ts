import bigblock from "./blocks/bigblock";
import jaggedblock from "./blocks/jaggedblock";
import leftblock from "./blocks/leftblock";
import leftflashblock from "./blocks/leftflashblock";
import lineblock from "./blocks/lineblock";
import minorlineblock from "./blocks/minorlineblock";
import rightblock from "./blocks/rightblock";
import rightflashblock from "./blocks/rightflashblock";
import squareblock from "./blocks/squareblock";
import hillblock from "./blocks/hillblock";
import { gameTypeEnum } from "./modeltypes";
import bigleftblock from "./blocks/bigleftblock";
import bigrightblock from "./blocks/bigrightblock";

export const blocks: { block: any; color: string }[] = [
  { block: leftblock, color: "red" },
  { block: rightblock, color: "orange" },
  { block: squareblock, color: "yellow" },
  { block: lineblock, color: "green" },
  { block: minorlineblock, color: "lightyellow" },
  { block: leftflashblock, color: "blue" },
  { block: rightflashblock, color: "brown" },
  { block: hillblock, color: "cyan" },
  { block: bigblock, color: "purple" },
  { block: jaggedblock, color: "grey" },
  { block: bigleftblock, color: "lightgreen" },
  { block: bigrightblock, color: "pink" },
];

export const playMode: any[] = [
  {
    mode: gameTypeEnum.Classic,
    blocks: [0, 1, 2, 3, 5, 6, 7],
  },
  {
    mode: gameTypeEnum.Advanced,
    blocks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    mode: gameTypeEnum.Custom,
    blocks: [0, 1, 2, 3],
  },
  {
    mode: gameTypeEnum.Custom,
    blocks: [0],
  },
];

export const emptyWallBrick: number = -1;
export const initWallPropability: number = 0.2;
export const initWallRandomColor: boolean = true;
export const initWallColor: number = 4;
