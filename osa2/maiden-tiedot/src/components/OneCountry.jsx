/* eslint-disable react/prop-types */
import Weather from "./Weather";

const OneCountry = ({ country }) => {
  const countryCopy = {
    ...country,
    languages: Object.values(country.languages),
    capital: country.capital[0] ? country.capital[0] : '',
    flag: country.flag.png,
  };

  return (
    <div>
      <h1>{countryCopy.name}</h1>
      <p><b>Capital:</b> {countryCopy.capital}</p>
      <p><b>Area:</b> {countryCopy.area || ''}</p>
      <h2><b>Languages</b></h2>
      <ul>
        {countryCopy.languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      {countryCopy.flag && (
        <img src={countryCopy.flag} alt="Flag" width="200" />
      )}
      <Weather country={countryCopy}/>
    </div>
  );
};

export default OneCountry;