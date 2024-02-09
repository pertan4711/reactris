//import { useState } from "react";
import { SettingsProps } from "../../model/types";
//import { gameSettingsType } from "../../model/modeltypes";

const Settings = (sp: SettingsProps) => {
  type localSettingType = {
    settingName: string;
    settingValue: number;
    valid: Boolean;
    changed: Boolean;
  };

  let localSettings: localSettingType[] = [];

  // Transform to local setting object to detect change and validate
  for (const [key, value] of sp.gameSettings) {
    let localSetting: localSettingType = {
      settingName: key.toString(),
      settingValue: value,
      valid: true,
      changed: false,
    };
    localSettings.push(localSetting);
  }

  //const [settings, setSettings] = useState(configSettings);

  const handleChange = (event: any) => {
    let setSetting = localSettings.find(
      (setting) => setting.settingName === event.target.name
    );

    if (setSetting != null) {
      setSetting.settingValue = event.target.value;
      setSetting.changed = true;

      // Valid stuff
      switch (event.target.name) {
        case "numColumns":
        case "numRows":
        case "brickSize":
        case "brickSpace":
          setSetting.valid = event.target.value > 5 ? true : false;
          break;
        case "initWallHeight":
          setSetting.valid = event.target.value >= 0 ? true : false;
          break;
        default:
          break;
      }
    }

    // // Set to local setting object
    // setSettings({
    //   ...configSettings,
    //   [event.target.name]: [event.target.value, valid, true],
    // });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    //let pushingSettings: { name: string; value: number }[] = [];

    let pushingSettings = localSettings.map((setting: localSettingType) => {
      return { name: setting.settingName, value: setting.settingValue };
    });

    for (let setting in localSettings) {
      // let pushSetting = {setting.mySetting, myValue};
      // pushingSetting.push({ mySetting.settingName, mySetting.settingValue});
      console.log(setting);
    }

    sp.gameSettingsCallback(pushingSettings);

    // for (let [key, setting] of Object.entries(settings)) {
    //   if (setting[2]) {
    //     switch (key) {
    //       case "numColumns":
    //         sendBackSetting.numColumns = parseInt(setting[0].toString());
    //         break;
    //       case "numRows":
    //         sp.gameSettingsCallback(parseInt(setting[0].toString()));
    //         break;
    //       case "brickSize":
    //         sp.gameSettingsCallback(parseInt(setting[0].toString()));
    //         break;
    //       case "brickSpace":
    //         sp.gameSettingsCallback(parseInt(setting[0].toString()));
    //         break;
    //       case "initWallHeight":
    //         sp.gameSettingsCallback(parseInt(setting[0].toString()));
    //         break;
    //     }
    //   }
    // }

    //sp.settings();
    //sp.pg.updateBlockWall();
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
              {Object.entries(localSettings).map((setting) => (
                <tr key={setting[0]}>
                  <th>
                    {setting[1].settingName}
                    {!setting[1].valid ? "*" : ""}
                  </th>
                  <th>
                    <input
                      className="playground-input-dialogue"
                      type="text"
                      //style={(nvsetting[1]) ? "" : "color: 'red'"}
                      value={setting[1].settingValue.toString()}
                      name={setting[1].settingName}
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
