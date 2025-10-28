import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Countries from '../components/Countries'
import CountryData from '../components/CountryData'

const App = () => {
  const [countries, setCountries] = useState([])  
  const [query, setQuery] = useState('') 
  const [show, setShow] = useState(null) 

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(({ data }) => setCountries(data))
      .catch(console.error)
  }, [])

  const findcoutries = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) 
      return []
    return countries.filter(counrty =>
      counrty.name.common.toLowerCase().includes(q)
    )
  }, [countries, query])

  useEffect(() => {
    setShow(null)
  }, [query])

  let info = null
  if (query) {
    if (findcoutries.length > 10) {
      info = <p>Too many matches, specify another filter</p>
    } else if (findcoutries.length === 1) {
      info = <CountryData country={findcoutries[0]} />
    } else if (show) {
      info = <CountryData country={show} />
    } else {
      info = <Countries list={findcoutries} onShow={setShow} />
    }
  }

  return (
    <div>
      <div>
        find countries <input value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {info}
    </div>
  )
}

export default App
