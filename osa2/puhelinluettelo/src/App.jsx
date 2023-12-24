import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import AddPersonForm from './components/AddPersonForm'
import Numbers from './components/Numbers'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
      .then(people => {
        setPersons(people)
      })
      .catch(error => {
        console.log('Problem with retrieving notes');
      })
  }, [])
  
  // still case sensitive filtering
  const filteredPeople = persons.filter((person) => person.name.includes(filter))

  const personExists = () => {
    const people = persons.map(person => person.name)
    const match = people.find((person) => person === newName)
    return match !== undefined
  }

  const updatePersonData = (newPerson) => {
    if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)){
      const id = persons.find(person => person.name === newName).id

      phonebookService.update(id, newPerson)
      .then((returnedPerson) => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const validateInput = (newPerson) => {
    if (!newName) {
      alert('Please add a name')
      return false;
    }

    if (!newNumber) {
      alert('Please add a phone number')
      return false;
    }
  
    if (personExists()) {
      updatePersonData(newPerson)
      return false;
    }
  
    return true;
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = { name: newName, number: newNumber }

    if (!validateInput(newPerson)) {
      return;
    }

    phonebookService.create(newPerson)
      .then((person) => {
        setPersons(persons.concat(person))
        setNewName('')
        setNewNumber('')
    }).catch(error => {
      console.log('Problem with creating new person');
    })
  }

  const removePerson = (id) => {
    phonebookService.remove(id)
      .then((deletedPerson) => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange}/>
      <AddPersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <Numbers filteredPeople={filteredPeople} remove={removePerson}/>
    </>
  )

}

export default App