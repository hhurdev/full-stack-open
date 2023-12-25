/* eslint-disable react/prop-types */
const CountriesList = ({filteredCountries, handleClick}) => {
  return (
    <>
        <div>
            {filteredCountries.map((country) => (
              <div key={country.countryCode}>
                {country.name}
              <button type="button" onClick={() => handleClick(country)}>Show</button>
              </div>
            ))}
        </div>
    </>
  );
};

export default CountriesList;




