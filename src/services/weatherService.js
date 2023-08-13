import { DateTime } from "luxon";

const API_KEY = "d7ca5b08a6db8fe2274af402306cb2a0"

const BASE_URL = "https://api.openweathermap.org/data/2.5";

// https://api.openweathermap.org/data/2.5/onecall?lat=48.8534&lon=2.3488&exclude=current,minutely,hourly,alerts&appid=1fa9ff4126d95b8db54f3897a208e91c&units=metric

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(BASE_URL + "/" + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  console.log(data)
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity,pressure    },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    pressure,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};

const formatForecastWeather = (data) => {
    const { list, city } = data;
    const daily = list.filter((d, i) => {
        return (i % 8 === 0 || i === 0)
    }).map((d) => {
      return {
        day: formatToLocalTime(d.dt, city.timezone, "ccc"),
        temp: d.main.temp,
        icon: d.weather[0].icon,
      };
    })
    
    const hourly = list.slice(1, 7).map((d) => {
        return {
            time: formatToLocalTime(d.dt, city.timezone, "hh:mm a"),
            temp: d.main.temp,
            icon: d.weather[0].icon,
        };
    });

 
  
    return { timezone: city.timezone, daily, hourly };
  };
  

const getFormattedWeatherData = async (searchParams) => {
  const formattedCurrentWeather = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = formattedCurrentWeather;

  const formattedForecastWeather = await getWeatherData("forecast", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);

  return { ...formattedCurrentWeather, ...formattedForecastWeather };
};

const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;

export { formatToLocalTime, 
    iconUrlFromCode
 };