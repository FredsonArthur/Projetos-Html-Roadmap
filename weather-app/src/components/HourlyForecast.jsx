import "./HourlyForecast.css";

// Mesmo mapeamento usado no CurrentWeather, só com o ícone (sem o texto completo,
// já que aqui o espaço de cada item é menor).
function getWeatherIcon(code) {
  const map = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌦️",
    63: "🌧️",
    65: "🌧️",
    71: "🌨️",
    73: "❄️",
    75: "❄️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };

  return map[code] || "❔";
}

function formatHour(isoTime) {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

function HourlyForecast({ weatherData }) {
  const { hourly } = weatherData;

  // hourly.time tem 48 horas no total: as 24 passadas (past_days=1)
  // seguidas pelas 24+ futuras (forecast_days=2). Dividimos os dois grupos aqui.
  const now = new Date();

  const pastHours = [];
  const futureHours = [];

  hourly.time.forEach((isoTime, index) => {
    const entry = {
      time: isoTime,
      temperature: hourly.temperature_2m[index],
      code: hourly.weathercode[index],
    };

    if (new Date(isoTime) < now) {
      pastHours.push(entry);
    } else {
      futureHours.push(entry);
    }
  });

  // Mantém só as últimas 24 horas passadas e as próximas 24 futuras
  const last24 = pastHours.slice(-24);
  const next24 = futureHours.slice(0, 24);

  function renderRow(hours) {
    return (
      <div className="hour-row">
        {hours.map((hour) => (
          <div className="hour-item" key={hour.time}>
            <span className="hour-time">{formatHour(hour.time)}</span>
            <span className="hour-icon">{getWeatherIcon(hour.code)}</span>
            <span className="hour-temp">{Math.round(hour.temperature)}°</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="hourly-forecast">
      <section>
        <h3>Last 24 hours</h3>
        {renderRow(last24)}
      </section>

      <section>
        <h3>Next 24 hours</h3>
        {renderRow(next24)}
      </section>
    </div>
  );
}

export default HourlyForecast;