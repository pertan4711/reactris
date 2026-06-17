const SIDE_PANEL = 360;
const VIEWPORT_MARGIN = 40;
const MIN_BRICK = 8;

function calculateBrickSize(
  xWinSize: number,
  yWinSize: number,
  numCols: number,
  numRows: number
): number {
  const availW = Math.max(0, xWinSize - SIDE_PANEL - VIEWPORT_MARGIN);
  const availH = Math.max(0, yWinSize - VIEWPORT_MARGIN);
  const sizeByW = Math.floor(availW / Math.max(1, numCols));
  const sizeByH = Math.floor(availH / Math.max(1, numRows));
  return Math.max(MIN_BRICK, Math.min(sizeByW, sizeByH) - 2);
}

export default calculateBrickSize;
