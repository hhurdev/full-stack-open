/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import countryService from './services/countriesService'
import CountriesList from './components/CountriesList';
import OneCountry from './components/OneCountry';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState([]);

  const filteredCountries = countries.filter((country) => 
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => { 
    countryService.getAll()
    .then(response => {
      const newCountries = response.map(country => ({
        name: country.name.common,
        area : country.area, 
        capital: country.capital, //array
        languages: country.languages, //object
        flag: country.flags,
        countryCode: country.cca2 //object
      }))
      setCountries(newCountries)
    })
  }, []);
    
  
  // Function to handle the search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle the form submission (fetch countries)
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    
  };

  const lessThanTen = () => {
    return filteredCountries.length > 1 && filteredCountries.length <= 10;
  }
   
  const tooManyCountries = () => {
    return filteredCountries.length > 10
  }

  const showSpecificCountry = (country) => {
    setSearchTerm(country.name);
  }

  // Basic layout structure
  return (
    <div>
        <label>
          Find countries: 
          <input type="text" value={searchTerm} onChange={handleSearchChange} />
        </label>

        {lessThanTen() && (
          <CountriesList filteredCountries={filteredCountries} handleClick={showSpecificCountry} />
        )}

        {tooManyCountries() && (
          <div>
            <p>Too many matches, specify another filter.</p>
          </div>
        )}

        {filteredCountries.length === 1 && (
          <OneCountry country={filteredCountries[0]} />
        )}

    </div>
  );
};

export default App;
