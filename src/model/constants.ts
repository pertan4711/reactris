// import bigblock from "./blocks/bigblock";
// import jaggedblock from "./blocks/jaggedblock";
// import leftblock from "./blocks/leftblock";
// import leftflashblock from "./blocks/leftflashblock";
// import lineblock from "./blocks/lineblock";
// import minorlineblock from "./blocks/minorlineblock";
// import rightblock from "./blocks/rightblock";
// import rightflashblock from "./blocks/rightflashblock";
// import squareblock from "./blocks/squareblock";
// import hillblock from "./blocks/hillblock";
// import { gameTypeEnum } from "./modeltypes";
// import bigleftblock from "./blocks/bigleftblock";
// import bigrightblock from "./blocks/bigrightblock";
import { gameTypeEnum } from "../model/modeltypes";

export const blocks: {
  block: any;
  color: string;
  mySpinpos: { pX: number; pY: number }[][];
}[] = [
  {
    block: "leftblock",
    color: "red",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 0, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 1, pY: 1 },
        { pX: 1, pY: 2 },
      ],
      [
        { pX: 2, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 0, pY: 2 },
        { pX: 1, pY: 2 },
      ],
    ],
  },
  {
    block: "rightblock",
    color: "orange",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 1, pY: 0 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
        { pX: 1, pY: 2 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 0, pY: 2 },
      ],
    ],
  },
  {
    block: "squareblock",
    color: "yellow",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
      ],
    ],
  },
  {
    block: "lineblock",
    color: "green",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 3, pY: 0 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 0, pY: 2 },
        { pX: 0, pY: 3 },
      ],
    ],
  },
  {
    block: "minorlineblock",
    color: "lightyellow",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 0, pY: 2 },
      ],
    ],
  },
  {
    block: "leftflashblock",
    color: "blue",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
      ],
    ],
  },
  {
    block: "rightflashblock",
    color: "brown",
    mySpinpos: [
      [
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 1, pY: 2 },
      ],
    ],
  },
  {
    block: "hillblock",
    color: "cyan",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 1, pY: 1 },
      ],
      [
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 1, pY: 2 },
      ],
      [
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
      ],
    ],
  },
  {
    block: "bigblock",
    color: "purple",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
        { pX: 1, pY: 2 },
      ],
    ],
  },
  {
    block: "jaggedblock",
    color: "grey",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 2 },
      ],
      [
        { pX: 2, pY: 0 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
      ],
    ],
  },
  {
    block: "bigleftblock",
    color: "lightgreen",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 1, pY: 2 },
      ],
      [
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
        { pX: 1, pY: 2 },
      ],
    ],
  },
  {
    block: "bigrightblock",
    color: "pink",
    mySpinpos: [
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 2, pY: 0 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
        { pX: 1, pY: 2 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 2, pY: 1 },
      ],
      [
        { pX: 0, pY: 0 },
        { pX: 1, pY: 0 },
        { pX: 0, pY: 1 },
        { pX: 1, pY: 1 },
        { pX: 0, pY: 2 },
      ],
    ],
  },
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
