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
import { playgroundSettingsType } from "./modeltypes";
import bigleftblock from "./blocks/bigleftblock";
import bigrightblock from "./blocks/bigrightblock";

export const Blocks: { block: any; color: string }[] = [
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

export const playgroundSettings: playgroundSettingsType = {
  numColumns: 10,
  numRows: 14,
  initWallHeight: 4,
};

export const emptyWallBrick: number = -1;
export const initWallPropability: number = 0.2;
export const initWallRandomColor: boolean = true;
export const initWallColor: number = 4;
