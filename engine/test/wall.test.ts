import wall from "../src/wall";
import { emptyWallBrick } from "../src/constants";

const E = emptyWallBrick;

const emptyWall = (numColumns: number, numRows: number) =>
  new wall({ numColumns, numRows, initWallHeight: 0, initWallPropability: 0 });

test("wall has the requested size", () => {
  const w = new wall({ numColumns: 6, numRows: 8, initWallHeight: 1, initWallPropability: 0.5 });
  expect(w.numColumns).toEqual(6);
  expect(w.numRows).toEqual(8);
  expect(w.getWall().length).toEqual(8);
  expect(w.getWall().every((row) => row.length === 6)).toBe(true);
});

test("initWall fills only the bottom rows", () => {
  const w = new wall({
    numColumns: 5,
    numRows: 5,
    initWallHeight: 2,
    initWallPropability: 0.2,
    random: () => 0.5,
  });
  const rows = w.getWall();
  expect(rows.slice(0, 3).flat().every((b) => b === E)).toBe(true);
  expect(rows.slice(3).flat().every((b) => b !== E)).toBe(true);
});

test("a completed row is removed and rows above move down", () => {
  const w = emptyWall(3, 3);
  w.wall = [
    [1, E, E],
    [E, 4, E],
    [2, 2, 2],
  ];
  expect(w.check4CompletedRows()).toEqual(1);
  expect(w.getWall()).toEqual([
    [E, E, E],
    [1, E, E],
    [E, 4, E],
  ]);
});

test("two completed rows are both removed", () => {
  const w = emptyWall(2, 4);
  w.wall = [
    [E, E],
    [3, E],
    [1, 1],
    [2, 2],
  ];
  expect(w.check4CompletedRows()).toEqual(2);
  expect(w.getWall()).toEqual([
    [E, E],
    [E, E],
    [E, E],
    [3, E],
  ]);
});

test("addRow adds an empty row on top and deleteRow keeps numRows in sync", () => {
  const w = emptyWall(3, 3);
  w.wall[2] = [1, 1, E];
  w.addRow();
  expect(w.numRows).toEqual(4);
  expect(w.getWall()[0]).toEqual([E, E, E]);
  expect(w.getWall()[3]).toEqual([1, 1, E]);
  w.deleteRow();
  expect(w.numRows).toEqual(3);
  expect(w.getWall().length).toEqual(3);
  expect(w.getWall()[2]).toEqual([1, 1, E]);
});

test("setRows keeps the bottom of the wall", () => {
  const w = emptyWall(2, 3);
  w.wall[2] = [5, 5];
  w.setRows(5);
  expect(w.getWall().length).toEqual(5);
  expect(w.getWall()[4]).toEqual([5, 5]);
});
