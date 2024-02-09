import playgroundModel from "../model/playground";

function calculateBrickSize(
  xWinSize: number,
  yWinSize: number,
  numCols: number,
  numRows: number
): number {
  let winSize = xWinSize - 350 < yWinSize ? xWinSize - 350 : yWinSize;
  let pSize = numRows < numCols ? numCols : numRows;

  return Math.round(winSize / pSize) - 5;
}

const getSetting = (pg: playgroundModel, settingName: string): number => {
  const settingTemp = pg.gameSettings.find(
    (setting) => setting.name === settingName
  )?.value;
  return settingTemp != null ? settingTemp : 10;
};

const setSetting = (
  pg: playgroundModel,
  settingName: string,
  value: number
) => {
  // Find setting in array and get index
  let index = pg.gameSettings.findIndex(
    (setting) => setting.name === settingName
  );
  // set array index value
  pg.gameSettings[index].value = value;
};

export { getSetting, setSetting, calculateBrickSize };
