// Testar modellen
import React from "react";
import { render } from "@testing-library/react";
import Tetris from "../components/TetrisApp";
import leftBlock from "../model/blocks/leftblock";
import playground from "../model/playground";

initLeftBlock = () => {};

test("sum", () => {
  expect(1 + 2).toBe(3);
});

// Kontrollera blockets startposition
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

// Kontrollera blockets 'bricks' och deras position
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

test("tetris playground activeBlock spinPosition", () => {
  const pg = new playground();
  const pos = pg.activeBlock.spinPosition;
  expect(pos).toEqual(1);
});

test("tetris playground wall height", () => {
  const pg = new playground();
  const w = pg.wall;
  expect(w.numRows).toEqual(14);
  expect(w.numColumns).toEqual(10);
});
