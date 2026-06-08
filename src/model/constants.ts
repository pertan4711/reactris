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
  { block: leftblock, color: "#3498DB" },
  { block: rightblock, color: "#E67E22" },
  { block: squareblock, color: "#F1C40F" },
  { block: lineblock, color: "#00CEC9" },
  { block: minorlineblock, color: "#FDCB6E" },
  { block: leftflashblock, color: "#E74C3C" },
  { block: rightflashblock, color: "#2ECC71" },
  { block: hillblock, color: "#9B59B6" },
  { block: bigblock, color: "#8E44AD" },
  { block: jaggedblock, color: "#74B9FF" },
  { block: bigleftblock, color: "#55EFC4" },
  { block: bigrightblock, color: "#FD79A8" },
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
