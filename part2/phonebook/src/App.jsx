import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import personService from './services/persons'

const Filter = ({ search, onSearchChange }) => (
  <div>
    filter shown with <input value={search} onChange={onSearchChange} />
  </div>
)

const PersonForm = ({ 
  addPerson, 
  newName, 
  onNameChange, 
  newNumber, 
  onNumberChange 
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={onNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onNumberChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({ person, removePerson }) => (
  <div>
    {person.name} {person.number}{' '} 
    <button type="button" onClick={() => removePerson(person)}>
      delete
    </button>
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      const updatedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
          setNotificationType('success')
          setNotification(`Updated ${returnedPerson.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
          setSearch('')
        })
        .catch(() => {
          setNotificationType('error')
          setNotification(`Information of ${existingPerson.name} has already been removed from server`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(entry => entry.id !== existingPerson.id))
        })
      return
    }
    const newPerson = { name: newName, number: newNumber }
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNotificationType('success')
        setNotification(`Added ${newPerson.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
        setSearch('')
      })
  }

  const removePerson = (person) => {
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }
    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter(entry => entry.id !== person.id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={notificationType} />
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        onNameChange={handleNameChange} 
        newNumber={newNumber} 
        onNumberChange={handleNumberChange} 
      />
      <h3>Numbers</h3>
      <div>
        {persons.filter(person =>
          person.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(person => 
            <Person 
              key={person.id} 
              person={person} 
              removePerson={removePerson}
            />
        )}
      </div>
    </div>
  )
}

export default App
