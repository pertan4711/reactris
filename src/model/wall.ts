import { wallModelType } from "./modeltypes";
import block from "./block";
import {
  Blocks,
  emptyWallBrick,
  initWallColor,
  initWallPropability,
  initWallRandomColor,
} from "./constants";

export default class wall {
  numColumns: number;
  numRows: number;
  wall: number[][];

  constructor(wall: wallModelType) {
    this.numColumns = wall.numColumns;
    this.numRows = wall.numRows;
    this.wall = this.initWall(
      wall.numColumns,
      wall.numRows,
      wall.initWallHeight
    );
  }

  reset(height: number) {
    this.wall = this.initWall(this.numColumns, this.numRows, height);
  }

  initWall(columns: number, rows: number, height: number) {
    let tempWall = [];

    // Bygg wall som är tom
    for (let y = 0; y < rows - height; y++) {
      let row = [];
      for (let x = 0; x < columns; x++) {
        row.push(emptyWallBrick);
      }
      tempWall.push(row);
    }

    // Bygg wall som har bricks
    for (let y = rows - height + 1; y <= rows; y++) {
      let row = [];
      for (let x = 0; x < columns; x++) {
        Math.random() > initWallPropability
          ? row.push(
              initWallRandomColor
                ? Math.floor(Math.random() * Blocks.length)
                : initWallColor
            )
          : row.push(emptyWallBrick);
      }
      tempWall.push(row);
    }

    return tempWall;
  }

  /// Returnera Wall som en tvådimersionell array där varje position antingen är
  /// -1 som betyder tom eller positiv och är då en brick av typen BlockType med färg mm.
  getWall(): number[][] {
    return this.wall;
  }

  addColumn() {
    this.numColumns++;
    for (let row = 0; row < this.numRows; row++) {
      this.wall[row].push(emptyWallBrick);
    }
  }

  deleteColumn() {
    this.numColumns--;
    for (let row = 0; row < this.numRows; row++) {
      this.wall[row].pop();
    }
  }

  setColumn(col: number) {
    this.numColumns = col;
    let tempWall: number[][] = [];
    for (let y = 0; y < this.numRows; y++) {
      let row = [];
      for (let x = 0; x < col; x++) {
        if (
          this.wall.length >= y &&
          this.wall[y].length >= x &&
          this.wall[y][x] > 0
        ) {
          row.push(this.wall[y][x]);
        } else {
          row.push(emptyWallBrick);
        }
      }
      tempWall.push(row);
    }
    this.wall = tempWall;
  }

  setRows(rows: number) {
    let tempWall: number[][] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        tempWall[y][x] = this.wall[y][x] > 0 ? this.wall[y][x] : emptyWallBrick;
      }
    }
  }

  addRow() {
    let newrow: number[] = [];
    for (let col = 0; col < this.numColumns; col++) {
      newrow.push(emptyWallBrick);
    }
    this.numRows++;
    this.wall.push(newrow);
  }

  deleteRow() {
    this.wall.pop();
  }

  addBlock(block: block) {
    var bricks = block.getBrickPosition();
    bricks.forEach((brick) => {
      this.wall[brick.pY][brick.pX] = block.blockIndex;
    });
  }

  check4CompletedRows(): number {
    let completeRows = 0;
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numColumns; col++) {
        let wallbrick = this.wall[row][col];
        if (wallbrick === emptyWallBrick) {
          break;
        } else {
          if (col >= this.numColumns - 1) {
            // Om vi kommer hit har vi en hel rad. Ta bort raden och inkrementera temp_score.
            this.deleteCompletedRow(row);
            completeRows++;
          }
        }
      }
    }

    return completeRows;
  }

  // Tar bort hela raden och flyttar överliggande rader nedåt
  deleteCompletedRow(rowToDelete: number) {
    for (let row = rowToDelete - 1; row >= 0; row--) {
      for (let col = 0; col < this.numColumns; col++) {
        this.wall[row + 1][col] = this.wall[row][col];
      }
    }
  }
}
