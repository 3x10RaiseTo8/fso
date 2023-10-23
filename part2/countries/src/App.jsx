import { useEffect, useState } from "react";
import countriesServices from "./services/countriesServices";

const SearchBar = ({ label, handleChange, value }) => {
  return (
    <div>
      {label}
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
};

const Country = ({ country }) => {
  const [weatherInfo, setWeatherInfo] = useState(null);
  // Get weather
  useEffect(() => {
    countriesServices
      .getWeather(country.capital)
      .then((r) => setWeatherInfo(r.data))
      .then(console.log("Retrieved Weather"))
      .catch((error) => console.error("Err loading weather effect:", error));
  }, []);

  return (
    <>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <div>Continent: {country.continents}</div>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <h3>Flag</h3>
      <img
        src={country.flags.svg}
        alt={country.name.common + "flag"}
        style={{ width: "200px" }}
      />
      {weatherInfo && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <div>
            Temperature: {(weatherInfo.main.temp - 273.15).toFixed(2)} degree
            celsius
          </div>
          <img
            src={countriesServices.getWeatherIconSrc(
              weatherInfo.weather[0].icon
            )}
            alt={weatherInfo.weather[0].description}
          />
          <div>{weatherInfo.weather[0].description}</div>
          <div>Wind: {weatherInfo.wind.speed} m/s</div>
        </div>
      )}
    </>
  );
};

const SearchResult = ({ countries, filter, handleShow }) => {
  // Filter logic
  const lowerCaseFilter = filter.toLowerCase();
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(lowerCaseFilter)
  );

  if (filteredCountries.length > 10 && lowerCaseFilter) {
    return <div>Too many matches. Specify another Filter</div>;
  } else if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  } else if (lowerCaseFilter)
    return (
      <div>
        {filteredCountries.map((country) => (
          <div key={country.name.common}>
            {country.name.common}{" "}
            <button onClick={() => handleShow(country.name.common)}>
              Show
            </button>
          </div>
        ))}
      </div>
    );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");

  const handleFilterChange = (event) => setNewFilter(event.target.value);

  const handleShow = (country) => setNewFilter(country);

  useEffect(() => {
    countriesServices
      .getAllCountries()
      .then((response) => setCountries(() => response.data))
      .then(console.log("Retrieved countries"));
  }, []);

  return (
    <>
      <SearchBar
        label="Find Countries"
        value={newFilter}
        handleChange={handleFilterChange}
      />
      <SearchResult
        countries={countries}
        filter={newFilter}
        handleShow={handleShow}
      />
    </>
  );
};

export default App;
