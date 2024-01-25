// Testing wall
import wall from "../model/wall";

const col = 5;
const row = 5;

const w = new wall({
  numColumns: col,
  numRows: row,
  initWallHeight: 1,
});

test("tetris wall height", () => {
  // Arrange
  // Act
  // Assert
  expect(w.numRows).toEqual(col);
  expect(w.numColumns).toEqual(row);
});

test("tetris wall initWall", () => {
  let myWall = w.initWall(col, row, 2);
  myWall.includes();
});
