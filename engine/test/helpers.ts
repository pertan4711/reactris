import { playgroundSettingsType } from "../src/modeltypes";

/// Small deterministic PRNG (mulberry32) so tests can reproduce a game
export function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const settings = (
  overrides: Partial<playgroundSettingsType> = {}
): playgroundSettingsType => ({
  numColumns: 10,
  numRows: 20,
  gameType: 0,
  initWallHeight: 0,
  initWallPropability: 0.5,
  levelUpgradeDiv: 2,
  ...overrides,
});

/// In Classic mode (7 pieces) this always picks the square block (index 2)
export const alwaysSquare = () => 0.35;
