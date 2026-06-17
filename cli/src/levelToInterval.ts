export function levelToInterval(level: number): number {
  if (level < 2) return 1000;
  if (level === 2) return 800;
  if (level === 3) return 700;
  if (level === 4) return 600;
  if (level === 5) return 500;
  return 400;
}
