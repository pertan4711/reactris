import { blockModelType, brickModelType } from "./modeltypes";
import { Blocks } from "./constants";

// All blocks inherit from this one containing functionality to spin or move
export default abstract class Block {
  blockIndex: number;
  pX: number;
  pY: number;
  spinPosition: number;
  bricks: brickModelType[];

  constructor(blockProps: blockModelType) {
    this.blockIndex = blockProps.blockIndex;
    this.pX = blockProps.pX;
    this.pY = blockProps.pY;
    this.spinPosition = blockProps.spinPosition;
    this.bricks = [];
  }

  // Has to be implemented by specific block
  abstract getBrickPosition(): { pX: number; pY: number }[];

  turnLeft() {
    if (this.spinPosition >= 1) this.spinPosition--;
    else this.spinPosition = 3;
  }

  turnRight() {
    if (this.spinPosition <= 2) this.spinPosition++;
    else this.spinPosition = 0;
  }

  moveLeft() {
    this.pX--;
  }

  moveRight() {
    this.pX++;
  }

  moveDown() {
    this.pY++;
  }

  getBlockColor = () => {
    return Blocks[this.blockIndex].color;
  };
}
