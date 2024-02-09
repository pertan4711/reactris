import { useState } from "react";
import { SettingsProps } from "../../model/types";
import { gameSettingsType } from "../../model/modeltypes";

const Settings = ({ gameSettings, setGameSettingsCallback }: SettingsProps) => {
  let configSettings = {
    initWallHeight: [gameSettings.initWallHeight, true, false],
    numColumns: [gameSettings.numColumns, true, false],
    numRows: [gameSettings.numRows, true, false],
    brickSize: [gameSettings.brickSize, true, false],
    brickSpace: [gameSettings.brickSpace, true, false],
    levelUpgradeDiv: [gameSettings.levelUpgradeDiv, true, false],
  };

  const [localSettings, setLocalSettings] = useState(configSettings);

  const handleChange = (event: any) => {
    switch (event.target.name) {
      case "numColumns":
        configSettings.numColumns[0] = event.target.value;
        configSettings.numColumns[1] = event.target.value > 5 ? true : false; // valid
        configSettings.numColumns[2] = true; // changed
        break;
      case "numRows":
        configSettings.numRows[0] = event.target.value;
        configSettings.numRows[1] = event.target.value > 5 ? true : false;
        configSettings.numRows[2] = true;
        break;
      case "brickSize":
        configSettings.brickSize[0] = event.target.value;
        configSettings.brickSize[1] = event.target.value > 5 ? true : false;
        configSettings.brickSize[2] = true;
        break;
      case "brickSpace":
        configSettings.brickSpace[0] = event.target.value;
        configSettings.brickSpace[1] = event.target.value > 5 ? true : false;
        configSettings.brickSpace[2] = true;
        break;
      case "initWallHeight":
        configSettings.initWallHeight[0] = event.target.value;
        configSettings.initWallHeight[1] =
          event.target.value >= 0 ? true : false;
        configSettings.initWallHeight[2] = true;
        break;
      case "levelUpgradeDiv":
        configSettings.levelUpgradeDiv[0] = event.target.value;
        configSettings.levelUpgradeDiv[1] =
          event.target.value >= 1 ? true : false;
        configSettings.levelUpgradeDiv[2] = true;
        break;
      default:
        break;
    }

    setLocalSettings({
      ...configSettings,
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let updateSettings: gameSettingsType = {
      initWallHeight: parseInt(localSettings.initWallHeight[0].toString()),
      numColumns: parseInt(localSettings.numColumns[0].toString()),
      numRows: parseInt(localSettings.numRows[0].toString()),
      brickSize: parseInt(localSettings.brickSize[0].toString()),
      brickSpace: parseInt(localSettings.brickSpace[0].toString()),
      levelUpgradeDiv: gameSettings.levelUpgradeDiv,
    };

    setGameSettingsCallback(updateSettings);
  };

  return (
    <div
      className="playground-dialogue"
      style={{
        textAlign: "left",
      }}
    >
      <div>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              {Object.entries(localSettings).map(([key, setting]) => (
                <tr key={key}>
                  <th>
                    {key}
                    {!setting[1] ? "*" : ""}
                  </th>
                  <th>
                    <input
                      className="playground-input-dialogue"
                      type="text"
                      //style={(nvsetting[1]) ? "" : "color: 'red'"}
                      value={setting[0].toString()}
                      name={key}
                      onChange={handleChange}
                    />
                  </th>
                </tr>
              ))}
              <tr>
                <th>Block</th>
                <th>
                  <button className="button-text">Adjust</button>
                </th>
              </tr>
              <tr>
                <th>Key bindings</th>
                <th>
                  <button className="button-text">Keys</button>
                </th>
              </tr>
            </tbody>
          </table>
          <input className="button-text" type="submit" value="OK" />
        </form>
      </div>
    </div>
  );
};

export default Settings;
