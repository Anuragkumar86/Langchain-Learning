import axios from "axios";

export async function getWeather(city: string) {
  const url = `https://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`;
  const res = await axios.get(url);
  return res.data;
}