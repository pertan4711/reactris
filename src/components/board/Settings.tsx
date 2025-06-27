import { useState } from "react";
import { SettingsProps } from "../../model/componentProps";

const Settings = ({ gameSettings, setGameSettingsCallback }: SettingsProps) => {
  type localSettingType = {
    name: string;
    value: number;
    valid: Boolean;
    changed: Boolean;
  };

  const labelMap = {
    numColumns: "Columns",
    numRows: "Rows",
    gameType: "Game Type",
    initWallHeight: "Initial Wall Height",
    initWallPropability: "Wall Probability",
    levelUpgradeDiv: "Level Upgrade Divider",
  };

  const transformSettings = () => {
    return Object.entries(gameSettings).map(([key, value]) => ({
      name: key.toString(),
      value: value,
      valid: true,
      changed: false,
    }));
  };

  const [localSettings, setLocalSettings] = useState(transformSettings());

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
        backgroundColor: "#FFF8DC", // a little lighter than #F7E7B8, matches Score panel
        borderRadius: "10px",
        padding: "30px",
        margin: "20px",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div>
        <h1
          style={{
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            marginTop: 0,
          }}
        >
          Settings
        </h1>
        <div
          className="sunken-panel"
          style={{
            backgroundColor: "#FFF9E3", // lighter, warm yellow for harmony
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.5)", // Match Score.tsx shadow
          }}
        >
          <form id="settings-form" onSubmit={handleSubmit}>
            <table>
              <tbody>
                {localSettings.map((setting) => (
                  <tr key={setting.name}>
                    <th
                      style={{
                        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                        fontWeight: "normal",
                      }}
                    >
                      {labelMap[setting.name as keyof typeof labelMap] || setting.name}
                      {!setting.valid ? "*" : ""}
                    </th>
                    <th>
                      <input
                        className="playground-input-dialogue"
                        type="text"
                        value={setting.value.toString()}
                        name={setting.name}
                        onChange={handleChange}
                        style={{
                          backgroundColor: "#F5E6B2", // darker than panel for more contrast
                          border: "1.5px inset #e0c97f", // inset border for sunken effect
                          borderRadius: "5px",
                          padding: "4px 8px",
                          boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.10)", // subtle inner shadow for sunken look
                        }}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </div>
        <table>
          <tbody>
            <tr>
              <th
                style={{
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                  fontWeight: "normal",
                }}
              >
                Block
              </th>
              <th>
                <button
                  className="button-text"
                  style={{
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                    backgroundColor: "lightyellow",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Adjust
                </button>
              </th>
            </tr>
            <tr>
              <th
                style={{
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                  fontWeight: "normal",
                }}
              >
                Key bindings
              </th>
              <th>
                <button
                  className="button-text"
                  style={{
                    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                    boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                    backgroundColor: "lightyellow",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Keys
                </button>
              </th>
            </tr>
          </tbody>
        </table>
        {/* OK button moved below the table */}
        <div style={{ textAlign: "right", marginTop: "20px" }}>
          <form onSubmit={handleSubmit}>
            <input
              className="button-text"
              type="submit"
              value="OK"
              style={{
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                backgroundColor: "lightyellow",
                border: "none",
                cursor: "pointer",
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
