import { useState } from 'react'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const l = anecdotes.length
  const votesarray = Array(l).fill(0)
  const [votes, setVotes] = useState(votesarray)
  const nextanecdote = () => {
    let random
    do { 
      random = Math.floor(Math.random() * l) 
    } 
    while (random === selected)
    setSelected(random)
  }
  const vote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }
  const most = Math.max(...votes)
  const mostanecdote = anecdotes[votes.indexOf(most)]
  let content
  if (most === 0) {
    content = <div>There has been no voting yet</div>
  } else {
    content = (
      <div>
        <div>{mostanecdote}</div>
        <div>has {most} votes</div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px' }}>Anecdote of the day</h1>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <Button onClick={vote} text="vote" />
      <Button onClick={nextanecdote} text="next anecdote" />

      <h2 style={{ fontSize: '32px' }}>Anecdote with most votes</h2>
      {content}
    </div>
  )
}

export default App
