import wall from "./wall";
import {
  blockModelType,
  gameStatusEnum,
  playgroundSettingsType,
} from "./modeltypes";
import block from "./block";
import { blocks, emptyWallBrick, playMode } from "./constants";

/////////////////////////////////////////////////////////////////////////////////////
/// Playground is the model in the MVP design pattern and will keep track of the built
/// wall and one active block. It will contain methods to update the active block and the wall,
/// increment time, initialize, randomize next block and check if the active block has landed.
/////////////////////////////////////////////////////////////////////////////////////
export default class playGroundModel {
  gameover: boolean;
  pause: boolean;
  wall: wall;
  score: number;
  level: number;
  activeBlock: block;
  nextActive: block;
  gameType: number;
  initWallHeight: number;
  initWallPropability: number;
  levelUpgradeDiv: number;
  random: () => number;

  /// `random` can be replaced with a seeded generator to make games reproducible
  constructor(
    settings: playgroundSettingsType,
    random: () => number = Math.random
  ) {
    this.random = random;
    this.gameover = true;
    this.pause = false;
    this.gameType = settings.gameType;
    this.initWallHeight = settings.initWallHeight;
    this.initWallPropability = settings.initWallPropability;
    this.levelUpgradeDiv = settings.levelUpgradeDiv;

    this.wall = new wall({
      numColumns: settings.numColumns,
      numRows: settings.numRows,
      initWallHeight: settings.initWallHeight,
      initWallPropability: settings.initWallPropability,
      random,
    });
    this.score = 0;
    this.level = 1;
    this.activeBlock = this.generateBlock();
    this.nextActive = this.generateBlock();
  }

  /// Apply new settings mid-game. Wall height and probability take effect on next reset().
  configure = (settings: playgroundSettingsType) => {
    if (this.numColumns !== settings.numColumns) {
      this.numColumns = settings.numColumns;
    }
    if (this.numRows !== settings.numRows) {
      this.numRows = settings.numRows;
    }
    this.initWallHeight = settings.initWallHeight;
    this.initWallPropability = settings.initWallPropability;
    this.wall.initWallPropability = settings.initWallPropability;
    this.levelUpgradeDiv = settings.levelUpgradeDiv;
    if (this.gameType !== settings.gameType) {
      this.gameType = settings.gameType;
      // Refresh the upcoming block so the new mode applies to the preview
      this.nextActive = this.generateBlock();
    }
  };

  /// Randomize next block and put it in the middle
  generateBlock(): block {
    let differentBlocksCount = playMode[this.gameType].blocks.length;
    let modeIndex = Math.floor(this.random() * differentBlocksCount);
    let realBlockIndex = playMode[this.gameType].blocks[modeIndex];
    let mybl: any = blocks[realBlockIndex].block;
    let xpos: number = Math.floor(this.numColumns / 2);
    let blockProps: blockModelType = {
      blockIndex: realBlockIndex,
      pX: xpos,
      pY: 0,
      spinPosition: 1,
    };
    let ab = new mybl(blockProps);

    return ab;
  }

  /// Move the active block down
  incTime = () => {
    if (this.activeBlock !== null) {
      this.activeBlock.pY++;
    } else {
      this.activeBlock = this.nextActive;
      this.nextActive = this.generateBlock();
    }
  };

  /// One game step: move the active block down and land it if needed
  tick = () => {
    if (this.gameover || this.pause) return;
    this.incTime();
    this.updateGame();
  };

  softDrop = () => {
    this.tick();
  };

  /// Move the active block sideways; undone if it would collide
  tryMove = (dx: -1 | 1): boolean => {
    if (this.gameover || this.pause) return false;
    this.activeBlock.pX += dx;
    if (this.checkBlockPosition()) {
      this.activeBlock.pX -= dx;
      return false;
    }
    return true;
  };

  /// Reset and start game
  reset = () => {
    this.gameover = false;
    this.pause = false;
    this.score = 0;
    this.level = 1;
    this.wall.reset(this.initWallHeight);
    this.activeBlock.pY = 0;
    this.activeBlock = this.generateBlock();
    this.nextActive = this.generateBlock();
  };

  getWall = (): number[][] => {
    return this.wall.getWall();
  };

  updateGame = () => {
    if (this.gameover) return;
    this.updateBlockWall();
    /// If block has landed - update score and randomize next active block
    this.score = this.score + this.wall.check4CompletedRows();
    this.level = this.calcLevel();
  };

  /// Check if block has landed after update or MoveDown.
  updateBlockWall = () => {
    // If block is outside boudaries
    this.adjustBlockWallPosition();

    // If block has landed put it in the wall
    if (this.checkBlockPosition()) {
      // If bricks have the same postition - move block up and put in the wall
      this.activeBlock.pY--;
      this.wall.addBlock(this.activeBlock);
      this.activeBlock = this.nextActive;
      this.nextActive = this.generateBlock();
      //console.log("block landed on wall");

      // If next randomized block collides it is game over
      if (this.checkBlockPosition()) {
        this.gameover = true;
      }
    }
  };

  // Check wall and active block for overlaps
  checkBlockPosition = (): boolean => {
    let bricks: {
      pX: number;
      pY: number;
    }[] = this.activeBlock.getBrickPosition();
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (
        brick.pX < 0 ||
        brick.pX >= this.numColumns ||
        brick.pY >= this.numRows ||
        (brick.pY >= 0 &&
          this.wall.getWall()[brick.pY][brick.pX] !== emptyWallBrick)
      ) {
        return true;
      }
    }
    return false;
  };

  /// Rotate the active block, nudging it inside the side edges. If it still
  /// collides with the wall or floor, the rotation is undone.
  tryRotate = (direction: "left" | "right"): boolean => {
    if (this.gameover || this.pause) return false;
    const oldX = this.activeBlock.pX;
    const oldSpin = this.activeBlock.spinPosition;
    if (direction === "left") this.activeBlock.turnLeft();
    else this.activeBlock.turnRight();
    this.adjustBlockWallPosition();
    if (this.checkBlockPosition()) {
      this.activeBlock.pX = oldX;
      this.activeBlock.spinPosition = oldSpin;
      return false;
    }
    return true;
  };

  calcLevel = () => {
    return Math.floor(this.score / this.levelUpgradeDiv) + 1;
  };

  // Check playground edges
  adjustBlockWallPosition = () => {
    let bricks = this.activeBlock.getBrickPosition();
    const minX = Math.min(...bricks.map((b) => b.pX));
    const maxX = Math.max(...bricks.map((b) => b.pX));
    if (minX < 0) {
      this.activeBlock.pX -= minX;
    } else if (maxX > this.numColumns - 1) {
      this.activeBlock.pX -= maxX - (this.numColumns - 1);
    }
  };

  get numColumns() {
    return this.wall.numColumns;
  }
  set numColumns(col: number) {
    this.wall.setColumn(col);
  }

  addColumn = () => {
    this.wall.addColumn();
  };

  deleteColumn = () => {
    this.wall.deleteColumn();
  };

  get numRows() {
    return this.wall.numRows;
  }
  set numRows(rows: number) {
    this.wall.setRows(rows);
  }

  addRow = () => {
    this.wall.addRow();
  };

  deleteRow = () => {
    this.wall.deleteRow();
  };

  getGameStatus = () => {
    if (this.gameover) {
      return gameStatusEnum.GameOver;
    } else if (this.pause) {
      return gameStatusEnum.Pause;
    } else {
      return gameStatusEnum.Ongoing;
    }
  };

  printConfig = () => {
    console.log("\nReactris settings\n=================");
    console.log("numColumns: " + this.numColumns);
    console.log("numRows: " + this.numRows);
    console.log(
      "activeBlock: { " +
        this.activeBlock.constructor.name +
        ", " +
        this.activeBlock.getBlockColor() +
        ", " +
        this.activeBlock.spinPosition +
        " } bricks:"
    );
    console.log(...this.activeBlock.getBrickPosition());
    console.log(
      "gameover: " +
        this.gameover +
        "  pause: " +
        this.pause +
        "  level: " +
        this.level +
        "  score: " +
        this.score
    );
    console.log("initWallHeight: " + this.initWallHeight);
    let wall = this.getWall();
    console.log("wall: ");
    wall.forEach((row) => {
      console.log("row :" + row);
    });
  };
}
