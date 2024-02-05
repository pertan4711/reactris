import wall from "./wall";
import { blockModelType, gameSettingsType, gameStatusEnum } from "./modeltypes";
import Block from "./block";
import { Blocks, emptyWallBrick } from "./constants";
import calculateBrickSize from "../utils/utils";

/////////////////////////////////////////////////////////////////////////////////////
/// Playground is the model in the MVP design pattern and will keep track of the built
/// wall and one active block. It will contain methods to update the active block and the wall,
/// increment time, initialize, randomize next block and check if the active block has landed.
/////////////////////////////////////////////////////////////////////////////////////
export default class playGroundModel {
  private static instance: playGroundModel; // Singleton
  gameover: boolean;
  pause: boolean;
  wall: wall;
  score: number;
  lastScore: number;
  level: number;
  activeBlock: Block;

  // brickSize: number;
  // brickSpace: number;
  // initWallHeight: number;
  gameSettings: gameSettingsType;

  windowSizeX: number;
  windowSizeY: number;

  private constructor(
    winX: number,
    winY: number,
    gameSettings: gameSettingsType
  ) {
    this.gameover = true;
    this.pause = false;
    this.wall = new wall({
      numColumns: gameSettings.numColumns,
      numRows: gameSettings.numRows,
      initWallHeight: gameSettings.initWallHeight,
    });
    this.score = 0;
    this.lastScore = 0;
    this.level = 0;
    this.activeBlock = this.generateNextBlock();
    //this.initWallHeight = gameSettings.initWallHeight;
    this.gameSettings = gameSettings;

    this.gameSettings.brickSize = calculateBrickSize(
      winX,
      winY,
      this.numColumns,
      this.numRows
    );
    this.gameSettings.brickSpace =
      calculateBrickSize(winX, winY, this.numColumns, this.numRows) + 2;
    this.windowSizeX = winX;
    this.windowSizeY = winY;
  }

  // Singleton playground
  public static getInstance(
    winX: number,
    winY: number,
    gameSettings: gameSettingsType
  ): playGroundModel {
    if (!playGroundModel.instance) {
      playGroundModel.instance = new playGroundModel(winX, winY, gameSettings);
    }

    return playGroundModel.instance;
  }

  /// Randomize next block and put it in the middle
  generateNextBlock(): Block {
    let differentBlocksCount = Blocks.length;
    let blockIndex = Math.floor(Math.random() * differentBlocksCount);
    let mybl: any = Blocks[blockIndex].block;
    let xpos: number = Math.floor(this.numColumns / 2);
    let blockProps: blockModelType = {
      blockIndex,
      pX: xpos,
      pY: 0,
      spinPosition: 1,
    };
    let ab = new mybl(blockProps);

    return ab;
  }

  /// Move the active block down
  incTime = () => {
    this.activeBlock !== null
      ? this.activeBlock.pY++
      : (this.activeBlock = this.generateNextBlock());
  };

  /// Reset and start game
  reset = () => {
    this.gameover = false;
    this.score = 0;
    this.activeBlock = this.generateNextBlock();
    this.wall.reset(this.gameSettings.initWallHeight);
    this.activeBlock.pY = 0;
  };

  getWall = (): number[][] => {
    return this.wall.getWall();
  };

  /// Check if block has landed after update or MoveDown.
  /// If block has landed - update score and randomize next active block-
  updateBlockWallStatus = () => {
    // If block is outside boudaries
    this.adjustBlockWallPosition();

    // If block has landed put it in the wall
    if (this.checkBlockPosition()) {
      // If bricks have the same postition - move block up and put in the wall
      console.log("block collided");
      this.activeBlock.pY--;
      this.wall.addBlock(this.activeBlock);
      this.activeBlock = this.generateNextBlock();

      // If next randomized block collides it is game over
      if (this.checkBlockPosition()) {
        this.gameover = true;
      }
    }
    this.score = this.score + this.wall.check4CompletedRows();
    this.level = this.calcLevel();
  };

  // Check wall and active block for overlaps
  checkBlockPosition = () => {
    let bricks: {
      pX: number;
      pY: number;
    }[] = this.activeBlock.getBrickPosition();
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (
        brick.pY >= this.numRows ||
        this.wall.getWall()[brick.pY][brick.pX] !== emptyWallBrick
      ) {
        return true;
      }
    }
  };

  calcLevel = () => {
    return Math.floor(this.score / this.gameSettings.levelUpgradeDiv);
  };

  // Check playground edges
  adjustBlockWallPosition = () => {
    let bricks = this.activeBlock.getBrickPosition();
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (brick.pX < 0) {
        this.activeBlock.pX++;
        console.log("Brick to far left");
        break;
      }
      if (brick.pX > this.numColumns - 1) {
        this.activeBlock.pX--;
        console.log("Brick to far right");
        break;
      }
    }
  };

  get numColumns() {
    return this.wall.numColumns;
  }
  set numColumns(col: number) {
    this.wall.setColumn(col);
  }

  addColumn = () => {
    this.numColumns++;
    this.wall.addColumn();
  };

  deleteColumn = () => {
    this.numColumns--;
    this.wall.deleteColumn();
  };

  get numRows() {
    return this.wall.numRows;
  }
  set numRows(rows: number) {
    this.wall.setRows(rows);
  }

  addRow = () => {
    this.numRows++;
    this.wall.addRow();
  };

  deleteRow = () => {
    this.numRows--;
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
      "activeBlock: { color: " +
        this.activeBlock.getBlockColor() +
        ", " +
        this.activeBlock.getBrickPosition() +
        " }"
    );
    console.log(" bricks:");
    console.log(...this.activeBlock.getBrickPosition());
    console.log("gameover: " + this.gameover);
    console.log("pause: " + this.pause);
    console.log("level: " + this.level);
    console.log("initWallHeight: " + this.gameSettings.initWallHeight);
    let wall = this.getWall();
    console.log("wall: ");
    wall.forEach((row) => {
      console.log("row :" + row);
    });
  };
}
