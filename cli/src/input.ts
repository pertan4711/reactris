import * as readline from "readline";

export type InputAction =
  | "left"
  | "right"
  | "rotateLeft"
  | "rotateRight"
  | "softDrop"
  | "pause"
  | "quit"
  | "restart"
  | "toggleSize"
  | "settings"
  | "other";

export type KeyEvent = { sequence?: string; name?: string; ctrl?: boolean };

/// The raw key name is passed along for screens with their own keys, like Settings
export function attachInput(
  handler: (action: InputAction, keyName?: string) => void
): () => void {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();

  const onKey = (_str: string, key: KeyEvent) => {
    if (!key) return;
    if (key.ctrl && key.name === "c") return handler("quit");
    handler(toAction(key.name), key.name);
  };

  process.stdin.on("keypress", onKey);

  return () => {
    process.stdin.off("keypress", onKey);
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    process.stdin.pause();
  };
}

function toAction(name: string | undefined): InputAction {
  switch (name) {
    case "left":
    case "a":
      return "left";
    case "right":
    case "d":
      return "right";
    case "up":
    case "q":
      return "rotateLeft";
    case "e":
      return "rotateRight";
    case "down":
    case "s":
      return "softDrop";
    case "escape":
      return "pause";
    case "r":
      return "restart";
    case "z":
      return "toggleSize";
    case "o":
      return "settings";
    default:
      return "other";
  }
}
