// Testing model
import leftBlock from "../model/blocks/leftblock";

// Check block start position
test("tetris block leftBlock initposition", () => {
  const block = new leftBlock({
    blockIndex: 99,
    pX: 5,
    pY: 3,
    spinPosition: 2,
  });
  expect(block.pX).toEqual(5);
  expect(block.pY).toEqual(3);
});

// Check 'bricks' of block and position
test("tetris block leftBlock bricksposition", () => {
  const block = new leftBlock({
    blockIndex: 99,
    pX: 5,
    pY: 3,
    spinPosition: 2,
  });
  let bricks = block.getBrickPosition();
  expect(bricks.length).toEqual(4);
  expect(bricks).toEqual([
    { pX: 7, pY: 3 },
    { pX: 5, pY: 4 },
    { pX: 6, pY: 4 },
    { pX: 7, pY: 4 },
  ]);
});

test("tetris block leftBlock moveLeft", () => {
  const block = new leftBlock({
    blockIndex: 2, // yellow
    pX: 5,
    pY: 3,
    spinPosition: 2,
  });
  block.moveLeft();
  block.moveDown();
  let bricks = block.getBrickPosition();
  let color = block.getBlockColor();
  expect(bricks).toEqual([
    { pX: 6, pY: 4 },
    { pX: 4, pY: 5 },
    { pX: 5, pY: 5 },
    { pX: 6, pY: 5 },
  ]);
  expect(color).toEqual("yellow");
});
