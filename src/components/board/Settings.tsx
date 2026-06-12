import { useEffect, useRef, useState } from "react";
import { SettingsProps } from "../../model/componentProps";
import { playMode } from "../../model/constants";
import { gameTypeEnum } from "../../model/modeltypes";

const Settings = ({ gameSettings, setGameSettingsCallback }: SettingsProps) => {
  type localSettingType = {
    name: string;
    value: number;
    rawValue: string;
    valid: Boolean;
    changed: Boolean;
  };

  const labelMap = {
    numColumns: "Columns",
    numRows: "Rows",
    gameType: "Game Type",
    initWallHeight: "Initial Wall Height",
    initWallPropability: "Wall Probability (0-1)",
    levelUpgradeDiv: "Level Upgrade Divider",
  };

  const FLOAT_FIELDS = new Set(["initWallPropability"]);

  const validateValue = (name: string, value: number): boolean => {
    if (isNaN(value)) return false;
    switch (name) {
      case "numColumns":
      case "numRows":
      case "brickSize":
      case "brickSpace":
        return value > 5;
      case "initWallHeight":
        return value >= 0;
      case "levelUpgradeDiv":
        return value >= 1;
      case "initWallPropability":
        return value >= 0 && value <= 1;
      case "gameType":
        return Number.isInteger(value) && value >= 0 && value < playMode.length;
      default:
        return true;
    }
  };

  const gameTypeLabel = (idx: number): string | null => {
    const mode = playMode[idx];
    if (!mode) return null;
    const name = gameTypeEnum[mode.mode] ?? "Custom";
    if (name === "Custom") {
      const n = mode.blocks.length;
      return `Custom (${n} ${n === 1 ? "block" : "blocks"})`;
    }
    return name;
  };

  const transformSettings = (): localSettingType[] => {
    return Object.entries(gameSettings).map(([key, value]) => ({
      name: key.toString(),
      value: value as number,
      rawValue: String(value),
      valid: true,
      changed: false,
    }));
  };

  const [localSettings, setLocalSettings] = useState(transformSettings());
  const [showKeys, setShowKeys] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Autofocus the first input, and cycle focus with Up/Down arrows.
  useEffect(() => {
    if (showKeys) return; // sub-dialog handles its own focus
    const focusables = () =>
      Array.from(
        formRef.current?.querySelectorAll<HTMLElement>(
          'input, button, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        const list = focusables();
        if (list.length === 0) return;
        e.preventDefault();
        const idx = list.indexOf(document.activeElement as HTMLElement);
        const next =
          e.key === "ArrowDown"
            ? (idx + 1) % list.length
            : idx <= 0
            ? list.length - 1
            : idx - 1;
        const target = list[next];
        target.focus();
        if (target.tagName === "INPUT") {
          (target as HTMLInputElement).select();
        }
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const active = document.activeElement as HTMLElement | null;
        if (!active || active.tagName !== "INPUT") return;
        const name = (active as HTMLInputElement).name;
        const isFloat = FLOAT_FIELDS.has(name);
        const step = isFloat ? 0.1 : 1;
        const delta = e.key === "ArrowRight" ? step : -step;
        e.preventDefault();
        setLocalSettings((prev) =>
          prev.map((s) => {
            if (s.name !== name) return s;
            let newVal: number;
            if (name === "gameType") {
              newVal = (s.value + delta + playMode.length) % playMode.length;
            } else if (isFloat) {
              newVal = Math.round((s.value + delta) * 10) / 10;
            } else {
              newVal = s.value + delta;
            }
            return {
              ...s,
              value: newVal,
              rawValue: String(newVal),
              changed: true,
              valid: validateValue(name, newVal),
            };
          })
        );
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showKeys]);

  // Esc closes the Key bindings sub-dialog
  useEffect(() => {
    if (!showKeys) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowKeys(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showKeys]);

  const keyBindings: { keys: string; label: string }[][] = [
    [
      { keys: "← / A", label: "Move left" },
      { keys: "→ / D", label: "Move right" },
      { keys: "↓ / S", label: "Soft drop" },
      { keys: "↑ / Q", label: "Rotate left" },
      { keys: "E", label: "Rotate right" },
      { keys: "Esc", label: "Pause" },
    ],
    [
      { keys: "+", label: "Bricks bigger (size + space)" },
      { keys: "-", label: "Bricks smaller (size + space)" },
      { keys: "3 / 4", label: "Brick size only ± " },
      { keys: "5 / 6", label: "Brick spacing only ± " },
    ],
    [
      { keys: "7 / 8", label: "Add / remove row" },
      { keys: "9 / 0", label: "Add / remove column" },
    ],
  ];

  const handleChange = (event: any) => {
    const name = event.target.name;
    const raw: string = event.target.value;

    let setSetting = localSettings.find((s) => s.name === name);
    if (!setSetting) return;

    const parsed = FLOAT_FIELDS.has(name) ? parseFloat(raw) : parseInt(raw, 10);
    const hasNumber = !isNaN(parsed);

    setSetting.rawValue = raw;
    setSetting.changed = true;
    if (hasNumber) setSetting.value = parsed;
    setSetting.valid = validateValue(name, parsed);

    setLocalSettings([...localSettings]);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (localSettings.some((s) => !s.valid)) return;

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
      <div ref={formRef}>
        <h1>Settings</h1>
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              {localSettings.map((setting) => (
                <tr key={setting.name}>
                  <th>
                    {labelMap[setting.name as keyof typeof labelMap] || setting.name}
                    {!setting.valid ? "*" : ""}
                  </th>
                  <th>
                    {setting.name === "gameType" ? (
                      <input
                        className="playground-input-dialogue"
                        type="text"
                        style={setting.valid ? undefined : { color: '#ff6b6b', borderColor: '#ff6b6b' }}
                        value={gameTypeLabel(setting.value) ?? setting.rawValue}
                        name={setting.name}
                        readOnly
                        title="Use ← / → to change"
                      />
                    ) : (
                      <input
                        className="playground-input-dialogue"
                        type="text"
                        style={setting.valid ? undefined : { color: '#ff6b6b', borderColor: '#ff6b6b' }}
                        value={setting.rawValue}
                        name={setting.name}
                        onChange={handleChange}
                      />
                    )}
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
                  <button
                    type="button"
                    className="button-text"
                    onClick={() => setShowKeys(true)}
                  >
                    Keys
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
          <input className="button-text" type="submit" value="OK" />
        </form>
      </div>

      {showKeys && (
        <div
          onClick={() => setShowKeys(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="playground-dialogue"
            style={{ position: "relative", maxWidth: 520, textAlign: "left", fontSize: 18 }}
          >
            <h2 style={{ marginTop: 0 }}>Key bindings</h2>
            {keyBindings.map((group, gi) => (
              <table key={gi} style={{ marginBottom: 12, width: "100%" }}>
                <tbody>
                  {group.map((b) => (
                    <tr key={b.keys}>
                      <td style={{ padding: "4px 12px 4px 0", whiteSpace: "nowrap", color: "#ffd166" }}>
                        {b.keys}
                      </td>
                      <td style={{ padding: "4px 0" }}>{b.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                type="button"
                className="button-text"
                onClick={() => setShowKeys(false)}
                autoFocus
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
