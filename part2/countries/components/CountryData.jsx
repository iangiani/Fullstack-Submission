import Weather from './Weather'

const CountryData = (props) => {
  const name = props.country.name.common
  const capital = props.country.capital
    ? props.country.capital[0]
    : 'NONE'
  const area = props.country.area
  let languages = []
  if (props.country.languages) {
    languages = Object.values(props.country.languages)
  }
  const flag = props.country.flags?.png
  const coords = props.country.capitalInfo?.latlng

  return (
    <div>
      <h1>{name}</h1>
      <p>Capital {capital}</p>
      <p>Area {area}</p>

      <h2>Languages</h2>
      <ul>
        {languages.map(l => <li key={l}>{l}</li>)}
      </ul>

      {flag ? <img src={flag} alt={`${name} flag`} /> : null}

      {coords && capital ? <Weather capital={capital} coords={coords} /> : null}

    </div>
  )
}
export default CountryData
