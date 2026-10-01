import { useState, useEffect } from "react";
import "./SettingsPanel.css";

function SettingsPanel({ settings, onUpdate }) {
  // Estado local do formulário, só é aplicado de verdade ao clicar em "Save"
  const [workMinutes, setWorkMinutes] = useState(settings.work);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(
    settings.shortBreak
  );
  const [longBreakMinutes, setLongBreakMinutes] = useState(settings.longBreak);

  // Mantém o formulário sincronizado caso as configurações mudem por fora
  useEffect(() => {
    setWorkMinutes(settings.work);
    setShortBreakMinutes(settings.shortBreak);
    setLongBreakMinutes(settings.longBreak);
  }, [settings]);

  function handleSave(event) {
    event.preventDefault();

    onUpdate({
      work: Number(workMinutes),
      shortBreak: Number(shortBreakMinutes),
      longBreak: Number(longBreakMinutes),
    });
  }

  return (
    <form
      id="settings-panel"
      className="settings-panel"
      onSubmit={handleSave}
    >
      <div className="setting-field">
        <label htmlFor="work-minutes">Work (minutes)</label>
        <input
          type="number"
          id="work-minutes"
          min="1"
          max="180"
          value={workMinutes}
          onChange={(event) => setWorkMinutes(event.target.value)}
        />
      </div>

      <div className="setting-field">
        <label htmlFor="short-break-minutes">Short Break (minutes)</label>
        <input
          type="number"
          id="short-break-minutes"
          min="1"
          max="60"
          value={shortBreakMinutes}
          onChange={(event) => setShortBreakMinutes(event.target.value)}
        />
      </div>

      <div className="setting-field">
        <label htmlFor="long-break-minutes">Long Break (minutes)</label>
        <input
          type="number"
          id="long-break-minutes"
          min="1"
          max="60"
          value={longBreakMinutes}
          onChange={(event) => setLongBreakMinutes(event.target.value)}
        />
      </div>

      <button type="submit" className="save-settings-btn">
        Save Settings
      </button>
    </form>
  );
}

export default SettingsPanel;