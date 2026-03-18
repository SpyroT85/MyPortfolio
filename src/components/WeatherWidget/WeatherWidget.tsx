import { useState, useEffect, useCallback } from "react";
import humidityIcon from "../../assets/weather-icons/wi-humidity.svg";
import windIcon from "../../assets/weather-icons/wi-strong-wind.svg";
import thermometerIcon from "../../assets/weather-icons/wi-thermometer.svg";
import "./WeatherWidget.css";

interface WeatherData {
  name: string;
  sys: { country: string };
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface ForecastDay {
  date: string;
  temp_min: number;
  temp_max: number;
  icon: string;
  description: string;
}

interface WeatherWidgetProps {
  mobileHomescreen?: boolean; // when true, renders as mobile style homescreen widget
}

const WeatherWidget = ({ mobileHomescreen = false }: WeatherWidgetProps) => {
  const [city, setCity] = useState("Athens");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (!mobileHomescreen) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [mobileHomescreen]);

  const fetchForecast = async (cityName: string) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=en`
    );
    const data = await res.json();
    const daily: Record<string, any> = {};
    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date] && item.dt_txt.includes("12:00:00")) { 
        daily[date] = {
          date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        };
      }
    });
    setForecast(Object.values(daily).slice(0, 7));
  };

  const fetchWeather = useCallback(async (cityOverride?: string) => {
    const targetCity = cityOverride ?? city;
    if (!targetCity) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${targetCity}&appid=${API_KEY}&units=metric&lang=en`
      );
      if (!res.ok) throw new Error("City not found!");
      const data = await res.json();
      setWeather(data);
      await fetchForecast(targetCity);
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [city, API_KEY]);

  const fetchSuggestions = async (value: string) => {
    if (value.length < 2) { setSuggestions([]); return; }
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${API_KEY}`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  useEffect(() => { fetchWeather(); }, []);

  const getWeatherIcon = (icon: string) => {
    const code = icon.slice(0, 2);
    const isDay = icon.endsWith("d");
    const iconMap: Record<string, string> = {
      "01": isDay ? "wi-day-sunny" : "wi-night-clear",
      "02": isDay ? "wi-day-cloudy" : "wi-night-cloudy",
      "03": "wi-cloud",
      "04": "wi-cloudy",
      "09": "wi-showers",
      "10": isDay ? "wi-day-rain" : "wi-night-rain",
      "11": "wi-thunderstorm",
      "13": "wi-snow",
      "50": "wi-fog",
    };
    const iconName = iconMap[code] ?? "wi-day-sunny";
    return new URL(`../../assets/weather-icons/${iconName}.svg`, import.meta.url).href;
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const formatDay = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" });

  // Homescreen Mobile Widget
  if (mobileHomescreen) {
    return (
      <div className="hs-widget-wrap">
        <div className="hs-widget">
          {/* Refresh button */}
          <button className="hs-refresh" onClick={() => fetchWeather()} title="Refresh">
            ↻
          </button>

          {/* Left: clock + date + location */}
          <div className="hs-left">
            <div className="hs-time">{formatTime(now)}</div>
            <div className="hs-date-loc">
              {formatDay(now)}
              {weather && <span className="hs-loc"> | {weather.name}</span>}
            </div>
          </div>

          {/* Right: icon + temp + range only */}
          {weather && (
            <div className="hs-right">
              <div className="hs-right-col">
                <span className="hs-feels">Feels like: {Math.round(weather.main.feels_like)}°</span>
                <div className="hs-bottom-row">
                  <img src={getWeatherIcon(weather.weather[0].icon)} alt="weather" className="hs-icon" />
                  <div className="hs-temps">
                    <span className="hs-temp">{Math.round(weather.main.temp)}°</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading && <div className="hs-right"><span className="hs-loading">···</span></div>}
        </div>
      </div>
    );
  }

  // Desktop Widget
  return (
    <div className="weather-app">
      <h2>🌤 Weather</h2>

      <div className="weather-search">
        <div className="search-row">
          <input
            type="text"
            placeholder="City..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button onClick={() => fetchWeather()}>Search</button>
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li key={i} onClick={async () => {
                setCity(s.name);
                setSuggestions([]);
                await fetchWeather(s.name);
              }}>
                {s.name}, {s.country} {s.state ? `- ${s.state}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="weather-loading">Loading...</p>}
      {error && <p className="weather-error">{error}</p>}

      {weather && (
         <div className="weather-info">
           <h3>{weather.name}, {weather.sys.country}</h3>
           <div className="weather-temp-row">
             <p className="weather-temp">{Math.round(weather.main.temp)}°C</p>
             <img src={getWeatherIcon(weather.weather[0].icon)} alt="weather icon" className="weather-icon" />
           </div>
           <p className="weather-desc">{weather.weather[0].description}</p>
           <div className="weather-details">
             <span>
               <img src={humidityIcon} alt="humidity" className="weather-icon-small" />
               {weather.main.humidity}%
             </span>
             <span>
               <img src={windIcon} alt="wind" className="weather-icon-small" />
               {weather.wind.speed} m/s
             </span>
             <span>
               <img src={thermometerIcon} alt="feels like" className="weather-icon-small" />
               Feels like {Math.round(weather.main.feels_like)}°C
             </span>
           </div>
         </div>
      )}
      {forecast.length > 0 && (
        <div className="forecast">
          {forecast.map((day) => (
            <div key={day.date} className="forecast-day">
              <span className="forecast-date">
                {new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
              </span>
              <img src={getWeatherIcon(day.icon)} alt="icon" className="weather-icon-small" />
              <span className="forecast-temp">{Math.round(day.temp_max)}°</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;