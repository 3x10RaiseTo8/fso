import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
// const baseUrl = "http://localhost:3001";

const getAllCountries = () => axios.get(`${baseUrl}/all`);

export default getAllCountries;
