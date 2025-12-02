import { useEffect, useState } from 'react'
import axios from 'axios'

export const useCountry = (countryName) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!countryName) {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        setCountry({
          found: true,
          data: response.data[0] || response.data
        })
      } catch (error) {
        setCountry({ found: false })
      }
    }

    fetchCountry()
  }, [countryName])

  return country
}