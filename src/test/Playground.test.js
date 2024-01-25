// Testing singelton instance of playground
import playGroundModel from "../model/playground";

test("tetris playground activeBlock spinPosition", () => {
  const pg = new playGroundModel();
  const pos = pg.activeBlock.spinPosition;
  expect(pos).toEqual(1);
});

test("tetris playground wall height", () => {
  const pg = new playGroundModel();
  const w = pg.wall;
  expect(w.numRows).toEqual(14);
  expect(w.numColumns).toEqual(10);
});
