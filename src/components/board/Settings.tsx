import { useState } from "react";
import { SettingsProps } from "../../model/types";

const Settings = ({ gameSettings, setGameSettingsCallback }: SettingsProps) => {
  type localSettingType = {
    name: string;
    value: number;
    valid: Boolean;
    changed: Boolean;
  };

  let transformSettings: localSettingType[] = [];

  // Transform to local setting object to detect change and validate
  for (const [key, value] of Object.entries(gameSettings)) {
    let localSetting: localSettingType = {
      name: key.toString(),
      value: value,
      valid: true,
      changed: false,
    };
    transformSettings.push(localSetting);
  }

  const [localSettings, setLocalSettings] = useState(transformSettings);

  const handleChange = (event: any) => {
    console.log("handleChange: " + event.target.name);

    let setSetting = localSettings.find(
      (setting) => setting.name === event.target.name
    );

    if (setSetting != null) {
      setSetting.value = parseInt(event.target.value);
      setSetting.changed = true;

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

        case "levelUpgradeDiv":
          setSetting.valid = event.target.value >= 1 ? true : false;
          break;

        default:
          break;
      }

      console.log({ ...localSettings });
      setLocalSettings([...localSettings]);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    let updateSettings = localSettings.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {}
    );

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
              {localSettings.map((setting) => (
                <tr key={setting.name}>
                  <th>
                    {setting.name}
                    {!setting.valid ? "*" : ""}
                  </th>
                  <th>
                    <input
                      className="playground-input-dialogue"
                      type="text"
                      //style={(nvsetting[1]) ? "" : "color: 'red'"}
                      value={setting.value.toString()}
                      name={setting.name}
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
