export interface HighScoreEntry {
  id: number;
  name: string;
  score: number;
  level: number;
  date: string;
}

const KEY = 'reactris_highscores';
const MAX = 10;

export function getHighScores(): HighScoreEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function qualifiesForHighScore(score: number): boolean {
  if (score <= 0) return false;
  const scores = getHighScores();
  return scores.length < MAX || score > scores[scores.length - 1].score;
}

export function saveHighScore(name: string, score: number, level: number): void {
  const scores = getHighScores();
  scores.push({
    id: Date.now(),
    name: name.trim() || 'PLAYER',
    score,
    level,
    date: new Date().toISOString().split('T')[0],
  });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem(KEY, JSON.stringify(scores.slice(0, MAX)));
}
