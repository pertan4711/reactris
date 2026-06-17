import * as readline from "readline";

export type InputAction =
  | "left"
  | "right"
  | "rotateLeft"
  | "rotateRight"
  | "softDrop"
  | "pause"
  | "quit"
  | "restart";

export type KeyEvent = { sequence?: string; name?: string; ctrl?: boolean };

export function attachInput(handler: (action: InputAction) => void): () => void {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();

  const onKey = (_str: string, key: KeyEvent) => {
    if (!key) return;
    if (key.ctrl && key.name === "c") return handler("quit");
    switch (key.name) {
      case "left":
      case "a":
        return handler("left");
      case "right":
      case "d":
        return handler("right");
      case "up":
      case "q":
        return handler("rotateLeft");
      case "e":
        return handler("rotateRight");
      case "down":
      case "s":
        return handler("softDrop");
      case "escape":
        return handler("pause");
      case "r":
        return handler("restart");
    }
  };

  process.stdin.on("keypress", onKey);

  return () => {
    process.stdin.off("keypress", onKey);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
  };
}
