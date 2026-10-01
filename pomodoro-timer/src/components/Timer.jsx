import "./Timer.css";

// Converte segundos totais em "MM:SS" para exibição
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

// Cada tipo de sessão recebe uma cor de destaque diferente
const sessionColors = {
  Work: "#e63946",
  "Short Break": "#2a9d8f",
  "Long Break": "#457b9d",
};

function Timer({ sessionType, secondsLeft }) {
  const accentColor = sessionColors[sessionType] || "#e63946";

  return (
    <div className="timer-wrapper">
      <div
        className="timer-circle"
        style={{ borderColor: accentColor }}
        role="timer"
        aria-live="off"
      >
        <span className="session-label" style={{ color: accentColor }}>
          {sessionType}
        </span>
        <span className="time-display">{formatTime(secondsLeft)}</span>
      </div>
    </div>
  );
}

export default Timer;