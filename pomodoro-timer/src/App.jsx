import { useState } from "react";
import "./App.css";
import { usePomodoro } from "./hooks/usePomodoro";
import Timer from "./components/Timer";
import SessionControls from "./components/SessionControls";
import SettingsPanel from "./components/SettingsPanel";

function App() {
  const {
    sessionType,
    secondsLeft,
    isRunning,
    completedWorkSessions,
    settings,
    start,
    pause,
    reset,
    updateSettings,
  } = usePomodoro();

  // Controla se o painel de configurações está visível
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="app">
      <h1>Pomodoro Timer</h1>

      <Timer sessionType={sessionType} secondsLeft={secondsLeft} />

      <p className="session-count" aria-live="polite">
        Completed work sessions: <strong>{completedWorkSessions}</strong>
      </p>

      <SessionControls
        isRunning={isRunning}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />

      <button
        type="button"
        className="settings-toggle"
        onClick={() => setShowSettings((prev) => !prev)}
        aria-expanded={showSettings}
        aria-controls="settings-panel"
      >
        {showSettings ? "Hide Settings" : "Settings"}
      </button>

      {showSettings && (
        <SettingsPanel settings={settings} onUpdate={updateSettings} />
      )}
    </div>
  );
}

export default App;