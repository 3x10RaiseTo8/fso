import { useState, useEffect } from "react";
import personsServices from "./services/persons";

const TextBox = ({ label, value, handleChange }) => {
  return (
    <div>
      {label}: <input value={value} onChange={handleChange} />
    </div>
  );
};

const Filter = ({ value, handleChange }) => {
  return (
    <form>
      <TextBox
        label="Filter shown with"
        value={value}
        handleChange={handleChange}
      />
    </form>
  );
};

const PersonForm = ({
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
  handleAdd,
}) => {
  return (
    <form>
      <TextBox label="Name" value={newName} handleChange={handleNameChange} />
      <TextBox
        label="Number"
        value={newNumber}
        handleChange={handleNumberChange}
      />
      <div>
        <button type="submit" onClick={handleAdd}>
          Add
        </button>
      </div>
    </form>
  );
};

export const Person = ({ name, number, handleDelete }) => {
  return (
    <div>
      {name} {number}
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

const Persons = ({ persons, filter, handleDelete }) => {
  // Filter logic
  const lowerCaseFilter = filter.toLowerCase();
  const filteredPersons = persons.filter((person) => {
    return person.name.toLowerCase().includes(lowerCaseFilter);
  });

  return filteredPersons.map((person) => (
    <Person
      key={person.id}
      name={person.name}
      number={person.number}
      handleDelete={() => {
        handleDelete(person.id);
      }}
    />
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("Effect in place");
    personsServices.getAll().then((response) => {
      setPersons(response.data);
      console.log("Rendering");
    });
  }, []);

  const handleAdd = (event) => {
    event.preventDefault();
    const newObject = { name: newName, number: newNumber };

    // Is the new person same?
    const found = persons.find((p) => p.name === newName);

    // Add person
    if (found) {
      if (
        window.confirm(
          `${newName} already in phonebook. Replace old number with new one?`
        )
      ) {
        personsServices.updatePerson(found.id, newObject).then((response) => {
          setPersons(
            persons.map((p) => (found.id === p.id ? response.data : p))
          );
          setNewName("");
          setNewNumber("");
        });
      }
    } else {
      personsServices.createPerson(newObject).then((response) => {
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personsServices.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const handleFilterChange = (event) => setNewFilter(event.target.value);

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  return (
    <>
      <h2>Phonebook</h2>
      <Filter value={newFilter} handleChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAdd={handleAdd}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filter={newFilter}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default App;
