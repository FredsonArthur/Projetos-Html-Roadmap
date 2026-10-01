import "./SessionControls.css";

function SessionControls({ isRunning, onStart, onPause, onReset }) {
  return (
    <div className="session-controls" role="group" aria-label="Timer controls">
      {isRunning ? (
        <button
          type="button"
          className="control-btn pause-btn"
          onClick={onPause}
        >
          Pause
        </button>
      ) : (
        <button
          type="button"
          className="control-btn start-btn"
          onClick={onStart}
        >
          Start
        </button>
      )}

      <button
        type="button"
        className="control-btn reset-btn"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}

export default SessionControls;