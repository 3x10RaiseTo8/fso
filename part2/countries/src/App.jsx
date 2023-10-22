import { useEffect, useState } from "react";
import getAllCountries from "./services/countriesServices";

const SearchBar = ({ label, handleChange, value }) => {
  return (
    <div>
      {label}
      <input type="text" value={value} onChange={handleChange} />
    </div>
  );
};

const Country = ({ country }) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <p>Continent: {country.continents}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <h3>Map</h3>
      <img
        src={country.flags.svg}
        alt={country.name.common + "flag"}
        style={{ width: "200px" }}
      />
    </>
  );
};

const SearchResult = ({ countries, filter }) => {
  // Filter logic
  const lowerCaseFilter = filter.toLowerCase();
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(lowerCaseFilter)
  );
  console.log(filteredCountries[0]);

  if (filteredCountries.length > 10 && lowerCaseFilter) {
    return <div>Too many matches. Specify another Filter</div>;
  } else if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  } else if (lowerCaseFilter)
    return (
      <div>
        {filteredCountries.map((country) => (
          <div key={country.name.common}>{country.name.common}</div>
        ))}
      </div>
    );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newFilter, setNewFilter] = useState("");

  const handleFilterChange = (event) => setNewFilter(event.target.value);

  useEffect(() => {
    getAllCountries().then((response) => {
      setCountries(() => response.data);
    });
    console.log("Effect success", countries);
  }, []);

  return (
    <>
      <SearchBar
        label="Find Countries"
        value={newFilter}
        handleChange={handleFilterChange}
      />
      <SearchResult countries={countries} filter={newFilter} />
    </>
  );
};

export default App;
