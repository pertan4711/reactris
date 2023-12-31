// Testing wall
import wall from "../model/wall";

test("tetris wall height", () => {
  // Arrange
  const col = 5;
  const row = 5;

  // Act
  const w = new wall({
    numColumns: col,
    numRows: row,
    initWallHeight: 1,
  });

  // Assert
  expect(w.numRows).toEqual(col);
  expect(w.numColumns).toEqual(row);
});
