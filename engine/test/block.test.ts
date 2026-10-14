// Import through the package entry: block.ts and constants.ts import each
// other, and only the index loads them in a working order.
import { leftblock, blocks } from "../src";

const makeBlock = () =>
  new leftblock({ blockIndex: 0, pX: 5, pY: 3, spinPosition: 2 });

test("block keeps its start position", () => {
  const block = makeBlock();
  expect(block.pX).toEqual(5);
  expect(block.pY).toEqual(3);
});

test("leftblock brick positions", () => {
  expect(makeBlock().getBrickPosition()).toEqual([
    { pX: 7, pY: 3 },
    { pX: 5, pY: 4 },
    { pX: 6, pY: 4 },
    { pX: 7, pY: 4 },
  ]);
});

test("moveLeft and moveDown shift all bricks", () => {
  const block = makeBlock();
  block.moveLeft();
  block.moveDown();
  expect(block.getBrickPosition()).toEqual([
    { pX: 6, pY: 4 },
    { pX: 4, pY: 5 },
    { pX: 5, pY: 5 },
    { pX: 6, pY: 5 },
  ]);
});

test("block colour comes from the blocks table", () => {
  expect(makeBlock().getBlockColor()).toEqual(blocks[0].color);
});

test("turnLeft and turnRight wrap around", () => {
  const block = new leftblock({ blockIndex: 0, pX: 0, pY: 0, spinPosition: 0 });
  block.turnLeft();
  expect(block.spinPosition).toEqual(3);
  block.turnRight();
  expect(block.spinPosition).toEqual(0);
});
