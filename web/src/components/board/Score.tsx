import { ScoreProps } from "../componentProps";
import { emptyWallBrick } from "@reactris/engine";

const PREVIEW_BRICK = 20;
const PREVIEW_GAP = 2;

function NextPreview({ pg }: { pg: ScoreProps["pg"] }) {
  const nextBricks = pg.nextActive.getBrickPosition();
  const color = pg.nextActive.getBlockColor();
  const minX = Math.min(...nextBricks.map((b) => b.pX));
  const minY = Math.min(...nextBricks.map((b) => b.pY));

  const grid: number[][] = Array.from({ length: 4 }, () =>
    Array(4).fill(emptyWallBrick)
  );
  for (const b of nextBricks) {
    const x = b.pX - minX;
    const y = b.pY - minY;
    if (y >= 0 && y < 4 && x >= 0 && x < 4) grid[y][x] = 1;
  }

  const step = PREVIEW_BRICK + PREVIEW_GAP;
  return (
    <div
      style={{
        position: "relative",
        width: 4 * step - PREVIEW_GAP,
        height: 4 * step - PREVIEW_GAP,
        margin: "6px 0 0 28px",
      }}
    >
      {grid.flatMap((row, y) =>
        row.map((cell, x) => (
          <div
            key={y * 4 + x}
            style={{
              position: "absolute",
              left: x * step,
              top: y * step,
              width: PREVIEW_BRICK,
              height: PREVIEW_BRICK,
              background:
                cell === emptyWallBrick ? "rgba(255,255,255,0.06)" : color,
              borderRadius: 3,
              boxShadow:
                cell !== emptyWallBrick
                  ? `0 0 6px ${color}, 0 0 12px ${color}55`
                  : undefined,
            }}
          />
        ))
      )}
    </div>
  );
}

const ScoreBoard = ({ width, height, actionCallbacks, pg, showNextPiece }: ScoreProps) => {
  return (
    <>
      {/* Shadow of board */}
      <div
        style={{
          position: "absolute",
          background: "rgba(0,0,0,0.4)",
          left: width + 10,
          width: 350,
          height: height,
          top: 5,
          borderRadius: 8,
        }}
      ></div>
      {/* Board displaying score */}
      <div
        className="playground-panel"
        style={{
          position: "absolute",
          left: width + 5,
          width: 350,
          height: height,
          top: 0,
        }}
      >
        <div className="score-heading">Reactris</div>
        <div className="score-text">Score: {pg.score}</div>
        <div className="score-text">Level: {pg.level}</div>
        {showNextPiece !== 0 && (
          <>
            <div className="score-text" style={{ marginBottom: 0 }}>Next:</div>
            <NextPreview pg={pg} />
          </>
        )}
        <div style={{ color: "white", margin: "24px 5px 5px 28px" }}>
          <button
            className="button-text"
            onClick={() => actionCallbacks.showSettings()}
          >
            Settings
          </button>
          <br />
          <button
            className="button-text"
            onClick={() => actionCallbacks.togglePause()}
          >
            Pause
          </button>
          <br />
          <button
            className="button-text"
            onClick={() => actionCallbacks.startNewGame()}
          >
            New Game
          </button>
          <br />
          {actionCallbacks.onBackToMenu && (
            <button
              className="button-text"
              style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)" }}
              onClick={() => actionCallbacks.onBackToMenu()}
            >
              Main Menu
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ScoreBoard;
