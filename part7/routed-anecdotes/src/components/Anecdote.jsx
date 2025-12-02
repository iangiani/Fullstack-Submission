import { useParams } from 'react-router-dom'

const Anecdote = ({ anecdoteById }) => {
  const { id } = useParams()
  const anecdote = anecdoteById(id)

  if (!anecdote) 
    return <div>anecdote not found</div>

  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>
        for more info see <a href="#">https://martinfowler.com/bliki/FrequencyReducesDifficulty.html</a>
      </p>
    </div>
  )
}

export default Anecdote