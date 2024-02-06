import { useState } from "react";
import { SettingsProps } from "../../model/types";

const Settings = (sp: SettingsProps) => {
  let configSettings = {
    initWallHeight: [sp.pg.gameSettings.initWallHeight, true, false],
    numColumns: [sp.pg.gameSettings.numColumns, true, false],
    numRows: [sp.pg.gameSettings.numRows, true, false],
    brickSize: [sp.pg.gameSettings.brickSize, true, false],
    brickSpace: [sp.pg.gameSettings.brickSpace, true, false],
  };

  const [settings, setSettings] = useState(configSettings);

  const handleChange = (event: any) => {
    let valid: boolean = false;

    switch (event.target.name) {
      case "numColumns":
        configSettings.numColumns = event.target.value;
        valid = event.target.value > 5 ? true : false;
        break;
      case "numRows":
        configSettings.numRows = event.target.value;
        valid = event.target.value > 5 ? true : false;
        break;
      case "brickSize":
        configSettings.brickSize = event.target.value;
        valid = event.target.value > 5 ? true : false;
        break;
      case "brickSpace":
        valid = event.target.value > 5 ? true : false;
        break;
      case "initWallHeight":
        valid = event.target.value >= 0 ? true : false;
        break;
      default:
        break;
    }

    setSettings({
      ...configSettings,
      [event.target.name]: [event.target.value, valid, true],
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    for (let [key, setting] of Object.entries(settings)) {
      if (setting[2]) {
        switch (key) {
          case "numColumns":
            sp.pg.numColumns = parseInt(setting[0].toString());
            break;
          case "numRows":
            sp.pg.numRows = parseInt(setting[0].toString());
            break;
          case "brickSize":
            sp.pg.gameSettings.brickSize = parseInt(setting[0].toString());
            break;
          case "brickSpace":
            sp.pg.gameSettings.brickSpace = parseInt(setting[0].toString());
            break;
          case "initWallHeight":
            sp.pg.gameSettings.initWallHeight = parseInt(setting[0].toString());
            break;
        }
      }
    }

    //sp.settings();
    sp.pg.updateBlockWall();
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
              {Object.entries(settings).map(([key, setting]) => (
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
