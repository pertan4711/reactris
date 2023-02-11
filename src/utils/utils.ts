function calculateBrickSize(
  xWinSize: number,
  yWinSize: number,
  numCols: number,
  numRows: number
): number {
  let winSize = (xWinSize - 350) < yWinSize ? (xWinSize - 350) : yWinSize;
  let pSize = (numRows < numCols) ? numCols : numRows;

  return Math.round(winSize / pSize) - 5;
}

export default calculateBrickSize;
