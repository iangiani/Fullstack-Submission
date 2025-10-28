const Countries = (props) => {
  return (
    <div>
      {props.list.map(c => (
        <div key={c.name.common}>
          {c.name.common}{' '}
          <button onClick={() => props.onShow(c)}>Show</button>
        </div>
      ))}
    </div>
  )
}
export default Countries
