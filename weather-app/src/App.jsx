import { useState } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  // Nome do local exibido na tela (ex: "São Paulo, Brazil")
  const [locationName, setLocationName] = useState("");

  // Dados brutos retornados pela Forecast API
  const [weatherData, setWeatherData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchWeather(query) {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Converte o nome digitado em coordenadas
      const geoResponse = await fetch(
        `${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=1&language=pt`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Local não encontrado. Tente outro nome.");
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setLocationName(`${name}, ${country}`);

      // 2. Busca o clima, incluindo o dia anterior (past_days=1)
      // e o dia seguinte, para termos as janelas de 24h antes/depois.
      const forecastResponse = await fetch(
        `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
          `&hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m` +
          `&past_days=1&forecast_days=2&timezone=auto`
      );
      const forecastData = await forecastResponse.json();

      setWeatherData(forecastData);
    } catch (err) {
      setError(err.message || "Não foi possível buscar o clima.");
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(query) {
    if (query.trim() === "") return;
    fetchWeather(query.trim());
  }

  function handleRefresh() {
    if (locationName) {
      fetchWeather(locationName.split(",")[0]);
    }
  }

  return (
    <div className="app">
      <h1>Weather App</h1>

      <SearchBar onSearch={handleSearch} />

      {isLoading && <p className="status-message">Loading...</p>}
      {error && <p className="status-message error">{error}</p>}

      {weatherData && !isLoading && (
        <>
          <CurrentWeather
            locationName={locationName}
            weatherData={weatherData}
            onRefresh={handleRefresh}
          />
          <HourlyForecast weatherData={weatherData} />
        </>
      )}
    </div>
  );
}

export default App;