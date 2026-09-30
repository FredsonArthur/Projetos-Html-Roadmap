import "./CurrentWeather.css";

// Mapeia os "weathercode" da Open-Meteo para uma descrição legível e um emoji.
// Referência: https://open-meteo.com/en/docs (WMO Weather interpretation codes)
function getWeatherInfo(code) {
  const map = {
    0: { label: "Clear sky", icon: "☀️" },
    1: { label: "Mainly clear", icon: "🌤️" },
    2: { label: "Partly cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Fog", icon: "🌫️" },
    48: { label: "Fog", icon: "🌫️" },
    51: { label: "Light drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Dense drizzle", icon: "🌧️" },
    61: { label: "Slight rain", icon: "🌦️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy rain", icon: "🌧️" },
    71: { label: "Slight snow", icon: "🌨️" },
    73: { label: "Snow", icon: "❄️" },
    75: { label: "Heavy snow", icon: "❄️" },
    80: { label: "Rain showers", icon: "🌦️" },
    81: { label: "Rain showers", icon: "🌧️" },
    82: { label: "Violent showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm with hail", icon: "⛈️" },
    99: { label: "Thunderstorm with hail", icon: "⛈️" },
  };

  return map[code] || { label: "Unknown", icon: "❔" };
}

// Encontra o índice do array "hourly" mais próximo da hora atual.
function findCurrentHourIndex(hourlyTimes) {
  const now = new Date();

  let closestIndex = 0;
  let smallestDiff = Infinity;

  hourlyTimes.forEach((isoTime, index) => {
    const diff = Math.abs(new Date(isoTime).getTime() - now.getTime());
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex;
}

function CurrentWeather({ locationName, weatherData, onRefresh }) {
  const { hourly } = weatherData;
  const currentIndex = findCurrentHourIndex(hourly.time);

  const temperature = hourly.temperature_2m[currentIndex];
  const windSpeed = hourly.windspeed_10m[currentIndex];
  const rainChance = hourly.precipitation_probability[currentIndex];
  const weatherInfo = getWeatherInfo(hourly.weathercode[currentIndex]);

  return (
    <div className="current-weather">
      <div className="current-header">
        <h2>{locationName}</h2>
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          aria-label="Refresh weather"
        >
          ⟳ Refresh
        </button>
      </div>

      <div className="current-main">
        <span className="weather-icon">{weatherInfo.icon}</span>
        <span className="temperature">{Math.round(temperature)}°C</span>
      </div>

      <p className="weather-label">{weatherInfo.label}</p>

      <div className="current-details">
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{Math.round(windSpeed)} km/h</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Rain chance</span>
          <span className="detail-value">{rainChance}%</span>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;