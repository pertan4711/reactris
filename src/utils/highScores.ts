export interface HighScoreEntry {
  id: number;
  name: string;
  score: number;
  level: number;
  date: string;
  gameType: number;
  numColumns?: number;
  numRows?: number;
}

type ScoreBuckets = Record<string, HighScoreEntry[]>;

const KEY = 'reactris_highscores_v2';
const LEGACY_KEY = 'reactris_highscores';
const MAX = 10;
const DEFAULT_TYPE = 0;

function loadBuckets(): ScoreBuckets {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as ScoreBuckets;
      }
    }
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as HighScoreEntry[];
      if (Array.isArray(legacy)) {
        const migrated: ScoreBuckets = {
          [DEFAULT_TYPE]: legacy.map(e => ({ ...e, gameType: DEFAULT_TYPE })),
        };
        localStorage.setItem(KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch {
    /* fall through */
  }
  return {};
}

function saveBuckets(buckets: ScoreBuckets): void {
  localStorage.setItem(KEY, JSON.stringify(buckets));
}

export function getHighScores(gameType?: number): HighScoreEntry[] {
  const buckets = loadBuckets();
  if (gameType === undefined) {
    return Object.values(buckets).flat().sort((a, b) => b.score - a.score);
  }
  return buckets[gameType] ?? [];
}

export function qualifiesForHighScore(score: number, gameType: number): boolean {
  if (score <= 0) return false;
  const scores = getHighScores(gameType);
  return scores.length < MAX || score > scores[scores.length - 1].score;
}

export function saveHighScore(
  name: string,
  score: number,
  level: number,
  gameType: number,
  numColumns?: number,
  numRows?: number
): void {
  const buckets = loadBuckets();
  const list = buckets[gameType] ? [...buckets[gameType]] : [];
  list.push({
    id: Date.now(),
    name: name.trim() || 'PLAYER',
    score,
    level,
    date: new Date().toISOString().split('T')[0],
    gameType,
    numColumns,
    numRows,
  });
  list.sort((a, b) => b.score - a.score);
  buckets[gameType] = list.slice(0, MAX);
  saveBuckets(buckets);
}

export function getGameTypesWithScores(): number[] {
  const buckets = loadBuckets();
  return Object.keys(buckets)
    .map(k => Number(k))
    .filter(n => Number.isFinite(n) && (buckets[n]?.length ?? 0) > 0)
    .sort((a, b) => a - b);
}
