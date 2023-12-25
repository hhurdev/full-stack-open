const apiKey = import.meta.env.VITE_APP_API_KEY;
import axios from 'axios'

const getWeather = async (country) => {
  const coordinates = await getCoordinates(country);
  const { lat, lon } = coordinates;
  const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  return request.then(response => response.data);
}

const getCoordinates = (country) => {
  const request = axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${country.capital}&limit=5&appid=${apiKey}`);
  return request.then(response => {
    const data = response.data[0];
    return { lat: data.lat, lon: data.lon };
  }).catch(error => {
    console.log("failed to get coordinates", error)
  })
}
  
export default { getWeather }