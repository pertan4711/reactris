# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at localhost:3000 (uses --openssl-legacy-provider)
npm test           # Jest in watch mode
npm test -- --watchAll=false  # Run tests once (CI mode)
npm run build      # Production build
```

`cross-env NODE_OPTIONS=--openssl-legacy-provider` is required for all script invocations due to a Node/webpack compatibility issue — this is already wired into the npm scripts.

## Architecture

Reactris is a Tetris clone built with React 18 + TypeScript, following an MVP pattern:

**Model** (`src/model/`) — pure TypeScript, no React dependencies:
- `playground.ts` — singleton that owns all game state: active block, wall, score, level, game-over flag
- `wall.ts` — the fixed grid; handles collision detection and line-clearing
- `block.ts` — abstract base for all pieces; implements movement, rotation, and boundary checking
- `blocks/` — 11 concrete block classes (standard Tetris pieces + custom invented shapes)
- `constants.ts` — game dimensions, level speeds, block definitions
- `modeltypes.ts` — shared TypeScript types (BrickType, WallType, GameSettings, etc.)

**Presenter** (`src/components/UseGameState.tsx`) — custom React hook that:
- Owns the `setInterval` game loop (interval speed derived from level)
- Listens to `keydown` events and delegates to the model
- Calls `playground.tick()` each interval and triggers re-renders

**View** (`src/components/`) — React components that only render; no game logic:
- `TetrisApp.tsx` — top-level router switching between `menu` / `game` / `highscores` screens
- `Game.tsx` — composes `Playground` with the `useGameState` hook
- `Playground.tsx` — renders the board by mapping wall + active block data to `Brick` / `Block` / `Wall` sub-components
- `board/` and `game/` — leaf components (score display, game-over dialog, individual brick rendering)

**Data flow:** keyboard event → `UseGameState` → `playground` model mutates state → hook re-renders → components re-render from model snapshot.

## Tests

Tests live in `src/test/` and cover the model layer (Block, Wall, Playground). Run a single test file:

```bash
npm test -- --testPathPattern=wall
```

## Styling

Single stylesheet at `src/Tetris.css`; uses `node-sass` (SCSS).
