import axios from "axios";

// const baseUrl = "http://localhost:3001";

const appid = import.meta.env.VITE_SOME_KEY;
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${appid}`;
const weatherIconUrl = "https://openweathermap.org/img/wn";

const getAllCountries = () => axios.get(`${baseUrl}/all`);

const getWeather = (city) => axios.get(`${weatherUrl}&q=${city}`);

const getWeatherIconSrc = (code) => `${weatherIconUrl}/${code}@2x.png`;

export default { getAllCountries, getWeather, getWeatherIconSrc };
