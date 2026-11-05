import { useState } from 'react'

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

const Person = ({ person }) => <div>{person.name} {person.number}</div>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [search, setSearch] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already in the phonebook`)
      setNewName('')
      setNewNumber('')
      setSearch('')
      return
    }
    const Person = { name: newName, number: newNumber, id: String(persons.length + 1) }
    setPersons(persons.concat(Person))
    setNewName('')
    setNewNumber('')
    setSearch('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} onSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} onNameChange={handleNameChange} newNumber={newNumber} onNumberChange={handleNumberChange} />
      <h3>Numbers</h3>
      <div>
        {persons.filter(person =>
          person.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(person => 
            <Person key={person.id} person={person} />
        )}
      </div>
    </div>
  )
}

export default App
