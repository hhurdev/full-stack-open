/* eslint-disable react/prop-types */
import  { useState, useEffect }  from 'react';
import weatherService from '../services/weatherService';

const Weather = ({ country }) => {
  const [weather, setWeather] = useState([]);
  const [iconUrl, setIconUrl] = useState('');

  useEffect(() => {
    weatherService.getWeather(country)
    .then(response => {
      setWeather(response)
      setIconUrl(`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

console.log("weather ", weather)
  
  return (
    <>
     <h2>Weather in {country.name}</h2>
     {weather.main && (
    <>
      <p><b>Temperature:</b> {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt="Weather icon" />
      <p><b>Wind:</b> {weather.wind.speed} m/s</p>
    </>
  )}
    </>
  )
};

export default Weather;