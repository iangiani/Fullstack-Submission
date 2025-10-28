import { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = (props) => {
  const [latitude, longitude] = props.coords
  const [data, setData] = useState(null)
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    if (!apiKey) 
        return
    axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat: latitude, lon: longitude, units: 'metric', appid: apiKey }
    })
    .then(d => setData(d.data))
    .catch(error => {
      console.error('Failed:', error)
      setData(null)
    })
  }, [latitude, longitude, apiKey])

  if (!apiKey) {
    return 
  }

  if (!data) 
    return 

  const temp = data.main.temp
  const icon = data && data.weather && data.weather.length 
    ? data.weather[0].icon 
    : 'NONE'
  const iconUrl = icon 
    ? 'https://openweathermap.org/img/wn/' + icon + '@2x.png' 
    : null
  const wind = data && data.wind 
    ? data.wind.speed 
    : 'NONE'

  return (
    <div>
      <h2>Weather in {props.capital}</h2>
      <p>Temperature {temp} Celsius</p>
      {iconUrl && <img src={iconUrl} alt="weather icon" />}
      <p>Wind {wind} m/s</p>
    </div>
  )
}

export default Weather
