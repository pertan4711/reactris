import { gameSettingsType } from "../model/modeltypes";

const KEY = 'reactris_settings_v1';

export type PersistedSettings = Pick<
  gameSettingsType,
  'numColumns' | 'numRows' | 'gameType' | 'initWallHeight' | 'levelUpgradeDiv' | 'initWallPropability'
>;

export function loadSettings(): Partial<PersistedSettings> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveSettings(s: gameSettingsType): void {
  const toSave: PersistedSettings = {
    numColumns: s.numColumns,
    numRows: s.numRows,
    gameType: s.gameType,
    initWallHeight: s.initWallHeight,
    levelUpgradeDiv: s.levelUpgradeDiv,
    initWallPropability: s.initWallPropability,
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(toSave));
  } catch {
    /* ignore quota / private-mode failures */
  }
}
