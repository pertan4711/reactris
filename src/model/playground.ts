import wall from "./wall";
import { blockModelType, gameStatusEnum } from "./modeltypes";
import block from "./block";
import { blocks, emptyWallBrick, playMode } from "./constants";

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
  level: number;
  activeBlock: block;
  nextActive: block;
  gameType: number;
  initWallHeight: number;
  initWallPropability: number;
  levelUpgradeDiv: number;

  private constructor(
    numColumns: number,
    numRows: number,
    gameType: number,
    initWallHeight: number,
    initWallPropability: number,
    levelUpgradeDiv: number
  ) {
    this.gameover = true;
    this.pause = false;
    this.gameType = gameType;
    this.initWallHeight = initWallHeight;
    this.initWallPropability = initWallPropability;
    this.levelUpgradeDiv = levelUpgradeDiv;

    this.wall = new wall({
      numColumns: numColumns,
      numRows: numRows,
      initWallHeight: initWallHeight,
      initWallPropability: initWallPropability,
    });
    this.score = 0;
    this.level = 1;
    this.activeBlock = this.generateBlock();
    this.nextActive = this.generateBlock();
  }

  // Singleton playground
  public static getInstance(
    numColumns: number,
    numRows: number,
    gameType: number,
    initWallHeight: number,
    initWallPropability: number,
    levelUpgradeDiv: number
  ): playGroundModel {
    if (!playGroundModel.instance) {
      playGroundModel.instance = new playGroundModel(
        numColumns,
        numRows,
        gameType,
        initWallHeight,
        initWallPropability,
        levelUpgradeDiv
      );
    }

    return playGroundModel.instance;
  }

  /// Randomize next block and put it in the middle
  generateBlock(): block {
    let differentBlocksCount = playMode[this.gameType].blocks.length;
    let blockIndex = Math.floor(Math.random() * differentBlocksCount);
    let realBlockIndex = playMode[this.gameType].blocks[blockIndex];
    let mybl: any = blocks[realBlockIndex].block;
    let xpos: number = Math.floor(this.numColumns / 2);
    let blockProps: blockModelType = {
      blockIndex,
      pX: xpos,
      pY: 0,
      spinPosition: 1,
      mySpinPosition: mybl.mySpinpos,
    };
    let ab = new block(blockProps);

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
    return Math.floor(this.score / this.levelUpgradeDiv) + 1;
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
