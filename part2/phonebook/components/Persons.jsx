import Person from './Person'

const Persons = (props) => {
  return (
    <div>
      {props.persons.map(p => (
        <li key={p.id}>
          {p.name} {p.number}{' '}
          <button onClick={() => props.onDelete(p.id, p.name)}>delete</button>
        </li>
      ))}
    </div>
  )
}

export default Persons
