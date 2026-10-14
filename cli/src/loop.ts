import { playGroundModel, intervalForLevel } from "@reactris/engine";

export type LoopHandle = {
  stop: () => void;
  isPaused: () => boolean;
  setPaused: (paused: boolean) => void;
  isOver: () => boolean;
};

export function startLoop(pg: playGroundModel, onFrame: () => void): LoopHandle {
  let paused = false;
  let currentLevel = pg.level;
  let interval = intervalForLevel(currentLevel);
  let timer: NodeJS.Timeout | null = null;

  const tick = () => {
    if (paused || pg.gameover) return;
    pg.tick();
    if (pg.level !== currentLevel) {
      currentLevel = pg.level;
      const next = intervalForLevel(currentLevel);
      if (next !== interval) {
        interval = next;
        if (timer) clearInterval(timer);
        timer = setInterval(tick, interval);
      }
    }
    onFrame();
  };

  timer = setInterval(tick, interval);

  return {
    stop: () => {
      if (timer) clearInterval(timer);
      timer = null;
    },
    isPaused: () => paused,
    setPaused: (p: boolean) => {
      paused = p;
      pg.pause = p;
    },
    isOver: () => pg.gameover,
  };
}
