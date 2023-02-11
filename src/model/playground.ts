import wall from "./wall";
import { blockModelType } from "./modeltypes";
import Block from "./block";
import { Blocks, emptyWallBrick, playgroundSettings } from "./constants";
import calculateBrickSize from "../utils/utils";

/////////////////////////////////////////////////////////////////////////////////////
/// Playground är modellen i MVP designpattern och håller reda på den uppbyggda
/// muren och ett aktivt block. Den håller metoder för att uppdatera activeblock och wall,
/// inkrementera tiden, initiera sig, slumpa nästa block och kontrollera om det
/// aktiva blocket har landat.
/////////////////////////////////////////////////////////////////////////////////////
export default class playground {
  private static instance: playground; // Singleton
  gameover: boolean;
  pause: boolean;
  wall: wall;
  score: number;
  level: number;
  activeBlock: Block;
  initWallHeight: number;
  
  brickSize: number;
  brickSpace: number;
  windowSizeX: number;
  windowSizeY: number;

  private constructor(winX: number, winY: number) {
    this.gameover = true;
    this.pause = false;
    this.wall = new wall({
      numColumns: playgroundSettings.numColumns,
      numRows: playgroundSettings.numRows,
      initWallHeight: playgroundSettings.initWallHeight,
    });
    this.score = 0;
    this.level = 0;
    this.activeBlock = this.generateNextBlock();
    this.initWallHeight = playgroundSettings.initWallHeight;
    
    this.brickSize = calculateBrickSize(winX, winY, this.numColumns, this.numRows);
    this.brickSpace = calculateBrickSize(winX, winY, this.numColumns, this.numRows) + 2;
    this.windowSizeX = winX;
    this.windowSizeY = winY;
  }

  // Singleton playground
  public static getInstance(winX: number, winY: number): playground {
    if (!playground.instance) {
      playground.instance = new playground(winX, winY);
    }

    return playground.instance;
  }

  /// Slumpa nästa block och placera det ungefär i mitten
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

  /// Förflytta det aktiva blocket nedåt.
  incTime = () => {
    this.activeBlock !== null
      ? this.activeBlock.pY++
      : (this.activeBlock = this.generateNextBlock());
  };

  // Gör reset och starta om spelet
  reset = () => {
    this.gameover = false;
    this.score = 0;
    this.activeBlock = this.generateNextBlock();
    this.wall.reset(this.initWallHeight);
    this.activeBlock.pY = 0;
  };

  getWall = (): number[][] => {
    return this.wall.getWall();
  };

  /// Kontrollerar om block landat efter en update eller MoveDown.
  /// Om block landat, uppdatera poäng och slumpa fram nästa aktiva block.
  updateBlockWallStatus = () => {
    // Om block utanför boundaries
    this.adjustBlockWallPosition();

    // Om block landat lägg till det i muren
    if (this.checkBlockPosition()) {
      // Om bricks har samma position - flytta nuvarande block uppåt och lägg till det i muren
      this.activeBlock.pY--;
      this.wall.addBlock(this.activeBlock);
      this.activeBlock = this.generateNextBlock();

      // Om nästa slumpade block kolliderar är spelet slut
      if (this.checkBlockPosition()) {
        this.gameover = true;
      }
    }
    this.score = this.score + this.wall.check4CompletedRows();
  };

  // Kontrollera muren och activeblock om överlappning sker
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

  // Kontrollera spelplanens sidor
  adjustBlockWallPosition = () => {
    let bricks = this.activeBlock.getBrickPosition();
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (brick.pX < 0) {
        this.activeBlock.pX++;
        break;
      }
      if (brick.pX > this.numColumns - 1) {
        this.activeBlock.pX--;
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
  }

  deleteColumn = () => {
    this.numColumns--;
    this.wall.deleteColumn();
  }

  get numRows() {
    return this.wall.numRows;
  }
  set numRows(rows: number) {
    this.wall.setRows(rows);
  }

  addRow = () => {
    this.numRows++;
    this.wall.addRow();
  }

  deleteRow = () => {
    this.numRows--;
    this.wall.deleteRow();
  }

  printConfig = () => {
    console.log("Playground model settings\n=========================");
    console.log("numColumns: " + this.numColumns);
    console.log("numRows: " + this.numRows);
    console.log("activeBlock: { color: " + this.activeBlock.getBlockColor() + ", " + this.activeBlock.getBrickPosition() + " }");
    console.log(" bricks:");
    console.log(...this.activeBlock.getBrickPosition());
    console.log("gameover: " + this.gameover);
    console.log("pause: " + this.pause);
    console.log("initWallHeight: " + this.initWallHeight);
    console.log("wall:" + this.getWall());
  };
}
