import playGroundModel from "../src/playground";
import lineblock from "../src/blocks/lineblock";
import { blocks, playMode, intervalForLevel } from "../src/constants";
import { gameStatusEnum } from "../src/modeltypes";
import { alwaysSquare, seeded, settings } from "./helpers";

const newGame = (overrides = {}, random: () => number = seeded(1)) => {
  const pg = new playGroundModel(settings(overrides), random);
  pg.reset();
  return pg;
};

describe("setup", () => {
  test("new block spawns with spin position 1 at the top", () => {
    const pg = newGame();
    expect(pg.activeBlock.spinPosition).toEqual(1);
    expect(pg.activeBlock.pY).toEqual(0);
  });

  test("board has the configured size", () => {
    const pg = newGame({ numColumns: 12, numRows: 16 });
    expect(pg.numColumns).toEqual(12);
    expect(pg.numRows).toEqual(16);
    expect(pg.getGameStatus()).toEqual(gameStatusEnum.Ongoing);
  });

  test("instances are independent", () => {
    const a = newGame();
    const b = newGame({ numColumns: 6 });
    a.tick();
    expect(b.activeBlock.pY).toEqual(0);
    expect(a.numColumns).toEqual(10);
  });

  test("same seed gives the same piece sequence", () => {
    const sequence = (seed: number) => {
      const pg = newGame({ gameType: 1 }, seeded(seed));
      return Array.from({ length: 20 }, () => pg.generateBlock().blockIndex);
    };
    expect(sequence(42)).toEqual(sequence(42));
  });
});

describe("piece generation", () => {
  test.each(playMode.map((m, i) => [m.name, i] as const))(
    "%s mode only creates its own pieces with matching index",
    (_name, gameType) => {
      const pg = newGame({ gameType });
      for (let i = 0; i < 200; i++) {
        const b = pg.generateBlock();
        expect(playMode[gameType].blocks).toContain(b.blockIndex);
        expect(b).toBeInstanceOf(blocks[b.blockIndex].block);
      }
    }
  );
});

describe("movement", () => {
  test("tryMove stops at the side walls", () => {
    const pg = newGame({}, alwaysSquare);
    for (let i = 0; i < 20; i++) pg.tryMove(-1);
    expect(Math.min(...pg.activeBlock.getBrickPosition().map((b) => b.pX))).toEqual(0);
    for (let i = 0; i < 20; i++) pg.tryMove(1);
    expect(Math.max(...pg.activeBlock.getBrickPosition().map((b) => b.pX))).toEqual(9);
  });

  test("tryMove is blocked by wall bricks", () => {
    const pg = newGame({}, alwaysSquare);
    pg.wall.wall[0][7] = 0;
    expect(pg.tryMove(1)).toBe(false);
    expect(pg.activeBlock.pX).toEqual(5);
  });

  test("rotating next to the edge nudges the block inside", () => {
    const pg = newGame();
    pg.activeBlock = new lineblock({ blockIndex: 3, pX: 9, pY: 5, spinPosition: 1 });
    expect(pg.tryRotate("right")).toBe(true);
    pg.updateGame();
    const xs = pg.activeBlock.getBrickPosition().map((b) => b.pX);
    expect(Math.max(...xs)).toEqual(9);
    expect(Math.min(...xs)).toEqual(6);
    expect(pg.getWall().every((row) => row.length === 10)).toBe(true);
  });

  test("rotating into wall bricks is undone", () => {
    const pg = newGame();
    pg.wall.wall[6][5] = 0;
    pg.activeBlock = new lineblock({ blockIndex: 3, pX: 4, pY: 6, spinPosition: 1 });
    expect(pg.tryRotate("right")).toBe(false);
    expect(pg.activeBlock.spinPosition).toEqual(1);
    expect(pg.activeBlock.pX).toEqual(4);
  });

  test("nothing moves while paused", () => {
    const pg = newGame({}, alwaysSquare);
    pg.pause = true;
    pg.tick();
    pg.softDrop();
    expect(pg.tryMove(1)).toBe(false);
    expect(pg.tryRotate("left")).toBe(false);
    expect(pg.activeBlock.pY).toEqual(0);
    expect(pg.activeBlock.pX).toEqual(5);
  });
});

describe("game loop", () => {
  test("a block falls and lands on the floor", () => {
    const pg = newGame({}, alwaysSquare);
    for (let i = 0; i < 19; i++) pg.tick();
    const w = pg.getWall();
    expect([w[18][5], w[18][6], w[19][5], w[19][6]]).toEqual([2, 2, 2, 2]);
    expect(pg.activeBlock.pY).toEqual(0);
  });

  test("completing a row scores and clears it", () => {
    const pg = newGame({}, alwaysSquare);
    pg.wall.wall[19] = [0, 0, 0, 0, 0, -1, -1, 0, 0, 0];
    for (let i = 0; i < 19; i++) pg.tick();
    expect(pg.score).toEqual(1);
    expect(pg.getWall()[19]).toEqual([-1, -1, -1, -1, -1, 2, 2, -1, -1, -1]);
  });

  test("level follows score and levelUpgradeDiv", () => {
    const pg = newGame({ levelUpgradeDiv: 2 });
    pg.score = 5;
    pg.updateGame();
    expect(pg.level).toEqual(3);
  });

  test("game over when a new block cannot spawn, then ticks do nothing", () => {
    const pg = newGame({}, alwaysSquare);
    pg.wall.wall[2][5] = 0;
    pg.tick();
    pg.tick();
    expect(pg.gameover).toBe(true);
    expect(pg.getGameStatus()).toEqual(gameStatusEnum.GameOver);
    const before = JSON.stringify(pg.getWall());
    pg.tick();
    expect(JSON.stringify(pg.getWall())).toEqual(before);
  });

  test("reset starts a fresh game", () => {
    const pg = newGame({}, alwaysSquare);
    pg.score = 9;
    pg.wall.wall[19][0] = 0;
    pg.gameover = true;
    pg.reset();
    expect(pg.gameover).toBe(false);
    expect(pg.score).toEqual(0);
    expect(pg.level).toEqual(1);
    expect(pg.getWall().flat().every((b) => b === -1)).toBe(true);
  });
});

describe("configure", () => {
  test("applies new settings to an existing game", () => {
    const pg = newGame({ numColumns: 10, numRows: 20, gameType: 0 });
    pg.configure(settings({ numColumns: 8, numRows: 12, gameType: 3, levelUpgradeDiv: 5 }));
    pg.reset();
    expect(pg.numColumns).toEqual(8);
    expect(pg.numRows).toEqual(12);
    expect(pg.getWall().length).toEqual(12);
    expect(pg.levelUpgradeDiv).toEqual(5);
    expect(pg.activeBlock.blockIndex).toEqual(playMode[3].blocks[0]);
    expect(pg.nextActive.blockIndex).toEqual(playMode[3].blocks[0]);
  });
});

test("intervalForLevel gets faster and bottoms out at 400ms", () => {
  expect(intervalForLevel(1)).toEqual(1000);
  expect(intervalForLevel(3)).toEqual(700);
  expect(intervalForLevel(6)).toEqual(400);
  expect(intervalForLevel(50)).toEqual(400);
});
