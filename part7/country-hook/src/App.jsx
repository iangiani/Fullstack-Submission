import React, { useState } from 'react'
import { useCountry } from './hooks/useCountry'
import { useField } from './hooks/useField'

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      {country === null ? null : country.found ? (
        <div>
          <h2>{country.data.name.common}</h2>
          <div>capital {country.data.capital[0]}</div>
          <div>population {country.data.population}</div>
          <img src={country.data.flags.png} height="100" alt={`flag of ${country.data.name.common}`}/>
        </div>
      ) : (
        <div>not found...</div>
      )}
    </div>
  )
}

export default App