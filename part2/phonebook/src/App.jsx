import { useState, useEffect } from 'react'
import Filter from '../components/Filter'
import PersonForm from '../components/PersonForm'
import Persons from '../components/Persons'
import personsServices from '../services/persons'
import Notification from '../components/Notification';
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setfilterName] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  const showMessage = (text, type = 'success') => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 5000)
  }


  useEffect(() => {
    console.log('effect')
    personsServices
      .getAll()
      .then(p => setPersons(p))
      .catch(error => {
        console.error('Failed:', error)
        showMessage('Failed to load data', 'error')
      })
  }, [])

  const addNew = (event) => {
    event.preventDefault()

    if (newName === '' || newNumber === '') 
      return

    const findperson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if (findperson) {
      const reperson = window.confirm(
        `${findperson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (!reperson) 
        return

      const updatedinfo = { ...findperson, number: newNumber}
      personsServices
        .update(findperson.id, updatedinfo)
        .then(updated => {
          setPersons(updatep => updatep.map(p => (p.id === findperson.id ? updated : p)))
          setNewName('')
          setNewNumber('')
          showMessage(`Updated ${updated.name}`, 'success')
        })
        .catch(error => {
          console.error(error)

          if (error.response && error.response.data && error.response.data.error) {
            showMessage(error.response.data.error, 'error')
            return 
          }

          showMessage(
            `Information of ${findperson.name} has already been removed from server`,
            'error'
          )
          setPersons(updatep => updatep.filter(p => p.id !== findperson.id))
        })
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personsServices
      .create(newPerson)
      .then(newp => {
        setPersons(persons.concat(newp))
        setNewName('')
        setNewNumber('')
        showMessage(`Added ${newp.name}`, 'success')
      })
      .catch(error => {
        console.error(error)
        
        if (error.response && error.response.data && error.response.data.error) {
          showMessage(error.response.data.error, 'error')
        } else {
          showMessage('Failed to add', 'error')
        }
      })
  }

  const deletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return
    personsServices
      .remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
      })
      .catch(error => {
        console.error(error)
        
        showMessage(
          `Information of ${name} has already been removed from server`,
          'error'
        )
        setPersons(prev => prev.filter(p => p.id !== id))
      })
  }

  let personList
  const filter = filterName.toLowerCase()
  if (!filter) {
    personList = persons
  } else {
    personList = persons.filter(p => p.name.toLowerCase().includes(filter))
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type={messageType} />

      <Filter value={filterName} onChange={event => setfilterName(event.target.value)} />

      <h3>add a new</h3>
      <PersonForm
        onSubmit={addNew}
        newName={newName}
        onNameChange={
          event => setNewName(event.target.value)
        }
        newNumber={newNumber}
        onNumberChange={
          event => setNewNumber(event.target.value)
        }
      />

      <h3>Numbers</h3>
      <Persons persons={personList} onDelete={deletePerson}  />
    </div>
  )
}

export default App
