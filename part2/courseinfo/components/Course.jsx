const Header = (props) => <h2>{props.name}</h2>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map((p) => (
      <Part key={p.id} part={p} />
    ))}
  </div>
)

const Total = (props) => {
  const total = props.parts.reduce((n, p) => n + p.exercises, 0)
  return (
    <p>
    <strong>total of {total} exercises</strong>
    </p>
  )
}

const Course = (props) => (
  <div>
    <Header name={props.course.name} />
    <Content parts={props.course.parts} />
    <Total parts={props.course.parts} />
  </div>
)

export default Course
