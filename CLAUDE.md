# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root (npm workspaces):

```bash
npm install                   # install deps for all workspaces (root lockfile only)
npm run build:engine          # compile engine to engine/dist — required before web/cli resolve @reactris/engine
npm run web                   # web dev server at localhost:3000
npm run cli                   # terminal version via ts-node
npm test                      # engine Jest tests + web tests (run once)
npm run build                 # build engine + web (outputs web/build/)
npx tsc --noEmit -p cli/tsconfig.json   # type-check the CLI (CI does this)
```

Run a single engine test file:

```bash
npm -w @reactris/engine test -- wall
```

The web scripts use `cross-env NODE_OPTIONS=--openssl-legacy-provider` for a Node/webpack compatibility issue — already wired into `web/package.json`. CI builds with `CI=true`, which makes CRA fail on lint warnings.

## Architecture

Monorepo with three workspaces sharing one game engine:

**`engine/` (`@reactris/engine`)** — pure TypeScript, no DOM or React:
- `playground.ts` — `playGroundModel` class owning one game's state: active/next block, wall, score, level, pause, gameover. Not a singleton; constructed with a settings object and an optional `random` source (for reproducible tests). API: `reset`, `tick`, `softDrop`, `tryMove`, `tryRotate`, `configure`.
- `wall.ts` — the fixed grid; collision data and line clearing
- `block.ts` — abstract base for all pieces; movement, rotation, brick positions
- `blocks/` — 12 concrete block classes (standard pieces plus invented shapes)
- `constants.ts` — block list with colors, `playMode` (Classic, Advanced, Beginner, Line only), `intervalForLevel`. `playMode` index is persisted as `gameType` and keys the high-score lists, so only append new modes.
- `modeltypes.ts` — shared types and enums
- `index.ts` — public exports; front-ends import only from here

**`web/` (`@reactris/web`)** — React 18 + CRA, MVP pattern:
- Presenter: `src/components/UseGameState.tsx` owns the `setInterval` loop (from `intervalForLevel`) and `keydown` handling, delegating to the engine
- View: `TetrisApp.tsx` switches between menu / game / highscores; `Game.tsx`, `Playground.tsx`, `board/`, `game/` render only
- `src/utils/` — settings and high scores in `localStorage`

**`cli/` (`@reactris/cli`)** — Node terminal front-end: `loop.ts` (tick), `input.ts` (raw stdin keys), `renderer.ts` (ANSI/chalk), `store.ts` (`~/.reactris-console/state.json`).

**Data flow:** key event → presenter/input → engine mutates state → front-end re-renders from the engine's fields.

## Tests

Tests live in `engine/test/` (Jest + ts-jest, config in `engine/jest.config.js`) and cover Block, Wall and Playground. The web package currently has no tests.

## Styling

Plain CSS: `web/src/Tetris.css` plus per-component `.css` / `.module.css` files.

## CI

`.github/workflows/azure-static-web-apps-*.yml` tests and builds on every push and deploys `master` and PRs to Azure Static Web Apps. See `doc/ci.md`.
